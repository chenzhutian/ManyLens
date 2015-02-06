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
        var cMapNetworkLens = (function (_super) {
            __extends(cMapNetworkLens, _super);
            function cMapNetworkLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cMapNetworkLens.Type, manyLens, firstLens, secondLens);
                this._link = d3.svg.diagonal();
                this._link.source(function (d) {
                    var t = _this._projection(d.coordinates[0]);
                    return {
                        x: t[0],
                        y: t[1]
                    };
                }).target(function (d) {
                    var t = _this._projection(d.coordinates[1]);
                    return {
                        x: t[0],
                        y: t[1]
                    };
                });
            }
            cMapNetworkLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cMapNetworkLens.prototype.ExtractData = function () {
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
            };
            cMapNetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var networkData = this.ExtractData();
                var networkG = this._lens_circle_svg.append("g").attr("id", "network");
                var pathArcs = networkG.selectAll(".cMapPath").data(networkData);
                pathArcs.enter().append("path").attr("class", "cMapPath").style({
                    "fill": "none"
                });
                var networkNode = networkG.selectAll(".cMapNode").data(networkData).enter().append("circle").attr("class", "cMapNode").attr("cx", function (d) {
                    return _this._projection(d.coordinates[0])[0];
                }).attr("cy", function (d) {
                    return _this._projection(d.coordinates[0])[1];
                }).attr("r", 4).style({
                    "stroke": "steelblue",
                    "fill": "#fff",
                    "stroke-width": 1.5
                });
                pathArcs.attr('d', function (d) {
                    return _this._link(d);
                }).attr("stroke-dasharray", function (d) {
                    var totalLen = d3.select(this).node().getTotalLength();
                    return totalLen + "," + totalLen;
                }).attr("stroke-dashoffset", function (d) {
                    var totalLen = d3.select(this).node().getTotalLength();
                    return totalLen;
                }).style({
                    "stroke": "#d73027",
                    "stroke-width": "1.2px"
                }).transition().duration(2000).attr("stroke-dashoffset", 0);
                ;
                pathArcs.exit().remove();
            };
            cMapNetworkLens.Type = "cMapNetworkLens";
            return cMapNetworkLens;
        })(Lens.cBaseMapLens);
        Lens.cMapNetworkLens = cMapNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
