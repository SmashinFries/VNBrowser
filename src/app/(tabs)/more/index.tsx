import { ScrollView, View } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useAppTheme } from '@/providers/theme';
import { ListIcon } from '@/components/icons';

const MorePage = () => {
    const { colors } = useAppTheme();
    const [t] = useTranslation();

    return (
        <ScrollView style={{ backgroundColor: colors.background }}>
            <List.Item
                title={t('Accounts')}
                left={(props) => <ListIcon {...props} icon={'account-outline'} />}
                onPress={() => router.push('/accounts')}
            />
            <List.Item
                title={t('Settings')}
                left={(props) => <ListIcon {...props} icon={'cog-outline'} />}
                onPress={() => router.push('/settings')}
            />

            <List.Item
                title={t('About')}
                left={(props) => <ListIcon {...props} icon={'information-outline'} />}
                onPress={() => router.push('/about')}
            />
        </ScrollView>
    );
};

export default MorePage;
