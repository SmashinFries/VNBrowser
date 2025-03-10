import { Stack, router } from 'expo-router';
import {
	Appbar,
	AppbarHeaderProps,
	Button,
	Divider,
	Searchbar,
	Text,
	useTheme,
} from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';
import Animated, {
	AnimatedStyle,
	FadeIn,
	FadeOut,
	SlideInUp,
	SlideOutDown,
} from 'react-native-reanimated';
import { ScrollViewProps, Share, TextInput, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchRandomVN } from '@/api/vndb/queries/queries';
import { useHeaderAnim } from '@/hooks/animations/useHeaderAnim';
import { useCallback, useState } from 'react';
import { useAppTheme } from '@/providers/theme';
import { VNBrowserSVG } from './icons';
import { useThemeStore } from '@/store/theme';

type PaperHeaderProps = NativeStackHeaderProps & {
	mode?: AppbarHeaderProps['mode'];
};
export const PaperHeader = ({
	navigation,
	options,
	route,
	back,
	mode = 'small',
}: PaperHeaderProps) => {
	const title = getHeaderTitle(options, route.name);
	return (
		<Appbar.Header mode={mode}>
			{back && <Appbar.BackAction onPress={navigation.goBack} />}
			<Appbar.Content title={title} titleStyle={{ textTransform: 'capitalize' }} />
		</Appbar.Header>
	);
};

type VNHeaderProps = PaperHeaderProps & {
	shareLink: string;
};
export const VNHeader = ({
	navigation,
	options,
	route,
	back,
	mode = 'small',
	shareLink,
}: VNHeaderProps) => {
	const title = getHeaderTitle(options, route.name);
	return (
		<Appbar.Header mode={mode}>
			{back && <Appbar.BackAction onPress={navigation.goBack} />}
			<Appbar.Content title={title} titleStyle={{ textTransform: 'capitalize' }} />
			<Appbar.Action
				icon={'share-variant'}
				onPress={() =>
					Share.share({ message: shareLink, url: shareLink, title: shareLink })
				}
			/>
		</Appbar.Header>
	);
};

export const ExploreHeader = ({
	navigation,
	options,
	route,
	back,
	mode = 'small',
}: PaperHeaderProps) => {
	const title = getHeaderTitle(options, route.name);

	const getRandomVN = async () => {
		const id = await fetchRandomVN();
		router.push(`/vn/v${id}`);
	};

	return (
		<Appbar.Header mode={mode}>
			{/* {back && <Appbar.BackAction onPress={navigation.goBack} />} */}
			<Appbar.Content title={title} titleStyle={{ textTransform: 'capitalize' }} />
			<Appbar.Action icon={'dice-multiple-outline'} onPress={getRandomVN} />
			<Appbar.Action icon={'magnify'} onPress={() => router.push('/explore/search')} />
		</Appbar.Header>
	);
};

type SearchHeaderProps = NativeStackHeaderProps & {
	searchContent: () => void;
	openFilter: () => void;
	searchbarRef: React.RefObject<TextInput>;
	searchTerm: string;
	mode?: 'vn' | 'char';
	setSearchTerm: (value: string) => void;
};
export const SearchHeader = ({
	navigation,
	searchTerm,
	searchbarRef,
	mode,
	openFilter,
	setSearchTerm,
	searchContent,
}: NativeStackHeaderProps & SearchHeaderProps) => {
	const { colors } = useTheme();
	return (
		<Appbar.Header>
			<Animated.View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
				entering={SlideInUp.duration(500)}
				exiting={SlideOutDown}
			>
				<Searchbar
					ref={searchbarRef}
					value={searchTerm}
					onChangeText={setSearchTerm}
					onSubmitEditing={searchContent}
					returnKeyType="search"
					autoFocus
					placeholder="Search VN..."
					mode="bar"
					onIconPress={() => navigation.goBack()}
					selectionColor={colors.primaryContainer}
					icon={'arrow-left'}
					style={{ flex: 1, backgroundColor: 'transparent' }}
					inputStyle={{ justifyContent: 'center', textAlignVertical: 'center' }}
					onClearIconPress={() => {
						setSearchTerm('');
					}}
				/>
				{/* <IconButton
                    icon={'filter-variant'} //filter-variant
                    onPress={openFilter}
                    // onPress={() => setIsFilterOpen((prev) => !prev)}
                    disabled={
                        ![MediaType.Anime, MediaType.Manga, 'imageSearch'].includes(currentType)
                    }
                /> */}
				{/* <IconButton
                    icon={'filter-outline'}
                    onPress={openFilter}
                    // onPress={() => setIsFilterOpen((prev) => !prev)}
                    disabled={
                        ![MediaType.Anime, MediaType.Manga, 'imageSearch'].includes(currentType)
                    }
                /> */}
				{/* <Appbar.Action icon={() => <Text>{mode ?? 'vn'}</Text>} onPress={searchContent} /> */}
				<Appbar.Action icon={'magnify'} onPress={searchContent} />
				<Appbar.Action icon={'filter-variant'} onPress={openFilter} />
			</Animated.View>
		</Appbar.Header>
	);
};

