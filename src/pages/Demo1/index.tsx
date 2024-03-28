import FactorySelect from '@/components/FactorySelect';
import ProductProcessSelect from '@/components/FactorySelect/ProductProcessSelect';
import ProductProcessListView from '@/components/ProductView/ProductProcessListView';
import ProductProcessResultView from '@/components/ProductView/ProductProcessResultView';
import SimpleProductProcessView from '@/components/ProductView/SimpleProductProcessView';
import Item from '@/factorio/Item';
import ManagerTool from '@/factorio/ManagerTool';
import { ProductProcess, ProductProcessList } from '@/factorio/ProductProcess';
import { Col, Row } from 'antd';
import React from 'react';
import { FactoryInstance } from '../../factorio/Factory';

const instance = FactoryInstance.defaultFactory();
const process = ProductProcess.default();
const processList = new ProductProcessList();

const clipStr = (name: string): string => {
    const tools = ManagerTool.getInstance();
    const item: Item = tools.items[name];
    const pa: number[] = item.iconPosition;
    return (
        'inset(' +
        pa[1] * 34 +
        'px ' +
        (19 - pa[0]) * 34 +
        'px ' +
        (13 - pa[1]) * 34 +
        'px ' +
        pa[0] * 34 +
        'px)'
    );
};
const positionStr = (name: string): string => {
    const tools = ManagerTool.getInstance();
    const item: Item = tools.items[name];
    const pa: number[] = item.iconPosition;
    return -pa[0] * 34 + 'px ' + -pa[1] * 34;
};

const Demo1: React.FC = () => {
    return (
        <div>
            <FactorySelect instance={instance} />
            <ProductProcessSelect process={process} />
            <SimpleProductProcessView process={process} />
            <img
                src="/icon/Iconsheet_32.png"
                style={{
                    // clipPath: clipStr('蓝瓶'),
                    objectFit: 'cover',
                    // objectPosition: positionStr('蓝瓶'),
                    objectPosition: '0px 0px',
                    width: '34px',
                    height: '34px',
                }}
            />
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
