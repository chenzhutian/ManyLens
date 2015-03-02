///<reference path = "./cBaseMapLens.ts" />
module ManyLens {
    export module Lens {
        export class cMapPieLens extends cBaseMapLens {

            public static Type: string = "cMapBarLens";

            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();
            private _pie_color: D3.Scale.QuantizeScale = d3.scale.quantize();
            private _pie_innerRadius: number = this._lens_circle_radius;
            private _pie_outterRadius: number = this._lens_circle_radius + 20;

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cMapPieLens.Type, manyLens, firstLens, secondLens);

                this._pie
                    .value((d) => {
                        return d.Value;
                    })
                    .sort(null)
                ;

                this._pie_color
                    .range([
                        "rgb(198,219,239)",
                        "rgb(158,202,225)",
                        "rgb(107, 174, 214)",
                        "rgb(66, 146, 198)",
                        "rgb(33, 113, 181)"
                        // "rgb(8, 81, 156)"
                        // "rgb(8, 48, 107)"
                    ]);

                this._arc
                    .innerRadius(this._pie_innerRadius)
                    .outerRadius(this._pie_outterRadius)
                ;

            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            protected AfterExtractData(): void {
                super.AfterExtractData();
                this._pie_color.domain(d3.extent(this._sub_accessor_func.Extract(this._data), function (d) { return d['Value']; }));
            }

            public DisplayLens(): void {
                super.DisplayLens();

                this._lens_circle.style({
                    "stroke": null,
                    "stroke-width": null
                });

                this._lens_circle_svg.selectAll(".outterPie")
                    .data(this._pie(this._sub_accessor_func.Extract(this._data)))
                    .enter().append("path")
                    .attr("class", "outterPie")
                    .attr("d", this._arc)
                    .style("fill", (d, i) => {
                        return this._pie_color(d.value) || "rgb(158,202,225)";
                    })
                    .on("mouseover", (d) => {
                        this._manyLens.ManyLensHubServercMapPieLens(this.ID, d.data.Key, this._base_accessor_func.TargetAttribute,this._sub_accessor_func.TargetAttribute);
                        this.ShowLabel(d);
                    })
                    .on("mouseout", (d) => {
                        this.ShowLabel(null);
                    })
                ;

            }

            private ShowLabel(d: any): void {
                if (d) {
                    this._lens_circle_svg.selectAll("text.mylabel")
                        .data([d])
                        .enter().append("text")
                        .attr("class", "mylabel")
                        .attr("text-anchor", "middle")
                        .attr("x", (d) => {
                            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            d.cx = Math.cos(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                            return d.x = Math.cos(a) * (this._pie_outterRadius + 40);
                        })
                        .attr("y", (d) => {
                            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            d.cy = Math.sin(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                            return d.y = Math.sin(a) * (this._pie_outterRadius + 40);
                        })
                        .text(function (d) { return d.data.Key; })
                        .each(function (d) {
                            var bbox = this.getBBox();
                            d.sx = d.x - bbox.width / 2 - 2;
                            d.ox = d.x + bbox.width / 2 + 2;
                            d.sy = d.oy = d.y + 5;
                        });

                    this._lens_circle_svg.selectAll("path.mylabel")
                        .data([d])
                        .enter().append("path")
                        .attr("class", "mylabel")
                        .style("fill", "none")
                        .style("stroke", "black")
                        .attr("d", function (d) {
                            if (d.cx > d.ox) {
                                return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                            } else {
                                return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                            }
                        })
                        .transition().duration(200)
                        .attr("d", function (d) {
                            if (d.cx > d.ox) {
                                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                            } else {
                                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                            }
                        });
                } else {
                    this._lens_circle_svg.selectAll(".mylabel").remove();
                }
            }

            public HightLightCountry(countryName: string): void {
                console.log(countryName);
            }
        }
    }
} 