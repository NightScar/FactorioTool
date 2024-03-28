import FactoryDefinition from '@/factorio/Factory';
import { EdgeUserModel, GraphData, NodeUserModel, TreeData } from '@antv/g6';
import { v4 } from 'uuid';
import Item from './Item';
import ManagerTool from './ManagerTool';

export interface ProductTreeElement {
    id: string;
    itemNodes: { item: Item; num: number };
    children: ProductTreeElement[];
}

export const itemBuildTree = (item: Item, num: number): ProductTreeElement => {
    let ret: ProductTreeElement = {
        id: item.name,
        itemNodes: { item, num },
        children: [],
    };
    if (item.formulaList.length == 0) {
        return ret;
    }
    ret.children = item.formulaList.map((f) => {
        return itemBuildTree(
            f.item,
            (num / (item.productNumber * 1.0)) * f.number,
        );
    });
    return ret;
};

export const simpleTreeMapper = (
    tree: ProductTreeElement,
    isRoot: boolean,
): TreeData => {
    return {
        id: tree.id + v4(),
        data: {
            type: 'image-node',
            itemIconPosition: tree.itemNodes.item.iconPosition,
            label: tree.itemNodes.item.name + ' ' + tree.itemNodes.num,
            isRoot: isRoot,
            iconShape: {
                src:
                    '/icon/item/' +
                    tree.itemNodes.item.iconPosition[0] +
                    '_' +
                    tree.itemNodes.item.iconPosition[1] +
                    '.png',
                width: 34,
                height: 34,
            },
            badgeShapes: [
                {
                    text: tree.itemNodes.num.toString(),
                    position: 'top',
                },
            ],
        },
        children: tree.children.map((c) => simpleTreeMapper(c, false)),
    };
};

// 物品节点的Node
export interface ItemNodeUserModel extends NodeUserModel {
    xType: 'item';
    item: Item;
    itemNum: number;
}

export interface FactoryNodeUserModel extends NodeUserModel {
    xType: 'factory';
    factory: FactoryDefinition;
    productTarget: Item;
}

export interface FactoryInputEdgeUserModel extends EdgeUserModel {
    xType: 'factoryInput';
    inputItem: Item;
    targetItem: Item;
    inputNum: number;
}

export interface FactoryOutputEdgeUserModel extends EdgeUserModel {
    xType: 'factoryOutput';
    targetItem: Item;
    targetNum: number;
}

export interface ProductGraph {
    itemNodes: { [key: string]: ItemNodeUserModel };
    factoryNodes: { [key: string]: FactoryNodeUserModel };
    inputEdges: { [key: string]: FactoryInputEdgeUserModel }; // source是子物品, target是生产的父物品, 用来定位唯一的工厂
    outputEdges: { [key: string]: FactoryOutputEdgeUserModel };
}

export const emptyProductGraph = (): ProductGraph => {
    return {
        itemNodes: {},
        factoryNodes: {},
        inputEdges: {},
        outputEdges: {},
    };
};

export const productGraphToGraphData = (g: ProductGraph): GraphData => {
    let n: NodeUserModel[] = [];
    let e: EdgeUserModel[] = [];
    for (const key in g.itemNodes) {
        n.push(g.itemNodes[key]);
    }
    for (const key in g.factoryNodes) {
        n.push(g.factoryNodes[key]);
    }
    for (const key in g.inputEdges) {
        e.push(g.inputEdges[key]);
    }
    for (const key in g.outputEdges) {
        e.push(g.outputEdges[key]);
    }

    return {
        nodes: n,
        edges: e,
    };
};

