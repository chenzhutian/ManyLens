///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../Scripts/typings/d3.cloud.layout/d3.cloud.layout.d.ts" />
///<reference path = "../Scripts/typings/d3.fisheye/d3.fisheye.d.ts" />
///<reference path = "../Scripts/typings/d3/plugins/d3.superformula.d.ts" />
///<reference path = "../Scripts/typings/jquery/jquery.d.ts" />

module ManyLens {
     export class Map<K extends number|string,T> {
        private items: Object;
        public get size():number{
            var s = 0;
            for (var key in this.items) ++s;
            return s;
        }

        constructor() {
            this.items = {};
            
        }

        set(key: string|number, value: T): void {
            if(typeof key === "number") key = ""+key;
            this.items[key] = value;
        }

        has(key: string|number): boolean {
            if(typeof key === "number") key = ""+key;
            return key in this.items;
        }

        get(key: string|number): T {
            if(typeof key === "number") key = ""+key;
            return this.items[key];
        }

        delete(key:string|number){
            if(typeof key === "number") key = ""+key;
             return (key  in this.items) && delete this.items[key];
        }

        forEach(f){
             for (var key in this.items) f.call(this, key, this.items[key]);
        }
    }

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