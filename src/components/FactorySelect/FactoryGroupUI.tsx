import Formula from '@/factorio/Formula';
import Item from '@/factorio/Item';
import React from 'react';
import FactoryWithPluginUI, {
    FactoryWithPluginState,
    FactoryWithPluginInstance,
    useFactoryWithPlugin,
} from './FactoryWithPluginUI';
import { useState } from 'react';
import { InputNumber, Row, Col } from 'antd';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import { FactoryWithPlugin } from '../../factorio/Factory';
import {
    factoryWithPluginStatelessBuilder,
    useFactoryWithPluginStateless,
} from './FactoryWithPluginUI';

export interface FactoryGroupInstanceState {
    factoryWithPlugin: FactoryWithPluginState;
    factoryNum: number;
    productPerSec: number;
    costPerSec: Formula[];
}

export interface FactoryGroupInstance {
    data: FactoryGroupInstanceState;
    factoryNumOnChange: (factoryNum: number) => void;
    factoryWithPluginInstance: FactoryWithPluginInstance;
}

export const useFactoryGroup: (
    item: Item,
    fresh?: () => void,
) => FactoryGroupInstance = item => {
    const childFresh = () => {
        setState({
            ...state,
            productPerSec:
                factoryWithPluginInstance.data.productPerSec * state.factoryNum,
            costPerSec: calCostList(
                factoryWithPluginInstance.data.costPerSec,
                state.factoryNum,
            ),
        });
    };
    let factoryWithPluginInstance: FactoryWithPluginInstance = useFactoryWithPlugin(
        item,
        childFresh,
    );

    const calCostList = (formulaList: Formula[], factoryNum: number) => {
        console.log('FactoryGroup reCalCostList()');
        let list: Formula[] = [];
        formulaList.forEach(f => {
            list.push(new Formula(f.item, f.number * factoryNum));
        });
        return list;
    };

    const [state, setState] = useState<FactoryGroupInstanceState>({
        factoryWithPlugin: factoryWithPluginInstance.data,
        factoryNum: 1,
        productPerSec: factoryWithPluginInstance.data.productPerSec,
        costPerSec: calCostList(factoryWithPluginInstance.data.costPerSec, 1),
    });

    const factoryNumOnChange = (factoryNum: number) => {
        console.log('FactoryGroup factoryNumOnChange()');
        setState({
            ...state,
            factoryNum,
            productPerSec:
                factoryWithPluginInstance.data.productPerSec * factoryNum,
            costPerSec: calCostList(
                factoryWithPluginInstance.data.costPerSec,
                factoryNum,
            ),
        });
    };

    return {
        data: state,
        factoryNumOnChange,
        factoryWithPluginInstance,
    };
};

export const factoryGroupStatlessBuilder: (
    item: Item,
) => FactoryGroupInstanceState = (item: Item) => {
    let f = factoryWithPluginStatelessBuilder(item);
    const calCostList = (formulaList: Formula[], factoryNum: number) => {
        console.log('FactoryGroup reCalCostList()');
        let list: Formula[] = [];
        formulaList.forEach(f => {
            list.push(new Formula(f.item, f.number * factoryNum));
        });
        return list;
    };
    return {
        factoryWithPlugin: f,
        factoryNum: 1,
        productPerSec: f.productPerSec,
        costPerSec: calCostList(f.costPerSec, 1),
    };
};
export const useFactoryGroupStatless: (
    state: FactoryGroupInstanceState,
    stateOnChange: (c: object) => void,
) => FactoryGroupInstance = (state, stateOnChange) => {
    const calCostList = (formulaList: Formula[], factoryNum: number) => {
        console.log('FactoryGroup reCalCostList()');
        let list: Formula[] = [];
        formulaList.forEach(f => {
            list.push(new Formula(f.item, f.number * factoryNum));
        });
        return list;
    };

    let factoryWithPluginInstance = useFactoryWithPluginStateless(
        state.factoryWithPlugin,
        (c: object) => {
            let newF = { ...state.factoryWithPlugin, ...c };
            stateOnChange({
                factoryWithPlugin: { ...state.factoryWithPlugin, ...c },
                productPerSec: newF.productPerSec * state.factoryNum,
                costPerSec: calCostList(newF.costPerSec, state.factoryNum),
            });
        },
    );

    const factoryNumOnChange = (factoryNum: number) => {
        stateOnChange({
            factoryNum,
            productPerSec: state.factoryWithPlugin.productPerSec * factoryNum,
            costPerSec: calCostList(
                state.factoryWithPlugin.costPerSec,
                factoryNum,
            ),
        });
    };
    return {
        data: state,
        factoryWithPluginInstance,
        factoryNumOnChange,
    };
};

interface FactoryGroupUIProps {
    item: Item;
    instance?: FactoryGroupInstance;
}

const FactoryGroupUI: React.FC<FactoryGroupUIProps> = props => {
    const { item, instance = useFactoryGroup(item) } = props;
    const renderFormulaList: (
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
    return (
        <Row>
            <Col>
                <FactoryWithPluginUI
                    item={item}
                    instance={instance.factoryWithPluginInstance}
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
                    每秒产量：{instance.data.productPerSec.toFixed(2)}
                </Row>
                <Row>
                    每秒消耗: {renderFormulaList(instance.data.costPerSec)}
                </Row>
            </Col>
        </Row>
    );
};

export default FactoryGroupUI;
