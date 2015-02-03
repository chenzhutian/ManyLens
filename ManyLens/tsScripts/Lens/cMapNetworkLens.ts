///<reference path = "./BaseCompositeLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
module ManyLens {
    export module Lens {
        export class cMapNetworkLens extends BaseCompositeLens {

            public static Type: string = "cMapNetworkLens";

            private _projection: D3.Geo.Projection = d3.geo.albersUsa();
            private _path: D3.Geo.Path = d3.geo.path();
            private _color: D3.Scale.QuantizeScale = d3.scale.quantize();
            private _centered_state: Object;

            private _map_data: {
                raw: any;
                color: string[]
            };


            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cMapNetworkLens.Type, manyLens, firstLens, secondLens);

                var mapLens: MapLens = <MapLens>(firstLens.Type == "MapLens" ? firstLens : secondLens);
                this._projection = mapLens.Projection;
                this._path = mapLens.Path;
                this._color = mapLens.Color;
                this._map_data = mapLens.MapData;

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
                    super.DisplayLens();
                    var networkData = this.ExtractData();
                    var centered;

                    this._lens_circle_svg.append("g")
                        .attr("id", "states")
                        .selectAll("path")
                        .data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.states).features)
                        .enter().append("path")
                        .attr("d", this._path)
                        .attr("fill", (d,i) => {
                            return this._map_data.color[i];
                        })
                        .on("click", (d) => {
                            this.ClickedMap(d);
                        })
                    ;

                    this._lens_circle_svg.append("g")
                        .attr("id", "state-borders")
                        .append("path")
                        .datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.states, function (a, b) { return a !== b; }))
                        .attr("d", this._path);

                    var networkG = this._lens_circle_svg.append("g")
                        .attr("id", "network");

                    var pathArcs = networkG
                        .selectAll(".cMapPath")
                        .data(networkData)
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
                        .data(networkData).enter()
                        .append("circle")
                        .attr("class", "cMapNode")
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
                            "stroke-width": "1.2px"
                        })
                        .transition()
                        .duration(2000)
                        .attr("stroke-dashoffset", 0);
                    ;

                    //exit
                    pathArcs.exit().remove();

            }


            private ClickedMap(d: any) {
                var x, y, k;

                if (d && this._centered_state !== d) {
                    var centroid = this._path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    this._centered_state = d;
                    this._lens_circle_zoom.on("zoom", null);
                } else {
                    x = 0;
                    y = 0;
                    k = this._lens_circle_scale;
                    this._centered_state = null;
                    this._lens_circle_zoom
                        .scale(this._lens_circle_scale)
                        .on("zoom", () => {
                            this.LensCircleZoomFunc();
                        });
                }

                this._lens_circle_svg.selectAll("path")
                    .classed("active", this._centered_state && ((d) => {
                        return d === this._centered_state;
                    }));

                this._lens_circle_svg.transition()
                    .duration(750)
                    .attr("transform", "translate(" + this._lens_circle_cx + "," + this._lens_circle_cy + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                    .style("stroke-width", 1.5 / k + "px");

            }

        }
    }
} 