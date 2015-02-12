///<reference path = "./BaseSingleLens.ts" />
module ManyLens{
    export module Lens{

        export class PieChartLens extends BaseSingleLens {

            public static Type: string = "PieChartLens";

            private _innerRadius: number = this._lens_circle_radius - 20;
            private _outterRadius: number = this._lens_circle_radius - 0;
            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();

            private _color: D3.Scale.OrdinalScale = d3.scale.category20();

            public get Color(): D3.Scale.OrdinalScale {
                return this._color;
            }

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, PieChartLens.Type,manyLens);
                this._arc
                    .innerRadius(this._innerRadius)
                    .outerRadius(this._outterRadius)
                //    .startAngle(0)
                ;

                this._pie
                    .value((d) => {
                        return d;
                    })
                    .sort(null)
                   // .padAngle(.02)
                ;

            }

            public Render(color: string): void {
                super.Render(color);

            }

            public ExtractData(map?: (d?: any) => any): Array<any> {
                var data: Array<any>;
                data = super.ExtractData(map);
                if (data == null) return;

                this._pie.value(function (d) { return d.Value;})
                return data;
            }

            public DisplayLens(data: Array<any>): any {
                super.DisplayLens(data);  
                this._lens_circle_svg.selectAll("path")
                    .data(this._pie(this._data))
                    .enter().append("path")
                    .attr("fill", (d) => {
                        return this._color(d.data.Key);
                    })
                    .attr("d", this._arc)
                ;
            }
        }
    }
} 