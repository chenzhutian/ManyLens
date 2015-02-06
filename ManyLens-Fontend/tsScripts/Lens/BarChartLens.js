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
        var BarChartLens = (function (_super) {
            __extends(BarChartLens, _super);
            function BarChartLens(element, manyLens) {
                _super.call(this, element, BarChartLens.Type, manyLens);
                this._x_axis_gen = d3.svg.axis();
                this._bar_chart_width = this._lens_circle_radius * Math.SQRT2;
                this._bar_chart_height = this._bar_chart_width;
            }
            BarChartLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            BarChartLens.prototype.ExtractData = function () {
                var data;
                data = d3.range(12).map(function (d) {
                    return 10 + 70 * Math.random();
                });
                return data;
            };
            BarChartLens.prototype.DisplayLens = function (data) {
                var _this = this;
                _super.prototype.DisplayLens.call(this, data);
                var x = d3.scale.linear().range([0, this._bar_chart_width]).domain([0, this._data.length]);
                this._x_axis_gen.scale(x).ticks(0).orient("bottom");
                this._x_axis = this._lens_circle_svg.append("g").attr("class", "x-axis").attr("transform", function () {
                    return "translate(" + [-_this._bar_chart_width / 2, _this._bar_chart_height / 2] + ")";
                }).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1).call(this._x_axis_gen);
                this._bar_width = (this._bar_chart_width - 20) / this._data.length;
                var barHeight = d3.scale.linear().range([10, this._bar_chart_height]).domain(d3.extent(this._data));
                var bar = this._lens_circle_svg.selectAll(".bar").data(this._data).enter().append("g").attr("transform", function (d, i) {
                    return "translate(" + [10 + i * _this._bar_width - _this._bar_chart_width / 2, _this._bar_chart_height / 2 - barHeight(d)] + ")";
                });
                bar.append("rect").attr("width", this._bar_width).attr("height", function (d) {
                    return barHeight(d);
                }).attr("fill", "steelblue");
            };
            BarChartLens.Type = "BarChartLens";
            return BarChartLens;
        })(Lens.BaseSingleLens);
        Lens.BarChartLens = BarChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
