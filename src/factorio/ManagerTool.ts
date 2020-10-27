import Formula from './Formula';
import Item from './Item';
import ItemConfig from './itemConfig';

class ManagerTool{
    items: { [name: string]: Item } = {};

    private static _instance: ManagerTool;

    initItem() : void{
        ItemConfig.items.forEach(config => {
            this.items[config.name] = new Item(config.name, config.buildTime, config.productName);
        });
        ItemConfig.items.forEach(config => {
            config.formulaList.forEach(formulaConfig => {
                this.items[config.name].formulaList.push(
                    new Formula(this.items[formulaConfig.name], formulaConfig.num)
                );
            });
        });
    }

    public static getInstance(): ManagerTool {
        if (this._instance == undefined) {
            this._instance = new ManagerTool();
            this._instance.initItem();
        }
        return this._instance;
    }

    public expandFormulaList(fl: { name: string, num: number }[]): Formula[] {
        let sourceList: Formula[] = [];
        fl.forEach(f => {
            sourceList.push(new Formula(this.items[f.name], f.num));
        });
        let ret: Formula[] = [];
        sourceList.forEach(f => {
            Formula.mergeList(ret,  f.expandToBasic());
        });
        return ret;
    }
}

export default ManagerTool;