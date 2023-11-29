import { SERVICE_METHODS } from '@/constants';
import { request } from '@umijs/max';

export const login = (data: any) => {
  return request('/api/auth/login', {
    method: SERVICE_METHODS.POST,
    data,
  });
};

export const logout = () => {
  return request('/api/auth/logout', {
    method: SERVICE_METHODS.POST,
  });
};
