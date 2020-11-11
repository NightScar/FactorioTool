import Factory from '@/factorio/Factory';
import React from 'react';
import { Select, InputNumber, Row, Col } from 'antd';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import Item from '@/factorio/Item';
import ManagerTool from '@/factorio/ManagerTool';
import FactoryPlugin from '@/factorio/Plugin';
import Formula from '@/factorio/Formula';
import { useState } from 'react';

export interface FactoryWithPluginState {
    item: Item;
    factory: Factory;
    pluginList: { plugin: FactoryPlugin; pluginNum: number }[];
    finalSpeed: number;
    productPerSec: number;
    costPerSec: Formula[];
}

export interface FactoryWithPluginInstance {
    data: FactoryWithPluginState;
    getPluginInOneList: () => FactoryPlugin[];
    pluginOnChange: (plugin: FactoryPlugin, num: number) => void;
    factoryOnChange: (factory: Factory) => void;
}

export const useFactoryWithPlugin: (
    item: Item,
    fresh?: () => void,
) => FactoryWithPluginInstance = (item: Item, fresh) => {
    let m = ManagerTool.getInstance();
    let defaultFactory = m.factory['3级工厂'];
    let pluginList = [];
    for (let i in m.plugin) {
        pluginList.push({ plugin: m.plugin[i], pluginNum: 0 });
    }

    let calResult = defaultFactory.analysisProduct(item, []);
    const [state, setState] = useState<FactoryWithPluginState>({
        item: item,
        factory: defaultFactory,
        pluginList: pluginList,
        finalSpeed: calResult.finalSpeed,
        productPerSec: calResult.productPerSec[0].number,
        costPerSec: calResult.costPerSec,
    });
    const getPluginInOneList = () => {
        let ret: FactoryPlugin[] = [];
        state.pluginList.forEach(pn => {
            for (let i = 0; i < pn.pluginNum; i++) {
                ret.push(pn.plugin);
            }
        });
        return ret;
    };

    const pluginOnChange = (plugin: FactoryPlugin, num: number) => {
        console.log('FactoryWithPlugin pluginOnChange()');
        state.pluginList.forEach(o => {
            if (o.plugin.name == plugin.name) {
                o.pluginNum = num;
            }
        });
        setState({ ...state, pluginList: [...state.pluginList], ...reCal() });
        if (fresh) {
            fresh();
        }
    };

    const factoryOnChange = (factory: Factory) => {
        console.log('FactoryWithPlugin factoryOnChange()');
        setState({ ...state, factory, ...reCal() });
        if (fresh) {
            fresh();
        }
    };

    const reCal = () => {
        console.log('FactoryWithPlugin reCal()');
        let calResult = state.factory.analysisProduct(
            state.item,
            getPluginInOneList(),
        );
        return {
            finalSpeed: calResult.finalSpeed,
            productPerSec: calResult.productPerSec[0].number,
            costPerSec: calResult.costPerSec,
        };
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
) => FactoryWithPluginState = item => {
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
        productPerSec: calResult.productPerSec[0].number,
        costPerSec: calResult.costPerSec,
    };
};

export const useFactoryWithPluginStateless: (
    state: FactoryWithPluginState,
    stateOnChange: (c: object) => void,
) => FactoryWithPluginInstance = (state, stateOnChange) => {
    const getPluginInOneList = () => {
        let ret: FactoryPlugin[] = [];
        state.pluginList.forEach(pn => {
            for (let i = 0; i < pn.pluginNum; i++) {
                ret.push(pn.plugin);
            }
        });
        return ret;
    };
    const reCal = () => {
        console.log('FactoryWithPlugin reCal()');
        let calResult = state.factory.analysisProduct(
            state.item,
            getPluginInOneList(),
        );
        return {
            finalSpeed: calResult.finalSpeed,
            productPerSec: calResult.productPerSec[0].number,
            costPerSec: calResult.costPerSec,
        };
    };

    const pluginOnChange = (plugin: FactoryPlugin, num: number) => {
        console.log('FactoryWithPlugin pluginOnChange()');
        state.pluginList.forEach(o => {
            if (o.plugin.name == plugin.name) {
                o.pluginNum = num;
            }
        });
        stateOnChange({ pluginList: [...state.pluginList], ...reCal() });
    };

    const factoryOnChange = (factory: Factory) => {
        console.log('FactoryWithPlugin factoryOnChange()');
        stateOnChange({ factory, ...reCal() });
    };
    return {
        data: state,
        getPluginInOneList,
        pluginOnChange,
        factoryOnChange,
    };
};

interface FactoryWithPluginUIProps {
    item: Item;
    instance?: FactoryWithPluginInstance;
}

const FactoryWithPluginUI: React.FC<FactoryWithPluginUIProps> = props => {
    const { item, instance = useFactoryWithPlugin(item) } = props;
    const manager = ManagerTool.getInstance();

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
    const factoryOptionRender = () => {
        let ret: React.ReactElement[] = [];
        let fList = Factory.allFactory();
        fList.forEach(f => {
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
        instance.data.pluginList.forEach(pI => {
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
                            产量每秒：{instance.data.productPerSec.toFixed(2)}
                        </span>
                    </div>
                </Col>
                <Col>
                    每秒消耗：{renderFormulaList(instance.data.costPerSec)}
                </Col>
            </Row>
        </div>
    );
};

export default FactoryWithPluginUI;
