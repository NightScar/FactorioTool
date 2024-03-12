import FactoryDefinition from '@/factorio/Factory';
import Formula from '@/factorio/Formula';
import Item from '@/factorio/Item';
import ManagerTool from '@/factorio/ManagerTool';
import FactoryPlugin from '@/factorio/Plugin';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import { Col, InputNumber, Row, Select } from 'antd';
import React, {
    Reducer,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useReducer,
} from 'react';

export interface FactoryWithPluginState {
    item: Item;
    factory: FactoryDefinition;
    pluginList: { plugin: FactoryPlugin; pluginNum: number }[];
    finalSpeed: number;
    singleFactoryProductPerSec: number;
    singleFactoryCostPerSec: Formula[];
}

export interface FactoryWithPluginInstance {
    data: FactoryWithPluginState;
    getPluginInOneList: (
        pluginList: { plugin: FactoryPlugin; pluginNum: number }[],
    ) => FactoryPlugin[];
    pluginOnChange: (plugin: FactoryPlugin, num: number) => void;
    factoryOnChange: (factory: FactoryDefinition) => void;
}

const getPluginInOneList = (
    pluginList: { plugin: FactoryPlugin; pluginNum: number }[],
) => {
    let ret: FactoryPlugin[] = [];
    pluginList.forEach((pn) => {
        for (let i = 0; i < pn.pluginNum; i++) {
            ret.push(pn.plugin);
        }
    });
    return ret;
};

const reCal: (state: FactoryWithPluginState) => {
    finalSpeed: number;
    singleFactoryProductPerSec: number;
    singleFactoryCostPerSec: Formula[];
} = (state: FactoryWithPluginState) => {
    console.log('FactoryWithPlugin reCal()');
    let calResult1 = state.factory.analysisProduct(
        state.item,
        getPluginInOneList(state.pluginList),
    );
    return {
        finalSpeed: calResult1.finalSpeed,
        singleFactoryProductPerSec: calResult1.productPerSec[0].number,
        singleFactoryCostPerSec: calResult1.costPerSec,
    };
};

const reducer: Reducer<
    FactoryWithPluginState,
    { type: 'changeFactory' | 'changePlugin'; payload: any[] }
> = (state, action) => {
    switch (action.type) {
        case 'changeFactory':
            let factory: FactoryDefinition = action.payload[0];
            state.factory = factory;
            return {
                ...state,
                factory,
                ...reCal(state),
            };
        case 'changePlugin':
            const [plugin, pluginNum] = action.payload;
            state.pluginList.forEach((o) => {
                if (o.plugin.name == plugin.name) {
                    o.pluginNum = pluginNum;
                }
            });
            return {
                ...state,
                pluginList: [...state.pluginList],
                ...reCal(state),
            };
        default:
            throw new Error();
    }
};

export const useFactoryWithPlugin: (
    item: Item,
    fresh?: () => void,
) => FactoryWithPluginInstance = (item: Item, fresh) => {
    const [state, dispatch] = useReducer<
        Reducer<
            FactoryWithPluginState,
            { type: 'changeFactory' | 'changePlugin'; payload: any[] }
        >,
        {}
    >(reducer, {}, () => {
        return factoryWithPluginStatelessBuilder(item);
    });
    const pluginOnChange = (plugin: FactoryPlugin, num: number) => {
        dispatch({ type: 'changePlugin', payload: [plugin, num] });
        if (fresh) {
            fresh();
        }
    };

    const factoryOnChange = (factory: FactoryDefinition) => {
        console.log('FactoryWithPlugin factoryOnChange()');
        dispatch({ type: 'changeFactory', payload: [factory] });
        if (fresh) {
            fresh();
        }
    };

    return {
        data: state,
        getPluginInOneList,
        pluginOnChange,
        factoryOnChange,
    };
};

