///<reference path = "./BaseSingleLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
module ManyLens {
    export module Lens {
        export class MapLens extends BaseSingleLens {

            public static Type: string = "MapLens";

            private _projection: D3.Geo.Projection = d3.geo.albersUsa();
            private _path: D3.Geo.Path = d3.geo.path();
            private _color: D3.Scale.QuantizeScale = d3.scale.quantize();
            private _centered_state: Object;

            private _map_data: {
                raw: any;
                color: string[]
            };

            public get Projection(): D3.Geo.Projection {
                return this._projection;
            }
            public get Path(): D3.Geo.Path {
                return this._path;
            }
            public get Color(): D3.Scale.QuantizeScale {
                return this._color;
            }
            public get MapData(): any {
                return this._map_data;
            }

            public Render(color: string): void {
                super.Render(color);
            }

            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, MapLens.Type, manyLens);

                this._projection
                    .scale(250)
                    .translate([0, 0]);

                this._path
                    .projection(this._projection);

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


            protected ExtractData(): any {
                var data = [78, 72, 56, 55, 54, 53, 51, 50, 49,
                    48, 47, 46, 45, 44, 42, 41, 40, 39, 38, 37,
                    36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26,
                    25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15,
                    13, 12, 11, 10, 9, 8, 6, 5, 4, 2, 1];

                var barData = [];
                data.forEach(function (d) {
                    barData[d] = Math.random() * 70;
                });

                return barData;

            }

            public DisplayLens(barData: any): any {
                super.DisplayLens(barData);


                if (this._map_data) {
                    this._map_data.color = [];

                    this._lens_circle_svg.append("g")
                        .attr("id", "states")
                        .selectAll("path")
                        .data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.states).features)
                        .enter().append("path")
                        .attr("d", this._path)
                        .attr("fill", (d) => {
                            var color = this._color(this._data[d.id]);
                            this._map_data.color.push(color)
                            return color;
                        })
                        .on("click", (d) => {
                            if (!d3.event.defaultPrevented)
                                this.ClickedMap(d);
                        })
                    ;

                    this._lens_circle_svg.append("path")
                        .datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.states, function (a, b) { return a !== b; }))
                        .attr("id", "state-borders")
                        .attr("d", this._path)
                    ;

                } else {
                    d3.json("./testData/us.json", (error, data) => {
                        this._color.domain(d3.extent(this._data));
                        this._map_data = {
                            raw: data,
                            color: []
                        };

                        this._lens_circle_svg.append("g")
                            .attr("id", "states")
                            .selectAll("path")
                            .data(topojson.feature(data, data.objects.states).features)
                            .enter().append("path")
                            .attr("d", this._path)
                            .attr("fill", (d) => {
                                var color = this._color(this._data[d.id]);
                                this._map_data.color.push(color)
                                return color;
                            })
                            .on("click", (d) => {
                                this.ClickedMap(d);
                            })
                        ;

                        this._lens_circle_svg.append("path")
                            .datum(topojson.mesh(data, data.objects.states, function (a, b) { return a !== b; }))
                            .attr("id", "state-borders")
                            .attr("d", this._path)
                        ;

                    });
                }
            }

            private ClickedMap(d: any) {
                if (d3.event.defaultPrevented) return;
                var x, y, k;

                if (d && this._centered_state !== d) {
                    var centroid = this._path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    this._centered_state = d;
                    this._lens_circle_zoom.on("zoom", null);
                    this._lens_circle_drag
                        .on("dragstart", null)
                        .on("drag", null)
                        .on("dragend", null)
                    ;
                    this._element.on("click", () => {
                        this.ClickedMap(this._centered_state);
                    });

                } else {
                    x = 0;
                    y = 0;
                    k = this._lens_circle_scale;
                    this._centered_state = null;
                    this._lens_circle_drag
                        .on("dragstart", () => {
                            this.LensCircleDragstartFunc();
                        })
                        .on("drag", () => {
                            this.LensCircleDragFunc();
                        })
                        .on("dragend", () => {
                            this.LensCircleDragendFunc();
                        })
                    ;
                    this._lens_circle_zoom
                        .scale(this._lens_circle_scale)
                        .on("zoom", () => {
                            this.LensCircleZoomFunc();
                        });
                    this._element.on("click", null);
                }

                this._lens_circle_svg.selectAll("path")
                    .classed("active", this._centered_state && ((d) => {
                        return d === this._centered_state;
                    }));

                this._lens_circle_svg.transition()
                    .duration(750)
                    .attr("transform", (d) => {
                        return "translate(" + this._lens_circle_cx + "," + this._lens_circle_cy + ")scale(" + k + ")translate(" + [-x, -y] + ")";
                    })
                    .style("stroke-width", 1.5 / k + "px");

                d3.event.stopPropagation();
            }

        }
    }
}