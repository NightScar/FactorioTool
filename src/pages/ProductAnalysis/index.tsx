import React from 'react';
import { Card, Col, Row, Button } from 'antd';
import ItemSelectArea from '../../components/ItemSelectArea/index';
import { ItemTableRowData, ItemTableRowDataBuilder } from '@/components/ItemOperateTable';
import ManagerTool from '@/factorio/ManagerTool';

interface ProductAnalysisProps {}

const ProductAnalysis: React.FC<ProductAnalysisProps> = props => {
    const manager = ManagerTool.getInstance();
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
    return <Card>
        <Row>
            <Col span={6}>
                <ItemSelectArea add={add} {...p} title="生产列表" />
            </Col>
            <Col span={18}>
                <Button
                    onClick={() => cal()}
                    type={'primary'}
                    style={{ marginRight: '24px' }}
                >
                    计算
                </Button>
                <Button onClick={() => clear()} type={'primary'}>
                    清空结果
                </Button>
            </Col>
        </Row>
        <Row>
            <Col span={6}>
                <ItemOperateTable
                    dataSource={dataSource}
                    optRender={optRender}
                />
            </Col>
            <Col span={18}>
                <FormulaTable dataSource={formulaResult} {...p} />
            </Col>
        </Row>
    </Card>;
};

export default ProductAnalysis;
