var ManyLens;
(function (ManyLens) {
    var D3ChartObject = (function () {
        function D3ChartObject(element) {
            this._element = element;
        }
        D3ChartObject.prototype.render = function (data) {
            this._data = data;
        };
        return D3ChartObject;
    })();
    ManyLens.D3ChartObject = D3ChartObject;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/D3ChartObject.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ManyLens;
(function (ManyLens) {
    var Curve = (function (_super) {
        __extends(Curve, _super);
        function Curve(element) {
            _super.call(this, element);
            this._x = d3.scale.linear();
            this._y = d3.scale.linear();
            this._x_axis_gen = d3.svg.axis();
            this._y_axis_gen = d3.svg.axis();
            this._section_num = 80;
            this._view_height = 150;
            this._view_width = screen.width;
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
        Curve.prototype.render = function (data) {
            _super.prototype.render.call(this, data);
            var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
            var coordinate_view_height = this._view_height - this._view_top_padding - this._view_botton_padding;
            var svg = this._element.append("svg").attr("width", this._view_width).attr("height", this._view_height);
            svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", coordinate_view_width).attr("height", coordinate_view_height).attr("x", this._view_left_padding).attr("y", this._view_top_padding);
            var xAxis = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + (this._view_height - this._view_botton_padding) + ")").call(this._x_axis_gen);
            var yAxis = svg.append("g").attr("class", "y axis").attr("transform", "translate(" + this._view_left_padding + ",0)").call(this._y_axis_gen);
            svg.append("g").attr("clip-path", "url(#clip)").append("g").attr("id", "mainView").append("path").attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none').attr("id", "path");
        };
        return Curve;
    })(ManyLens.D3ChartObject);
    ManyLens.Curve = Curve;
})(ManyLens || (ManyLens = {}));
///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../tsScripts/Cruve.ts" />
"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var curveView = new ManyLens.Curve(d3.select("#cruveView"));
    curveView.render([10, 10]);
    var pieChartLens = new ManyLens.PieChartLens(d3.select("#mapView").select("svg"));
    pieChartLens.render();
});
///<reference path = "../tsScripts/D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var BaseD3Lens = (function (_super) {
        __extends(BaseD3Lens, _super);
        //protected _lc_cx: number;
        //protected _lc_cy: number;
        function BaseD3Lens(element) {
            _super.call(this, element);
            this._sc_radius = 10;
            this._lc_radius = 100;
        }
        BaseD3Lens.prototype.render = function () {
            var _this = this;
            var container = this._element;
            var cr = this._sc_radius;
            var hasShow = false;
            var selectCircle = this._select_circle = this._element.append("circle").attr("r", cr).attr("fill", "purple").attr("fill-opacity", 0.3).on("mousedown", function () {
                container.on("mousemove", moveSelectCircle);
            }).on("mouseup", function () {
                _this._sc_cx = parseFloat(selectCircle.attr("cx"));
                _this._sc_cy = parseFloat(selectCircle.attr("cy"));
                var data = _this.extractData();
                if (!hasShow) {
                    _this.showLens(data);
                    hasShow = true;
                }
                container.on("mousemove", null);
            });
            container.on("mousemove", moveSelectCircle);
            function moveSelectCircle() {
                container.select(".lcthings").remove();
                var p = d3.mouse(container[0][0]);
                selectCircle.attr("cx", p[0]).attr("cy", p[1]);
                hasShow = false;
            }
        };
        BaseD3Lens.prototype.extractData = function () {
            throw new Error('This method is abstract');
        };
        BaseD3Lens.prototype.showLens = function (any) {
            if (any === void 0) { any = null; }
            var sc_lc_dist = 100;
            var theta = Math.PI / 2.5;
            var container = this._element;
            var cr = this._sc_radius;
            var cx = this._sc_cx + (cr * Math.cos(theta));
            var cy = this._sc_cy + (cr * Math.sin(theta));
            var duration = 200;
            container.append("g").attr("class", "lcthings").append("line").attr("x1", cx).attr("y1", cy).attr("x2", cx).attr("y2", cy).attr("stoke-width", 2).attr("stroke", "red").transition().duration(duration).attr("x2", function () {
                cx = cx + (sc_lc_dist * Math.cos(theta));
                return cx;
            }).attr("y2", function () {
                cy = cy + (sc_lc_dist * Math.sin(theta));
                return cy;
            });
            return {
                ncx: cx + (this._lc_radius * Math.cos(theta)),
                ncy: cy + (this._lc_radius * Math.sin(theta)),
                theta: theta,
                duration: duration
            };
        };
        return BaseD3Lens;
    })(ManyLens.D3ChartObject);
    ManyLens.BaseD3Lens = BaseD3Lens;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var PieChartLens = (function (_super) {
        __extends(PieChartLens, _super);
        function PieChartLens(element) {
            _super.call(this, element);
            this._innerRadius = this._lc_radius - 20;
            this._outterRadius = this._lc_radius - 0;
            this._pie = d3.layout.pie();
            this._arc = d3.svg.arc().innerRadius(this._innerRadius).outerRadius(this._outterRadius);
            this._color = d3.scale.category20();
        }
        PieChartLens.prototype.render = function () {
            _super.prototype.render.call(this);
        };
        PieChartLens.prototype.extractData = function () {
            var data;
            data = d3.range(6).map(function (d) {
                return Math.random() * 70;
            });
            return data;
        };
        PieChartLens.prototype.showLens = function (data) {
            var _this = this;
            var p = _super.prototype.showLens.call(this);
            var container = this._element;
            this._pie.value(function (d) {
                return d;
            }).sort(null);
            var lensG = container.select("g.lcthings").append("g").datum(data).attr("opacity", "1e-6").attr("transform", "translate(" + [p.ncx, p.ncy] + ")").on("mousedown", function () {
                lensG.on("mousemove", function () {
                    var p = d3.mouse(container[0][0]);
                    d3.select("g.lcthings").select("g").attr("transform", "translate(" + [p[0], p[1]] + ")");
                    var theta = Math.atan((p[1] - _this._sc_cy) / (p[0] - _this._sc_cx));
                    var cosTheta = p[0] > _this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = p[0] > _this._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                    d3.select("g.lcthings").select("line").attr("x1", _this._sc_cx + _this._sc_radius * cosTheta).attr("y1", _this._sc_cy + _this._sc_radius * sinTheta).attr("x2", p[0] - _this._lc_radius * cosTheta).attr("y2", p[1] - _this._lc_radius * sinTheta);
                });
            }).on("mouseup", function () {
                d3.select(this).on("mousemove", null);
            });
            lensG.selectAll("path").data(this._pie).enter().append("path").attr("fill", function (d, i) {
                return _this._color(i);
            }).attr("d", this._arc);
            d3.select("g.lcthings").select("g").append("circle").attr("cx", 0).attr("cy", 0).attr("r", this._innerRadius).attr("fill", "rgb(221,221,221)").attr("fill-opacity", 0.3);
            d3.select("g.lcthings").select("g").transition().duration(p.duration).attr("opacity", "1");
        };
        return PieChartLens;
    })(ManyLens.BaseD3Lens);
    ManyLens.PieChartLens = PieChartLens;
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var SOMMap = (function () {
        function SOMMap() {
        }
        return SOMMap;
    })();
    ManyLens.SOMMap = SOMMap;
})(ManyLens || (ManyLens = {}));
//# sourceMappingURL=ManyLens.js.map