import Formula from '@/factorio/Formula';
import Item from '@/factorio/Item';
import ManagerTool from '@/factorio/ManagerTool';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import React, { useState } from 'react';
import FactorySelect from '../FactorySelect/index';

interface FormulaTableProps {
    dataSource: FormulaRowData[];
    changeSpeed: (
        name: string,
        f: string,
        p: { name: string; num: number }[],
    ) => void;
    changeFacNum: (name: string, dir: boolean) => void;
}

interface FormulaRowData {
    name: string;
    num: number;
    buildTime: number;
    productNum: number;
    speed: number;
    facNum: number;
    time: number;
    item: Item;
}

export const useCalFormula = () => {
    const data: any = {};
    const [formulaResult, setFormulaResult] = useState<FormulaRowData[]>([]);
    const manager = ManagerTool.getInstance();
    const reCalRow = (data: FormulaRowData) => {
        let everySingleTime: number =
            data.buildTime / data.productNum / data.speed;
        let allTime: number = data.num * everySingleTime;
        let t: number = allTime / data.facNum;
        data.time = t;
    };
    const cal = () => {
        let fl: { name: string; num: number }[] = [];
        for (let name in data) {
            fl.push({ name, num: data[name] });
        }
        let result: Formula[] = manager.expandFormulaList(fl);
        let rowData: FormulaRowData[] = [];
        result.forEach((f) => {
            let temp = {
                name: f.item.name,
                num: f.number,
                buildTime: f.item.buildTime,
                productNum: f.item.productNumber,
                speed: 1,
                facNum: 1,
                time: 1,
                item: f.item,
            };
            reCalRow(temp);
            rowData.push(temp);
        });
        setFormulaResult(rowData);
    };
    const clear = () => {
        setFormulaResult([]);
    };
    const changeSpeed = (
        name: string,
        f: string,
        p: { name: string; num: number }[],
    ) => {
        formulaResult.forEach((row) => {
            if (row.name == name) {
                let baseSpeed = 1;
                if (f != '0') {
                    baseSpeed = manager.factory[f].speed;
                }
                p.forEach((plugin) => {
                    baseSpeed =
                        baseSpeed +
                        manager.plugin[plugin.name].speedUp * plugin.num;
                    row.productNum =
                        row.productNum +
                        manager.plugin[plugin.name].productUp * plugin.num;
                });
                row.speed = baseSpeed;
                reCalRow(row);
                setFormulaResult([...formulaResult]);
            }
        });
    };
    const changeFacNum = (name: string, dir: boolean) => {
        formulaResult.forEach((row) => {
            if (row.name == name) {
                if (dir) {
                    row.facNum = row.facNum + 1;
                } else if (row.facNum > 1) {
                    row.facNum = row.facNum - 1;
                }
                reCalRow(row);
                setFormulaResult([...formulaResult]);
            }
        });
    };
    return {
        data,
        cal,
        formulaResult,
        clear,
        changeSpeed,
        changeFacNum,
    };
};

const FormulaTable: React.FC<FormulaTableProps> = (props) => {
    const { dataSource, changeFacNum, changeSpeed } = props;
    const factoryOnChange = (
        name: string,
        f: string,
        p: { name: string; num: number }[],
    ) => {
        console.log(f);
        changeSpeed(name, f, p);
    };

    const speedRender = (text: any, record: FormulaRowData) => {
        return (
            <span style={{ width: '100%' }}>
                {parseFloat(text).toFixed(2)}
                <FactorySelect
                    onChange={(f: string, p: { name: string; num: number }[]) =>
                        factoryOnChange(record.name, f, p)
                    }
                />
            </span>
        );
    };

    const facNumRender = (text: any, record: FormulaRowData) => {
        return (
            <span>
                {text}
                <PlusOutlined onClick={() => changeFacNum(record.name, true)} />
                <MinusOutlined
                    onClick={() => changeFacNum(record.name, false)}
                />
            </span>
        );
    };
    return (
        <Table<FormulaRowData>
            dataSource={dataSource}
            rowKey={'name'}
            size={'small'}
            scroll={{ y: 500 }}
            pagination={{ pageSize: 50 }}
        >
            <Table.Column<FormulaRowData> dataIndex={'name'} title={'名称'} />
            <Table.Column<FormulaRowData> dataIndex={'num'} title={'数量'} />
            <Table.Column<FormulaRowData>
                dataIndex={'speed'}
                title={'速度'}
                render={speedRender}
                width={400}
            />
            <Table.Column<FormulaRowData>
                dataIndex={'facNum'}
                title={'工厂数量'}
                render={facNumRender}
            />
            <Table.Column<FormulaRowData>
                dataIndex={'time'}
                title={'时间'}
                render={(text) => parseFloat(text).toFixed(1)}
            />
        </Table>
    );
};

export default FormulaTable;
