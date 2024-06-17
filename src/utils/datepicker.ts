import {
    DateTimePickerAndroid,
    AndroidNativeProps,
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

export const openDatePicker = (
    mode: AndroidNativeProps['mode'],
    value: Date,
    onChange: (event: DateTimePickerEvent, date?: Date) => void,
) =>
    DateTimePickerAndroid.open({
        mode,
        onChange,
        value,
    });
