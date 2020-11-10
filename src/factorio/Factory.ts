import { FactoryConfig } from './factoryConfig';
import Item from '@/factorio/Item';
import FactoryPlugin from './Plugin';
import Formula from './Formula';
import { plugin } from 'umi';
import ManagerTool from './ManagerTool';

export interface FactoryAnalysisResult {
    factory: Factory;
    item: Item;
    finalSpeed: number;
    costPerSec: Formula[];
    productPerSec: Formula[];
}

class Factory {
    readonly name: string;
    readonly icon: string;
    readonly speed: number;
    readonly space: number;
    readonly iconPosition: number[];

    constructor(
        name: string,
        icon: string,
        speed: number,
        space: number,
        iconPosition: number[],
    ) {
        this.name = name;
        this.icon = icon;
        this.speed = speed;
        this.space = space;
        this.iconPosition = iconPosition;
    }

    public static loadFromConfig: (
        config: FactoryConfig,
    ) => Factory = config => {
        return new Factory(
            config.name,
            config.icon,
            config.speed,
            config.space,
            config.iconPosition,
        );
    };

    public getIconUrl: () => string = () => {
        return '/icon/' + this.icon + '.png';
    };

    public analysisProduct: (
        item: Item,
        plugins: FactoryPlugin[],
    ) => FactoryAnalysisResult = (item, plugins) => {
        let s = 100,
            pr = 100;
        plugins.forEach(p => {
            s = s + parseInt((p.speedUp * 100).toString());
            pr = pr + parseInt((p.productUp * 100.0).toString());
        });
        let finalSpeed = this.speed * (s / 100.0);
        let finalProduct = pr / 100.0;
        let perSecProductLoop = finalSpeed / (item.buildTime * 1.0);
        let costRet: Formula[] = [];
        item.formulaList.forEach(f => {
            costRet.push(new Formula(f.item, f.number * perSecProductLoop));
        });
        let productPerSec: Formula[] = [];
        productPerSec.push(new Formula(item, perSecProductLoop * finalProduct));
        return {
            factory: this,
            item: item,
            finalSpeed,
            costPerSec: costRet,
            productPerSec,
        };
    };

    public static allFactory() {
        let ret: Factory[] = [];
        const m = ManagerTool.getInstance();
        for (let i in m.factory) {
            ret.push(m.factory[i]);
        }
        return ret;
    }
}

export class FactoryWithPlugin {
    item: Item;
    factory: Factory;
    pluginList: { plugin: FactoryPlugin; pluginNum: number }[];
    finalSpeed: number = 1.0;
    productPerSec: number = 1;
    costPerSec: Formula[] = [];

    constructor(item: Item, factory: Factory) {
        this.item = item;
        this.factory = factory;
        this.pluginList = [];
        const m = ManagerTool.getInstance();
        for (let i in m.plugin) {
            this.pluginList.push({ plugin: m.plugin[i], pluginNum: 0 });
        }
    }

    public getPluginInOneList() {
        let ret: FactoryPlugin[] = [];
        this.pluginList.forEach(pn => {
            for (let i = 0; i < pn.pluginNum; i++) {
                ret.push(pn.plugin);
            }
        });
        return ret;
    }

    public pluginOnChange(plugin: FactoryPlugin, num: number) {
        this.pluginList.forEach(o => {
            if (o.plugin.name == plugin.name) {
                o.pluginNum = num;
            }
        });
        this.reCal();
    }

    public factoryOnChange(factory: Factory) {
        this.factory = factory;
        this.reCal();
    }

    public reCal() {
        let calResult = this.factory.analysisProduct(
            this.item,
            this.getPluginInOneList(),
        );
        this.finalSpeed = calResult.finalSpeed;
        this.productPerSec = calResult.productPerSec[0].number;
        this.costPerSec = calResult.costPerSec;
    }

    public static defaultInstance(item: Item) {
        let m = ManagerTool.getInstance();
        return new FactoryWithPlugin(item, m.factory['3级工厂']);
    }
}

export class FactoryGroup {
    factoryWithPlugin: FactoryWithPlugin;
    factoryNum: number = 1;
    productPerSec: number;
    costPerSec: Formula[];

    constructor(item: Item, factory: Factory) {
        this.factoryWithPlugin = new FactoryWithPlugin(item, factory);
        this.productPerSec =
            this.factoryWithPlugin.productPerSec * this.factoryNum;
        this.costPerSec = [];
        this.reCalCostList();
    }

    private reCalCostList() {
        let list: Formula[] = [];
        this.factoryWithPlugin.costPerSec.forEach(f => {
            list.push(new Formula(f.item, f.number * this.factoryNum));
        });
        this.costPerSec = list;
    }

    public reCal() {
        this.factoryWithPlugin.reCal();
        this.reCalCostList();
        this.productPerSec =
            this.factoryWithPlugin.productPerSec * this.factoryNum;
    }

    public factoryNumOnChange(factoryNum: number) {
        this.factoryNum = factoryNum;
        this.reCal();
    }

    public changeFactory(factory: Factory) {
        this.factoryWithPlugin.factoryOnChange(factory);
        this.reCal();
    }

    public changePlugin(plugin: FactoryPlugin, pluginNum: number) {
        this.factoryWithPlugin.pluginOnChange(plugin, pluginNum);
        this.reCal();
    }
}

export class FactoryGroupHolder {
    item: Item;
    groups: FactoryGroup[] = [];
    productPerSec: number;
    costPerSec: Formula[];

    constructor(item: Item) {
        this.item = item;
        const m: ManagerTool = ManagerTool.getInstance();
        this.groups.push(new FactoryGroup(item, m.factory['3级工厂']));
        this.productPerSec = this.groups[0].productPerSec;
        this.costPerSec = this.groups[0].costPerSec;
    }

    public addGroup() {
        const m: ManagerTool = ManagerTool.getInstance();
        this.groups.push(new FactoryGroup(this.item, m.factory['3级工厂']));
        this.reCal();
    }

    public reCal() {
        let p: number = 0;
        let c: Formula[] = [];
        this.groups.forEach(g => {
            p = p + g.productPerSec;
            Formula.mergeList(c, g.costPerSec);
        });
        this.productPerSec = p;
        this.costPerSec = c;
    }

    public deleteGroup(index: number) {
        let g: FactoryGroup = this.groups[index];
        if (g) {
            this.groups.splice(g, 1);
        }
        this.reCal();
    }

    public changeFactory(factory: Factory, groupIndex: number) {
        let g: FactoryGroup = this.groups[groupIndex];
        g.changeFactory(factory);
        this.reCal();
    }

    public changeFacNum(facNum: number, groupIndex: number) {
        let g: FactoryGroup = this.groups[groupIndex];
        g.factoryNumOnChange(facNum);
        this.reCal();
    }

    public changePlugin(
        plugin: FactoryPlugin,
        pluginNum: number,
        groupIndex: number,
    ) {
        let g: FactoryGroup = this.groups[groupIndex];
        g.changePlugin(plugin, pluginNum);
        this.reCal();
    }
}

export default Factory;
