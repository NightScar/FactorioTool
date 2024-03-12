import Item from '@/factorio/Item';
import { makeAutoObservable } from 'mobx';
import Formula from './Formula';
import ManagerTool from './ManagerTool';
import FactoryPlugin from './Plugin';
import { FactoryConfig } from './factoryConfig';

export interface FactoryAnalysisResult {
    factory: FactoryDefinition;
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

/**
 * 工厂定义
 **/
class FactoryDefinition {
    /** 工程名称 */
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

    public static loadFromConfig: (config: FactoryConfig) => FactoryDefinition =
        (config) => {
            return new FactoryDefinition(
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
        plugins.forEach((p) => {
            s = s + parseInt((p.speedUp * 100).toString());
            pr = pr + parseInt((p.productUp * 100.0).toString());
        });
        let finalSpeed = this.speed * (s / 100.0);
        let finalProduct = pr / 100.0;
        let perSecProductLoop = finalSpeed / (item.buildTime * 1.0);
        let costRet: Formula[] = [];
        item.formulaList.forEach((f) => {
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
        let ret: FactoryDefinition[] = [];
        const m = ManagerTool.getInstance();
        for (let i in m.factory) {
            ret.push(m.factory[i]);
        }
        return ret;
    }
}

/** 工厂实例 */
export class FactoryInstance {
    factoryDefinition: FactoryDefinition;
    item: Item;
    pulignList: PluginList = new PluginList();

    constructor(item: Item, factory: FactoryDefinition) {
        this.item = item;
        this.factoryDefinition = factory;
        makeAutoObservable(this);
    }

    public static defaultFactory(): FactoryInstance {
        let m = ManagerTool.getInstance();
        let factory = m.factory['3级工厂'];
        let item = m.items['铁板'];
        return new FactoryInstance(item, factory);
    }

    public static defaultFactoryWithItem(item: Item): FactoryInstance {
        let m = ManagerTool.getInstance();
        let factory = m.factory['3级工厂'];
        return new FactoryInstance(item, factory);
    }

    public get analysisResult(): FactoryAnalysisResult {
        return this.factoryDefinition.analysisProduct(
            this.item,
            this.pulignList.flatten(),
        );
    }

    public get productPerSec(): Formula[] {
        return this.analysisResult.productPerSec;
    }

    public get costPerSec(): Formula[] {
        return this.analysisResult.costPerSec;
    }
}

export class PluginList {
    pluginList: { plugin: FactoryPlugin; pluginNum: number }[] = [];

    constructor() {
        const m = ManagerTool.getInstance();
        for (let i in m.plugin) {
            this.pluginList.push({ plugin: m.plugin[i], pluginNum: 0 });
        }
        makeAutoObservable(this);
    }

    public onChange(pluginName: string, num: number) {
        console.log('PluginList pluginOnChange()');
        this.pluginList.forEach((o) => {
            if (o.plugin.name == pluginName) {
                o.pluginNum = num;
            }
        });
    }

    /**平铺插件 */
    public flatten() {
        let ret: FactoryPlugin[] = [];
        this.pluginList.forEach((pn) => {
            for (let i = 0; i < pn.pluginNum; i++) {
                ret.push(pn.plugin);
            }
        });
        return ret;
    }
}

export class FactoryGroup {
    private factoryInstance: FactoryInstance;
    private factoryNum: number = 1;
    productPerSec: number;
    costPerSec: Formula[];
    onFresh?: () => void;

    constructor(factoryInstance: FactoryInstance) {
        this.factoryInstance = factoryInstance;
    }

    public static defaultFactoryGroup() {
        return new FactoryGroup(FactoryInstance.defaultFactory());
    }

    public getProductPerSec(): Formula[] {
        return this.factoryInstance.getProductPreSec().map((f) => {
            f.number = f.number * this.factoryNum;
        });
    }

    public getCostPerSec() {
        this.factoryInstance.getCostPerSec().map((f) => {
            f.number = f.number * this.factoryNum;
        });
    }

    public getFactoryNum() {
        return this.factoryNum;
    }
    public changeNum(factoryNum: number) {
        this.factoryNum = factoryNum;
        this.reCal();
    }

    public changeFactory(factory: FactoryDefinition) {
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
    onFresh?: () => void;

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
        this.groups.forEach((g) => {
            p = p + g.productPerSec;
            Formula.mergeList(c, g.costPerSec);
        });
        this.productPerSec = p;
        this.costPerSec = c;
        if (this.onFresh) {
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

    public changeFactory(factory: FactoryDefinition, groupIndex: number) {
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

export default FactoryDefinition;
