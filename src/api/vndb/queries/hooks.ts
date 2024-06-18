import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
	fetchRandomQuote,
	fetchReleaseCovers,
	fetchUlistLables,
	fetchUserDetails,
	fetchVN,
	fetchVNCharacterDetail,
	fetchVNCharacters,
	fetchVNDBStats,
	fetchVNQuotes,
	fetchVNRelease,
	fetchVNReleaseListEntry,
	fetchVNReleases,
	fetchVNSiteData,
	fetchVNUserEntry,
	fetchVNUserList,
	fetchVNs,
	searchVNs,
} from './queries';
import { UListLables, VNFilterState, VNSortOptions } from '../types';
import { useSettingsStore, useUserAuthStore } from '@/store/store';
import { LanguageEnum } from '../schema';

export const useReleaseCovers = (id?: string) => {
	return useQuery({
		queryKey: ['release_covers', id],
		queryFn: () => fetchReleaseCovers(id as string),
		enabled: id ? true : false,
	});
};

export const useUserDetails = () => {
	const userID = useUserAuthStore.getState().vndb.userID;
	return useQuery({
		queryKey: ['user_details'],
		queryFn: () => fetchUserDetails(userID ?? ''),
		enabled: userID ? true : false,
	});
};

export const useRandomQuote = () =>
	useQuery({ queryKey: ['random_quote'], queryFn: () => fetchRandomQuote() });

export const useVNQuotes = (id: string) =>
	useQuery({
		queryKey: ['vn_quotes', id],
		queryFn: () => fetchVNQuotes(id),
		enabled: id ? true : false,
	});

export const useVNSiteData = (id: string) =>
	useQuery({
		queryKey: ['vn_site_data', id],
		queryFn: () => fetchVNSiteData(id),
		enabled: id ? true : false,
	});

export const useVNDBStats = () =>
	useQuery({
		queryKey: ['vndb_stats'],
		queryFn: () => fetchVNDBStats(),
	});

export const useNewVNs = () => {
	const { isOwnedPlatformsOnly } = useSettingsStore();

	return useQuery({
		queryKey: ['vns_new', isOwnedPlatformsOnly],
		queryFn: () => fetchVNs('new'),
	});
};

export const usePopularVNs = () => {
	const { isOwnedPlatformsOnly } = useSettingsStore();

	return useQuery({
		queryKey: ['vns_popular', isOwnedPlatformsOnly],
		queryFn: () => fetchVNs('popular'),
	});
};

export const useTopVNs = () => {
	const { isOwnedPlatformsOnly } = useSettingsStore();

	return useQuery({
		queryKey: ['vns_top', isOwnedPlatformsOnly],
		queryFn: () => fetchVNs('top'),
	});
};

export const useNewStorefrontVns = () => {
	const { preferredStorefront, originBlacklist } = useSettingsStore();
	return useQuery({
		queryKey: ['vns_new_storefront', preferredStorefront ?? 'new'],
		queryFn: () => fetchVNs(preferredStorefront ? 'storefront' : 'new'),
		// enabled: preferredStorefront ? true : false,
	});
};

export const useVN = (id?: string) =>
	useQuery({
		queryKey: ['vn', id],
		queryFn: () => fetchVN(id as string),
		enabled: id ? true : false,
	});

export const useVNCharacters = (id?: string) =>
	useQuery({
		queryKey: ['vn_char', id],
		queryFn: () => fetchVNCharacters(id as string),
		enabled: id ? true : false,
	});

export const useVNCharDetails = (id?: string) =>
	useQuery({
		queryKey: ['vn_char_details', id],
		queryFn: () => fetchVNCharacterDetail(id as string),
		enabled: id ? true : false,
	});

export const useVNReleases = (
	vId?: string,
	searchAll?: boolean,
	olang?: keyof typeof LanguageEnum | undefined,
) =>
	useQuery({
		queryKey: ['vn_releases', vId],
		queryFn: () => fetchVNReleases(vId as string, searchAll, olang),
		enabled: vId ? true : false,
	});

export const useVNRelease = (rId?: string) =>
	useQuery({
		queryKey: ['vn_release', rId],
		queryFn: () => fetchVNRelease(rId as string),
		enabled: rId ? true : false,
	});

export const useSearchVNs = (
	sort: VNSortOptions,
	reverse: boolean,
	search: string,
	filter: VNFilterState,
) =>
	// useQuery({
	//     queryKey: ['vns_search', sort, reverse, search],
	//     queryFn: () => searchVNs(page, sort, reverse, { ...filter, search: search }),
	// });
	useInfiniteQuery({
		queryKey: ['vns_search', sort, reverse, search],
		queryFn: ({ pageParam }) =>
			searchVNs(pageParam, sort, reverse, { ...filter, search: search }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages, lastPageParams) => {
			// console.log(lastPage.more, lastPageParams + 1);
			return lastPage.more ? lastPageParams + 1 : undefined;
		},
	});

export const useVNUserList = (
	type: UListLables,
	sort:
		| 'id'
		| 'title'
		| 'released'
		| 'rating'
		| 'votecount'
		| 'voted'
		| 'vote'
		| 'added'
		| 'lastmod'
		| 'started'
		| 'finished'
		| 'searchrank',
	enabled: boolean = false,
) =>
	useInfiniteQuery({
		queryKey: ['vn_user_list', type, sort],
		queryFn: ({ pageParam }) => fetchVNUserList(type, sort, pageParam),
		enabled: enabled,
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages, lastPageParams) =>
			lastPage?.more ? lastPageParams + 1 : undefined,
	});

export const useUlistLabels = () =>
	useQuery({ queryKey: ['ulist_labels'], queryFn: () => fetchUlistLables() });

export const useVNUserEntry = (id: string | undefined) =>
	useQuery({
		queryKey: ['vn_user_entry', id],
		queryFn: () => fetchVNUserEntry(id as string),
		enabled: id ? true : false,
	});

export const useReleaseEntry = (rId: string | undefined) =>
	useQuery({
		queryKey: ['r_user_entry', rId],
		queryFn: () => fetchVNReleaseListEntry(rId as string),
		enabled: rId ? true : false,
	});
