import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Button, Divider, Searchbar, Text, TextInput } from 'react-native-paper';
import { useMemo, useState } from 'react';
import _ from 'lodash';
import { VNFilterCharState, CharacterRole } from '@/api/vndb/types';
import { ChoiceButton, TagTraitButton } from '@/components/filter/buttons';
import { FilterSlider } from '@/components/filter/sliders';
import { CharacterFilterHeader } from '@/components/headers';
import { ListHeading } from '@/components/text';
import { useVNFilterStore } from '@/store/store';
import { CharRadioDialog, CharRadioDialogProps } from '@/components/filter/dialogs';

const SEX_OPTIONS = {
	m: 'male',
	f: 'female',
};

const MONTHS = [
	'Janurary',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const FilterCharPage = () => {
	const {
		filter,
		addCharacterFilter,
		updateTraits,
		updateCharacterFilter,
		removeCharacterFilter,
	} = useVNFilterStore();
	const [t] = useTranslation('titles', { keyPrefix: 'filter' });
	const { filter_char_id } = useLocalSearchParams<{ filter_char_id: string }>();

	const char_id = _.toNumber(filter_char_id);
	const char = useMemo(() => filter?.characters?.[char_id] ?? null, [filter]);

	const [temp_char, setTempChar] = useState<VNFilterCharState | null>(char ?? {});
	const [selectedFilter, setSelectedFilter] = useState<keyof VNFilterCharState | undefined>();
	const [vis, setVis] = useState(false);

	const onApply = () => {
		if (temp_char && !char) {
			addCharacterFilter(temp_char);
		} else if (char) {
			for (const key in temp_char) {
				updateCharacterFilter(
					char_id,
					key as keyof VNFilterCharState,
					// @ts-ignore
					temp_char[key as keyof VNFilterCharState],
				);
			}
		}
		router.back();
	};

	const onRemove = () => {
		removeCharacterFilter(char_id);
		router.back();
	};

	const updateTempChar = (key: keyof VNFilterCharState, value: any) =>
		setTempChar((prev) => ({ ...prev, [key]: value }));

	const updateTempTraits = (id: number) => {
		setTempChar((prev) => {
			if (!prev) return prev;
			const included_traits = prev.trait_in ?? [];
			const excluded_traits = prev.trait_not_in ?? [];
			if (included_traits?.includes(id)) {
				const newIncluded = included_traits.filter((tag) => tag !== id);
				return {
					...prev,
					trait_not_in: [...excluded_traits, id],
					trait_in: newIncluded.length > 0 ? newIncluded : undefined,
				};
			} else if (excluded_traits?.includes(id)) {
				const newExcluded = excluded_traits.filter((tag) => tag !== id);
				return {
					...prev,
					trait_not_in: newExcluded.length > 0 ? newExcluded : undefined,
				};
			} else {
				return {
					...prev,
					trait_in: [...included_traits, id],
				};
			}
		});
	};

	const selectFilter = (type: CharRadioDialogProps['type']) => {
		setSelectedFilter(type);
		setVis(true);
	};

	const onValueSelect = (type: keyof VNFilterCharState, value: any) => {
		switch (type) {
			case 'sex':
				updateTempChar('sex', value === 'male' ? 'm' : value === 'female' ? 'f' : value);
				break;
			case 'role':
			case 'blood_type':
			case 'cup':
			case 'cup_greater':
			case 'cup_lesser':
				updateTempChar(type, value);
				break;
			case 'birthday':
				updateTempChar(
					'birthday',
					value
						? [
								_.findIndex(MONTHS, (m) => m === value),
								temp_char?.birthday ? temp_char.birthday[1] : 0,
							]
						: undefined,
				);
				break;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<Stack.Screen
				options={{
					header: (props) => (
						<CharacterFilterHeader
							{...props}
							onApply={
								temp_char && !_.isEmpty(_.pickBy(temp_char)) ? onApply : undefined
							}
							onRemove={char ? onRemove : undefined}
						/>
					),
				}}
			/>
			<ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
				<View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 8 }}>
					<TextInput
						mode="outlined"
						label="Character Name"
						outlineStyle={{ borderRadius: 12 }}
						value={temp_char?.search ?? ''}
						onChangeText={(txt) =>
							updateTempChar('search', txt.trim().length > 0 ? txt : undefined)
						}
						right={
							temp_char?.search && (
								<TextInput.Icon
									icon="close"
									onPress={() => updateTempChar('search', undefined)}
								/>
							)
						}
					/>
				</View>
				<ChoiceButton
					title={t('Sex')}
					value={temp_char?.sex ? SEX_OPTIONS[temp_char.sex as 'm' | 'f'] : undefined}
					onPress={() => selectFilter('sex')}
				/>
				<ChoiceButton
					title={t('Role')}
					value={temp_char?.role}
					onPress={() => selectFilter('role')}
				/>
				<ChoiceButton
					title={t('Blood Type')}
					value={temp_char?.blood_type}
					onPress={() => selectFilter('blood_type')}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				{/* <ListHeading title={t('Birthday')} />
				<View style={{ flexDirection: 'row' }}>
					<ChoiceButton
						title={t('Month')}
						value={temp_char?.birthday ? MONTHS[temp_char.birthday[0]] : undefined}
                        onPress={() => selectFilter('birthday')}
					/>
					<ChoiceButton
						title={t('Day')}
						value={temp_char?.birthday ? temp_char.birthday[1] : undefined}
						onValueChange={(value) =>
							updateTempChar(
								'birthday',
								temp_char?.birthday
									? [temp_char.birthday[0], _.toNumber(value ?? 0)]
									: undefined,
							)
						}
						disabled={!temp_char?.birthday}
					/>
				</View> */}
				<ListHeading title={t('Traits')} />
				<TagTraitButton
					type={'trait'}
					values_in={temp_char?.trait_in}
					values_not_in={temp_char?.trait_not_in}
					onValueChange={updateTempTraits}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Weight')} />
				<FilterSlider
					maxVal={400}
					minVal={0}
					isWeight
					disabled={temp_char?.weight !== undefined ? true : false}
					title={`↑ ${t('Weight')}`}
					value={temp_char?.weight_greater ?? 0}
					onValChange={(val) => updateTempChar('weight_greater', val)}
				/>
				<FilterSlider
					maxVal={400}
					minVal={0}
					isWeight
					disabled={temp_char?.weight !== undefined ? true : false}
					title={`↓ ${t('Weight')}`}
					value={temp_char?.weight_lesser ?? 0}
					onValChange={(val) => updateTempChar('weight_lesser', val)}
				/>
				<FilterSlider
					maxVal={400}
					minVal={0}
					isWeight
					disabled={
						temp_char?.weight_greater !== undefined ||
						temp_char?.weight_lesser !== undefined
							? true
							: false
					}
					title={`→ ${t('Weight')} ←`}
					value={temp_char?.weight ?? 0}
					onValChange={(val) => updateTempChar('weight', val)}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Height')} />
				<FilterSlider
					maxVal={300}
					minVal={0}
					lengthUnits={['cm', 'ft']}
					title={`↑ ${t('Height')}`}
					value={temp_char?.height_greater ?? 0}
					onValChange={(val) => updateTempChar('height_greater', val)}
				/>
				<FilterSlider
					maxVal={300}
					minVal={0}
					lengthUnits={['cm', 'ft']}
					title={`↓ ${t('Height')}`}
					value={temp_char?.height_lesser ?? 0}
					onValChange={(val) => updateTempChar('height_lesser', val)}
				/>
				<FilterSlider
					maxVal={300}
					minVal={0}
					lengthUnits={['cm', 'ft']}
					title={`→ ${t('Height')} ←`}
					value={temp_char?.height ?? 0}
					onValChange={(val) => updateTempChar('height', val)}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Bust')} />
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`↑ ${t('Bust')}`}
					value={temp_char?.bust_greater ?? 0}
					onValChange={(val) => updateTempChar('bust_greater', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`↓ ${t('Bust')}`}
					value={temp_char?.bust_lesser ?? 0}
					onValChange={(val) => updateTempChar('bust_lesser', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`→ ${t('Bust')} ←`}
					value={temp_char?.bust ?? 0}
					onValChange={(val) => updateTempChar('bust', val)}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Waist')} />
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`↑ ${t('Waist')}`}
					value={temp_char?.waist_greater ?? 0}
					onValChange={(val) => updateTempChar('waist_greater', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`↓ ${t('Waist')}`}
					value={temp_char?.waist_lesser ?? 0}
					onValChange={(val) => updateTempChar('waist_lesser', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`→ ${t('Waist')} ←`}
					value={temp_char?.waist ?? 0}
					onValChange={(val) => updateTempChar('waist', val)}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Hips')} />
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`↑ ${t('Hips')}`}
					value={temp_char?.hips_greater ?? 0}
					onValChange={(val) => updateTempChar('hips_greater', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`↓ ${t('Hips')}`}
					value={temp_char?.hips_lesser ?? 0}
					onValChange={(val) => updateTempChar('hips_lesser', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					lengthUnits={['cm', 'in']}
					title={`→ ${t('Hips')} ←`}
					value={temp_char?.hips ?? 0}
					onValChange={(val) => updateTempChar('hips', val)}
				/>

				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Age')} />
				<FilterSlider
					maxVal={120}
					minVal={0}
					title={`↑ ${t('Age')}`}
					value={temp_char?.age_greater ?? 0}
					onValChange={(val) => updateTempChar('age_greater', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					title={`↓ ${t('Age')}`}
					value={temp_char?.age_lesser ?? 0}
					onValChange={(val) => updateTempChar('age_lesser', val)}
				/>
				<FilterSlider
					maxVal={120}
					minVal={0}
					title={`→ ${t('Age')} ←`}
					value={temp_char?.age ?? 0}
					onValChange={(val) => updateTempChar('age', val)}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Cup Size')} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<ChoiceButton
						title={`↑ ${t('Cup Size')}`}
						value={temp_char?.cup_greater}
						onPress={() => selectFilter('cup_greater')}
					/>
					<ChoiceButton
						title={`↓ ${t('Cup Size')}`}
						value={temp_char?.cup_lesser}
						onPress={() => selectFilter('cup_lesser')}
					/>
				</View>
				<ChoiceButton
					title={`→ ${t('Cup Size')} ←`}
					value={temp_char?.cup}
					onPress={() => selectFilter('cup')}
				/>
			</ScrollView>
			{selectedFilter && (
				<CharRadioDialog
					type={selectedFilter}
					visible={vis}
					onDismiss={() => setVis(false)}
					value={temp_char ? temp_char[selectedFilter] : undefined}
					onValueChange={(val) => {
						onValueSelect(selectedFilter, val);
						setVis(false);
					}}
				/>
			)}
		</View>
	);
};

export default FilterCharPage;
