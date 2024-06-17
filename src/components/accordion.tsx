import { useAppTheme } from '@/providers/theme';
import React, { ReactNode, useState, useCallback, useEffect, useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { useTheme, TouchableRipple, Text, Icon } from 'react-native-paper';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	WithTimingConfig,
	WithSpringConfig,
	withTiming,
} from 'react-native-reanimated';

type ToggableChevronProps = {
	isExpanded: boolean;
};
const ToggableChevron = ({ isExpanded }: ToggableChevronProps) => {
	const iconRotation = useSharedValue(0);
	const { colors } = useTheme();

	const animatedIconStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${iconRotation.value}deg` }],
		};
	});

	const toggleRotation = useCallback(() => {
		iconRotation.value = withSpring(isExpanded ? 0 : 180, { damping: 10, mass: 0.5 });
	}, [iconRotation, isExpanded]);

	useEffect(() => {
		toggleRotation();
	}, [isExpanded, toggleRotation]);

	return (
		<Animated.View style={[animatedIconStyle, { alignSelf: 'center' }]}>
			<Icon size={24} color={colors.onSurfaceVariant} source={'chevron-up'} />
		</Animated.View>
	);
};

type AccordionProps = {
	title: string;
	titleNumberOfLines?: number;
	titleFontSize?: number;
	titleVariant?: VariantProp<never>;
	titleStyle?: StyleProp<TextStyle>;
	description?: string | ReactNode;
	descriptionNumberOfLines?: number;
	descriptionStyle?: StyleProp<TextStyle>;
	children: ReactNode;
	initialExpand?: boolean;
	containerKey?: string | number;
	left?: ReactNode;
	disableSpring?: boolean;
};
export const Accordion = ({
	title,
	titleNumberOfLines,
	titleFontSize,
	titleStyle,
	left,
	children,
	description,
	descriptionNumberOfLines,
	descriptionStyle,
	initialExpand = false,
	containerKey = 1,
	titleVariant = 'titleLarge',
	disableSpring = false,
}: AccordionProps) => {
	const { colors } = useAppTheme();
	const [isExpanded, setIsExpanded] = useState(initialExpand);
	const initialHeight = 0;
	const height = useSharedValue(0);
	const [totalHeight, setTotalHeight] = useState<number>(0);
	const animatedStyles = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	const springConfig: WithSpringConfig = {
		damping: 10,
		mass: 0.5,
	};

	const timingConfig: WithTimingConfig = {};

	const toggleHeight = useCallback(() => {
		height.value = disableSpring
			? withTiming(
					height.value === totalHeight
						? initialHeight
						: totalHeight - height.value + initialHeight,
					timingConfig,
				)
			: withSpring(
					height.value === totalHeight
						? initialHeight
						: totalHeight - height.value + initialHeight,
					springConfig,
				);
		setIsExpanded((prev) => !prev);
	}, [height, initialHeight, totalHeight]);

	useEffect(() => {
		if (initialExpand && totalHeight) {
			height.value = disableSpring
				? withTiming(totalHeight, timingConfig)
				: withSpring(totalHeight, springConfig);
		}
	}, [totalHeight]);

	useEffect(() => {
		if (isExpanded && totalHeight && !initialExpand) {
			height.value = disableSpring
				? withTiming(totalHeight, timingConfig)
				: withSpring(totalHeight, springConfig);
		}
	}, [isExpanded, totalHeight]);

	return (
		<View style={[{ overflow: 'visible' }]}>
			<View style={{ backgroundColor: 'transparent' }}>
				<TouchableRipple
					onPress={toggleHeight}
					rippleColor={colors.background}
					borderless
					style={{ paddingVertical: 8, paddingRight: 24 }}
				>
					<View
						style={{ flexDirection: 'row', paddingVertical: 13, alignItems: 'center' }}
					>
						{left && left}
						<View style={[{ paddingLeft: 16 }, { flex: 1, justifyContent: 'center' }]}>
							<Text
								selectable={false}
								numberOfLines={titleNumberOfLines}
								style={[
									titleStyle,
									titleFontSize ? { fontSize: titleFontSize } : undefined,
								]}
								variant={titleFontSize ? undefined : titleVariant}
							>
								{title}
							</Text>
							{description ? (
								typeof description === 'string' ? (
									<Text
										selectable={false}
										numberOfLines={descriptionNumberOfLines}
										style={[
											{
												fontSize: 14,
												color: colors.onSurfaceVariant,
											},
											descriptionStyle,
										]}
									>
										{description}
									</Text>
								) : (
									description
								)
							) : null}
						</View>
						<View
							style={[
								{
									marginVertical: 6,
									marginRight: 8,
								},
							]}
						>
							<ToggableChevron isExpanded={isExpanded} />
						</View>
					</View>
				</TouchableRipple>
			</View>
			<Animated.View key={containerKey} style={[animatedStyles, { overflow: 'hidden' }]}>
				<View style={[StyleSheet.absoluteFill, { bottom: 'auto', paddingBottom: 10 }]}>
					<View
						onLayout={(e) => {
							setTotalHeight(e.nativeEvent.layout.height);
						}}
					>
						{children}
					</View>
				</View>
			</Animated.View>
		</View>
	);
};
