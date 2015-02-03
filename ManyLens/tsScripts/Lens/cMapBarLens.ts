///<reference path = "./cBaseMapLens.ts" />
module ManyLens {
    export module Lens {
        export class cMapBarLens extends cBaseMapLens {

            public static Type: string = "cMapBarLens";

            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();
            private _pie_color: D3.Scale.OrdinalScale = d3.scale.category20();

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cMapBarLens.Type, manyLens, firstLens, secondLens);

                this._pie
                    .value((d) => {
                        return d;
                    })
                    .sort(null)
                ;

                this._arc
                    .innerRadius((d) => {
                        return this._lens_circle_radius;
                    })
                    .outerRadius((d) => {
                        return this._lens_circle_radius + 20;
                    })
                ;

            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            // data shape {text: size:}
            protected ExtractData(): any {
                var data = d3.range(6).map(function () {
                    return Math.random() * 60;
                });
                return data;
            }

            public DisplayLens(): void {
                super.DisplayLens();
                var barData = this.ExtractData();

                this._lens_circle_svg.selectAll(".innerPie")
                    .data(this._pie(barData))
                    .enter().append("path")
                    .attr("d", this._arc)
                    .style("fill", (d, i) => { return this._pie_color(i); })
                    .style("fill-rule", "evenodd")
                ;

            }

        }
    }
} 