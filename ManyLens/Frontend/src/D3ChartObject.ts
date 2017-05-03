import { Selection } from "d3";
import { ManyLens } from "./ManyLens";

export class D3ChartObject {
    protected _element: Selection<any>;
    protected _data: any;
    protected _manyLens: ManyLens;

    constructor(element: Selection<any>, manyLens: ManyLens) {
        this._element = element;
        this._manyLens = manyLens;
    }
    public Render(any): void {

    }
}
