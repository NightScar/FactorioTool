import { defineConfig } from 'umi';

export default defineConfig({
  antd:{},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
