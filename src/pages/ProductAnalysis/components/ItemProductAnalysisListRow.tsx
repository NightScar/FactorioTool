import Item from '@/factorio/Item';
import React, { useState } from 'react';
import { List, Descriptions, Row, Col, Button } from 'antd';
import ItemIcon from './ItemIcon';
import Formula from '@/factorio/Formula';
import { FactoryWithPlugin } from '@/factorio/Factory';
import { PlusOutlined } from '@ant-design/icons';
import FactorySelect, { useFactorySelect } from '@/components/FactorySelect';
import { FactorySelectInstance } from '../../../components/FactorySelect/index';
import FactoryPlugin from '../../../factorio/Plugin';

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

    const [factoryList, setFactoryList] = useState<
        { factory: FactorySelectInstance; num: number }[]
    >([{factory: useFactorySelect(), num: 1}]);

    const factorySelectItemRender: (
        factoryInstace: FactorySelectInstance,
        index: number,
    ) => React.ReactElement = (
        factoryInstace: FactorySelectInstance,
        index: number,
    ) => {
        let pList : FactoryPlugin[] = [];
        factoryInstace.data.p.forEach(o=>{
            for(let i=0; i<o.num; i++){
                pList.push(o.plugin);
            }
        });
        const result = factoryInstace.data.f.analysisProduct(item, pList);
        return (
            <List.Item
                key={
                    factoryInstace.data.f.name +
                    factoryInstace.data.p.length +
                    index 
                }
            >
                <FactorySelect instance={factoryInstace} onChange={()=>{}}/>
                <div style={{display: 'inline-block', width: '100px'}}>
                    速度：{result.finalSpeed.toFixed(3)}
                    每秒产量：{result.productPerSec[0].number.toFixed(2)}
                </div>
            </List.Item>
        );
    };

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
                {factoryList.map((o,index) => { return factorySelectItemRender(o.factory, index)})}
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
