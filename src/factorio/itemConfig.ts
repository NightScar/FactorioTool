export interface IItemConfig{
    items: {
        name: string;
        buildTime: number;
        productNumber: number;
        formulaList: { name: string, num: number}[];
    }[]
}

const c: IItemConfig = {
    items: [
        {
            name: '铁板',
            buildTime: 3.2,
            productNumber: 1,
            formulaList: [],
        },
        {
            name: '铜板',
            buildTime: 3.2,
            productNumber: 1,

            formulaList: [],
        },
        {
            name: '铁齿轮',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 2}],
        },
        {
            name: '红瓶',
            buildTime: 5,
            productNumber: 1,
            formulaList: [{ name: '铜板', num: 1 }, { name: '铁齿轮', num: 1 }],
        },
        {
            name: '基础传送带',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [{ name: '铁板', num: 1 }, { name: '铁齿轮', num: 1 }],
        },
        {
            name: '铜线',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [{ name: '铜板', num: 1 }],
        },
        {
            name: '电路板',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 1 }, { name: '铜线', num: 3 }],
        },
        {
            name: '电力机械臂',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 1 }, { name: '铁齿轮', num: 1 }, { name: '电路板', num: 1 }],
        },
        {
            name: '绿瓶',
            buildTime: 6,
            productNumber: 1,
            formulaList: [{ name: '基础传送带', num: 1 }, { name: '电力机械臂', num: 1 }],
        },
        {
            name: '钢材',
            buildTime: 16,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 5 }],
        },
        {
            name: '标准弹匣',
            buildTime: 1,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 4 }],
        },
        {
            name: '穿甲弹匣',
            buildTime: 3,
            productNumber: 1,
            formulaList: [{ name: '铜板', num: 5 }, { name: '钢材', num: 1 }, { name: '标准弹匣', num: 1 }],
        },
        {
            name: '煤矿',
            buildTime: 2,
            productNumber: 1,
            formulaList: [],
        },
        {
            name: '标准手雷',
            buildTime: 8,
            productNumber: 1,
            formulaList: [{ name: '煤矿', num: 10 }, { name: '铁板', num: 5}],
        },
        {
            name: '石矿',
            buildTime: 2,
            productNumber: 1,
            formulaList: [],
        },
        {
            name: '石砖',
            buildTime: 3.2,
            productNumber: 1,
            formulaList: [{ name: '石矿', num: 2 }],
        },
        {
            name: '墙壁',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '石砖', num: 5 }],
        },
        {
            name: '黑瓶',
            buildTime: 10,
            productNumber: 2,
            formulaList: [{ name: '穿甲弹匣', num: 1 }, { name: '标准手雷', num: 1 }, { name: '墙壁', num: 2 }],
        },
        {
            name: '石油气',
            buildTime: 1,
            productNumber: 1,
            formulaList: [],
        },
        {
            name: '水',
            buildTime: 1,
            productNumber: 1,
            formulaList: [],
        },
        {
            name: '硫磺',
            buildTime: 1,
            productNumber: 2,
            formulaList: [{ name: '水', num: 30 }, {name: '石油气', num: 30}],
        },
        {
            name: '塑料',
            buildTime: 1,
            productNumber: 2,
            formulaList: [{ name: '煤矿', num: 1 }, {name: '石油气', num: 20}],
        },
        {
            name: '集成电路',
            buildTime: 6,
            productNumber: 1,
            formulaList: [{ name: '塑料', num: 2 }, {name: '铜线', num: 4}, {name: '电路板', num: 2}],
        },
        {
            name: '管道',
            buildTime: 0.5,
            productNumber: 1,
            formulaList: [{ name: '铁板', num: 1 }],
        },
        {
            name: '内燃机',
            buildTime: 10,
            productNumber: 1,
            formulaList: [{ name: '钢材', num: 1 }, { name: '铁齿轮', num: 1 }, { name: '管道', num: 2 }],
        },
        {
            name: '蓝瓶',
            buildTime: 24,
            productNumber: 2,
            formulaList: [{ name: '硫磺', num: 1 }, { name: '集成电路', num: 3 }, { name: '内燃机', num: 2 }],
        },
        {
            name: '铁棒',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [{ name: '铁板', num: 1 }],
        },
        {
            name: '铁轨',
            buildTime: 0.5,
            productNumber: 2,
            formulaList: [{ name: '石矿', num: 1 }, { name: '钢材', num: 1 },{ name: '铁棒', num: 1 } ],
        },
        {
            name: '电炉',
            buildTime: 5,
            productNumber: 1,
            formulaList: [{ name: '钢材', num: 10 }, { name: '集成电路', num: 5 },{ name: '石砖', num: 10 } ],
        },
        {
            name: '产能插件1',
            buildTime: 15,
            productNumber: 1,
            formulaList: [{ name: '电路板', num: 5 }, { name: '集成电路', num: 5 }],
        },
        {
            name: '紫瓶',
            buildTime: 21,
            productNumber: 3,
            formulaList: [{ name: '铁轨', num: 30 }, { name: '电炉', num: 1 }, { name: '产能插件1', num: 1}],
        },
        {
            name: '硫酸',
            buildTime: 1,
            productNumber: 50,
            formulaList: [{ name: '铁板', num: 1 }, { name: '硫磺', num: 5 }, { name: '水', num: 100}],
        },
        {
            name: '处理器',
            buildTime: 10,
            productNumber: 1,
            formulaList: [{ name: '电路板', num: 20 }, { name: '集成电路', num: 2 }, { name: '硫酸', num: 5}],
        },
        {
            name: '重油',
            buildTime: 1,
            productNumber: 1,
            formulaList: [],
        },
        {
            name: '润滑油',
            buildTime: 1,
            productNumber: 10,
            formulaList: [{name: '重油', num: 10}],
        },
        {
            name: '电动机',
            buildTime: 10,
            productNumber: 1,
            formulaList: [{name: '电路板', num: 2}, {name: '内燃机', num: 1}, {name: '润滑油', num: 15}],
        },
        {
            name: '电池',
            buildTime: 4,
            productNumber: 1,
            formulaList: [{name: '铁板', num: 1}, {name: '铜板', num: 1}, {name: '硫酸', num: 20}],
        },
        {
            name: '机器人构架',
            buildTime: 20,
            productNumber: 1,
            formulaList: [{name: '钢材', num: 1}, {name: '电池', num: 2}, {name: '电路板', num: 3}, {name: '电动机', num: 1}],
        },
        {
            name: '轻质框架',
            buildTime: 20,
            productNumber: 1,
            formulaList: [{name: '铜板', num: 20}, {name: '钢材', num: 2}, {name: '塑料', num: 5}],
        },
        {
            name: '黄瓶',
            buildTime: 21,
            productNumber: 3,
            formulaList: [{name: '处理器', num: 2}, {name: '机器人构架', num: 1}, {name: '轻质框架', num: 3}],
        },
    ],
};

export default c;