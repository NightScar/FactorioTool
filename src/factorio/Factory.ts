import { FactoryConfig } from './factoryConfig';
import Item from '@/factorio/Item';
import FactoryPlugin from './Plugin';
import Formula from './Formula';
import { plugin } from 'umi';

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

    constructor(name: string, icon: string, speed: number, space: number, iconPosition: number[]) {
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
            config.iconPosition
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
        productPerSec.push(
            new Formula(item, perSecProductLoop * finalProduct),
        );
        return {
            factory: this,
            item: item,
            finalSpeed,
            costPerSec: costRet,
            productPerSec,
        };
    };
}

export class FactoryWithPlugin {
    factory: Factory;
    pluginList: { plugin: FactoryPlugin; num: number }[];

    constructor(factory: Factory){
        this.factory = factory;
        this.pluginList = [];
    }

}
export default Factory;
