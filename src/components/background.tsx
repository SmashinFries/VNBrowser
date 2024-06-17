import { Screenshot, VNImage } from '@/api/vndb/types';
import useImageRotation from '@/hooks/animations/useImageRotation';
import { useAppTheme } from '@/providers/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
    AnimatedStyle,
    Easing,
    SensorType,
    useAnimatedSensor,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import _ from 'lodash';
import { useSettingsStore } from '@/store/store';

type Props = {
    style?: AnimatedStyle | undefined;
    images: Screenshot[] | VNImage[];
    allowMotion?: boolean;
};
export const MediaBanner = ({ images, style, allowMotion }: Props) => {
    const { colors } = useAppTheme();
    const img_src = useImageRotation(images?.map((img) => img.url));
    const { sexualLevel, violenceLevel } = useSettingsStore();

    const { sensor } = useAnimatedSensor(SensorType.ROTATION, { interval: 20 });

    // @ts-ignore - ???
    const animatedStyle = useAnimatedStyle(() => {
        const { pitch, roll } = sensor?.value ?? { pitch: 0, roll: 0 };
        return {
            transform: [
                { translateX: withSpring(-roll * 25, { damping: 200 }) },
                { translateY: withSpring(-pitch * 25, { damping: 200 }) },
                // { matrix: [] },
            ],
        };
    });

    if (images.length === 0 || img_src === null) return null;

    return (
        <Animated.View style={[style, styles.container]}>
            <Animated.View style={[allowMotion ? animatedStyle : {}, { paddingBottom: 10 }]}>
                <Pressable>
                    <Image
                        source={{ uri: img_src }}
                        style={[styles.img]}
                        cachePolicy="memory"
                        transition={2000}
                        contentFit="cover"
                        blurRadius={
                            _.find(images, (img) => img.url === img_src && img.sexual > sexualLevel)
                                ? 15
                                : 0
                        }
                    />

                    <LinearGradient
                        style={[styles.container]}
                        locations={[0, 0.85]}
                        colors={['rgba(0,0,0,.2)', colors.surfaceContainerLow]}
                    />
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 250,
    },
    img: {
        width: '100%',
        height: '100%',
    },
});
