import FactorySelect from '@/components/FactorySelect';
import ProductProcessSelect from '@/components/FactorySelect/ProductProcessSelect';
import ProductProcessListView from '@/components/ProductView/ProductProcessListView';
import ProductProcessResultView from '@/components/ProductView/ProductProcessResultView';
import SimpleProductProcessView from '@/components/ProductView/SimpleProductProcessView';
import { ProductProcess, ProductProcessList } from '@/factorio/ProductProcess';
import { Col, Row } from 'antd';
import React from 'react';
import { FactoryInstance } from '../../factorio/Factory';

const instance = FactoryInstance.defaultFactory();
const process = ProductProcess.default();
const processList = new ProductProcessList();
const Demo1: React.FC = () => {
    return (
        <div>
            <FactorySelect instance={instance} />
            <ProductProcessSelect process={process} />
            <SimpleProductProcessView process={process} />
            <Row>
                <Col span={12}>
                    <ProductProcessListView processList={processList} />
                </Col>
                <Col span={12}>
                    <ProductProcessResultView processList={processList} />
                </Col>
            </Row>
        </div>
    );
};

export default Demo1;
