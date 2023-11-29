import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { REQUEST_CODE } from './constants';

// 与后端约定的响应数据格式
interface ResponseStructure {
  code: boolean;
  data: any;
  message?: string;
}

// 前端加密密钥
const VITE_PWD_ENC_KEY = 'pigxpigxpigxpigx';

// 常用header
export enum CommonHeaderEnum {
  'TENANT_ID' = 'TENANT-ID',
  'ENC_FLAG' = 'Enc-Flag',
  'AUTHORIZATION' = 'Authorization',
}
/**
 *加密处理
 */
// export function encryption(src: string, keyWord: string) {
//   const key = CryptoJS.enc.Utf8.parse(keyWord);
//   // 加密
//   let encrypted = CryptoJS.AES.encrypt(src, key, {
//     iv: key,
//     mode: CryptoJS.mode.CFB,
//     padding: CryptoJS.pad.NoPadding,
//   });
//   return encrypted.toString();
// }

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {},
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {},
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = localStorage.getItem('token');
      if (token) {
        if (config.headers) {
          config.headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          };
        }
      }
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      const { data } = response as unknown as ResponseStructure;
      if (data.code !== REQUEST_CODE.SUCCESS) {
        return message.error(data.message as string);
      }
      return response;
    },
  ],
};
