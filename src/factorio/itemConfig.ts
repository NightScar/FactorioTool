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
            productNumber: 1,
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
            formulaList: [{ name: '铁板', num: 1 }, { name: '铜线', num: 1 }],
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

    ],
};

export default c;