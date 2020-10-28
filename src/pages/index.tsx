import React from 'react';
import styles from './index.less';
import ManagerTool from '../factorio/ManagerTool';

export default () => {
    const manager = ManagerTool.getInstance();
    const result = manager.expandFormulaList([{ name: '绿瓶', num: 1 }]);
    // const result = manager.expandFormulaList([{ name: '红瓶', num: 1 }]);
    // const result = manager.expandFormulaList([{ name: '铁齿轮', num: 1 }]);
    const show: () => any[] = () => {
        let ret: any[] = [];
        result.forEach((r, index) => {
            ret.push(
                <h2 key={r.item.name + index}>
                    {r.item.name}, {r.number}
                </h2>,
            );
        });
        return ret;
    };
    return (
        <div>
            <h1 className={styles.title}>Page index</h1>
            {show()}
        </div>
    );
};
