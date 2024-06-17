import { LanguageEnum, MediumsEnum, PlatformsEnum } from './schema';

export type VNSortOptions = 'id' | 'title' | 'released' | 'rating' | 'votecount' | 'searchrank';
export type VNDBStats = {
	chars: number;
	vn: number;
	staff: number;
	producers: number;
	releases: number;
	tags: number;
	traits: number;
};
export type VNCharFilterNames =
	| 'id'
	| 'search'
	| 'role'
	| 'blood_type'
	| 'sex'
	| 'height'
	| 'weight'
	| 'bust'
	| 'waist'
	| 'hips'
	| 'cup'
	| 'age'
	| 'trait'
	| 'dtrait'
	| 'birthday'
	| 'seiyuu'
	| 'vn';
export type VNFilterNames =
	| 'id'
	| 'search'
	| 'lang'
	| 'platform'
	| 'length'
	| 'released'
	| 'rating'
	| 'votecount'
	| 'has_description'
	| 'has_anime'
	| 'has_screenshot'
	| 'has_review'
	| 'devstatus'
	| 'tag'
	| 'dtag'
	| 'anime_id'
	| 'label'
	| 'release'
	| 'character'
	| 'staff'
	| 'developer';
export type IntensityLevel = 0 | 1 | 2;
export type DevStatusLevel = 0 | 1 | 2; // 0 meaning ‘Finished’, 1 is ‘In development’ and 2 for ‘Cancelled’
export type VNLength = 1 | 2 | 3 | 4 | 5; // rough length estimate of the VN between 1 (very short) and 5 (very long)
export type VNRating =
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18
	| 19
	| 20
	| 21
	| 22
	| 23
	| 24
	| 25
	| 26
	| 27
	| 28
	| 29
	| 30
	| 31
	| 32
	| 33
	| 34
	| 35
	| 36
	| 37
	| 38
	| 39
	| 40
	| 41
	| 42
	| 43
	| 44
	| 45
	| 46
	| 47
	| 48
	| 49
	| 50
	| 51
	| 52
	| 53
	| 54
	| 55
	| 56
	| 57
	| 58
	| 59
	| 60
	| 61
	| 62
	| 63
	| 64
	| 65
	| 66
	| 67
	| 68
	| 69
	| 70
	| 71
	| 72
	| 73
	| 74
	| 75
	| 76
	| 77
	| 78
	| 79
	| 80
	| 81
	| 82
	| 83
	| 84
	| 85
	| 86
	| 87
	| 88
	| 89
	| 90
	| 91
	| 92
	| 93
	| 94
	| 95
	| 96
	| 97
	| 98
	| 99
	| 100;

export enum VNRelationEnum {
	'seq' = 'Sequel',
	'preq' = 'Prequel',
	'set' = 'Setting',
	'fan' = 'Fandisc',
	'ser' = 'Same series',
}

export type VMFields =
	| 'id'
	| 'title'
	| 'alttitle'
	| 'titles'
	| 'titles.lang'
	| 'titles.title'
	| 'titles.latin'
	| 'titles.official'
	| 'titles.main'
	| 'aliases'
	| 'olang'
	| 'devstatus'
	| 'released'
	| 'languages'
	| 'platforms'
	| 'image'
	| 'image.id'
	| 'image.url'
	| 'image.dims'
	| 'image.sexual'
	| 'image.violence'
	| 'image.votecount'
	| 'length'
	| 'length_minutes'
	| 'length_votes'
	| 'description'
	| 'rating'
	| 'votecount'
	| 'screenshots'
	| 'screenshots.thumbnail'
	| 'screenshots.thumbnail_dims'
	| 'relations'
	| 'relations.relation'
	| 'relations.relation_official'
	| 'tags'
	| 'tags.rating'
	| 'tags.spoiler'
	| 'tags.lie'
	| 'developers';
export type VNParams = {
	// idk what im doing. help
	// filters?: [VNFilterNames, string, string | number | any[]];
	filters?: any[];
	fields: string;
	sort: VNSortOptions;
	reverse: boolean;
	results: number;
	page?: number;
	user?: string | null;
	count?: boolean;
	compact_filters?: boolean;
	normalized_filters?: boolean;
};

