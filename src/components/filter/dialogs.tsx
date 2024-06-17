import {
	DevStatusEnum,
	ExternalLinks,
	LanguageEnum,
	PlatformsEnum,
	VNLengthEnum,
	VNSearchSortOptions,
	VoiceEnum,
} from '@/api/vndb/schema';
import { CharacterRole, VNFilterCharState, VNFilterState, VNSortOptions } from '@/api/vndb/types';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Button, Dialog, List, Portal, TextInput } from 'react-native-paper';

const LanguageOptions = _.uniq([
	'any',
	LanguageEnum['ja'],
	LanguageEnum['en'],
	...Object.values(LanguageEnum),
]);
const PlatformOptions = ['any', ...Object.values(PlatformsEnum).sort((a, b) => a.localeCompare(b))];
const RatingOptions = ['any', ..._.range(10, 101)];
const VoteOptions = ['any', ..._.range(1, 101)];
const LengthOptions = ['any', ...Object.values(VNLengthEnum).filter((val) => !_.isNumber(val))];
const AgeOptions = ['any', ..._.range(0, 19)];
const ExternalLinksOptions = _.uniq([
	'any',
	...ExternalLinks.map((site) => site.label).sort((a, b) => a.localeCompare(b)),
]).filter((val) => val !== '');
const VoicedOptions = ['any', VoiceEnum[1], VoiceEnum[2], VoiceEnum[3], VoiceEnum[4]];

const getFilterOptions = (type: keyof VNFilterState | 'sort'): (string | number)[] => {
	switch (type) {
		case 'olang':
		case 'lang':
			return LanguageOptions;
		case 'platform':
			return PlatformOptions;
		case 'rating_greater':
		case 'rating_lesser':
			return RatingOptions;
		case 'votecount_greater':
		case 'votecount_lesser':
			return VoteOptions;
		case 'voiced':
			return VoicedOptions;
		case 'length':
		case 'length_greater':
		case 'length_lesser':
			return LengthOptions;
		case 'minage_greater':
		case 'minage_lesser':
			return AgeOptions;
		case 'extlink':
			return ExternalLinksOptions;
		case 'sort':
			return VNSearchSortOptions;
		case 'devstatus':
			// 0 meaning ‘Finished’, 1 is ‘In development’ and 2 for ‘Cancelled’
			return ['any', DevStatusEnum[0], DevStatusEnum[1], DevStatusEnum[2]];
		default:
			return [];
	}
};

const SexOptions = [
	'any',
	...Object.values({
		m: 'male',
		f: 'female',
	}),
];
const RoleOptions = ['any', 'main', 'primary', 'side', 'appears'] as CharacterRole[];
const BloodTypeOptions = ['A', 'B', 'AB', 'O'];
const CupSizeOptions = [
	'any',
	'AAA',
	'AA',
	...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
];
// const BirthdayMonthOptions = [
// 	'any',
// 	'Janurary',
// 	'February',
// 	'March',
// 	'April',
// 	'May',
// 	'June',
// 	'July',
// 	'August',
// 	'September',
// 	'October',
// 	'November',
// 	'December',
// ];
// const BirthdayDayOptions = ['any', ..._.range(1, 32)];

const getCharOptions = (type: keyof VNFilterCharState) => {
	switch (type) {
		case 'sex':
			return SexOptions;
		case 'role':
			return RoleOptions;
		case 'blood_type':
			return BloodTypeOptions;
		case 'cup':
		case 'cup_greater':
		case 'cup_lesser':
			return CupSizeOptions;
	}
};

