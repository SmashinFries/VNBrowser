import { View, useWindowDimensions } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/store';
import { VNDBStats } from '@/api/vndb/types';
import { AutoScrolling } from '@/components/infiniteSlider';
import { RefreshableScroll, SectionScroll } from '@/components/lists';
import { ExternalLinks } from '@/api/vndb/schema';
import _ from 'lodash';
import {
	useNewStorefrontVns,
	usePopularVNs,
	useRandomQuote,
	useTopVNs,
	useVNDBStats,
} from '@/api/vndb/queries/hooks';

const ExplorePage = () => {
	const { colors } = useTheme();
	const [t] = useTranslation('titles');
	const { preferredStorefront } = useSettingsStore();
	const stats = useVNDBStats();
	const newStorefront = useNewStorefrontVns();
	const popularVns = usePopularVNs();
	const topVns = useTopVNs();
	const quote = useRandomQuote();
	const { width } = useWindowDimensions();

	const onRefresh = () => {
		stats.refetch();
		newStorefront.refetch();
		popularVns.refetch();
		topVns.refetch();
		quote.refetch();
	};

	return (
		<RefreshableScroll refreshing={false} onRefresh={onRefresh}>
			<AutoScrolling endPaddingWidth={50}>
				<View style={{ flexDirection: 'row' }}>
					{stats?.data &&
						Object.keys(stats.data).map((val, idx) => (
							<Chip
								key={idx}
								mode="outlined"
								style={{ marginHorizontal: 10 }}
								textStyle={{ textTransform: 'capitalize' }}
							>{`${val}: ${stats.data[val as keyof VNDBStats].toLocaleString()}`}</Chip>
						))}
				</View>
			</AutoScrolling>
			<View
				style={{ flex: 1, width: width, marginVertical: 10, justifyContent: 'flex-start' }}
			>
				<SectionScroll
					category_title={
						preferredStorefront
							? `New on ${_.find(ExternalLinks, { name: preferredStorefront })?.label}`
							: 'New Releases'
					}
					data={newStorefront.data?.results}
					isLoading={newStorefront?.isLoading}
				/>
				<SectionScroll
					category_title={t('Popular')}
					data={popularVns.data?.results}
					isLoading={popularVns?.isLoading}
				/>
				<SectionScroll
					category_title={t('Top Rated')}
					data={topVns.data?.results}
					isLoading={topVns?.isLoading}
				/>
				<View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
					<Text
						style={{ color: colors.primary }}
						onPress={() => router.push(`vn/v${quote?.data?.id}`)}
					>
						"{quote?.data?.quote}"
					</Text>
				</View>
			</View>
		</RefreshableScroll>
	);
};

export default ExplorePage;
