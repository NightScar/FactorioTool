import React from 'react';
import ManagerTool from '../../factorio/ManagerTool';
import { Select } from 'antd';
import PluginInput from './PluginInput';
import { useState } from 'react';

interface FactorySelectProps {
    onChange: (f : string, p: {name: string, num: number}[]) => void;
}

const FactorySelect: React.FC<FactorySelectProps> = props => {
    const { onChange } = props;
    const tools = ManagerTool.getInstance();
    const [ state, setState ] = useState<{f : string, p: {name: string, num: number}[]}>({f:'0', p:[]});

    const factorySelectOnChange : (f: string)=>void = (f)=>{
        onChange(f, state.p);
        setState({...state, f});
    };

    const pulingOnChange: (v: { name: string, num: number}[])=>void = (v: { name: string, num: number}[])=>{
        onChange(state.f, v);
        setState({...state, p: v});
    };

    const genOpt: () => React.ReactElement[] = () => {
        let ret: React.ReactElement[] = [];
        for (let f in tools.factory) {
            ret.push(
                <Select.Option key={f} value={tools.factory[f].name} style={{width: '100%'}} size={'large'}>
                    <img src={tools.factory[f].getIconUrl()} />
                    {f}
                </Select.Option>,
            );
        }
        return ret;
    };
    return <div>
        <Select style={{width: '100px'}} size={'large'} onSelect={factorySelectOnChange}>{genOpt()}</Select>
        <PluginInput  onChange={pulingOnChange}/>
    </div>;
};

export default FactorySelect;
