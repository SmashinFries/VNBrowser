// LIST OF RELEASES

import { useVNReleases } from '@/api/vndb/queries/hooks';
import { Accordion } from '@/components/accordion';
import { LanguageIcon, PlatformSVG, PlatformSVGProps } from '@/components/icons';
import { useLocalSearchParams } from 'expo-router';
import { Platform, ScrollView, View } from 'react-native';
import _ from 'lodash';
import { useMemo } from 'react';
import { useSettingsStore } from '@/store/store';
import { ReleaseItem } from '@/components/releases/cards';
import { LanguageEnum } from '@/api/vndb/schema';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

const VNReleasesListPage = () => {
	const { vId } = useLocalSearchParams<{ vId: string }>();
	const { data, isLoading } = useVNReleases(vId, true);

	const olang = useMemo(() => data?.results[0]?.vns[0]?.olang, [data?.results]);
	const languages = useMemo(
		() =>
			_.uniq(
				data?.results.map((rel) => {
					if (
						rel.languages[0].lang &&
						!_.some(rel.languages, (el) => ['en', olang].includes(el.lang))
					) {
						return rel.languages[0].lang;
					}
				}),
			),
		[data?.results, olang],
	);
	const olangReleases = useMemo(
		() =>
			data?.results.filter(
				(rel) => rel.languages.find((val) => val.lang === olang)?.lang === olang,
			),
		[data?.results, olang],
	);
	const enReleases = useMemo(
		() => data?.results?.filter((rel) => rel.languages[0].lang === 'en'),
		[data?.results],
	);

	return (
		<Animated.View entering={FadeIn}>
			<ScrollView>
				{isLoading ? (
					<Animated.View
						exiting={FadeOut}
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
					>
						<ActivityIndicator />
					</Animated.View>
				) : (
					<Animated.View entering={FadeIn}>
						{enReleases && enReleases?.length > 0 && (
							<Accordion
								title="English"
								titleVariant="titleMedium"
								left={
									<LanguageIcon
										name={'en'}
										size={14}
										style={{ marginHorizontal: 15 }}
									/>
								}
								disableSpring
							>
								<FlashList
									data={enReleases}
									renderItem={({ item }) => (
										<ReleaseItem release={item} lang="en" />
									)}
									contentContainerStyle={{ paddingVertical: 10 }}
									keyExtractor={(item) => item.id.toString()}
									estimatedItemSize={204}
								/>
							</Accordion>
						)}
						{olang && olang !== 'en' && (
							<Accordion
								title={olang ? LanguageEnum[olang] : 'Japanese'}
								titleVariant="titleMedium"
								left={
									<LanguageIcon
										name={olang ? olang : 'ja'}
										size={14}
										style={{ marginHorizontal: 15 }}
									/>
								}
								disableSpring
							>
								<FlashList
									data={olangReleases}
									renderItem={({ item }) => (
										<ReleaseItem release={item} lang={olang} />
									)}
									contentContainerStyle={{ paddingVertical: 10 }}
									keyExtractor={(item) => item.id.toString()}
									estimatedItemSize={204}
								/>
							</Accordion>
						)}
						{languages?.map(
							(lang, idx) =>
								lang && (
									<Accordion
										key={idx}
										titleVariant="titleMedium"
										title={LanguageEnum[lang]}
										left={
											<LanguageIcon
												name={lang}
												size={14}
												style={{ marginHorizontal: 15 }}
											/>
										}
										disableSpring
									>
										<FlashList
											data={data?.results.filter((rel, idx) =>
												rel.languages.find((val) => val.lang === lang),
											)}
											renderItem={({ item }) => (
												<ReleaseItem release={item} lang={lang} />
											)}
											contentContainerStyle={{ paddingVertical: 10 }}
											keyExtractor={(item) => item.id.toString()}
											estimatedItemSize={204}
										/>
										{/* <View style={{ paddingVertical: 10 }}>
											{data?.results &&
												data?.results
													.filter((rel, idx) =>
														rel.languages.find(
															(val) => val.lang === lang,
														),
													)
													?.map((release, idx) => (
														<ReleaseItem
															key={idx}
															release={release}
															lang={lang}
														/>
														// <Text key={idx}>TEST</Text>
													))}
										</View> */}
									</Accordion>
								),
						)}
					</Animated.View>
				)}
			</ScrollView>
		</Animated.View>
	);
};

export default VNReleasesListPage;
