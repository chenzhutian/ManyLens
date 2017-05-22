///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />s 
module ManyLens {
    export module MapArea {

        interface Country {
            type: string;
            id: string;
            properties?: {};
        }

        export class WorldMap extends D3ChartObject {
            private _map: D3.Selection;

            private _state: boolean = false;
            private _total_width: number;
            private _total_height: number;
            private _center_xy: number[];

            private _projection: D3.Geo.Projection = d3.geo.equirectangular();
            private _path: D3.Geo.Path = d3.geo.path();
            private _color: D3.Scale.SqrtScale = d3.scale.sqrt();

            private _world_topojson_path: string = "./testData/countriesAlpha2.topo.json";
            private _world_topojson_data;
            private _uk_topojson_path: string = "./testData/uk.json";

            private _target_country: Country;

            private _zoom: D3.Behavior.Zoom = d3.behavior.zoom();
            private _scale: number;

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);
                this._element.attr("height", function () {
                    let parentRect = this.parentNode.getBoundingClientRect();
                    let selfRect = this.getBoundingClientRect();
                    return parentRect.height - (selfRect.top - parentRect.top);
                });
                this._total_width = parseFloat(this._element.style("width"));
                this._total_height = parseFloat(this._element.style("height"));


                this._color
                    .range([
                        "rgb(158,202,225)",
                        //"rgb(158,202,225)",
                        //"rgb(107, 174, 214)",
                        //"rgb(66, 146, 198)",
                        //"rgb(33, 113, 181)",
                        "rgb(8, 81, 156)"
                    ]);


                this._projection
                    .scale(1)
                    .rotate([80, 0])
                    .translate([0, 0])

                this._path
                    .projection(this._projection)

                this._zoom
                    .scaleExtent([1, 3])
                    .on("zoomstart", () => {
                        //d3.event.sourceEvent.stopPropagation();
                    })
                    .on("zoom", () => {
                        this.Zoom(d3.event.translate, d3.event.scale);
                    })
                    .on("zoomend", () => {
                        //d3.event.sourceEvent.stopPropagation();
                    })

                this._manyLens.ManyLensHubRegisterClientFunction(this, "upDateGeoMap", this.UpdateMap);
            }

            private init() {
                this._element.on("mousedown", null);
                this._element
                    .on("dblclick", (d: Country) => {
                        this.Country_Clicked(d);
                    })
                    .call(this._zoom)
                    .on("dblclick.zoom", null)
            }

            public Toggle() {
                if (this._state) {
                    this.RemoveMap();
                } else {
                    this.init();
                    this.Render();
                }
                this._state = !this._state;
            }

            public RemoveMap() {
                this._map.transition().style("opacity", 0).remove();
            }

            public UpdateMap(mapData: [{ countryName: string; tweets: any[] }]): void {

                this._color.domain(d3.extent(mapData, function (d) { return d.tweets.length; }));
                this._data = mapData;
                var countryColor = {};
                mapData.forEach((d) => {
                    countryColor[d.countryName] = d.tweets.length;
                });
                this._map.selectAll("path")
                    .attr("fill", (d) => {
                        return "rgb(198,219,239)";
                    })
                    .transition()
                    .attr("fill", (d) => {
                        if (countryColor[d.id])
                            return this._color(countryColor[d.id]);
                        return "rgb(198,219,239)";
                    });
            }

