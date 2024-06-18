import enTitles from './en/titles.json';
import esTitles from './es/titles.json';
import jaTitles from './ja/titles.json';

export const LANGUAGES = {
	en: 'English',
	// es: 'Español',
	// ja: '日本語',
};

export default {
	en: {
		titles: enTitles,
	},
	es: {
		tabs: esTitles,
	},
	ja: {
		tabs: jaTitles,
	},
};
