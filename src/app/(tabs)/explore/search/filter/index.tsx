import { ScrollView, View } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
	VNSearchSortOptions,
	DevStatusEnum,
	LanguageEnum,
	PlatformsEnum,
	ExternalLinks,
	VoiceEnum,
	VNLengthEnum,
} from '@/api/vndb/schema';
import { VNSortOptions } from '@/api/vndb/types';
import {
	ChoiceButton,
	CheckBoxButton,
	TagTraitButton,
	DateButton,
	CharacterItem,
} from '@/components/filter/buttons';
import { ListHeading } from '@/components/text';
import { useVNFilterStore } from '@/store/store';
import { useState } from 'react';
import { FilterRadioDialog, FilterRadioDialogProps } from '@/components/filter/dialogs';

const FilterPage = () => {
	const { sort, filter, updateFilter, onSortChange, updateTags } = useVNFilterStore();
	const [t] = useTranslation('titles', { keyPrefix: 'filter' });
	const [selectedFilter, setSelectedFilter] = useState<
		FilterRadioDialogProps['type'] | undefined
	>(undefined);
	const [visible, setVisible] = useState(false);

	const selectFilter = (type: FilterRadioDialogProps['type']) => {
		setSelectedFilter(type);
		setVisible(true);
	};

	const onValueSelect = (type: FilterRadioDialogProps['type'] | 'sort', val: any) => {
		switch (type) {
			case 'sort':
				onSortChange(val as VNSortOptions);
				break;
			case 'devstatus':
				updateFilter(
					'devstatus',
					val === 'any' ? undefined : DevStatusEnum[val as keyof typeof DevStatusEnum],
				);
				break;
			case 'extlink':
				// console.log(type, val);
				updateFilter('extlink', _.find(ExternalLinks, { label: val })?.name);
				break;
			case 'voiced':
				updateFilter(
					'voiced',
					val === 'any' ? undefined : VoiceEnum[val as keyof typeof VoiceEnum],
				);
				break;
			case 'minage_greater':
			case 'minage_lesser':
				updateFilter(type, _.toNumber(val));
				break;
			case 'olang':
			case 'lang':
				updateFilter(
					type,
					val === 'any'
						? undefined
						: Object.keys(LanguageEnum).find(
								(key) => LanguageEnum[key as keyof typeof LanguageEnum] === val,
							),
				);
				break;
			case 'platform':
				updateFilter(
					'platform',
					val === 'any'
						? undefined
						: Object.keys(PlatformsEnum).find(
								(key) => PlatformsEnum[key as keyof typeof PlatformsEnum] === val,
							),
				);
				break;
			case 'rating_greater':
			case 'rating_lesser':
			case 'votecount_greater':
			case 'votecount_lesser':
				updateFilter(type, val === 'any' ? undefined : _.toNumber(val));
				break;
			case 'length_greater':
			case 'length_lesser':
			case 'length':
				updateFilter(type, val === 'any' ? undefined : _.toNumber(VNLengthEnum[val]));
				break;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingVertical: 15 }}
			>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<ChoiceButton
						title={t('Sort')}
						value={sort}
						onPress={() => selectFilter('sort')}
					/>
					<ChoiceButton
						title={t('Dev Status')}
						value={DevStatusEnum[filter.devstatus as number]}
						onPress={() => selectFilter('devstatus')}
					/>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<View
						style={{
							paddingTop: 15,
						}}
					>
						<CheckBoxButton
							label={t('Has Anime')}
							value={filter.has_anime}
							onPress={(val) => updateFilter('has_anime', val)}
						/>
						<CheckBoxButton
							label={t('Has Review')}
							value={filter.has_review}
							onPress={(val) => updateFilter('has_review', val)}
						/>
						<CheckBoxButton
							label={t('Has Ero')}
							value={filter.has_ero}
							onPress={(val) => updateFilter('has_ero', val)}
						/>
					</View>
					<View
						style={{
							paddingTop: 15,
						}}
					>
						<CheckBoxButton
							label={t('Has Screenshots')}
							value={filter.has_screenshot}
							onPress={(val) => updateFilter('has_screenshot', val)}
						/>
						<CheckBoxButton
							label={t('Has Description')}
							value={filter.has_description}
							onPress={(val) => updateFilter('has_description', val)}
						/>
						<CheckBoxButton
							label={t('Has Uncensored')}
							value={filter.uncensored}
							onPress={(val) => updateFilter('uncensored', val)}
						/>
					</View>
				</View>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Language')} />
				<View>
					<ChoiceButton
						title="Original"
						value={LanguageEnum[filter.olang as keyof typeof LanguageEnum]}
						onPress={() => selectFilter('olang')}
					/>
					<ChoiceButton
						title="Translated"
						value={LanguageEnum[filter.lang as keyof typeof LanguageEnum]}
						onPress={() => selectFilter('lang')}
					/>
				</View>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Tags')} />
				<TagTraitButton
					type="tag"
					values_in={filter.tag_in}
					values_not_in={filter.tag_not_in}
					onValueChange={(val) => updateTags(val)}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Platform')} />
				<ChoiceButton
					title={t('Platform')}
					value={PlatformsEnum[filter.platform as keyof typeof PlatformsEnum]}
					onPress={() => selectFilter('platform')}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Dates')} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<DateButton
						title={`↑ ${t('Release')}`}
						value={filter.released_greater}
						onDateSelection={(val) => updateFilter('released_greater', val)}
						disabled={filter.released && true}
					/>
					<DateButton
						title={`↓ ${t('Release')}`}
						value={filter.released_lesser}
						onDateSelection={(val) => updateFilter('released_lesser', val)}
						disabled={filter.released && true}
					/>
				</View>
				<DateButton
					title={`→ ${t('Release')} ←`}
					value={filter.released}
					onDateSelection={(val) => updateFilter('released', val)}
					disabled={(filter.released_greater && true) || (filter.released_lesser && true)}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={`${t('Rating')} / ${t('Vote Counts')}`} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<ChoiceButton
						title={`↑ ${t('Rating')}`}
						value={filter.rating_greater}
						onPress={() => selectFilter('rating_greater')}
					/>
					<ChoiceButton
						title={`↓ ${t('Rating')}`}
						value={filter.rating_lesser}
						onPress={() => selectFilter('rating_lesser')}
					/>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<ChoiceButton
						title={`↑ ${t('Vote Count')}`}
						value={filter.votecount_greater}
						onPress={() => selectFilter('votecount_greater')}
					/>
					<ChoiceButton
						title={`↓ ${t('Vote Count')}`}
						value={filter.votecount_lesser}
						onPress={() => selectFilter('votecount_lesser')}
					/>
				</View>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Length')} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<ChoiceButton
						title={`↑ ${t('Length')}`}
						value={filter.length_greater && VNLengthEnum[filter.length_greater]}
						onPress={() => selectFilter('length_greater')}
					/>
					<ChoiceButton
						title={`↓ ${t('Length')}`}
						value={filter.length_lesser && VNLengthEnum[filter.length_lesser]}
						onPress={() => selectFilter('length_lesser')}
					/>
				</View>
				<ChoiceButton
					title={`→ ${t('Length')} ←`}
					value={filter.length && VNLengthEnum[filter.length]}
					onPress={() => selectFilter('length')}
				/>
				<Divider style={{ marginHorizontal: 15 }} />

				<ListHeading title={t('Minimum Age Rating')} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<ChoiceButton
						title={`↑ ${t('Age')}`}
						value={filter.minage_greater}
						onPress={() => selectFilter('minage_greater')}
					/>
					<ChoiceButton
						title={`↓ ${t('Age')}`}
						value={filter.minage_lesser}
						onPress={() => selectFilter('minage_lesser')}
					/>
				</View>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={`${t('External Link')} / ${t('Store')}`} />
				<ChoiceButton
					title={t('External Link')}
					value={_.find(ExternalLinks, { name: filter.extlink })?.label}
					onPress={() => selectFilter('extlink')}
				/>
				<Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Voiced')} />
				<ChoiceButton
					title={t('Voiced')}
					value={VoiceEnum[filter.voiced as number]}
					onPress={() => selectFilter('voiced')}
				/>
				{/* Disabled Characters for now! */}
				{/* <Divider style={{ marginHorizontal: 15 }} />
				<ListHeading title={t('Characters')} />
				{filter.characters && (
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{filter.characters?.map((char, idx) => (
							<CharacterItem key={idx} id={idx} />
						))}
					</ScrollView>
				)}
				<Button
					mode="elevated"
					style={{ margin: 8 }}
					onPress={() => router.push(`explore/search/filter/0`)}
				>
					+
				</Button> */}
			</ScrollView>
			{selectedFilter && (
				<FilterRadioDialog
					visible={visible}
					onDismiss={() => setVisible(false)}
					type={selectedFilter}
					value={selectedFilter === 'sort' ? sort : filter[selectedFilter]}
					onValueChange={(val) => {
						onValueSelect(selectedFilter, val);
						setVisible(false);
					}}
				/>
			)}
		</View>
	);
};

export default FilterPage;
