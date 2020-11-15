import React from 'react';
import { FactoryGroupHolderState } from '../../../components/FactorySelect/FactoryGroupHolderUI';
import { DualAxes } from '@ant-design/charts';
import Item from '@/factorio/Item';

interface AnaBarProps {
    productOffer: FactoryGroupHolderState;
    productRequire: FactoryGroupHolderState[];
}

const AnaBar: React.FC<AnaBarProps> = props => {
    const { productOffer, productRequire } = props;
    const item: Item =
        productOffer.factoryGroupHolder[0].factoryWithPlugin.item;
    const getDataSource = () => {
        let ret = [];
        for (let i in productOffer.factoryGroupHolder) {
            ret.push({
                item:
                    productOffer.factoryGroupHolder[i].factoryWithPlugin.item
                        .name,
                type:
                    productOffer.factoryGroupHolder[i].factoryNum +
                    '+' +
                    productOffer.factoryGroupHolder[i].factoryWithPlugin
                        .pluginList[0].pluginNum +
                    '+' +
                    productOffer.factoryGroupHolder[i].factoryWithPlugin
                        .pluginList[1].pluginNum,
                num: productOffer.factoryGroupHolder[i].groupProductPerSec,
            });
        }
        productRequire.forEach(holderState => {
            ret.push({
                item: item.name + '需求',
                type:
                    holderState.factoryGroupHolder[0].factoryWithPlugin.item
                        .name,
                num: holderState.holderCostPerSec.filter(
                    f => f.item.name == item.name,
                )[0].number,
            });
        });
        return ret.reverse();
    };
    const dataSource = getDataSource();
    const config = {
        data: [dataSource, dataSource],
        xField: 'num',
        yField: ['item', 'item'],
        height: 300,
        authFit: false,
        label: {
            style: {
                fill: 'red',
            },
        },
        geometryOptions: [
            {
                geometry: 'column',
                color: '#5B8FF9',
                isStack: true,
                seriesField: 'type',
            },
            {
                geometry: 'column',
                color: 'red',
                isStack: true,
                seriesField: 'type',
            },
        ],
    };
    return (
        <div style={{ width: '800px', height: '120px' }}>
            <DualAxes {...config} />
        </div>
    );
};

export default AnaBar;
