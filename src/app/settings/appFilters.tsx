import {
    AllowEroSelector,
    OwnedPlatformsSelector,
    PrefStorefrontSelector,
    SexualLevelSelector,
} from '@/components/settings/selectors';
import { useAppTheme } from '@/providers/theme';
import { ScrollView } from 'react-native';

const AppFiltersPage = () => {
    const { colors } = useAppTheme();
    // const {  } = useSettingsStore();

    return (
        <ScrollView style={{ backgroundColor: colors.background }}>
            <AllowEroSelector />
            <SexualLevelSelector />
            <PrefStorefrontSelector />
            <OwnedPlatformsSelector />
        </ScrollView>
    );
};

export default AppFiltersPage;
