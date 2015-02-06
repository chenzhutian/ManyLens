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
        var cWordCloudPieLens = (function (_super) {
            __extends(cWordCloudPieLens, _super);
            function cWordCloudPieLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cWordCloudPieLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 1;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._cloud_text_color = d3.scale.category10();
                this._pie.value(function (d) {
                    return d;
                }).sort(null);
                this._arc.innerRadius(function (d) {
                    return _this._lens_circle_radius;
                }).outerRadius(function (d) {
                    return _this._lens_circle_radius + 20;
                });
            }
            cWordCloudPieLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cWordCloudPieLens.prototype.ExtractData = function () {
                var data;
                data = [
                    { text: "Samsung", value: 90 },
                    { text: "Apple", value: 50 },
                    { text: "Lenovo", value: 50 },
                    { text: "LG", value: 60 },
                    { text: "Nokia", value: 30 },
                    { text: "Huawei", value: 40 },
                    { text: "Meizu", value: 50 },
                    { text: "eizu", value: 50 },
                    { text: "ZTE", value: 40 },
                    { text: "Fiiit", value: 40 },
                    { text: "qweri", value: 40 },
                    { text: "bnm", value: 40 },
                    { text: "tytyt", value: 40 },
                    { text: "asdf", value: 40 },
                    { text: "Fit", value: 40 },
                    { text: "Gear", value: 30 },
                    { text: "fear", value: 20 },
                    { text: "pear", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "Gea", value: 10 },
                    { text: "Ge", value: 10 },
                    { text: "Gfa", value: 10 },
                    { text: "a", value: 10 },
                    { text: "bvea", value: 10 },
                    { text: "Gea", value: 10 },
                    { text: "cea", value: 10 },
                    { text: "uea", value: 10 },
                    { text: "lea", value: 10 },
                    { text: "ea", value: 10 },
                    { text: "pp", value: 10 },
                    { text: "nh", value: 10 },
                    { text: "erw", value: 10 }
                ];
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                    return d.value;
                }));
                return data;
            };
            cWordCloudPieLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bounds) {
                    _this.DrawCloud(words, bounds);
                });
                this._cloud.start();
                var barData = d3.range(6).map(function () {
                    return Math.random() * 60;
                });
                this._lens_circle_svg.selectAll(".innerPie").data(this._pie(barData)).enter().append("path").attr("d", this._arc).style("fill", function (d, i) {
                    return _this._cloud_text_color(i);
                }).style("fill-rule", "evenodd");
            };
            cWordCloudPieLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var w = this._cloud_w;
                var h = this._cloud_h;
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
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
                    return _this._cloud_text_color(d.size);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            cWordCloudPieLens.Type = "cWordCloudPieLens";
            return cWordCloudPieLens;
        })(Lens.BaseCompositeLens);
        Lens.cWordCloudPieLens = cWordCloudPieLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
