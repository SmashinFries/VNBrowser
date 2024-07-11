import { Stack, withLayoutContext } from 'expo-router';
import {
	adaptNavigationTheme,
	Avatar,
	Icon,
	MD3DarkTheme,
	MD3LightTheme,
} from 'react-native-paper';
import {
	MaterialBottomTabNavigationOptions,
	createMaterialBottomTabNavigator,
} from 'react-native-paper/react-navigation';
import { useTranslation } from 'react-i18next';
import { useUserAuthStore } from '@/store/store';
import { useThemeStore } from '@/store/theme';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { useAppTheme } from '@/providers/theme';

const { Navigator } = createMaterialBottomTabNavigator();

export const MaterialBottomTabs = withLayoutContext<
	// @ts-ignore
	MaterialBottomTabNavigationOptions,
	typeof Navigator
>(Navigator);

const BottomTabLayout = () => {
	const [t, i18n] = useTranslation('titles');
	const { vndb } = useUserAuthStore();
	const { colors } = useAppTheme();

	return (
		<MaterialBottomTabs
			initialRouteName="explore"
			labeled={true}
			shifting={true}
			barStyle={{ backgroundColor: colors.elevation.level2 }}
		>
			<MaterialBottomTabs.Screen name="index" redirect={true} />
			<MaterialBottomTabs.Screen
				name="explore"
				options={{
					title: t('Browse'),
					tabBarIcon: (props) => (
						<Icon
							size={24}
							color={props.color}
							source={props.focused ? 'compass' : 'compass-outline'}
						/>
					),
				}}
			/>
			<MaterialBottomTabs.Screen
				name="list"
				options={{
					title: t('List'),
					tabBarIcon: 'bookshelf',
				}}
				redirect={vndb.username ? false : true}
			/>
			<MaterialBottomTabs.Screen
				name="user/index"
				options={{
					title: vndb.username ? vndb.username : 'Login',
					tabBarIcon: vndb.avatar
						? () => <Avatar.Image size={24} source={{ uri: vndb.avatar ?? '' }} />
						: vndb.username
							? () => (
									<Avatar.Text
										size={24}
										label={(vndb.username && vndb.username[0]) ?? ''}
									/>
								)
							: 'login',
				}}
			/>
			<MaterialBottomTabs.Screen
				name="more"
				options={{ title: t('More'), tabBarIcon: 'dots-horizontal' }}
			/>
		</MaterialBottomTabs>
	);
};

export default BottomTabLayout;
