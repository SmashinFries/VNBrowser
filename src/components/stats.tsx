import { VNDBStats } from '@/api/vndb/types';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Divider, Surface, Text, useTheme } from 'react-native-paper';

const StatItem = ({ title, content }: { title: string; content: number | undefined }) => {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text variant="titleMedium" style={{ color: colors.primary }}>
                {title}
            </Text>
            <Text variant="labelMedium" style={{ fontWeight: '900' }}>
                {content?.toLocaleString() ?? 'N/A'}
            </Text>
        </View>
    );
};

const VerticalDivider = () => {
    return <Divider style={{ height: '100%', width: StyleSheet.hairlineWidth }} />;
};

type SiteStatsProps = {
    data: VNDBStats | undefined;
    isLoading: boolean;
};
const SiteStats = ({ data, isLoading }: SiteStatsProps) => {
    const { colors } = useTheme();
    return (
        <Card mode="elevated" style={{ padding: 5, margin: 10 }}>
            <Card.Content>
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <StatItem title="VN" content={data?.vn} />
                            <VerticalDivider />
                            <StatItem title="Releases" content={data?.releases} />
                        </View>
                        <Divider style={{ marginVertical: 5 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <StatItem title="Characters" content={data?.chars} />
                            <VerticalDivider />
                            <StatItem title="Producers" content={data?.producers} />
                            <VerticalDivider />
                            <StatItem title="Staff" content={data?.staff} />
                        </View>
                        <Divider style={{ marginVertical: 5 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <StatItem title="Tags" content={data?.tags} />
                            <VerticalDivider />
                            <StatItem title="Traits" content={data?.traits} />
                        </View>
                    </View>
                )}
            </Card.Content>
        </Card>
    );
};

export default SiteStats;
