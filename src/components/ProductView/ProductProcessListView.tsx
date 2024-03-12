import { ProductProcessList } from '@/factorio/ProductProcess';
import { Button, List } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ProductProcessSelect from '../FactorySelect/ProductProcessSelect';

export interface ProductProcessListViewProps {
    processList: ProductProcessList;
}

const ProductProcessListView: React.FC<ProductProcessListViewProps> = (
    props,
) => {
    const { processList } = props;
    const addProcess = () => {
        processList.addProcess();
    };
    return (
        <List
            header={
                <div>
                    Process List
                    <Button type="primary" onClick={addProcess}>
                        添加
                    </Button>
                </div>
            }
        >
            {processList.processList.map((p, index) => {
                return (
                    <List.Item key={index}>
                        <ProductProcessSelect process={p} />
                        <div>
                            {p.productPerMin.map((f) => (
                                <div style={{ display: 'flex' }}>
                                    {f.item.name}: {f.number}
                                </div>
                            ))}
                            {p.costPerMin.map((f) => (
                                <div style={{ display: 'flex' }}>
                                    {f.item.name}: {f.number}
                                </div>
                            ))}
                        </div>
                    </List.Item>
                );
            })}
        </List>
    );
};

export default observer(ProductProcessListView);
