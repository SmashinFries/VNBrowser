import { ScrollView, View } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { useAppTheme } from '@/providers/theme';
import { useSettingsStore } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { ListIcon } from '@/components/icons';

const SettingsPage = () => {
    const [t] = useTranslation();
    const { allowEro, updateSetting } = useSettingsStore();
    const { colors } = useAppTheme();

    const openSetup = () => updateSetting('isFirstLaunch', true);

    return (
        <ScrollView style={{ backgroundColor: colors.background }}>
            <List.Item
                title={t('Appearance')}
                onPress={() => router.push('/settings/appearance')}
                left={(props) => <ListIcon {...props} icon="palette-outline" />}
            />
            <List.Item
                title={t('Filters')}
                onPress={() => router.push('/settings/appFilters')}
                left={(props) => <ListIcon {...props} icon="filter-outline" />}
            />
            <List.Item
                title={t('Setup Guide')}
                onPress={openSetup}
                left={(props) => <ListIcon {...props} icon="map-marker-path" />}
            />
        </ScrollView>
    );
};

export default SettingsPage;
