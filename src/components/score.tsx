import { useAppTheme } from '@/providers/theme';
import { useSettingsStore } from '@/store/store';
import { rgbToRgba } from '@/utils/color';
import { useMemo } from 'react';
import { View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

const BORDER_RADIUS = 12;

type ScoreHealthBarProps = {
    score: number;
    scoreColors: { red: number; yellow: number };
    textColor: string;
    heartColor?: string;
    showScore?: boolean;
    width?: string;
    horizontal?: boolean;
};

export const ScoreHealthBar = ({
    score,
    textColor,
    showScore = false,
    horizontal = false,
}: ScoreHealthBarProps) => {
    const { colors } = useAppTheme();
    const { scoreColors, scoreThresholds } = useSettingsStore();
    // const leftHeart = 'heart';
    // const middleHeart = score > scoreColors.red ? 'heart' : 'heart-outline';
    // const rightHeart = score > scoreColors.yellow ? 'heart' : 'heart-outline';

    const score_color = useMemo(
        () =>
            score <= scoreThresholds[0]
                ? scoreColors[0]
                : score >= scoreThresholds[1]
                  ? scoreColors[2]
                  : scoreColors[1],
        [scoreColors, scoreThresholds],
    );

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: 3,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                borderBottomLeftRadius: BORDER_RADIUS,
                borderTopRightRadius: horizontal ? 0 : BORDER_RADIUS,
                borderTopLeftRadius: horizontal ? BORDER_RADIUS : 0,
                backgroundColor: rgbToRgba(colors.primaryContainer, 0.75),
                flexDirection: 'row',
            }}
        >
            {/* <Icon size={12} color={heartColor} source={leftHeart} />
            <Icon size={12} color={heartColor} source={middleHeart} />
            <Icon size={12} color={heartColor} source={rightHeart} /> */}
            {showScore ? (
                <Text variant="labelMedium" style={{ color: score_color, fontWeight: '900' }}>
                    {' '}
                    {score}
                </Text>
            ) : null}
            {/* {leftHeart && <MCIcons name={'heart'} size={16} color={'red'} />}
            {middleHeart && <MCIcons name={'heart'} size={16} color={'red'} />}
            {rightHeart && <MCIcons name={'heart'} size={16} color={'red'} />} */}
        </View>
    );
};
