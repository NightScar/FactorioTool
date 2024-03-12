import Item from '@/factorio/Item';
import ManagerTool from '@/factorio/ManagerTool';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Divider, Tag } from 'antd';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';

export class ItemContainer {
    itemPairList: { item: Item; num: number }[] = [];
    constructor() {
        makeAutoObservable(this);
    }

    public increase(itemName: string) {
        console.log('increase:', itemName);
        let flag: boolean = false;
        this.itemPairList.forEach((i) => {
            if (i.item.name == itemName) {
                i.num += 1;
                flag = true;
                return;
            }
        });
        if (!flag) {
            let item = ManagerTool.getInstance().items[itemName];
            this.itemPairList.push({ item, num: 1 });
        }
    }

    public decrease(itemName: string) {
        console.log('decrease:', itemName);
        for (let i = 0; i < this.itemPairList.length; i++) {
            let target = this.itemPairList[i];
            if (target.item.name == itemName) {
                if (target.num == 1) {
                    this.itemPairList.splice(i, 1);
                    return;
                }
                target.num -= 1;
                return;
            }
        }
    }

    public clear() {
        this.itemPairList.splice(0, this.itemPairList.length);
    }
}

export interface ItemSelectAreaProps {
    title: string;
    container: ItemContainer;
}

const ItemSelectArea: React.FC<ItemSelectAreaProps> = (props) => {
    const { title, container } = props;

    return (
        <div style={{ height: 150 }}>
            <Divider orientation="left">{title}</Divider>
            <div>
                {container.itemPairList.map((i) => (
                    <Tag key={i.item.name} color={'geekblue'}>
                        {i.item.name}: {i.num}
                        <PlusOutlined
                            onClick={() => container.increase(i.item.name)}
                        />
                        <MinusOutlined
                            onClick={() => container.decrease(i.item.name)}
                        />
                    </Tag>
                ))}
            </div>
        </div>
    );
};

export default observer(ItemSelectArea);
