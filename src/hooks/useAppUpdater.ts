import { useState } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';
import { GithubReleaseResponse } from '../types';
import { Platform } from 'react-native';

// const REPO_URL = 'https://api.github.com/repos/KuzuLabz/AniThemes';
const REPO_URL = 'https://api.github.com/repos/SmashinFries/VNBrowser';

const useAppUpdates = () => {
	const [updateDetails, setUpdateDetails] = useState<GithubReleaseResponse[0] | null>(null);

	const checkForUpdates = async () => {
		const { data } = await axios.get<GithubReleaseResponse>(REPO_URL + '/releases');
		const newestVersion = data[0]?.tag_name ?? null;

		if (newestVersion && newestVersion !== Constants?.expoConfig?.version) {
			setUpdateDetails(data[0]);
			return true;
		} else {
			return false;
		}
	};

	return { updateDetails, checkForUpdates };
};

export default useAppUpdates;
