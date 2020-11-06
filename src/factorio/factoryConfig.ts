export interface FactoryConfig {
    name: string;
    icon: string;
    speed: number;
    space: number;
}

export interface PluginConfig {
    name: string;
    icon: string;
    speedUp: number;
    productUp: number;
}

const factory: FactoryConfig[] = [
    {
        name: '3级工厂',
        icon: 'factory3',
        speed: 1.25,
        space: 4,
    },
    {
        name: '电炉',
        icon: 'elu',
        speed: 2,
        space: 2,
    },

];

const plugin: PluginConfig[] = [
    {
        name: '3级速度插件',
        icon: 'speed3',
        speedUp: 0.5,
        productUp: 0,
    },
    {
        name: '3级产能插件',
        icon: 'product3',
        speedUp: -0.15,
        productUp: 0.1,
    },
];

export default {
    factory: factory,
    plugin: plugin,
};
