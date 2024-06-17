import _ from 'lodash';

export const convertWeight = (weight: number, origUnit: 'kg' | 'lb', targetUnit: 'kg' | 'lb') => {
	if (origUnit !== 'kg' && targetUnit === 'kg') {
		return (weight / 2.2046).toFixed(0);
	} else if (origUnit !== 'lb' && targetUnit === 'lb') {
		return (weight * 2.20462).toFixed(0);
	} else {
		return `${weight}`;
	}
};

export const convertLength = (
	length: number,
	origUnit: 'cm' | 'in' | 'ft',
	targetUnit: 'cm' | 'in' | 'ft',
) => {
	if (origUnit !== 'cm' && targetUnit === 'cm') {
		return `${(length * 2.54).toFixed(0)}`;
	} else if (origUnit !== 'in' && targetUnit === 'in') {
		return `${(length / 2.54).toFixed(0)}`;
	} else if (origUnit !== 'in' && targetUnit === 'ft') {
		return `${(length / 2.54 / 12).toFixed(0)}' ${((length / 2.54) % 12).toFixed(0)}`;
	} else {
		return `${length}`;
	}
};
