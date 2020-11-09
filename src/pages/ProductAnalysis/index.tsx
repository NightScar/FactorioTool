import React from 'react';
import { Card, Col, Row, Button } from 'antd';
import ItemSelectArea from '../../components/ItemSelectArea/index';
import ItemOperateTable, {
    ItemTableRowData,
    ItemTableRowDataBuilder,
} from '@/components/ItemOperateTable';
import ManagerTool from '@/factorio/ManagerTool';
import ItemProductBullet from './components/ItemProductBullet';
import ItemIcon from './components/ItemIcon';
import ItemProductAnalysisList from './components/ItemProductAnalysisList';

interface ProductAnalysisProps {}

const ProductAnalysis: React.FC<ProductAnalysisProps> = props => {
    const manager = ManagerTool.getInstance();
    let dataSource = ItemTableRowDataBuilder.buildFromItemArray(
        manager.getItemArray(),
    );
    const selectItemAddHandler = (itemName: string) => {};
    let optRender = (text: any, record: ItemTableRowData, index: number) => {
        return (
            <>
                <Button onClick={() => selectItemAddHandler(record.name)}>
                    添加
                </Button>
            </>
        );
    };
    return (
        <Card>
            <Row>
                <Col span={6}>
                    {/* <ItemSelectArea add={add} {...p} title="生产列表" /> */}
                </Col>
                <Col span={18}>
                    <ItemIcon x={4} y={1} />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={6}>
                    <ItemIcon x={8} y={3} />
                    <ItemOperateTable
                        dataSource={dataSource}
                        optRender={optRender}
                    />
                </Col>
                <Col span={18}>
                    <ItemProductAnalysisList />
                    {/* <FormulaTable dataSource={formulaResult} {...p} /> */}
                </Col>
            </Row>
        </Card>
    );
};

export default ProductAnalysis;
