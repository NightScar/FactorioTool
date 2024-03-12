import { ProductLine, ProductProcessList } from '@/factorio/ProductProcess';
import { Button, Table } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

export interface ProductProcessResultViewProps {
    processList: ProductProcessList;
}

const ProductProcessResultView: React.FC<ProductProcessResultViewProps> = (
    props,
) => {
    const { processList } = props;
    const d: ProductLine[] = toJS(processList.allPerMin);
    return (
        <Table<ProductLine> dataSource={d} pagination={false}>
            <Table.Column
                title="Name"
                dataIndex={['item', 'name']}
                key="item"
            />
            <Table.Column title="总需求" dataIndex="cost" key="cost" />
            <Table.Column title="总产出" dataIndex="product" key="product" />
            <Table.Column<ProductLine>
                title="差值"
                key="diff"
                render={(_, record) => {
                    return record.product - record.cost;
                }}
            />

            <Table.Column<ProductLine>
                title="操作"
                key="opt"
                render={(_, record) => {
                    if (
                        record.product - record.cost < 0.0 &&
                        !record.item.isLeaf
                    ) {
                        return (
                            <Button
                                type="primary"
                                onClick={() => {
                                    processList.addProcessWithItem(record.item);
                                }}
                            >
                                添加
                            </Button>
                        );
                    }
                }}
            />
        </Table>
    );
};

export default observer(ProductProcessResultView);
