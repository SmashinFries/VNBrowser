import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Headline } from 'react-native-paper';
import { ReleaseCoverItem, VNResponse } from '@/api/vndb/types';
import { SectionHeader } from '@/components/text';
import { useState } from 'react';
import { useSettingsStore } from '@/store/store';

const ScreenshotItem = ({
    screenshot,
}: {
    screenshot: VNResponse['results'][0]['screenshots'][0];
}) => {
    const [isBlurred, setIsBlurred] = useState(true);
    const { sexualLevel } = useSettingsStore();
    return (
        <Pressable onLongPress={() => setIsBlurred((prev) => !prev)}>
            <Image
                source={{ uri: screenshot.url }}
                blurRadius={isBlurred && screenshot.sexual > sexualLevel ? 15 : 0}
                style={{
                    height: 200,
                    aspectRatio: screenshot.dims[0] / screenshot.dims[1],
                    marginHorizontal: 10,
                }}
            />
        </Pressable>
    );
};

type VNScreenshotsProps = {
    screenshots: VNResponse['results'][0]['screenshots'] | undefined;
};
export const VNScreenshots = ({ screenshots }: VNScreenshotsProps) => {
    if (!screenshots || screenshots.length === 0) return null;
    return (
        <View style={{ flex: 1, marginVertical: 10 }}>
            <SectionHeader>Screenshots</SectionHeader>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {screenshots?.map((screenshot, idx) => (
                    <ScreenshotItem key={idx} screenshot={screenshot} />
                ))}
            </ScrollView>
        </View>
    );
};

export default VNScreenshots;
