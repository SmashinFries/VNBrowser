import { View } from 'react-native';
import { DividerVertical } from './divider';
import { Divider, IconButton } from 'react-native-paper';
import { openWebBrowser } from '@/utils/webBrowser';
import { useUserAuthStore } from '@/store/store';

export const UserPageActions = () => {
    const { vndb } = useUserAuthStore();
    return (
        <View style={{ paddingVertical: 10 }}>
            {/* <Divider /> */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                }}
            >
                <IconButton
                    icon="account-outline"
                    onPress={() => openWebBrowser(`https://vndb.org/${vndb.userID}`)}
                />
                <DividerVertical style={{ height: '85%' }} />
                <IconButton
                    icon="forum-outline"
                    onPress={() => openWebBrowser(`https://vndb.org/t`)}
                />
                <DividerVertical style={{ height: '85%' }} />
                <IconButton
                    icon="bell-outline"
                    onPress={() => openWebBrowser(`https://vndb.org/${vndb.userID}/notifies`)}
                />
                <DividerVertical style={{ height: '85%' }} />
                <IconButton
                    icon="cog-outline"
                    onPress={() => openWebBrowser(`https://vndb.org/${vndb.userID}/edit`)}
                />
            </View>
            <Divider style={{ marginHorizontal: 15 }} />
        </View>
    );
};
