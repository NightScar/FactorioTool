import Formula from './Formula';
import Item from './Item';
import ItemConfig from './itemConfig';
import Factory from './Factory';
import FactoryPlugin from './Plugin';
import FactoryConfig from './factoryConfig';

class ManagerTool {
    items: { [name: string]: Item } = {};
    factory: { [name: string]: Factory } = {};
    plugin: { [name: string]: FactoryPlugin } = {};

    private static _instance: ManagerTool;

    initItem(): void {
        ItemConfig.items.forEach(config => {
            this.items[config.name] = new Item(
                config.name,
                config.buildTime,
                config.productNumber,
                config.iconPosition,
            );
        });
        ItemConfig.items.forEach(config => {
            config.formulaList.forEach(formulaConfig => {
                this.items[config.name].formulaList.push(
                    new Formula(
                        this.items[formulaConfig.name],
                        formulaConfig.num,
                    ),
                );
            });
        });
        FactoryConfig.factory.forEach(c => {
            this.factory[c.name] = Factory.loadFromConfig(c);
        });
        FactoryConfig.plugin.forEach(c => {
            this.plugin[c.name] = FactoryPlugin.loadFromConfig(c);
        });
    }

    public static getInstance(): ManagerTool {
        if (this._instance == undefined) {
            this._instance = new ManagerTool();
            this._instance.initItem();
        }
        return this._instance;
    }

    public expandFormulaList(fl: { name: string; num: number }[]): Formula[] {
        let sourceList: Formula[] = [];
        fl.forEach(f => {
            sourceList.push(new Formula(this.items[f.name], f.num));
        });
        let ret: Formula[] = [];
        sourceList.forEach(f => {
            Formula.mergeList(ret, f.expandToHistory());
        });
        return ret;
    }

    public getItemArray(): Item[] {
        let ret = [];
        for (let i in this.items) {
            ret.push(this.items[i]);
        }
        return ret;
    }
}

export default ManagerTool;
