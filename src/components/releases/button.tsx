import { useRlistDelete, useRlistEdit } from '@/api/vndb/mutations/hooks';
import { useReleaseEntry } from '@/api/vndb/queries/hooks';
import { ReleaseStatusEnum } from '@/api/vndb/schema';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { ListRadioItem } from '../buttons';
import { useUserAuthStore } from '@/store/store';

type ReleaseListDialogProps = {
	rId: string;
};
export const ReleaseListEditButton = ({ rId }: ReleaseListDialogProps) => {
	const { vndb } = useUserAuthStore();
	const releaseEntry = useReleaseEntry(rId);
	const editRList = useRlistEdit();
	const removeRList = useRlistDelete();
	const [vis, setVis] = useState(false);

	const onDismiss = () => {
		setVis(false);
	};

	// 0 for “Unknown”, 1 for “Pending”, 2 for “Obtained”, 3 for “On loan”, 4 for “Deleted”
	const onEdit = (status: 0 | 1 | 2 | 3 | 4) => {
		editRList.mutate({ rId: rId, status: status });
		onDismiss();
	};

	if (!vndb || !vndb.token) return null;

	return (
		<>
			<Button
				mode={'elevated'}
				style={{ marginHorizontal: 20, marginTop: 20 }}
				onPress={() => setVis(true)}
			>
				{releaseEntry.data?.releases[0]?.list_status ?? 'Add to List'}
			</Button>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss}>
					<Dialog.Title>Release Entry</Dialog.Title>
					<Dialog.ScrollArea>
						<ScrollView>
							{Object.keys(ReleaseStatusEnum).map((key, idx) => (
								<ListRadioItem key={idx} title={key} isSelected={false} />
							))}
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Done</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};
