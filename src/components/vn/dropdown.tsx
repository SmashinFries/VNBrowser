import { VNLablesEnum } from '@/api/vndb/schema';
import { VNUserListResponse } from '@/api/vndb/types';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Dialog, List, Menu, Portal } from 'react-native-paper';
import _ from 'lodash';
import { useUlistLabels } from '@/api/vndb/queries/hooks';

type LabelDropDownProps = {
	values: VNUserListResponse['results'][0]['labels'] | undefined;
	onConfirm: (ids: number[]) => void;
};
export const LabelDropDown = ({ values, onConfirm }: LabelDropDownProps) => {
	const { data } = useUlistLabels();

	const [temp, setTemp] = useState<number[]>(values ? values?.map((label) => label.id) : []);
	const [vis, setVis] = useState(false);

	const onDismiss = () => {
		setVis(false);
	};

	return (
		<>
			<Button
				mode="elevated"
				labelStyle={{ textTransform: 'capitalize' }}
				style={{ flexGrow: 1, alignSelf: 'center' }}
				onPress={() => setVis(true)}
			>
				{values?.map((label) => label.label).join(', ') ?? 'Select List'}
			</Button>
			<Portal>
				<Dialog visible={vis} onDismiss={onDismiss} style={{ maxHeight: '90%' }}>
					<Dialog.Title>Select Labels</Dialog.Title>
					<Dialog.ScrollArea>
						<ScrollView>
							{data?.labels?.map((label) => (
								<List.Item
									key={label.id}
									title={label.label}
									onPress={() =>
										setTemp((prev) =>
											prev.includes(label.id)
												? [...prev].filter((val) => val !== label.id)
												: [...prev, label.id],
										)
									}
									left={(props) => (
										<List.Icon
											{...props}
											icon={
												temp.includes(label.id)
													? 'checkbox-marked'
													: 'checkbox-blank-outline'
											}
										/>
									)}
								/>
							))}
						</ScrollView>
					</Dialog.ScrollArea>
					<Dialog.Actions>
						<Button
							onPress={() => {
								setTemp(values ? values?.map((label) => label.id) : []);
								onDismiss();
							}}
						>
							Cancel
						</Button>
						<Button
							onPress={() => {
								onConfirm(temp);
								onDismiss();
							}}
						>
							Submit
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};
