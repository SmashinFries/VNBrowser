import { ReactNode } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { FadeOut } from 'react-native-reanimated';

export const LoadingView = ({ children }: { children?: ReactNode }) => {
	return (
		<Animated.View
			exiting={FadeOut}
			style={{
				height: '100%',
				width: '100%',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{children}
			<ActivityIndicator animating={true} size={'large'} />
		</Animated.View>
	);
};
