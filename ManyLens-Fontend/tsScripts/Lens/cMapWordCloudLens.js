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
        var cMapWordCloudLens = (function (_super) {
            __extends(cMapWordCloudLens, _super);
            function cMapWordCloudLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cMapWordCloudLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 0;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._text_color = d3.scale.ordinal().domain([1, 2]).range(["#d62728", "#ff7f0e"]);
            }
            cMapWordCloudLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cMapWordCloudLens.prototype.ExtractData = function () {
                var _this = this;
                var data;
                data = [
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
                    d.value -= 3;
                    d["group"] = (i % 2) + 1;
                    d["coordinates"] = d["group"] == 1 ? _this._projection([-86.674368, 34.646554]) : _this._projection([-118.176008, 34.200463]);
                });
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                    return d.value;
                }));
                return data;
            };
            cMapWordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var barData = this.ExtractData();
                var data = this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bound) {
                    _this.DrawCloud(words, bound);
                });
                this._cloud.start();
            };
            cMapWordCloudLens.prototype.DrawCloud = function (words, bounds) {
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
                    return _this._text_color(d.group);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            cMapWordCloudLens.Type = "cMapWordCloudLens";
            return cMapWordCloudLens;
        })(Lens.cBaseMapLens);
        Lens.cMapWordCloudLens = cMapWordCloudLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
