module ManyLens {
    export class D3ChartObject {
        protected _element: D3.Selection;
        protected _data: Array<any>;
        public render<T>(data: Array<T>): void{
            this._data = data;
        }
        constructor(element: D3.Selection) {
            this._element = element;
        }
    }
}