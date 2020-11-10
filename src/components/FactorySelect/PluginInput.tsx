import ManagerTool from '@/factorio/ManagerTool';
import React from 'react';
import { InputNumber } from 'antd';
import { useState } from 'react';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import FactoryPlugin from '../../factorio/Plugin';

interface PluginInputProps {
    onChange: (plugin: FactoryPlugin, num: number) => void;
    pluginItem: { plugin: FactoryPlugin; num: number }[];
}

const PluginInput: React.FC<PluginInputProps> = props => {
    const { onChange, pluginItem } = props;

    const itemRender : () => React.ReactElement[] = () => {
        let ret : React.ReactElement[] = [];
        pluginItem.forEach( pI => {
            ret.push(<div key={pI.plugin.name} style={{display: 'inline-block', height: '40px'}}>
                <ItemIcon x={pI.plugin.iconPosition[0]} y={pI.plugin.iconPosition[1]} />
                <InputNumber
                    min={0}
                    defaultValue={0}
                    step={1}
                    onChange={(v: string | number | undefined)=>{ onChange(pI.plugin, parseInt(v? v.toString() : '0'))}}
                    style={{ width: '50px', display: 'inline-block' }}
                    value={pI.num}
                />
            </div>);});
        return ret;
    };

    return (
        <div style={{display: 'inline-block'}}>
            {itemRender()}
        </div>
    );
};

export default PluginInput;
