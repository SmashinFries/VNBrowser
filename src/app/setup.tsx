import {
    Allow3DSelector,
    AllowEroSelector,
    AppLanguageSelector,
    DarkModeSelector,
    PrefStorefrontSelector,
    PureDarkModeSelector,
    ThemeColorSelector,
    TitleLanguageSelector,
} from '@/components/settings/selectors';
import { ListHeading } from '@/components/text';
import { useAppTheme } from '@/providers/theme';
import { useSettingsStore } from '@/store/store';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Button, Divider, IconButton, ProgressBar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VNDBAuthSection } from '@/components/accounts/section';

const IntroSection = () => {
    const [t] = useTranslation('setup');
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="headlineLarge">VNDB Browser</Text>
            <Text>This is the setup for VNDB Browser!</Text>
        </View>
    );
};

const PersonalizationSection = () => {
    const [t] = useTranslation('setup');
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 20 }}>
            <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
                App Customization
            </Text>
            <Divider style={{ marginVertical: 15 }} />
            <ScrollView>
                <ListHeading title="Theme" />
                <DarkModeSelector />
                <PureDarkModeSelector />
                <ThemeColorSelector />
                <ListHeading title="Content" />
                <AllowEroSelector />
                <PrefStorefrontSelector />
                <ListHeading title="Language" />
                <AppLanguageSelector />
                <TitleLanguageSelector />
                <ListHeading title="Experimental" />
                <Allow3DSelector />
            </ScrollView>
        </View>
    );
};

const OutroSection = ({ onComplete }: { onComplete: () => void }) => {
    const [t] = useTranslation('setup');
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {/* <Text variant="headlineLarge">VNDB Browser</Text> */}
                <Text variant="titleLarge">Setup is now complete!</Text>
            </View>
            <View style={{ justifyContent: 'flex-end' }}>
                <Button
                    mode="contained"
                    onPress={onComplete}
                    style={{ marginBottom: 15, marginHorizontal: 10 }}
                >
                    Complete
                </Button>
            </View>
        </View>
    );
};

const TOTAL_PAGES = 4;
const SetupPage = () => {
    const { colors } = useAppTheme();
    const { updateSetting } = useSettingsStore();
    const pagerRef = useRef<PagerView>(null);
    const [page, setPage] = useState<number>(0);

    const { top, right, left } = useSafeAreaInsets();

    const onNextSection = () => pagerRef.current?.setPage(page + 1);
    const onPrevSection = () => pagerRef.current?.setPage(page - 1);

    const onSkipSetup = () => {
        updateSetting('isFirstLaunch', false);
        router.replace('/(tabs)/explore');
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <View
                style={{
                    paddingTop: top + 15,
                    paddingRight: right + 10,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <Button onPress={onSkipSetup} disabled={page === TOTAL_PAGES - 1}>
                    Skip Setup
                </Button>
            </View>
            <PagerView
                initialPage={0}
                onPageSelected={(e) => setPage(e.nativeEvent.position)}
                ref={pagerRef}
                style={{ flex: 1 }}
            >
                <IntroSection key={0} />
                <VNDBAuthSection key={1} />
                <PersonalizationSection key={2} />
                <OutroSection key={3} onComplete={onSkipSetup} />
            </PagerView>
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                        marginHorizontal: 20,
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <IconButton
                        icon="arrow-left"
                        onPress={onPrevSection}
                        disabled={page === 0}
                        iconColor={colors.primary}
                        style={{
                            borderWidth: 1,
                            flexGrow: 1,
                            borderColor: page === 0 ? colors.outline : colors.primary,
                        }}
                    />
                    {/* <Button
                        style={{ flexGrow: 1 }}
                        onPress={() => console.log(pagerRef.current?.context)}
                        mode="outlined"
                    >
                        Continue
                    </Button> */}
                    <IconButton
                        icon="arrow-right"
                        iconColor={colors.primary}
                        onPress={onNextSection}
                        disabled={page === TOTAL_PAGES - 1}
                        style={{
                            borderWidth: 1,
                            flexGrow: 1,
                            borderColor: page === TOTAL_PAGES - 1 ? colors.outline : colors.primary,
                        }}
                    />
                </View>
                <ProgressBar
                    style={{ height: 10 }}
                    progress={(page + 1) / TOTAL_PAGES}
                    color={colors.primary}
                />
            </View>
        </View>
    );
};

export default SetupPage;
