import ManagerTool from '@/factorio/ManagerTool';
import {
    FactoryInputEdgeUserModel,
    FactoryNodeUserModel,
    FactoryOutputEdgeUserModel,
    ItemNodeUserModel,
    addTreeToProductGraph,
    emptyProductGraph,
    itemBuildTree,
    productGraphToGraphData,
    simpleTreeMapper,
} from '@/factorio/ProductGraph';
import {
    EdgeDisplayModel,
    EdgeModel,
    Extensions,
    Graph,
    NodeDisplayModel,
    NodeModel,
    extend,
} from '@antv/g6';
import { useEffect, useRef } from 'react';

const nodeExt = (inputData: NodeModel): NodeDisplayModel => {
    let xType = (inputData as any).xType;
    if (xType == 'item') {
        let itemNode = inputData as ItemNodeUserModel;
        return {
            ...itemNode,
            data: {
                ...itemNode.data,
                type: 'rect-node',
                labelShape: {
                    text: itemNode.item.name,
                    position: 'bottom',
                    maxWidth: '300%',
                },
                iconShape: {
                    src:
                        '/icon/item/' +
                        itemNode.item.iconPosition[0] +
                        '_' +
                        itemNode.item.iconPosition[1] +
                        '.png',
                    width: 34,
                    height: 34,
                },
            },
        };
    }
    if (xType == 'factory') {
        let factoryNode = inputData as FactoryNodeUserModel;
        return {
            ...factoryNode,
            data: {
                ...factoryNode.data,
                type: 'rect-node',
                iconShape: {
                    src:
                        '/icon/item/' +
                        factoryNode.factory.iconPosition[0] +
                        '_' +
                        factoryNode.factory.iconPosition[1] +
                        '.png',
                    width: 34,
                    height: 34,
                },
                labelShape: {
                    text: factoryNode.factory.name,
                    position: 'bottom',
                    maxWidth: '300%',
                },
            },
        };
    }
    const { id, data } = inputData;
    let ret = {
        id: id,
        data: {
            ...data,
            type: 'rect-node',
            iconShape: {
                src: '/icon/speed3.png',
                width: 34,
                height: 34,
            },
        },
    };
    return ret;
};

const edgeExt = (inputData: EdgeModel): EdgeDisplayModel => {
    let xType = (inputData as any).xType;
    if (xType == 'factoryInput') {
        let inputEdge = inputData as FactoryInputEdgeUserModel;
        return {
            ...inputEdge,
            data: {
                ...inputEdge.data,
                type: 'line-edge',
                labelShape: {
                    text: inputEdge.inputNum.toString(),
                    position: 'middle',
                },
                keyShape: {
                    endArrow: true,
                },
                labelBackgroundShape: {
                    padding: 10,
                },
            },
        };
    }
    if (xType == 'factoryOutput') {
        let outputEdge = inputData as FactoryOutputEdgeUserModel;
        return {
            ...outputEdge,
            data: {
                ...outputEdge.data,
                type: 'line-edge',
                labelShape: {
                    text: outputEdge.targetNum.toString(),
                    position: 'middle',
                },
                keyShape: {
                    endArrow: true,
                },
                labelBackgroundShape: {
                    padding: 10,
                },
            },
        };
    }
    return inputData;
};

const ProductTreePage = () => {
    const graphRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (!graphRef.current) {
            return;
        }
        const tools = ManagerTool.getInstance();

        const item = tools.items['蓝瓶'];
        const tree = itemBuildTree(item, 10);
        const data = simpleTreeMapper(tree, true);
        let productGraph = emptyProductGraph();
        addTreeToProductGraph(productGraph, tree);
        let graphData = productGraphToGraphData(productGraph);

        const G = extend(Graph, {
            edges: {
                'cubic-vertical-edge': Extensions.CubicVerticalEdge,
            },
            layouts: {
                'dagre-layout': Extensions.DagreLayout,
            },
        });

        const graph = new G({
            container: graphRef.current,
            width: 1400,
            height: 800,
            data: {
                type: 'graphData',
                value: graphData,
            },
            node: nodeExt,
            edge: edgeExt,
            modes: {
                default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
            },
            layout: {
                type: 'dagre-layout',
                direction: 'BT',
            },
        });
    }, []);

    return <div ref={graphRef}></div>;
};

export default ProductTreePage;
