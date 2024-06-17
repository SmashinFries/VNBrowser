import { useAppTheme } from '@/providers/theme';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

type DividerVerticalProps = {
    size?: number;
    style?: ViewStyle;
};
export const DividerVertical = ({ style, size }: DividerVerticalProps) => {
    const { colors } = useAppTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.outlineVariant,
                    height: '100%',
                    width: size ?? StyleSheet.hairlineWidth,
                },
                style,
            ]}
        />
    );
};
