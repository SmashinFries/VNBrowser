import AnimatedStack, { PaperHeader } from '@/components/headers';
import { Stack } from 'expo-router';

const SettingsLayout = () => {
    return (
        <AnimatedStack
            screenOptions={{
                header: (props) => <PaperHeader {...props} />,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Settings',
                    // header: (props) => <MoreHeader {...props} />,
                }}
            />
            <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
            <Stack.Screen name="appFilters" options={{ title: 'Filters' }} />
            {/* <Stack.Screen name="accounts" options={{ title: 'Accounts' }} />
			<Stack.Screen name="settings" options={{ title: 'Settings', headerShown: false }} />
			<Stack.Screen name="about" options={{ title: 'About' }} /> */}
        </AnimatedStack>
    );
};

export default SettingsLayout;
