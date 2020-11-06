import { defineConfig } from 'umi';

export default defineConfig({
    antd: {},
    nodeModulesTransform: {
        type: 'none',
    },
    layout: {
        name: 'test',
        locale: false
    },
    locale:{},
    routes: [
        { 
          path: '/', 
          menu: {
            flatMenu: true,
          },
          routes: [
            {
              path: '/',
              redirect: '/formula',
            },
            { 
              path: '/formula', 
              component: '@/pages/index',
              name: 'formula',
              munu: {
                name: '配方',
              }
            },
            { 
              path: '/analysis', 
              name: 'ana',
              component: '@/pages/ProductAnalysis',
              munu: {
                name: '产量',
              }
            }
          ] 
        },
    ],
});
