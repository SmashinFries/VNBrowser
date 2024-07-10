import { useAppTheme } from '@/providers/theme';
import { View } from 'react-native';
import { List } from 'react-native-paper';

const SteamAccountPage = () => {
	const { colors } = useAppTheme();
	return <View style={{ flex: 1, backgroundColor: colors.surface }}>{/*  */}</View>;
};

export default SteamAccountPage;
