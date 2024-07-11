import { VNTag } from '@/api/vndb/types';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { TagDialog } from '../dialogs';
import { Tag } from '../tag';

type TagViewProps = {
	tags: VNTag[] | null;
};
export const TagView = ({ tags }: TagViewProps) => {
	const [currentTag, setCurrentTag] = useState<VNTag | null>(tags ? tags[0] : null);
	const [visible, setVisible] = useState(false);
	const openTag = (tag: VNTag) => {
		// if (tag.category === 'ero' && !showNSFW) return;
		setCurrentTag(tag);
		setVisible(true);
	};

	// const { showNSFW } = useAppSelector((state) => state.persistedSettings);

	const closeTag = () => setVisible(false);

	return (
		<View style={{ marginVertical: 15 }}>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{tags?.map(
					(tag, index) => index < 21 && <Tag key={index} tag={tag} openTag={openTag} />,
				)}
			</ScrollView>
			<Portal>
				{tags && <TagDialog visible={visible} onDismiss={closeTag} tag={currentTag} />}
			</Portal>
		</View>
	);
};
