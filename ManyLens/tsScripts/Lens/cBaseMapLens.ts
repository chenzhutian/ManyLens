///<reference path = "./BaseSingleLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
module ManyLens {
    export module Lens {
        export class cBaseMapLens extends BaseCompositeLens {

            public static Type: string = "cBaseMapLens";

            protected _projection: D3.Geo.Projection = d3.geo.albersUsa();
            protected _path: D3.Geo.Path = d3.geo.path();
            protected _color: D3.Scale.QuantizeScale = d3.scale.quantize();
            protected _centered_state: Object;

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

            constructor(element: D3.Selection, type:string, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, type, manyLens, firstLens, secondLens);
                var mapLens: MapLens;
                if (secondLens) {
                    mapLens = <MapLens>(firstLens.Type == "MapLens" ? firstLens : secondLens);
                } else {
                    mapLens = <MapLens>(firstLens);
                }

                this._projection = mapLens.Projection;
                this._path = mapLens.Path;
                this._color = mapLens.Color;
                this._map_data = mapLens.MapData;

            }

            public Render(color = "red"): void {
                super.Render(color);

            }


            public DisplayLens(): void {
                super.DisplayLens();
                this._lens_circle_svg.append("g")
                    .attr("id", "states")
                    .selectAll("path")
                    .data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.states).features)
                    .enter().append("path")
                    .attr("d", this._path)
                    .attr("fill", (d, i) => {
                        return this._map_data.color[i];
                    })
                    .on("click", (d) => {
                        if(!d3.event.defaultPrevented)
                            this.ClickedMap(d);
                    })
                ;

                this._lens_circle_svg.append("g")
                    .attr("id", "state-borders")
                    .append("path")
                    .datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.states, function (a, b) { return a !== b; }))
                    .attr("d", this._path);

            }


            protected ClickedMap(d: any) {
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