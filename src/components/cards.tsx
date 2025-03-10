import { VNCharResponse, VNImage, VNRating, VNTitles } from '@/api/vndb/types';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';
import { Avatar, Icon, Text, useTheme } from 'react-native-paper';
import { ScoreHealthBar } from './score';
import { useAppTheme } from '@/providers/theme';
import { rgbToRgba } from '@/utils/color';
import { useSettingsStore } from '@/store/store';
import { PlatformsEnum } from '@/api/vndb/schema';
import { PlatformSVG } from './icons';
import { useMemo, useState } from 'react';

const BORDER_RADIUS = 12;

export const PlatformCardBanner = ({
	platforms,
}: {
	platforms: (keyof typeof PlatformsEnum)[];
}) => {
	const { colors } = useAppTheme();
	const { ownedPlatforms } = useSettingsStore();
	return (
		<View
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				padding: 3,
				paddingHorizontal: 5,
				alignItems: 'center',
				justifyContent: 'space-evenly',
				borderBottomRightRadius: BORDER_RADIUS,
				borderTopRightRadius: 0,
				borderTopLeftRadius: 0,
				backgroundColor: rgbToRgba(colors.primaryContainer, 0.75),
				flexDirection: 'row',
				maxWidth: '50%',
			}}
		>
			{platforms
				.filter((element, index) =>
					ownedPlatforms && ownedPlatforms.length > 0
						? index < 3 && ownedPlatforms.includes(element)
						: index < 3,
				)
				.map((platform, idx) => (
					<View key={idx} style={{ marginHorizontal: 1 }}>
						<PlatformSVG name={platform} height={16} width={16} />
					</View>
				))}
		</View>
	);
};

type VNCardProps = {
	coverImg: VNImage;
	titles: VNTitles[];
	mediaListEntry?: any;
	navigate?: () => void;
	rating?: VNRating | null;
	showBanner?: boolean;
	bannerText?: string;
	height?: number;
	width?: number;
	fitToParent?: boolean;
	isFavorite?: boolean;
	platforms?: (keyof typeof PlatformsEnum)[];
};
export const VNCard = (props: VNCardProps) => {
	const card_height = props.height ?? 210;
	const { colors } = useTheme();
	const { allowEro, sexualLevel } = useSettingsStore();
	const [isBlurred, setIsBlurred] = useState(props.coverImg?.sexual > sexualLevel);

	return (
		<Pressable
			onPress={() => props.navigate?.()}
			onLongPress={() => setIsBlurred((prev) => !prev)}
			android_ripple={
				props.navigate ? { color: colors.primary, foreground: true } : undefined
			}
			style={{
				marginHorizontal: 10,
				overflow: 'hidden',
				height: !props.width && !props.fitToParent ? card_height : undefined,
				width: props.fitToParent ? '100%' : props.width ?? undefined,
				aspectRatio: 2 / 3,
				borderRadius: BORDER_RADIUS,
				backgroundColor: 'transparent',
			}}
		>
			<Image
				contentFit="cover"
				transition={800}
				blurRadius={
					(isBlurred && props.coverImg?.sexual > sexualLevel) ||
					(!allowEro && props.coverImg?.sexual > 0)
						? 15
						: 0
				}
				source={{ uri: props.coverImg?.url ?? '' }}
				style={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					borderRadius: BORDER_RADIUS,
				}}
			/>
			<LinearGradient
				style={{
					// position: 'absolute',
					width: '100%',
					height: '100%',
					borderRadius: BORDER_RADIUS,
					overflow: 'hidden',
					justifyContent: 'flex-end',
				}}
				colors={[
					'transparent',
					'rgba(0,0,0,.4)',
					props.isFavorite ? 'rgba(79, 0, 0, 1)' : 'black',
				]}
			>
				{(props.rating ?? 0) > 0 && (
					<ScoreHealthBar
						score={props.rating ?? 0}
						scoreColors={{ red: 64, yellow: 74 }}
						textColor={colors.onPrimaryContainer}
						heartColor={colors.onPrimaryContainer}
						showScore
					/>
				)}
				{props.platforms && props.platforms.length > 0 && (
					<PlatformCardBanner platforms={props.platforms} />
				)}
				{/* {(props.meanScore || props.averageScore) && (
                    <ScoreVisual
                        score={
                            defaultScore === 'average' && props.averageScore
                                ? props.averageScore
                                : props.meanScore
                        }
                        scoreColors={scoreColors}
                        scoreVisualType={props.scoreVisualType}
                        scoreDistributions={props.scoreDistributions}
                        height={card_height}
                    />
                )} */}
				<Text
					variant="labelMedium"
					style={{
						// position: 'absolute',
						alignSelf: 'center',
						// bottom: props.showBanner ? '15%' : 10,
						// fontWeight: 'bold',
						paddingHorizontal: 6,
						paddingVertical: 10,
						color: 'white',
					}}
					numberOfLines={2}
				>
					{props.titles[0].title}
				</Text>
				{/* {props.showBanner ? (
                    <AiringBanner
                        containerColor={colors.primaryContainer}
                        textColor={colors.onPrimaryContainer}
                        text={props.bannerText}
                    />
                ) : null} */}
			</LinearGradient>
		</Pressable>
	);
};

type CharacterCardProps = {
	onPress: () => void;
	data: VNCharResponse['results'][0];
};
export const CharacterCard = (props: CharacterCardProps) => {
	const { colors } = useTheme();

	return (
		<Pressable
			onPress={props.onPress}
			android_ripple={{ color: colors.primary, foreground: true }}
			style={{
				marginHorizontal: 5,
				alignItems: 'center',
				overflow: 'hidden',
				borderRadius: 12,
			}}
		>
			{props.data.image?.url ? (
				<Avatar.Image source={{ uri: props.data.image.url }} size={110} />
			) : (
				<Avatar.Text label={props.data.name[0]} size={110} />
			)}
			<Text
				numberOfLines={2}
				style={{
					textAlign: 'center',
					// color: props.isFavourite ? colors.primary : colors.onBackground,
					color: colors.onBackground,
				}}
			>
				{props.data.name}
			</Text>
		</Pressable>
	);
};
