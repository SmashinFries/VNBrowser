import { VNQuotes } from '@/api/vndb/types';
import { Accordion } from '@/components/accordion';
import { DividerVertical } from '@/components/divider';
import { SectionHeader } from '@/components/text';
import { copyToClipboard } from '@/utils/text';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Button, Headline, IconButton, Surface, Text } from 'react-native-paper';

type VNQuotesProps = {
	quotes: VNQuotes[] | undefined;
};
const VNQuotesSection = ({ quotes }: VNQuotesProps) => {
	if (!quotes || quotes.length === 0) return null;
	return (
		<View style={{ flex: 1, marginVertical: 10 }}>
			<Accordion title="Quotes">
				<View>
					{quotes
						.sort((a, b) => b.votes - a.votes)
						.map(
							(quote, index) =>
								quote.votes > -1 && (
									<Surface
										key={index}
										style={{
											flex: 1,
											padding: 10,
											marginHorizontal: 15,
											marginVertical: 5,
											borderRadius: 8,
										}}
									>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
											}}
										>
											<Text style={{ marginRight: 10 }}>{quote.votes}</Text>
											<DividerVertical />
											<View style={{ flex: 1 }}>
												<Text
													style={{
														marginVertical: 5,
														paddingHorizontal: 10,
													}}
												>
													{quote.quote}
												</Text>
											</View>
											<View>
												<IconButton
													icon="content-copy"
													onPress={() => copyToClipboard(quote.quote)}
												/>
											</View>
										</View>
										{quote.character && (
											<Button
												onPress={() =>
													router.push('/character/' + quote.character?.id)
												}
											>
												{quote.character.name}
											</Button>
										)}
									</Surface>
								),
						)}
				</View>
			</Accordion>
		</View>
	);
};

export default VNQuotesSection;
