import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
	Button,
	Chip,
	Dialog,
	IconButton,
	List,
	Portal,
	ProgressBar,
	Text,
	Tooltip,
	useTheme,
} from 'react-native-paper';
import { TagTraitType, VNTag, VNTrait } from '@/api/vndb/types';
import { highlightUrls } from '@/utils/text';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { openDatePicker } from '@/utils/datepicker';
import { useAppTheme } from '@/providers/theme';
import { useUlistDelete } from '@/api/vndb/mutations/hooks';

type TagDialogProps = {
	visible: boolean;
	onDismiss: () => void;
	tag: VNTag | null;
};
export const TagDialog = ({ visible, onDismiss, tag }: TagDialogProps) => {
	const { colors } = useTheme();
	const Section = ({
		icon,
		children,
	}: {
		icon: IconSource;
		children: ReactNode;
		isUser?: boolean;
	}) => {
		return (
			<View style={{ flexDirection: 'row' }}>
				<IconButton icon={icon} />
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text>{children}</Text>
				</View>
			</View>
		);
	};

	return (
		<Dialog visible={visible} onDismiss={onDismiss}>
			<Dialog.Title>{tag?.name}</Dialog.Title>
			<Dialog.Content>
				<Section icon="card-text-outline">
					{highlightUrls(tag?.description, colors.primary)}
				</Section>
				<Section icon="format-list-numbered">{tag?.rating}</Section>
				{/* <Section icon="folder-outline">{tag?.category}</Section> */}
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={onDismiss}>Cool</Button>
			</Dialog.Actions>
		</Dialog>
	);
};

type DatePopupProps = {
	title: string;
	containerHeight?: number;
	value: number | null | undefined;
	onSelect: (item: number) => void;
};
export const DatePopup = ({ onSelect, containerHeight, title, value }: DatePopupProps) => {
	const [date, setDate] = useState<Date | null>(value ? new Date(value) : null);
	const { colors } = useTheme();

	const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
		if (event.type === 'set' && selectedDate) {
			const currentDate = selectedDate;
			setDate(currentDate);
			onSelect(currentDate.getTime());
		}
	};

	return (
		<>
			<Pressable
				onPress={() => openDatePicker('date', date ?? new Date(), onChange)}
				android_ripple={{
					color: colors.primary,
					borderless: true,
					foreground: true,
					radius: containerHeight ?? 40,
				}}
			>
				<List.Subheader style={{ textAlign: 'center' }}>{title}</List.Subheader>
				<Text style={{ textAlign: 'center', textTransform: 'capitalize' }}>
					{date?.toLocaleDateString() ?? 'N/A'}
				</Text>
			</Pressable>
		</>
	);
};

type DeleteEntryDialogProps = {
	vId: string;
};
export const DeleteEntryDialog = ({ vId }: DeleteEntryDialogProps) => {
	const [visible, setVisible] = useState(false);
	const onDismiss = () => setVisible(false);

	const { colors } = useAppTheme();

	const removeUlist = useUlistDelete();

	const onDelete = () => {
		removeUlist.mutate(vId);
		onDismiss();
	};

	return (
		<>
			<IconButton icon="delete" iconColor={colors.error} onPress={() => setVisible(true)} />
			<Portal>
				<Dialog visible={visible} onDismiss={onDismiss}>
					<Dialog.Title>Delete from list?</Dialog.Title>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Cancel</Button>
						<Button onPress={onDelete} textColor={colors.error}>
							Delete
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};

import { openWebBrowser } from '@/utils/webBrowser';
import { VNTagCategoryEnum } from '@/api/vndb/schema';

type UpdateDialogProps = {
	visible: boolean;
	onDismiss: () => void;
	updateLink: string | null;
};
export const UpdateDialog = ({ visible, updateLink, onDismiss }: UpdateDialogProps) => {
	const onUpdate = () => {
		openWebBrowser(updateLink);
		onDismiss();
	};
	return (
		<Dialog visible={visible} onDismiss={onDismiss}>
			<Dialog.Title>New Update</Dialog.Title>
			<Dialog.Content>
				<Text>There is a new update available!</Text>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={onDismiss}>Dismiss</Button>
				<Button onPress={onUpdate}>Update</Button>
			</Dialog.Actions>
		</Dialog>
	);
};

type TagDescDialogProps = {
	visible: boolean;
	onDismiss: () => void;
	tag: VNTag | VNTrait | null;
};
export const TagDescDialog = ({ tag, visible, onDismiss }: TagDescDialogProps) => {
	const { colors } = useAppTheme();

	const Section = ({
		icon,
		tooltipText,
		children,
	}: {
		icon: IconSource;
		children: ReactNode;
		tooltipText?: string;
	}) => {
		return (
			<View style={{ flexDirection: 'row' }}>
				<Tooltip title={tooltipText ?? ''}>
					<IconButton icon={icon} />
				</Tooltip>
				<View style={{ flex: 1, justifyContent: 'center' }}>{children}</View>
			</View>
		);
	};

	return (
		<Portal>
			<Dialog visible={visible} onDismiss={onDismiss}>
				<Dialog.Title>{tag?.name}</Dialog.Title>
				{tag?.aliases && tag.aliases.length > 0 && (
					<Dialog.Content>
						<ScrollView horizontal>
							{tag?.aliases?.map((alias, idx) => (
								<Chip key={idx} style={{ margin: 5 }}>
									{alias}
								</Chip>
							))}
						</ScrollView>
					</Dialog.Content>
				)}
				<Dialog.ScrollArea>
					<ScrollView>
						{!!(tag as VNTag)?.rating && (
							<Section icon="format-list-numbered">
								<Text>{(tag as VNTag)?.rating.toFixed(1)}</Text>
								{/* 1.2 / 3 x 100% = 40% */}
								<ProgressBar
									progress={(tag as VNTag).rating / 3}
									style={{ borderRadius: 12 }}
								/>
							</Section>
						)}
						{!!(tag as VNTag)?.category && (
							<Section icon="folder-outline">
								<Text style={{ paddingVertical: 5 }}>
									{VNTagCategoryEnum[(tag as VNTag)?.category]}
								</Text>
							</Section>
						)}
						<Section icon="card-text-outline">
							<Text style={{ paddingVertical: 5 }}>
								{highlightUrls(tag?.description, colors.primary)}
							</Text>
						</Section>
					</ScrollView>
				</Dialog.ScrollArea>
				<Dialog.Actions>
					<Button onPress={onDismiss}>Cool</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
