import { useUserAuth } from '@/hooks/useUserAuth';
import { useAppTheme } from '@/providers/theme';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { Avatar, Button, Divider, IconButton, Text, TextInput } from 'react-native-paper';
import { ErrorMessage } from '../text';
import { openWebBrowser } from '@/utils/webBrowser';
import { selectImage } from '@/utils/image';
import { Image } from 'expo-image';

type VNDBAuthSectionProps = {
	showTitle?: boolean;
};
export const VNDBAuthSection = ({ showTitle = true }: VNDBAuthSectionProps) => {
	const [t] = useTranslation('setup');
	const { colors } = useAppTheme();
	const { vndb, loading, logoutVNDB, submitVNDBToken, openTokenPage } = useUserAuth();
	const [tempToken, setTempToken] = useState<string>('');
	const [isVisible, setIsVisible] = useState<boolean>(false);

	return (
		<View
			style={{
				flex: 1,
				// backgroundColor: colors.surfaceContainer,
				justifyContent: 'flex-start',
				paddingTop: 20,
				paddingHorizontal: 10,
			}}
		>
			{showTitle && (
				<>
					<Text variant="headlineMedium" style={{ textAlign: 'center' }}>
						VNDB Account
					</Text>
					<Divider style={{ marginVertical: 15 }} />
				</>
			)}
			<ScrollView
				contentContainerStyle={{
					flex: 1,
					// justifyContent: 'center',
					// alignItems: 'flex-start',
				}}
				keyboardDismissMode="on-drag"
			>
				{!vndb.userID ? (
					<View>
						<Text>1. Login to VNDB and create / copy a token.</Text>
						<Button
							onPress={() => openTokenPage(setTempToken)}
							mode="elevated"
							style={{ marginVertical: 15 }}
						>
							Login / Register
						</Button>
						<Text>2. Paste token here!</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TextInput
								value={tempToken}
								onChangeText={(txt) => setTempToken(txt)}
								mode="outlined"
								label={'Token'}
								inputMode="text"
								secureTextEntry={!isVisible}
								blurOnSubmit
								right={
									<TextInput.Icon
										icon={isVisible ? 'eye-outline' : 'eye-off-outline'}
										onPress={() => setIsVisible((prev) => !prev)}
										forceTextInputFocus={false}
									/>
								}
								onSubmitEditing={(e) => submitVNDBToken(e.nativeEvent.text)}
								style={{ marginVertical: 15, flexGrow: 1, flex: 1 }}
							/>
							<IconButton
								icon={'close'}
								style={{ flexShrink: 1 }}
								onPress={() => setTempToken('')}
								disabled={tempToken.length < 1}
							/>
						</View>
						<Button
							mode="elevated"
							disabled={loading}
							onPress={() => submitVNDBToken(tempToken)}
						>
							Submit
						</Button>
					</View>
				) : (
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Text variant="titleLarge" style={{ paddingVertical: 10 }}>
							Welcome <Text style={{ fontWeight: '900' }}>{vndb.username}</Text>!
						</Text>
						{!vndb.permissions?.includes('listread') && (
							<ErrorMessage
								title="No Read Permission!"
								message={"Your list won't be read."}
							/>
						)}
						{!vndb.permissions?.includes('listwrite') && (
							<ErrorMessage
								title="No Write Permission!"
								message={'Adding / removing VNs is disabled.'}
							/>
						)}
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								width: '100%',
								paddingVertical: 20,
								justifyContent: 'space-evenly',
							}}
						>
							<Pressable
								onPress={() => selectImage('avatar')}
								style={{ alignItems: 'center' }}
							>
								<Avatar.Image
									size={100}
									source={{ uri: vndb.avatar ?? undefined }}
								/>
								<Button>Update Avatar</Button>
							</Pressable>
							<Pressable
								onPress={() => selectImage('banner')}
								style={{ alignItems: 'center' }}
							>
								<Image
									source={{ uri: vndb.banner ?? undefined }}
									style={{ height: 100, aspectRatio: 16 / 9 }}
								/>
								<Button>Update Banner</Button>
							</Pressable>
						</View>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-evenly',
								marginTop: 10,
							}}
						>
							<Button
								mode="contained"
								onPress={() =>
									openWebBrowser(`https://vndb.org/${vndb.userID}/edit#api`, {
										onComplete: () => submitVNDBToken(),
									})
								}
							>
								Update Permissions
							</Button>
							<View style={{ width: 15 }} />
							<Button mode="elevated" onPress={logoutVNDB}>
								Logout
							</Button>
						</View>
					</View>
				)}
			</ScrollView>
		</View>
	);
};
