import { Pressable, ScrollView, View } from 'react-native';
import { ActivityIndicator, List, Portal, Surface, Text } from 'react-native-paper';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Accordion } from '@/components/accordion';
import { UpdateDialog } from '@/components/dialogs';
import { openWebBrowser } from '@/utils/webBrowser';
import { Image } from 'expo-image';
import { LinkButton } from '@/components/buttons';
import { useAppUpdater } from '@/hooks/useAppUpdater';
import { useAppTheme } from '@/providers/theme';

const OtherAppItem = ({
	title,
	imgUrl,
	link,
	status = 'Coming Soon!',
}: {
	title: string;
	imgUrl?: string;
	link?: string;
	status?: string;
}) => {
	return (
		<Pressable
			onPress={() => openWebBrowser(link ?? null)}
			style={{ maxWidth: 100, marginHorizontal: 10 }}
		>
			<Surface
				elevation={2}
				style={{
					borderRadius: 12,
					justifyContent: 'center',
					alignItems: 'center',
					height: 90,
					width: 90,
				}}
			>
				{imgUrl ? (
					<Image
						source={{
							uri: imgUrl,
						}}
						style={{ height: '100%', width: '100%' }}
						contentFit="contain"
					/>
				) : (
					<Text style={{ textAlign: 'center' }}>{status}</Text>
				)}
			</Surface>
			<Text numberOfLines={2} style={{ paddingTop: 5, textAlign: 'center' }}>
				{title}
			</Text>
		</Pressable>
	);
};

const AboutPage = () => {
	const {
		checkForUpdates,
		onUpdateDialogDismiss,
		isCheckingUpdates,
		showUpdateDialog,
		updateLink,
	} = useAppUpdater();
	const { colors } = useAppTheme();
	return (
		<View style={{ flex: 1, backgroundColor: colors.surface }}>
			<List.Item
				title={'Version'}
				description={`${Constants?.expoConfig?.version}`}
				descriptionStyle={{ textTransform: 'capitalize' }}
				descriptionNumberOfLines={3}
			/>
			{Constants.executionEnvironment !== ExecutionEnvironment.StoreClient && (
				<List.Item
					title={'Check for Updates'}
					onPress={checkForUpdates}
					right={(props) => (isCheckingUpdates ? <ActivityIndicator {...props} /> : null)}
				/>
			)}
			<Accordion title="More Apps" titleFontSize={16} initialExpand>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<OtherAppItem
						title={'Goraku'}
						imgUrl="https://raw.githubusercontent.com/KuzuLabz/GorakuSite/main/public/logo.png"
						link="https://goraku.kuzulabz.com/"
					/>
					<OtherAppItem
						title={'WaifuTagger'}
						imgUrl="https://github.com/KuzuLabz/WaifuTagger/blob/master/assets/adaptive-icon.png?raw=true"
						link="https://github.com/KuzuLabz/WaifuTagger"
					/>
				</ScrollView>
			</Accordion>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'flex-end',
				}}
			>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'flex-end',
						marginBottom: 10,
					}}
				>
					<Text>Created by KuzuLabz ❤️</Text>
				</View>

				<View
					style={{
						alignItems: 'flex-end',
						justifyContent: 'center',
						flexDirection: 'row',
					}}
				>
					<LinkButton url="https://kuzulabz.com/" icon={'earth'} size={28} />
					<LinkButton
						url="https://www.kuzumerch.com"
						icon={'storefront-outline'}
						size={28}
					/>
				</View>
			</View>
			<Portal>
				<UpdateDialog
					visible={showUpdateDialog}
					onDismiss={onUpdateDialogDismiss}
					updateLink={updateLink}
				/>
			</Portal>
		</View>
	);
};

export default AboutPage;
