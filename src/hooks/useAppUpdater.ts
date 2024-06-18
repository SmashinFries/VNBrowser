import { useState } from 'react';
import Constants from 'expo-constants';
import { sendToast } from '@/utils/toast';

const RELEASE_URL = 'https://api.github.com/repos/SmashinFries/VNBrowser/releases';

export const useAppUpdater = () => {
	const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
	const [updateLink, setUpdateLink] = useState<string | null>(null);
	const [showUpdateDialog, setShowUpdateDialog] = useState(false);

	const onUpdateDialogDismiss = () => setShowUpdateDialog(false);

	const checkForUpdates = async () => {
		setIsCheckingUpdates(true);
		const results = await fetch(RELEASE_URL);
		const jsonResult = await results?.json();
		const newestVersion = jsonResult[0]?.tag_name ?? null;

		if (newestVersion && newestVersion !== Constants?.expoConfig?.version) {
			setUpdateLink(jsonResult[0]?.assets[0]?.browser_download_url);
			setShowUpdateDialog(true);
		} else {
			sendToast('No updates available', 5);
		}
		setIsCheckingUpdates(false);
	};

	return {
		checkForUpdates,
		onUpdateDialogDismiss,
		isCheckingUpdates,
		updateLink,
		showUpdateDialog,
	};
};
