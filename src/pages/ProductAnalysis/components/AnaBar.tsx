import React from 'react';
import { FactoryGroupHolderState } from '../../../components/FactorySelect/FactoryGroupHolderUI';

interface AnaBarProps {
    productOffer: FactoryGroupHolderState,
    productRequire: FactoryGroupHolderState[],
}

const AnaBar : React.FC<AnaBarProps> = (props) => {
    return <div/>;
};

export default AnaBar;