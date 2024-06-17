import { useAppTheme } from '@/providers/theme';
import { highlightUrls } from '@/utils/text';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type AnimateHeightProps = {
	initialHeight: number;
	text: string | null | undefined;
};
export const ExpandableDescription = ({ initialHeight, text }: AnimateHeightProps) => {
	const { colors, dark } = useAppTheme();
	const height = useSharedValue(initialHeight);
	const [totalHeight, setTotalHeight] = useState<number>(0);
	const [currentHeight, setCurrentHeight] = useState<number>(initialHeight);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [uwuify, setUwuify] = useState(false);
	const animatedStyles = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	const resetHeight = useCallback(() => {
		height.value = withSpring(initialHeight, { damping: 10, mass: 0.5 });
		setCurrentHeight(initialHeight);
	}, [height, totalHeight]);

	const increaseHeight = useCallback(() => {
		height.value = withSpring(totalHeight, { damping: 10, mass: 0.5 });
		setCurrentHeight(totalHeight);
	}, [height, totalHeight]);

	useEffect(() => {
		if (isExpanded) {
			increaseHeight();
		} else {
			resetHeight();
		}
	}, [isExpanded]);

	if (!text) return null;

	return (
		<View style={{ marginVertical: 25 }}>
			<Animated.View style={[animatedStyles, { overflow: 'hidden' }]}>
				<View style={[StyleSheet.absoluteFill, { bottom: 'auto', paddingBottom: 10 }]}>
					<View
						onLayout={(e) => setTotalHeight(e.nativeEvent.layout.height)}
						style={{
							paddingHorizontal: 20,
							paddingVertical: 10,
							paddingBottom: 20,
							// backgroundColor: colors.secondaryContainer,
							borderRadius: 12,
							margin: 15,
						}}
					>
						<Text>{highlightUrls(text, colors.primary, uwuify)}</Text>
					</View>
				</View>
				{!isExpanded && (
					<LinearGradient
						colors={[
							dark ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)',
							colors.surfaceContainerLow,
						]}
						locations={
							Math.floor(currentHeight) < Math.floor(totalHeight) ? [0.5, 1] : [1, 1]
						}
						style={{
							position: 'absolute',
							height: '100%',
							width: '100%',
							pointerEvents: 'none',
						}}
					/>
				)}
			</Animated.View>
			{currentHeight <= totalHeight && (
				<View>
					<IconButton
						icon={
							Math.floor(currentHeight) === initialHeight
								? 'chevron-down'
								: 'chevron-up'
						}
						onPress={() => setIsExpanded((prev) => !prev)}
						onLongPress={() => setUwuify((prev) => !prev)}
						style={{
							position: 'absolute',
							bottom: -35,
							alignSelf: 'center',
							overflow: 'visible',
						}}
					/>
				</View>
			)}
		</View>
	);
};
