///<reference path = "./BaseCompositeLens.ts" />
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
                super(element, cNetworkMapLens.Type, manyLens, firstLens, secondLens);

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
                var data = [
                    [38.991621, -76.852587],
                    [28.524963, -80.650813],
                    [34.200463, -118.176008],
                    [34.613714, -118.076790],
                    [41.415891, -81.861774],
                    [34.646554, -86.674368],
                    [37.409574, -122.064292],
                    [37.092123, -76.376230],
                    [29.551508, -95.092256],
                    [30.363692, -89.600036]
                ];
                var links = [];
                for (var i = 0, len = data.length + 5; i < len; i++) {
                    if (i >= data.length - 1) {
                        var index = Math.ceil(Math.random() * (data.length - 1));
                        var nextIndex = Math.ceil(Math.random() * (data.length - 1));
                        links.push({
                            type: "LineString",
                            coordinates: [
                                [data[index][1], data[index][0]],
                                [data[nextIndex][1], data[nextIndex][0]]
                            ]
                        });
                    }
                    else {
                        links.push({
                            type: "LineString",
                            coordinates: [
                                [data[i][1], data[i][0]],
                                [data[i + 1][1], data[i + 1][0]]
                            ]
                        });
                    }
                }

                return links;
            }

            public DisplayLens(): void {
                d3.json("../testData/us.json", (error, data) => {
                    super.DisplayLens();
                    var networkData = this.ExtractData();
                    var centered;

                    this._lens_circle_svg.append("g")
                        .attr("id", "states")
                        .selectAll("path")
                        .data(topojson.feature(data, data.objects.states).features)
                        .enter().append("path")
                        .attr("d", this._path)
                        .on("click", (d) => {
                            var x, y, k;

                            if (d && centered !== d) {
                                var centroid = this._path.centroid(d);
                                x = centroid[0];
                                y = centroid[1];
                                k = 4;
                                centered = d;
                                this._lens_circle_zoom.on("zoom", null);
                            } else {
                                x = 0;
                                y = 0;
                                k = this._lens_circle_scale;
                                centered = null;
                                this._lens_circle_zoom
                                    .scale(this._lens_circle_scale)
                                    .on("zoom", () => {
                                        this.LensCircleZoomFunc();
                                    });
                            }

                            this._lens_circle_svg.selectAll("path")
                                .classed("active", centered && function (d) { return d === centered; });

                            this._lens_circle_svg.transition()
                                .duration(750)
                                .attr("transform", "translate(" + this._lens_circle_cx + "," + this._lens_circle_cy + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                                .style("stroke-width", 1.5 / k + "px");
                        })
                    ;

                    this._lens_circle_svg.append("g")
                        .attr("id", "state-borders")
                        .append("path")
                        .datum(topojson.mesh(data, data.objects.states, function (a, b) { return a !== b; }))
                        .attr("d", this._path);

                    var networkG = this._lens_circle_svg.append("g")
                        .attr("id", "network");

                    var pathArcs = networkG
                        .selectAll(".cNetworkMapLensPath")
                        .data(networkData)
                    ;

                    pathArcs.enter()
                        .append("path")
                        .attr("class", "cNetworkMapLensPath")
                        .style({
                            "fill": "none"
                        })
                    ;

                    var networkNode = networkG
                        .selectAll(".cNetworkMapLensNode")
                        .data(networkData).enter()
                        .append("circle")
                        .attr("class", "cNetworkMapLensNode")
                        .attr("cx", (d) => {
                            return this._projection(d.coordinates[0])[0];
                        })
                        .attr("cy", (d) => {
                            return this._projection(d.coordinates[0])[1];
                        })
                        .attr("r", 4)
                        .style({
                            "stroke": "steelblue",
                            "fill": "#fff",
                            "stroke-width": 1.5
                        })
                    ;

                    var line = d3.svg.diagonal()
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


                    //update
                    pathArcs
                        .attr('d', function (d) {
                            return line(d);
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
                            "stroke-width": "1px"
                        })
                        .transition()
                        .duration(2000)
                        .attr("stroke-dashoffset", 0);
                    ;

                    //exit
                    pathArcs.exit().remove();

                });
            }

        }
    }
} 