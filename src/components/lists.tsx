import { router } from 'expo-router';
import { RefreshControl, ScrollView, View, useWindowDimensions } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text, useTheme } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useAppTheme } from '@/providers/theme';
import { VNListResponse, VNUserListResponse } from '@/api/vndb/types';
import { VNCard } from './cards';
import { Image } from 'expo-image';
import { SectionHeader } from './text';

type RefreshableScrollProps = {
	children: React.ReactNode;
	onRefresh: () => void;
	refreshing: boolean;
};
export const RefreshableScroll = ({ children, refreshing, onRefresh }: RefreshableScrollProps) => {
	const { colors } = useAppTheme();
	return (
		<ScrollView
			style={{ backgroundColor: colors.background }}
			refreshControl={
				<RefreshControl
					// whats the M3 Guideline for this?
					colors={[colors.onPrimaryContainer]}
					progressBackgroundColor={colors.primaryContainer}
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
			}
		>
			{children}
		</ScrollView>
	);
};

type SectionScrollProps = {
	category_title: string;
	data: VNListResponse['results'] | undefined;
	isLoading: boolean;
	fetchMore?: () => void;
};

export const SectionScroll = ({
	category_title,
	data,
	fetchMore,
	isLoading,
}: SectionScrollProps) => {
	const { width, height } = useWindowDimensions();
	const { colors } = useTheme();

	const RenderItem = (props: { item: VNListResponse['results'][0] }) => (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				overflow: 'hidden',
				borderRadius: 12,
			}}
		>
			<VNCard
				coverImg={props.item.image}
				titles={props.item.titles}
				rating={props.item.rating}
				navigate={() => router.push(`/vn/${props.item.id}`)}
				height={220}
				platforms={props.item.platforms}
			/>
			{/* <MediaProgressBar
                    progress={props.item.mediaListEntry?.progress}
                    mediaListEntry={props.item.mediaListEntry}
                    mediaStatus={props.item?.status}
                    total={props.item.episodes ?? props.item.chapters ?? props.item.volumes ?? 0}
                /> */}
		</View>
	);

	// useEffect(() => {
	//     // Prefetch images in the list
	//     data?.Page?.media.forEach((media) => {
	//         const image = media?.bannerImage ?? media?.coverImage?.extraLarge ?? '';
	//         Image.prefetch(image);
	//     });
	// }, [data]);

	// if (isLoading) return <AnimatedLoading />;

	return (
		<View
			style={{
				flex: 1,
				width: width,
				justifyContent: 'center',
				marginVertical: 0,
				// minHeight: 230,
			}}
		>
			<Text
				variant="headlineLarge"
				style={{
					fontWeight: 'bold',
					marginHorizontal: 30,
					marginVertical: 10,
					textTransform: 'capitalize',
				}}
			>
				{category_title.toLowerCase()}
			</Text>
			<View
				style={{
					flex: 1,
					width: width,
				}}
			>
				{!isLoading && data ? (
					<FlashList
						data={data}
						keyExtractor={(item, idx) => idx.toString()}
						renderItem={RenderItem}
						horizontal={true}
						estimatedItemSize={170}
						removeClippedSubviews
						contentContainerStyle={{
							// paddingVertical: Platform.OS === 'web' ? 40 : 0,
							paddingHorizontal: 10,
						}}
						showsHorizontalScrollIndicator={false}
						estimatedListSize={{ height: 280, width: width }}
						// onEndReached={() => {
						//     fetchMore();
						// }}
						// drawDistance={width * 2}
					/>
				) : (
					<View
						style={{
							justifyContent: 'center',
							width: '100%',
							height: 280,
							alignItems: 'center',
						}}
					>
						<ActivityIndicator size={'large'} />
					</View>
				)}
			</View>
		</View>
	);
};

type ULSectionScrollProps = {
	category_title: string;
	data: VNUserListResponse['results'] | undefined;
	isLoading: boolean;
	emptyText?: string;
	hasMore?: boolean;
	fetchMore?: () => void;
};
export const UserListSectionScroll = ({
	data,
	category_title,
	isLoading,
	emptyText,
	hasMore,
	fetchMore,
}: ULSectionScrollProps) => {
	const { width, height } = useWindowDimensions();
	const { colors } = useTheme();

	const RenderItem = (props: { item: VNUserListResponse['results'][0] }) => (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				overflow: 'hidden',
				borderRadius: 12,
				justifyContent: 'center',
			}}
		>
			<VNCard
				coverImg={props.item.vn.image}
				titles={props.item.vn.titles}
				rating={props.item.vn.rating}
				navigate={() => router.push(`/vn/${props.item.id}`)}
				height={220}
				platforms={props.item.vn.platforms}
			/>
			{/* <MediaProgressBar
                    progress={props.item.mediaListEntry?.progress}
                    mediaListEntry={props.item.mediaListEntry}
                    mediaStatus={props.item?.status}
                    total={props.item.episodes ?? props.item.chapters ?? props.item.volumes ?? 0}
                /> */}
		</View>
	);

	return (
		<View
			style={{
				flex: 1,
				width: width,
				justifyContent: 'center',
				// maxHeight: 280,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				{/* <Text
                    variant="headlineSmall"
                    style={{
                        fontWeight: 'bold',
                        margin: 30,
                        marginVertical: 10,
                        textTransform: 'capitalize',
                    }}
                >
                    {category_title.toLowerCase()}
                </Text> */}
				<SectionHeader>{category_title.toLowerCase()}</SectionHeader>
				{!isLoading && hasMore && <IconButton icon={'chevron-right'} />}
			</View>
			<View
				style={{
					flex: 1,
					width: width,
				}}
			>
				{!isLoading && (data ?? [])?.length > 0 ? (
					<FlashList
						data={data}
						keyExtractor={(item) => item.id.toString() + category_title}
						renderItem={RenderItem}
						horizontal={true}
						estimatedItemSize={170}
						removeClippedSubviews
						contentContainerStyle={{
							// paddingVertical: Platform.OS === 'web' ? 40 : 0,
							paddingHorizontal: 10,
						}}
						showsHorizontalScrollIndicator={false}
						estimatedListSize={{ height: 280, width: width }}
						// onEndReached={() => {
						//     fetchMore();
						// }}
						// drawDistance={width * 2}
					/>
				) : !isLoading && (data ?? []).length < 1 ? (
					<View style={{ padding: 20, alignItems: 'center' }}>
						<Text>{emptyText ?? 'Nothing to see here!'}</Text>
					</View>
				) : (
					<View
						style={{
							justifyContent: 'center',
							width: '100%',
							// height: 280,
							alignItems: 'center',
						}}
					>
						{/* <Image
                            source={require('../../../assets/load.gif')}
                            style={{ alignSelf: 'center', height: 240, width: 230 }}
                            contentFit="contain"
                        /> */}
						<ActivityIndicator size={'large'} />
					</View>
				)}
			</View>
		</View>
	);
};
