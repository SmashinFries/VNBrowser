import { useAppTheme } from '@/providers/theme';
import { View } from 'react-native';
import { Button, Divider, Icon, IconButton, Menu, Surface, Text } from 'react-native-paper';
import { LanguageIcon, PlatformSVG, PlatformSVGProps } from '../icons';
import { useState } from 'react';
import { openWebBrowser } from '@/utils/webBrowser';
import { LanguageEnum, PlatformsEnum } from '@/api/vndb/schema';
import { router } from 'expo-router';
import { highlightUrls } from '@/utils/text';
import { VNReleasesResponse } from '@/api/vndb/types';

const ReleaseLinkMenu = ({ links }: { links: VNReleasesResponse['results'][0]['extlinks'] }) => {
	const [expanded, setExpanded] = useState(false);

	if (!links) return null;

	return (
		<Menu
			visible={expanded}
			onDismiss={() => setExpanded(false)}
			anchor={<IconButton icon={'dots-vertical'} onPress={() => setExpanded(true)} />}
		>
			{links.map((link, idx) => (
				<Menu.Item
					key={idx}
					title={link.label}
					leadingIcon={'open-in-new'}
					onPress={() => openWebBrowser(link.url)}
				/>
			))}
		</Menu>
	);
};

export const ReleaseItem = ({
	release,
	lang,
}: {
	release: VNReleasesResponse['results'][0];
	lang: keyof typeof LanguageEnum;
}) => {
	const { colors } = useAppTheme();

	return (
		<Surface style={{ marginVertical: 5, padding: 10, borderRadius: 12, marginHorizontal: 15 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<View style={{ flexShrink: 1 }}>
					<Text variant="titleMedium">{release.title}</Text>
					{!release.official && (
						<Text variant="labelLarge" style={{ color: colors.onSurfaceVariant }}>
							{`Unofficial${release.patch ? ' patch' : ''}`.trim()}
						</Text>
					)}
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							paddingVertical: 5,
						}}
					>
						{release.languages && (
							<LanguageIcon name={lang} size={14} style={{ marginHorizontal: 5 }} />
						)}

						{release.minage ? (
							<Text
								variant="labelLarge"
								style={[
									{
										textAlign: 'center',
										marginHorizontal: 5,
									},
									release.minage >= 18 && { color: 'red' },
								]}
							>
								<Text> | </Text>
								{release.minage} +
								{release.uncensored && (
									<Icon
										source={'chili-mild'}
										color="green"
										size={undefined as unknown as number}
									/>
								)}
							</Text>
						) : null}
						{release.platforms && <Text>{' | '}</Text>}
						{release.platforms?.map((platform, idx) => (
							<PlatformSVG
								key={idx}
								name={platform as PlatformSVGProps['name']}
								height={14}
								width={14}
								style={{ marginHorizontal: 5 }}
							/>
						))}
					</View>
				</View>
				<ReleaseLinkMenu links={release.extlinks} />
			</View>

			{release.notes && (
				<>
					<Divider style={{ marginVertical: 5 }} />
					<Text>{highlightUrls(release.notes, colors.primary)}</Text>
				</>
			)}
			<Divider style={{ marginVertical: 5 }} />
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Button onPress={() => router.push(`/release/${release.id}`)}>View</Button>
				{/* {release.extlinks.map((link, idx) => (
					<Button key={idx} compact onPress={() => openWebBrowser(link.url)}>
						{link.label}
					</Button>
				))} */}
			</View>
		</Surface>
	);
};
