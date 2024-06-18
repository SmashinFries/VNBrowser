import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
	Button,
	Card,
	Checkbox,
	Chip,
	Dialog,
	List,
	Portal,
	Searchbar,
	Text,
	TextInput,
} from 'react-native-paper';
import _ from 'lodash';
import TAGS from '../../../assets/vndb-tags-latest.json';
import TRAITS from '../../../assets/vndb-traits-latest.json';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { DevStatusLevel, TagTraitType } from '@/api/vndb/types';
import { useVNFilterStore } from '@/store/store';
import { getDatetoReleasedString } from '@/utils/time';
import { ListHeading } from '../text';

type ChoiceButtonProps = {
	title: string;
	value: string | number | DevStatusLevel | undefined;
	disabled?: boolean;
	onPress: () => void;
};
export const ChoiceButton = ({ title, value, disabled, onPress }: ChoiceButtonProps) => {
	return (
		<View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 8 }}>
			<Pressable disabled={disabled} onPress={onPress}>
				<TextInput
					value={value ? `${value}`.replaceAll('_', ' ') : 'Any'}
					editable={false}
					mode="outlined"
					label={title}
					multiline
					contentStyle={{
						textTransform: 'capitalize',
						textDecorationLine: disabled ? 'line-through' : undefined,
					}}
					outlineStyle={{ borderRadius: 12 }}
					right={<TextInput.Icon icon="chevron-down" onPress={onPress} />}
				/>
			</Pressable>
			{/* <Portal>
				<Dialog visible={vis} onDismiss={() => setVis(false)} style={{ maxHeight: '90%' }}>
					<Dialog.Title>{title}</Dialog.Title>
					{options && (
						<Dialog.ScrollArea>
							<ScrollView>
								{options.map((val, idx) => (
									<List.Item
										key={idx}
										title={
											_.isString(val) ? val.replaceAll('_', ' ') : `${val}`
										}
										onPress={() =>
											onValueChange(val !== 'any' ? `${val}` : undefined)
										}
										titleStyle={{ textTransform: 'capitalize' }}
										left={(props) => (
											<List.Icon
												{...props}
												icon={
													value === val || (!value && val === 'any')
														? 'radiobox-marked'
														: 'radiobox-blank'
												}
											/>
										)}
									/>
								))}
							</ScrollView>
						</Dialog.ScrollArea>
					)}
					{isTextInput && (
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
						<Button onPress={() => setVis(false)}>Done</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal> */}
		</View>
	);
};

type DateButtonProps = {
	title: string;
	value: Date | undefined;
	onDateSelection: (date: Date | undefined) => void;
	disabled?: boolean;
};
export const DateButton = ({ title, value, onDateSelection, disabled }: DateButtonProps) => {
	const [date, setDate] = useState<Date>(value ? value : new Date());

	const onChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
		if (event.type === 'set') {
			if (selectedDate === undefined) return;
			const currentDate = new Date(selectedDate);
			currentDate.setDate(currentDate.getDate() - 1);

			setDate(selectedDate);
			onDateSelection(currentDate);
		}
	};

	const showDatePicker = () => {
		DateTimePickerAndroid.open({
			value: date,
			onChange,
			mode: 'date',
		});
	};

	return (
		<View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 8 }}>
			<Pressable disabled={disabled} onPress={showDatePicker}>
				<TextInput
					value={value ? `${getDatetoReleasedString(value)}`.replaceAll('_', ' ') : 'Any'}
					editable={false}
					mode="outlined"
					label={title}
					contentStyle={{
						textTransform: 'capitalize',
						textDecorationLine: disabled ? 'line-through' : undefined,
					}}
					left={
						<TextInput.Icon
							icon={value ? 'calendar-remove' : 'calendar'}
							onPress={() => (value ? onDateSelection(undefined) : showDatePicker())}
						/>
					}
					outlineStyle={{ borderRadius: 12 }}
				/>
			</Pressable>
		</View>
	);
};

type TagTraitChipProps = {
	title: string;
	isIn?: boolean;
	isNotIn?: boolean;
	onPress: () => void;
};
export const TagTraitChip = ({ title, isIn, isNotIn, onPress }: TagTraitChipProps) => {
	return (
		<Chip
			mode="outlined"
			style={{
				margin: 5,
				borderColor: isIn ? 'green' : isNotIn ? 'red' : undefined,
				borderWidth: isIn || isNotIn ? 1 : undefined,
			}}
			selected={isIn || isNotIn}
			// selectedColor={isIn ? 'green' : isNotIn ? 'red' : undefined}
			onPress={() => {
				// setIsSelected((prev) => !prev);
				onPress();
			}}
		>
			{title}
		</Chip>
	);
};

// const RenderItem = () => {
//     return(
//         <View>
//                                     {/* Causes lag upon clearing query */}
//                                     {query.length < 1 && (
//                                         <ListHeading
//                                             title={`${(_.find(type === 'tag' ? TAGS : TRAITS, { id: item.parent }) as TagTraitType[0])?.name}`}
//                                         />
//                                     )}
//                                     {item.ids.map(
//                                         (val, idx) =>
//                                             (
//                                                 _.find(type === 'tag' ? TAGS : TRAITS, {
//                                                     id: val,
//                                                     searchable: true,
//                                                 }) as TagTraitType[0]
//                                             )?.name.includes(query) && (
//                                                 <TagTraitChip
//                                                     key={idx}
//                                                     title={
//                                                         (
//                                                             _.find(type === 'tag' ? TAGS : TRAITS, {
//                                                                 id: val,
//                                                             }) as TagTraitType[0]
//                                                         )?.name
//                                                     }
//                                                     isIn={values_in?.includes(val)}
//                                                     isNotIn={values_not_in?.includes(val)}
//                                                     onPress={() => onValueChange(val)}
//                                                 />
//                                             ),
//                                     )}
//                                 </View>
//     );
// };

