import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import _ from 'lodash';
import { VNSortOptions, VNFilterState, VNFilterCharState, IntensityLevel } from '@/api/vndb/types';
import { LANGUAGES } from 'locales';
import { LanguageEnum, PlatformsEnum } from '@/api/vndb/schema';
import { Settings } from 'react-native';

const SecureStorage: StateStorage = {
	getItem: SecureStore.getItemAsync,
	removeItem: SecureStore.deleteItemAsync,
	setItem: SecureStore.setItemAsync,
};

export type SettingsState = {
	titleLanguage: 'original' | 'romanized' | 'system';
	allow3D: boolean;
	allowEro: boolean;
	isFirstLaunch: boolean;
	preferredStorefront: string | undefined;
	ownedPlatforms: (keyof typeof PlatformsEnum)[];
	isOwnedPlatformsOnly: boolean;
	preferredOrigin: keyof typeof LanguageEnum | undefined;
	originBlacklist: (keyof typeof LanguageEnum)[];
	scoreColors: [string, string, string];
	scoreThresholds: [number, number];
	sexualLevel: IntensityLevel; // max level of image sexual content to keep unblurred
	violenceLevel: number; // max level of image violence content to keep unblurred
};
type SettingsAction = {
	updateSetting: (
		key: keyof SettingsState,
		value:
			| string
			| boolean
			| number
			| SettingsState['titleLanguage']
			| SettingsState['preferredStorefront']
			| SettingsState['preferredOrigin']
			| SettingsState['ownedPlatforms']
			| SettingsState['scoreThresholds']
			| SettingsState['scoreColors'],
	) => void;
	updateOriginBlacklist: (lang: keyof typeof LanguageEnum) => void;
};
export const useSettingsStore = create<SettingsState & SettingsAction>()(
	persist(
		(set, get) => ({
			isFirstLaunch: true,
			allowEro: false,
			allow3D: false,
			preferredStorefront: undefined,
			ownedPlatforms: [],
			isOwnedPlatformsOnly: false,
			preferredOrigin: undefined,
			originBlacklist: [],
			titleLanguage: 'romanized',
			scoreColors: ['#ff0000', '#ff8000', '#00ff00'],
			scoreThresholds: [64, 74],
			sexualLevel: 0,
			violenceLevel: 0,
			updateSetting: (key, value) => set({ [key]: value }),
			updateOriginBlacklist: (lang) =>
				set((state) => {
					const isInList = state.originBlacklist.includes(lang);
					if (isInList) {
						const newState = state.originBlacklist.filter((val) => val !== lang);
						return {
							originBlacklist: [...newState],
						};
					} else {
						return {
							originBlacklist: [...state.originBlacklist, lang],
						};
					}
				}),
		}),
		{
			name: 'settings-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

type VNFilterStoreState = {
	sort: VNSortOptions;
	reverse: boolean;
	filter: VNFilterState;
};
type VNFilterStoreActions = {
	onSortChange: (value: VNSortOptions) => void;
	onReverseChange: (value: boolean) => void;
	updateFilter: (
		key: keyof VNFilterState,
		value: string | number | string | boolean | Date | undefined,
	) => void;
	updateTags: (id: number) => void;
	updateCharacterFilter: (
		index: number,
		key: keyof VNFilterCharState,
		value: string | number | undefined,
	) => void;
	addCharacterFilter: (char: VNFilterCharState) => void;
	updateTraits: (index: number, id: number) => void;
	removeCharacterFilter: (index: number) => void;
};
export const useVNFilterStore = create<VNFilterStoreState & VNFilterStoreActions>((set) => ({
	sort: 'votecount',
	reverse: true,
	filter: {},
	onSortChange: (value) => set({ sort: value }),
	onReverseChange: (value) => set({ reverse: value }),
	updateFilter: (key, value) => {
		set((state) => {
			const isArray = _.isArray(state.filter[key]);
			if (isArray) {
				const arr = state.filter[key] as any[];
				return {
					filter: {
						...state.filter,
						[key]: arr.includes(value)
							? arr.filter((v) => v !== value)
							: [...arr, value],
					},
				};
			} else {
				return { filter: { ...state.filter, [key]: value } };
			}
		});
	},
	updateTags: (id) => {
		set((state) => {
			const excluded_tags = state.filter?.tag_not_in ?? [];
			const included_tags = state.filter?.tag_in ?? [];
			if (included_tags?.includes(id)) {
				const newIncluded = included_tags.filter((tag) => tag !== id);
				// console.log({
				// 	...state.filter,
				// 	tag_not_in: [...excluded_tags, id],
				// 	tag_in: newIncluded.length > 0 ? newIncluded : undefined,
				// });
				return {
					filter: {
						...state.filter,
						tag_not_in: [...excluded_tags, id],
						tag_in: newIncluded.length > 0 ? newIncluded : undefined,
					},
				};
			} else if (excluded_tags?.includes(id)) {
				const newExcluded = excluded_tags.filter((tag) => tag !== id);
				// console.log('new filter:', {
				// 	...state.filter,
				// 	tag_not_in: newExcluded.length > 0 ? newExcluded : undefined,
				// });
				return {
					filter: {
						...state.filter,
						tag_not_in: newExcluded.length > 0 ? newExcluded : undefined,
					},
				};
			} else {
				// console.log('new filter:', {
				// 	...state.filter,
				// 	tag_in: [...included_tags, id],
				// });
				return {
					filter: {
						...state.filter,
						tag_in: [...included_tags, id],
					},
				};
			}
		});
	},
	updateCharacterFilter: (index, key, value) => {
		set((state) => {
			const charFilters = state.filter.characters ?? [];
			const char = charFilters[index] ?? {};
			return {
				filter: {
					...state.filter,
					characters: [
						...charFilters.slice(0, index),
						{ ...char, [key]: value },
						...charFilters.slice(index + 1),
					],
				},
			};
		});
	},
	addCharacterFilter: (char) => {
		set((state) => {
			return {
				filter: {
					...state.filter,
					characters: [...(state.filter.characters ?? []), char],
				},
			};
		});
	},
	updateTraits: (index, id) => {
		set((state) => {
			const charFilters = state.filter.characters ?? [];
			const char = charFilters[index] ?? {};
			const included_traits = char.trait_in ?? [];
			const excluded_traits = char.trait_not_in ?? [];
			if (included_traits?.includes(id)) {
				const newIncluded = included_traits.filter((tag) => tag !== id);
				return {
					filter: {
						...state.filter,
						characters: [
							...charFilters.slice(0, index),
							{
								...char,
								trait_not_in: [...excluded_traits, id],
								trait_in: newIncluded.length > 0 ? newIncluded : undefined,
							},
							...charFilters.slice(index + 1),
						],
					},
				};
			} else if (excluded_traits?.includes(id)) {
				const newExcluded = excluded_traits.filter((tag) => tag !== id);
				return {
					filter: {
						...state.filter,
						characters: [
							...charFilters.slice(0, index),
							{
								...char,
								trait_not_in: newExcluded.length > 0 ? newExcluded : undefined,
							},
							...charFilters.slice(index + 1),
						],
					},
				};
			} else {
				return {
					filter: {
						...state.filter,
						characters: [
							...charFilters.slice(0, index),
							{
								...char,
								trait_in: [...included_traits, id],
							},
							...charFilters.slice(index + 1),
						],
					},
				};
			}
		});
	},
	removeCharacterFilter: (index) => {
		set((state) => {
			const charFilters = state.filter.characters ?? [];
			return {
				filter: {
					...state.filter,
					characters: charFilters.filter((_, i) => i !== index),
				},
			};
		});
	},
}));

type UserAuthState = {
	vndb: {
		userID: string | null; // ex: u123
		username: string | null;
		token: string | null;
		avatar: string | null;
		banner: string | null;
		permissions: ('listread' | 'listwrite')[] | null;
	};
};
type UserAuthActions = {
	loginVNDB: (user: UserAuthState['vndb']) => void;
	logoutVNDB: () => void;
	updateVNDB: (key: keyof UserAuthState['vndb'], value: string | string[]) => void;
};

export const useUserAuthStore = create<UserAuthState & UserAuthActions>()(
	persist(
		(set, get) => ({
			vndb: {
				userID: null,
				username: null,
				token: null,
				permissions: null,
				avatar: null,
				banner: null,
			},
			loginVNDB: (user) => set({ vndb: { ...user } }),
			logoutVNDB: () =>
				set({
					vndb: {
						userID: null,
						username: null,
						token: null,
						permissions: null,
						avatar: null,
						banner: null,
					},
				}),
			updateVNDB: (key, value) => set({ [key]: value }),
		}),
		{
			name: 'settings-storage',
			storage: createJSONStorage(() => SecureStorage),
		},
	),
);
