import { VNTag } from '@/api/vndb/types';
import { useState } from 'react';
import { Chip, MD3LightTheme } from 'react-native-paper';

type TagProps = {
    tag: VNTag;
    openTag: (tag: VNTag) => void;
    allowAdult?: boolean;
};
export const Tag = ({ tag, openTag, allowAdult = false }: TagProps) => {
    const isSpoiler = tag?.spoiler > 0;
    const [reveal, setReveal] = useState(isSpoiler ? false : true);

    const handleTagPress = () => {
        if (isSpoiler) {
            if (reveal) {
                openTag(tag);
            } else {
                setReveal(true);
            }
        } else {
            openTag(tag);
        }
    };

    if (!tag) return null;

    return (
        <Chip
            onPress={handleTagPress}
            style={[
                {
                    paddingHorizontal: 5,
                    marginHorizontal: 8,
                },
                tag.category === 'ero' && { backgroundColor: '#FF69B4' },
            ]}
            icon={isSpoiler ? 'chili-alert-outline' : undefined}
            textStyle={tag.category === 'ero' && { color: MD3LightTheme.colors.onBackground }}
        >
            {tag.category === 'ero' && !allowAdult
                ? '✝'
                : !reveal
                  ? 'Spoiler'
                  : `${tag.name} | ${((tag.rating / 3) * 100).toFixed(0)} %`}
        </Chip>
    );
};
