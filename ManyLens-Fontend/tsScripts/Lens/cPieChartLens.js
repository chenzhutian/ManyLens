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
        var cPieChartLens = (function (_super) {
            __extends(cPieChartLens, _super);
            function cPieChartLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cPieChartLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.category20();
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie.value(function (d) {
                    return d.host;
                }).startAngle(function (d, i) {
                    console.log(d, i);
                    return 0;
                }).padAngle(function (d, i) {
                    console.log(d, i);
                    return 0;
                }).sort(null);
                this._arc.innerRadius(function (d) {
                    return _this._lens_circle_radius - 20;
                }).outerRadius(function (d) {
                    return _this._lens_circle_radius;
                });
            }
            cPieChartLens.prototype.Render = function (color) {
                if (color === void 0) { color = "pupple"; }
                _super.prototype.Render.call(this, color);
            };
            cPieChartLens.prototype.ExtractData = function () {
                var _this = this;
                var data;
                data = d3.range(6).map(function (d, i) {
                    return {
                        host: _this._data[i],
                        sub: Math.random() * _this._data[i]
                    };
                });
                return data;
            };
            cPieChartLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                this._lens_circle_svg.selectAll(".innerPie").data(this._pie(data)).enter().append("path").attr("d", this._arc).style("fill", function (d, i) {
                    return _this._color(i);
                }).style("fill-rule", "evenodd");
                this._arc.innerRadius(this._lens_circle_radius).outerRadius(this._lens_circle_radius + 20).endAngle(function (d, i) {
                    return d.startAngle + (d.endAngle - d.startAngle) * (d.data.sub / d.value);
                });
                this._lens_circle_svg.selectAll(".outerPie").data(this._pie(data)).enter().append("path").attr("fill", function (d, i) {
                    return _this._color(i);
                }).attr("d", this._arc);
            };
            cPieChartLens.Type = "cPieChartLens";
            return cPieChartLens;
        })(Lens.BaseCompositeLens);
        Lens.cPieChartLens = cPieChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
