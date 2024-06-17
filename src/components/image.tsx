import { IntensityLevel } from '@/api/vndb/types';
import { useSettingsStore } from '@/store/store';
import { Image, ImageStyle } from 'expo-image';
import { useState } from 'react';
import { Pressable } from 'react-native';

type CoverImageProps = {
	url: string | null | undefined;
	sexual: IntensityLevel;
	style?: ImageStyle;
};
export const CoverImage = ({ url, sexual, style }: CoverImageProps) => {
	const { allowEro, sexualLevel } = useSettingsStore();
	const [isBlurred, setIsBlurred] = useState(true);
	return (
		<Pressable style={{ flex: 1 }} onLongPress={() => setIsBlurred((prev) => !prev)}>
			<Image
				source={{ uri: url ?? '' }}
				blurRadius={(isBlurred && sexual > sexualLevel) || !allowEro ? 15 : 0}
				style={[style]}
				transition={{
					effect: 'cross-dissolve',
					timing: 'ease-in-out',
					duration: 500,
				}}
			/>
		</Pressable>
	);
};
