///<reference path = "./BaseSingleLens.ts" />
module ManyLens{
    export module Lens{

        export class PieChartLens extends BaseSingleLens {

            public static Type: string = "PieChartLens";

            private _innerRadius: number = this._lc_radius - 20;
            private _outterRadius: number = this._lc_radius - 0;
            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc()
                .innerRadius(this._innerRadius)
                .outerRadius(this._outterRadius)
            //    .startAngle(0)
            ;
            protected _color: D3.Scale.OrdinalScale = d3.scale.category20();

            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, PieChartLens.Type,manyLens);

            }

            public Render(color: string): void {
                super.Render(color);

            }

            protected ExtractData(): Array<any> {
                var data: Array<any>;

                data = d3.range(6).map(function (d) {
                    return Math.random() * 70;
                });

                return data;
            }

            public DisplayLens(data: Array<any>): any {
                var p = super.DisplayLens(data);
                var container = this._element;
                var lensG = this._lens_circle_G;

                this._pie.value((d) => {
                    return d;
                })
                    .sort(null)
                ;

                lensG.selectAll("path")
                    .data(this._pie(this._data))
                    .enter().append("path")
                    .attr("fill", (d, i) => {
                        return this._color(i);
                    })
                    .attr("d", this._arc)
                ;
            }
        }
    }
} 