import { PluginList } from '@/factorio/Factory';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import { InputNumber } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';

export interface PluginInputProps {
    pluginList: PluginList;
}

const PluginInput: React.FC<PluginInputProps> = (props) => {
    const { pluginList } = props;

    return (
        <div style={{ display: 'flex' }}>
            {pluginList.pluginList.map((pI) => (
                <div
                    key={pI.plugin.name}
                    style={{ display: 'flex', height: '35px' }}
                >
                    <ItemIcon
                        x={pI.plugin.iconPosition[0]}
                        y={pI.plugin.iconPosition[1]}
                    />
                    <InputNumber
                        min={0}
                        defaultValue={0}
                        step={1}
                        onChange={(v: number | null) => {
                            pluginList.onChange(
                                pI.plugin.name,
                                parseInt(v ? v.toString() : '0'),
                            );
                        }}
                        style={{
                            width: '50px',
                            display: 'inline-block',
                            marginTop: '0px',
                        }}
                        value={pI.pluginNum}
                    />
                </div>
            ))}
        </div>
    );
};

export default observer(PluginInput);
