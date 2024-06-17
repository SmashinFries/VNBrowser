import { DividerVertical } from '@/components/divider';
import { useAppTheme } from '@/providers/theme';
import { useUserAuthStore } from '@/store/store';
import { openWebBrowser } from '@/utils/webBrowser';
import { Pressable, Share, View } from 'react-native';
import { Divider, IconButton, Text } from 'react-native-paper';
import { ListEntrySheet } from '../bottomsheet';
import { useVNUserEntry } from '@/api/vndb/queries/hooks';
import { useMemo, useRef } from 'react';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { VNUserListResponse } from '@/api/vndb/types';

type UserListActionBarProps = {
	data: VNUserListResponse['results'][0] | null | undefined;
	vId: string;
};
export const UserListActionBar = ({ data, vId }: UserListActionBarProps) => {
	const { vndb } = useUserAuthStore();

	const listSheetRef = useRef<BottomSheetModalMethods>(null);

	const openSheet = () => listSheetRef.current?.present();

	if (!vndb.token) return null;

	return (
		<View style={{ paddingVertical: 5 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
				<Pressable
					onPress={() => openWebBrowser(`https://vndb.org/${vId}`)}
					style={{ alignItems: 'center' }}
				>
					<IconButton icon="earth" />
					<Text>Web View</Text>
				</Pressable>
				{/* <DividerVertical /> */}
				{data && data.labels && data.labels.length > 0 ? (
					<Pressable onPress={openSheet} style={{ alignItems: 'center' }}>
						<IconButton icon="playlist-edit" selected />
						<Text>{data.labels[0].label}</Text>
					</Pressable>
				) : (
					<Pressable onPress={openSheet} style={{ alignItems: 'center' }}>
						<IconButton icon="playlist-plus" />
						<Text>Add to List</Text>
					</Pressable>
				)}
			</View>
			<ListEntrySheet
				ulistData={data as VNUserListResponse['results'][0]}
				id={data?.id ?? ''}
				ref={listSheetRef}
			/>
		</View>
	);
};
