import React from 'react';
import { FactoryGroupInstance, useFactoryGroup } from './FactoryGroupUI';
import { List, Button } from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import Item from '@/factorio/Item';
import { useState } from 'react';
import FactoryGroupUI from './FactoryGroupUI';

export interface FactoryGroupHolderState {
    factoryGroup: FactoryGroupInstance[];
}

export interface FactoryGroupHolderInstance {
    data: FactoryGroupHolderState;
    addGroup: ()=>void;
}

interface FactoryGroupHolderUIProps {
    item: Item;
    instance?: FactoryGroupHolderInstance;
}

export const useFactoryGroupHolder: (item: Item) => FactoryGroupHolderInstance = (item) =>{
    let initGroup : FactoryGroupInstance = useFactoryGroup(item);
    let defaultGroupList : FactoryGroupInstance[] = [];
    defaultGroupList.push(initGroup);
    const [ state, setState ] = useState<FactoryGroupHolderState>({
        factoryGroup: defaultGroupList,
    });
    
    const addGroup : () => void = () => {
    };

    return {
        data: state,
        addGroup,
    }
};

const FactoryGroupHolderUI: React.FC<FactoryGroupHolderUIProps> = props => {
    const { item, instance = useFactoryGroupHolder(item)} = props;

    const factorySelectItemRender: (
        factoryGroup: FactoryGroupInstance,
        index: number,
    ) => React.ReactElement = (factoryGroup: FactoryGroupInstance, index: number) => {
        return (
            <List.Item
                key={factoryGroup.data.factoryWithPlugin.factory.name + index}
            >
                <FactoryGroupUI instance={factoryGroup} item={item}/>
            </List.Item>
        );
    };
    return (
        <List
            bordered
            header={
                <Button type={'dashed'} style={{ width: '100%' }} onClick={instance.addGroup}>
                    <PlusOutlined />
                </Button>
            }
        >
            {instance.data.factoryGroup.map((o, index) => {
                return factorySelectItemRender(o, index);
            })}
        </List>
    );
};

export default FactoryGroupHolderUI;
