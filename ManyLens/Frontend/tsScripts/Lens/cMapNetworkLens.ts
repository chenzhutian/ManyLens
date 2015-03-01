///<reference path = "./cBaseMapLens.ts" />
module ManyLens {
    export module Lens {
        export class cMapNetworkLens extends cBaseMapLens {

            public static Type: string = "cMapNetworkLens";

            private _link: D3.Svg.Diagonal = d3.svg.diagonal();

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cMapNetworkLens.Type, manyLens, firstLens, secondLens);

                this._link
                    .source((d) => {
                        var t = this._projection(d.coordinates[0]);
                        return {
                            x: t[0],
                            y: t[1]
                        };
                    })
                    .target((d) => {
                        var t = this._projection(d.coordinates[1]);
                        return {
                            x: t[0],
                            y: t[1]
                        };
                    })
                ;
            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            protected AfterExtractData(): void {
                super.ExtractData();
                this._sub_accessor_func.Extract(this._data).nodes.forEach((d) => {
                    var p = this._projection([d.x, d.y]);
                    d.x = p[0];
                    d.y = p[1]; 
                });
            }

            //// data shape {text: size:}
            //protected ExtractData(): any {
            //    var data = [
            //        [38.991621, -76.852587],
            //        [28.524963, -80.650813],
            //        [34.200463, -118.176008],
            //        [34.613714, -118.076790],
            //        [41.415891, -81.861774],
            //        [34.646554, -86.674368],
            //        [37.409574, -122.064292],
            //        [37.092123, -76.376230],
            //        [29.551508, -95.092256],
            //        [30.363692, -89.600036]
            //    ];
            //    var links = [];
            //    for (var i = 0, len = data.length + 5; i < len; i++) {
            //        if (i >= data.length - 1) {
            //            var index = Math.ceil(Math.random() * (data.length - 1));
            //            var nextIndex = Math.ceil(Math.random() * (data.length - 1));
            //            links.push({
            //                type: "LineString",
            //                coordinates: [
            //                    [data[index][1], data[index][0]],
            //                    [data[nextIndex][1], data[nextIndex][0]]
            //                ]
            //            });
            //        }
            //        else {
            //            links.push({
            //                type: "LineString",
            //                coordinates: [
            //                    [data[i][1], data[i][0]],
            //                    [data[i + 1][1], data[i + 1][0]]
            //                ]
            //            });
            //        }
            //    }

            //    return links;
            //}

            public DisplayLens(): void {
                    super.DisplayLens();

                    var networkG = this._lens_circle_svg.append("g")
                        .attr("id", "network");

                    var pathArcs = networkG
                        .selectAll(".cMapPath")
                        .data(this._sub_accessor_func.Extract(this._data).links)
                    ;

                    pathArcs.enter()
                        .append("path")
                        .attr("class", "cMapPath")
                        .style({
                            "fill": "none"
                        })
                    ;

                    var networkNode = networkG
                        .selectAll(".cMapNode")
                        .data(this._sub_accessor_func.Extract(this._data).nodes).enter()
                        .append("circle")
                        .attr("class", "cMapNode")
                        .attr("cx", (d) => {
                            return d.x
                        })
                        .attr("cy", (d) => {
                            return d.y
                        })
                        .attr("r", 4)
                        .style({
                            "stroke": "steelblue",
                            "fill": "#fff",
                            "stroke-width": 1.5
                        })
                    ;

                    //update
                    pathArcs
                        .attr('d',  (d)=> {
                            return this._link(d);
                        })
                        .attr("stroke-dasharray", function (d) {
                            var totalLen = (<SVGPathElement>d3.select(this).node()).getTotalLength();
                            return totalLen + "," + totalLen;
                        })
                        .attr("stroke-dashoffset", function (d) {
                            var totalLen = (<SVGPathElement>d3.select(this).node()).getTotalLength();
                            return totalLen;
                        })
                        .style({
                            "stroke": "#d73027",
                            "stroke-width": "1.2px"
                        })
                        .transition()
                        .duration(2000)
                        .attr("stroke-dashoffset", 0);
                    ;

                    //exit
                    pathArcs.exit().remove();
            }

        }
    }
} 