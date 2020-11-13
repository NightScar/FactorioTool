import Formula from '@/factorio/Formula';
import Item from '@/factorio/Item';
import React, { Reducer, useEffect, useReducer } from 'react';
import FactoryWithPluginUI, {
    FactoryWithPluginState,
} from './FactoryWithPluginUI';
import { InputNumber, Row, Col } from 'antd';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import { factoryWithPluginStatelessBuilder } from './FactoryWithPluginUI';

export interface FactoryGroupInstanceState {
    factoryWithPlugin: FactoryWithPluginState;
    factoryNum: number;
    groupProductPerSec: number;
    groupCostPerSec: Formula[];
}

export interface FactoryGroupInstance {
    data: FactoryGroupInstanceState;
    factoryNumOnChange: (factoryNum: number) => void;
    facWithPluFreshHandle: (facWithPluState: FactoryWithPluginState) => void;
}

const calCostList = (formulaList: Formula[], factoryNum: number) => {
    console.log('FactoryGroup reCalCostList()');
    console.log(formulaList);
    console.log(factoryNum);
    let list: Formula[] = [];
    formulaList.forEach(f => {
        list.push(new Formula(f.item, f.number * factoryNum));
    });
    return list;
};

const reducer: Reducer<
    FactoryGroupInstanceState,
    { type: 'changeFacWithPlu' | 'changeFacNum'; payload: any[] }
> = (state, action) => {
    switch (action.type) {
        case 'changeFacWithPlu':
            console.log('dispatch changeFacWithPlu');
            const [facWithPluState] = action.payload;
            return {
                ...state,
                factoryWithPlugin: facWithPluState,
                groupProductPerSec:
                    facWithPluState.singleFactoryProductPerSec *
                    state.factoryNum,
                groupCostPerSec: calCostList(
                    facWithPluState.singleFactoryCostPerSec,
                    state.factoryNum,
                ),
            };
        case 'changeFacNum':
            console.log('dispatch changeFacNum');
            const [factoryNum] = action.payload;
            return {
                ...state,
                factoryNum,
                groupProductPerSec:
                    state.factoryWithPlugin.singleFactoryProductPerSec *
                    factoryNum,
                groupCostPerSec: calCostList(
                    state.factoryWithPlugin.singleFactoryCostPerSec,
                    factoryNum,
                ),
            };
        default:
            throw new Error();
    }
};

export const useFactoryGroup: (
    item: Item,
    fresh?: () => void,
) => FactoryGroupInstance = item => {
    const [state, dispatch] = useReducer<
        Reducer<
            FactoryGroupInstanceState,
            { type: 'changeFacWithPlu' | 'changeFacNum'; payload: any[] }
        >,
        {}
    >(reducer, {}, () => {
        return factoryGroupStatelessBuilder(item);
    });

    const factoryNumOnChange = (factoryNum: number) => {
        console.log('FactoryGroup factoryNumOnChange()');
        dispatch({ type: 'changeFacNum', payload: [factoryNum] });
    };

    const facWithPluFreshHandle: (
        facWithPluState: FactoryWithPluginState,
    ) => void = facWithPluState => {
        dispatch({ type: 'changeFacWithPlu', payload: [facWithPluState] });
    };

    return {
        data: state,
        factoryNumOnChange,
        facWithPluFreshHandle,
    };
};

export const factoryGroupStatelessBuilder: (
    item: Item,
) => FactoryGroupInstanceState = (item: Item) => {
    let f = factoryWithPluginStatelessBuilder(item);
    return {
        factoryWithPlugin: f,
        factoryNum: 1,
        groupProductPerSec: f.singleFactoryProductPerSec,
        groupCostPerSec: calCostList(f.singleFactoryCostPerSec, 1),
    };
};

interface FactoryGroupUIProps {
    item: Item;
    instance?: FactoryGroupInstance;
    freshHandle?: (state: FactoryGroupInstanceState) => void;
}

export const renderFormulaList: (
    formulaList: Formula[],
) => React.ReactElement[] = formulaList => {
    const ret: React.ReactElement[] = [];
    formulaList.forEach(f => {
        ret.push(
            <span key={f.item.name}>
                <ItemIcon
                    x={f.item.iconPosition[0]}
                    y={f.item.iconPosition[1]}
                />
                {f.number.toFixed(2)}
            </span>,
        );
    });
    return ret;
};

const FactoryGroupUI: React.FC<FactoryGroupUIProps> = props => {
    const {
        item,
        instance = useFactoryGroup(item),
        freshHandle = () => {},
    } = props;
    useEffect(() => {
        freshHandle(instance.data);
    }, [instance.data]);
    return (
        <Row>
            <Col>
                <FactoryWithPluginUI
                    item={item}
                    freshHandle={instance.facWithPluFreshHandle}
                    // instance={instance.factoryWithPluginInstance}
                />
            </Col>
            <Col>
                <Row>
                    工厂数量：
                    <InputNumber
                        min={0}
                        defaultValue={0}
                        step={1}
                        onChange={(v: string | number | undefined) => {
                            instance.factoryNumOnChange(
                                parseInt(v ? v.toString() : '0'),
                            );
                        }}
                        style={{ width: '45px', display: 'inline-block' }}
                        value={instance.data.factoryNum}
                    />
                    每组每秒产量：{instance.data.groupProductPerSec.toFixed(2)}
                </Row>
                <Row>
                    每组每秒消耗:{' '}
                    {renderFormulaList(instance.data.groupCostPerSec)}
                </Row>
            </Col>
        </Row>
    );
};

export default FactoryGroupUI;
