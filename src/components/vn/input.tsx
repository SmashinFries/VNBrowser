import { VNRating } from '@/api/vndb/types';
import { useAppTheme } from '@/providers/theme';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import {
    Button,
    Dialog,
    HelperText,
    List,
    Menu,
    Portal,
    Text,
    TextInput,
} from 'react-native-paper';

type VoteInputDialogProps = {
    visible: boolean;
    onDismiss: () => void;
    initVote: number;
    onVote: (vote: number) => void;
};

export const VoteInputDialog = ({ initVote, onVote, visible, onDismiss }: VoteInputDialogProps) => {
    const [temp, setTemp] = useState<string | undefined>(initVote ? `${initVote}` : '');
    const tempInt: number | undefined = useMemo(() => parseInt(temp ?? '') ?? undefined, [temp]);
    const { colors } = useAppTheme();

    const options = {
        10: '1 (worst ever)',
        20: '2 (awful)',
        30: '3 (bad)',
        40: '4 (weak)',
        50: '5 (so-so)',
        60: '6 (decent)',
        70: '7 (good)',
        80: '8 (very good)',
        90: '9 (excellent)',
        100: '10 (masterpiece)',
    };

    const onConfirm = () => {
        tempInt && onVote(tempInt);
        onDismiss();
    };

    const hasErrors = () => {
        return (tempInt && tempInt > 100) || tempInt < 10;
    };

    return (
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>{'Set Vote'}</Dialog.Title>
            <Dialog.Content>
                <TextInput
                    mode="outlined"
                    label={'Custom Vote'}
                    keyboardType="number-pad"
                    value={temp}
                    maxLength={3}
                    onChangeText={(txt) => setTemp(txt)}
                />
                <HelperText type="error" visible={hasErrors() && temp ? true : false}>
                    Must be between 10 - 100
                </HelperText>
            </Dialog.Content>
            <Dialog.ScrollArea>
                <ScrollView keyboardDismissMode="on-drag">
                    {Object.entries(options)
                        .sort((a, b) => b[0] - a[0])
                        .map(([key, value]) => (
                            <List.Item
                                key={key}
                                title={value}
                                left={(props) => (
                                    <List.Icon
                                        {...props}
                                        icon={
                                            tempInt === parseInt(key)
                                                ? 'radiobox-marked'
                                                : 'radiobox-blank'
                                        }
                                    />
                                )}
                            />
                        ))}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button onPress={onDismiss}>Cancel</Button>
                <Button onPress={onConfirm}>Submit</Button>
            </Dialog.Actions>
        </Dialog>
    );
};
