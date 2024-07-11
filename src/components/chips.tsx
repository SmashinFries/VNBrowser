import { Chip } from 'react-native-paper';
import { PlatformSVG } from './icons';
import { PlatformsEnum } from '@/api/vndb/schema';

export const PlatformChip = ({ platform }: { platform: keyof typeof PlatformsEnum }) => {
	return (
		<Chip
			icon={() => <PlatformSVG name={platform} height={14} width={14} />}
			style={{ marginHorizontal: 5 }}
			mode={'outlined'}
		>
			{PlatformsEnum[platform as keyof typeof PlatformsEnum] ?? platform}
		</Chip>
	);
};
