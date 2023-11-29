import { login } from '@/services/login';
import { GithubOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Divider, Tabs, message, theme } from 'antd';
// @ts-ignore
import qs from 'qs';
import type { CSSProperties } from 'react';
import React from 'react';
// @ts-ignore
import { history, useRequest } from 'umi';
import { LOGIN_PROPS } from './type';

export default () => {
  const { token } = theme.useToken();

  const iconStyles: CSSProperties = {
    color: '#fff',
    fontSize: '25px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };
  const items = [{ label: '账户密码登录', key: 'account' }];
  const { run: fetchLogin } = useRequest((data: LOGIN_PROPS) => login(data), {
    manual: true,
    onSuccess: (res: any) => {
      if (res.token) localStorage.setItem('token', res.token);
      message.success('登录成功');
      history.push('/home');
    },
  });
  return (
    <ProConfigProvider dark hashed={false}>
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          height: '100%',
        }}
      >
        <LoginFormPage
          backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          logo="https://gw.alipayobjects.com/zos/bmw-prod/598d14af-4f1c-497d-b579-5ac42cd4dd1f/k7bjua9c_w132_h130.png"
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title="umi admin"
          onFinish={async (values: any) => {
            fetchLogin(qs.stringify(values));
          }}
          actions={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Divider plain>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.25)',
                    fontWeight: 'normal',
                    fontSize: 14,
                  }}
                >
                  其他登录方式
                </span>
              </Divider>
              <GithubOutlined
                onClick={() => window.open('https://github.com/chen-wm')}
                style={iconStyles}
              />
            </div>
          }
        >
          <Tabs centered activeKey={'account'} items={items} />
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'用户名: admin or user'}
            initialValue={'admin'}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            initialValue={'123456'}
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'密码: ant.design'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
};
