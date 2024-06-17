import { fetchVNAuthInfo } from '@/api/vndb/auth';
import { useUserAuthStore } from '@/store/store';
import { sendToast } from '@/utils/toast';
import { openWebBrowser } from '@/utils/webBrowser';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';

export const useUserAuth = () => {
    const { vndb, loginVNDB, logoutVNDB } = useUserAuthStore();
    const [loading, setLoading] = useState(false);

    const openTokenPage = (setToken: (txt: string) => void) => {
        openWebBrowser('https://vndb.org/u/tokens', {
            onComplete: async () => {
                // Doesn't always work :\
                const copiedText = await Clipboard.getStringAsync();
                if (copiedText.includes('-')) {
                    setToken(copiedText);
                }
            },
        });
    };

    const submitVNDBToken = async (new_token?: string) => {
        if (!vndb.token && !new_token) return;
        setLoading(true);
        const user = await fetchVNAuthInfo(vndb.token ?? new_token);
        if (user && (vndb.token || new_token)) {
            loginVNDB({
                userID: user.id,
                username: user.username,
                // @ts-ignore
                token: vndb.token ?? new_token,
                permissions: user.permissions,
            });
        } else {
            sendToast('Could not fetch user info!');
        }
        setLoading(false);
    };

    return { vndb, loading, submitVNDBToken, openTokenPage, logoutVNDB };
};
