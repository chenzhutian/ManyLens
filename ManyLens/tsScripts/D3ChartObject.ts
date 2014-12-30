module ManyLens {

    export class D3ChartObject {
        protected _element: D3.Selection;
        public render(any): void{

        }
        constructor(element: D3.Selection) {
            this._element = element;
        }
    }
}