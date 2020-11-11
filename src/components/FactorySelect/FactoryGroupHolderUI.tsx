import React from 'react';
import {
    FactoryGroupInstance,
    FactoryGroupInstanceState,
    factoryGroupStatlessBuilder,
    useFactoryGroupStatless,
} from './FactoryGroupUI';
import { List, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Item from '@/factorio/Item';
import { useState } from 'react';
import FactoryGroupUI from './FactoryGroupUI';

export interface FactoryGroupHolderState {
    factoryGroup: { [index: number]: FactoryGroupInstanceState };
}

export interface FactoryGroupHolderInstance {
    data: FactoryGroupHolderState;
    addGroup: () => void;
    getGroupInstance: (index: number) => FactoryGroupInstance;
}

interface FactoryGroupHolderUIProps {
    item: Item;
    instance?: FactoryGroupHolderInstance;
}

export const useFactoryGroupHolder: (
    item: Item,
) => FactoryGroupHolderInstance = item => {
    const [state, setState] = useState<FactoryGroupHolderState>({
        factoryGroup: {
            0: factoryGroupStatlessBuilder(item),
            // 0: useFactoryGroupStatless(factoryGroupStatlessBuilder(item), (c) => {
            //     state.factoryGroup[0] = { ...state.factoryGroup[0], ...c };
            //     setState({ ...state, factoryGroup: {...state.factoryGroup} })
            // }),
        },
    });

    const addGroup: () => void = () => {
        let i: number = 0;
        while (!state.factoryGroup[i]) {
            i++;
        }
        let factoryGroup = { ...state.factoryGroup };
        factoryGroup[i] = factoryGroupStatlessBuilder(item);
        setState({ ...state, factoryGroup });
    };

    const getGroupInstance = (index: number) => {
        return useFactoryGroupStatless(state.factoryGroup[index], c => {
            state.factoryGroup[index] = { ...state.factoryGroup[index], ...c };
            setState({
                ...state,
                factoryGroup: { ...state.factoryGroup },
            });
        });
    };

    return {
        data: state,
        addGroup,
        getGroupInstance,
    };
};

const FactoryGroupHolderUI: React.FC<FactoryGroupHolderUIProps> = props => {
    const { item, instance = useFactoryGroupHolder(item) } = props;

    const factorySelectItemRender: (
        factoryGroup: FactoryGroupInstanceState,
        index: number,
    ) => React.ReactElement = (
        factoryGroup: FactoryGroupInstanceState,
        index: number,
    ) => {
        return (
            <List.Item
                key={factoryGroup.factoryWithPlugin.factory.name + index}
            >
                <FactoryGroupUI
                    instance={instance.getGroupInstance(index)}
                    item={item}
                />
            </List.Item>
        );
    };
    const groupHolderRender = () => {
        let ret = [];
        for (let i in instance.data.factoryGroup) {
            ret.push(
                factorySelectItemRender(
                    instance.data.factoryGroup[i],
                    parseInt(i),
                ),
            );
        }
        return ret;
    };
    return (
        <List
            bordered
            header={
                <Button
                    type={'dashed'}
                    style={{ width: '100%' }}
                    onClick={instance.addGroup}
                >
                    <PlusOutlined />
                </Button>
            }
        >
            {groupHolderRender()}
        </List>
    );
};

export default FactoryGroupHolderUI;
