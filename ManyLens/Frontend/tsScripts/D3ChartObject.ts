﻿///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../Scripts/typings/d3.cloud.layout/d3.cloud.layout.d.ts" />


module ManyLens {

    export class D3ChartObject {
        protected _element: D3.Selection;
        protected _data: any;
        protected _manyLens: ManyLens;

        constructor(element: D3.Selection, manyLens:ManyLens) {
            this._element = element;
            this._manyLens = manyLens;
        }
        public Render(any): void {

        }
    }
}