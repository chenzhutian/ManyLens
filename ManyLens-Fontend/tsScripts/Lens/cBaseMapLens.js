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
        var cBaseMapLens = (function (_super) {
            __extends(cBaseMapLens, _super);
            function cBaseMapLens(element, type, manyLens, firstLens, secondLens) {
                _super.call(this, element, type, manyLens, firstLens, secondLens);
                this._projection = d3.geo.albersUsa();
                this._path = d3.geo.path();
                this._color = d3.scale.quantize();
                var mapLens;
                if (secondLens) {
                    mapLens = (firstLens.Type == "MapLens" ? firstLens : secondLens);
                }
                else {
                    mapLens = (firstLens);
                }
                this._projection = mapLens.Projection;
                this._path = mapLens.Path;
                this._color = mapLens.Color;
                this._map_data = mapLens.MapData;
            }
            Object.defineProperty(cBaseMapLens.prototype, "Projection", {
                get: function () {
                    return this._projection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(cBaseMapLens.prototype, "Path", {
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(cBaseMapLens.prototype, "Color", {
                get: function () {
                    return this._color;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(cBaseMapLens.prototype, "MapData", {
                get: function () {
                    return this._map_data;
                },
                enumerable: true,
                configurable: true
            });
            cBaseMapLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cBaseMapLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.states).features).enter().append("path").attr("d", this._path).attr("fill", function (d, i) {
                    return _this._map_data.color[i];
                }).on("click", function (d) {
                    if (!d3.event.defaultPrevented)
                        _this.ClickedMap(d);
                });
                this._lens_circle_svg.append("g").attr("id", "state-borders").append("path").datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.states, function (a, b) {
                    return a !== b;
                })).attr("d", this._path);
            };
            cBaseMapLens.prototype.ClickedMap = function (d) {
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
            cBaseMapLens.Type = "cBaseMapLens";
            return cBaseMapLens;
        })(Lens.BaseCompositeLens);
        Lens.cBaseMapLens = cBaseMapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
