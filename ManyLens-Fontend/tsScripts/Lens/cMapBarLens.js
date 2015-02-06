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
        var cMapBarLens = (function (_super) {
            __extends(cMapBarLens, _super);
            function cMapBarLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cMapBarLens.Type, manyLens, firstLens, secondLens);
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie_color = d3.scale.category20();
                this._pie.value(function (d) {
                    return d;
                }).sort(null);
                this._arc.innerRadius(function (d) {
                    return _this._lens_circle_radius;
                }).outerRadius(function (d) {
                    return _this._lens_circle_radius + 20;
                });
            }
            cMapBarLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cMapBarLens.prototype.ExtractData = function () {
                var data = d3.range(6).map(function () {
                    return Math.random() * 60;
                });
                return data;
            };
            cMapBarLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var barData = this.ExtractData();
                this._lens_circle_svg.selectAll(".innerPie").data(this._pie(barData)).enter().append("path").attr("d", this._arc).style("fill", function (d, i) {
                    return _this._pie_color(i);
                }).style("fill-rule", "evenodd");
            };
            cMapBarLens.Type = "cMapBarLens";
            return cMapBarLens;
        })(Lens.cBaseMapLens);
        Lens.cMapBarLens = cMapBarLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
