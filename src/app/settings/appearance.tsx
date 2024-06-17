import {
	DarkModeSelector,
	PureDarkModeSelector,
	ScoreAppearanceSelector,
	ThemeColorSelector,
	ThemedLogoSelector,
} from '@/components/settings/selectors';
import { ListHeading } from '@/components/text';
import { useAppTheme } from '@/providers/theme';
import { ScrollView } from 'react-native';

const AppearancePage = () => {
	const { colors } = useAppTheme();

	return (
		<ScrollView style={{ backgroundColor: colors.background }}>
			<DarkModeSelector />
			<PureDarkModeSelector />
			<ThemedLogoSelector />
			<ThemeColorSelector />
			<ListHeading title="Scores" />
			<ScoreAppearanceSelector />
		</ScrollView>
	);
};

export default AppearancePage;
