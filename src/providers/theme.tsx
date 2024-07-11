import { Material3Scheme, Material3Theme, useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { createContext, useContext, useMemo } from 'react';
import {
	MD3DarkTheme,
	MD3LightTheme,
	MD3Theme,
	Provider as PaperProvider,
	ProviderProps,
	adaptNavigationTheme,
	useTheme,
} from 'react-native-paper';
import {
	ThemeProvider,
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { useThemeStore } from '@/store/theme';

type Material3ThemeProviderProps = {
	theme: Material3Theme;
	updateTheme: (sourceColor: string) => void;
	resetTheme: () => void;
};

const Material3ThemeProviderContext = createContext<Material3ThemeProviderProps>(
	{} as Material3ThemeProviderProps,
);

export function Material3ThemeProvider({
	children,
	fallbackSourceColor,
	...otherProps
}: ProviderProps & { fallbackSourceColor?: string; isDark?: boolean }) {
	const { isDarkMode, isPureBlackMode, themeColor, setThemeColor } = useThemeStore();
	const { theme, updateTheme, resetTheme } = useMaterial3Theme({
		sourceColor: themeColor,
		fallbackSourceColor,
	});

	// PLEASE HELP :( THEMES WORK IN DEV BUILD BUT NOT PRODUCTION
	// This led to this abomination

	const { LightTheme, DarkTheme } = adaptNavigationTheme({
		reactNavigationLight: NavigationDefaultTheme,
		reactNavigationDark: NavigationDarkTheme,
	});

	const CombinedDefaultTheme = {
		...MD3LightTheme,
		...LightTheme,
		colors: {
			...MD3LightTheme.colors,
			...LightTheme.colors,
			...theme.light,
		},
	};

	const CombinedDarkTheme = {
		...MD3DarkTheme,
		...DarkTheme,
		colors: {
			...MD3DarkTheme.colors,
			...DarkTheme.colors,
			...theme.dark,
		},
	};

	const paperTheme = useMemo(
		() =>
			isDarkMode
				? {
						...MD3DarkTheme,
						colors: isPureBlackMode
							? {
									...theme.dark,
									surface: '#000',
									background: '#000',
								}
							: theme.dark,
					}
				: { ...MD3LightTheme, colors: theme.light },
		[isDarkMode, isPureBlackMode, theme],
	);

	return (
		<Material3ThemeProviderContext.Provider value={{ theme, updateTheme, resetTheme }}>
			<PaperProvider theme={paperTheme} {...otherProps}>
				<ThemeProvider value={isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme}>
					{children}
				</ThemeProvider>
			</PaperProvider>
		</Material3ThemeProviderContext.Provider>
	);
}

export function useThemeContext() {
	const ctx = useContext(Material3ThemeProviderContext);
	if (!ctx) {
		throw new Error('useMaterial3ThemeContext must be used inside Material3ThemeProvider');
	}
	return ctx;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;
