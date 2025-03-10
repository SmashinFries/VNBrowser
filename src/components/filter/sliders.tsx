import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
	Icon,
	IconButton,
	SegmentedButtons,
	SegmentedButtonsProps,
	Surface,
	Switch,
	Text,
} from 'react-native-paper';
import _ from 'lodash';
import { convertWeight, convertLength } from '@/utils/conversions';

const WEIGHT_OPTIONS: SegmentedButtonsProps['buttons'] = [
	{
		label: 'KG',
		value: 'kg',
	},
	{
		label: 'LB',
		value: 'lb',
	},
];

const LENGTH_OPTIONS: SegmentedButtonsProps['buttons'] = [
	{
		label: 'CM',
		value: 'cm',
	},
	{
		label: 'IN',
		value: 'in',
	},
	{
		label: 'FT',
		value: 'ft',
	},
];

type FilterSliderProps = {
	minVal?: number;
	maxVal?: number;
	step?: number;
	isWeight?: boolean;
	lengthUnits?: ('cm' | 'in' | 'ft')[];
	disabled?: boolean;
	title: string;
	value: number;
	onValChange: (value: number | undefined) => void;
};
export const FilterSlider = ({
	maxVal,
	minVal,
	step = 1,
	isWeight,
	lengthUnits,
	disabled,
	title,
	value,
	onValChange,
}: FilterSliderProps) => {
	const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
	const [lengthUnit, setLengthUnit] = useState<'cm' | 'in' | 'ft'>('cm');
	const [isToggled, setIsToggled] = useState(value ? true : false);

	const [currentValue, setCurrentValue] = useState(value ?? 0);
	const [displayValue, setDisplayValue] = useState(currentValue);

	const onToggle = (val: boolean) => {
		setIsToggled(val);
		if (val) {
			if (isWeight) {
				onValChange(_.toNumber(convertWeight(currentValue, weightUnit, 'kg')));
			} else if (lengthUnits) {
				onValChange(_.toNumber(convertLength(currentValue, lengthUnit, 'cm')));
			} else {
				onValChange(currentValue);
			}
		} else {
			onValChange(undefined);
		}
	};

	const onChange = (val: number) => {
		setCurrentValue(val);
		setDisplayValue(val);
		if (isToggled) {
			onValChange(val);
		}
	};

	// useEffect(() => {
	//     if (isWeight) {
	//         setDisplayValue(
	//             _.toNumber(convertWeight(currentValue, 'kg', weightUnit as 'kg' | 'lb')),
	//         );
	//     } else if (isLength) {
	//         setDisplayValue(
	//             _.toNumber(convertLength(currentValue, 'cm', lengthUnit as 'cm' | 'in')),
	//         );
	//     } else {
	//         setDisplayValue(currentValue);
	//     }
	// }, [currentValue, weightUnit, lengthUnit]);

	return (
		<Surface
			mode="elevated"
			style={{
				flex: 1,
				marginHorizontal: 15,
				borderRadius: 12,
				paddingHorizontal: 10,
				marginVertical: 8,
			}}
		>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
					{title ?? 'test'}
				</Text>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Text style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
						{isWeight || lengthUnits
							? `${isWeight ? (weightUnit === 'kg' ? currentValue + ' kg' : convertWeight(currentValue, 'kg', weightUnit) + ` ${weightUnit}`) : lengthUnits ? `${convertLength(currentValue, 'cm', lengthUnit)}${lengthUnit !== 'ft' ? ` ${lengthUnit}` : ''}` : currentValue}`
							: currentValue}
					</Text>
				</View>
			</View>
			<View style={{ alignItems: 'center', flexDirection: 'row' }}>
				<Slider
					minimumValue={minVal}
					maximumValue={maxVal}
					value={currentValue}
					step={step}
					onValueChange={onChange}
					disabled={disabled}
					style={{ height: 30, marginHorizontal: 15, flexGrow: 1 }}
				/>
				<IconButton
					style={{ flexShrink: 1 }}
					icon={'close-circle-outline'}
					onPress={() => {
						isToggled && onValChange(0);
						setCurrentValue(0);
					}}
				/>
			</View>
			{(isWeight || lengthUnits) && (
				<View style={{ padding: 10, alignItems: 'center', flexDirection: 'row' }}>
					<SegmentedButtons
						value={isWeight ? weightUnit : lengthUnit}
						onValueChange={(val) => {
							if (isWeight) {
								// setCurrentValue(
								//     _.toNumber(
								//         convertWeight(currentValue, weightUnit, val as 'kg' | 'lb'),
								//     ),
								// );
								setWeightUnit(val as 'kg' | 'lb');
							} else {
								setLengthUnit(val as 'cm' | 'in');
							}
						}}
						buttons={
							lengthUnits
								? [
										...LENGTH_OPTIONS.filter((val) =>
											lengthUnits.includes(val.value as 'cm' | 'in' | 'ft'),
										),
									]
								: WEIGHT_OPTIONS
						}
						density="high"
						style={{ flexShrink: 1 }}
					/>
					<Switch
						value={isToggled}
						disabled={disabled}
						style={{ flexGrow: 1 }}
						onValueChange={onToggle}
					/>
				</View>
			)}
		</Surface>
	);
};
