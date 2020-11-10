import { useState } from 'react';
import Factory from './Factory';
import FactoryPlugin from '@/factorio/Plugin';
import Item from './Item';

export interface ProAnaState{

}

export interface ProAnaInstance{
    data: ProAnaState;
    getItemProductSupply: (itemName: string) => { factory: Factory, plugins: { plugin: FactoryPlugin, num: number }[], productNum: number}[];
    getItemFormulaRequirement: (itemName: string) => { item: Item, requirement: number }[];
}

export const useProAna : () => ProAnaInstance = () => {
    const [ state, setState ] = useState<ProAnaState>();
    

};