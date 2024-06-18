import { ExpoConfig, ConfigContext } from 'expo/config';
const IS_DEV = process.env.APP_VARIANT === 'development';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: 'VNBrowser',
	name: IS_DEV ? 'VNBrowser Dev' : 'VNBrowser',
	scheme: IS_DEV ? ['vnbrowserdev'] : ['vnbrowser'],
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/icon.png',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		// backgroundColor: '#ffffff',
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		package: IS_DEV ? 'com.vnbrowserdev' : 'com.vnbrowser',
		intentFilters: [
			{
				action: 'VIEW',
				data: [
					{
						scheme: 'https',
						host: 'vndb.org',
						pathPattern: '/v.*',
					},
				],
			},
		],
	},
	web: {
		favicon: './assets/favicon.png',
		bundler: 'metro',
	},
	updates: {
		checkAutomatically: 'ON_LOAD',
		enabled: true,
	},
	extra: {
		eas: {
			projectId: '88d601c0-7725-4095-976f-72f16e459727',
		},
	},
	plugins: [
		'expo-router',
		'expo-localization',
		'expo-secure-store',
		[
			'expo-build-properties',
			{
				android: {
					useLegacyPackaging: true, // keeps the app size smaller but launches slower
					// newArchEnabled: true,
				},
			},
		],
		[
			'expo-barcode-scanner',
			{
				cameraPermission: 'Allow VNBrowser to access camera for barcode scanning.',
			},
		],
	],
});
