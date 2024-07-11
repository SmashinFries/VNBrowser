import { useAppTheme, useThemeContext } from '@/providers/theme';
import { SettingsState, useSettingsStore } from '@/store/store';
import { useThemeStore } from '@/store/theme';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
	Dialog,
	Button,
	Portal,
	List,
	Switch,
	ListItemProps,
	Searchbar,
	Text,
	Divider,
} from 'react-native-paper';
import ColorPicker, {
	Panel1,
	Swatches,
	Preview,
	HueSlider,
	returnedResults,
	InputWidget,
} from 'reanimated-color-picker';
import { ListCheckboxItem, ListRadioItem } from '../buttons';
import { LANGUAGES } from 'locales';
import { useTranslation } from 'react-i18next';
import { ExternalLinks, IntensityLevelEnum, LanguageEnum, PlatformsEnum } from '@/api/vndb/schema';
import { TagTraitChip } from '../filter/buttons';
import _ from 'lodash';
import { setStatusBarStyle } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Accordion } from '../accordion';
import { IntensityLevel } from '@/api/vndb/types';

type ListItemSwitchProps = {
	value: boolean;
	onValueChange: (val: boolean) => void;
};
const ListItemSwitch = ({
	value,
	onValueChange,
	...itemProps
}: ListItemSwitchProps & ListItemProps) => {
	return (
		<List.Item
			{...itemProps}
			right={(props) => (
				<Switch style={[props.style]} value={value} onValueChange={onValueChange} />
			)}
		/>
	);
};

