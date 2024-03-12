import { makeAutoObservable } from 'mobx';
import { FactoryInstance } from './Factory';
import Formula from './Formula';
import Item from './Item';
import ManagerTool from './ManagerTool';

export class ProductProcess {
    factoryInstance: FactoryInstance;
    factoryNum: number;
    constructor(item: Item) {
        this.factoryInstance = FactoryInstance.defaultFactoryWithItem(item);
        this.factoryNum = 1;
        makeAutoObservable(this);
    }

    public static default(): ProductProcess {
        let tools = ManagerTool.getInstance();
        return new ProductProcess(tools.getItemArray()[0]);
    }

    public get productPerSec(): Formula[] {
        return this.factoryInstance.productPerSec.map((formula) => {
            return new Formula(formula.item, formula.number * this.factoryNum);
        });
    }

    public get costPerSec(): Formula[] {
        return this.factoryInstance.costPerSec.map((formula) => {
            return new Formula(formula.item, formula.number * this.factoryNum);
        });
    }

    public get productPerMin(): Formula[] {
        return this.productPerSec.map((f) => {
            return new Formula(f.item, f.number * 60);
        });
    }

    public get costPerMin(): Formula[] {
        return this.costPerSec.map((f) => {
            return new Formula(f.item, f.number * 60);
        });
    }
}

export class ProductProcessList {
    processList: ProductProcess[];
    constructor() {
        this.processList = [];
        makeAutoObservable(this);
    }

    public addProcess(): void {
        this.processList.push(ProductProcess.default());
    }

    public addProcessWithItem(item: Item): void {
        this.processList.push(new ProductProcess(item));
    }

    public get allCostPerSec(): Formula[] {
        let ret: Formula[] = [];
        this.processList.forEach((p) => {
            p.costPerSec.forEach((f) => {
                let index = ret.findIndex((v) => v.item === f.item);
                if (index === -1) {
                    ret.push(f);
                } else {
                    ret[index].number += f.number;
                }
            });
        });
        return ret;
    }

    public get allProductPerSec(): Formula[] {
        let ret: Formula[] = [];
        this.processList.forEach((p) => {
            p.productPerSec.forEach((f) => {
                let index = ret.findIndex((v) => v.item === f.item);
                if (index === -1) {
                    ret.push(f);
                } else {
                    ret[index].number += f.number;
                }
            });
        });
        return ret;
    }

    public get allCostPerMin(): Formula[] {
        return this.allCostPerSec.map((f) => {
            return new Formula(f.item, f.number * 60);
        });
    }

    public get allProductPerMin(): Formula[] {
        return this.allProductPerSec.map((f) => {
            return new Formula(f.item, f.number * 60);
        });
    }

    public get allPerMin(): ProductLine[] {
        let ret: ProductLine[] = [];
        this.allCostPerMin.forEach((f) => {
            let index = ret.findIndex((v) => v.item === f.item);
            if (index === -1) {
                ret.push({ item: f.item, cost: f.number, product: 0 });
            } else {
                ret[index].cost += f.number;
            }
        });
        this.allProductPerMin.forEach((f) => {
            let index = ret.findIndex((v) => v.item === f.item);
            if (index === -1) {
                ret.push({ item: f.item, cost: 0, product: f.number });
            } else {
                ret[index].product += f.number;
            }
        });
        return ret;
    }
}

export interface ProductLine {
    item: Item;
    cost: number;
    product: number;
}
