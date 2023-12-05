import { getAction, postAction } from '@/services/index';

export const getUserList = (params: any) => getAction('/user/list', params);

export const addUserList = (data: any) => postAction('/user/add', data);
export const deleteUserList = (data: any) => postAction('/user/delete', data);
