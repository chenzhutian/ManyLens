module ManyLens {
    export module Lens {
        export class cPieChartLens extends BaseCompositeLens {

            public static Type: string = "cPieChartLens";


            private _color: D3.Scale.OrdinalScale = d3.scale.category20();
            private _partition: D3.Layout.PartitionLayout = d3.layout.partition();
            private _arc: D3.Svg.Arc = d3.svg.arc();

            constructor(element: D3.Selection,
                manyLens: ManyLens.ManyLens,
                firstLens: BaseSingleLens,
                secondLens: BaseSingleLens) {
                super(element, cPieChartLens.Type, manyLens, firstLens, secondLens);

                this._arc.startAngle((d) => { return d.x; })
                    .endAngle((d) => { return d.x + d.dx; })
                    .innerRadius((d) => { return Math.sqrt(d.y); })
                    .outerRadius((d) => { return Math.sqrt(d.y + d.dy); })
                ;

                this._partition
                    .sort(null)
                    .size([2 * Math.PI, this._lc_radius * this._lc_radius])
                ;
            }

            public Render(color = "pupple"): void {
                super.Render(color);

            }

            protected ExtractData(): any {
                var data: any;
                data = d3.range(6).map(function (d) {
                    var value = Math.random() * 70;
                    return {
                        value: value,
                        children: [{
                            value: value * Math.random()
                        }]
                    };
                });

                data = { children: data };
                
                return data;
            }

            public DisplayLens(): void {
                super.DisplayLens();
                var data = this.ExtractData();

                var path = this._lens_circle_G.selectAll("path")
                    .data(this._partition.nodes(data))
                    .enter().append("path")
                    .attr("display", function (d) { return d.depth ? null : "none"; }) // hide inner ring
                    .attr("d", this._arc)
                    .style("stroke", "#fff")
                    .style("fill", (d,i) =>{ return this._color(i); })
                    .style("fill-rule", "evenodd")
               ;
            }
        }
    }
} 