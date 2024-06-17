import { UserListHeader } from '@/components/headers';
import { TabBarWithChip } from '@/components/tabbar';
import { useAppTheme } from '@/providers/theme';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabViewProps, SceneRendererProps } from 'react-native-tab-view';
import _ from 'lodash';
import { UListLables, UlistLablesResponse, VNUserListResponse } from '@/api/vndb/types';
import { Button } from 'react-native-paper';
import { VNCard } from '@/components/cards';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { InfiniteData, QueryObserverResult } from '@tanstack/react-query';
import { useUlistLabels, useVNUserList } from '@/api/vndb/queries/hooks';

type UserListViewProps = {
	data: VNUserListResponse | null | undefined;
	onNextPage: () => void;
	refetch: () => Promise<
		QueryObserverResult<InfiniteData<VNUserListResponse | null, unknown>, Error>
	>;
};
const UserListView = ({ data, onNextPage, refetch }: UserListViewProps) => {
	const { colors } = useAppTheme();

	const RenderItem = (props: { item: VNUserListResponse['results'][0] }) => (
		<View
			style={{
				flex: 1,
				alignItems: 'center',
				overflow: 'hidden',
				borderRadius: 12,
				marginVertical: 5,
			}}
		>
			<VNCard
				coverImg={props.item.vn.image}
				titles={props.item.vn.titles}
				rating={props.item.vn.rating}
				navigate={() => router.push(`/vn/${props.item.id}`)}
				height={180}
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
	const [isRefreshing, setIsRefreshing] = useState(false);

	const onRefresh = async () => {
		setIsRefreshing(true);
		await refetch();
		setIsRefreshing(false);
	};

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: colors.surfaceContainerLow,
				height: '100%',
				width: '100%',
			}}
		>
			<View
				style={{
					flex: 1,
				}}
			>
				<FlashList
					data={data?.results}
					renderItem={RenderItem}
					keyExtractor={(item) => item.id}
					numColumns={3}
					estimatedItemSize={100}
					onEndReached={() => data?.more && onNextPage()}
					refreshing={isRefreshing}
					onRefresh={onRefresh}
				/>
			</View>
		</View>
	);
};

// TODO: add custom labels
const ListPage = () => {
	const layout = useWindowDimensions();
	const userListLabels = useUlistLabels();
	const playingList = useVNUserList(
		'Playing',
		'added',
		userListLabels?.data &&
			userListLabels?.data?.labels[0].label === 'Playing' &&
			userListLabels?.data?.labels[0].count > 0
			? true
			: false,
	);
	const wishList = useVNUserList(
		'Wishlist',
		'added',
		userListLabels?.data &&
			userListLabels?.data?.labels[4].label === 'Wishlist' &&
			userListLabels?.data?.labels[4].count > 0
			? true
			: false,
	);
	const finishedList = useVNUserList(
		'Finished',
		'added',
		userListLabels?.data &&
			userListLabels?.data?.labels[1].label === 'Finished' &&
			userListLabels?.data?.labels[1].count > 0
			? true
			: false,
	);
	const stalledList = useVNUserList(
		'Stalled',
		'added',
		userListLabels?.data &&
			userListLabels?.data?.labels[2].label === 'Stalled' &&
			userListLabels?.data?.labels[2].count > 0
			? true
			: false,
	);
	const droppedList = useVNUserList(
		'Dropped',
		'added',
		userListLabels?.data &&
			userListLabels?.data?.labels[3].label === 'Dropped' &&
			userListLabels?.data?.labels[3].count > 0
			? true
			: false,
	);
	const blackList = useVNUserList(
		'Blacklist',
		'added',
		userListLabels?.data &&
			userListLabels?.data?.labels[5].label === 'Blacklist' &&
			userListLabels?.data?.labels[5].count > 0
			? true
			: false,
	);

	const [index, setIndex] = useState(0);
	const [routes, setRoutes] = useState<{ key: UListLables; title: string }[]>([
		{ key: 'Playing', title: `Playing (0)` },
		{
			key: 'Wishlist',
			title: `Wishlist (0)`,
		},
		{ key: 'Finished', title: `Finished (0)` },
		{ key: 'Stalled', title: `Stalled (0)` },
		{ key: 'Dropped', title: `Dropped (0)` },
		{ key: 'Blacklist', title: `Blacklist (0)` },
	]);

	const renderScene = ({
		route,
	}: SceneRendererProps & {
		route: {
			key: string;
			title: string;
		};
	}) => {
		switch (route.key as UListLables) {
			case 'Playing':
				return (
					<UserListView
						data={playingList?.data?.pages[0]}
						refetch={playingList.refetch}
						onNextPage={playingList.fetchNextPage}
					/>
				);
			case 'Wishlist':
				return (
					<UserListView
						data={wishList?.data?.pages[0]}
						refetch={wishList.refetch}
						onNextPage={wishList.fetchNextPage}
					/>
				);
			case 'Finished':
				return (
					<UserListView
						data={finishedList?.data?.pages[0]}
						refetch={finishedList.refetch}
						onNextPage={finishedList.fetchNextPage}
					/>
				);
			case 'Stalled':
				return (
					<UserListView
						data={stalledList?.data?.pages[0]}
						refetch={stalledList.refetch}
						onNextPage={stalledList.fetchNextPage}
					/>
				);
			case 'Dropped':
				return (
					<UserListView
						data={droppedList?.data?.pages[0]}
						refetch={droppedList.refetch}
						onNextPage={droppedList.fetchNextPage}
					/>
				);
			case 'Blacklist':
				return (
					<UserListView
						data={blackList?.data?.pages[0]}
						refetch={blackList.refetch}
						onNextPage={blackList.fetchNextPage}
					/>
				);
			default:
				return null;
		}
	};

	const updateTabTitle = (labelData: UlistLablesResponse) => {
		setRoutes([
			{ key: 'Playing', title: `Playing (${labelData.labels[0]?.count ?? 0})` },
			{
				key: 'Wishlist',
				title: `Wishlist (${labelData.labels[4]?.count ?? 0})`,
			},
			{ key: 'Finished', title: `Finished (${labelData.labels[1]?.count ?? 0})` },
			{ key: 'Stalled', title: `Stalled (${labelData.labels[2]?.count ?? 0})` },
			{ key: 'Dropped', title: `Dropped (${labelData.labels[3]?.count ?? 0})` },
			{ key: 'Blacklist', title: `Blacklist (${labelData.labels[5]?.count ?? 0})` },
		]);
	};

	useEffect(() => {
		if (userListLabels.data) {
			updateTabTitle(userListLabels.data);
		}
	}, [userListLabels?.data]);

	return (
		<>
			<UserListHeader />
			{routes.length > 0 ? (
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={{ width: layout.width }}
					renderTabBar={TabBarWithChip}
				/>
			) : null}
		</>
	);
};

export default ListPage;
