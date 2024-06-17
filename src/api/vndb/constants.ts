export const EXPLORE_VN_FIELDS =
	'title, alttitle, titles.lang, titles.title, titles.latin, titles.official, titles.main, olang, devstatus, image.url, image.dims, image.sexual, image.violence, platforms, rating, votecount, released, screenshots.thumbnail';

export const VN_DETAIL_FIELDS =
	'id, title, alttitle, titles.lang, titles.title, titles.latin, titles.official, titles.main, aliases, olang, devstatus, released, languages, platforms, image.id, image.url, image.sexual, image.violence, image.votecount, length, length_minutes, length_votes, description, rating, votecount, screenshots.id, screenshots.url, screenshots.dims, screenshots.sexual, screenshots.violence, screenshots.thumbnail, screenshots.thumbnail_dims, relations.relation, relations.relation_official, relations.id, relations.title, relations.titles.lang, relations.titles.title, relations.titles.official, relations.titles.main, relations.rating, relations.image.id, relations.image.url, relations.image.sexual, relations.image.violence, relations.image.votecount, relations.platforms, tags.rating, tags.spoiler, tags.lie, tags.id, tags.name, tags.aliases, tags.description, tags.category, developers.id, developers.name, developers.original, developers.aliases, developers.lang, developers.type, developers.description, extlinks.url, extlinks.label, extlinks.name, extlinks.id';

export const VN_USER_LIST_FIELDS =
	'id, vote, started, finished, notes, voted, added, vn.id, vn.title, vn.alttitle, vn.titles.lang, vn.titles.title, vn.olang, vn.devstatus, vn.image.url, vn.image.dims, vn.image.sexual, vn.image.violence, vn.platforms, vn.rating, vn.votecount, labels.id, labels.label, releases.list_status, releases.title, releases.id, vn.extlinks.url, vn.extlinks.label, vn.extlinks.name, vn.extlinks.id';

export const VN_CHAR_FIELDS =
	'id, name, original, aliases, description, image.sexual, image.violence, image.url, image.dims, blood_type, height, weight, bust, waist, hips, cup, age, birthday, sex, traits.id, traits.name, traits.aliases, traits.description, traits.group_id, traits.group_name, traits.char_count, traits.spoiler, traits.lie, vns.title, vns.alttitle, vns.titles.lang, vns.titles.title, vns.titles.latin, vns.titles.official, vns.titles.main, vns.olang, vns.devstatus, vns.image.url, vns.image.dims, vns.image.sexual, vns.image.violence, vns.platforms, vns.rating, vns.votecount, vns.released, vns.screenshots.thumbnail, vns.role, vns.spoiler';

export const VN_RELEASES_FIELDS =
	'id, title, alttitle, languages.lang, languages.title, languages.latin, languages.mtl, languages.main, platforms, media.medium, media.qty, vns.rtype, vns.olang, released, minage, patch, freeware, uncensored, official, has_ero, resolution, engine, catalog, extlinks.url, extlinks.label, extlinks.name, extlinks.id, voiced, notes, gtin';

export const VN_RELEASE_FIELDS =
	'id, title, alttitle, languages.lang, languages.title, languages.latin, languages.mtl, languages.main, platforms, media.medium, media.qty, vns.rtype, vns.image.url, vns.image.sexual, vns.olang, producers.developer, producers.publisher, producers.id, producers.name, released, minage, patch, freeware, uncensored, official, has_ero, resolution, engine, catalog, extlinks.url, extlinks.label, extlinks.name, extlinks.id, voiced, notes, gtin';
