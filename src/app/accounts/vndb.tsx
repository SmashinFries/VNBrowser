import { VNDBAuthSection } from '@/components/accounts/section';
import { useAppTheme } from '@/providers/theme';
import { View } from 'react-native';

const VNDBAccountPage = () => {
    const { colors } = useAppTheme();
    return (
        <View style={{ flex: 1 }}>
            <VNDBAuthSection showTitle={false} />
        </View>
    );
};

export default VNDBAccountPage;
