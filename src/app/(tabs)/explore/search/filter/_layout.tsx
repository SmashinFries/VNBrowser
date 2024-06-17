import AnimatedStack, { PaperHeader } from '@/components/headers';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const FilterLayout = () => {
    const [t] = useTranslation('titles');
    return (
        <AnimatedStack
            screenOptions={{
                header: (props) => <PaperHeader {...props} mode="small" />,
                headerShown: true,
            }}
        >
            <Stack.Screen name="index" options={{ title: t('Filter') }} />
            <Stack.Screen name="[filter_char_id]" options={{ title: t('Character Filter') }} />
        </AnimatedStack>
    );
};

export default FilterLayout;
