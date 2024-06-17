import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReleaseListStatus, VNUlistPatchParams } from '../types';
import _ from 'lodash';
import { useUserAuthStore } from '@/store/store';
import { deleteRlist, deleteUlist, patchRlist, patchUlist } from './mutations';

export const useUlistEdit = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['ulist_edit'],
		mutationFn: (params: VNUlistPatchParams) => patchUlist(params),
		onSuccess: (data, vars) => {
			queryClient.invalidateQueries({ queryKey: ['vn_user_entry', vars.id] });
		},
	});
};

export const useUlistDelete = () => {
	const queryClient = useQueryClient();
	const token = useUserAuthStore.getState().vndb.token;

	return useMutation({
		mutationKey: ['ulist_delete'],
		mutationFn: (id: string) => deleteUlist(id, token),
		onSuccess: (data, id) => {
			queryClient.invalidateQueries({ queryKey: ['vn_user_entry', id] });
		},
	});
};

export const useRlistEdit = () => {
	const queryClient = useQueryClient();
	const token = useUserAuthStore.getState().vndb.token;

	return useMutation({
		mutationKey: ['rlist_edit'],
		mutationFn: (props: { rId: string; status: ReleaseListStatus }) =>
			patchRlist({ ...props, token }),
		onSuccess: (data, vars) => {
			queryClient.invalidateQueries({ queryKey: ['r_user_entry', vars.rId] });
		},
	});
};

export const useRlistDelete = () => {
	// const queryClient = useQueryClient();
	const token = useUserAuthStore.getState().vndb.token;

	return useMutation({
		mutationKey: ['rlist_delete'],
		mutationFn: (rId: string) => deleteRlist(rId, token),
		// onSuccess: (data, id) => {
		//     queryClient.invalidateQueries({ queryKey: ['vn', id] });
		// },
	});
};
