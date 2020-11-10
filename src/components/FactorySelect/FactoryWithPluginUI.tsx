import Factory, { FactoryWithPlugin } from '@/factorio/Factory';
import React from 'react';
import { Select, InputNumber } from 'antd';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import Item from '@/factorio/Item';
import ManagerTool from '@/factorio/ManagerTool';

interface FactoryWithPluginUIProps {
    item: Item;
    instance?: FactoryWithPlugin;
}

const FactoryWithPluginUI: React.FC<FactoryWithPluginUIProps> = props => {
    const { item, instance = FactoryWithPlugin.defaultInstance(item) } = props;
    const manager = ManagerTool.getInstance();

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
        instance.pluginList.forEach(pI => {
            ret.push(
                <div
                    key={pI.plugin.name}
                    style={{ display: 'inline-block', height: '40px' }}
                >
                    <ItemIcon
                        x={pI.plugin.iconPosition[0]}
                        y={pI.plugin.iconPosition[1]}
                    />
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
                        style={{ width: '50px', display: 'inline-block' }}
                        value={pI.pluginNum}
                    />
                </div>,
            );
        });
        return ret;
    };
    return (
        <div style={{ height: '40px' }}>
            <Select
                style={{ width: '120px' }}
                size={'large'}
                onSelect={(v: string) => {
                    instance.factoryOnChange(manager.factory[v]);
                }}
                defaultValue={instance?.factory.name}
            >
                {factoryOptionRender()}
            </Select>
            {pluginRender()}
        </div>
    );
};

export default FactoryWithPluginUI;
