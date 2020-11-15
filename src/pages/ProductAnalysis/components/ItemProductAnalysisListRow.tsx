import React, { MutableRefObject } from 'react';
import { List, Descriptions, Row, Col } from 'antd';
import ItemIcon from './ItemIcon';
import FactoryGroupHolderUI, {
    FactoryGroupHolderState,
} from '@/components/FactorySelect/FactoryGroupHolderUI';

export interface ItemProductAnalysisListRowProps {
    groupHolder: MutableRefObject<FactoryGroupHolderState>;
}

const ItemProductAnalysisListRow: React.FC<ItemProductAnalysisListRowProps> = props => {
    const { groupHolder } = props;
    const item =
        groupHolder.current.factoryGroupHolder[0].factoryWithPlugin.item;

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
                    <FactoryGroupHolderUI item={item} ref={groupHolder} />
                    {/* <Descriptions column={4} bordered size={'small'}>
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
                    </Descriptions> */}
                </Col>
            </Row>
        </List.Item>
    );
};

export default ItemProductAnalysisListRow;
