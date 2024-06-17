import { cloneElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { LayoutChangeEvent, ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    cancelAnimation,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface Props {
    children: React.ReactElement<any>;
    style?: StyleProp<ViewStyle>;
    endPaddingWidth?: number;
    duration?: number;
    delay?: number;
    isLTR?: boolean;
}

// REF -> https://github.com/homielab/react-native-auto-scroll
export const AutoScrolling = ({
    style,
    children,
    endPaddingWidth = 100,
    duration,
    delay = 0,
    isLTR = false,
}: Props) => {
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
    const [dividerWidth, setDividerWidth] = useState(endPaddingWidth);
    const containerWidth = useRef(0);
    const contentWidth = useRef(0);
    const offsetX = useSharedValue(0);
    const contentRef = useRef<any>(null);

    const measureContainerView = useCallback(
        ({
            nativeEvent: {
                layout: { width },
            },
        }: LayoutChangeEvent) => {
            if (containerWidth?.current === width) return;
            containerWidth.current = width;
            if (!contentRef?.current) {
                return;
            } else {
                // measure only work with View???
                contentRef.current?.measure((fx: number, _fy: number, width: number) => {
                    checkContent(width, fx);
                });
            }
        },
        [],
    );

    const checkContent = useCallback((newContentWidth: number, fx: number) => {
        if (!newContentWidth) {
            setIsAutoScrollEnabled(false);
            return;
        }

        if (contentWidth?.current === newContentWidth) return;
        contentWidth.current = newContentWidth;
        let newDividerWidth = endPaddingWidth;
        if (contentWidth?.current < containerWidth?.current) {
            if (endPaddingWidth < containerWidth?.current - contentWidth?.current) {
                newDividerWidth = containerWidth?.current - contentWidth?.current;
            }
        }
        setDividerWidth(newDividerWidth);
        setIsAutoScrollEnabled(true);

        if (isLTR) {
            offsetX.value = -(newContentWidth + newDividerWidth);
        }
        offsetX.value = withRepeat(
            withDelay(
                delay,
                withTiming(isLTR ? fx : -(contentWidth.current + fx + newDividerWidth), {
                    duration: duration || 50 * contentWidth.current,
                    easing: Easing.linear,
                }),
            ),
            -1,
        );
    }, []);

    const childrenCloned = useMemo(
        () =>
            cloneElement(children, {
                ...children.props,
                onLayout: ({
                    nativeEvent: {
                        layout: { width, x },
                    },
                }: LayoutChangeEvent) => {
                    if (!containerWidth.current || width === contentWidth.current) return;
                    cancelAnimation(offsetX);
                    offsetX.value = 0;
                    checkContent(width, x);
                },
                ref: (ref: any) => (contentRef.current = ref),
            }),
        [children],
    );

    return (
        <View onLayout={measureContainerView} style={style}>
            <ScrollView
                horizontal={true}
                bounces={false}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
            >
                <Animated.View
                    style={[{ flexDirection: 'row' }, { transform: [{ translateX: offsetX }] }]}
                >
                    {childrenCloned}
                    {isAutoScrollEnabled && (
                        <>
                            <View style={{ width: dividerWidth }} />
                            {children}
                        </>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
};
