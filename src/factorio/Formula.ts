import Item from './Item';

class Formula{
    readonly item: Item;
    number: number;

    constructor(item: Item, number: number) {
        this.item = item;
        this.number = number;
    }

    public expandToBasic(): Formula[] {
        let ret: Formula[] = [];
        if (this.item.formulaList.length == 0) {
            ret.push(this);
            return ret;
        }
        ret = this.item.buildBasicFormulaList();
        ret.forEach(f => {
            f.number = f.number * this.number;
        })
        return ret;
    }

    public static merge(target: Formula[], source: Formula): void {
        target.forEach(f => {
            if (f.item.name == source.item.name) {
                f.number = f.number + source.number;
                return;
            }
        })
        target.push(source);
    }

    public static mergeList(target: Formula[], source: Formula[]): void {
        source.forEach(s => {
            this.merge(target, s);
        })
    }
}

export default Formula;