export const getDatetoReleasedString = (value: Date): string => {
	return value.toISOString().split('T')[0];
};

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
export const getBirthday = (value: [number, number] | null | undefined): string => {
	if (!value) return 'N/A';
	return `${MONTHS[value[1] - 1]} ${value[0]}`;
};

export const getVNLength = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours}h ${mins}m`;
};
