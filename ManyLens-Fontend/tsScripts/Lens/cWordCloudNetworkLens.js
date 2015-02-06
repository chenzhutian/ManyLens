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
        var cWordCloudNetworkLens = (function (_super) {
            __extends(cWordCloudNetworkLens, _super);
            function cWordCloudNetworkLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cWordCloudNetworkLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 0;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._innerRadius = this._lens_circle_radius - 2;
                this._outterRadius = this._lens_circle_radius + 20;
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._chord = d3.layout.chord();
                this._color = d3.scale.category10();
                this._arc.innerRadius(this._innerRadius).outerRadius(this._outterRadius);
                this._pie.value(function (d) {
                    return d;
                }).sort(null).startAngle(-Math.PI * 8 / 3).endAngle(-Math.PI * 2 / 3);
                this._chord.padding(.05).sortSubgroups(d3.descending);
            }
            cWordCloudNetworkLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cWordCloudNetworkLens.prototype.ExtractData = function () {
                var data;
                data = [
                    { text: "aaa", value: 10 },
                    { text: "bbb", value: 10 },
                    { text: "ccc", value: 9 },
                    { text: "LG", value: 9 },
                    { text: "Nokia", value: 9 },
                    { text: "Gear", value: 9 },
                    { text: "fear", value: 9 },
                    { text: "pear", value: 8 },
                    { text: "jjear", value: 8 },
                    { text: "weqr", value: 8 },
                    { text: "vbn", value: 8 },
                    { text: "lk", value: 8 },
                    { text: "lopxcv", value: 7 },
                    { text: "yyyy", value: 7 },
                    { text: "lxzcvk", value: 7 },
                    { text: "tyu", value: 7 },
                    { text: "jjear", value: 6 },
                    { text: "weqr", value: 6 },
                    { text: "vbn", value: 6 },
                    { text: "lk", value: 6 },
                    { text: "lopxcv", value: 5 },
                    { text: "yyyy", value: 5 },
                    { text: "lxzcvk", value: 5 },
                ];
                data.forEach(function (d, i) {
                    d["group"] = (i % 3) + 1;
                });
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                    return d.value;
                }));
                return data;
            };
            cWordCloudNetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bound) {
                    _this.DrawCloud(words, bound);
                });
                this._cloud.start();
                var groups = [];
                for (var i = 0, len = data.length; i < len; ++i) {
                    if (groups[parseInt(data[i]['group']) - 1] != null) {
                        var group = parseInt(data[i]['group']);
                        groups[group - 1]++;
                    }
                    else {
                        groups[parseInt(data[i]['group']) - 1] = 0;
                    }
                }
                this._chord.matrix([
                    [2000, 2300, 2100],
                    [1951, 2100, 2000],
                    [2300, 2200, 2100]
                ]);
                this._lens_circle_svg.selectAll("path").data(this._chord.groups).enter().append("path").attr("fill", function (d, i) {
                    return _this._color(i + 1);
                }).attr("d", this._arc);
                this._lens_circle_svg.append("g").attr("class", "chord").selectAll("path").data(this._chord.chords).enter().append("path").attr("d", d3.svg.chord().radius(this._innerRadius)).style("fill", function (d, i) {
                    return _this._color(i + 1);
                }).style("opacity", 0.9).style("fill-opacity", 0.15);
            };
            cWordCloudNetworkLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var text = this._lens_circle_svg.selectAll("text").data(words, function (d) {
                    return d.text;
                }).enter().append("text");
                text.attr("text-anchor", "middle").style("font-size", function (d) {
                    return d.size + "px";
                }).style("font-weight", function (d) {
                    return d.weight;
                }).style("font-family", function (d) {
                    return d.font;
                }).style("fill", function (d, i) {
                    return _this._color(d.group);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            cWordCloudNetworkLens.Type = "cWordCloudNetworkLens";
            return cWordCloudNetworkLens;
        })(Lens.BaseCompositeLens);
        Lens.cWordCloudNetworkLens = cWordCloudNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
