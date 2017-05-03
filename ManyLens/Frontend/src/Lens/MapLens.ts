﻿import * as topojson from "topojson";
import * as d3 from "d3";
import { geo, scale, Selection } from "d3";
import { BaseSingleLens } from "./index";
import { ManyLens } from "../ManyLens";

export class MapLens extends BaseSingleLens {

    public static Type: string = "MapLens";

    private _projection: geo.Projection = d3.geo.equirectangular();

    //d3.geo.mercator();
    private _path: geo.Path = d3.geo.path();
    private _color: scale.Quantize<any> = d3.scale.quantize();
    private _centered_state: Object;

    private _hack_color: string[];

    private _map_data: {
        raw: any;
    };

    public get Projection(): geo.Projection {
        return this._projection;
    }
    public get Path(): geo.Path {
        return this._path;
    }
    public get Color(): scale.Quantize<any> {
        return this._color;
    }
    public get MapData(): any {
        return this._map_data;
    }

    public Render(color: string): void {
        super.Render(color);
    }

    constructor(element: Selection<any>, attributeName: string, manyLens: ManyLens) {
        super(element, attributeName, MapLens.Type, manyLens);

        this._projection
            .precision(.1)
            .scale(76)
            .rotate([0, 0, 0])
            .center([-0.6, 38.7])
            .translate([0, -30]);

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
        this._hack_color = ["rgb(198,219,239)",
            "rgb(158,202,225)",
            "rgb(107, 174, 214)",
            "rgb(66, 146, 198)",
            "rgb(33, 113, 181)"];
    }

    protected AfterExtractData(): void {
        var data = {};
        this._color.domain(d3.extent(this._extract_data_map_func.Extract(this._data), function (d) { return d['Value']; }));
        this._extract_data_map_func.Extract(this._data).forEach((d) => {
            data[d.Key] = d.Value;
        });
        this._data = data;
    }

    public DisplayLens(): any {
        if (!super.DisplayLens()) return;

        this._lens_circle
            .attr("d", () => {
                return "M" + -(2.5 * this._lens_circle_radius) + "," + -this._lens_circle_radius
                    + "L" + -(2.5 * this._lens_circle_radius) + "," + this._lens_circle_radius
                    + "L" + (2.5 * this._lens_circle_radius) + "," + this._lens_circle_radius
                    + "L" + (2.5 * this._lens_circle_radius) + "," + -this._lens_circle_radius
                    + "Z";
            });

        if (this._map_data) {
            this._lens_circle_svg.append("g")
                .attr("id", "country")
                .selectAll("path")
                .data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.countries).features)
                .enter().append("path")
                .attr("d", this._path)
                .attr("fill", (d) => {
                    var color = this._color(this._data[d.id] || 0);
                    //var color = this._hack_color[Math.floor(Math.random()*5)];
                    return color;
                })
                .on("click", (d) => {
                    if (!(d3.event as Event).defaultPrevented)
                        this.ClickedMap(d);
                })

            this._lens_circle_svg.append("path")
                .datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.countries, function (a, b) { return a !== b; }))
                .attr("id", "state-borders")
                .attr("d", this._path)

        } else {
            d3.json("./testData/countriesAlpha2.topo.json", (error, mapData) => {
                this._map_data = {
                    raw: mapData,
                };

                var pathData = topojson.feature(mapData, mapData.objects.countries);

                this._lens_circle_svg.append("g")
                    .attr("id", "states")
                    .selectAll("path")
                    .data(pathData.features)
                    .enter().append("path")
                    .attr("d", this._path)
                    .attr("fill", (d) => {
                        //var color = this._color(this._data[d.id]||0);
                        var color = this._hack_color[Math.floor(Math.random() * 5)];
                        return color;
                    })
                    .on("click", (d) => {
                        this.ClickedMap(d);
                    })
                    ;

                this._lens_circle_svg.append("path")
                    .datum(topojson.mesh(mapData, mapData.objects.countries, function (a, b) { return a !== b; }))
                    .attr("id", "state-borders")
                    .attr("d", this._path)
                    ;

            });
        }
    }

    private ClickedMap(d: any) {
        if ((d3.event as Event).defaultPrevented) return;
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

        (d3.event as Event).stopPropagation();
    }

}