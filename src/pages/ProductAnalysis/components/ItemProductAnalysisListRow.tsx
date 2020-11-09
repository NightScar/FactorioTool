import Item from '@/factorio/Item';
import React, { useState } from 'react';
import { List, Descriptions, Row, Col, Button } from 'antd';
import ItemIcon from './ItemIcon';
import Formula from '@/factorio/Formula';
import { FactoryWithPlugin } from '@/factorio/Factory';
import { PlusOutlined } from '@ant-design/icons';
import FactorySelect from '@/components/FactorySelect';

export interface ItemProductAnalysisListRowProps {
    item: Item;
}

const ItemProductAnalysisListRow: React.FC<ItemProductAnalysisListRowProps> = props => {
    const { item } = props;
    const renderFormulaList: (
        formulaList: Formula[],
    ) => React.ReactElement[] = formulaList => {
        const ret: React.ReactElement[] = [];
        formulaList.forEach(f => {
            ret.push(
                <span key={f.item.name}>
                    <ItemIcon
                        x={f.item.iconPosition[0]}
                        y={f.item.iconPosition[1]}
                    />
                    {f.number}
                </span>,
            );
        });
        return ret;
    };

    const [factoryState, setFactoryState] = useState<{
        [itemName: string]: FactoryWithPlugin;
    }>({});
    const factorySelectRender: (item: Item) => React.ReactElement = item => {
        return (
            <List
                bordered
                header={
                    <Button type={'dashed'} style={{ width: '100%' }}>
                        <PlusOutlined />
                    </Button>
                }
            >
                <List.Item>
                    <FactorySelect
                        onChange={o => {
                            console.log(o);
                        }}
                    />
                </List.Item>
            </List>
        );
    };

    return (
        <List.Item>
            <Row gutter={12} style={{ width: '100%' }}>
                <Col span={4}>
                    <List.Item.Meta
                        avatar={
                            <ItemIcon
                                x={item.iconPosition[0]}
                                y={item.iconPosition[1]}
                            />
                        }
                        title={item.name}
                    />
                </Col>
                <Col span={20}>
                    <Descriptions column={4} bordered size={'small'}>
                        <Descriptions.Item label={'生产时间：'}>
                            {item.buildTime + 's'}
                        </Descriptions.Item>
                        <Descriptions.Item label={'产量：'}>
                            {item.productNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label={'配方：'} span={2}>
                            {renderFormulaList(item.formulaList)}
                        </Descriptions.Item>
                        <Descriptions.Item label={'生产工厂：'} span={4}>
                            {factorySelectRender(item)}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </List.Item>
    );
};

export default ItemProductAnalysisListRow;
