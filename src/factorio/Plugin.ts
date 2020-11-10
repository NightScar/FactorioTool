import { PluginConfig } from './factoryConfig';
class FactoryPlugin{
    readonly name: string;
    readonly icon: string;
    readonly speedUp: number;
    readonly productUp: number;
    readonly iconPosition: number[];

    constructor(name: string, icon: string, speedUp: number, productUp: number, iconPosition: number[]) {
        this.name= name;
        this.icon = icon;
        this.speedUp = speedUp;
        this.productUp = productUp;
        this.iconPosition = iconPosition;
    }

    public static loadFromConfig : (config : PluginConfig) => FactoryPlugin = (config) =>{
        return new FactoryPlugin(config.name, config.icon, config.speedUp, config.productUp, config.iconPosition);
    }

    public getIconUrl : () => string = () => {
        return '/icon/' + this.icon + '.png';
    }
}

export default FactoryPlugin;