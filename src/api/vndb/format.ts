import { getDatetoReleasedString } from '../../utils/time';
import { EXPLORE_VN_FIELDS } from './constants';
import { VNFilterCharState, VNFilterState, VNParams, VNSortOptions } from './types';
import _ from 'lodash';

export const prepCharacterFilter = (characters: VNFilterState['characters']) => {
	const formattedChars = [];
	if (characters) {
		for (const char of characters) {
			const formattedChar: [string, string, any[]] = ['character', '=', ['and']];
			for (const key in char) {
				switch (key as keyof VNFilterCharState) {
					case 'role':
					case 'blood_type':
					case 'sex':
					case 'height':
					case 'weight':
					case 'bust':
					case 'waist':
					case 'hips':
					case 'cup':
					case 'age':
					case 'birthday':
					case 'search':
						formattedChar[2].push([key, '=', char[key as keyof VNFilterCharState]]);
						break;
					case 'height_greater':
					case 'height_lesser':
					case 'weight_greater':
					case 'weight_lesser':
					case 'bust_greater':
					case 'bust_lesser':
					case 'waist_greater':
					case 'waist_lesser':
					case 'hips_greater':
					case 'hips_lesser':
					case 'cup_greater':
					case 'cup_lesser':
					case 'age_greater':
					case 'age_lesser':
						formattedChar[2].push([
							key.replace('_greater', '').replace('_lesser', ''),
							key.includes('greater') ? '>' : '<',
							char[key as keyof VNFilterCharState],
						]);
						break;
					case 'trait_in':
					case 'trait_not_in':
						if (!char[key as keyof VNFilterCharState]) break;
						for (const value of char[key as keyof VNFilterCharState] as number[]) {
							formattedChar[2].push([
								'trait',
								key === 'trait_in' ? '=' : '!=',
								value,
							]);
						}
						break;
				}
			}
			formattedChars.push(formattedChar);
		}
	}
	return formattedChars;
};

export const formatRequest = (
	page: number,
	sort: VNSortOptions,
	reverse: boolean,
	filter: VNFilterState,
) => {
	const params: VNParams = {
		page: page,
		sort,
		reverse,
		fields: EXPLORE_VN_FIELDS,
		results: 35,
		filters: undefined,
	};
	const formattedFilters: any[] = ['and'];
	const formattedRelease: any[] = ['release', '=', ['and']];
	// _.isEmpty(_.omitBy(filter, _.isNil)
	if (!_.isEmpty(_.omitBy(filter, _.isNil))) {
		for (const key in filter) {
			switch (key as keyof VNFilterState) {
				case 'has_description':
				case 'has_anime':
				case 'has_screenshot':
				case 'has_review':
					formattedFilters.push([
						key,
						filter[key as keyof VNFilterState] === true ? '=' : '!=',
						1,
					]);
					break;
				case 'search':
				case 'platform':
				case 'lang':
				case 'olang':
				case 'devstatus':
				case 'length':
					if (filter[key as keyof VNFilterState]) {
						formattedFilters.push([key, '=', filter[key as keyof VNFilterState]]);
					}
					break;
				case 'tag_in':
				case 'tag_not_in':
					if (filter[key as keyof VNFilterState]) {
						for (const value of filter[key as keyof VNFilterState] as number[]) {
							formattedFilters.push([
								'tag',
								key === 'tag_in' ? '=' : '!=',
								`g${value}`,
							]);
						}
					}
					break;
				case 'released_greater':
				case 'released_lesser':
				case 'released':
					if (filter[key as keyof VNFilterState]) {
						formattedFilters.push([
							key.replace('_greater', '').replace('_lesser', ''),
							key.includes('greater') ? '>' : key.includes('lesser') ? '<' : '=',
							getDatetoReleasedString(filter[key as keyof VNFilterState] as Date),
						]);
					}
					break;
				case 'length_greater':
				case 'length_lesser':
				case 'rating_greater':
				case 'rating_lesser':
				case 'votecount_greater':
				case 'votecount_lesser':
					if (filter[key as keyof VNFilterState]) {
						formattedFilters.push([
							key.replace('_greater', '').replace('_lesser', ''),
							key.includes('greater') ? '>' : '<',
							filter[key as keyof VNFilterState],
						]);
					}
					break;
				// release options
				case 'has_ero':
				case 'uncensored':
					if (filter[key as keyof VNFilterState] !== undefined) {
						formattedRelease[2].push([
							key,
							filter[key as keyof VNFilterState] === true ? '=' : '!=',
							1,
						]);
					}
					break;
				case 'extlink':
				case 'voiced':
					if (filter[key as keyof VNFilterState]) {
						formattedRelease[2].push([key, '=', filter[key as keyof VNFilterState]]);
					}
					break;
				case 'minage_greater':
				case 'minage_lesser':
					if (filter[key as keyof VNFilterState]) {
						formattedRelease[2].push([
							key.replace('_greater', '').replace('_lesser', ''),
							key.includes('greater') ? '>' : '<',
							filter[key as keyof VNFilterState],
						]);
					}
					break;
				// character options
				case 'characters':
					const chars = prepCharacterFilter(filter['characters']);
					if (chars.length > 0) {
						formattedFilters.push(...chars);
					}
					break;
			}
		}
		params.filters = formattedFilters.length > 1 ? formattedFilters : undefined;
	}
	if (formattedRelease[2].length > 1) {
		formattedFilters.push(formattedRelease);
		params.filters = formattedFilters;
	}
	return _.pickBy(params) as VNParams;
};
