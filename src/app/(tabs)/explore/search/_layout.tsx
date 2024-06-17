import AnimatedStack, { PaperHeader } from '@/components/headers';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

const SearchLayout = () => {
    const [t] = useTranslation('titles');
    return (
        <AnimatedStack
            screenOptions={{
                header: (props) => <PaperHeader {...props} mode="small" />,
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="filter" options={{ headerShown: false }} />
        </AnimatedStack>
    );
};

export default SearchLayout;
