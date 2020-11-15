import React from 'react';
import { List, Row, Col } from 'antd';
import { ProAnaInstance } from '@/factorio/ProductAnalysis';
import FactoryGroupHolderUI, {
    FactoryGroupHolderState,
} from '@/components/FactorySelect/FactoryGroupHolderUI';
import Item from '@/factorio/Item';
import ItemIcon from './ItemIcon';
import AnaBar from './AnaBar';

export interface ItemProductAnalysisListProps {
    proAna: ProAnaInstance;
}

const ItemProductAnalysisList: React.FC<ItemProductAnalysisListProps> = props => {
    const { proAna } = props;

    const dataSource: () => FactoryGroupHolderState[] = () => {
        let ret: FactoryGroupHolderState[] = [];
        for (let p in proAna.data) {
            ret.push(proAna.data[p].groupHolder);
        }
        return ret;
    };

    const renderItem = (itemProps: FactoryGroupHolderState) => {
        let item: Item = itemProps.factoryGroupHolder[0].factoryWithPlugin.item;
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
                        <FactoryGroupHolderUI
                            item={item}
                            freshHandle={proAna.groupHolderOnChange}
                        />
                        <AnaBar
                            productOffer={itemProps}
                            productRequire={proAna.getRequire(item)}
                        />
                    </Col>
                </Row>
            </List.Item>
        );
    };

    return (
        <List
            header={'产量分析'}
            dataSource={dataSource()}
            renderItem={renderItem}
            bordered
        ></List>
    );
};

export default ItemProductAnalysisList;
