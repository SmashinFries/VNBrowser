import AnimatedStack, { ExploreHeader, PaperHeader } from '@/components/headers';
import { Stack } from 'expo-router';

const ExploreLayout = () => {
    return (
        <AnimatedStack
            screenOptions={{
                header: (props) => <PaperHeader {...props} mode="small" />,
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Browse',
                    headerShown: true,
                    header: (props) => <ExploreHeader {...props} mode="small" />,
                }}
            />
        </AnimatedStack>
    );
};

export default ExploreLayout;
