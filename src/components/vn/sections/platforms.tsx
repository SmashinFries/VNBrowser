import { PlatformsEnum } from '@/api/vndb/schema';
import { VNResponse } from '@/api/vndb/types';
import { PlatformChip } from '@/components/chips';
import { PlatformSVG } from '@/components/icons';
import { SectionHeader } from '@/components/text';
import { ScrollView, View } from 'react-native';
import { Chip } from 'react-native-paper';

type VNPlatformsProps = {
	platforms: VNResponse['results'][0]['platforms'] | undefined;
};
const VNPlatforms = ({ platforms }: VNPlatformsProps) => {
	if (!platforms || platforms.length === 0) return null;
	return (
		<View>
			<SectionHeader>Platforms</SectionHeader>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 10 }}
			>
				{platforms.map((platform, idx) => (
					<PlatformChip key={idx} platform={platform} />
				))}
			</ScrollView>
		</View>
	);
};

export default VNPlatforms;