const TagCategories = TAGS.filter((tag) => !tag.searchable).sort((a, b) =>
	a.name.localeCompare(b.name),
);
const TraitCategories = TRAITS.filter((trait) => !trait.searchable).sort((a, b) =>
	a.name.localeCompare(b.name),
);

const searchableTags: typeof TAGS = TAGS.filter((tg) => tg.searchable).sort((a, b) =>
	a.name.localeCompare(b.name),
);

type TagTraitButtonProps = {
	type?: 'tag' | 'trait';
	values_in: number[] | undefined;
	values_not_in: number[] | undefined;
	onValueChange: (value: number) => void;
};
export const TagTraitButton = ({
	type,
	values_in,
	values_not_in,
	onValueChange,
}: TagTraitButtonProps) => {
	const [vis, setVis] = useState(false);
	const [query, setQuery] = useState('');
	// const tags: TagTraitType = ((type === 'tag' ? TAGS : TRAITS) as TagTraitType)
	// 	.filter((tg) => tg.searchable)
	// 	.sort((a, b) => a.name.localeCompare(b.name));
	const listRef = useRef<FlashList<TagTraitType> | null>(null);

	return (
		<View>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{values_in?.map((val, idx) => (
					<TagTraitChip
						key={idx}
						title={
							(_.find(type === 'tag' ? TAGS : TRAITS, { id: val }) as TagTraitType[0])
								?.name
						}
						isIn
						onPress={() => {
							onValueChange(val);
							// console.log('tag:', val);
						}}
					/>
				))}
				{values_not_in?.map((val, idx) => (
					<TagTraitChip
						key={idx}
						title={
							(_.find(type === 'tag' ? TAGS : TRAITS, { id: val }) as TagTraitType[0])
								?.name
						}
						isNotIn
						onPress={() => {
							onValueChange(val);
							// console.log('tag:', val);
						}}
					/>
				))}
			</ScrollView>
			<Button
				labelStyle={{ textTransform: 'capitalize' }}
				mode="elevated"
				onPress={() => setVis(true)}
				style={{ margin: 8 }}
			>
				+
			</Button>
			<Portal>
				<Dialog visible={vis} onDismiss={() => setVis(false)} style={{ maxHeight: '90%' }}>
					<Dialog.Title>Tags</Dialog.Title>
					<Dialog.Content>
						<Searchbar
							value={query}
							onChangeText={(txt) => setQuery(txt)}
							onClearIconPress={() => setQuery('')}
							mode="view"
						/>
						{/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {categories.map((cat, idx) => (
                                <Button
                                    key={idx}
                                    onPress={() =>
                                        listRef.current?.scrollToIndex({
                                            index: _.findIndex(cat_ids, { parent: cat.id }),
                                            animated: true,
                                        })
                                    }
                                >
                                    {cat.name}
                                </Button>
                            ))}
                        </ScrollView> */}
					</Dialog.Content>
					<Dialog.ScrollArea style={{ height: '100%' }}>
						<FlashList
							keyboardDismissMode="on-drag"
							// ref={listRef}
							data={searchableTags.filter((tag) => tag.name.includes(query))}
							keyExtractor={(_, idx) => idx.toString()}
							estimatedItemSize={44}
							renderItem={({ item }) => (
								<TagTraitChip
									title={item.name}
									isIn={values_in?.includes(item.id)}
									isNotIn={values_not_in?.includes(item.id)}
									onPress={() => onValueChange(item.id)}
								/>
							)}
						/>
						{/* <FlashList
                            keyboardDismissMode="on-drag"
                            ref={listRef}
                            data={cat_ids}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={({ item }) => (
                                
                            )}
                            estimatedItemSize={34}
                        /> */}
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={() => setVis(false)}>Done</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
};

type CheckBoxButtonProps = {
	label: string;
	value?: boolean | undefined;
	onPress: (value: boolean | undefined) => void;
};
export const CheckBoxButton = ({ label, value, onPress }: CheckBoxButtonProps) => {
	return (
		<Checkbox.Item
			position="trailing"
			label={label}
			status={
				value === undefined ? 'indeterminate' : value === true ? 'checked' : 'unchecked'
			}
			onPress={() => onPress(value === undefined ? true : value === true ? false : undefined)}
		/>
	);
};

type CharacterItemProps = {
	id: number;
};
export const CharacterItem = ({ id }: CharacterItemProps) => {
	const { filter } = useVNFilterStore();
	return (
		// <Pressable onPress={() => router.push('/explore/search/filterChar')}>
		//     <View>
		//         <Text>{filter?.characters?.[id]?.role ?? 'Unknown'}</Text>
		//     </View>
		// </Pressable>
		<Card
			mode="elevated"
			style={{ marginBottom: 10 }}
			onPress={() => router.push(`/explore/search/filter/${id}`)}
		>
			<Card.Title title={`# ${id}`} />
			<Card.Content>
				{filter?.characters?.[id]?.search && (
					<Text>Name: {filter.characters[id].search}</Text>
				)}
				{filter?.characters?.[id]?.role && <Text>Role: {filter.characters[id].role}</Text>}
				{filter?.characters?.[id]?.sex && (
					<Text>Sex: {filter.characters[id].sex === 'f' ? 'Female' : 'Male'}</Text>
				)}
			</Card.Content>
		</Card>
	);
};
