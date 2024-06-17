import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import {
    NavigationState,
    SceneRendererProps,
    TabBar,
    TabBarIndicator,
} from 'react-native-tab-view';

const TAB_MARGIN = 24;

export const TabBarWithChip = (
    props: SceneRendererProps & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigationState: NavigationState<any>;
        disableAutoWidth?: boolean;
        bgColor?: string;
    },
) => {
    const { colors } = useTheme();
    // const [titleWidth, setTitleWidth] = useState<number>(20);
    return (
        <TabBar
            {...props}
            tabStyle={{
                paddingTop: 10,
                width:
                    props.disableAutoWidth || props.navigationState?.routes.length < 3
                        ? undefined
                        : 'auto',
                marginHorizontal: 20,
            }}
            style={{
                backgroundColor: props.bgColor ?? colors.surface,
                borderBottomColor: colors.elevation.level5,
                borderBottomWidth: 0.8,
            }}
            labelStyle={{ textTransform: 'capitalize', color: colors.onSurface }}
            renderLabel={({ route, focused }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        style={{
                            textTransform: 'capitalize',
                            color: focused ? colors.primary : colors.onBackground,
                            paddingRight: 5,
                        }}
                        // onLayout={(e) => setTitleWidth(e.nativeEvent.layout.width)}
                    >
                        {route.title.split(' (')[0]}
                    </Text>
                    {route.title.split(' (').at(-1).split(')')[0] ? (
                        <View
                            style={{
                                backgroundColor: colors.surfaceVariant,
                                padding: 2,
                                paddingHorizontal: 5,
                                borderRadius: 16,
                            }}
                        >
                            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                                {route.title.split(' (').at(-1).split(')')[0]}
                            </Text>
                        </View>
                    ) : null}
                </View>
            )}
            indicatorStyle={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                height: 4,
                left: TAB_MARGIN / 2,
            }}
            renderIndicator={(indicatorProps) => {
                return (
                    <TabBarIndicator
                        {...indicatorProps}
                        width={indicatorProps.getTabWidth(props.navigationState.index) - TAB_MARGIN}
                    />
                );
            }}
            // renderIndicator={(indicatorProps) => {
            //     const width = indicatorProps.getTabWidth(props.navigationState.index);
            //     return (
            //         <TabBarIndicator
            //             {...indicatorProps}
            //             style={{
            //                 justifyContent: 'center',
            //                 alignSelf: 'center',
            //                 backgroundColor: colors.primary,
            //                 borderRadius: 12,
            //                 height: 4,
            //                 // width: width / 3,
            //             }}
            //         />
            //     );
            // }}
            scrollEnabled={props.navigationState.routes.length > 3 ? true : false}
            android_ripple={{ color: colors.primary, borderless: true }}
        />
    );
};
