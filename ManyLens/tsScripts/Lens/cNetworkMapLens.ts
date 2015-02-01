module ManyLens {
    export module Lens {
        export class cNetworkMapLens extends BaseCompositeLens {

            public static Type: string = "cNetworkMapLens";

            private _map_width: number = this._lens_circle_radius * Math.SQRT2;
            private _map_height: number = this._map_width;

            private _projection: D3.Geo.Projection = d3.geo.albersUsa();
            private _path: D3.Geo.Path = d3.geo.path();

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cWordCloudLens.Type, manyLens, firstLens, secondLens);

                this._projection
                    .scale(250)
                    .translate([0, 0]);

                this._path
                    .projection(this._projection);

            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            // data shape {text: size:}
            protected ExtractData(): any {
                
                var graph = {
                    "nodes": [{ "x": 208.992345, "y": 273.053211 },
                        { "x": 595.98896, "y": 56.377057 },
                        { "x": 319.568434, "y": 278.523637 },
                        { "x": 214.494264, "y": 214.893585 },
                        { "x": 482.664139, "y": 340.386773 },
                        { "x": 84.078465, "y": 192.021902 },
                        { "x": 196.952261, "y": 370.798667 },
                        { "x": 107.358165, "y": 435.15643 },
                        { "x": 401.168523, "y": 443.407779 },
                        { "x": 508.368779, "y": 386.665811 },
                        { "x": 355.93773, "y": 460.158711 },
                        { "x": 283.630624, "y": 87.898162 },
                        { "x": 194.771218, "y": 436.366028 },
                        { "x": 477.520013, "y": 337.547331 },
                        { "x": 572.98129, "y": 453.668459 },
                        { "x": 106.717817, "y": 235.990363 },
                        { "x": 265.064649, "y": 396.904945 },
                        { "x": 452.719997, "y": 137.886092 }
                    ],
                    "links": [{ "target": 11, "source": 0 },
                        { "target": 3, "source": 0 },
                        { "target": 10, "source": 0 },
                        { "target": 16, "source": 0 },
                        { "target": 1, "source": 0 },
                        { "target": 3, "source": 0 },
                        { "target": 9, "source": 0 },
                        { "target": 5, "source": 0 },
                        { "target": 11, "source": 0 },
                        { "target": 13, "source": 0 },
                        { "target": 16, "source": 0 },
                        { "target": 3, "source": 1 },
                        { "target": 9, "source": 1 },
                        { "target": 12, "source": 1 },
                        { "target": 4, "source": 2 },
                        { "target": 6, "source": 2 },
                        { "target": 8, "source": 2 },
                        { "target": 13, "source": 2 },
                        { "target": 10, "source": 3 },
                        { "target": 16, "source": 3 },
                        { "target": 9, "source": 3 },
                        { "target": 7, "source": 3 },
                        { "target": 11, "source": 5 },
                        { "target": 13, "source": 5 },
                        { "target": 12, "source": 5 },
                        { "target": 8, "source": 6 },
                        { "target": 13, "source": 6 },
                        { "target": 10, "source": 7 },
                        { "target": 11, "source": 7 },
                        { "target": 17, "source": 8 },
                        { "target": 13, "source": 8 },
                        { "target": 11, "source": 10 },
                        { "target": 16, "source": 10 },
                        { "target": 13, "source": 11 },
                        { "target": 14, "source": 12 },
                        { "target": 14, "source": 12 },
                        { "target": 14, "source": 12 },
                        { "target": 15, "source": 12 },
                        { "target": 16, "source": 12 },
                        { "target": 15, "source": 14 },
                        { "target": 16, "source": 14 },
                        { "target": 15, "source": 14 },
                        { "target": 16, "source": 15 },
                        { "target": 16, "source": 15 },
                        { "target": 17, "source": 16 }
                    ]
                };
                    
                return graph;
            }

            public DisplayLens(): void {
                d3.json("../testData/us.json", (error, data) => {
                    super.DisplayLens();
                    var networkData = this.ExtractData();
                    var path = this._path;
                    var lensG = this._lens_circle_svg;
                    var centered;





                    this._lens_circle_svg.append("g")
                        .attr("id", "states")
                        .selectAll("path")
                        .data(topojson.feature(data, data.objects.states).features)
                        .enter().append("path")
                        .attr("d", this._path)
                        .on("click", clicked)
                    ;

                    this._lens_circle_svg.append("path")
                        .datum(topojson.mesh(data, data.objects.states, function (a, b) { return a !== b; }))
                        .attr("id", "state-borders")
                        .attr("d", this._path);

                    function clicked(d) {
                        var x, y, k;

                        if (d && centered !== d) {
                            var centroid = path.centroid(d);
                            x = centroid[0];
                            y = centroid[1];
                            k = 4;
                            centered = d;
                        } else {
                            x = 0;
                            y = 0;
                            k = 1;
                            centered = null;
                        }

                        lensG.selectAll("path")
                            .classed("active", centered && function (d) { return d === centered; });

                        lensG.transition()
                            .duration(750)
                            .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                            .style("stroke-width", 1.5 / k + "px");
                    }
                });

            }

        }
    }
} 