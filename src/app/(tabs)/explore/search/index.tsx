import { Stack, router } from 'expo-router';
import { TextInput, View, useWindowDimensions } from 'react-native';
import { useRef, useState } from 'react';
import _ from 'lodash';
import { FlashList } from '@shopify/flash-list';
import { VNListResponse } from '@/api/vndb/types';
import { VNCard } from '@/components/cards';
import { SearchHeader } from '@/components/headers';
import useDebounce from '@/hooks/useDebounce';
import { useVNFilterStore } from '@/store/store';
import { useSearchVNs } from '@/api/vndb/queries/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { formatRequest } from '@/api/vndb/format';

const SearchPage = () => {
	const queryClient = useQueryClient();
	const { width, height } = useWindowDimensions();
	const searchbarRef = useRef<TextInput>(null);
	const { sort, reverse, filter, updateFilter } = useVNFilterStore();
	const debouncedSearch = useDebounce(filter.search ?? '', 500);

	const { data, isFetching, fetchNextPage, refetch } = useSearchVNs(
		sort,
		reverse,
		debouncedSearch,
		filter,
	);

	const openFilter = () => router.push('/explore/search/filter');

	const RenderItem = (props: { item: VNListResponse['results'][0] }) => (
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
				coverImg={props.item.image}
				titles={props.item.titles}
				rating={props.item.rating}
				navigate={() => router.push(`/vn/${props.item.id}`)}
				height={180}
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

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Stack.Screen
				options={{
					headerShown: true,
					header: (props) => (
						<SearchHeader
							{...props}
							searchbarRef={searchbarRef}
							searchTerm={filter.search ?? ''}
							setSearchTerm={(txt) => updateFilter('search', txt)}
							openFilter={openFilter}
							searchContent={async () => {
								await queryClient.invalidateQueries({
									queryKey: ['vns_search'],
									refetchType: 'all',
								});
							}}
						/>
					),
				}}
			/>
			<View
				style={{
					flex: 1,
					width: width,
				}}
			>
				<FlashList
					data={data?.pages[0].results}
					renderItem={RenderItem}
					keyExtractor={(item) => item.id}
					numColumns={3}
					estimatedItemSize={100}
					onEndReached={() =>
						data?.pages[0].more ? fetchNextPage() : console.log('END')
					}
				/>
			</View>
		</View>
	);
};

export default SearchPage;
