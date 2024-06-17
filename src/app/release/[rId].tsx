import { useReleaseEntry, useVNRelease } from '@/api/vndb/queries/hooks';
import { MediumsEnum } from '@/api/vndb/schema';
import { ReleaseProducer, VNReleasesResponse } from '@/api/vndb/types';
import { Accordion } from '@/components/accordion';
import { PlatformChip } from '@/components/chips';
import { ExpandableDescription } from '@/components/description';
import { VNHeader } from '@/components/headers';
import { LanguageIcon, PlatformSVG } from '@/components/icons';
import { CoverImage } from '@/components/image';
import { LoadingView } from '@/components/loading';
import { ReleaseListEditButton } from '@/components/releases/button';
import { SectionHeader } from '@/components/text';
import { useSettingsStore } from '@/store/store';
import { getAspectRatio } from '@/utils/image';
import { copyToClipboard } from '@/utils/text';
import { openWebBrowser } from '@/utils/webBrowser';
import { Image, ImageTransition } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Chip, Icon, List, Text } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

const ReleaseListDetail = ({ title, text }: { title: string | number; text: string | null }) => {
	if (!text) return null;
	return (
		<List.Item
			title={title}
			right={(props) => (
				<Text
					{...props}
					onLongPress={() => copyToClipboard(text)}
					style={{ maxWidth: '60%' }}
				>
					{text}
				</Text>
			)}
		/>
	);
};

const ReleaseListLink = ({ title, producer }: { title: string; producer?: ReleaseProducer }) => {
	if (!producer) return null;
	return (
		<List.Item
			title={title}
			right={(props) => (
				<Button
					{...props}
					onPress={() => openWebBrowser(`https://www.vndb.org/${producer.id}`)}
					onLongPress={() => copyToClipboard(producer.name)}
					labelStyle={{ textTransform: 'capitalize' }}
					compact
				>
					{producer.name}
				</Button>
			)}
		/>
	);
};

const ReleasePage = () => {
	const { rId } = useLocalSearchParams<{ rId: string }>();
	const { data, isLoading } = useVNRelease(rId);
	const entry = useReleaseEntry(rId);

	return (
		<View>
			{isLoading && <LoadingView />}
			{!isLoading && data && (
				<Animated.View entering={FadeIn}>
					<Stack.Screen
						options={{
							header: (props) => (
								<VNHeader
									{...props}
									shareLink={`https://www.vndb.org/${data.id}`}
								/>
							),
						}}
					/>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{ alignItems: 'center' }}>
							<CoverImage
								url={data.vns[0]?.image?.url}
								sexual={data.vns[0]?.image?.sexual ?? 2}
								style={{
									width: '100%',
									height: 300,
									aspectRatio: 3 / 4,
									borderRadius: 8,
								}}
							/>
							<Text
								variant="titleLarge"
								numberOfLines={3}
								style={{ paddingHorizontal: 15, marginVertical: 15 }}
							>
								{data.title}
							</Text>
						</View>
						<ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 15 }}>
							{data.platforms?.map((platform, idx) => (
								<PlatformChip key={idx} platform={platform} />
							))}
						</ScrollView>
						<ReleaseListEditButton rId={rId as string} />
						<ExpandableDescription text={data.notes} initialHeight={90} />
						<Accordion title="Details" initialExpand>
							{data.languages?.length > 1 && (
								<>
									<List.Item title={'Titles'} />
									<View style={{ paddingHorizontal: 15 }}>
										{/* sort by main */}
										{data.languages
											?.sort((a, b) => Number(b.main) - Number(a.main))
											.map((lang, idx) => (
												<Text
													key={idx}
													onPress={() =>
														copyToClipboard(lang.title ?? data.title)
													}
													style={{ paddingVertical: 5 }}
												>
													<LanguageIcon
														name={lang.lang}
														size={14}
														style={{ marginRight: 5 }}
													/>{' '}
													{lang.title ?? data.title}
												</Text>
											))}
									</View>
								</>
							)}
							<ReleaseListDetail title={'Release'} text={data.released} />
							<ReleaseListDetail
								title={'Erotic content'}
								text={
									data.has_ero
										? !data.uncensored
											? 'Contains erotic scenes with optical censoring'
											: 'Contains uncensored erotic scenes'
										: null
								}
							/>
							<ReleaseListDetail
								title={'Publication'}
								text={data.freeware ? 'Freeware' : 'Non-free'}
							/>
							<ReleaseListDetail
								title={'Medium'}
								text={data.media
									.map((media) =>
										media.qty > 1
											? MediumsEnum[media.medium] + ` (${media.qty})`
											: MediumsEnum[media.medium],
									)
									.join(', ')}
							/>
							<ReleaseListDetail title={'Engine'} text={data.engine} />
							<ReleaseListDetail
								title={'Resolution'}
								text={
									data.resolution
										? data.resolution?.join(' x ') +
											` (${getAspectRatio(data.resolution[0], data.resolution[1])})`
										: null
								}
							/>
							<ReleaseListLink
								title={'Developer'}
								producer={data.producers?.find((prod) => prod.developer === true)}
							/>
							<ReleaseListLink
								title={'Publisher'}
								producer={data.producers?.find((prod) => prod.publisher === true)}
							/>
							<ReleaseListDetail
								title={'Voiced'}
								text={data.voiced ? 'Voiced' : 'Not voiced'}
							/>
							<ReleaseListDetail title={'GTIN'} text={data.gtin} />
						</Accordion>
						<SectionHeader>Links</SectionHeader>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								alignItems: 'flex-start',
								justifyContent: 'center',
								padding: 15,
							}}
						>
							{data.extlinks?.map((link, idx) => (
								<Button
									key={idx}
									onPress={() => openWebBrowser(link.url)}
									style={{ marginRight: 10 }}
									mode="contained-tonal"
									icon={'open-in-new'}
								>
									{link.label}
								</Button>
							))}
						</ScrollView>
					</ScrollView>
				</Animated.View>
			)}
		</View>
	);
};

export default ReleasePage;
