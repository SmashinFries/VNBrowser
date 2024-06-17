import { Material3Scheme, Material3Theme, useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { createContext, useContext } from 'react';
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

    const { LightTheme, DarkTheme } = adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
        materialDark: { ...MD3DarkTheme, colors: theme.dark },
        materialLight: { ...MD3LightTheme, colors: theme.light },
    });

    const paperTheme = isDarkMode
        ? {
              ...MD3DarkTheme,
              colors: isPureBlackMode
                  ? {
                        ...theme.dark,
                        surface: '#000',
                        background: '#000',
                        surfaceContainerLow: '#000',
                        surfaceContainerHigh: '#000',
                        surfaceContainer: '#000',
                    }
                  : theme.dark,
          }
        : { ...MD3LightTheme, colors: theme.light };

    return (
        <Material3ThemeProviderContext.Provider value={{ theme, updateTheme, resetTheme }}>
            <PaperProvider theme={paperTheme} {...otherProps}>
                <ThemeProvider value={isDarkMode ? DarkTheme : LightTheme}>
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
