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
        var LocationLens = (function (_super) {
            __extends(LocationLens, _super);
            function LocationLens(element, manyLens) {
                _super.call(this, element, LocationLens.Type, manyLens);
                this._map_width = this._lc_radius * Math.SQRT2;
                this._map_height = this._map_width;
                this._map_path = "./img/chinamap.svg";
                this._projection = d3.geo.albersUsa();
                this._path = d3.geo.path();
                this._projection.scale(250).translate([0, 0]);
                this._path.projection(this._projection);
            }
            LocationLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            LocationLens.prototype.ExtractData = function () {
            };
            LocationLens.prototype.DisplayLens = function (data) {
                var _this = this;
                d3.json("../testData/us.json", function (error, data) {
                    _super.prototype.DisplayLens.call(_this, data);
                    var path = _this._path;
                    var width = _this._map_width;
                    var height = _this._map_height;
                    var g = _this._lens_circle_G.append("g");
                    var centered;
                    g.append("g").attr("id", "states").selectAll("path").data(topojson.feature(data, data.objects.states).features).enter().append("path").attr("d", _this._path).on("click", clicked);
                    g.append("path").datum(topojson.mesh(data, data.objects.states, function (a, b) {
                        return a !== b;
                    })).attr("id", "state-borders").attr("d", _this._path);
                    function clicked(d) {
                        var x, y, k;
                        if (d && centered !== d) {
                            var centroid = path.centroid(d);
                            x = centroid[0];
                            y = centroid[1];
                            k = 4;
                            centered = d;
                        }
                        else {
                            x = 0;
                            y = 0;
                            k = 1;
                            centered = null;
                        }
                        g.selectAll("path").classed("active", centered && function (d) {
                            return d === centered;
                        });
                        g.transition().duration(750).attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + k + ")translate(" + -x + "," + -y + ")").style("stroke-width", 1.5 / k + "px");
                    }
                });
            };
            LocationLens.Type = "LocationLens";
            return LocationLens;
        })(Lens.BaseSingleLens);
        Lens.LocationLens = LocationLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
