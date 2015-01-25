﻿///<reference path = "./BaseSingleLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
module ManyLens {
    export module Lens{
        export class MapLens extends BaseSingleLens {

            public static Type: string = "MapLens";

            private _map_width: number = this._lc_radius * Math.SQRT2;
            private _map_height: number = this._map_width;

            private _projection: D3.Geo.Projection = d3.geo.albersUsa();
            private _path: D3.Geo.Path = d3.geo.path();


            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, MapLens.Type, manyLens);

                this._projection
                    .scale(250)
                    .translate([0, 0]);

                this._path
                    .projection(this._projection);
            }

            public Render(color: string): void {
                super.Render(color);
            }

            protected ExtractData(): any {


            }

            public DisplayLens(data: any): any {
                d3.json("../testData/us.json", (error, data) => {
                    super.DisplayLens(data);
                    var path = this._path;
                    var width = this._map_width;
                    var height = this._map_height;
                    var g = this._lens_circle_G.append("g");
                    var centered;

                    g.append("g")
                        .attr("id", "states")
                        .selectAll("path")
                        .data(topojson.feature(data, data.objects.states).features)
                        .enter().append("path")
                        .attr("d", this._path)
                        .on("click", clicked)
                    ;

                    g.append("path")
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

                        g.selectAll("path")
                            .classed("active", centered && function (d) { return d === centered; });

                        g.transition()
                            .duration(750)
                            .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                            .style("stroke-width", 1.5 / k + "px");
                    }
                });
            }
        }
    }
}