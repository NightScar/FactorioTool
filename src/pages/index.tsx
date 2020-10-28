import React from 'react';
import styles from './index.less';
import ManagerTool from '../factorio/ManagerTool';
import { Card, Button, Row, Col } from 'antd';
import ItemSelectArea from '@/components/ItemSelectArea';
import ItemOperateTable from '@/components/ItemOperateTable';
import { useItemSelectArea } from '../components/ItemSelectArea/index';
import {
    ItemTableRowDataBuilder,
    ItemTableRowData,
} from '../components/ItemOperateTable/index';
import FormulaTable, { useCalFormula } from '@/components/FormulaTable';

export default () => {
    const manager = ManagerTool.getInstance();
    const { add, cal, clear, formulaResult,...p } = useCalFormula();
    let dataSource = ItemTableRowDataBuilder.buildFromItemArray(
        manager.getItemArray(),
    );
    let optRender = (text: any, record: ItemTableRowData, index: number) => {
        return (
            <>
                <Button onClick={() => add(record.name)}>添加</Button>
            </>
        );
    };
    return (
        <div>
            <Card>
                <Row>
                    <Col span={12}>
                        <ItemSelectArea add={add} {...p} title="生产列表" />
                    </Col>
                    <Col span={12}>
                      <Button onClick={()=>cal() } type={'primary'} style={{marginRight: '24px'}}>计算</Button>
                      <Button onClick={()=>clear()} type={'primary'}>清空结果</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <ItemOperateTable
                            dataSource={dataSource}
                            optRender={optRender}
                        />
                    </Col>
                    <Col span={12}>
                        <FormulaTable dataSource={formulaResult} {...p}/>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};
