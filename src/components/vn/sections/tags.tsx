import { TagTraitType, VNResponse, VNTag, VNTrait } from '@/api/vndb/types';
import { TagDescDialog } from '@/components/dialogs';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';

type TagsListProps = {
	data: VNTag[] | VNTrait[] | undefined;
};
export const TagsList = ({ data }: TagsListProps) => {
	const [vis, setVis] = useState(false);
	const [currentTag, setCurrentTag] = useState<VNTag | VNTrait | null>(data ? data[0] : null);

	const isTrait = useMemo(() => ((data && (data[0] as VNTag))?.category ? false : true), [data]);
	const tags = useMemo(
		() =>
			!isTrait
				? (data as VNTag[])
						?.filter(
							(tag) => tag.category !== 'ero' && tag.rating >= 1 && tag.spoiler < 1,
						)
						.sort((a, b) => b.rating - a.rating)
				: data,
		[isTrait, data],
	);

	const openTag = (tag: VNTag | VNTrait) => {
		setCurrentTag(tag);
		setVis(true);
	};

	return (
		<>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ padding: 10 }}
			>
				{tags?.map((tg, idx) => (
					<Chip key={idx} style={{ margin: 5 }} onPress={() => openTag(tg)}>
						{tg.name} | {(tg as VNTag)?.rating?.toFixed(1)}
					</Chip>
				))}
			</ScrollView>
			<TagDescDialog tag={currentTag} visible={vis} onDismiss={() => setVis(false)} />
		</>
	);
};
