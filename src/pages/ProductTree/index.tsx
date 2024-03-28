import ManagerTool from '@/factorio/ManagerTool';
import { itemBuildTree, simpleTreeMapper } from '@/factorio/ProductGraph';
import { Graph, NodeDisplayModel, NodeModel, extend } from '@antv/g6';
import { useEffect, useRef } from 'react';

const nodeExt = (inputData: NodeModel): NodeDisplayModel => {
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
            // layouts: {
            //     'compact-layout': Extensions.compactBox,
            // },
        });

        const graph = new G({
            container: graphRef.current,
            width: 1400,
            height: 800,
            data: {
                type: 'treeData',
                value: data,
            },
            // node: nodeExt,
            modes: {
                default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
            },
            layout: {
                type: 'compactBox',
                direction: 'TB',
            },
        });
    }, []);

    return <div ref={graphRef}></div>;
};

export default ProductTreePage;
