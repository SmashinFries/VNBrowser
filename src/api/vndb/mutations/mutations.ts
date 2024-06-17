import { VNDB_API_URL } from '@/constants';
import { useUserAuthStore } from '@/store/store';
import axios from 'axios';
import { ReleaseListStatus, VNUlistPatchParams } from '../types';
import _ from 'lodash';

const VNClient = axios.create({
	baseURL: VNDB_API_URL,
	headers: useUserAuthStore.getState().vndb.token
		? { Authorization: `token ${useUserAuthStore.getState().vndb.token}` }
		: undefined,
});

export const patchUlist = async (props: VNUlistPatchParams) => {
	const token = useUserAuthStore.getState().vndb.token;
	const params = _.pickBy({
		labels: props.labels,
		labels_set: props.labels_set,
		labels_unset: props.labels_unset,
		started: props.started,
		finished: props.finished,
		vote: props.vote,
		notes: props.notes,
	});
	const { data, status, statusText } = await VNClient.patch(`/ulist/${props.id}`, params, {
		headers: { Authorization: `token ${token}` },
	});
	return data;
};

export const deleteUlist = async (id: string, token: string | null) =>
	await VNClient.delete(`/ulist/${id}`, { headers: { Authorization: `token ${token}` } });

export const patchRlist = async (props: {
	rId: string;
	status: ReleaseListStatus;
	token: string | null;
}) =>
	await VNClient.patch(
		`/rlist/${props.rId}`,
		{ status: props.status },
		{ headers: { Authorization: `token ${props.token}` } },
	);

export const deleteRlist = async (rId: string, token: string | null) =>
	await VNClient.delete(`/rlist/${rId}`, { headers: { Authorization: `token ${token}` } });