export type VNCharParams = {
	filters?: [VNCharFilterNames, string, string | number | any[]];
	fields: string;
	sort?: 'id' | 'name' | 'searchrank';
	page?: number;
	results?: number;
	reverse?: boolean;
};

// naming is kinda bad - releases vs release
export type VNReleasesParams = {
	filters: any;
	fields: string;
	sort: 'searchrank' | 'id' | 'title' | 'released';
	reverse?: boolean;
	results?: number;
	page?: number;
};

export type VNReleaseParams = {
	filters: ['id', '=', string];
	fields: string;
	results?: number;
};

export type Screenshot = {
	url: string;
	thumbnail_dims: [number, number];
	thumbnail: string;
	dims: [number, number];
	sexual: IntensityLevel;
	violence: IntensityLevel;
};

export type VNTitles = {
	lang: string;
	official: true;
	latin: string;
	title: string;
	main: boolean;
};

export type VNImage = {
	sexual: IntensityLevel;
	violence: IntensityLevel;
	url: string;
	dims: [number, number]; // width, height
};

// tags.rating, tags.spoiler, tags.lie, tags.id, tags.name, tags.aliases, tags.description, tags.category,
export type VNTag = {
	id: string;
	name: string;
	aliases: string[];
	description: string;
	rating: number; // ranging from 1 - 3
	spoiler: 0 | 1 | 2; // spoiler level
	lie: boolean;
	category: 'cont' | 'tech' | 'ero';
};

export type VNTrait = {
	id: string;
	name: string;
	aliases: string[];
	description: string;
	group_id: string;
	group_name: string;
	char_count: number;
	spoiler: 0 | 1 | 2;
	lie: boolean;
};

export type VNRelationType = {
	relation: string; // relation type
	relation_official: boolean;
	id: string;
	title: string;
	titles: VNTitles[];
	rating: VNRating | null;
	image: VNImage;
	platforms: (keyof typeof PlatformsEnum)[];
};

// developers.id, developers.name, developers.original, developers.aliases, developers.lang, developers.type, developers.description
export type VNDeveloper = {
	id: string;
	name: string;
	original: string;
	aliases: string[];
	lang: string;
	type: 'co' | 'in' | 'ng'; // "co" for company, "in" for individual and "ng" for amateur group
	description: string;
};

export type VNListResponse = {
	results: [
		{
			id: string;
			title: string;
			alttitle: string | null;
			titles: VNTitles[];
			platforms: (keyof typeof PlatformsEnum)[];
			olang: string;
			votecount: number;
			released: string;
			image: VNImage;
			screenshots: Screenshot[];
			rating: VNRating | null;
			devstatus: DevStatusLevel;
		},
	];
	more: true;
};

export type VNResponse = {
	results: {
		id: string;
		title: string;
		alttitle: string | null;
		titles: VNTitles[];
		aliases: string[];
		olang: keyof typeof LanguageEnum;
		devstatus: DevStatusLevel;
		released: string | null;
		languages: string[];
		platforms: (keyof typeof PlatformsEnum)[] | null;
		image: VNImage;
		length: VNLength; // rough estimate (use as a fallback!)
		length_minutes: number | null; // average of user-submitted play times in minutes
		length_votes: number; // number of submitted play times.
		description: string | null;
		rating: VNRating | null;
		votecount: number;
		screenshots: Screenshot[];
		relations: VNRelationType[];
		tags: VNTag[];
		developers: VNDeveloper[];
		extlinks: VNReleaseExtLink[];
	}[];
};

export type VNCharDetail = {
	id: string;
	name: string;
	original: string;
	aliases: string[];
	description: string;
	image: VNImage;
	blood_type: string | null;
	height: number | null;
	weight: number | null;
	bust: number | null;
	waist: number | null;
	hips: number | null;
	cup: string | null;
	age: number | null;
	birthday: [number, number] | null; // [month, day]
	sex: [string, string] | null; // [apparent, real] - Possible values are null, "m", "f" or "b" (meaning “both”)
	traits: {
		id: string;
		name: string;
		aliases: string[];
		description: string;
		group_id: string;
		group_name: string;
		char_count: number;
		spoiler: 0 | 1 | 2;
		lie: boolean;
	}[];
	vns: (VNListResponse['results'][0] & {
		role: string; // "main" for protagonist, "primary" for main characters, "side" or "appears"
		spoiler: 0 | 1 | 2;
	})[];
};

