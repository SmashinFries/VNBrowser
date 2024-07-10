import { VNDBProfile } from '@/components/user/sections';
import { useAppTheme } from '@/providers/theme';
import { useUserAuthStore } from '@/store/store';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-paper';

const UserPage = () => {
	const { vndb } = useUserAuthStore();
	const { colors } = useAppTheme();

	return vndb.userID ? (
		<VNDBProfile />
	) : (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: colors.surface,
			}}
		>
			<Button mode="contained" onPress={() => router.push('/accounts/vndb')}>
				Login to VNDB
			</Button>
		</View>
	);
};

export default UserPage;