export const ThemeColorSelector = () => {
	const { themeColor, setThemeColor } = useThemeStore();
	const { updateTheme, resetTheme } = useThemeContext();
	const [isVis, setIsVis] = useState(false);
	const [color, setColor] = useState(themeColor ?? '#FFFF');

	const { colors } = useAppTheme();

	const onSelectColor = ({ hex }: returnedResults) => {
		setColor(hex);
	};

	const onReset = useCallback(() => {
		resetTheme();
		// wait for theme to reset
		setTimeout(() => {
			setColor(colors.primary);
		}, 1000);
	}, [colors]);

	const onDismiss = () => setIsVis(false);
	const onApply = (color: string) => {
		updateTheme(color);
		setThemeColor(color);
		setIsVis(false);
	};

	return (
		<View>
			<List.Item
				title={'Theme Color'}
				right={(props) => (
					<View
						style={[
							props.style,
							{
								height: 24,
								width: 24,
								borderRadius: 24 / 2,
								backgroundColor: themeColor ?? 'transparent',
							},
						]}
					/>
				)}
				onPress={() => setIsVis(true)}
			/>
			<Portal>
				<Dialog visible={isVis} onDismiss={onDismiss}>
					<Dialog.Title>Theme Color</Dialog.Title>
					<Dialog.Content>
						<ColorPicker
							style={{ width: '100%' }}
							value={color}
							onComplete={onSelectColor}
						>
							<Preview />
							{/* <Panel1 style={{ marginVertical: 5 }} /> */}
							<HueSlider style={{ marginVertical: 10 }} />
							<Swatches
								swatchStyle={{ borderRadius: 8, elevation: 8 }}
								colors={['#ff0000', '#00faff', '#00FF2D', '#e55f8d']}
							/>
							{/* <InputWidget
								inputTitleStyle={{ color: colors.onSurface }}
								inputStyle={{ color: colors.onSurface }}
								formats={['HEX', 'RGB']}
								disableAlphaChannel
							/> */}
						</ColorPicker>
						<Button mode="outlined" onPress={() => onReset()}>
							Use System Theme
						</Button>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Cancel</Button>
						<Button onPress={() => onApply(color)}>Apply</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
};

export const ThemedLogoSelector = () => {
	const { isLogoThemed, setIsLogoThemed } = useThemeStore();

	return (
		<ListItemSwitch
			title="Themed Logo"
			description={'Use the theme color for the app logo'}
			value={isLogoThemed ? true : false}
			onValueChange={setIsLogoThemed}
		/>
	);
};

export const DarkModeSelector = () => {
	const { isDarkMode, setIsDarkMode } = useThemeStore();

	return <ListItemSwitch title="Dark Mode" value={isDarkMode} onValueChange={setIsDarkMode} />;
};

export const PureDarkModeSelector = () => {
	const { isPureBlackMode, isDarkMode, setIsPureBlackMode } = useThemeStore();

	return (
		isDarkMode && (
			<ListItemSwitch
				title="Pure Black Mode"
				value={isPureBlackMode}
				onValueChange={setIsPureBlackMode}
			/>
		)
	);
};

export const AllowEroSelector = () => {
	const { allowEro, updateSetting } = useSettingsStore();

	return (
		<ListItemSwitch
			title="Allow Ero"
			description="Show adult content"
			value={allowEro}
			onValueChange={(val) => updateSetting('allowEro', val)}
		/>
	);
};

export const SexualLevelSelector = () => {
	const { sexualLevel, updateSetting } = useSettingsStore();
	const [vis, setVis] = useState(false);
	const [selection, setSelection] = useState<IntensityLevel>(sexualLevel);

	const onDismiss = () => setVis(false);

	const onSave = () => {
		updateSetting('sexualLevel', selection);
		setVis(false);
	};

	return (
		<>
			<List.Item
				title="Sexual Images"
				description={'Blur anything above this level'}
				right={(props) => <Text {...props}>{IntensityLevelEnum[sexualLevel]}</Text>}
				onPress={() => setVis(true)}
			/>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
					<Dialog.Title>Max Level</Dialog.Title>
					<Dialog.Content>
						<ListRadioItem
							title={IntensityLevelEnum[0]}
							onPress={() => setSelection(0)}
							isSelected={selection === 0}
						/>
						<ListRadioItem
							title={IntensityLevelEnum[1]}
							onPress={() => setSelection(1)}
							isSelected={selection === 1}
						/>
						<ListRadioItem
							title={IntensityLevelEnum[2]}
							onPress={() => setSelection(2)}
							isSelected={selection === 2}
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Cancel</Button>
						<Button onPress={onSave}>Save</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};

export const Allow3DSelector = () => {
	const { allow3D, updateSetting } = useSettingsStore();

	return (
		<ListItemSwitch
			title="Allow 3D Effects"
			value={allow3D}
			onValueChange={(val) => updateSetting('allow3D', val)}
		/>
	);
};

export const TitleLanguageSelector = () => {
	const { titleLanguage, updateSetting } = useSettingsStore();
	const [vis, setVis] = useState(false);

	const onDismiss = () => setVis(false);

	const onSelect = (choice: SettingsState['titleLanguage']) => {
		updateSetting('titleLanguage', choice);
		setVis(false);
	};

	return (
		<>
			<List.Item
				title="Title Language"
				description={titleLanguage}
				descriptionStyle={{ textTransform: 'capitalize' }}
				onPress={() => setVis(true)}
			/>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss}>
					<Dialog.Title>Title Language</Dialog.Title>
					<Dialog.Content>
						<ListRadioItem
							title="Romanized"
							onPress={() => onSelect('romanized')}
							isSelected={titleLanguage === 'romanized'}
						/>
						<ListRadioItem
							title="Original"
							onPress={() => onSelect('original')}
							isSelected={titleLanguage === 'original'}
						/>
						<ListRadioItem
							title="System (User Language)"
							onPress={() => onSelect('system')}
							isSelected={titleLanguage === 'system'}
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Done</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};

export const AppLanguageSelector = () => {
	const [t, i18n] = useTranslation();
	const [vis, setVis] = useState(false);

	const onDismiss = () => setVis(false);

	const onSelect = (choice: keyof typeof LANGUAGES) => {
		i18n.changeLanguage(choice);
		setVis(false);
	};

	return (
		<>
			<List.Item
				title="App Language"
				description={LANGUAGES[i18n.language as keyof typeof LANGUAGES]}
				descriptionStyle={{ textTransform: 'capitalize' }}
				onPress={() => setVis(true)}
			/>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
					<Dialog.Title>App Language</Dialog.Title>
					<Dialog.ScrollArea>
						<ScrollView>
							{Object.keys(LANGUAGES).map((lang, idx) => (
								<ListRadioItem
									key={idx}
									title={LANGUAGES[lang as keyof typeof LANGUAGES]}
									isSelected={i18n.language === (lang as keyof typeof LANGUAGES)}
									onPress={() => onSelect(lang as keyof typeof LANGUAGES)}
								/>
							))}
						</ScrollView>
						<List.Item title={'More coming soon!'} />
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Done</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};

export const OriginBlacklistSelector = () => {
	const [t, i18n] = useTranslation();
	const { originBlacklist, updateOriginBlacklist } = useSettingsStore();
	const [vis, setVis] = useState(false);

	const [query, setQuery] = useState<string>('');
	const [selection, setSelection] = useState<keyof typeof LanguageEnum>();

	const onDismiss = () => setVis(false);

	const onSelect = (choice: keyof typeof LanguageEnum) => {
		updateOriginBlacklist(choice);
	};

	const originBlacklistLabels = useMemo(
		() =>
			originBlacklist.length > 0
				? originBlacklist.map((key, idx) => LanguageEnum[key as keyof typeof LanguageEnum])
				: null,
		[originBlacklist],
	);

	return (
		<>
			<List.Item
				title="Origin Blacklist"
				description={originBlacklistLabels ? originBlacklistLabels.join(', ') : 'None'}
				descriptionStyle={{ textTransform: 'capitalize' }}
				descriptionNumberOfLines={3}
				onPress={() => setVis(true)}
			/>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
					<Dialog.Title>Origin Blacklist</Dialog.Title>
					<Dialog.Content>
						<Searchbar
							value={query}
							onChangeText={(txt) => setQuery(txt)}
							onClearIconPress={() => setQuery('')}
							mode="view"
						/>
						<ScrollView horizontal>
							{originBlacklist.map((key, idx) => (
								<TagTraitChip
									key={idx}
									title={LanguageEnum[key as keyof typeof LanguageEnum]}
									onPress={() => updateOriginBlacklist(key)}
									isNotIn
								/>
							))}
						</ScrollView>
					</Dialog.Content>
					<Dialog.ScrollArea style={{ height: '100%' }}>
						<ScrollView>
							{Object.keys(LanguageEnum).map(
								(lang, idx) =>
									LanguageEnum[lang as keyof typeof LanguageEnum].includes(
										query,
									) &&
									!originBlacklist.includes(
										lang as keyof typeof LanguageEnum,
									) && (
										<TagTraitChip
											key={idx}
											title={LanguageEnum[lang as keyof typeof LanguageEnum]}
											onPress={() =>
												onSelect(lang as keyof typeof LanguageEnum)
											}
										/>
									),
							)}
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

export const PrefStorefrontSelector = () => {
	const [t, i18n] = useTranslation();
	const { preferredStorefront, updateSetting } = useSettingsStore();
	const [vis, setVis] = useState(false);

	const onDismiss = () => setVis(false);

	const onSelect = (choice: string | undefined) => {
		updateSetting('preferredStorefront', choice);
		setVis(false);
	};

	return (
		<>
			<List.Item
				title="Preferred Storefront"
				description={
					preferredStorefront
						? _.find(ExternalLinks, { name: preferredStorefront })?.label
						: 'Any'
				}
				descriptionStyle={{ textTransform: 'capitalize' }}
				onPress={() => setVis(true)}
			/>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
					<Dialog.Title>Preferred Storefront</Dialog.Title>
					<Dialog.ScrollArea>
						<ScrollView>
							{['Any', ...Object.keys(ExternalLinks)].map((siteKey, idx) => (
								<ListRadioItem
									key={idx}
									title={
										siteKey !== 'Any'
											? ExternalLinks[parseInt(siteKey)].label
											: siteKey
									}
									isSelected={
										(siteKey === 'Any' && !preferredStorefront) ||
										preferredStorefront ===
											ExternalLinks[parseInt(siteKey)]?.name
									}
									onPress={() =>
										onSelect(
											siteKey === 'Any'
												? undefined
												: ExternalLinks[parseInt(siteKey)].name,
										)
									}
								/>
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

export const OwnedPlatformsSelector = () => {
	const { ownedPlatforms, updateSetting } = useSettingsStore();
	const [vis, setVis] = useState(false);
	const [selections, setSelections] = useState<typeof ownedPlatforms>(ownedPlatforms);

	const onDismiss = () => setVis(false);

	const onConfirm = () => {
		updateSetting('ownedPlatforms', selections);
		setVis(false);
	};

	return (
		<>
			<List.Item
				title="Your Platforms"
				description={
					ownedPlatforms.length > 1
						? ownedPlatforms.map((platform) => PlatformsEnum[platform]).join(', ')
						: 'Any'
				}
				descriptionStyle={{ textTransform: 'capitalize' }}
				descriptionNumberOfLines={3}
				onPress={() => setVis(true)}
			/>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
					<Dialog.Title>Your Platforms</Dialog.Title>
					<Dialog.ScrollArea>
						<ScrollView>
							{['Any', ...Object.keys(PlatformsEnum)].map((siteKey, idx) => (
								<ListCheckboxItem
									key={idx}
									title={
										siteKey !== 'Any'
											? PlatformsEnum[siteKey as keyof typeof PlatformsEnum]
											: siteKey
									}
									isSelected={
										(siteKey === 'Any' && selections.length < 1) ||
										selections.includes(siteKey as keyof typeof PlatformsEnum)
									}
									onPress={() =>
										setSelections((prev) => {
											return siteKey === 'Any'
												? []
												: prev.includes(
															siteKey as keyof typeof PlatformsEnum,
													  )
													? prev.filter((itm) => itm !== siteKey)
													: [
															...prev,
															siteKey as keyof typeof PlatformsEnum,
														];
										})
									}
								/>
							))}
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Close</Button>
						<Button onPress={onConfirm}>Confirm</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};

const ColorItem = ({
	title,
	color,
	isSelected,
	onPress,
}: {
	title: string;
	color: string;
	isSelected: boolean;
	onPress: () => void;
}) => {
	const { colors } = useAppTheme();
	return (
		<View
			style={{
				borderRadius: 12,
				// borderWidth: isSelected ? 2 : 0,
				// borderColor: isSelected ? colors.primary : undefined,
				padding: 5,
			}}
		>
			<Text variant="labelLarge">{title}</Text>
			<Pressable
				onPress={onPress}
				style={{
					height: 32,
					width: 32,
					backgroundColor: color,
					borderRadius: 32 / 2,
					borderWidth: isSelected ? 2 : 0,
					borderColor: isSelected ? colors.primary : undefined,
				}}
			/>
		</View>
	);
};
export const ScoreAppearanceSelector = () => {
	const [vis, setVis] = useState(false);
	const { scoreThresholds, scoreColors, updateSetting } = useSettingsStore();

	// could convert to a hook but this won't be reused anywhere else so...
	const [lowScore, setLowScore] = useState(scoreThresholds[0]);
	const [highScore, setHighScore] = useState(scoreThresholds[1]);
	const [lowColor, setLowColor] = useState(scoreColors[0]);
	const [midColor, setMidColor] = useState(scoreColors[1]);
	const [highColor, setHighColor] = useState(scoreColors[2]);
	const [selectedColor, setSelectedColor] = useState<'low' | 'mid' | 'high'>('low');

	const onDismiss = () => setVis(false);

	const onColorSelect = (color: string) => {
		switch (selectedColor) {
			case 'low':
				setLowColor(color);
				break;
			case 'mid':
				setMidColor(color);
				break;
			case 'high':
				setHighColor(color);
				break;
		}
	};

	const changeColorSelection = (colorType: 'low' | 'mid' | 'high') => setSelectedColor(colorType);

	const onSave = () => {
		updateSetting('scoreThresholds', [lowScore, highScore]);
		updateSetting('scoreColors', [lowColor, midColor, highColor]);
		onDismiss();
	};

	return (
		<>
			<List.Item title={'Score Appearance'} onPress={() => setVis(true)} />
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
					<Dialog.Title>Score Appearance</Dialog.Title>
					<Dialog.Content>
						<Text style={{ fontWeight: '900' }}>⚠️Work in progress⚠️</Text>
						<View style={{ width: '100%' }}>
							<Text
								style={{
									// position: 'absolute',
									color: midColor,
									left: `${lowScore + (highScore - lowScore) / 2}%`,
									// bottom: 5,
								}}
							>
								{(lowScore + (highScore - lowScore) / 2).toFixed(0)}
							</Text>
						</View>
						<View style={{ width: '100%', height: 10, borderRadius: 12 }}>
							<LinearGradient
								colors={[lowColor, midColor, highColor]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								locations={[
									lowScore / 100,
									(lowScore + (highScore - lowScore) / 2) / 100,
									highScore / 100,
								]}
								style={{
									position: 'absolute',
									alignSelf: 'center',
									width: '100%',
									height: '100%',
									borderRadius: 12,
								}}
							/>
						</View>
						<View style={{ width: '100%', flexDirection: 'row' }}>
							<Text
								style={{
									position: 'absolute',
									color: lowColor,
									left: `${lowScore}%`,
									// bottom: 5,
								}}
							>
								{lowScore.toFixed(0)}
							</Text>
							<Text
								style={{
									position: 'absolute',
									color: highColor,
									left: `${highScore}%`,
									// bottom: 5,
								}}
							>
								{highScore.toFixed(0)}
							</Text>
						</View>
					</Dialog.Content>
					<Dialog.ScrollArea>
						<ScrollView>
							<List.Item title={`Low Score - ${lowScore}`} />
							<Slider
								value={lowScore}
								minimumValue={0}
								maximumValue={highScore - 1}
								onValueChange={(val) => setLowScore(val)}
								step={0.5}
							/>
							<List.Item title={`High Score - ${highScore}`} />
							<Slider
								value={highScore}
								minimumValue={lowScore + 1}
								maximumValue={100}
								onValueChange={(val) => setHighScore(val)}
								step={0.5}
							/>
							<Accordion title="Customize Colors">
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-evenly',
										paddingVertical: 10,
									}}
								>
									<ColorItem
										title="Low"
										color={lowColor}
										isSelected={selectedColor === 'low'}
										onPress={() => changeColorSelection('low')}
									/>
									<ColorItem
										title="Mid"
										color={midColor}
										isSelected={selectedColor === 'mid'}
										onPress={() => changeColorSelection('mid')}
									/>
									<ColorItem
										title="High"
										color={highColor}
										isSelected={selectedColor === 'high'}
										onPress={() => changeColorSelection('high')}
									/>
								</View>
								<ColorPicker
									style={{ width: '88%', alignSelf: 'center' }}
									value={
										selectedColor === 'low'
											? lowColor
											: selectedColor === 'mid'
												? midColor
												: highColor
									}
									onComplete={(props) => onColorSelect(props.hex)}
								>
									<Preview />
									{/* <Panel1 style={{ marginVertical: 5 }} /> */}
									<HueSlider style={{ marginVertical: 10 }} />
									<Swatches
										swatchStyle={{ borderRadius: 8, elevation: 8 }}
										colors={['#ff0000', '#ff8000', '#00ff00']}
									/>
								</ColorPicker>
							</Accordion>
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button onPress={onDismiss}>Cancel</Button>
						<Button onPress={onSave}>Save</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};
