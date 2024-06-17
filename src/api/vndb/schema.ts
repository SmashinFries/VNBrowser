import { VNSortOptions } from './types';

// 1 = not voiced, 2 = only ero scenes voiced, 3 = partially voiced, 4 = fully voiced.
export enum VoiceEnum {
	'Not Voiced' = 1,
	'Ero Scenes Voiced',
	'Partially Voiced',
	'Fully Voiced',
}

export enum LanguageEnum {
	'ar' = 'Arabic',
	'eu' = 'Basque',
	'bg' = 'Bulgarian',
	'ca' = 'Catalan',
	'ck' = 'Cherokee',
	'zh' = 'Chinese',
	'zh-Hans' = 'Chinese (simplified)',
	'zh-Hant' = 'Chinese (traditional)',
	'hr' = 'Croatian',
	'cs' = 'Czech',
	'da' = 'Danish',
	'nl' = 'Dutch',
	'en' = 'English',
	'eo' = 'Esperanto',
	'fi' = 'Finnish',
	'fr' = 'French',
	'de' = 'German',
	'el' = 'Greek',
	'he' = 'Hebrew',
	'hu' = 'Hungarian',
	'ga' = 'Irish',
	'id' = 'Indonesian',
	'it' = 'Italian',
	'iu' = 'Inuktitut',
	'ja' = 'Japanese',
	'ko' = 'Korean',
	'la' = 'Latin',
	'lv' = 'Latvian',
	'lt' = 'Lithuanian',
	'mk' = 'Macedonian',
	'ms' = 'Malay',
	'no' = 'Norwegian',
	'fa' = 'Persian',
	'pl' = 'Polish',
	'pt-br' = 'Portuguese (Brazil)',
	'pt-pt' = 'Portuguese (Portugal)',
	'ro' = 'Romanian',
	'ru' = 'Russian',
	'gd' = 'Scottish Gaelic',
	'sr' = 'Serbian',
	'sk' = 'Slovak',
	'sl' = 'Slovene',
	'es' = 'Spanish',
	'sv' = 'Swedish',
	'ta' = 'Tagalog',
	'th' = 'Thai',
	'tr' = 'Turkish',
	'uk' = 'Ukrainian',
	'ur' = 'Urdu',
	'vi' = 'Vietnamese',
}

export enum MediumsEnum {
	'cd' = 'CD',
	'dvd' = 'DVD',
	'gdr' = 'GD-ROM',
	'blr' = 'Blu-ray disc',
	'flp' = 'Floppy',
	'cas' = 'Cassette tape',
	'mrt' = 'Cartridge',
	'mem' = 'Memory card',
	'umd' = 'UMD',
	'nod' = 'Nintendo Optical Disc',
	'in' = 'Internet download',
	'otc' = 'Other',
}

export enum PlatformsEnum {
	'win' = 'Windows',
	'lin' = 'Linux',
	'mac' = 'Mac OS',
	'web' = 'Website',
	'tdo' = '3DO',
	'ios' = 'Apple iProduct',
	'and' = 'Android',
	'bdp' = 'Blu-ray Player',
	'dos' = 'DOS',
	'dvd' = 'DVD Player',
	'drc' = 'Dreamcast',
	'nes' = 'Famicom',
	'sfc' = 'Super Famicom',
	'fm7' = 'FM-7',
	'fm8' = 'FM-8',
	'fmt' = 'FM Towns',
	'gba' = 'Game Boy Advance',
	'gbc' = 'Game Boy Color',
	'msx' = 'MSX',
	'nds' = 'Nintendo DS',
	'swi' = 'Nintendo Switch',
	'wii' = 'Nintendo Wii',
	'wiu' = 'Nintendo Wii U',
	'n3d' = 'Nintendo 3DS',
	'p88' = 'PC-88',
	'p98' = 'PC-98',
	'pce' = 'PC Engine',
	'pcf' = 'PC-FX',
	'psp' = 'PlayStation Portable',
	'ps1' = 'PlayStation 1',
	'ps2' = 'PlayStation 2',
	'ps3' = 'PlayStation 3',
	'ps4' = 'PlayStation 4',
	'ps5' = 'PlayStation 5',
	'psv' = 'PlayStation Vita',
	'smd' = 'Sega Mega Drive',
	'scd' = 'Sega Mega-CD',
	'sat' = 'Sega Saturn',
	'vnd' = 'VNDS',
	'x1s' = 'Sharp X1',
	'x68' = 'Sharp X68000',
	'xb1' = 'Xbox',
	'xb3' = 'Xbox 360',
	'xbo' = 'Xbox One',
	'xxs' = 'Xbox X/S',
	'mob' = 'Other (mobile)',
	'oth' = 'Other',
}

export enum IntensityLevelEnum {
	'Safe' = 0,
	'Suggestive',
	'Explicit',
}

export enum DevStatusEnum {
	'finished' = 0,
	'in_development' = 1,
	'cancelled' = 2,
}

export enum VNLengthEnum {
	'Very Short' = 1,
	'Short',
	'Medium',
	'Long',
	'Very Long',
}

