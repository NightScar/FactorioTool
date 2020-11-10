import React from 'react';
import { FactorySelectInstance, useFactorySelect } from './index';

interface FactorySelectWithProductProps {}

export interface FactorySelectWithProductInstance{

}

export const useFactorySelectWithProduct : ()=> FactorySelectWithProductInstance = () => {
    const selectInstance : FactorySelectInstance = useFactorySelect();
    
    return {};
}

const FactorySelectWithProduct : React.FC<FactorySelectWithProductProps> = (props) => {

    return <div/>;
};

export default FactorySelectWithProduct;