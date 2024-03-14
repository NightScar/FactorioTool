import { defineConfig } from '@umijs/max';

export default defineConfig({
    antd: {},
    layout: {
        title: 'test',
        locale: false,
    },
    history: { type: 'hash' },
    routes: [
        {
            path: '/',
            redirect: '/formula',
        },
        {
            path: '/formula',
            component: '@/pages/index',
            name: 'formula',
            title: 'formula',
        },
        {
            path: '/analysis',
            name: 'ana',
            component: '@/pages/ProductAnalysis',
            title: 'analysis',
        },
        {
            path: '/demo1',
            name: 'demo1',
            component: '@/pages/Demo1',
            title: 'demo1',
        },
        {
            path: '/productTree',
            name: '生产树',
            component: '@/pages/ProductTree',
            title: '生产树',
        },
    ],
    npmClient: 'yarn',
});