export const addTreeToProductGraph: (
    graph: ProductGraph,
    tree: ProductTreeElement,
) => ProductGraph = (graph, tree) => {
    const defaultFactory =
        ManagerTool.getInstance().getAllFactoryDefinition()[0];
    // 处理物品节点 --------------------------------------------------------------------
    // item node id = item.name
    let itemId = tree.itemNodes.item.name;
    let itemNode = graph.itemNodes[itemId];
    if (itemNode == undefined) {
        graph.itemNodes[itemId] = {
            id: itemId,
            data: {},
            xType: 'item',
            item: tree.itemNodes.item,
            itemNum: tree.itemNodes.num,
        };
    } else {
        itemNode.itemNum += tree.itemNodes.num;
    }
    // ---- break;
    if (tree.children == undefined || tree.children.length == 0) {
        return graph;
    }

    // 处理工厂的节点 ----------------------------------------------------------------------
    let factoryId = 'factory_' + itemId;
    let facotryNode = graph.factoryNodes[factoryId];
    if (facotryNode == undefined) {
        graph.factoryNodes[factoryId] = {
            id: factoryId,
            data: {},
            xType: 'factory',
            productTarget: tree.itemNodes.item,
            factory: defaultFactory,
        };
    }
    // 处理工厂到物品的边 -----------------------------------------------------------------
    let factoryOutputId = factoryId + '_edge';
    let factoryOutputEdge = graph.outputEdges[factoryOutputId];
    if (factoryOutputEdge == undefined) {
        graph.outputEdges[factoryOutputId] = {
            id: factoryOutputId,
            data: {},
            xType: 'factoryOutput',
            targetItem: tree.itemNodes.item,
            targetNum: tree.itemNodes.num,
            source: factoryId,
            target: itemId,
        };
    } else {
        factoryOutputEdge.targetNum += tree.itemNodes.num;
    }
    // 处理子物品到工厂的边 -----------------------------------------------------------------
    tree.children.forEach((t) => {
        let factoryInputId = t.itemNodes.item.name + '_' + factoryId;
        let factoryInputEdge = graph.inputEdges[factoryInputId];
        if (factoryInputEdge == undefined) {
            graph.inputEdges[factoryInputId] = {
                id: factoryInputId,
                data: {},
                xType: 'factoryInput',
                inputItem: t.itemNodes.item,
                inputNum: t.itemNodes.num,
                targetItem: tree.itemNodes.item,
                source: t.itemNodes.item.name,
                target: factoryId,
            };
        } else {
            factoryInputEdge.inputNum += t.itemNodes.num;
        }
        addTreeToProductGraph(graph, t);
    });

    return graph;
};

/**
 * 生成一个物品的生产图, 不递归深度
 * 包括到子配方的工厂的边, 子配方工厂节点, 子配方工厂到子配方物品的边, 子配方物品节点
 * 注意: 这个方法里的graph不可能重复, 所以不需要处理
 * @param item 想要构建的物品
 * @param num 构建数量
 * @returns 生成的图, 不包括深度, 也不包括item本身
 */
export const itemBuildGraphNoDeep = (item: Item, num: number): ProductGraph => {
    const defaultFactory =
        ManagerTool.getInstance().getAllFactoryDefinition()[0];

    let ret: ProductGraph = {
        itemNodes: [],
        factoryNodes: [],
        inputEdges: [],
        outputEdges: [],
    };
    if (item.formulaList.length == 0) {
        return ret;
    }
    item.formulaList.forEach((f) => {
        // 工厂到被分析物品的边
        ret.outputEdges.push({
            source: defaultFactory,
            target: item,
            outputNum: num,
        });
        // 工厂的点, 数量先给1
        ret.factoryNodes.push({
            productItem: item,
            factory: defaultFactory,
            factoryNum: 1,
        });
        // 子配方物品到工厂的边
        ret.inputEdges.push({
            source: f.item,
            target: item,
            inputNum: (num / (item.productNumber * 1.0)) * f.number,
        });
        // 子配方物品的点
        ret.itemNodes.push({
            item: f.item,
            num: (num / (item.productNumber * 1.0)) * f.number,
        });
    });
    return ret;
};

export const mergeBuildGraph = (
    target: ProductGraph,
    graph: ProductGraph,
): ProductGraph => {
    // 合并itemNodes
    graph.itemNodes.forEach((n) => {
        let flag = false;
        target.itemNodes.forEach((tn) => {
            if (tn.item.name == n.item.name) {
                tn.num += n.num;
                flag = true;
            }
        });
        if (!flag) {
            target.itemNodes.push(n);
        }
    });
    // 合并factoryNodes
    graph.factoryNodes.forEach((n) => {
        let flag = false;
        target.factoryNodes.forEach((tn) => {
            if (
                tn.productItem.name == n.productItem.name &&
                tn.factory.name == n.factory.name
            ) {
                tn.factoryNum += n.factoryNum;
                flag = true;
            }
        });
        if (!flag) {
            target.factoryNodes.push(n);
        }
    });
    // 合并inputEdges
    graph.inputEdges.forEach((e) => {
        let flag = false;
        target.inputEdges.forEach((te) => {
            if (
                te.source.name == e.source.name &&
                te.target.name == e.target.name
            ) {
                te.inputNum += e.inputNum;
                flag = true;
            }
        });
        if (!flag) {
            target.inputEdges.push(e);
        }
    });
    // 合并outputEdges
    graph.outputEdges.forEach((e) => {
        let flag = false;
        target.outputEdges.forEach((te) => {
            if (
                te.source.name == e.source.name &&
                te.target.name == e.target.name
            ) {
                te.outputNum += e.outputNum;
                flag = true;
            }
        });
        if (!flag) {
            target.outputEdges.push(e);
        }
    });
    return target;
};

export const itemBuildGraph = (item: Item, num: number): ProductGraph => {
    let g = itemBuildGraphNoDeep(item, num);
    return g;
};
