import axios from 'axios';
import { VNDB_API_URL } from '../../../constants';
import {
	UListLables,
	UlistLablesResponse,
	VNCharDetailResponse,
	VNCharParams,
	VNCharResponse,
	VNDBStats,
	VNFilterState,
	VNListResponse,
	VNParams,
	VNReleaseParams,
	VNReleasesResponse,
	VNReleasesParams,
	VNResponse,
	VNSortOptions,
	VNUserListResponse,
} from '../types';
import {
	EXPLORE_VN_FIELDS,
	VN_CHAR_FIELDS,
	VN_DETAIL_FIELDS,
	VN_RELEASES_FIELDS,
	VN_RELEASE_FIELDS,
	VN_USER_LIST_FIELDS,
} from '../constants';
import { getDatetoReleasedString } from '../../../utils/time';
import { useSettingsStore, useUserAuthStore } from '../../../store/store';
import {
	extractReleaseCovers,
	extractUserDetails,
	extractVNLinks,
	extractVNQuotes,
} from '../../../utils/text';
import { formatRequest } from '../format';
import { LanguageEnum, VNLablesEnum } from '../schema';
import _ from 'lodash';

export const VNClient = axios.create({ baseURL: VNDB_API_URL });

export const fetchVNs = async (type: 'storefront' | 'new' | 'popular' | 'top') => {
	const allowEro = useSettingsStore.getState().allowEro;
	const isOwnedPlatformsOnly = useSettingsStore.getState().isOwnedPlatformsOnly;
	const ownedPlatforms = useSettingsStore.getState().ownedPlatforms;
	const preferredStorefront = useSettingsStore.getState().preferredStorefront;

	const params: VNParams = {
		fields: EXPLORE_VN_FIELDS,
		page: 1,
		results: 46,
		reverse: true,
		sort: 'released',
		filters: ['and'],
	};
	switch (type) {
		case 'new':
			const today = getDatetoReleasedString(new Date());
			params.sort = 'released';
			params.filters?.push(['released', '<=', today]);
			params.filters?.push(['released', '!=', 'tba']);
			break;
		case 'storefront':
			params.sort = 'released';
			preferredStorefront &&
				params.filters?.push([
					'release',
					'=',
					[
						'and',
						['extlink', '=', preferredStorefront.trim()],
						['released', '!=', 'tba'],
					],
				]);
			break;
		case 'popular':
			params.sort = 'votecount';
			break;
		case 'top':
			params.sort = 'rating';
			break;
	}
	if (!allowEro) {
		params.filters?.push(['release', '=', ['and', ['has_ero', '!=', 1]]]);
	}
	if (isOwnedPlatformsOnly && type !== 'storefront') {
		const plats: (string | any[])[] = ['or'];
		for (const platform of ownedPlatforms) {
			plats.push(['platform', '=', platform]);
		}
		params.filters?.push(plats);
	}
	if ((params.filters ?? []).length < 2) {
		delete params.filters;
	}
	const { data, status } = await VNClient.post<VNListResponse>('/vn', params);
	return data;
};

export const fetchVNDBStats = async () => {
	const { data, status } = await VNClient.get<VNDBStats>('/stats');
	return data;
};

export const fetchVN = async (id: string) => {
	const params: VNParams = {
		filters: ['id', '=', id],
		sort: 'id',
		page: 1,
		results: 1,
		reverse: false,
		fields: VN_DETAIL_FIELDS,
	};
	const { data, status } = await VNClient.post<VNResponse>('/vn', params);
	return data.results[0];
};

export const fetchVNCharacters = async (vnid: string) => {
	const params: VNCharParams = {
		filters: ['vn', '=', ['id', '=', vnid]],
		// sort: 'searchrank',
		results: 50,
		fields: 'id, name, original, image.url, image.dims, birthday',
	};
	const { data, status } = await VNClient.post<VNCharResponse>('/character', params);
	return data;
};

export const fetchVNCharacterDetail = async (id: string) => {
	const params: VNCharParams = {
		filters: ['id', '=', id],
		results: 1,
		fields: VN_CHAR_FIELDS,
	};
	const { data, status } = await VNClient.post<VNCharDetailResponse>('/character', params);
	return data;
};

export const fetchVNReleases = async (
	id: string,
	searchAll?: boolean,
	olang?: keyof typeof LanguageEnum,
): Promise<VNReleasesResponse | null> => {
	const params: VNReleasesParams = {
		filters: ['vn', '=', ['and', ['id', '=', id]]],
		results: 100,
		reverse: true,
		sort: 'released',
		fields: VN_RELEASES_FIELDS,
	};
	if (olang) {
		const langs = [['lang', '=', olang]];
		if (olang !== 'en') {
			langs.push(['lang', '=', 'en']);
		}
		// params.filters[2].push(['or', ['lang', '=', 'en'], ['lang', '=', olang]]);
		params.filters = ['and', ['or', ...langs], ['vn', '=', ['and', ['id', '=', id]]]];
	}
	const { data, status } = await VNClient.post<VNReleasesResponse>('/release', params);
	if (searchAll && data && data.more) {
		const nextParams = { ...params, page: 2 };
		const newResults = await VNClient.post<VNReleasesResponse>('/release', nextParams);
		return {
			more: newResults.data.more,
			results: data.results.concat(newResults.data.results),
		};
	}
	return data;
};

