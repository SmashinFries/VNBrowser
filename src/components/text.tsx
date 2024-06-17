import { useAppTheme } from '@/providers/theme';
import { View } from 'react-native';
import { Divider, Icon, List, Surface, Text, TextProps, useTheme } from 'react-native-paper';

export const SectionHeader = (props: TextProps<Text>) => {
	return (
		<Text
			{...props}
			variant="titleLarge"
			style={{
				paddingLeft: 16,
				marginTop: 30,
				marginBottom: 10,
				textTransform: 'capitalize',
			}}
		>
			{props.children}
		</Text>
	);
};

export const ListHeading = ({ title }: { title: string }) => {
	const { colors } = useTheme();
	return <List.Subheader style={{ color: colors.primary }}>{title}</List.Subheader>;
};

type ErrorMessageProps = {
	title: string;
	message: string;
};
export const ErrorMessage = ({ title, message }: ErrorMessageProps) => {
	const { colors } = useAppTheme();
	return (
		<Surface
			style={{
				marginVertical: 5,
				marginHorizontal: 10,
				padding: 10,
				backgroundColor: colors.errorContainer,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-around',
				}}
			>
				<View>
					<Icon source={'close'} size={24} color={colors.error} />
				</View>
				<View
					style={{
						width: '100%',
						alignItems: 'flex-start',
						flexShrink: 1,
						paddingLeft: 10,
					}}
				>
					<Text variant="titleMedium">{title}</Text>
					<Text
						style={{
							color: colors.onErrorContainer,
						}}
					>
						{message}
					</Text>
				</View>
			</View>
		</Surface>
	);
};
