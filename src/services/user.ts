import { SERVICE_METHODS } from '@/constants';
import { getAction, postAction } from '@/services/index';

export const getUserList = (params: any) => getAction('/user/list', params);

export const addUserList = (data: any) =>
  postAction('/user/add', {
    method: SERVICE_METHODS.POST,
    data,
  });
export const deleteUserList = (data: any) =>
  postAction('/user/delete', {
    method: SERVICE_METHODS.POST,
    data,
  });
