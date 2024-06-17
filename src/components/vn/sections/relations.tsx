import { VNRelationType, VNRelationEnum } from '@/api/vndb/types';
import { VNCard } from '@/components/cards';
import { SectionHeader } from '@/components/text';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

type VNRelationsProps = {
    relations: VNRelationType[];
};
const VNRelations = ({ relations }: VNRelationsProps) => {
    return (
        <View>
            <SectionHeader>Relations</SectionHeader>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relations.map(
                    (relation, idx) =>
                        relation.image?.url &&
                        relation.relation_official && (
                            <View key={idx} style={{ alignItems: 'center' }}>
                                <VNCard
                                    titles={relation.titles}
                                    rating={relation.rating}
                                    coverImg={relation.image}
                                    navigate={() => router.push(`/vn/${relation.id}`)}
                                    platforms={relation.platforms}
                                />
                                <Text>
                                    {
                                        VNRelationEnum[
                                            relation.relation as keyof typeof VNRelationEnum
                                        ]
                                    }
                                </Text>
                            </View>
                        ),
                )}
            </ScrollView>
        </View>
    );
};

export default VNRelations;
