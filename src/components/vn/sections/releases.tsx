import {
	Button,
	DataTable,
	DataTableTitleProps,
	Divider,
	Icon,
	IconButton,
	Menu,
	Surface,
	Text,
} from 'react-native-paper';
import { useMemo, useState } from 'react';
import { VNReleasesResponse, VNUserListResponse } from '@/api/vndb/types';
import { Accordion } from '@/components/accordion';
import { View } from 'react-native';
import { LanguageIcon, PlatformSVG } from '@/components/icons';
import _ from 'lodash';
import { useSettingsStore } from '@/store/store';
import { ElevationLevels } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@/providers/theme';
import { openWebBrowser } from '@/utils/webBrowser';
import { ExternalLinks, LanguageEnum } from '@/api/vndb/schema';
import { router } from 'expo-router';
import { ReleaseItem } from '@/components/releases/cards';

type VNReleasesProps = {
	data: VNReleasesResponse['results'];
	olang: keyof typeof LanguageEnum | undefined;
	listReleases?: VNUserListResponse['results']['0']['releases'];
};
const VNReleases = ({ data, olang, listReleases }: VNReleasesProps) => {
	const { ownedPlatforms } = useSettingsStore();

	const languages = _.uniq(data.map((rel) => rel.languages.flatMap((el) => el.lang)).flat());
	// const languages = _.uniqW

	const OlangReleases = useMemo(
		() =>
			data
				.filter((rel) =>
					rel.languages.find((val) => val.lang === olang) && ownedPlatforms.length > 0
						? _.some(rel.platforms, (el) => _.includes(ownedPlatforms, el))
						: true,
				)
				.filter((_, idx) => idx < 5),
		[data, olang],
	);
	const ENReleases = useMemo(
		() =>
			data
				.filter((rel) =>
					rel.languages.find((val) => val.lang === 'en') && ownedPlatforms.length > 0
						? _.some(rel.platforms, (el) => _.includes(ownedPlatforms, el))
						: true,
				)
				.filter((_, idx) => idx < 5),
		//
		[data],
	);

	return (
		<Accordion
			title="Releases"
			description={
				<View style={{ flexDirection: 'row' }}>
					{languages?.map((lang, idx) => (
						<LanguageIcon key={idx} name={lang} size={14} style={{ marginRight: 5 }} />
					))}
				</View>
			}
		>
			{data.length > 1 && (
				<Button
					mode="elevated"
					onPress={() => router.push('/releases/' + data[0].vns[0].id)}
					style={{ marginHorizontal: 20 }}
				>
					View All
				</Button>
			)}
			{listReleases && listReleases?.length > 0 && (
				<Accordion title="Your Releases" titleVariant="titleMedium" disableSpring>
					<View style={{ paddingVertical: 10 }}>
						{listReleases?.map(
							(release, idx) =>
								data.find((rel) => rel.id === release.id) && (
									<ReleaseItem
										key={idx}
										release={data.find((rel) => rel.id === release.id)}
										lang="en"
									/>
								),
						)}
					</View>
				</Accordion>
			)}
			{ENReleases?.length > 0 && (
				<Accordion
					title="English"
					titleVariant="titleMedium"
					left={<LanguageIcon name={'en'} size={14} style={{ marginHorizontal: 15 }} />}
					disableSpring
				>
					<View style={{ paddingVertical: 10 }}>
						{ENReleases?.length > 0 &&
							ENReleases.map((release, idx) => (
								<ReleaseItem key={idx} release={release} lang="en" />
							))}
					</View>
				</Accordion>
			)}
			{olang && olang !== 'en' && OlangReleases?.length > 0 && (
				<Accordion
					title={olang ? LanguageEnum[olang] : 'Unknown'}
					titleVariant="titleMedium"
					left={
						olang && (
							<LanguageIcon name={olang} size={14} style={{ marginHorizontal: 15 }} />
						)
					}
					disableSpring
				>
					<View style={{ paddingVertical: 10 }}>
						{OlangReleases?.length > 0 &&
							OlangReleases.map((release, idx) => (
								<ReleaseItem key={idx} release={release} lang={olang} />
							))}
					</View>
				</Accordion>
			)}
		</Accordion>
	);
};

export default VNReleases;
