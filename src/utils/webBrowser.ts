import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

type OpenWebBrowserOptions = {
    openInBrowser?: boolean;
    onComplete?: () => void;
};

export const openWebBrowser = async (link: string | null, options?: OpenWebBrowserOptions) => {
    if (!link || !link?.includes('http')) return;

    if (options?.openInBrowser) {
        await Linking.openURL(link);
    } else if (options?.onComplete) {
        const result = await WebBrowser.openAuthSessionAsync(link);
        if (
            result.type === WebBrowser.WebBrowserResultType.DISMISS ||
            result.type === WebBrowser.WebBrowserResultType.CANCEL
        ) {
            options.onComplete();
        }
    } else {
        await WebBrowser.openBrowserAsync(link);
    }
};
