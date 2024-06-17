import { ReactNode } from 'react';
import { Text } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { ReleaseCoverItem, ShopItem, SiteItem, UserDetails, VNQuotes } from '@/api/vndb/types';
import { openWebBrowser } from './webBrowser';
import * as Cheerio from 'cheerio';
import Uwuifier from 'uwuifier';
import { IntensityLevelEnum } from '@/api/vndb/schema';

export const uwuifyText = (inputText: string): string => {
	const uwuifier = new Uwuifier({
		spaces: {
			faces: 0,
			actions: 0,
			stutters: 0.03,
		},
		words: 1,
		exclamations: 1,
	});
	return uwuifier.uwuifySentence(inputText);
};

export const highlightUrls = (
	inputText: string | undefined,
	linkColor: string = 'blue',
	uwuify: boolean = false,
) => {
	if (!inputText) return;

	const urlPattern = /\[url=([^\]]+)\]([^\[]+)\[\/url\]/g;
	const matches = inputText.matchAll(urlPattern);

	const split_text = inputText.split(urlPattern);

	const textComponents: ReactNode[] = [];
	const match_urls: { url: string; label: string }[] = [];
	const labels = [];
	for (const match of matches) {
		const url = match[1];
		const label = match[2];
		match_urls.push({ url: url, label: label });
		labels.push(label);
	}

	for (const txt of split_text) {
		let isLink = false;
		for (const match of match_urls) {
			if (txt === match.url) {
				isLink = true;
				textComponents.push(
					<Text
						key={match.url}
						style={{ color: linkColor, textDecorationLine: 'underline' }}
						onPress={() => openWebBrowser(match.url)}
					>
						{uwuify ? uwuifyText(match.label) : match.label}
					</Text>,
				);
			}
		}
		if (!isLink && !labels.includes(txt)) {
			textComponents.push(uwuify ? uwuifyText(txt) : txt);
		}
	}

	return textComponents;
};

// cheerio is now added so should probably convert all of these at some point
export const extractVNQuotes = (htmlString: string) => {
	const regex = /<td><span>(\d+)<\/span><\/td><td>(.*?)<\/td>/g;
	const regex_char = /<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/i;
	const entries: VNQuotes[] = [];

	const $ = Cheerio.load(htmlString);
	const $quoteParent = $('h1:contains("Quotes")').parent();
	const $quoteTable = $($quoteParent).find('table');
	const $quoteRows = $($quoteTable).find('tr');
	$quoteRows.each((idx, elm) => {
		const quote_score = $(elm).find('span').text();
		const character_name = $(elm).find('a').text();
		const character_id = $(elm).find('a').attr('href')?.replace('/', '');
		const quote = $(elm).find('td:last-child').text().replace(`[${character_name}]`, '');
		const character =
			character_id && character_name ? { id: character_id, name: character_name } : null;
		entries.push({
			votes: parseInt(quote_score),
			quote: quote,
			character: character,
		});
	});

	// let match: RegExpExecArray | null;
	// while ((match = regex.exec(htmlString)) !== null) {
	// 	const id = match[1] as string;
	// 	const quote = match[2].split('/small>')[match[2].split('/small>').length - 1];
	// 	const character_match = quote.match(regex_char);
	// 	const character: { id: number; name: string } | null = character_match
	// 		? {
	// 				id: parseInt(character_match[1].replace('/c', '')),
	// 				name: character_match[2],
	// 			}
	// 		: null;
	// 	entries.push({
	// 		votes: parseInt(id),
	// 		quote: quote.replaceAll('&quot;', ''),
	// 		character: character,
	// 	});
	// }

	return entries;
};

