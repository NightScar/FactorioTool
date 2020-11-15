import React, { Reducer, useReducer } from 'react';
import {
    FactoryGroupInstanceState,
    factoryGroupStatelessBuilder,
} from './FactoryGroupUI';
import { List, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Item from '@/factorio/Item';
import FactoryGroupUI from './FactoryGroupUI';
import Formula from '@/factorio/Formula';
import { Bar } from '@ant-design/charts';
import { renderFormulaList } from './FactoryGroupUI';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import { useEffect } from 'react';

export interface FactoryGroupHolderState {
    factoryGroupHolder: { [index: number]: FactoryGroupInstanceState };
    holderProductPerSec: number;
    holderCostPerSec: Formula[];
}
export interface FactoryGroupHolderInstance {
    data: FactoryGroupHolderState;
    addGroup: () => void;
    groupStateChangeHandle: (
        groupState: FactoryGroupInstanceState,
        index: number,
    ) => void;
}

const reCal = (factoryGroupHolder: {
    [index: number]: FactoryGroupInstanceState;
}) => {
    let productPerSec = 0;
    let formulaList: Formula[] = [];
    for (let i in factoryGroupHolder) {
        productPerSec =
            productPerSec + factoryGroupHolder[i].groupProductPerSec;
        Formula.mergeList(formulaList, factoryGroupHolder[i].groupCostPerSec);
    }
    return {
        holderProductPerSec: productPerSec,
        holderCostPerSec: formulaList,
    };
};

const reducer: Reducer<
    FactoryGroupHolderState,
    { type: 'addGroup' | 'changeGroupState'; payload: any[] }
> = (state, action) => {
    switch (action.type) {
        case 'addGroup':
            let [item] = action.payload;
            let i: number = 0;
            while (state.factoryGroupHolder[i]) {
                i++;
            }
            let newFactoryGroupHolder = { ...state.factoryGroupHolder };
            newFactoryGroupHolder[i] = factoryGroupStatelessBuilder(item);
            return {
                ...state,
                factoryGroupHolder: newFactoryGroupHolder,
                ...reCal(newFactoryGroupHolder),
            };
        case 'changeGroupState':
            const [groupState, index] = action.payload;
            state.factoryGroupHolder[index] = groupState;
            return {
                ...state,
                factoryGroupHolder: {
                    ...state.factoryGroupHolder,
                },
                ...reCal(state.factoryGroupHolder),
            };
        default:
            throw new Error();
    }
};

export const useFactoryGroupHolder: (
    item: Item,
) => FactoryGroupHolderInstance = item => {
    const [state, dispatch] = useReducer<
        Reducer<
            FactoryGroupHolderState,
            { type: 'addGroup' | 'changeGroupState'; payload: any[] }
        >,
        {}
    >(reducer, {}, () => {
        return factoryGroupHolderStatelessBuilder(item);
    });

    const addGroup: () => void = () => {
        dispatch({ type: 'addGroup', payload: [item] });
    };

    const groupStateChangeHandle: (
        groupState: FactoryGroupInstanceState,
        index: number,
    ) => void = (groupState, index) => {
        dispatch({ type: 'changeGroupState', payload: [groupState, index] });
    };

    return {
        data: state,
        addGroup,
        groupStateChangeHandle,
    };
};

export const factoryGroupHolderStatelessBuilder: (
    item: Item,
) => FactoryGroupHolderState = item => {
    let tempGroupState = factoryGroupStatelessBuilder(item);
    return {
        factoryGroupHolder: {
            0: tempGroupState,
        },
        holderProductPerSec: tempGroupState.groupProductPerSec,
        holderCostPerSec: tempGroupState.groupCostPerSec,
    };
};

interface FactoryGroupHolderUIProps {
    item: Item;
    instance?: FactoryGroupHolderInstance;
    freshHandle?: (state: FactoryGroupHolderState) => void;
}

const FactoryGroupHolderUI: React.ForwardRefRenderFunction<
    FactoryGroupHolderState,
    FactoryGroupHolderUIProps
> = (props, ref) => {
    const {
        item,
        instance = useFactoryGroupHolder(item),
        freshHandle = () => {},
    } = props;
    useImperativeHandle(
        ref,
        () => {
            // console.log('--useImperativeHandle');
            return { ...instance.data };
        },
        [instance.data],
    );
    useEffect(() => {
        freshHandle(instance.data);
    }, [instance.data]);

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
                    item={item}
                    freshHandle={groupState => {
                        instance.groupStateChangeHandle(groupState, index);
                    }}
                />
            </List.Item>
        );
    };
    const groupHolderRender = () => {
        let ret = [];
        for (let i in instance.data.factoryGroupHolder) {
            ret.push(
                factorySelectItemRender(
                    instance.data.factoryGroupHolder[i],
                    parseInt(i),
                ),
            );
        }
        return ret;
    };
    const footerRender = () => {
        let data: { product: number; item: string; type: string }[] = [];
        for (let i in instance.data.factoryGroupHolder) {
            data.push({
                product: instance.data.factoryGroupHolder[i].groupProductPerSec,
                item:
                    instance.data.factoryGroupHolder[i].factoryWithPlugin.item
                        .name,
                type: i.toString(),
            });
            instance.data.factoryGroupHolder[i].groupCostPerSec.forEach(f => {
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
            isGroup: true,
            seriesField: 'type',
            label: {
                style: {
                    fill: 'red',
                },
            },
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
                    <>
                        <Button
                            type={'dashed'}
                            style={{ width: '50%' }}
                            onClick={instance.addGroup}
                        >
                            <PlusOutlined />
                        </Button>
                        <div
                            style={{
                                display: 'inline-block',
                                marginLeft: '32px',
                            }}
                        >
                            <span style={{ marginRight: '32px' }}>
                                总产量：
                                {instance.data.holderProductPerSec.toFixed(2)}
                            </span>{' '}
                            <span style={{ marginRight: '32px' }}>
                                总需求：
                                {renderFormulaList(
                                    instance.data.holderCostPerSec,
                                )}
                            </span>{' '}
                        </div>
                    </>
                }
            >
                {groupHolderRender()}
            </List>
            {footerRender()}
        </>
    );
};

export default forwardRef(FactoryGroupHolderUI);
