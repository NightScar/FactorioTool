import React from 'react';
import { List } from 'antd';
import ManagerTool from '@/factorio/ManagerTool';
import ItemProductAnalysisListRow, {
    ItemProductAnalysisListRowProps,
} from './ItemProductAnalysisListRow';

export interface ItemProductAnalysisListProps {}

const ItemProductAnalysisList: React.FC<ItemProductAnalysisListProps> = props => {
    const manager = ManagerTool.getInstance();
    const dataSource: ItemProductAnalysisListRowProps[] = [
        { item: manager.items['红瓶'] },
        { item: manager.items['绿瓶'] },
    ];

    const renderItem = (itemProps: ItemProductAnalysisListRowProps) => {
        return <ItemProductAnalysisListRow {...itemProps} />;
    };

    return (
        <List
            header={'产量分析'}
            dataSource={dataSource}
            renderItem={renderItem}
            bordered
        ></List>
    );
};

export default ItemProductAnalysisList;
