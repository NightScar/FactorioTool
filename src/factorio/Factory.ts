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

export interface FactoryContent {
    name: string;
    icon: string;
    speed: number;
    space: number;
    iconPosition: number[];
}

class Factory {
    readonly name: string;
    readonly icon: string;
    readonly speed: number;
    readonly space: number;
    readonly iconPosition: number[];
    onFresh?: ()=>void;

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
    onFresh?: ()=>void;

    constructor(item: Item, factory: Factory) {
        console.log('FactoryWithPlugin constructor()');
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
        console.log('FactoryWithPlugin pluginOnChange()');
        this.pluginList.forEach(o => {
            if (o.plugin.name == plugin.name) {
                o.pluginNum = num;
            }
        });
        this.reCal();
    }

    public factoryOnChange(factory: Factory) {
        console.log('FactoryWithPlugin factoryOnChange()');
        this.factory = factory;
        this.reCal();
    }

    public reCal() {
        console.log('FactoryWithPlugin reCal()');
        let calResult = this.factory.analysisProduct(
            this.item,
            this.getPluginInOneList(),
        );
        this.finalSpeed = calResult.finalSpeed;
        this.productPerSec = calResult.productPerSec[0].number;
        this.costPerSec = calResult.costPerSec;
        if(this.onFresh){
            this.onFresh();
        }
    }

    public static defaultInstance(item: Item) {
        console.log('FactoryWithPlugin defaultInstance()');
        let m = ManagerTool.getInstance();
        return new FactoryWithPlugin(item, m.factory['3级工厂']);
    }
}

export class FactoryGroup {
    factoryWithPlugin: FactoryWithPlugin;
    factoryNum: number = 1;
    productPerSec: number;
    costPerSec: Formula[];
    onFresh?: ()=>void;

    constructor(item: Item, factory: Factory) {
        console.log('FactoryGroup constructor()');
        this.factoryWithPlugin = new FactoryWithPlugin(item, factory);
        this.productPerSec =
            this.factoryWithPlugin.productPerSec * this.factoryNum;
        this.costPerSec = [];
        this.reCalCostList();
        this.factoryWithPlugin.onFresh = () => { this.factoryWithPlugin = { ...this.factoryWithPlugin} };
    }

    private reCalCostList() {
        console.log('FactoryGroup reCalCostList()');
        let list: Formula[] = [];
        this.factoryWithPlugin.costPerSec.forEach(f => {
            list.push(new Formula(f.item, f.number * this.factoryNum));
        });
        this.costPerSec = list;
    }

    public reCal() {
        console.log('FactoryGroup reCal()');
        this.factoryWithPlugin.reCal();
        this.reCalCostList();
        this.productPerSec =
            this.factoryWithPlugin.productPerSec * this.factoryNum;
    }

    public factoryNumOnChange(factoryNum: number) {
        console.log('FactoryGroup factoryNumOnChange()');
        this.factoryNum = factoryNum;
        this.reCal();
    }

    public changeFactory(factory: Factory) {
        console.log('FactoryGroup changeFactory()');
        this.factoryWithPlugin.factoryOnChange(factory);
        this.reCal();
    }

    public changePlugin(plugin: FactoryPlugin, pluginNum: number) {
        console.log('FactoryGroup changePlugin()');
        this.factoryWithPlugin.pluginOnChange(plugin, pluginNum);
        this.reCal();
    }
}

export class FactoryGroupHolder {
    item: Item;
    groups: FactoryGroup[] = [];
    productPerSec: number;
    costPerSec: Formula[];
    onFresh?: ()=>void;

    constructor(item: Item) {
        console.log('FactoryGroupHolder constructor()');
        this.item = item;
        const m: ManagerTool = ManagerTool.getInstance();
        this.groups.push(new FactoryGroup(item, m.factory['3级工厂']));
        this.productPerSec = this.groups[0].productPerSec;
        this.costPerSec = this.groups[0].costPerSec;
    }

    public addGroup() {
        console.log('FactoryGroupHolder addGroup()');
        const m: ManagerTool = ManagerTool.getInstance();
        this.groups.push(new FactoryGroup(this.item, m.factory['3级工厂']));
        this.reCal();
    }

    public reCal() {
        console.log('FactoryGroupHolder reCal()');
        let p: number = 0;
        let c: Formula[] = [];
        this.groups.forEach(g => {
            p = p + g.productPerSec;
            Formula.mergeList(c, g.costPerSec);
        });
        this.productPerSec = p;
        this.costPerSec = c;
        if(this.onFresh){
            this.onFresh();
        }
    }

    public deleteGroup(index: number) {
        console.log('FactoryGroupHolder deleteGroup()');
        let g: FactoryGroup = this.groups[index];
        if (g) {
            this.groups.splice(g, 1);
        }
        this.reCal();
    }

    public changeFactory(factory: Factory, groupIndex: number) {
        console.log('FactoryGroupHolder changeFactory()');
        let g: FactoryGroup = this.groups[groupIndex];
        g.changeFactory(factory);
        this.reCal();
    }

    public changeFacNum(facNum: number, groupIndex: number) {
        console.log('FactoryGroupHolder changeFacNum()');
        let g: FactoryGroup = this.groups[groupIndex];
        g.factoryNumOnChange(facNum);
        this.reCal();
    }

    public changePlugin(
        plugin: FactoryPlugin,
        pluginNum: number,
        groupIndex: number,
    ) {
        console.log('FactoryGroupHolder changePlugin()');
        let g: FactoryGroup = this.groups[groupIndex];
        g.changePlugin(plugin, pluginNum);
        this.reCal();
    }
}

export default Factory;
