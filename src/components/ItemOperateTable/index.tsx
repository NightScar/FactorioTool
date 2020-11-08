import React from 'react';
import { Table } from 'antd';
import Item from '@/factorio/Item';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';

export interface ItemOperateTableProps {
    dataSource: ItemTableRowData[];
    optRender: (
        text: any,
        record: ItemTableRowData,
        index: number,
    ) => React.ReactElement;
}
export interface ItemTableRowData {
    name: string;
    buildTime: number;
    productNumber: number;
    iconPosition: number[];
}

export const ItemTableRowDataBuilder = {
    buildFromItemArray: (items: Item[]) => {
        let ret: ItemTableRowData[] = [];
        items.forEach(i => {
            ret.push({
                name: i.name,
                buildTime: i.buildTime,
                productNumber: i.productNumber,
                iconPosition: i.iconPosition,
            });
        });
        return ret;
    },
};

const ItemOperateTable: React.FC<ItemOperateTableProps> = props => {
    const { dataSource, optRender } = props;
    const nameRender = (text: any, record: ItemTableRowData) => {
        return (
            <span>
                <ItemIcon
                    x={record.iconPosition[0]}
                    y={record.iconPosition[1]}
                />
                {text}
            </span>
        );
    };

    return (
        <Table<ItemTableRowData>
            dataSource={dataSource}
            rowKey={'name'}
            size={'small'}
            scroll={{ y: 500 }}
            pagination={{ pageSize: 50 }}
        >
            <Table.Column
                key={'name'}
                dataIndex="name"
                title="名称"
                render={nameRender}
            />
            <Table.Column
                key={'buildTime'}
                dataIndex="buildTime"
                title="生产时间"
            />
            <Table.Column key={'operate'} title="操作" render={optRender} />
        </Table>
    );
};

export default ItemOperateTable;
