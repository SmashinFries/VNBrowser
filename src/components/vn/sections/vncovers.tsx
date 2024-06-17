import { PlatformsEnum } from '@/api/vndb/schema';
import { ReleaseCoverItem } from '@/api/vndb/types';
import { LanguageIcon, PlatformSVG } from '@/components/icons';
import { SectionHeader } from '@/components/text';
import { useSettingsStore } from '@/store/store';
import { Image } from 'expo-image';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

type VNReleaseCoversProps = {
    covers: ReleaseCoverItem[] | undefined;
};
const VNReleaseCovers = ({ covers }: VNReleaseCoversProps) => {
    const { sexualLevel } = useSettingsStore();
    if (!covers || covers.length === 0) return null;
    return (
        <View style={{ flex: 1, marginVertical: 10 }}>
            <SectionHeader>Covers</SectionHeader>
            {covers && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {covers?.map((cover, idx) => (
                        <View key={idx} style={{ alignItems: 'center', paddingHorizontal: 5 }}>
                            <Image
                                source={{ uri: cover.image.url }}
                                style={{
                                    height: 200,
                                    aspectRatio:
                                        cover.image.dims[0] && cover.image.dims[1]
                                            ? cover.image.dims[0] / cover.image.dims[1]
                                            : undefined,
                                    marginHorizontal: 10,
                                }}
                                blurRadius={cover.image.sexual > sexualLevel ? 15 : 0}
                            />
                            <Text>{cover.label}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <PlatformSVG
                                    name={cover.release.platform as keyof typeof PlatformsEnum}
                                    height={14}
                                    width={14}
                                />
                                <View style={{ width: 5 }} />
                                <LanguageIcon
                                    name={cover.release.olang}
                                    size={14}
                                    // style={{ height: 14, width: 14, paddingLeft: 5 }}
                                    style={{ paddingLeft: 5 }}
                                />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default VNReleaseCovers;
