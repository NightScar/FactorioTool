import { useState } from 'react';
import Factory, { FactoryGroupHolder } from './Factory';
import FactoryPlugin from '@/factorio/Plugin';
import Item from './Item';
import ItemIcon from '@/pages/ProductAnalysis/components/ItemIcon';

export interface ProAnaState {
    [itemName: string]: {
        groupHolder: FactoryGroupHolder;
    };
}

export interface ProAnaInstance {
    data: ProAnaState;
    addItem: (item: Item) => void;
    getItemProductSupply: (
        itemName: string,
    ) => {
        factory: Factory;
        plugins: { plugin: FactoryPlugin; num: number }[];
        productNum: number;
    }[];
    getItemFormulaRequirement: (
        itemName: string,
    ) => { item: Item; requirement: number }[];
}

export const useProAna: () => ProAnaInstance = () => {
    const [state, setState] = useState<ProAnaState>({});
    const addItem: (item: Item) => void = item => {
        if (state[item.name]) {
            return;
        }
        state[item.name] = {
            groupHolder: new FactoryGroupHolder(item),
        };
        setState({ ...state });
    };
    // const getItemProductSupply: (itemName: string) => { factory: Factory, plugins: { plugin: FactoryPlugin, num: number }[], productNum: number}[]
    // = (ItemName) =>{
    //     if(state[ItemName]){

    //     }
    // };

    return {
        data: state,
        addItem,
    };
};
