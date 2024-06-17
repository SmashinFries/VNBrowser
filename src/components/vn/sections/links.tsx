import { ListHeading, SectionHeader } from '@/components/text';
import { ScrollView, View } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import axios from 'axios';
import { extractReleaseCovers, extractVNLinks, extractVNQuotes } from '@/utils/text';
import { ShopItem, SiteItem, VNReleaseExtLink } from '@/api/vndb/types';
import { Accordion } from '@/components/accordion';
import { openWebBrowser } from '@/utils/webBrowser';

type VNLinksProps = {
	id: string | undefined;
	sites?: VNReleaseExtLink[] | undefined;
	shops?: ShopItem[] | undefined;
};
export const VNLinks = ({ id, shops, sites }: VNLinksProps) => {
	return (
		<View style={{ marginVertical: 10, marginBottom: 20 }}>
			<SectionHeader>Links</SectionHeader>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					alignItems: 'flex-start',
					justifyContent: 'center',
					padding: 15,
				}}
			>
				{sites?.map((site, idx) => (
					<Button
						key={idx}
						onPress={() => openWebBrowser(site.url)}
						style={{ marginRight: 10 }}
						mode="contained-tonal"
						icon={'open-in-new'}
						labelStyle={{ textTransform: 'capitalize' }}
					>
						{site.label}
					</Button>
				))}
			</ScrollView>
			{/* <SectionHeader>Shops</SectionHeader> */}
			{shops && shops?.length > 0 && (
				<Accordion title="Shops">
					<ScrollView
						// horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							// alignItems: 'flex-start',
							justifyContent: 'center',
							padding: 15,
						}}
					>
						{shops && shops?.length > 0 ? (
							shops.map((shop, idx) => (
								<List.Item
									key={idx}
									title={shop.name}
									right={(props) => (
										<Button
											{...props}
											compact
											icon={'shopping-outline'}
											mode="contained-tonal"
											onPress={() => openWebBrowser(shop.url)}
											labelStyle={{
												textTransform:
													shop.amount === 'free'
														? 'capitalize'
														: undefined,
												paddingHorizontal: 5,
											}}
										>
											{shop.amount}
										</Button>
									)}
								/>
							))
						) : (
							<Text>No shops available</Text>
						)}
					</ScrollView>
				</Accordion>
			)}
		</View>
	);
};
