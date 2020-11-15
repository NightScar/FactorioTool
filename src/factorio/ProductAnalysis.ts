import { Reducer, useReducer, useRef, MutableRefObject } from 'react';
import FactoryPlugin from '@/factorio/Plugin';
import Item from './Item';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';
import {
    FactoryGroupHolderState,
    factoryGroupHolderStatelessBuilder,
} from '@/components/FactorySelect/FactoryGroupHolderUI';

export interface ProAnaState {
    [itemName: string]: {
        groupHolder: FactoryGroupHolderState;
    };
}

export interface ProAnaInstance {
    data: ProAnaState;
    addItem: (item: Item) => void;
    groupHolderOnChange: (state: FactoryGroupHolderState) => void;
    getRequire: (item: Item) => FactoryGroupHolderState[];
}

const reducer: Reducer<
    ProAnaState,
    { type: 'addItem' | 'changeGroupHolder'; payload: any[] }
> = (state, action) => {
    switch (action.type) {
        case 'addItem':
            const [item] = action.payload;
            if (state[item.name]) {
                return state;
            }
            state[item.name] = {
                groupHolder: factoryGroupHolderStatelessBuilder(item),
            };
            return {
                ...state,
            };
        case 'changeGroupHolder':
            const [groupHolderState] = action.payload as [
                FactoryGroupHolderState,
            ];
            const itemName =
                groupHolderState.factoryGroupHolder[0].factoryWithPlugin.item
                    .name;
            state[itemName] = {
                ...state[itemName],
                groupHolder: groupHolderState,
            };
            return {
                ...state,
            };
        default:
            throw new Error();
    }
};

export const useProAna: () => ProAnaInstance = () => {
    const [state, dispatch] = useReducer<
        Reducer<
            ProAnaState,
            { type: 'addItem' | 'changeGroupHolder'; payload: any[] }
        >,
        {}
    >(reducer, {}, () => {
        return {};
    });

    const addItem: (item: Item) => void = item => {
        dispatch({ type: 'addItem', payload: [item] });
    };

    const groupHolderOnChange: (
        state: FactoryGroupHolderState,
    ) => void = state => {
        dispatch({ type: 'changeGroupHolder', payload: [state] });
    };

    const getRequire: (item: Item) => FactoryGroupHolderState[] = item => {
        let ret: FactoryGroupHolderState[] = [];
        for (let i in state) {
            if (
                state[i].groupHolder.holderCostPerSec.filter(
                    f => f.item.name == item.name,
                ).length > 0
            ) {
                ret.push(state[i].groupHolder);
            }
        }
        return ret;
    };

    return {
        data: state,
        addItem,
        groupHolderOnChange,
        getRequire,
    };
};
