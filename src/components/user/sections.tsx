import { useUserAuthStore } from '@/store/store';
import { Pressable, ScrollView, View } from 'react-native';
import { Avatar, Button, List, Text } from 'react-native-paper';
import { ProfileBanner } from './banner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPageActions } from '../interaction';
import { useUserDetails, useVNUserList } from '@/api/vndb/queries/hooks';
import { UserListSectionScroll } from '../lists';
import { LinearGradient } from 'expo-linear-gradient';
import { selectImage } from '@/utils/image';
import { useAppTheme } from '@/providers/theme';
import { UserDetails } from '@/api/vndb/types';
import { Accordion } from '../accordion';

const ProfileDetailItem = ({ title, text }: { title: string; text: string | undefined | null }) => {
	if (!text) return null;
	return <List.Item title={title} right={(props) => <Text {...props}>{text}</Text>} />;
};

const VNDBProfileDetails = ({ data }: { data: UserDetails | undefined }) => {
	return (
		<Accordion title="Details" initialExpand>
			{/* <Text
				variant="headlineSmall"
				style={{
					fontWeight: 'bold',
					margin: 30,
					marginVertical: 10,
					textTransform: 'capitalize',
				}}
			>
				{'Details'}
			</Text> */}
			<ProfileDetailItem title={'Registered'} text={data?.registered} />
			<ProfileDetailItem title={'Play Times'} text={data?.play_times ?? '0m played'} />
			<ProfileDetailItem title={'List Stats'} text={data?.list_stats} />
			<ProfileDetailItem title={'Edits'} text={data?.edits} />
			<ProfileDetailItem title={'Reviews'} text={data?.reviews} />
			<ProfileDetailItem title={'Roles'} text={data?.role?.join(', ')} />
			<ProfileDetailItem title={'Hair'} text={data?.hair?.join(', ')} />
			<ProfileDetailItem title={'Personality'} text={data?.personality?.join(',')} />
			<ProfileDetailItem title={'Tags'} text={data?.tags} />
			<ProfileDetailItem title={'Subject Of'} text={data?.subject_of?.join(', ')} />
			<ProfileDetailItem title={'Engages In'} text={data?.engages_in?.join(', ')} />
			<ProfileDetailItem title={'Engages In S'} text={data?.engages_in_s?.join(',')} />
		</Accordion>
	);
};

export const VNDBProfile = () => {
	const { vndb } = useUserAuthStore();
	const userDetails = useUserDetails();
	const playingList = useVNUserList('Playing', 'lastmod', vndb.userID ? true : false);
	const wishlistList = useVNUserList('Wishlist', 'added', vndb.userID ? true : false);
	const { colors } = useAppTheme();

	return (
		<ProfileBanner type={vndb.banner ? 'banner' : undefined}>
			<LinearGradient
				colors={['rgba(0,0,0,0.2)', colors.surface]}
				locations={[0, 0.22]}
				style={{
					position: 'absolute',
					top: 0,
					width: '100%',
					height: '100%',
				}}
			/>
			<SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
				<Pressable onPress={() => selectImage('avatar')}>
					{vndb.avatar ? (
						<Avatar.Image source={{ uri: vndb.avatar }} size={24 * 5} />
					) : (
						<Avatar.Text label={vndb.username ? vndb.username[0] : ''} size={24 * 5} />
					)}
				</Pressable>
				<View style={{ paddingLeft: 20, alignItems: 'flex-start' }}>
					<Text variant="titleLarge">{vndb.username}</Text>
					<Text>
						{userDetails.data?.play_times ? userDetails.data?.play_times : '0m played'}
					</Text>
				</View>
			</SafeAreaView>
			<UserPageActions />
			<VNDBProfileDetails data={userDetails.data} />
			<UserListSectionScroll
				data={playingList.data?.pages[0].results}
				hasMore={playingList.data?.pages[0].more}
				category_title="Currently Playing"
				isLoading={playingList.isFetching}
				emptyText="No current VNs"
			/>
			<UserListSectionScroll
				data={wishlistList.data?.pages[0].results}
				category_title="Your Wishlist"
				isLoading={wishlistList.isFetching}
				emptyText="No VNs in your wishlist"
				hasMore={wishlistList.data?.pages[0].more}
			/>
		</ProfileBanner>
	);
};
