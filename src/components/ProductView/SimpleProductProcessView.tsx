import { ProductProcess } from '@/factorio/ProductProcess';
import { observer } from 'mobx-react-lite';
import React from 'react';

export interface SimpleProductProcessViewProps {
    process: ProductProcess;
}

const SimpleProductProcessView: React.FC<SimpleProductProcessViewProps> = (
    props,
) => {
    const { process } = props;
    return (
        <div>
            {process.productPerSec.map((f) => (
                <div style={{ display: 'flex' }}>
                    {f.item.name}: {f.number}
                </div>
            ))}
            {process.costPerSec.map((f) => (
                <div style={{ display: 'flex' }}>
                    {f.item.name}: {f.number}
                </div>
            ))}
        </div>
    );
};

export default observer(SimpleProductProcessView);
