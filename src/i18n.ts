import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import resources from '../locales';

const deviceLanguage = getLocales()[0].languageCode;
const STORE_LANGUAGE_KEY = 'appLanguage';

const languageDetectorPlugin = {
    type: 'languageDetector',
    async: true,
    init: () => null,
    detect: async (callback: (lang: string) => void) => {
        try {
            await AsyncStorage.getItem(STORE_LANGUAGE_KEY).then((language) => {
                if (language) {
                    return callback(language);
                } else {
                    return callback(deviceLanguage ?? 'en');
                }
            });
        } catch (error) {
            console.log('Error reading language', error);
        }
    },
    cacheUserLanguage: async (language: string) => {
        try {
            //save a user's language choice in Async storage
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18n.use(languageDetectorPlugin)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        returnEmptyString: false,
    });

export default i18n;