export const factoryWithPluginStatelessBuilder: (
    item: Item,
) => FactoryWithPluginState = (item) => {
    let m = ManagerTool.getInstance();
    let defaultFactory = m.factory['3级工厂'];
    let pluginList = [];
    for (let i in m.plugin) {
        pluginList.push({ plugin: m.plugin[i], pluginNum: 0 });
    }

    let calResult = defaultFactory.analysisProduct(item, []);
    return {
        item: item,
        factory: defaultFactory,
        pluginList: pluginList,
        finalSpeed: calResult.finalSpeed,
        singleFactoryProductPerSec: calResult.productPerSec[0].number,
        singleFactoryCostPerSec: calResult.costPerSec,
    };
};

interface FactoryWithPluginUIProps {
    item: Item;
    instance?: FactoryWithPluginInstance;
    freshHandle?: (state: FactoryWithPluginState) => void;
}

const FactoryWithPluginUI: React.ForwardRefRenderFunction<
    FactoryWithPluginState,
    FactoryWithPluginUIProps
> = (props, ref) => {
    const { item, instance = useFactoryWithPlugin(item), freshHandle } = props;
    const manager = ManagerTool.getInstance();
    useImperativeHandle(
        ref,
        () => {
            // console.log('--useImperativeHandle');
            return { ...instance.data };
        },
        [instance.data],
    );
    useEffect(() => {
        if (freshHandle) {
            freshHandle(instance.data);
        }
    }, [instance.data]);
    const renderFormulaList: (
        formulaList: Formula[],
    ) => React.ReactElement[] = (formulaList) => {
        const ret: React.ReactElement[] = [];
        formulaList.forEach((f) => {
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
    const factoryOptionRender = () => {
        let ret: React.ReactElement[] = [];
        let fList = FactoryDefinition.allFactory();
        fList.forEach((f) => {
            ret.push(
                <Select.Option
                    key={f.name}
                    value={f.name}
                    style={{ width: '100%' }}
                    size={'large'}
                >
                    <ItemIcon x={f.iconPosition[0]} y={f.iconPosition[1]} />
                    {f.name}
                </Select.Option>,
            );
        });
        return ret;
    };

    const pluginRender: () => React.ReactElement[] = () => {
        let ret: React.ReactElement[] = [];
        instance.data.pluginList.forEach((pI) => {
            ret.push(
                <div key={pI.plugin.name} style={{ display: 'inline-block' }}>
                    <div
                        style={{
                            display: 'inline-block',
                            position: 'relative',
                            top: '12px',
                        }}
                    >
                        <ItemIcon
                            x={pI.plugin.iconPosition[0]}
                            y={pI.plugin.iconPosition[1]}
                        />
                    </div>
                    <div style={{ display: 'inline-block', marginTop: '0px' }}>
                        <InputNumber
                            min={0}
                            defaultValue={0}
                            step={1}
                            onChange={(v: string | number | undefined) => {
                                instance.pluginOnChange(
                                    pI.plugin,
                                    parseInt(v ? v.toString() : '0'),
                                );
                            }}
                            style={{ width: '45px', display: 'inline-block' }}
                            value={pI.pluginNum}
                        />
                    </div>
                </div>,
            );
        });
        return ret;
    };
    return (
        // <div style={{ height: '40px' }}>
        <div style={{}}>
            <Row gutter={12}>
                <Col>
                    <Select
                        style={{ width: '160px' }}
                        size={'large'}
                        onSelect={(v: string) => {
                            instance.factoryOnChange(manager.factory[v]);
                        }}
                        defaultValue={instance.data.factory.name}
                    >
                        {factoryOptionRender()}
                    </Select>
                </Col>
                <Col>
                    <div style={{}}>{pluginRender()}</div>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col>
                    <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                        <span>速度：{instance.data.finalSpeed.toFixed(2)}</span>
                        <span style={{ marginLeft: '8px' }}>
                            单工厂产量每秒：
                            {instance.data.singleFactoryProductPerSec.toFixed(
                                2,
                            )}
                        </span>
                    </div>
                </Col>
                <Col>
                    单工厂每秒消耗：
                    {renderFormulaList(instance.data.singleFactoryCostPerSec)}
                </Col>
            </Row>
        </div>
    );
};

export default forwardRef(FactoryWithPluginUI);
