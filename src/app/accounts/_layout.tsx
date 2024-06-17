import AnimatedStack, { PaperHeader } from '@/components/headers';
import { Stack } from 'expo-router';

const AccountsLayout = () => {
    return (
        <AnimatedStack
            screenOptions={{
                header: (props) => <PaperHeader {...props} />,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Accounts',
                    // header: (props) => <MoreHeader {...props} />,
                }}
            />
            <Stack.Screen
                name="vndb"
                options={{
                    title: 'VNDB Account',
                    // header: (props) => <MoreHeader {...props} />,
                }}
            />
            <Stack.Screen
                name="steam"
                options={{
                    title: 'Steam Account',
                    // header: (props) => <MoreHeader {...props} />,
                }}
            />
        </AnimatedStack>
    );
};

export default AccountsLayout;
