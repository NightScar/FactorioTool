import React from 'react';
import ManagerTool from '../../factorio/ManagerTool';
import { Select } from 'antd';
import PluginInput from './PluginInput';
import { useState } from 'react';
import ItemIcon from '../../pages/ProductAnalysis/components/ItemIcon';
import FactoryPlugin from '@/factorio/Plugin';
import Factory, { FactoryWithPlugin } from '@/factorio/Factory';
import Item from '@/factorio/Item';

interface FactorySelectProps {
    onChange: (f: string, p: { name: string; num: number }[]) => void;
    instance?: FactorySelectInstance;
}

export interface FactorySelectInstance {
    data: {
        f: Factory;
        p: { plugin: FactoryPlugin; num: number }[];
    };
    factorySelectOnChange: (f: string) => void;
    pluginOnChange: (plugin: FactoryPlugin, num: number) => void;
}

export const useFactorySelect: (item: Item) => FactorySelectInstance = item => {
    const tools = ManagerTool.getInstance();
    let defaultFactory = tools.factory['3级工厂'];
    let pluginList: FactoryPlugin[] = [];
    for (let name in tools.plugin) {
        pluginList.push(tools.plugin[name]);
    }
    let tempP: { plugin: FactoryPlugin; num: number }[] = [];
    pluginList.forEach(p => tempP.push({ plugin: p, num: 0 }));
    // const [state, setState] = useState<{
    //     f: Factory;
    //     p: { plugin: FactoryPlugin; num: number }[];
    // }>({
    //     f: defaultFactory,
    //     p: tempP,
    // });
    let a = new FactoryWithPlugin(item, defaultFactory);
    const [state, setState] = useState<FactoryWithPlugin>(a);
    const factorySelectOnChange: (f: string) => void = f => {
        setState({ ...state, f: tools.factory[f] });
    };
    const pluginOnChange: (plugin: FactoryPlugin, num: number) => void = (
        plugin,
        num,
    ) => {
        let fr: { plugin: FactoryPlugin; num: number }[] = state.p.filter(
            pItem => {
                let t1 = pItem.plugin.name;
                let t2 = plugin.name;
                return t1 == t2;
            },
        );
        if (fr.length > 0) {
            fr[0].num = num;
        }
        setState({ ...state });
    };
    return {
        data: state,
        factorySelectOnChange,
        pluginOnChange,
    };
};

const FactorySelect: React.FC<FactorySelectProps> = props => {
    const { onChange, instance: i } = props;
    let instance: FactorySelectInstance;
    if (!i) {
        instance = useFactorySelect();
    } else {
        instance = i;
    }
    const tools = ManagerTool.getInstance();
    const { data, factorySelectOnChange, pluginOnChange } = instance;

    const genOpt: () => React.ReactElement[] = () => {
        let ret: React.ReactElement[] = [];
        for (let f in tools.factory) {
            ret.push(
                <Select.Option
                    key={f}
                    value={tools.factory[f].name}
                    style={{ width: '100%' }}
                    size={'large'}
                >
                    <ItemIcon
                        x={tools.factory[f].iconPosition[0]}
                        y={tools.factory[f].iconPosition[1]}
                    />
                    {f}
                </Select.Option>,
            );
        }
        return ret;
    };
    return (
        <div style={{ height: '40px' }}>
            <Select
                style={{ width: '120px' }}
                size={'large'}
                onSelect={factorySelectOnChange}
                defaultValue={data.f.name}
            >
                {genOpt()}
            </Select>
            <PluginInput onChange={pluginOnChange} pluginItem={data.p} />
        </div>
    );
};

export default FactorySelect;
