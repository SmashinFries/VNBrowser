import AnimatedStack, { ExploreHeader, PaperHeader } from '@/components/headers';
import { Stack } from 'expo-router';

const ListLayout = () => {
    return (
        <AnimatedStack
            screenOptions={{
                header: (props) => <PaperHeader {...props} mode="small" />,
                headerShown: false,
                title: 'List',
            }}
        />
    );
};

export default ListLayout;
