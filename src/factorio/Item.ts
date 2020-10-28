import Formula from './Formula';

class Item {
    readonly name: string;
    readonly buildTime: number;
    readonly productNumber: number;
    isLeaf: boolean = false;
    formulaList: Formula[] = [];

    constructor(name: string, buildTime: number, productNumber: number) {
        this.name = name;
        this.buildTime = buildTime;
        this.productNumber = productNumber;
    }

    public buildBasicFormulaList(): Formula[] {
        let ret: Formula[] = [];
        this.formulaList.forEach(f => {
            let fList: Formula[] = f.expandToBasic();
            fList.forEach(f1 => {
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
