import ManagerTool from '@/factorio/ManagerTool';
import React from 'react';
import { InputNumber } from 'antd';
import { useState } from 'react';

interface PluginInputProps {
    onChange: (v: { name: string; num: number }[]) => void;
}

interface ItemProps {
    icon: string;
    name: string;
    onChange: (name: string, v: number) => void;
}

const PluginItemInput: React.FC<ItemProps> = props => {
    const { icon, name, onChange } = props;
    const c = (v: string | number | undefined) => {
        if (!v) {
            onChange(name, 0);
        } else {
            onChange(name, parseInt(v.toString()));
        }
    };
    return (
        <span>
            <img src={icon} />
            <InputNumber
                min={0}
                defaultValue={0}
                step={1}
                onChange={c}
                style={{ width: '50px' }}
            />
        </span>
    );
};

const PluginInput: React.FC<PluginInputProps> = props => {
    const { onChange } = props;
    const tools = ManagerTool.getInstance();
    let s1 = '3级速度插件';
    let speed = tools.plugin[s1];
    let s2 = '3级产能插件';
    let product = tools.plugin[s2];
    const [p, setP] = useState<{ name: string; num: number }[]>([]);
    const changeSpeedNum: (name: string, n: number) => void = (name, n) => {
        let flag = false;
        p.forEach(i => {
            if (i.name == name) {
                i.num = n;
                flag = true;
            }
        });
        if (!flag) {
            p.push({ name: name, num: n });
        }
        setP([...p]);
        onChange(p);
    };

    return (
        <span>
            <PluginItemInput
                icon={speed.getIconUrl()}
                onChange={changeSpeedNum}
                name={'3级速度插件'}
            />
            <PluginItemInput
                icon={product.getIconUrl()}
                onChange={changeSpeedNum}
                name={'3级产能插件'}
            />
        </span>
    );
};

export default PluginInput;
