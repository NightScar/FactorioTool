import Item from '@/factorio/Item';
import ManagerTool from '@/factorio/ManagerTool';
import { ProductProcess } from '@/factorio/ProductProcess';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import { InputNumber, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, useMemo } from 'react';
import FactorySelect from '.';

export interface ProductProcessSelectProps {
    process: ProductProcess;
}

const ProductProcessSelect: React.FC<ProductProcessSelectProps> = (props) => {
    const { process } = props;
    const tools = useMemo(() => {
        return ManagerTool.getInstance();
    }, []);
    const itemSelectOptions = useMemo(() => {
        let itemList: Item[] = tools.getItemArray();
        let ret: { value: string; label: ReactElement }[] = [];
        itemList.forEach((it) => {
            ret.push({
                value: it.name,
                label: (
                    <div style={{ display: 'flex' }}>
                        <ItemIcon
                            x={it.iconPosition[0]}
                            y={it.iconPosition[1]}
                        />
                        {it.name}
                    </div>
                ),
            });
        });
        return ret;
    }, []);
    const itemChange = (itemName: string) => {
        let i: Item = tools.items[itemName];
        process.factoryInstance.item = i;
    };
    const numChange = (value: number | null) => {
        if (value) {
            process.factoryNum = value;
        }
    };
    return (
        <div style={{ display: 'flex' }}>
            <Select
                style={{ width: '180px' }}
                defaultValue={itemSelectOptions[0].value}
                options={itemSelectOptions}
                onChange={itemChange}
                value={process.factoryInstance.item.name}
            />
            <FactorySelect instance={process.factoryInstance} />
            <InputNumber
                onChange={numChange}
                value={process.factoryNum}
                size="middle"
            />
        </div>
    );
};

export default observer(ProductProcessSelect);