export type FilterRadioDialogProps = {
	type: keyof VNFilterState | 'sort';
	value: string | number | boolean | number[] | Date | VNFilterCharState[] | undefined;
	visible: boolean;
	onValueChange: (value: string | undefined) => void;
	onDismiss: () => void;
};
export const FilterRadioDialog = ({
	type,
	visible,
	value,
	onValueChange,
	onDismiss,
}: FilterRadioDialogProps) => {
	const options = useMemo(() => getFilterOptions(type), [type]);

	const getIsChecked = (val: string | number): 'radiobox-marked' | 'radiobox-blank' => {
		switch (type) {
			case 'length':
			case 'length_greater':
			case 'length_lesser':
				if (value === VNLengthEnum[val as number] || (!value && val === 'any')) {
					return 'radiobox-marked';
				} else {
					return 'radiobox-blank';
				}
			case 'voiced':
				if (value === VoiceEnum[val as number] || (!value && val === 'any')) {
					return 'radiobox-marked';
				} else {
					return 'radiobox-blank';
				}
			default:
				return value === (typeof val === 'string' ? val.toLowerCase() : val) ||
					(!value && (typeof val === 'string' ? val.toLowerCase() : val) === 'any')
					? 'radiobox-marked'
					: 'radiobox-blank';
		}
	};

	return (
		<Portal>
			<Dialog visible={visible} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
				<Dialog.Title style={{ textTransform: 'capitalize' }}>
					{type.replaceAll('_', ' ')}
				</Dialog.Title>
				<Dialog.ScrollArea>
					<ScrollView>
						{/* <Button onPress={() => console.log(value, val)}>TEST VALUE</Button> */}
						{options?.map((val, idx) => (
							<List.Item
								key={idx}
								title={_.isString(val) ? val.replaceAll('_', ' ') : `${val}`}
								onPress={() => {
									onValueChange(val !== 'any' ? `${val}` : undefined);
								}}
								// onPress={() => console.log(val)}
								titleStyle={{ textTransform: 'capitalize' }}
								left={(props) => <List.Icon {...props} icon={getIsChecked(val)} />}
							/>
						))}
					</ScrollView>
				</Dialog.ScrollArea>
				{(type === 'votecount_greater' || type === 'votecount_lesser') && (
					<Dialog.Content>
						<TextInput
							value={`${value ?? ''}`}
							mode="flat"
							inputMode="numeric"
							onChangeText={onValueChange}
						/>
						<Button onPress={() => onValueChange(undefined)}>Clear</Button>
					</Dialog.Content>
				)}
				<Dialog.Actions>
					<Button onPress={onDismiss}>Done</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};

export type CharRadioDialogProps = {
	type: keyof VNFilterCharState;
	value: string | number | any[] | undefined;
	visible: boolean;
	onValueChange: (value: string | undefined) => void;
	onDismiss: () => void;
};
export const CharRadioDialog = ({
	type,
	value,
	visible,
	onDismiss,
	onValueChange,
}: CharRadioDialogProps) => {
	const options = useMemo(() => getCharOptions(type), [type]);

	// const getIsChecked = (val: string | number): 'radiobox-marked' | 'radiobox-blank' => {
	// 	switch (type) {
	// 		case 'length':
	// 		case 'length_greater':
	// 		case 'length_lesser':
	// 			if (value === VNLengthEnum[val as number] || (!value && val === 'any')) {
	// 				return 'radiobox-marked';
	// 			} else {
	// 				return 'radiobox-blank';
	// 			}
	// 		case 'voiced':
	// 			if (value === VoiceEnum[val as number] || (!value && val === 'any')) {
	// 				return 'radiobox-marked';
	// 			} else {
	// 				return 'radiobox-blank';
	// 			}
	// 		default:
	// return value === (typeof val === 'string' ? val.toLowerCase() : val) ||
	// 	(!value && (typeof val === 'string' ? val.toLowerCase() : val) === 'any')
	// 	? 'radiobox-marked'
	// 	: 'radiobox-blank';
	// 	}
	// };

	return (
		<Portal>
			<Dialog visible={visible} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
				<Dialog.Title style={{ textTransform: 'capitalize' }}>
					{type.replaceAll('_', ' ')}
				</Dialog.Title>
				<Dialog.ScrollArea>
					<ScrollView>
						{/* <Button onPress={() => console.log(value, val)}>TEST VALUE</Button> */}
						{options?.map((val, idx) => (
							<List.Item
								key={idx}
								title={_.isString(val) ? val.replaceAll('_', ' ') : `${val}`}
								onPress={() => {
									onValueChange(val !== 'any' ? `${val}` : undefined);
								}}
								// onPress={() => console.log(val)}
								titleStyle={{ textTransform: 'capitalize' }}
								left={(props) => (
									<List.Icon
										{...props}
										icon={
											value ===
												(typeof val === 'string'
													? val.toLowerCase()
													: val) ||
											(!value &&
												(typeof val === 'string'
													? val.toLowerCase()
													: val) === 'any')
												? 'radiobox-marked'
												: 'radiobox-blank'
										}
									/>
								)}
							/>
						))}
					</ScrollView>
				</Dialog.ScrollArea>
				<Dialog.Actions>
					<Button onPress={onDismiss}>Done</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};
