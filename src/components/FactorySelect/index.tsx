import FactoryDefinition, { FactoryInstance } from '@/factorio/Factory';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, useMemo } from 'react';
import ManagerTool from '../../factorio/ManagerTool';
import ItemIcon from '../../pages/ProductAnalysis/components/ItemIcon';
import PluginInput from './PluginInput';

export interface FactorySelectProps {
    instance: FactoryInstance;
}

const FactorySelect: React.FC<FactorySelectProps> = (props) => {
    const { instance: i } = props;
    const factorySelectOptions = useMemo(() => {
        const tools = ManagerTool.getInstance();
        let factoryDefinitonList: FactoryDefinition[] =
            tools.getAllFactoryDefinition();
        let ret: { value: string; label: ReactElement }[] = [];
        factoryDefinitonList.forEach((fd) => {
            ret.push({
                value: fd.name,
                label: (
                    <div style={{ display: 'flex' }}>
                        <ItemIcon
                            x={fd.iconPosition[0]}
                            y={fd.iconPosition[1]}
                        />
                        {fd.name}
                    </div>
                ),
            });
        });
        return ret;
    }, []);
    const factorySelectOnChange = (value: string) => {
        let tools = ManagerTool.getInstance();
        let fd = tools.factory[value];
        i.factoryDefinition = fd;
    };
    return (
        <div style={{ display: 'flex' }}>
            <Select
                style={{ width: '120px' }}
                defaultValue={factorySelectOptions[0].value}
                options={factorySelectOptions}
                onChange={factorySelectOnChange}
                value={i.factoryDefinition.name}
            />
            <PluginInput pluginList={i.pulignList} />
        </div>
    );
};

export default observer(FactorySelect);
