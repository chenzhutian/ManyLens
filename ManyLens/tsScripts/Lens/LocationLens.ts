///<reference path = "./BaseSingleLens.ts" />
module ManyLens {
    export module Lens{
        export class LocationLens extends BaseSingleLens {

            public static Type: string = "LocationLens";

            private _map_width: number = this._lc_radius * Math.SQRT2;
            private _map_height: number = this._map_width;
            private _map_path: string = "./img/chinamap.svg";
            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, LocationLens.Type, manyLens);
            }

            public Render(color: string): void {
                super.Render(color);
            }

            protected ExtractData(): any {
                var data: Array<any>;

                return data;
            }

            public DisplayLens(data: Array<any>): any {
                var p = super.DisplayLens(data);
                var container = this._element;
                var lensG = this._lens_circle_G;

                //TODO
                lensG.append("image")
                    .attr("xlink:href", this._map_path)
                    .attr("x", -this._map_width / 2)
                    .attr("y", -this._map_height / 2)
                    .attr("width", this._map_width)
                    .attr("height", this._map_height)
                ;

            }
        }
    }
}