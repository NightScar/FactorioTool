import React from 'react';
import {
    FactoryGroupInstance,
    FactoryGroupInstanceState,
    factoryGroupStatlessBuilder,
    useFactoryGroupStatless,
} from './FactoryGroupUI';
import { List, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Item from '@/factorio/Item';
import { useState } from 'react';
import FactoryGroupUI from './FactoryGroupUI';
import Formula from '@/factorio/Formula';
import { Bar } from '@ant-design/charts';
import { FactoryGroup } from '../../factorio/Factory';

export interface FactoryGroupHolderState {
    factoryGroup: { [index: number]: FactoryGroupInstanceState };
    productPerSec: number;
    costPerSec: Formula[];
}
export interface FactoryGroupHolderInstance {
    data: FactoryGroupHolderState;
    addGroup: () => void;
    getGroupInstance: (index: number) => FactoryGroupInstance;
}

interface FactoryGroupHolderUIProps {
    item: Item;
    instance?: FactoryGroupHolderInstance;
}

const reCal = (factoryGroup: {
    [index: number]: FactoryGroupInstanceState;
}) => {
    let productPerSec = 0;
    let formulaList: Formula[] = [];
    for (let i in factoryGroup) {
        productPerSec = productPerSec + factoryGroup[i].productPerSec;
        Formula.mergeList(formulaList, factoryGroup[i].costPerSec);
    }
    return {
        productPerSec,
        costPerSec: formulaList,
    };
};

export const useFactoryGroupHolder: (
    item: Item,
) => FactoryGroupHolderInstance = item => {
    let tempGroupState = factoryGroupStatlessBuilder(item);
    const [state, setState] = useState<FactoryGroupHolderState>({
        factoryGroup: {
            0: tempGroupState,
        },
        productPerSec: tempGroupState.productPerSec,
        costPerSec: tempGroupState.costPerSec,
    });

    const addGroup: () => void = () => {
        let i: number = 0;
        while (state.factoryGroup[i]) {
            i++;
        }
        let factoryGroup = { ...state.factoryGroup };
        factoryGroup[i] = factoryGroupStatlessBuilder(item);
        setState({ ...state, factoryGroup, ...reCal(factoryGroup) });
    };

    const getGroupInstance = (index: number) => {
        return useFactoryGroupStatless(state.factoryGroup[index], c => {
            state.factoryGroup[index] = { ...state.factoryGroup[index], ...c };
            setState({
                ...state,
                factoryGroup: { ...state.factoryGroup },
            });
        });
    };

    return {
        data: state,
        addGroup,
        getGroupInstance,
    };
};

export const factoryGroupHolderStatelessBuilder: (
    item: Item,
) => FactoryGroupHolderState = item => {
    let tempGroupState = factoryGroupStatlessBuilder(item);
    return {
        factoryGroup: {
            0: tempGroupState,
        },
        productPerSec: tempGroupState.productPerSec,
        costPerSec: tempGroupState.costPerSec,
    };
};

export const useFactoryGroupHolderStateless: (
    state: FactoryGroupHolderState,
    stateOnChange: (c: object) => void,
) => FactoryGroupHolderInstance = (state, stateOnChange) => {
    const addGroup: () => void = () => {
        let i: number = 0;
        while (state.factoryGroup[i]) {
            i++;
        }
        let factoryGroup: {
            [index: number]: FactoryGroupInstanceState;
        } = { ...state.factoryGroup };
        factoryGroup[i] = factoryGroupStatlessBuilder(
            state.factoryGroup[0].factoryWithPlugin.item,
        );
        stateOnChange({ factoryGroup, ...reCal(factoryGroup) });
    };

    const getGroupInstance = (index: number) => {
        return useFactoryGroupStatless(state.factoryGroup[index], c => {
            state.factoryGroup[index] = { ...state.factoryGroup[index], ...c };
            stateOnChange({
                factoryGroup: { ...state.factoryGroup },
                ...reCal(state.factoryGroup),
            });
        });
    };

    return {
        data: state,
        addGroup,
        getGroupInstance,
    };
};

const FactoryGroupHolderUI: React.FC<FactoryGroupHolderUIProps> = props => {
    const { item, instance = useFactoryGroupHolder(item) } = props;

    const factorySelectItemRender: (
        factoryGroup: FactoryGroupInstanceState,
        index: number,
    ) => React.ReactElement = (
        factoryGroup: FactoryGroupInstanceState,
        index: number,
    ) => {
        return (
            <List.Item
                key={factoryGroup.factoryWithPlugin.factory.name + index}
            >
                <FactoryGroupUI
                    instance={instance.getGroupInstance(index)}
                    item={item}
                />
            </List.Item>
        );
    };
    const groupHolderRender = () => {
        let ret = [];
        for (let i in instance.data.factoryGroup) {
            ret.push(
                factorySelectItemRender(
                    instance.data.factoryGroup[i],
                    parseInt(i),
                ),
            );
        }
        return ret;
    };
    const footerRender = () => {
        let data: { product: number; item: string; type: string }[] = [];
        for (let i in instance.data.factoryGroup) {
            data.push({
                product: instance.data.factoryGroup[i].productPerSec,
                item: instance.data.factoryGroup[i].factoryWithPlugin.item.name,
                type: i.toString(),
            });
            instance.data.factoryGroup[i].costPerSec.forEach(f => {
                data.push({
                    product: f.number,
                    item: f.item.name,
                    type: i.toString(),
                });
            });
        }
        console.log(data);
        let config = {
            data: data,
            xField: 'product',
            yField: 'item',
            height: 300,
            authFit: false,
            isStack: true,
            seriesField: 'type',
        };
        return (
            <div style={{ width: '1000px', height: '120px' }}>
                <Bar {...config} />
            </div>
        );
    };
    return (
        <>
            <List
                bordered
                header={
                    <Button
                        type={'dashed'}
                        style={{ width: '100%' }}
                        onClick={instance.addGroup}
                    >
                        <PlusOutlined />
                    </Button>
                }
            >
                {groupHolderRender()}
            </List>
            {footerRender()}
        </>
    );
};

export default FactoryGroupHolderUI;
