var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var MapLens = (function (_super) {
            __extends(MapLens, _super);
            function MapLens(element, manyLens) {
                _super.call(this, element, MapLens.Type, manyLens);
                this._projection = d3.geo.albersUsa();
                this._path = d3.geo.path();
                this._color = d3.scale.quantize();
                this._projection.scale(250).translate([0, 0]);
                this._path.projection(this._projection);
                this._color.range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                ]);
            }
            Object.defineProperty(MapLens.prototype, "Projection", {
                get: function () {
                    return this._projection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapLens.prototype, "Path", {
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapLens.prototype, "Color", {
                get: function () {
                    return this._color;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapLens.prototype, "MapData", {
                get: function () {
                    return this._map_data;
                },
                enumerable: true,
                configurable: true
            });
            MapLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            MapLens.prototype.ExtractData = function () {
                var data = [78, 72, 56, 55, 54, 53, 51, 50, 49, 48, 47, 46, 45, 44, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 13, 12, 11, 10, 9, 8, 6, 5, 4, 2, 1];
                var barData = [];
                data.forEach(function (d) {
                    barData[d] = Math.random() * 70;
                });
                return barData;
            };
            MapLens.prototype.DisplayLens = function (barData) {
                var _this = this;
                _super.prototype.DisplayLens.call(this, barData);
                if (this._map_data) {
                    this._map_data.color = [];
                    this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.states).features).enter().append("path").attr("d", this._path).attr("fill", function (d) {
                        var color = _this._color(_this._data[d.id]);
                        _this._map_data.color.push(color);
                        return color;
                    }).on("click", function (d) {
                        if (!d3.event.defaultPrevented)
                            _this.ClickedMap(d);
                    });
                    this._lens_circle_svg.append("path").datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.states, function (a, b) {
                        return a !== b;
                    })).attr("id", "state-borders").attr("d", this._path);
                }
                else {
                    d3.json("./testData/us.json", function (error, data) {
                        _this._color.domain(d3.extent(_this._data));
                        _this._map_data = {
                            raw: data,
                            color: []
                        };
                        _this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(data, data.objects.states).features).enter().append("path").attr("d", _this._path).attr("fill", function (d) {
                            var color = _this._color(_this._data[d.id]);
                            _this._map_data.color.push(color);
                            return color;
                        }).on("click", function (d) {
                            _this.ClickedMap(d);
                        });
                        _this._lens_circle_svg.append("path").datum(topojson.mesh(data, data.objects.states, function (a, b) {
                            return a !== b;
                        })).attr("id", "state-borders").attr("d", _this._path);
                    });
                }
            };
            MapLens.prototype.ClickedMap = function (d) {
                var _this = this;
                if (d3.event.defaultPrevented)
                    return;
                var x, y, k;
                if (d && this._centered_state !== d) {
                    var centroid = this._path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    this._centered_state = d;
                    this._lens_circle_zoom.on("zoom", null);
                    this._lens_circle_drag.on("dragstart", null).on("drag", null).on("dragend", null);
                    this._element.on("click", function () {
                        _this.ClickedMap(_this._centered_state);
                    });
                }
                else {
                    x = 0;
                    y = 0;
                    k = this._lens_circle_scale;
                    this._centered_state = null;
                    this._lens_circle_drag.on("dragstart", function () {
                        _this.LensCircleDragstartFunc();
                    }).on("drag", function () {
                        _this.LensCircleDragFunc();
                    }).on("dragend", function () {
                        _this.LensCircleDragendFunc();
                    });
                    this._lens_circle_zoom.scale(this._lens_circle_scale).on("zoom", function () {
                        _this.LensCircleZoomFunc();
                    });
                    this._element.on("click", null);
                }
                this._lens_circle_svg.selectAll("path").classed("active", this._centered_state && (function (d) {
                    return d === _this._centered_state;
                }));
                this._lens_circle_svg.transition().duration(750).attr("transform", function (d) {
                    return "translate(" + _this._lens_circle_cx + "," + _this._lens_circle_cy + ")scale(" + k + ")translate(" + [-x, -y] + ")";
                }).style("stroke-width", 1.5 / k + "px");
                d3.event.stopPropagation();
            };
            MapLens.Type = "MapLens";
            return MapLens;
        })(Lens.BaseSingleLens);
        Lens.MapLens = MapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
