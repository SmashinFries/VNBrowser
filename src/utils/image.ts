import { useSettingsStore, useUserAuthStore } from '@/store/store';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Burnt from 'burnt';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';

export const selectImage = async (type: 'avatar' | 'banner') => {
	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		aspect: type === 'avatar' ? [1, 1] : [16, 9],
		quality: 1,
	});
	if (result.canceled) {
		return null;
	} else {
		// useUserAuthStore.setState(({ vndb }) => ({
		//     vndb: { ...vndb, [type]: result.assets[0].uri },
		// }));
		if (type === 'avatar') {
			useUserAuthStore.setState(({ vndb }) => ({
				vndb: { ...vndb, avatar: result.assets[0].uri },
			}));
		} else {
			useUserAuthStore.setState(({ vndb }) => ({
				vndb: { ...vndb, banner: result.assets[0].uri, full_banner: null },
			}));
		}
	}
};

export const saveImage = async (url: string, name = null) => {
	const { status } = await MediaLibrary.requestPermissionsAsync();
	const formattedTitle = name ?? 'vndb_' + url.split('/').pop()?.split('.')[0];
	const fileUri = FileSystem.documentDirectory + formattedTitle + `.${url.split('.').at(-1)}`;
	if (status === MediaLibrary.PermissionStatus.GRANTED) {
		try {
			const result = await FileSystem.downloadAsync(url, fileUri);
			await MediaLibrary.saveToLibraryAsync(result.uri);
			await impactAsync(ImpactFeedbackStyle.Light);
			Burnt.toast({ title: 'Image Saved', duration: 4 });
		} catch (e) {
			Burnt.toast({ title: 'Image failed to save', duration: 7 });
		}
	}
};

const gcd = (a: number, b: number) => {
	return b == 0 ? a : gcd(b, a % b);
};

export const getAspectRatio = (width: number, height: number) => {
	const ratio = gcd(width, height);
	return `${width / ratio}:${height / ratio}`;
};