export type VNCharDetailResponse = {
	results: VNCharDetail[];
	more: boolean;
};

// 'id, name, original, image.url, image.dims, birthday'
export type VNCharResponse = {
	results: {
		id: string;
		name: string;
		original: string;
		image: VNImage;
		birthday: [number, number] | null; // [month, day]
	}[];
	more: boolean;
};

export type VNReleaseLanguage = {
	lang: keyof typeof LanguageEnum;
	title: string;
	latin: string;
	mtl: boolean;
	main: boolean;
};

export type VNReleaseMedia = {
	qty: number;
	medium: keyof typeof MediumsEnum;
};

export type VNReleaseVNS = {
	id: string;
	rtype: string;
	olang: keyof typeof LanguageEnum;
	image?: {
		url: string | null;
		sexual: IntensityLevel;
	};
};

export type VNReleaseExtLink = {
	url: string;
	label: string;
	name: string;
	id: string;
};

export type CharacterRole = 'main' | 'primary' | 'side' | 'appears';

export type ReleaseProducer = {
	developer: boolean;
	publisher: boolean;
	id: string;
	name: string;
};

export type VNReleasesResponse = {
	results: {
		id: string;
		title: string;
		alttitle: string | null;
		languages: VNReleaseLanguage[];
		platforms: (keyof typeof PlatformsEnum)[] | null;
		media: VNReleaseMedia[];
		vns: VNReleaseVNS[];
		released: string;
		minage: number;
		patch: boolean;
		freeware: boolean;
		uncensored: boolean;
		official: boolean;
		has_ero: boolean;
		resolution: [number, number] | null;
		engine: string;
		catalog: string | null;
		extlinks: VNReleaseExtLink[];
		voiced: boolean;
		notes: string | null;
		gtin: string | null;
		producers?: ReleaseProducer[];
	}[];
	more: boolean;
};

export type VNFilterCharState = {
	// so many options,
	search?: string;
	role?: CharacterRole;
	blood_type?: string;
	sex?: string;
	height?: number; // cm
	height_greater?: number; // cm
	height_lesser?: number; // cm
	weight?: number; // kg
	weight_greater?: number; // kg
	weight_lesser?: number; // kg
	bust?: number; // cm
	bust_greater?: number; // cm
	bust_lesser?: number; // cm
	waist?: number; // cm
	waist_greater?: number; // cm
	waist_lesser?: number; // cm
	hips?: number; // cm
	hips_greater?: number; // cm
	hips_lesser?: number; // cm
	cup?: string; // AAA, AA, A - Z
	cup_greater?: string;
	cup_lesser?: string;
	age?: number;
	age_greater?: number;
	age_lesser?: number;
	trait_in?: number[]; // [id, spoiler level]
	trait_not_in?: number[]; // [id, spoiler level]
	birthday?: [number, number]; // [month (>0), day (can be 0)]
};

export type VNFilterState = {
	search?: string;
	lang?: string;
	olang?: string;
	platform?: string;
	length?: VNLength;
	length_greater?: VNLength; // very short - very long
	length_lesser?: VNLength; // very short - very long
	released?: Date; // Date -> yyyy-mm-dd
	released_greater?: Date; // Date -> yyyy-mm-dd
	released_lesser?: Date; // Date -> yyyy-mm-dd
	rating_greater?: VNRating;
	rating_lesser?: VNRating;
	votecount_greater?: number;
	votecount_lesser?: number;
	has_description?: boolean;
	has_anime?: boolean;
	has_screenshot?: boolean;
	has_review?: boolean;
	devstatus?: DevStatusLevel;
	tag_in?: number[]; // tag id
	tag_not_in?: number[]; // tag id
	// release filter options
	has_ero?: boolean;
	uncensored?: boolean;
	minage_greater?: number; // 0-18
	minage_lesser?: number; // 0-18
	voiced?: 1 | 2 | 3 | 4; // 1 = not voiced, 2 = only ero scenes voiced, 3 = partially voiced, 4 = fully voiced.
	extlink?: string;
	// character filter options
	characters?: VNFilterCharState[];
};

