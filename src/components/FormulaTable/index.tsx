import Formula from '@/factorio/Formula';
import React from 'react';
import { Table } from 'antd';
import { useItemSelectArea } from '../ItemSelectArea/index';
import ManagerTool from '@/factorio/ManagerTool';
import { useState } from 'react';
import { PlusOutlined, MinusOutlined} from '@ant-design/icons';

interface FormulaTableProps {
    dataSource: FormulaRowData[];
    changeSpeed: (name: string, dir: boolean)=>void;
    changeFacNum: (name: string, dir: boolean)=>void;
}

interface FormulaRowData {
    name: string;
    num: number;
    buildTime: number;
    productNum: number;
    speed: number;
    facNum: number;
    time: number;
}

export const useCalFormula = () => {
    const {data, ...areaOther} = useItemSelectArea();
    const [ formulaResult, setFormulaResult ] = useState<FormulaRowData[]>([]);
    const manager = ManagerTool.getInstance();
    const reCalRow = (data: FormulaRowData) => {
        let everySingleTime :number = data.buildTime * 10 / data.productNum / data.speed;
        let allTime : number = data.num * everySingleTime;
        let t : number = allTime / data.facNum;
        data.time = t;
    };
    const cal = () => {
        let fl : {name: string, num: number}[] = [];
        for(let name in data){
            fl.push({ name, num: data[name]});
        }
        let result : Formula[] = manager.expandFormulaList(fl);
        let rowData : FormulaRowData[] = [];
        result.forEach(f=>{
            let temp = {
                name: f.item.name,
                num: f.number,
                buildTime: f.item.buildTime,
                productNum: f.item.productNumber,
                speed: 10,
                facNum: 1,
                time: 1,
            };
            reCalRow(temp);
            rowData.push(temp);
        });
        setFormulaResult(rowData);
    };
    const clear = () => {
        setFormulaResult([]);
    };
    const changeSpeed = (name: string, dir: boolean) => {
        formulaResult.forEach(row => {
            if(row.name == name){
                if(dir){
                    row.speed = row.speed + 1;
                }else if(row.speed > 1){
                    row.speed = row.speed - 1;
                }
                reCalRow(row);
                setFormulaResult([...formulaResult]);
            }
        });
    };
    const changeFacNum = (name: string, dir: boolean) => {
        formulaResult.forEach(row => {
            if(row.name == name){
                if(dir){
                    row.facNum = row.facNum + 1;
                }else if(row.facNum > 1){
                    row.facNum = row.facNum - 1;
                }
                reCalRow(row);
                setFormulaResult([...formulaResult]);
            }
        });
    };
    return {
        data,
        ...areaOther,
        cal,
        formulaResult,
        clear,
        changeSpeed, 
        changeFacNum,
    }
}

const FormulaTable: React.FC<FormulaTableProps> = props => {
    const { dataSource, changeFacNum, changeSpeed } = props;

    const speedRender = (text: any, record: FormulaRowData) => {
        return <span>
            {(parseInt(text)/10).toFixed(1)}
            <PlusOutlined onClick={()=>changeSpeed(record.name, true)}/>
            <MinusOutlined onClick={()=>changeSpeed(record.name, false)}/>
        </span>
    };

    const facNumRender = (text: any, record: FormulaRowData) => {
        return <span>
            {text}
            <PlusOutlined onClick={()=>changeFacNum(record.name, true)}/>
            <MinusOutlined onClick={()=>changeFacNum(record.name, false)}/>
        </span>

    };
    return <Table<FormulaRowData> dataSource={dataSource} rowKey={'name'} size={'small'} scroll={{y: 500}} pagination={{ pageSize: 50 }}>
        <Table.Column<FormulaRowData> dataIndex={'name'} title={'名称'}/>
        <Table.Column<FormulaRowData> dataIndex={'num'} title={'数量'}/>
        <Table.Column<FormulaRowData> dataIndex={'speed'} title={'速度'} render={speedRender}/>
        <Table.Column<FormulaRowData> dataIndex={'facNum'} title={'工厂数量'} render={facNumRender}/>
        <Table.Column<FormulaRowData> dataIndex={'time'} title={'时间'} render={text => parseFloat(text).toFixed(1)}/>
    </Table>;
};

export default FormulaTable;