            public Render() {
                if (this._world_topojson_data) {
                    this._projection
                        .scale(1)
                        .rotate([80, 0])
                        .translate([0, 0])
                        ;

                    // Compute the bounds of a feature of interest, then derive scale & translate.
                    var bounds = this._path.bounds(this._world_topojson_data);
                    var s = 0.99 / Math.max((bounds[1][0] - bounds[0][0]) / this._total_width, (bounds[1][1] - bounds[0][1]) / (this._total_height));
                    this._center_xy = [(this._total_width - s * (bounds[1][0] + bounds[0][0])) / 2, (this._total_height - s * (bounds[1][1] + bounds[0][1])) / 2];

                    this._projection
                        .scale(s)
                        .translate(this._center_xy);

                    this._map = this._element.append("g")
                        .attr("id", "world-countries");

                    this._map.selectAll("path")
                        .data(this._world_topojson_data.features, d => d.id)
                        .enter()
                        .append("path")
                        .attr("id", d => d.id)
                        .attr("d", this._path)
                        .attr("fill", (d) => {
                            return "rgb(198,219,239)";
                        })
                        .style({
                            stroke: "#fff",
                            "stoke-width": "0.5px"
                        })
                        .on("dblclick", (d: Country) => {
                            d3.event.stopPropagation();
                            this.Country_Clicked(d);
                        })

                } else {
                    d3.json(this._uk_topojson_path, (error, world) => {
                        this._world_topojson_data = topojson.feature(world, world.objects.subunits);

                        // Compute the bounds of a feature of interest, then derive scale & translate.
                        var bounds = this._path.bounds(this._world_topojson_data);
                        console.log(bounds);
                        var s = 0.99 / Math.max((bounds[1][0] - bounds[0][0]) / this._total_width, ((bounds[1][1] - bounds[0][1]) * 1) / (this._total_height));
                        this._center_xy = [(this._total_width - s * (bounds[1][0] + bounds[0][0])) / 2, (this._total_height - s * (bounds[1][1] + bounds[0][1])) / 2];

                        this._projection
                            .scale(s)
                            .translate(this._center_xy);

                        this._map = this._element.append("g")
                            .attr("id", "world-countries");
                        console.log(this._world_topojson_data);
                        this._map.selectAll("path")
                            .data(this._world_topojson_data.features, d => d.id)
                            .enter()
                            .append("path")
                            .attr("id", function (d: Country) { return d.id; })
                            .attr("d", this._path)
                            .attr("fill", (d) => {
                                return "rgb(198,219,239)";
                            })
                            .style({
                                stroke: "#fff",
                                "stoke-width": "0.5px"
                            })
                            .on("dblclick", (d: Country) => {
                                d3.event.stopPropagation();
                                this.Country_Clicked(d);
                            })
                    });
                }
            }

            private Country_Clicked(d: Country) {
                //if(this._target_country){
                //    this._map.selectAll("#"+this._target_country.id).style("display",null);
                //}

                if (d && this._target_country !== d) {
                    var xyz = this.Get_XYZ(d);
                    this._target_country = d;

                    console.log("d and different country");
                    this.Click_Zoom(xyz);
                } else {
                    this._target_country = null;
                    this.Click_Zoom([this._center_xy[0], this._center_xy[1], 1]);
                }
            }

            private Get_XYZ(d): number[] {
                var bounds = this._path.bounds(d);
                var w_scale = (bounds[1][0] - bounds[0][0]) / this._total_width;
                var h_scale = (bounds[1][1] - bounds[0][1]) / this._total_height;
                var z = .96 / Math.max(w_scale, h_scale);
                var x = (bounds[1][0] + bounds[0][0]) / 2;
                var y = (bounds[1][1] + bounds[0][1]) / 2 + (this._total_height / z / 6);
                return [x, y, z];
            }

            private Click_Zoom(xyz: number[]) {
                this._map.transition().duration(500)
                    .attr("transform", "translate(" + this._projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
                    .style("stroke-width", 1.0 / xyz[2] + "px")

                this._zoom
                    .translate([
                        -xyz[0] * xyz[2] + this._projection.translate()[0],
                        -xyz[1] * xyz[2] + this._projection.translate()[1]
                    ])
                    .scale(xyz[2]);

                this._element
                    .call(this._zoom)
                    .on("dblclick.zoom", null);
                this._scale = xyz[2];
            }

            private Zoom(translate: number[], scale: number) {
                if (d3.event.sourceEvent.type == "wheel") {
                    //if(d3.event.scale > this._scale){
                    //    this._zoom
                    //        .center(null);
                    //}else{
                    //    this._zoom
                    //        .center(this._center_xy);
                    //}

                    //this._element
                    //    .call(this._zoom)
                    //    .on("dblclick.zoom", null);
                    //;

                    this._map
                        .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
                        .style("stroke-width", 1.0 / scale + "px")

                    this._scale = scale;
                } else if (d3.event.sourceEvent.type == "mousemove") {
                    this._projection.rotate([translate[0] + 80]);

                    this._map.selectAll("path")
                        .data(this._world_topojson_data.features, function (d) { return d.id; })
                        .attr("d", this._path)

                    //    this._zoom.translate([
                    //            0,0
                    //        ]);
                    //     this._element
                    //    .call(this._zoom)
                    //    .on("dblclick.zoom", null);
                    //;
                }
            }
        }
    }
}