export type TagTraitType = {
	aliases: string[];
	applicable: boolean;
	cat: string;
	description: string;
	id: number;
	meta: boolean;
	name: string;
	parents: number[];
	searchable: boolean;
	vns: number;
}[];

export type VNQuotes = {
	votes: number;
	quote: string;
	character: {
		id: string;
		name: string;
	} | null;
};

export type UserAuthResponse = {
	id: string;
	username: string;
	permissions: ('listread' | 'listwrite')[];
};

// {
//     "label": "Playing",
//     "private": false,
//     "id": 1
// },
// {
//     "label": "Finished",
//     "private": false,
//     "id": 2
// },
// {
//     "label": "Stalled",
//     "id": 3,
//     "private": false
// },
// {
//     "label": "Dropped",
//     "id": 4,
//     "private": false
// },
// {
//     "id": 5,
//     "private": false,
//     "label": "Wishlist"
// },
// {
//     "private": false,
//     "id": 6,
//     "label": "Blacklist"
// },
// {
//     "private": false,
//     "id": 7,
//     "label": "Voted"
// }

export type MainLables = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type UListLables =
	| 'Playing'
	| 'Finished'
	| 'Stalled'
	| 'Dropped'
	| 'Wishlist'
	| 'Blacklist'
	| 'Voted';
export type UlistLablesResponse = {
	labels: {
		id: MainLables | number;
		label: UListLables;
		count: number;
		private: boolean;
	}[];
};

export type VNUserListResponse = {
	more: boolean;
	count: number;
	results: [
		{
			added: Date | null;
			started: Date | null;
			finished: Date | null;
			vote: VNRating | null;
			voted: Date | null;
			notes: string | null;
			vn: {
				id: string;
				alttitle: string;
				devstatus: DevStatusLevel;
				platforms: (keyof typeof PlatformsEnum)[];
				image: VNImage;
				rating: VNRating | null;
				title: string;
				olang: string;
				titles: VNTitles[];
				votecount: number;
			};
			labels: {
				label: UListLables;
				id: UlistLablesResponse['labels'][0]['id'];
			}[];
			releases: {
				id: string;
				list_status: UlistLablesResponse['labels'][0]['id'];
				title: string;
			}[];
			id: string;
		},
	];
};

export type UserDetails = {
	registered: string | null;
	edits: string | null;
	votes: string | null;
	play_times: string | null;
	list_stats: string | null;
	reviews: string | null;
	tags: string | null;
	images: string | null;
	forum_stats: string | null;
	hair:
		| {
				id: string;
				name: string;
		  }[]
		| null;
	personality:
		| {
				id: string;
				name: string;
		  }[]
		| null;
	role:
		| {
				id: string;
				name: string;
		  }[]
		| null;
	engages_in:
		| {
				id: string;
				name: string;
		  }[]
		| null;
	subject_of:
		| {
				id: string;
				name: string;
		  }[]
		| null;
	engages_in_s:
		| {
				id: string;
				name: string;
		  }[]
		| null;
};

export type VNUlistPatchParams = {
	id: string; // VN id
	vote?: VNRating | null; // Integer between 10 and 100 - same as VNRating
	notes?: string | null;
	started?: number | null;
	finished?: number | null;
	labels?: number[] | null; // Array of integers, label ids. Setting this will overwrite any existing labels assigned to the VN with the given array.
	labels_set?: UlistLablesResponse['labels'][0]['id'][] | null; // Array of label ids to add to the VN, any already existing labels will be unaffected.
	labels_unset?: UlistLablesResponse['labels'][0]['id'][] | null; // Array of label ids to remove from the VN.
};

export type ReleaseListStatus = 0 | 1 | 2 | 3 | 4; // Integer, 0 for “Unknown”, 1 for “Pending”, 2 for “Obtained”, 3 for “On loan”, 4 for “Deleted”.

export type SiteItem = { url: string; name: string };
export type ShopItem = SiteItem & { amount: string };
export type ReleaseCoverItem = {
	image: VNImage;
	release: {
		releaseDate: string | undefined;
		platform: string | undefined;
		olang: keyof typeof LanguageEnum | undefined;
		titles: {
			alttitle: string | undefined;
			title: string | undefined;
			altlang: string | undefined;
		};
		id: string | undefined;
	};
	label: string | undefined;
};
