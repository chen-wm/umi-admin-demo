// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

import { REQUEST_CODE } from '@/constants';
import { errorConfig } from '@/requestErrorConfig';
import { logout } from '@/services/login';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { history } from 'umi';
import './app.css';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'umi admin' };
}

// @ts-ignore
export const layout = () => {
  const { run: fetchLogout } = useRequest(logout, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === REQUEST_CODE.SUCCESS) {
        message.success('退出登录成功');
        localStorage.removeItem('token');
        history.push('/login');
      }
    },
  });
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    logout: () => {
      fetchLogout();
    },
    title: 'umi admin',
    layout: {},
  };
};
export const request = {
  ...errorConfig,
};
