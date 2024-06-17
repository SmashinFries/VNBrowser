import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AnimatedStack from '../components/headers';
import { Stack, router } from 'expo-router';
import '../i18n';
import { useEffect } from 'react';
import { useThemeStore } from '../store/theme';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { Material3ThemeProvider } from '../providers/theme';
import { Toaster } from 'burnt/web';
import { useSettingsStore } from '@/store/store';

const queryClient = new QueryClient();

const RootLayout = () => {
	const { isDarkMode } = useThemeStore();
	const { isFirstLaunch } = useSettingsStore();

	useEffect(() => {
		if (isFirstLaunch) {
			router.replace('/setup');
		}
	}, [isFirstLaunch]);

	useEffect(() => {
		setStatusBarStyle(isDarkMode ? 'light' : 'dark', true);
	}, [isDarkMode]);

	return (
		<QueryClientProvider client={queryClient}>
			<Material3ThemeProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						<AnimatedStack
							initialRouteName="(tabs)"
							screenOptions={{ headerShown: false }}
						>
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="vn" />
							<Stack.Screen name="about" />
							<Stack.Screen name="settings" />
							<Stack.Screen name="accounts" />
							<Stack.Screen name="setup" />
							<Stack.Screen
								name="character/[id]"
								options={{ headerShown: true, title: '', headerTransparent: true }}
							/>
						</AnimatedStack>
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
				<StatusBar style={isDarkMode ? 'light' : 'dark'} translucent />
				<Toaster position="bottom-right" />
			</Material3ThemeProvider>
		</QueryClientProvider>
	);
};

export default RootLayout;
