import { PluginConfig } from './factoryConfig';
class FactoryPlugin{
    readonly name: string;
    readonly icon: string;
    readonly speedUp: number;
    readonly productUp: number;

    constructor(name: string, icon: string, speedUp: number, productUp: number) {
        this.name= name;
        this.icon = icon;
        this.speedUp = speedUp;
        this.productUp = productUp;
    }

    public static loadFromConfig : (config : PluginConfig) => FactoryPlugin = (config) =>{
        return new FactoryPlugin(config.name, config.icon, config.speedUp, config.productUp);
    }

    public getIconUrl : () => string = () => {
        return '/icon/' + this.icon + '.png';
    }
}

export default FactoryPlugin;