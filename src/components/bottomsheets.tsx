import { useAppTheme } from '@/providers/theme';
import { GithubReleaseResponse } from '@/types';
import { downloadAppUpdate } from '@/utils/update';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetView,
	useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Button, Divider, Icon, Text } from 'react-native-paper';

type UpdaterBottomSheetProps = {
	updateDetails: GithubReleaseResponse[0] | null;
};
// eslint-disable-next-line react/display-name
export const UpdaterBottomSheet = React.forwardRef<
	BottomSheetModalMethods,
	UpdaterBottomSheetProps
>(({ updateDetails }, ref) => {
	const { colors } = useAppTheme();
	const { dismiss } = useBottomSheetModal();

	const snapPoints = useMemo(() => ['95%'], []);

	const installUpdate = async () => {
		if (updateDetails?.assets[0]) {
			downloadAppUpdate(
				updateDetails?.assets[0].browser_download_url,
				updateDetails.tag_name,
			);
		}
	};

	return (
		<BottomSheetModal
			ref={ref}
			backgroundStyle={[{ backgroundColor: colors.surface }]}
			handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
			enableDismissOnClose
			snapPoints={snapPoints}
			backdropComponent={(props) => (
				<BottomSheetBackdrop {...props} pressBehavior={'close'} disappearsOnIndex={-1} />
			)}
		>
			<BottomSheetView>
				<View style={{ padding: 10 }}>
					<View
						style={{
							flexDirection: 'row',

							marginVertical: 5,
							alignItems: 'center',
						}}
					>
						<Icon source={'update'} size={36} color={colors.primary} />
						<View
							style={{
								paddingHorizontal: 12,
								alignItems: 'flex-start',
								justifyContent: 'center',
							}}
						>
							<Text variant="headlineSmall">New Update Available!</Text>
							<Text variant="labelLarge">Version {updateDetails?.tag_name}</Text>
						</View>
					</View>

					<Divider style={{ height: 2 }} />
				</View>
			</BottomSheetView>
			<BottomSheetScrollView>
				<View style={{ padding: 10 }}>
					<Markdown style={{ body: { color: colors.onSurface } }}>
						{updateDetails?.body}
					</Markdown>
				</View>
			</BottomSheetScrollView>
			<BottomSheetView>
				<Divider style={{ height: 2 }} />
				<View
					style={{
						paddingVertical: 5,
					}}
				>
					<Button mode="contained" style={{ marginVertical: 5 }} onPress={installUpdate}>
						Update
					</Button>
					<Button mode="outlined" style={{ marginVertical: 5 }} onPress={() => dismiss()}>
						Skip
					</Button>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	);
});
