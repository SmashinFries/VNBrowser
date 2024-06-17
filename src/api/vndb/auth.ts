import { useUserAuthStore } from '@/store/store';
import axios from 'axios';
import { UserAuthResponse } from './types';
import { VNDB_API_URL } from '@/constants';

const VNClient = axios.create({ baseURL: VNDB_API_URL });

export const fetchVNAuthInfo = async (token?: string) => {
    const auth_token = token ?? useUserAuthStore.getState().vndb.token;
    if (!auth_token) return null;
    const { data } = await VNClient.get<UserAuthResponse>(`/authinfo`, {
        headers: { Authorization: `token ${auth_token}` },
    });
    return data;
};
