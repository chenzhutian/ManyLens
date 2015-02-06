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
        var PieChartLens = (function (_super) {
            __extends(PieChartLens, _super);
            function PieChartLens(element, manyLens) {
                _super.call(this, element, PieChartLens.Type, manyLens);
                this._innerRadius = this._lens_circle_radius - 20;
                this._outterRadius = this._lens_circle_radius - 0;
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._color = d3.scale.category20();
                this._arc.innerRadius(this._innerRadius).outerRadius(this._outterRadius);
                this._pie.value(function (d) {
                    return d;
                }).sort(null);
            }
            Object.defineProperty(PieChartLens.prototype, "Color", {
                get: function () {
                    return this._color;
                },
                enumerable: true,
                configurable: true
            });
            PieChartLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            PieChartLens.prototype.ExtractData = function () {
                var data;
                data = d3.range(6).map(function (d) {
                    return Math.random() * 70;
                });
                return data;
            };
            PieChartLens.prototype.DisplayLens = function (data) {
                var _this = this;
                _super.prototype.DisplayLens.call(this, data);
                this._lens_circle_svg.selectAll("path").data(this._pie(this._data)).enter().append("path").attr("fill", function (d, i) {
                    return _this._color(i);
                }).attr("d", this._arc);
            };
            PieChartLens.Type = "PieChartLens";
            return PieChartLens;
        })(Lens.BaseSingleLens);
        Lens.PieChartLens = PieChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
