import { useUlistDelete, useUlistEdit } from '@/api/vndb/mutations/hooks';
import { VNRating, VNUlistPatchParams, VNUserListResponse } from '@/api/vndb/types';
import { useAppTheme } from '@/providers/theme';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useMemo, useState } from 'react';
import { Pressable, View, ViewStyle, useWindowDimensions } from 'react-native';
import { Button, Divider, IconButton, List, Portal, Text } from 'react-native-paper';
import { LabelDropDown } from './dropdown';
import { DatePopup, DeleteEntryDialog } from '../dialogs';
import { VoteInputDialog } from './input';
import { DividerVertical } from '../divider';
import _ from 'lodash';
import { sendToast } from '@/utils/toast';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

type EntryNumInputProps = {
	style?: ViewStyle;
	value: number | Date | undefined | null;
	selectionType: 'finished' | 'started' | 'vote';
	onSelect: (type: EntryNumInputProps['selectionType'], val: number | Date) => void;
};
const EntryNumInput = ({ style, value, selectionType, onSelect }: EntryNumInputProps) => {
	const [showVotePick, setShowVotePick] = useState(false);
	const [containerHeight, setContainerHeight] = useState(0);

	const { colors } = useAppTheme();

	return (
		<>
			<Pressable
				onLayout={({ nativeEvent }) =>
					setContainerHeight(Math.floor(nativeEvent.layout.height - 10))
				}
				android_ripple={{
					color: colors.primary,
					borderless: true,
					foreground: true,
					radius: containerHeight ?? 40,
				}}
				onPress={() => {
					selectionType === 'vote' && setShowVotePick(true);
				}}
				style={[style]}
			>
				{selectionType === 'vote' ? (
					<>
						<List.Subheader
							style={{ textAlign: 'center', textTransform: 'capitalize' }}
						>
							{selectionType}
						</List.Subheader>
						<Text style={{ textAlign: 'center', textTransform: 'capitalize' }}>
							{(value as number) ?? 'N/A'}
						</Text>
					</>
				) : null}
				{(selectionType === 'finished' || selectionType === 'started') && (
					<DatePopup
						value={value as number}
						title={selectionType === 'finished' ? 'End Date' : 'Start Date'}
						containerHeight={containerHeight}
						onSelect={(item) => onSelect(selectionType, item)}
					/>
				)}
			</Pressable>
			{selectionType === 'vote' && (
				<Portal>
					<VoteInputDialog
						visible={showVotePick}
						onDismiss={() => setShowVotePick(false)}
						initVote={value as number}
						onVote={() => null}
					/>
				</Portal>
			)}
		</>
	);
};

type ListEntrySheetProps = {
	id: string;
	ulistData: VNUserListResponse['results'][0] | undefined;
};

export const ListEntrySheet = React.forwardRef<BottomSheetModalMethods, ListEntrySheetProps>(
	(props, ref) => {
		const { height } = useWindowDimensions();
		const { colors } = useAppTheme();
		const [mainEntryHeight, setMainEntryHeight] = useState(0);
		const snapPoints = useMemo(
			() => [
				`${(
					(mainEntryHeight / height > 0 ? (mainEntryHeight + 20) / height : 0.3) * 100
				).toFixed(4)}%`,
				'50%',
				'100%',
			],
			[mainEntryHeight, height],
		);

		const editUlist = useUlistEdit();

		const [tempNote, setTempNote] = useState(props.ulistData?.notes ?? '');

		const updateEntry = async (
			key: keyof VNUlistPatchParams,
			value: string | Date | number[] | VNRating | null,
		) => {
			await editUlist.mutateAsync({ id: props.id, [key]: value });
		};

		const onNoteSubmit = () => {
			updateEntry('notes', tempNote);
			sendToast('Notes Updated', 4);
		};

		return (
			<>
				<BottomSheetModal
					ref={ref}
					index={0}
					snapPoints={snapPoints}
					backgroundStyle={{ backgroundColor: colors.surface }}
					handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
					backdropComponent={(props) => (
						<BottomSheetBackdrop
							{...props}
							pressBehavior={'close'}
							disappearsOnIndex={-1}
						/>
					)}
				>
					<BottomSheetScrollView style={{ flex: 1 }} nestedScrollEnabled>
						<View
							onLayout={({ nativeEvent }) =>
								setMainEntryHeight(nativeEvent.layout.height)
							}
						>
							<View
								style={{
									justifyContent: 'space-evenly',
									paddingVertical: 10,
									marginHorizontal: 20,
									flexDirection: 'row',
								}}
							>
								<LabelDropDown
									values={props.ulistData?.labels}
									onConfirm={(ids) => updateEntry('labels', ids)}
								/>
								{props.ulistData?.id && (
									<DeleteEntryDialog vId={props.ulistData?.id} />
								)}
							</View>
							{/* <View
                                style={{
                                    height: 0.5,
                                    width: '90%',
                                    alignSelf: 'center',
                                    backgroundColor: '#000',
                                }}
                            /> */}
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-evenly',
									alignItems: 'center',
									paddingVertical: 10,
									overflow: 'hidden',
								}}
							>
								{/* <DividerVertical /> */}
								<EntryNumInput
									selectionType="vote"
									value={props.ulistData?.vote}
									onSelect={() => null}
								/>
								{/* <View
                                    style={{
                                        height: '100%',
                                        width: 0.5,
                                        backgroundColor: colors.outlineVariant,
                                    }}
                                /> */}
								{/* <DividerVertical /> */}
							</View>
							{/* <View
                                style={{
                                    height: 0.5,
                                    width: '90%',
                                    alignSelf: 'center',
                                    backgroundColor: '#000',
                                }}
                            /> */}
							<Divider style={{ width: '90%', alignSelf: 'center' }} />
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-evenly',
									alignItems: 'center',
									paddingVertical: 10,
									overflow: 'hidden',
								}}
							>
								<EntryNumInput
									selectionType="started"
									onSelect={(type, val) => updateEntry(type, val as Date)}
									value={props.ulistData?.started ?? null}
								/>
								<DividerVertical />
								<EntryNumInput
									selectionType="finished"
									onSelect={(type, val) => updateEntry(type, val as Date)}
									value={props.ulistData?.finished ?? null}
								/>
							</View>
							<List.Section title="Notes">
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-around',
										marginHorizontal: 12,
									}}
								>
									<BottomSheetTextInput
										multiline
										value={tempNote}
										clearButtonMode="while-editing"
										onChangeText={(text) => setTempNote(text)}
										onSubmitEditing={onNoteSubmit}
										style={{
											// alignSelf: 'stretch',

											marginBottom: 12,
											padding: 12,
											borderRadius: 12,
											backgroundColor: colors.elevation.level1,
											color: colors.onSurface,
											fontSize: 14,
											width: '100%',
											flexShrink: 1,
										}}
									/>
									<IconButton
										icon="check"
										onPress={onNoteSubmit}
										style={{ flexGrow: 2 }}
									/>
								</View>
							</List.Section>
						</View>
					</BottomSheetScrollView>
				</BottomSheetModal>
			</>
		);
	},
);
