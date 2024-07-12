import RNBackgroundDownloader, {
	download,
	completeHandler,
} from '@kesha-antonov/react-native-background-downloader';
import * as FileSystem from 'expo-file-system';
import { startActivityAsync } from 'expo-intent-launcher';

export const launchAPK = async (destination: string) => {
	const localUri = await FileSystem.getContentUriAsync(destination);
	await startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
		// data: destination.replace('///', '//'),
		data: localUri,
		flags: 1,
	});
};

export const downloadAppUpdate = async (url: string, version: string) => {
	const jobId = `vnbrowser-${version.replaceAll('.', '-')}`;
	const destination = `${FileSystem.documentDirectory}/${jobId}.apk`;
	console.log('Destination:', destination);
	let task = download({
		id: jobId,
		url: url,
		destination,
		isNotificationVisible: true,
		metadata: {
			type: 'update',
			destination,
		},
	})
		.begin(({ expectedBytes, headers }) => {
			console.log(`Going to download ${expectedBytes} bytes!`);
		})
		.progress(({ bytesDownloaded, bytesTotal }) => {
			console.log(`Downloaded: ${(bytesDownloaded / bytesTotal) * 100}%`);
		})
		.done(({ bytesDownloaded, bytesTotal }) => {
			console.log('Download is done!', { bytesDownloaded, bytesTotal });

			// PROCESS YOUR STUFF
			launchAPK(destination);

			// FINISH DOWNLOAD JOB
			completeHandler(jobId);
		})
		.error(({ error, errorCode }) => {
			console.log('Download canceled due to error: ', { error, errorCode });
		});
};

export const reattachDownloads = async () => {
	let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
	for (let task of lostTasks) {
		console.log(`Task ${task.id} was found!`);
		task.progress(({ bytesDownloaded, bytesTotal }) => {
			console.log(`Downloaded: ${(bytesDownloaded / bytesTotal) * 100}%`);
		})
			.done(({ bytesDownloaded, bytesTotal }) => {
				if (task.metadata.type === 'update') {
					launchAPK(task.metadata.destination);
				}
				console.log('Download is done!', { bytesDownloaded, bytesTotal });
			})
			.error(({ error, errorCode }) => {
				console.log('Download canceled due to error: ', { error, errorCode });
			});
	}
};

export const removeUpdateAPKs = async () => {
	const dir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string);
	for (const file of dir) {
		if (file.includes('vnbrowser') && file.includes('.apk')) {
			console.log('Found!:', `${FileSystem.documentDirectory as string}/${file}`);
			await FileSystem.deleteAsync(`${FileSystem.documentDirectory as string}/${file}`);
		}
	}
};
