import ManagerTool from '@/factorio/ManagerTool';
import { itemBuildTree, simpleTreeMapper } from '@/factorio/ProductGraph';
import { Graph, NodeDisplayModel, NodeModel, extend } from '@antv/g6';
import { useEffect, useRef } from 'react';

const nodeFun: (data: NodeModel) => NodeDisplayModel = (data) => {
    return {
        id: data.id,
        data: {
            ...data,
            type: 'image-node',
            keyShape: {
                src: '/icon/Iconsheet_32.png',
                width: 34,
                height: 34,
                // clipPath: 'circle(40%)',
                clipCfg: {
                    type: 'rect',
                    show: true,
                },
            },
            labelShape: {
                position: 'bottom',
                maxWidth: '500%',
            },
            badgeShapes: {
                text: data.itemNum,
                position: 'bottom',
            },
        },
    };
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

        const G = extend(Graph, {
            nodes: {
                // 'image-node': Extensions.Node
            },
        });

        const graph = new G({
            container: graphRef.current,
            width: 800,
            height: 600,
            data: {
                type: 'treeData',
                value: data,
            },
            modes: {
                default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
            },
            layout: {
                type: 'compactBox',
                direction: 'TB',
            },
            node: nodeFun,
        });
    }, []);

    return <div ref={graphRef}></div>;
};

export default ProductTreePage;
