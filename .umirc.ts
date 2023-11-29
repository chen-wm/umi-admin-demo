import { defineConfig } from '@umijs/max';
import { routes } from './config/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {},
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  routes,
  hash: true, // 配置是否让生成的文件包含 hash 后缀，通常用于增量发布和避免浏览器加载缓存。
  history: {
    // 配置 history 类型和配置项
    type: 'hash', // 可选 browser、hash 和 memory
  },
  base: '/',
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1',
      changeOrigin: true,
    },
  },
});
