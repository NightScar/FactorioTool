import Item from './Item';

/** 配方 */
class Formula {
    readonly item: Item;
    number: number;

    constructor(item: Item, number: number) {
        this.item = item;
        this.number = number;
    }

    public expandToBasic(): Formula[] {
        console.log(
            '配方展开到基础物品--' + this.item.name + ', ' + this.number,
        );
        let ret: Formula[] = [];
        if (this.item.formulaList.length == 0) {
            ret.push(new Formula(this.item, this.number));
            console.log(
                '配方展开到基础物品--' +
                    this.item.name +
                    ', ' +
                    this.number +
                    ', 到底了',
            );
            return ret;
        }
        ret = this.item.buildBasicFormulaList();
        ret.forEach((f) => {
            f.number = f.number * this.number;
        });
        console.log(this.number + '个' + this.item.name + '--展开为：' + ret);
        return ret;
    }

    public static merge(target: Formula[], source: Formula): void {
        let flag: boolean = false;
        target.forEach((f) => {
            if (f.item.name == source.item.name) {
                f.number = f.number + source.number;
                flag = true;
            }
        });
        if (!flag) {
            target.push(new Formula(source.item, source.number));
        }
    }

    public static mergeList(target: Formula[], source: Formula[]): void {
        source.forEach((s) => {
            this.merge(target, s);
        });
    }

    public expandToHistory(): Formula[] {
        let ret: Formula[] = [];
        ret.push(new Formula(this.item, this.number));
        let tempList: Formula[] = [];
        this.item.formulaList.forEach((t) => {
            tempList.push(
                new Formula(
                    t.item,
                    (t.number * this.number) / this.item.productNumber,
                ),
            );
        });
        tempList.forEach((f) => {
            Formula.mergeList(ret, f.expandToHistory());
        });
        return ret;
    }

    public toString(): string {
        return this.number + '个' + this.item.name;
    }
}

// export class FormulaDefinition{
//     readonly
// }

export default Formula;
