import { VNCharResponse } from '@/api/vndb/types';
import { CharacterCard } from '@/components/cards';
import { SectionHeader } from '@/components/text';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

type VNCharactersProps = {
    data: VNCharResponse['results'];
};
const VNCharacters = ({ data }: VNCharactersProps) => {
    if (!data || data.length === 0) return null;
    return (
        <View>
            <SectionHeader>Characters</SectionHeader>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.map((char, idx) => (
                    <View key={idx}>
                        <CharacterCard
                            data={char}
                            onPress={() => router.push(`character/${char.id}`)}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default VNCharacters;
