import { copyToClipboard } from '@/utils/text';
import { openWebBrowser } from '@/utils/webBrowser';
import { View } from 'react-native';
import { IconButton, List, ListItemProps, Text } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export const ListRadioItem = (props: ListItemProps & { isSelected: boolean }) => {
    return (
        <List.Item
            {...props}
            left={() => (
                <List.Icon icon={props.isSelected ? 'radiobox-marked' : 'radiobox-blank'} />
            )}
        />
    );
};

export const ListCheckboxItem = (props: ListItemProps & { isSelected: boolean }) => {
    return (
        <List.Item
            {...props}
            left={() => (
                <List.Icon icon={props.isSelected ? 'checkbox-marked' : 'checkbox-blank'} />
            )}
        />
    );
};

type LinkButtonProps = {
    url: string;
    icon: IconSource;
    label?: string;
    iconColor?: string;
    transparentBg?: boolean;
    bgColor?: string;
    size?: number;
};
export const LinkButton = ({
    url,
    icon,
    label,
    iconColor,
    transparentBg,
    bgColor,
    size,
}: LinkButtonProps) => {
    return (
        <View style={{ alignItems: 'center', marginHorizontal: 10, marginBottom: 20 }}>
            <IconButton
                mode="contained"
                size={size ?? 36}
                iconColor={iconColor ?? undefined}
                icon={icon}
                onPress={() => openWebBrowser(url)}
                onLongPress={() => copyToClipboard(url)}
                style={[
                    transparentBg && { backgroundColor: 'transparent', borderRadius: 0 },
                    bgColor && { backgroundColor: bgColor },
                ]}
            />
            {label ? <Text numberOfLines={2}>{label}</Text> : null}
        </View>
    );
};
