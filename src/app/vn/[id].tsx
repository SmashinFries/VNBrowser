import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Icon, SegmentedButtons, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { VNResponse } from '@/api/vndb/types';
import { ExpandableDescription } from '@/components/description';
import { FadeHeader } from '@/components/headers';
import VNCharacters from '@/components/vn/sections/characters';
import VNPlatforms from '@/components/vn/sections/platforms';
import VNQuotesSection from '@/components/vn/sections/quotes';
import VNRelations from '@/components/vn/sections/relations';
import VNScreenshots from '@/components/vn/sections/screenshots';
import use3dPan from '@/hooks/animations/use3dPan';
import { useAppTheme } from '@/providers/theme';
import { UserListActionBar } from '@/components/vn/sections/actionbar';
import { ListEntrySheet } from '@/components/vn/bottomsheet';
import { useMemo, useRef, useState } from 'react';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { VNLinks } from '@/components/vn/sections/links';
import VNReleaseCovers from '@/components/vn/sections/vncovers';
import {
	useReleaseCovers,
	useVN,
	useVNCharacters,
	useVNQuotes,
	useVNReleases,
	useVNSiteData,
	useVNUserEntry,
} from '@/api/vndb/queries/hooks';
import { MediaBanner } from '@/components/background';
import { getVNLength } from '@/utils/time';
import { DevStatusEnum, VNLengthEnum } from '@/api/vndb/schema';
import { LanguageIcon } from '@/components/icons';
import _ from 'lodash';
import { useSettingsStore } from '@/store/store';
import VNReleases from '@/components/vn/sections/releases';
import { LoadingView } from '@/components/loading';
import { CoverImage } from '@/components/image';
import { TagTraitChip } from '@/components/filter/buttons';
import { TagsList } from '@/components/vn/sections/tags';

const VNFrontCover = ({ data }: { data: VNResponse['results'][0] }) => {
	const { colors } = useAppTheme();
	const { animatedStyle, panGesture } = use3dPan(); //{ xLimit: [-25, 25], yLimit: [-25, 25] }
	const { scoreColors, scoreThresholds } = useSettingsStore();
	const [titleSelection, setTitleSelection] = useState<'title' | 'alttitle'>('title');

	const score_color = useMemo(
		() =>
			data.rating
				? data.rating <= scoreThresholds[0]
					? scoreColors[0]
					: data.rating >= scoreThresholds[1]
						? scoreColors[2]
						: scoreColors[1]
				: undefined,
		[scoreColors, scoreThresholds],
	);

	return (
		<View>
			<View style={{ alignItems: 'center', paddingTop: 20 }}>
				<GestureDetector gesture={panGesture}>
					<Animated.View
						style={[animatedStyle, styles.container, { aspectRatio: 2 / 3 }]}
					>
						<CoverImage
							url={data?.image?.url}
							sexual={data?.image?.sexual}
							style={styles.image}
						/>
					</Animated.View>
				</GestureDetector>
				<Text
					numberOfLines={2}
					variant="titleLarge"
					style={{ textAlign: 'center', paddingHorizontal: 10 }}
				>
					{data[titleSelection]}
				</Text>
				<Text
					variant="titleSmall"
					style={{
						paddingVertical: 10,
						color: colors.onSurfaceVariant,
						textTransform: 'capitalize',
					}}
				>
					<LanguageIcon name={data.olang} size={14} />
					{data?.devstatus >= 0 &&
						` ${DevStatusEnum[data.devstatus]}`.replaceAll('_', ' ')}
					{data?.rating && ' - '}
					{data?.rating && (
						<Text
							variant="titleSmall"
							style={{ color: score_color }}
						>{`${data.rating.toFixed(1)}% (${data.votecount})`}</Text>
					)}
				</Text>
				{data.length_minutes && (
					<Text
						variant="titleSmall"
						style={{
							paddingVertical: 10,
							color: colors.onSurfaceVariant,
						}}
					>
						<Icon source="timer-outline" size={14} />
						{data.length ? ' ' + VNLengthEnum[data.length] + ' - ' : ''}
						{getVNLength(data.length_minutes)}
					</Text>
				)}
			</View>
			{data.alttitle && (
				<SegmentedButtons
					value={titleSelection}
					buttons={[
						{ label: 'Main', value: 'title' },
						{ label: 'Alternative', value: 'alttitle' },
					]}
					density="high"
					style={{ paddingHorizontal: 15 }}
					onValueChange={(val) => setTitleSelection(val as 'title' | 'alttitle')}
				/>
			)}
			{/* <TagView tags={data.tags.sort((a, b) => b.rating - a.rating) ?? null} /> */}
			{data.description ? (
				<ExpandableDescription initialHeight={100} text={data.description} />
			) : null}
		</View>
	);
};

const VNPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isLoading } = useVN(id);

	const char = useVNCharacters(id);
	const siteData = useVNSiteData(id as string);
	const quotes = useVNQuotes(id as string);
	const releaseCovers = useReleaseCovers(id as string);
	const { colors } = useAppTheme();
	const releases = useVNReleases(data?.olang ? id : undefined, false, data?.olang);
	const userEntry = useVNUserEntry(id);

	const [isRefreshing, setIsRefreshing] = useState(false);
	const onRefresh = async () => {
		setIsRefreshing(true);
		// await ulistData.refetch();
		// await char.refetch();
		await siteData.refetch();
		// await quotes.refetch();
		// releases.refetch();
		setIsRefreshing(false);
	};

	return (
		<View>
			{isLoading && !data ? (
				<LoadingView>
					<Stack.Screen
						options={{
							headerShown: false,
						}}
					/>
				</LoadingView>
			) : (
				<FadeHeader
					title={data?.title ?? ''}
					shareLink={`https://www.vndb.org/${id}`}
					animationRange={[280, 360]}
					// RefreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
					BgImage={
						data?.image
							? (style) => (
									<MediaBanner
										images={
											data?.screenshots?.length > 0
												? data.screenshots
												: [data?.image]
										}
										style={style.style}
										allowMotion
									/>
								)
							: undefined
					}
				>
					<View style={{ flex: 1 }}>
						<VNFrontCover data={data as VNResponse['results'][0]} />
						<TagsList data={data?.tags} />
						<UserListActionBar data={userEntry.data} vId={id as string} />
						<VNPlatforms platforms={data?.platforms} />
						{data?.relations &&
							data.relations.filter((val) => val.relation_official === true).length >
								0 && <VNRelations relations={data.relations} />}
						{char?.data?.results && <VNCharacters data={char.data.results} />}
						<VNScreenshots screenshots={data?.screenshots} />
						<VNReleaseCovers
							covers={
								releaseCovers.data &&
								releaseCovers.data.filter((_, idx) => idx < 10)
							}
						/>
						{((siteData?.data?.shops && siteData.data.shops.length > 0) ||
							(data?.extlinks && data.extlinks.length > 0)) && (
							<VNLinks id={id} shops={siteData?.data?.shops} sites={data?.extlinks} />
						)}
						{/* Might be causing bad performance. will need to refactor and cast some magic */}
						{releases.data?.results && (
							<VNReleases
								data={releases.data?.results}
								olang={data?.olang}
								listReleases={userEntry.data?.releases}
							/>
						)}
						{quotes.data && <VNQuotesSection quotes={quotes.data} />}
					</View>
				</FadeHeader>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 300,
		width: '100%',
		borderRadius: 20,
		marginBottom: 30,
		backgroundColor: 'rgb(255, 255, 255)',
	},
	image: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		backfaceVisibility: 'hidden',
		borderRadius: 20,
	},
});

export default VNPage;