type CharacterFilterHeaderProps = NativeStackHeaderProps & {
	onApply?: () => void;
	onRemove?: () => void;
};
export const CharacterFilterHeader = ({
	navigation,
	route,
	options,
	onApply,
	onRemove,
}: NativeStackHeaderProps & CharacterFilterHeaderProps) => {
	const title = getHeaderTitle(options, route.name);
	return (
		<Appbar.Header>
			<Appbar.BackAction onPress={navigation.goBack} />
			<Appbar.Content title={title} titleStyle={{ textTransform: 'capitalize' }} />
			<Appbar.Action
				icon={'trash-can-outline'}
				onPress={() => onRemove?.()}
				disabled={!onRemove}
			/>
			<Appbar.Action icon={'check'} onPress={() => onApply?.()} disabled={!onApply} />
		</Appbar.Header>
	);
};

export const MoreHeader = () => {
	const { top, left, right } = useSafeAreaInsets();
	const { colors } = useAppTheme();
	const { isLogoThemed } = useThemeStore();
	return (
		<>
			<View
				style={{
					alignItems: 'center',
					paddingTop: top + 20,
					paddingBottom: 20,
					paddingLeft: left,
					paddingRight: right,
					backgroundColor: colors.background,
				}}
			>
				{/* <Image
					source={require('../../assets/KuzuLabz_Logo_1.png')}
					style={{ height: 200, width: '60%' }}
					contentFit="contain"
				/> */}
				<VNBrowserSVG
					height={150}
					width={'100%'}
					hairColor={isLogoThemed ? colors.primary : undefined}
				/>
				{/* <Text variant="titleLarge">VNBrowser</Text> */}
			</View>
			<Divider />
		</>
	);
};

export const UserListHeader = () => {
	return (
		<Appbar.Header>
			<Appbar.Content title="List" />
		</Appbar.Header>
	);
};

type FadeHeaderProps = {
	title: string;
	children: React.ReactNode;
	shareLink?: string;
	animationRange?: [number, number];
	RefreshControl?: ScrollViewProps['refreshControl'];
	BgImage?: ({ style }: { style?: AnimatedStyle }) => React.JSX.Element;
};
export const FadeHeader = ({ BgImage, ...props }: FadeHeaderProps) => {
	const { colors, dark } = useAppTheme();
	const [headerHeight, setHeaderHeight] = useState(0);
	const { headerStyle, headerTitleStyle, bgImageStyle, headerActionStyle, scrollHandler } =
		useHeaderAnim(
			props.animationRange ? props.animationRange[0] : 40,
			props.animationRange ? props.animationRange[1] : 110,
		);

	const Header = () => {
		return (
			<Animated.View
				style={[headerStyle]}
				onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
			>
				<Appbar.Header style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
					<Animated.View
						style={[
							{
								borderRadius: 100,
								height: 42,
								width: 42,
								marginLeft: 5,
								justifyContent: 'center',
								alignItems: 'center',
							},
							headerActionStyle,
						]}
					>
						<Appbar.BackAction
							onPress={() => {
								router.back();
							}}
						/>
					</Animated.View>
					<Animated.View
						style={[
							headerTitleStyle,
							{
								flex: 1,
								height: '50%',
								justifyContent: 'center',
							},
						]}
					>
						<Appbar.Content
							title={props.title ?? ''}
							titleStyle={{ textTransform: 'capitalize' }}
						/>
					</Animated.View>
					{props.shareLink && (
						<Animated.View
							style={[
								{
									borderRadius: 100,
									height: 42,
									width: 42,
									marginRight: 10,
									justifyContent: 'center',
									alignItems: 'center',
								},
								headerActionStyle,
							]}
						>
							<Appbar.Action
								icon="share-variant-outline"
								onPress={() =>
									props.shareLink &&
									Share.share({
										url: props.shareLink,
										title: props.shareLink,
										message: props.shareLink,
									})
								}
								disabled={!props.shareLink}
							/>
						</Animated.View>
					)}
				</Appbar.Header>
			</Animated.View>
		);
	};

	const BackgroundImage = useCallback(() => {
		if (!BgImage) return null;
		return <BgImage style={bgImageStyle} />;
	}, []);

	return (
		<Animated.View
			entering={FadeIn}
			exiting={FadeOut}
			style={{ backgroundColor: colors.surface }}
		>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					header: (props) => <Header />,
				}}
			/>
			{BgImage && <BackgroundImage />}
			<Animated.ScrollView
				refreshControl={props.RefreshControl ?? undefined}
				showsVerticalScrollIndicator={false}
				scrollEventThrottle={16}
				onScroll={scrollHandler}
				contentContainerStyle={{ paddingTop: 100 }}
			>
				{props.children}
			</Animated.ScrollView>
		</Animated.View>
	);
};

type StackProps = (typeof Stack)['defaultProps'];

const AnimatedStack = (props: StackProps) => {
	// const { navAnimation } = useAppSelector((state) => state.persistedSettings);
	return (
		<Stack
			{...props}
			screenOptions={{
				animation: 'fade_from_bottom',
				header: (props) => <PaperHeader mode="small" {...props} />,
				...props?.screenOptions,
			}}
		>
			{props?.children}
		</Stack>
	);
};

export default AnimatedStack;
