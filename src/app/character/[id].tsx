import { useVNCharDetails } from '@/api/vndb/queries/hooks';
import { ListHeading, SectionHeader } from '@/components/text';
import { copyToClipboard, highlightUrls } from '@/utils/text';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Checkbox,
    Chip,
    Icon,
    List,
    RadioButton,
    SegmentedButtons,
    Text,
} from 'react-native-paper';
import _ from 'lodash';
import { useSettingsStore } from '@/store/store';
import { Accordion } from '@/components/accordion';
import { ExpandableDescription } from '@/components/description';
import { useAppTheme } from '@/providers/theme';
import { getBirthday } from '@/utils/time';
import { VNCard } from '@/components/cards';
import { MediaBanner } from '@/components/background';
import { FadeHeader } from '@/components/headers';

const CharacterPage = () => {
    const { allowEro } = useSettingsStore();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, isLoading } = useVNCharDetails(id);
    const [selectedName, setSelectedName] = useState<'name' | 'original'>('name');
    const [showSpoilers, setShowSpoilers] = useState<'0' | '1' | '2'>('0');

    const img = useMemo(() => data?.results[0].image, [data?.results[0].image]);
    const trait_groups = useMemo(
        () => _.uniq(data?.results[0].traits.map((trait) => trait.group_name)),
        [data?.results[0].traits],
    );
    const banner_images = useMemo(
        () =>
            data?.results && data?.results[0].vns.length > 1
                ? data?.results[0].vns.map((vn) => vn.image)
                : data?.results[0].vns.length === 0
                  ? data?.results[0].vns[0].screenshots
                  : null,
        [data?.results[0].vns],
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return (
        <View>
            <FadeHeader
                title={data?.results[0].name ?? ''}
                shareLink={`https://www.vndb.org/${id}`}
                BgImage={(style) => (
                    <MediaBanner images={banner_images ?? []} allowMotion style={style?.style} />
                )}
                animationRange={[250, 310]}
            >
                {/* <MediaBanner urls={screenshots ?? []} allowMotion /> */}
                <Image
                    source={{ uri: data?.results[0].image.url }}
                    style={{
                        width: '100%',
                        height: 250,
                        aspectRatio: (img?.dims[0] ?? 1) / (img?.dims[1] ?? 3),
                        alignSelf: 'center',
                        borderRadius: 8,
                    }}
                    contentFit="contain"
                />
                <Text variant="titleLarge" style={{ textAlign: 'center', paddingVertical: 15 }}>
                    {data?.results[0][selectedName]}{' '}
                    {data?.results[0].sex && (
                        <Icon
                            source={
                                data?.results[0].sex[0] === 'f' ? 'gender-female' : 'gender-male'
                            }
                            size={24}
                        />
                    )}
                </Text>
                {/* <Text>{data?.results[0].birthday}</Text> */}
                <SegmentedButtons
                    value={selectedName}
                    onValueChange={(val) => setSelectedName(val as 'name' | 'original')}
                    density="high"
                    buttons={[
                        { label: 'Name', value: 'name' },
                        { label: 'Native', value: 'original' },
                    ]}
                    style={{ marginHorizontal: 15 }}
                />
                {data?.results[0].aliases && (
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ paddingVertical: 15, paddingHorizontal: 5 }}
                    >
                        {data?.results[0].aliases.map((alias, idx) => (
                            <Chip
                                key={idx}
                                style={{ margin: 5 }}
                                onPress={() => copyToClipboard(alias)}
                            >
                                {alias}
                            </Chip>
                        ))}
                    </ScrollView>
                )}
                {data?.results[0].description && (
                    <ExpandableDescription
                        initialHeight={100}
                        text={data?.results[0].description}
                    />
                )}

                <Accordion title="Details" initialExpand>
                    <List.Item
                        title={'Birthday'}
                        right={() => <Text>{getBirthday(data?.results[0].birthday)}</Text>}
                        left={(props) => <List.Icon {...props} icon={'cake-variant-outline'} />}
                    />
                    <List.Item
                        title={'Height'}
                        right={() => <Text>{data?.results[0].height ?? 'N/A'} cm</Text>}
                        left={(props) => <List.Icon {...props} icon={'human-male-height'} />}
                    />
                    <List.Item
                        title={'Weight'}
                        right={() => <Text>{data?.results[0].weight ?? 'N/A'} kg</Text>}
                        left={(props) => <List.Icon {...props} icon={'weight-kilogram'} />}
                    />
                    <List.Item
                        title={'Bust-Waist-Hips'}
                        right={() => (
                            <Text>
                                {data?.results[0].bust ?? 'x'}-{data?.results[0].waist ?? 'x'}-
                                {data?.results[0].bust ?? 'x'}
                            </Text>
                        )}
                        left={(props) => <List.Icon {...props} icon={'human'} />}
                    />
                    <List.Item
                        title={'Cup Size'}
                        right={() => <Text>{data?.results[0].cup ?? 'N/A'}</Text>}
                        left={(props) => <List.Icon {...props} icon={'cupcake'} />}
                    />
                </Accordion>

                <Accordion title="Traits">
                    {/* No way to filter NSFW traits unless scraped from site :o */}
                    <SegmentedButtons
                        value={showSpoilers}
                        density="high"
                        onValueChange={(val) => setShowSpoilers(val as '0' | '1' | '2')}
                        buttons={[
                            { label: 'No Spoilers', value: '0' },
                            { label: 'Minor', value: '1' },
                            { label: 'Major', value: '2' },
                        ]}
                        style={{ marginHorizontal: 15 }}
                    />
                    {trait_groups?.map((group, idx) => (
                        <View key={idx}>
                            <ListHeading title={group} />
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {data?.results[0].traits
                                    .filter((trait) => trait.group_name === group)
                                    .map((trait, idx) => (
                                        <Chip
                                            key={idx}
                                            style={{
                                                margin: 5,
                                                display:
                                                    trait.spoiler <= parseInt(showSpoilers)
                                                        ? undefined
                                                        : 'none',
                                            }}
                                            icon={(props) =>
                                                trait.spoiler > 0 && (
                                                    <Icon
                                                        {...props}
                                                        source={'alert-outline'}
                                                        color={
                                                            trait.spoiler === 2
                                                                ? 'red'
                                                                : props.color
                                                        }
                                                    />
                                                )
                                            }
                                        >
                                            {trait.name}
                                        </Chip>
                                    ))}
                            </View>
                        </View>
                    ))}
                </Accordion>
                <SectionHeader>Visual Novels</SectionHeader>
                <ScrollView
                    horizontal
                    contentContainerStyle={{ paddingVertical: 10 }}
                    showsHorizontalScrollIndicator={false}
                >
                    {data?.results[0].vns.map((vn, idx) => (
                        <View key={idx} style={{ alignItems: 'center' }}>
                            <VNCard titles={vn.titles} rating={vn.rating} coverImg={vn.image} />
                            <Text style={{ textTransform: 'capitalize' }}>{vn.role}</Text>
                        </View>
                    ))}
                </ScrollView>
            </FadeHeader>
        </View>
    );
};

export default CharacterPage;
