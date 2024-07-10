import { useUserAuthStore } from '@/store/store';
import { Image } from 'expo-image';
import { ReactNode, useMemo } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/providers/theme';

type ProfileBannerProps = {
	type?: 'banner' | 'full_banner';
	children?: ReactNode;
};
export const ProfileBanner = ({ children }: ProfileBannerProps) => {
	const { vndb } = useUserAuthStore();
	const { width, height } = useWindowDimensions();
	const { colors } = useAppTheme();

	return (
		<View style={{ flex: 1, backgroundColor: colors.surface }}>
			{vndb.banner && (
				<View
					style={{
						height: undefined,
						width: '100%',
						position: 'absolute',
						top: 0,
						aspectRatio: 16 / 9,
					}}
				>
					<Image
						source={{ uri: vndb.banner }}
						style={{
							height: undefined,
							width: '100%',
							aspectRatio: 16 / 9,
						}}
						contentFit="cover"
						blurRadius={1}
					/>
				</View>
			)}
			<ScrollView>
				<View style={{ flex: 1 }}>{children}</View>
			</ScrollView>
		</View>
	);
};
