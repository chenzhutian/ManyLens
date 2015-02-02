///<reference path = "./BaseSingleLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
module ManyLens {
    export module Lens {
        export class MapLens extends BaseSingleLens {

            public static Type: string = "MapLens";

            private _map_width: number = this._lens_circle_radius * Math.SQRT2;
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
                            } else {
                                x = 0;
                                y = 0;
                                k = 1;
                                centered = null;
                            }

                            this._lens_circle_svg.selectAll("path")
                                .classed("active", centered && function (d) { return d === centered; });

                            this._lens_circle_svg.transition()
                                .duration(750)
                                .attr("transform", "translate(" + this._lens_circle_cx + "," + this._lens_circle_cy + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                                .style("stroke-width", 1.5 / k + "px");
                        })
                    ;

                    this._lens_circle_svg.append("path")
                        .datum(topojson.mesh(data, data.objects.states, function (a, b) { return a !== b; }))
                        .attr("id", "state-borders")
                        .attr("d", this._path);

                });
            }
        }
    }
}