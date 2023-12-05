import { SERVICE_METHODS } from '@/constants';
import { request } from '@umijs/max';

export const login = (data: any) => {
  return request('/login', {
    method: SERVICE_METHODS.POST,
    data,
  });
};

export const logout = () => {
  return request('/logout', {
    method: SERVICE_METHODS.POST,
  });
};
