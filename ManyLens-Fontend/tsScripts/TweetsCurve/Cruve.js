var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ManyLens;
(function (ManyLens) {
    var TweetsCurve;
    (function (TweetsCurve) {
        var Curve = (function (_super) {
            __extends(Curve, _super);
            function Curve(element) {
                _super.call(this, element);
                this._x = d3.scale.linear();
                this._y = d3.scale.linear();
                this._x_axis_gen = d3.svg.axis();
                this._y_axis_gen = d3.svg.axis();
                this._section_num = 10;
                this._view_height = 150;
                this._view_width = window.innerWidth - 30;
                this._view_top_padding = 15;
                this._view_botton_padding = 20;
                this._view_left_padding = 50;
                this._view_right_padding = 50;
                this._x.range([this._view_left_padding, this._view_width - this._view_right_padding]).domain([0, this._section_num]);
                this._y.range([this._view_height - this._view_botton_padding, this._view_top_padding]).domain([0, 20]);
                this._x_axis_gen.scale(this._x).ticks(this._section_num).orient("bottom");
                this._y_axis_gen.scale(this._y).ticks(2).orient("left");
            }
            Object.defineProperty(Curve.prototype, "Section_Num", {
                get: function () {
                    return this._section_num;
                },
                set: function (num) {
                    if (typeof num === 'number') {
                        this._section_num = Math.ceil(num);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Curve.prototype.Render = function (data) {
                _super.prototype.Render.call(this, data);
                var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
                var coordinate_view_height = this._view_height - this._view_top_padding - this._view_botton_padding;
                var svg = this._element.append("svg").attr("width", this._view_width).attr("height", this._view_height);
                svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", coordinate_view_width).attr("height", coordinate_view_height).attr("x", this._view_left_padding).attr("y", this._view_top_padding);
                var xAxis = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (this._view_height - this._view_botton_padding) + ")").call(this._x_axis_gen);
                var yAxis = svg.append("g").attr("class", "y axis").attr("transform", "translate(" + this._view_left_padding + ",0)").call(this._y_axis_gen);
                svg.append("g").attr("clip-path", "url(#clip)").append("g").attr("id", "curve.mainView").append("path").attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none').attr("id", "path");
            };
            return Curve;
        })(ManyLens.D3ChartObject);
        TweetsCurve.Curve = Curve;
    })(TweetsCurve = ManyLens.TweetsCurve || (ManyLens.TweetsCurve = {}));
})(ManyLens || (ManyLens = {}));
