import AnimatedStack, { MoreHeader, PaperHeader } from '@/components/headers';
import { Stack } from 'expo-router';

const MoreLayout = () => {
	return (
		<AnimatedStack
			screenOptions={{
				header: (props) => <MoreHeader />,
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					title: 'More',
				}}
			/>
		</AnimatedStack>
	);
};

export default MoreLayout;
