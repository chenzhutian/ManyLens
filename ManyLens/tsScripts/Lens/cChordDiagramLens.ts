module ManyLens {
    export module Lens {
        export class cChordDiagramLens extends BaseCompositeLens{

            public static Type: string = "cChordDiagramLens";

            private _chord: D3.Layout.ChordLayout = d3.layout.chord();
            private _innerRadius: number = this._lens_circle_radius * 1;
            private _outterRadius: number = this._lens_circle_radius * 1.1;
            private _fill: D3.Scale.OrdinalScale;

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cChordDiagramLens.Type, manyLens, firstLens, secondLens);

                this._chord
                    .padding(.05)
                    .sortSubgroups(d3.descending)
                ;

                //this._fill
                //    .domain(d3.range(4))
                //    .range(["#000000", "#FFDD89", "#957244", "#F26223"])
                //;

                //if (firstLens.Type == "WordCloudLens") {
                //    this._fill = (<WordCloudLens>firstLens).Color;
                //} else if (secondLens.Type == "WordCloudLens") {
                //    this._fill = (<WordCloudLens>secondLens).Color;
                //}
                this._fill = d3.scale.category10();

            }


            public Render(color = "green"): void {
                super.Render(color);

            }

            protected ExtractData(): any {
                var matrix = [
                    [11975, 5871, 8916, 2868,5550],
                    [1951, 10048, 2060, 6171,2043],
                    [8010, 16145, 8090, 8045,1028],
                    [3034,9564,983,4203,7022],
                    [1013, 990, 940, 6907,2303]
                ];
                return matrix;
            }

            public DisplayLens() {
                super.DisplayLens();
                var data = this.ExtractData();
                this._chord.matrix(data);

                var svg = this._lens_circle_svg;
                
                this._lens_circle_svg.append("g").selectAll("path")
                        .data(this._chord.groups)
                    .enter().append("path")
                        .style("fill", (d, i) => { return this._fill(i); })
                        .style("stroke", (d, i) => { return this._fill(i); })
                        .attr("d", d3.svg.arc().innerRadius(this._innerRadius).outerRadius(this._outterRadius))
                        .on("mouseover", fade(.1))
                        .on("mouseout", fade(1))
                ;

                var ticks = this._lens_circle_svg.append("g").selectAll("g")
                        .data(this._chord.groups)
                    .enter().append("g").selectAll("g")
                        .data(groupTicks)
                    .enter().append("g")
                        .attr("transform",  (d)=> {
                            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                                + "translate(" + this._outterRadius + ",0)";
                        })
                ;

                ticks.append("line")
                    .attr("x1", 1)
                    .attr("y1", 0)
                    .attr("x2", 5)
                    .attr("y2", 0)
                    .style("stroke", "#000")
                ;

                ticks.append("text")
                    .attr("x", 8)
                    .attr("dy", ".35em")
                    .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
                    .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
                    .text(function (d) { return d.label; })
                ;

                this._lens_circle_svg.append("g")
                    .attr("class", "chord")
                    .selectAll("path")
                    .data(this._chord.chords)
                    .enter().append("path")
                    .attr("d", d3.svg.chord().radius(this._innerRadius))
                    .style("fill", (d) => { return this._fill(d.target.index); })
                    .style("opacity", 1)
                    .style("fill-opacity", 0.67)
                    .style("stroke", "#000")
                    .style("stroke-width",".5px")
                ;


                function groupTicks(d) {
                    var k = (d.endAngle - d.startAngle) / d.value;
                    return d3.range(0, d.value, 1000).map(function (v, i) {
                        return {
                            angle: v * k + d.startAngle,
                            label: i % 5 ? null : v / 1000 + "k"
                        };
                    });
                }

                function fade(opacity) {
                    return  function(g, i){
                        svg.selectAll(".chord path")
                            .filter(function (d) { return d.source.index != i && d.target.index != i; })
                            .transition()
                            .style("opacity", opacity);
                    };
                }
            }
        }
    }
}