export const extractUserDetails = (html: string) => {
	const rowPattern = /(<tr>.*?<\/tr>)/g;
	const patterns: {
		[key: string]: RegExp;
	} = {
		registered: /<td>Registered<\/td><td>(.*?)<\/td>/,
		edits: /<td>Edits<\/td><td><a href=".*?">(.*?)<\/a><\/td>/,
		votes: /<td>Votes<\/td><td>(.*?)<a href=".*?">.*?<\/a><\/td>/,
		play_times:
			/<td>Play times<\/td><td>(.*?)<span .*?>(.*?)<\/span>(.*?)<a .*?>.*?<\/a><\/td>/,
		list_stats: /<td>List stats<\/td><td>(.*?)<a href=".*?">.*?<\/a><\/td>/,
		reviews: /<td>Reviews<\/td><td>(.*?)<a href=".*?">.*?<\/a><\/td>/,
		tags: /<td>Tags<\/td><td>(.*?)<a href=".*?">.*?<\/a><\/td>/,
		images: /<td>Images<\/td><td>(.*?)<a href=".*?">.*?<\/a><\/td>/,
		forum_stats: /<td>Forum stats<\/td><td>(.*?)<a href=".*?">.*?<\/a><\/td>/,
		hair: /<tr><td class="key"><a .*?>Hair<\/a><\/td><td>(.*?)<\/td><\/tr>/,
		personality: /<tr><td class="key"><a .*?>Personality<\/a><\/td><td>(.*?)<\/td><\/tr>/,
		role: /<tr><td class="key"><a .*?>Role<\/a><\/td><td>(.*?)<\/td><\/tr>/,
		engages_in: /<tr><td class="key"><a .*?>Engages in<\/a><\/td><td>(.*?)<\/td><\/tr>/,
		subject_of: /<tr><td class="key"><a .*?>Subject of<\/a><\/td><td>(.*?)<\/td><\/tr>/,
		engages_in_s:
			/<tr><td class="key"><a .*?>Engages in \(Sexual\)<\/a><\/td><td>(.*?)<\/td><\/tr>/,
	};

	const userData: UserDetails = {
		registered: null,
		edits: null,
		votes: null,
		play_times: null,
		list_stats: null,
		reviews: null,
		tags: null,
		images: null,
		forum_stats: null,
		hair: null,
		personality: null,
		role: null,
		engages_in: null,
		subject_of: null,
		engages_in_s: null,
	};
	if (html) {
		const article = html
			.split('<article class="userpage">')
			[html.split('<article class="userpage">').length - 1].split('</article>')[0];
		const table = article.split('<table class="stripe">')[1].split('</table>')[0];

		const rows = table.match(rowPattern);
		if (!rows) return userData;
		for (const row of rows) {
			for (const [key, pattern] of Object.entries(patterns) as [
				keyof UserDetails,
				RegExp,
			][]) {
				const match = row.match(pattern);
				if (match) {
					switch (key) {
						case 'registered':
						case 'edits':
						case 'votes':
						case 'list_stats':
						case 'reviews':
						case 'tags':
						case 'images':
						case 'forum_stats':
							userData[key] = match[1];
							break;
						case 'play_times':
							userData[key] =
								`${match[1].trim()} ${match[2].trim()} ${match[3].trim()}`;
							break;
						case 'hair':
						case 'personality':
						case 'role':
						case 'engages_in':
						case 'subject_of':
						case 'engages_in_s':
							const traits = match[1].match(/<a href="\/(.*?)">(.*?)<\/a>/g);
							for (const trait of traits ?? []) {
								const trait_match = trait.match(/<a href="\/(.*?)">(.*?)<\/a>/);
								if (trait_match) {
									userData[key] = [
										...(userData[key] ?? []),
										{ id: trait_match[1], name: trait_match[2] },
									];
								}
							}
							break;
						default:
							break;
					}
				}
			}
		}
	}
	return userData;
};

export const extractVNLinks = (html: string) => {
	const siteRegex = /<a href=(.*?)>(.*?)<\/a>/g;
	const shopsRegex = /<tr id="buynow"><td>Shops<\/td><td>(.*?)<\/td><\/tr>/;
	const article = html.split('<table class="stripe">')[1];
	const shopsMatch = article.match(shopsRegex);
	const shops: ShopItem[] = [];

	if (shopsMatch) {
		const extLinks = shopsMatch[1].match(siteRegex);
		for (const tag of extLinks ?? []) {
			const tag_match = tag.match(siteRegex);
			if (tag_match) {
				const shopName = tag_match[0]
					.split('<small> @ </small>')[1]
					.replaceAll('</a>', '')
					.replaceAll('<small>', '')
					.replaceAll('</small>', '');
				shops.push({
					url: tag_match[0].split('"')[1].split('"')[0],
					name: shopName,
					amount: tag_match[0]
						.split('>')[1]
						.split('<')[0]
						.replaceAll('<small>', '')
						.replaceAll('</small>', ''),
				});
			}
		}
	}
	return { shops };
};

// using cheerio for this cause regex was killing me
export const extractReleaseCovers = (html: string) => {
	const $ = Cheerio.load(html);
	const $coverContainers = $('div.vncovers').children();
	const coverItems: ReleaseCoverItem[] = [];
	$coverContainers.each((idx, el) => {
		const $img = $(el).children().find('img');
		const imgUrl = $img.attr('src');
		const imgWidth = $img.attr('width');
		const imgHeight = $img.attr('height');
		// const sexual_state = $(el).find('.imghover').text();
		// const sexual_state_vote = sexual_state?.split('(')[1].split(')')[0] ?? '0';
		const label = $(el).find('h3').text();
		const releaseDate = $(el).find('p').text().split(' ')[0];
		const details = $(el).find('p').find('abbr');
		let platform = undefined;
		let olang = undefined;
		details.each((idx, el) => {
			if ($(el).attr('class')?.includes('icon-plat')) {
				platform = $(el).attr('class')?.split('icon-plat-')[1];
			} else if ($(el).attr('class')?.includes('icon-lang')) {
				olang = $(el).attr('class')?.split('icon-lang-')[1];
			}
		});
		const id = $(el).find('p').find('a').attr('href')?.replace('/', '');
		const alttitle = $(el).find('p').find('a').attr('title');
		const altlang = $(el).find('p').find('a').attr('lang')?.split('-')[0];
		const title = $(el).find('p').find('a').text();
		const sexualViolenceText = $(el).find('.imghover').text();
		const sexual = sexualViolenceText.includes(IntensityLevelEnum[0])
			? 0
			: sexualViolenceText.includes(IntensityLevelEnum[1])
				? 1
				: 2;
		const cover: ReleaseCoverItem = {
			image: {
				url: imgUrl ?? '',
				dims: [imgWidth ? parseInt(imgWidth) : 0, imgHeight ? parseInt(imgHeight) : 0],
				sexual: sexual,
				violence: 0, // temp
			},
			release: {
				titles: { alttitle, title, altlang },
				releaseDate: releaseDate,
				platform: platform,
				olang,
				id,
			},
			label: label,
		};
		cover && coverItems.push(cover);
	});

	return coverItems;
};

export const copyToClipboard = async (text: string | null | undefined) => {
	if (!text) return;
	await Clipboard.setStringAsync(text);
};
