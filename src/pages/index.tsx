import FormulaTable, { useCalFormula } from '@/components/FormulaTable';
import ItemOperateTable from '@/components/ItemOperateTable';
import ItemSelectArea, { ItemContainer } from '@/components/ItemSelectArea';
import { Button, Card, Col, Row } from 'antd';
import {
    ItemTableRowData,
    ItemTableRowDataBuilder,
} from '../components/ItemOperateTable/index';
import ManagerTool from '../factorio/ManagerTool';

const itemContainer = new ItemContainer();

export default () => {
    const manager = ManagerTool.getInstance();
    const { add, cal, clear, formulaResult, ...p } = useCalFormula();
    const clearItems = () => {
        itemContainer.clear();
    };
    let dataSource = ItemTableRowDataBuilder.buildFromItemArray(
        manager.getItemArray(),
    );
    let optRender = (text: any, record: ItemTableRowData, index: number) => {
        return (
            <>
                <Button onClick={() => itemContainer.increase(record.name)}>
                    添加
                </Button>
            </>
        );
    };
    return (
        <div>
            <Card>
                <Row>
                    <Col span={6}>
                        <ItemSelectArea
                            title="生产列表"
                            container={itemContainer}
                        />
                    </Col>
                    <Col span={18}>
                        <Button
                            onClick={() => cal()}
                            type={'primary'}
                            style={{ marginRight: '24px' }}
                        >
                            计算
                        </Button>
                        <Button
                            onClick={() => itemContainer.clear()}
                            type={'primary'}
                        >
                            清空结果
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <ItemOperateTable
                            dataSource={dataSource}
                            optRender={optRender}
                        />
                    </Col>
                    <Col span={18}>
                        <FormulaTable dataSource={formulaResult} {...p} />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};
