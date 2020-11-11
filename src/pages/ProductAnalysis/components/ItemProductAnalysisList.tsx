import React from 'react';
import { List } from 'antd';
import ManagerTool from '@/factorio/ManagerTool';
import ItemProductAnalysisListRow, {
    ItemProductAnalysisListRowProps,
} from './ItemProductAnalysisListRow';
import { ProAnaInstance } from '@/factorio/ProductAnalysis';
import { FactoryGroupHolder } from '@/factorio/Factory';

export interface ItemProductAnalysisListProps {
    proAna: ProAnaInstance;
}

const ItemProductAnalysisList: React.FC<ItemProductAnalysisListProps> = props => {
    const { proAna } = props;

    const dataSource: () => FactoryGroupHolder[] = () => {
        let ret: FactoryGroupHolder[] = [];
        for (let p in proAna.data) {
            ret.push(proAna.data[p].groupHolder);
        }
        return ret;
    };

    const renderItem = (itemProps: FactoryGroupHolder) => {
        return <ItemProductAnalysisListRow groupHolder={itemProps} />;
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
