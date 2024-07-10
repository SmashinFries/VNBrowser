import { ListIcon } from '@/components/icons';
import { useAppTheme } from '@/providers/theme';
import { useUserAuthStore } from '@/store/store';
import { router } from 'expo-router';
import { View } from 'react-native';
import { List } from 'react-native-paper';

const AccountsPage = () => {
	const { colors } = useAppTheme();
	const { vndb } = useUserAuthStore();
	return (
		<View style={{ flex: 1, backgroundColor: colors.surface }}>
			<List.Item
				title="VNDB"
				right={(props) =>
					vndb.userID && <ListIcon {...props} icon="check" color={colors.primary} />
				}
				left={(props) => <ListIcon {...props} icon={'monitor'} />}
				onPress={() => router.push('/accounts/vndb')}
			/>
			{/* <List.Item
				title="Steam"
				description={'Is this possible???'}
				disabled
				left={(props) => <ListIcon {...props} icon={'steam'} />}
			/> */}
		</View>
	);
};

export default AccountsPage;