export const ExternalLinks = [
	{
		name: 'novelgam',
		label: 'NovelGame',
		url_format: 'https://novelgame.jp/games/show/%d',
	},
	{
		url_format: 'https://freegame-mugen.jp/%s.html',
		label: 'Freegame Mugen',
		name: 'freegame',
	},
	{ url_format: 'https://gyutto.com/i/item%d', name: 'gyutto', label: 'Gyutto' },
	{
		url_format: 'https://www.animategames.jp/home/detail/%d',
		name: 'animateg',
		label: 'Animate Games',
	},
	{ url_format: 'https://www.patreon.com/%s', name: 'patreon', label: 'Patreon' },
	{
		url_format: 'https://store-jp.nintendo.com/list/software/%d.html',
		label: 'Nintendo (JP)',
		name: 'nintendo_jp',
	},
	{
		name: 'playstation_jp',
		label: 'PlayStation Store (JP)',
		url_format: 'https://store.playstation.com/ja-jp/product/%s',
	},
	{ name: 'fakku', label: 'Fakku', url_format: 'https://www.fakku.net/games/%s' },
	{
		label: 'Patreon post',
		name: 'patreonp',
		url_format: 'https://www.patreon.com/posts/%d',
	},
	{
		name: 'nintendo_hk',
		label: 'Nintendo (HK)',
		url_format: 'https://store.nintendo.com.hk/%d',
	},
	{ url_format: 'https://booth.pm/en/items/%d', label: 'BOOTH', name: 'booth' },
	{
		label: 'PlayStation Store (HK)',
		name: 'playstation_hk',
		url_format: 'https://store.playstation.com/en-hk/product/%s',
	},
	{ label: 'J-List', name: 'jlist', url_format: 'https://www.jlist.com/shop/product/%s' },
	{
		name: 'gamejolt',
		label: 'Game Jolt',
		url_format: 'https://gamejolt.com/games/vn/%d',
	},
	{
		label: 'Getchu',
		name: 'getchu',
		url_format: 'http://www.getchu.com/soft.phtml?id=%d',
	},
	{ url_format: 'https://denpasoft.com/product/%s/', name: 'denpa', label: 'Denpasoft' },
	{
		label: 'ErogameScape',
		name: 'egs',
		url_format: 'https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/game.php?game=%d',
	},
	{
		label: 'PlayStation Store (EU)',
		name: 'playstation_eu',
		url_format: 'https://store.playstation.com/en-gb/product/%s',
	},
	{
		url_format: 'https://www.mangagamer.com/r18/detail.php?product_code=%d',
		label: 'MangaGamer',
		name: 'mg',
	},
	{ label: 'Steam', name: 'steam', url_format: 'https://store.steampowered.com/app/%d/' },
	{ name: 'dmm', label: 'DMM', url_format: 'https://%s' },
	{
		label: 'DLsite',
		name: 'dlsite',
		url_format: 'https://www.dlsite.com/home/work/=/product_id/%s.html',
	},
	{ url_format: 'https://apps.apple.com/app/id%d', label: 'App Store', name: 'appstore' },
	{ url_format: 'https://jastusa.com/games/%s/vndb', name: 'jastusa', label: 'JAST USA' },
	{
		url_format: 'https://ec.toranoana.shop/tora/ec/item/%012d/',
		name: 'toranoana',
		label: 'Toranoana',
	},
	{
		url_format: 'https://store.playstation.com/en-us/product/%s',
		label: 'PlayStation Store (NA)',
		name: 'playstation_na',
	},
	{ url_format: 'https://%s', label: 'Itch.io', name: 'itch' },
	{ name: 'freem', label: 'Freem!', url_format: 'https://www.freem.ne.jp/win/game/%d' },
	{ url_format: 'http://dl.getchu.com/i/item%d', name: 'getchudl', label: 'DL.Getchu' },
	{ url_format: 'https://subscribestar.%s', name: 'substar', label: 'SubscribeStar' },
	{
		name: 'melon',
		label: 'Melonbooks.com',
		url_format:
			'https://www.melonbooks.com/index.php?main_page=product_info&products_id=IT%010d',
	},
	{
		label: 'Melonbooks.co.jp',
		name: 'melonjp',
		url_format: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=%d',
	},
	{
		url_format: 'https://play.google.com/store/apps/details?id=%s',
		name: 'googplay',
		label: 'Google Play',
	},
	{
		url_format: 'https://www.nintendo.com/store/products/%s/',
		name: 'nintendo',
		label: 'Nintendo',
	},
	{ url_format: 'https://www.gog.com/game/%s', name: 'gog', label: 'GOG' },
	{ url_format: 'https://www.nutaku.net/games/%s/', label: 'Nutaku', name: 'nutaku' },
	{
		label: 'Digiket',
		name: 'digiket',
		url_format: 'https://www.digiket.com/work/show/_data/ID=ITM%07d/',
	},
];

export const VNSearchSortOptions: VNSortOptions[] = [
	'id',
	'rating',
	'released',
	'searchrank',
	'title',
	'votecount',
];

export enum VNLablesEnum {
	'Playing' = 1,
	'Finished',
	'Stalled',
	'Dropped',
	'Wishlist',
	'Blacklist',
	'Voted',
}

export enum VNTagCategoryEnum {
	'cont' = 'Content',
	'tech' = 'Technical',
	'ero' = 'Sexual Content',
}

// 0 for “Unknown”, 1 for “Pending”, 2 for “Obtained”, 3 for “On loan”, 4 for “Deleted”
export enum ReleaseStatusEnum {
	'Unknown' = 0,
	'Pending',
	'Obtained',
	'On loan',
	'Deleted',
}
