export interface IItemConfig {
    items: {
        name: string;
        buildTime: number;
        productNumber: number;
        formulaList: { name: string; num: number }[];
        iconPosition: number[];
    }[];
}

const c: IItemConfig = {
    items: [
        {
            name: '铁板',
            buildTime: 3.2,
            productNumber: 1,
            formulaList: [],
            iconPosition: [4, 6],
        },
        {
            name: '铜板',
            buildTime: 3.2,
            productNumber: 1,
            formulaList: [],
            iconPosition: [2, 2],
        },
        {
            name: '铁齿轮',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 2 }],
            iconPosition: [2, 6],
        },
        {
            name: '红瓶',
            buildTime: 5,
            productNumber: 1,
            formulaList: [
                { name: '铜板', num: 1 },
                { name: '铁齿轮', num: 1 },
            ],
            iconPosition: [12, 0],
        },
        {
            name: '基础传送带',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [
                { name: '铁板', num: 1 },
                { name: '铁齿轮', num: 1 },
            ],
            iconPosition: [9, 11],
        },
        {
            name: '铜线',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [{ name: '铜板', num: 1 }],
            iconPosition: [0, 2],
        },
        {
            name: '电路板',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [
                { name: '铁板', num: 1 },
                { name: '铜线', num: 3 },
            ],
            iconPosition: [9, 3],
        },
        {
            name: '电力机械臂',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [
                { name: '铁板', num: 1 },
                { name: '铁齿轮', num: 1 },
                { name: '电路板', num: 1 },
            ],
            iconPosition: [0, 6],
        },
        {
            name: '绿瓶',
            buildTime: 6,
            productNumber: 1,
            formulaList: [
                { name: '基础传送带', num: 1 },
                { name: '电力机械臂', num: 1 },
            ],
            iconPosition: [0, 7],
        },
        {
            name: '钢材',
            buildTime: 16,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 5 }],
            iconPosition: [18, 10],
        },
        {
            name: '标准弹匣',
            buildTime: 1,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 4 }],
            iconPosition: [8, 4],
        },
        {
            name: '穿甲弹匣',
            buildTime: 3,
            productNumber: 1,
            formulaList: [
                { name: '铜板', num: 5 },
                { name: '钢材', num: 1 },
                { name: '标准弹匣', num: 1 },
            ],
            iconPosition: [15, 7],
        },
        {
            name: '煤矿',
            buildTime: 2,
            productNumber: 1,
            formulaList: [],
            iconPosition: [13, 1],
        },
        {
            name: '标准手雷',
            buildTime: 8,
            productNumber: 1,
            formulaList: [
                { name: '煤矿', num: 10 },
                { name: '铁板', num: 5 },
            ],
            iconPosition: [12, 5],
        },
        {
            name: '石矿',
            buildTime: 2,
            productNumber: 1,
            formulaList: [],
            iconPosition: [1, 11],
        },
        {
            name: '石砖',
            buildTime: 3.2,
            productNumber: 1,
            formulaList: [{ name: '石矿', num: 2 }],
            iconPosition: [19, 10],
        },
        {
            name: '墙壁',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '石砖', num: 5 }],
            iconPosition: [1, 12],
        },
        {
            name: '黑瓶',
            buildTime: 10,
            productNumber: 2,
            formulaList: [
                { name: '穿甲弹匣', num: 1 },
                { name: '标准手雷', num: 1 },
                { name: '墙壁', num: 2 },
            ],
            iconPosition: [4, 7],
        },
        {
            name: '石油气',
            buildTime: 1,
            productNumber: 1,
            formulaList: [],
            iconPosition: [4, 5],
        },
        {
            name: '水',
            buildTime: 1,
            productNumber: 1,
            formulaList: [],
            iconPosition: [7, 5],
        },
        {
            name: '硫磺',
            buildTime: 1,
            productNumber: 2,
            formulaList: [
                { name: '水', num: 30 },
                { name: '石油气', num: 30 },
            ],
            iconPosition: [5, 11],
        },
        {
            name: '塑料',
            buildTime: 1,
            productNumber: 2,
            formulaList: [
                { name: '煤矿', num: 1 },
                { name: '石油气', num: 20 },
            ],
            iconPosition: [0, 8],
        },
        {
            name: '集成电路',
            buildTime: 6,
            productNumber: 1,
            formulaList: [
                { name: '塑料', num: 2 },
                { name: '铜线', num: 4 },
                { name: '电路板', num: 2 },
            ],
            iconPosition: [2, 0],
        },
        {
            name: '管道',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 1 }],
            iconPosition: [18, 7],
        },
        {
            name: '内燃机',
            buildTime: 10,
            productNumber: 1,
            formulaList: [
                { name: '钢材', num: 1 },
                { name: '铁齿轮', num: 1 },
                { name: '管道', num: 2 },
            ],
            iconPosition: [12, 3],
        },
        {
            name: '蓝瓶',
            buildTime: 24,
            productNumber: 2,
            formulaList: [
                { name: '硫磺', num: 1 },
                { name: '集成电路', num: 3 },
                { name: '内燃机', num: 2 },
            ],
            iconPosition: [10, 1],
        },
        {
            name: '铁棒',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [{ name: '铁板', num: 1 }],
            iconPosition: [5, 6],
        },
        {
            name: '铁轨',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [
                { name: '石矿', num: 1 },
                { name: '钢材', num: 1 },
                { name: '铁棒', num: 1 },
            ],
            iconPosition: [17, 8],
        },
        {
            name: '电炉',
            buildTime: 5,
            productNumber: 1,
            formulaList: [
                { name: '钢材', num: 10 },
                { name: '集成电路', num: 5 },
                { name: '石砖', num: 10 },
            ],
            iconPosition: [7, 3],
        },
        {
            name: '产能插件1',
            buildTime: 15,
            productNumber: 1,
            formulaList: [
                { name: '电路板', num: 5 },
                { name: '集成电路', num: 5 },
            ],
            iconPosition: [10, 8],
        },
        {
            name: '紫瓶',
            buildTime: 21,
            productNumber: 3,
            formulaList: [
                { name: '铁轨', num: 30 },
                { name: '电炉', num: 1 },
                { name: '产能插件1', num: 1 },
            ],
            iconPosition: [7, 8],
        },
        {
            name: '硫酸',
            buildTime: 1,
            productNumber: 50,
            formulaList: [
                { name: '铁板', num: 1 },
                { name: '硫磺', num: 5 },
                { name: '水', num: 100 },
            ],
            iconPosition: [6, 5],
        },
        {
            name: '处理器',
            buildTime: 10,
            productNumber: 3,
            formulaList: [
                { name: '电路板', num: 20 },
                { name: '集成电路', num: 2 },
                { name: '硫酸', num: 5 },
            ],
            iconPosition: [6, 8],
        },
        {
            name: '重油',
            buildTime: 1,
            productNumber: 1,
            formulaList: [],
            iconPosition: [0, 5],
        },
        {
            name: '润滑油',
            buildTime: 1,
            productNumber: 10,
            formulaList: [{ name: '重油', num: 10 }],
            iconPosition: [3, 5],
        },
        {
            name: '电动机',
            buildTime: 10,
            productNumber: 1,
            formulaList: [
                { name: '电路板', num: 2 },
                { name: '内燃机', num: 1 },
                { name: '润滑油', num: 15 },
            ],
            iconPosition: [6, 3],
        },
        {
            name: '电池',
            buildTime: 4,
            productNumber: 1,
            formulaList: [
                { name: '铁板', num: 1 },
                { name: '铜板', num: 1 },
                { name: '硫酸', num: 20 },
            ],
            iconPosition: [15, 0],
        },
        {
            name: '机器人构架',
            buildTime: 20,
            productNumber: 1,
            formulaList: [
                { name: '钢材', num: 1 },
                { name: '电池', num: 2 },
                { name: '电路板', num: 3 },
                { name: '电动机', num: 1 },
            ],
            iconPosition: [8, 5],
        },
        {
            name: '轻质框架',
            buildTime: 20,
            productNumber: 1,
            formulaList: [
                { name: '铜板', num: 20 },
                { name: '钢材', num: 2 },
                { name: '塑料', num: 5 },
            ],
            iconPosition: [2, 7],
        },
        {
            name: '黄瓶',
            buildTime: 21,
            productNumber: 3,
            formulaList: [
                { name: '处理器', num: 2 },
                { name: '机器人构架', num: 1 },
                { name: '轻质框架', num: 3 },
            ],
            iconPosition: [0, 12],
        },
        {
            name: '速度插件1',
            buildTime: 15,
            productNumber: 1,
            formulaList: [
                { name: '电路板', num: 5 },
                { name: '集成电路', num: 5 },
            ],
            iconPosition: [7, 10],
        },
        {
            name: '速度插件2',
            buildTime: 30,
            productNumber: 1,
            formulaList: [
                { name: '处理器', num: 5 },
                { name: '集成电路', num: 5 },
                { name: '速度插件1', num: 5 },
            ],
            iconPosition: [5, 10],
        },
        {
            name: '速度插件3',
            buildTime: 60,
            productNumber: 1,
            formulaList: [
                { name: '处理器', num: 5 },
                { name: '集成电路', num: 5 },
                { name: '速度插件2', num: 5 },
            ],
            iconPosition: [6, 10],
        },
        {
            name: '火箭控制器',
            buildTime: 30,
            productNumber: 1,
            formulaList: [
                { name: '处理器', num: 1 },
                { name: '速度插件1', num: 1 },
            ],
            iconPosition: [5, 9],
        },
        {
            name: '火箭燃料',
            buildTime: 30,
            productNumber: 1,
            formulaList: [
                { name: '固体燃料', num: 10 },
                { name: '轻油', num: 10 },
            ],
            iconPosition: [6, 9],
        },
    ],
};

export default c;
