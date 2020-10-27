import React from 'react';
import styles from './index.less';
import ManagerTool from '../factorio/ManagerTool';

export default () => {
    const manager = ManagerTool.getInstance();
    const result = manager.expandFormulaList([{ name: '绿瓶', num: 1 }]);
    const show: () => any[] = () => {
        let ret: any[] = [];
        result.forEach(r => {
            ret.push(
                <h2>
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
