import React, { useState } from 'react';
import { Divider, Tag } from 'antd';
import { PlusOutlined, MinusOutlined} from '@ant-design/icons';

interface ItemSelectAreaProps { 
    title: string;
    data: ItemData;
    add: (name: string) => void;
    remove: (name: string) => void;
    decrease: (name: string) => void;
}
export interface ItemData{
    [itemName: string]: number
}

export const useItemSelectArea: () => {
    data: ItemData;
    add: (name: string) => void;
    remove: (name: string) => void;
    decrease: (name: string) => void;
} = () => {
    const [ data, setData ] = useState<ItemData>({});
    const add = (name: string) => {
        if (!data[name]) {
            data[name] = 1;
        } else {
            data[name]++;
        }
        console.log("add:" + name);
        setData({...data});
    };
    const remove = (name: string) => {
        delete data[name];
        setData({...data});
    };
    const decrease = (name: string) => {
        if (data[name]) {
            data[name]--;
        }
        setData({...data});
    }
    return {
        data,
        add,
        remove,
        decrease
    }
}

const ItemSelectArea : React.FC<ItemSelectAreaProps> = (props) => {
    const { title, data, add, remove, decrease } = props;
    const renderTags: () => React.ReactElement[] = () => {
        let ret: React.ReactElement[] = [];
        for (let name in data) {
            ret.push(<Tag
                key={name}
                closable
                onClose={() => remove(name)}
                color={'geekblue'}
            >
                {name}: {data[name]}
                <PlusOutlined onClick={() => add(name)}/>                    
                <MinusOutlined onClick={()=>decrease(name)}/>
            </Tag >);
        }
        return ret;
    };

    return <div style={{height: 150}}>
        <Divider orientation='left'>
            {title}
        </Divider>
        <div>
            {renderTags()}
        </div>
    </div>;
};

export default ItemSelectArea;