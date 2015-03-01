﻿///<reference path = "./BaseCompositeLens.ts" />
module ManyLens {
    export module Lens {
        export class cPieChartLens extends BaseCompositeLens {

            public static Type: string = "cPieChartLens";


            private _color: D3.Scale.QuantizeScale = d3.scale.quantize();
            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cPieChartLens.Type, manyLens, firstLens, secondLens);

                this._pie
                    .value((d) => {
                        return d.host;
                    })
                    .startAngle((d, i) => {
                        console.log(d, i);
                        return 0;
                    })
                    .padAngle((d,i) => {
                        console.log(d, i);
                        return 0;
                    })
                    .sort(null)
                ;

                this._arc
                    .innerRadius((d) => {
                        return this._lens_circle_radius - 20;
                    })
                    .outerRadius((d) => {
                        return this._lens_circle_radius;
                    })
                ;

                this._color
                    .range([
                        "rgb(198,219,239)",
                        "rgb(158,202,225)",
                        "rgb(107, 174, 214)",
                        "rgb(66, 146, 198)",
                        "rgb(33, 113, 181)"
                        // "rgb(8, 81, 156)"
                        // "rgb(8, 48, 107)"
                    ]);

            }

            public Render(color = "pupple"): void {
                super.Render(color);

            }

            protected AfterExtractData(): void {

            }

            public DisplayLens(): void {
                super.DisplayLens();
                var data = this.ExtractData();

                this._lens_circle_svg.selectAll(".innerPie")
                    .data(this._pie(data))
                    .enter().append("path")
                    .attr("d", this._arc)
                    .style("fill", (d, i) => {
                        return this._color(i);
                    })
                    .style("fill-rule", "evenodd")
                ;

                this._arc.innerRadius(this._lens_circle_radius)
                    .outerRadius(this._lens_circle_radius + 20)
                    .endAngle(function (d, i) {
                        return d.startAngle + (d.endAngle - d.startAngle) * (d.data.sub / d.value);
                    });

                this._lens_circle_svg.selectAll(".outerPie")
                    .data(this._pie(data))
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