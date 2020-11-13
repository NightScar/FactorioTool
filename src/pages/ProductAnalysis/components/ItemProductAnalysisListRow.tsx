import React from 'react';
import { List, Descriptions, Row, Col, Button } from 'antd';
import ItemIcon from './ItemIcon';
import Formula from '@/factorio/Formula';
import {
    FactoryGroup,
    FactoryGroupHolder,
} from '@/factorio/Factory';
import { PlusOutlined } from '@ant-design/icons';
import FactoryWithPluginUI from '../../../components/FactorySelect/FactoryWithPluginUI';

export interface ItemProductAnalysisListRowProps {
    groupHolder: FactoryGroupHolder;
}

const ItemProductAnalysisListRow: React.FC<ItemProductAnalysisListRowProps> = props => {
    const { groupHolder } = props;
    const item = groupHolder.item;
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

    const factorySelectItemRender: (
        factoryGroup: FactoryGroup,
        index: number,
    ) => React.ReactElement = (factoryGroup: FactoryGroup, index: number) => {
        return (
            <List.Item
                key={factoryGroup.factoryWithPlugin.factory.name + index}
            >
                <FactoryWithPluginUI instance={factoryGroup.factoryWithPlugin} item={factoryGroup.factoryWithPlugin.item}/>
                <div style={{ display: 'inline-block', width: '100px' }}>
                    速度：{factoryGroup.factoryWithPlugin.finalSpeed.toFixed(3)}
                    每秒产量：{factoryGroup.factoryWithPlugin.productPerSec.toFixed(2)}
                </div>
            </List.Item>
        );
    };

    const factoryGroupHolderRender: (
        holder: FactoryGroupHolder,
    ) => React.ReactElement = holder => {
        return (
            <List
                bordered
                header={
                    <Button type={'dashed'} style={{ width: '100%' }}>
                        <PlusOutlined />
                    </Button>
                }
            >
                {holder.groups.map((o, index) => {
                    return factorySelectItemRender(o, index);
                })}
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
                            {factoryGroupHolderRender(groupHolder)}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </List.Item>
    );
};

export default ItemProductAnalysisListRow;
