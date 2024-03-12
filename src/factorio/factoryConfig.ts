export interface FactoryConfig {
    name: string;
    icon: string;
    speed: number;
    space: number;
    iconPosition: number[];
}

export interface PluginConfig {
    name: string;
    icon: string;
    speedUp: number;
    productUp: number;
    iconPosition: number[];
}

const factory: FactoryConfig[] = [
    {
        name: '2级工厂',
        icon: 'factory2',
        speed: 0.75,
        space: 2,
        iconPosition: [9, 0],
    },
    {
        name: '3级工厂',
        icon: 'factory3',
        speed: 1.25,
        space: 4,
        iconPosition: [10, 0],
    },
    {
        name: '电炉',
        icon: 'elu',
        speed: 2,
        space: 2,
        iconPosition: [7, 3],
    },
];

const plugin: PluginConfig[] = [
    {
        name: '3级速度插件',
        icon: 'speed3',
        speedUp: 0.5,
        productUp: 0,
        iconPosition: [6, 10],
    },
    {
        name: '3级产能插件',
        icon: 'product3',
        speedUp: -0.15,
        productUp: 0.1,
        iconPosition: [9, 8],
    },
];

export default {
    factory: factory,
    plugin: plugin,
};
