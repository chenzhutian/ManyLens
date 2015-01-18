///<reference path = "../tsScripts/BaseD3Lens.ts" />
module ManyLens {
    export module Lens{
        export class LocationLens extends BaseD3Lens {

            private _map_width: number = this._lc_radius * Math.SQRT2;
            private _map_height: number = this._map_width;
            private _map_path: string = "./img/chinamap.svg";
            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, "LocationLens", manyLens);
            }

            public render(color: string): void {
                super.render(color);
            }

            protected extractData(): any {
                var data: Array<any>;

                return data;
            }

            public showLens(data: Array<any>, lc_cx = null, lc_cy = null): any {
                var p = super.showLens(null, lc_cx, lc_cy);
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



                lensG
                    .transition().duration(p.duration)
                    .attr("opacity", "1")
                ;
            }
        }
    }
}