export const fetchVNRelease = async (rId: string) => {
	const params: VNReleaseParams = {
		filters: ['id', '=', rId],
		results: 1,
		fields: VN_RELEASE_FIELDS,
	};
	const { data } = await VNClient.post<VNReleasesResponse>('/release', params);
	return data?.results[0] ?? null;
};

export const fetchVNQuotes = async (id: string) => {
	const url = `https://vndb.org/${id}/quotes#quotes`;
	const { data } = await axios.get<string>(url);
	if (!data) return;
	const article = data
		.split('<article>')
		[data.split('<article>').length - 1].split('</article>')[0];
	const entries = extractVNQuotes(article);
	return entries;
};

export const fetchVNSiteData = async (id: string) => {
	const url = `https://vndb.org/${id}`;
	const { data } = await axios.get<string>(url);
	const { shops } = extractVNLinks(data);
	const siteData = {
		shops: shops,
	};
	return siteData;
};

export const fetchRandomQuote = async () => {
	const { data } = await axios.get<string>('https://vndb.org/');
	const filter = /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/i;
	const matches = data.split('<footer>')[1].split('</footer>')[0].match(filter);
	if (matches?.length === 3) {
		const id = matches[1].replace('/v', '');
		const quote = matches[2].replaceAll('&quot;', '"');
		return {
			id: parseInt(id),
			quote: quote,
		};
	}
	return { id: 0, quote: '' };
};

export const fetchReleaseCovers = async (id: string) => {
	const url = `https://vndb.org/${id}/cv#cv`;
	const { data } = await axios.get<string>(url);
	const results = extractReleaseCovers(data);
	return results;
};

export const fetchUserDetails = async (userID: string) => {
	const { data } = await axios.get<string>(`https://vndb.org/${userID}`);
	const userDetails = extractUserDetails(data);
	return userDetails;
};

export const searchVNs = async (
	page: number,
	sort: VNSortOptions,
	reverse: boolean,
	filter: VNFilterState,
) => {
	const params: VNParams = formatRequest(page, sort, reverse, filter);
	const { data, status } = await VNClient.post<VNListResponse>('/vn', params);
	console.log('Searched!');
	return data;
};

export const fetchUlistLables = async () => {
	const userID = useUserAuthStore.getState().vndb.userID;
	if (userID) {
		const { data } = await VNClient.get<UlistLablesResponse>('/ulist_labels', {
			params: { user: userID, fields: 'count' },
		});
		return data;
	} else {
		return null;
	}
};

export const fetchVNUserList = async (type: UListLables, sort: string, page: number = 1) => {
	const userID = useUserAuthStore.getState().vndb.userID;
	if (userID) {
		const params = {
			user: userID,
			// user: 'u2',
			fields: VN_USER_LIST_FIELDS,
			filters: ['label', '=', VNLablesEnum[type]],
			sort: sort,
			reverse: true,
			results: 100,
			page: page,
		};
		const { data } = await VNClient.post<VNUserListResponse>('/ulist', params);
		return data;
	} else {
		return null;
	}
};

export const fetchVNUserEntry = async (id: string) => {
	const userID = useUserAuthStore.getState().vndb.userID;
	if (userID) {
		const params = {
			user: userID,
			fields: VN_USER_LIST_FIELDS,
			filters: ['id', '=', id],
		};
		const { data, status, statusText } = await VNClient.post<VNUserListResponse>(
			`/ulist`,
			params,
		);
		return data.results[0] ?? null;
	} else {
		return null;
	}
};

export const fetchVNReleaseListEntry = async (rId: string) => {
	const userID = useUserAuthStore.getState().vndb.userID;
	if (userID) {
		const params = {
			user: userID,
			fields: VN_USER_LIST_FIELDS,
			filters: ['release', '=', ['id', '=', rId]],
		};
		const { data, status, statusText } = await VNClient.post<VNUserListResponse>(
			`/ulist`,
			params,
		);
		return data.results[0] ?? null;
	} else {
		return null;
	}
};

export const fetchRandomVN = async () => {
	const params = {
		sort: 'id',
		reverse: true,
		results: 1,
	};
	const { data } = await VNClient.post<VNListResponse>('/vn', params);
	if (data) {
		const highest_id = _.toNumber(data.results[0].id.replace('v', ''));
		const random_id = _.random(1, highest_id);
		return random_id;
	} else {
		return _.random(1, 51083);
	}
};
