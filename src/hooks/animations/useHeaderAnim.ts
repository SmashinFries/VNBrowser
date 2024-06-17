import { useAppTheme } from '@/providers/theme';
import { rgbToRgba } from '@/utils/color';
import { useMemo } from 'react';
import {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

export const useHeaderAnim = (start = 40, end = 110) => {
    const input_range = [start, end];
    const { colors } = useAppTheme();
    const rgbaColor = useMemo(
        () => rgbToRgba(colors.elevation.level3, 0.85),
        [colors.elevation.level3],
    );
    const scrollY = useSharedValue(0);
    const bgTransY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });
    const headerTitleStyle = useAnimatedStyle(() => {
        const opac = interpolate(scrollY.value, input_range, [0, 1], {
            extrapolateLeft: Extrapolation.CLAMP,
        });

        return {
            opacity: opac,
        };
    });

    const headerStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(scrollY.value, input_range, ['transparent', rgbaColor]);

        return {
            backgroundColor: bgColor,
        };
    });

    const headerActionStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(scrollY.value, input_range, [rgbaColor, 'transparent']);

        return {
            backgroundColor: bgColor,
        };
    });

    const bgImageStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollY.value, [0, end], [1.05, 1.2], Extrapolation.CLAMP);
        return {
            transform: [{ translateY: bgTransY.value }, { scale: scale }],
        };
    });

    useAnimatedReaction(
        () => {
            return scrollY.value;
        },
        (currentValue, previousValue) => {
            if (currentValue !== previousValue) {
                // bgTransY.value = withSpring(-(currentValue / 2), { damping: 10, mass: 0.5 });
                bgTransY.value = currentValue <= 0 ? 0 : -(currentValue / 3);
            }
        },
    );

    return { scrollHandler, headerStyle, headerTitleStyle, bgImageStyle, headerActionStyle };
};
