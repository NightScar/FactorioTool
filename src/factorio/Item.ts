import Formula from './Formula';

class Item {
    readonly name: string;
    readonly buildTime: number;
    readonly productNumber: number;
    isLeaf: boolean = false;
    formulaList: Formula[] = [];
    iconPosition: number[] = [];

    constructor(
        name: string,
        buildTime: number,
        productNumber: number,
        iconPosition: number[] | undefined,
    ) {
        this.name = name;
        this.buildTime = buildTime;
        this.productNumber = productNumber;
        this.iconPosition = iconPosition ? iconPosition : [];
    }

    public buildBasicFormulaList(): Formula[] {
        let ret: Formula[] = [];
        this.formulaList.forEach((f) => {
            let fList: Formula[] = f.expandToBasic();
            console.log('bulid basic: expand result size: ' + fList.length);
            fList.forEach((f1) => {
                f1.number = f1.number / this.productNumber;
                Formula.merge(ret, f1);
                console.log(
                    'buildBasic: merge : ' + f1.item.name + ' ' + f1.number,
                );
                console.log('merge result: ' + ret.length);
            });
        });
        return ret;
    }
}

export default Item;
