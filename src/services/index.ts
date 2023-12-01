import { SERVICE_METHODS } from '@/constants';
import { request } from '@umijs/max';

export const postAction = (url: string, options: object) => {
  return request(url, {
    method: SERVICE_METHODS.POST,
    ...options,
  });
};

export const getAction = (url: string, options: object) => {
  return request(url, {
    method: SERVICE_METHODS.GET,
    ...options,
  });
};

export const putAction = (url: string, options: object) => {
  return request(url, {
    method: SERVICE_METHODS.PUT,
    ...options,
  });
};

export const deleteAction = (url: string, options: object) => {
  return request(url, {
    method: SERVICE_METHODS.DELETE,
    ...options,
  });
};
