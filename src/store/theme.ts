import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeState = {
	themeColor?: string | undefined;
	isDarkMode: boolean;
	isPureBlackMode: boolean;
	isLogoThemed: boolean;
};
type ThemeAction = {
	setThemeColor: (color: string | undefined) => void;
	setIsDarkMode: (enable: boolean) => void;
	setIsPureBlackMode: (enable: boolean) => void;
	setIsLogoThemed: (enable: boolean) => void;
};

export const useThemeStore = create<ThemeState & ThemeAction>()(
	persist(
		(set, get) => ({
			themeColor: undefined,
			isPureBlackMode: false,
			isDarkMode: Appearance.getColorScheme() === 'dark',
			isSystemThemeEnabled: true,
			isLogoThemed: false,
			setThemeColor: (color) => set({ themeColor: color }),
			setIsDarkMode: (enable) => set({ isDarkMode: enable }),
			setIsPureBlackMode: (enable) => set({ isPureBlackMode: enable }),
			setIsLogoThemed: (enable) => set({ isLogoThemed: enable }),
		}),
		{
			name: 'settings-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
