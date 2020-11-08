import { format } from 'prettier';
import React from 'react';
import { Bullet } from '@ant-design/charts';

export default function ItemProductBullet() {
    const config = {
        data: [
            {
                title: '满意度',
                ranges: [40, 70, 100],
                measures: [30, 50],
                target: 85,
            },
            {
                title: '满意度2',
                ranges: [20, 30, 100],
                measures: [60, 20],
                target: 89,
            },
        ],
        measureField: 'measures',
        rangeField: 'ranges',
        targetField: 'target',
    };

    return (
        <div style={{ height: '400px' }}>
            <Bullet {...config} />
        </div>
    );
}
