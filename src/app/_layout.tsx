import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AnimatedStack from '../components/headers';
import { Stack, router } from 'expo-router';
import '../i18n';
import { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/theme';
import { StatusBar, setStatusBarStyle, setStatusBarTranslucent } from 'expo-status-bar';
import { Material3ThemeProvider } from '../providers/theme';
import { Toaster } from 'burnt/web';
import { useSettingsStore } from '@/store/store';
import useAppUpdates from '@/hooks/useAppUpdater';
import { Platform } from 'react-native';
import { UpdaterBottomSheet } from '@/components/bottomsheets';
import { reattachDownloads, removeUpdateAPKs } from '@/utils/update';

Platform.OS !== 'web' && removeUpdateAPKs();
Platform.OS !== 'web' && reattachDownloads();

const queryClient = new QueryClient();

const RootLayout = () => {
	const { isDarkMode } = useThemeStore();
	const { isFirstLaunch } = useSettingsStore();
	const { updateDetails, checkForUpdates } = useAppUpdates();
	const updaterBtmSheetRef = useRef<BottomSheetModal>(null);

	const runUpdateChecker = async () => {
		const hasUpdate = await checkForUpdates();
		if (hasUpdate) {
			updaterBtmSheetRef.current?.present();
		}
	};

	useEffect(() => {
		if (isFirstLaunch) {
			router.replace('/setup');
		}
	}, [isFirstLaunch]);

	useEffect(() => {
		setStatusBarStyle(isDarkMode ? 'light' : 'dark', true);
	}, [isDarkMode]);

	useEffect(() => {
		setStatusBarTranslucent(true);
		Platform.OS !== 'web' && runUpdateChecker();
	}, []);

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
						{Platform.OS !== 'web' && (
							<UpdaterBottomSheet
								ref={updaterBtmSheetRef}
								updateDetails={updateDetails}
							/>
						)}
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
				{/* <StatusBar translucent /> */}
				<Toaster position="bottom-right" />
			</Material3ThemeProvider>
		</QueryClientProvider>
	);
};

export default RootLayout;
