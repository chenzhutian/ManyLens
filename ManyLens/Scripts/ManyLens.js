var ManyLens;
(function (ManyLens) {
    var SOMMap = (function () {
        function SOMMap() {
        }
        return SOMMap;
    })();
    ManyLens.SOMMap = SOMMap;
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var Curve = (function () {
        function Curve() {
            this._x = d3.scale.linear();
            this._y = d3.scale.linear();
            this._section_num = 150;
        }
        Object.defineProperty(Curve.prototype, "X", {
            get: function () {
                return this._x;
            },
            set: function (scale) {
                this._x = scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Curve.prototype, "Y", {
            get: function () {
                return this._y;
            },
            set: function (scale) {
                this._y = scale;
            },
            enumerable: true,
            configurable: true
        });
        return Curve;
    })();
    ManyLens.Curve = Curve;
})(ManyLens || (ManyLens = {}));
///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../tsScripts/SOMMap.ts" />
///<reference path = "../tsScripts/Cruve.ts" />
//"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Chart;
(function (Chart) {
    var Base = (function () {
        function Base(element) {
            this.element = element;
            this.iso8601 = d3.time.format('%Y-%m-%d');
            this.chartWidth = 800;
        }
        return Base;
    })();
    Chart.Base = Base;
    var Bar = (function (_super) {
        __extends(Bar, _super);
        function Bar(element) {
            _super.call(this, element);
            this.chartHeight = 400;
            this.chartWidth = 800;
            this.legendItemHeight = 30;
            this.legendWidth = 150;
            this.colors = ['rgb(0, 113, 188)', 'rgb(0, 174, 239)', 'rgb(145, 0, 145)'];
            this.xAxisHashHeight = 10;
            this.layout = 'wiggle';
            this.element = element;
        }
        Bar.prototype.render = function (data) {
            var _this = this;
            // Create stack layout
            var stackLayout = d3.layout.stack().values(function (d) {
                return d.data;
            }).offset(this.layout);
            var stackData = stackLayout(data);
            // Maximum measurement in the dataset
            var maxY = d3.max(stackData, function (d) { return d3.max(d.data, function (d) { return d.y0 + d.y; }); });
            // Earliest day in the dataset
            var minX = d3.min(data, function (d) { return d3.min(d.data, function (d) { return d.x; }); });
            // All days in the dataset (from earliest day until now)
            var days = d3.time.days(minX, new Date());
            // Area of the region containing the bars
            var areaWidth = this.chartWidth - this.legendWidth;
            var barWidth = areaWidth / days.length;
            // Create scales for X and Y axis (X based on dates, Y based on performance data)
            var x = d3.time.scale().domain([minX, d3.time.day(d3.time.day.offset(new Date(), 1))]).range([0, this.chartWidth - this.legendWidth]);
            var y = d3.scale.linear().domain([0, maxY]).range([0, this.chartHeight]);
            var ticks = x.ticks(d3.time.mondays, 1);
            // SVG element
            var svg = this.element.append('svg').attr('height', this.chartHeight + 25).attr('width', this.chartWidth);
            // Groups that contain bar segments for each dataset
            var barGroups = svg.selectAll('g.bars').data(stackData).enter().append('g').attr('class', 'bars').style('fill', function (d, i) { return _this.colors[i]; }).attr('transform', 'translate(' + this.legendWidth + ', 0)');
            // Legend
            var legendGroup = svg.append('g').attr('class', 'legend');
            // Legend items
            var legendItem = legendGroup.selectAll('g.legendItem').data(stackData).enter().append('g').attr('class', 'legendItem').style('fill', function (d, i) { return _this.colors[i]; }).attr('transform', function (d, i) { return 'translate(0, ' + (_this.legendItemHeight * (2 - i)) + ')'; });
            legendItem.append('rect').attr('width', 25).attr('height', 25);
            legendItem.append('text').text(function (d) { return d.desc; }).attr('x', 30).attr('dy', '1em');
            // Bars
            var rects = barGroups.selectAll('rect').data(function (d) { return d.data; }).enter().append('rect').attr('x', function (d, i) { return x(d.x); }).attr('y', function (d, i) { return _this.chartHeight - y(d.y + d.y0); }).attr('width', barWidth).attr('height', function (d, i) { return y(d.y); });
            // Add title (mouseover popup) to bars           
            rects.append('title').text(function (d) { return _this.iso8601(d.x) + ' - ' + d.y + 'ms'; });
            // Add an axis marker to the bottom
            var axis = d3.svg.axis();
            axis.scale(x).ticks(d3.time.mondays, 1).tickSubdivide(6).tickFormat(this.iso8601).tickSize(10, 5);
            ;
            var axisGroup = svg.append('g').attr('class', 'axis').attr('transform', 'translate(' + this.legendWidth + ',' + this.chartHeight + ')').call(axis);
        };
        return Bar;
    })(Base);
    Chart.Bar = Bar;
    var DailyBuild = (function (_super) {
        __extends(DailyBuild, _super);
        function DailyBuild(element) {
            _super.call(this, element);
            this.labelWidth = 140;
            this.labelGutter = 10;
            this.chartWidth = 800;
            this.element = element;
        }
        DailyBuild.prototype.getTextDataString = function (data) {
            return data.pass ? 'pass' : 'fail';
        };
        DailyBuild.prototype.render = function (data) {
            var _this = this;
            // Minimum date in the dataset
            var minDate = d3.min(data.map(function (d) {
                return d3.time.day(d.data[0].date);
            }));
            // All the days in the dataset, from min until now.
            var days = d3.time.days(minDate, new Date());
            var boxSize = (this.chartWidth - this.labelWidth - this.labelGutter) / days.length;
            // Create our scales for x and y axis
            var x = d3.time.scale().domain([minDate, d3.time.day(new Date())]).range([0, boxSize * (days.length - 1)]);
            var y = d3.scale.linear().domain([0, 1]).range([0, boxSize]);
            // SVG element                      
            var svg = this.element.append('svg').attr('height', y(data.length + 1)).attr('width', this.chartWidth);
            svg.selectAll('text').data(data).enter().append('text').attr('x', this.labelWidth).attr('transform', function (d, i) {
                return 'translate(0,' + y(i) + ')';
            }).attr('dy', '1em').attr('text-anchor', 'end').text(function (d) {
                return d.desc;
            });
            // Groups of boxes for updated builds
            var g = svg.selectAll('g.boxes').data(data).enter().append('g').attr('class', 'boxes').attr('transform', function (d, i) {
                return 'translate(0,' + y(i) + ')';
            });
            // Boxes of build info
            var rects = g.selectAll('rect').data(function (d, i) { return d.data; }).enter().append('rect').attr('class', function (d) { return 'day ' + _this.getTextDataString(d); }).attr('x', function (d, i) { return _this.labelWidth + _this.labelGutter + x(d.date); }).attr('width', boxSize).attr('height', boxSize);
            rects.append('title').text(function (d) { return _this.iso8601(d.date) + ' - ' + _this.getTextDataString(d); });
            var ticks = x.ticks(d3.time.mondays, 1);
            // Date text boxes
            svg.append('g').attr('class', 'dates').selectAll('text').data(ticks).enter().append('text').text(function (d) { return _this.iso8601(d); }).attr('transform', function (d, i) { return 'translate(' + (_this.labelWidth + _this.labelGutter + x(d) + 5) + ', ' + y(data.length + 1) + ')'; }).attr('text-anchor', 'start');
            // Vertical hashes at week boundaries
            svg.append('g').attr('class', 'hashes').selectAll('line').data(ticks).enter().append('line').attr('x1', function (d) { return _this.labelWidth + _this.labelGutter + x(d); }).attr('x2', function (d) { return _this.labelWidth + _this.labelGutter + x(d); }).attr('y1', 0).attr('y2', y(data.length + 1));
            return svg;
        };
        return DailyBuild;
    })(Base);
    Chart.DailyBuild = DailyBuild;
})(Chart || (Chart = {}));
var start = d3.time.day.offset(new Date(), -30);
var end = new Date();
var days = d3.time.days(start, end);
var buildData = days.map(function (day) { return ({ date: day, pass: Math.random() > 0.1 }); });
var compilerTestData = days.map(function (day) { return ({ date: day, pass: Math.random() > 0.1 }); });
var servicesTestData = days.map(function (day) { return ({ date: day, pass: Math.random() > 0.1 }); });
function decreasingRandom(begin, deviation, factor) {
    var factorRandom = d3.random.normal(factor, 0.05);
    return function () {
        var random = d3.random.normal(begin, deviation)();
        begin = begin * factorRandom();
        return parseFloat(random.toFixed());
    };
}
var parseRandom = decreasingRandom(400, 20, 0.97);
var typecheckRandom = decreasingRandom(500, 20, 0.97);
var emitRandom = decreasingRandom(100, 10, 0.97);
var parseData = days.map(function (day) { return ({ x: day, y: parseRandom() }); });
var typecheckData = days.map(function (day) { return ({ x: day, y: typecheckRandom() }); });
var emitData = days.map(function (day) { return ({ x: day, y: emitRandom() }); });
var b = new Chart.Bar(d3.select('#passchart'));
var c = new ManyLens.Curve();
document.addEventListener('DOMContentLoaded', function () {
    var chart = new Chart.DailyBuild(d3.select('#passchart'));
    chart.render([
        { desc: "Build Status", data: buildData },
        { desc: "Compiler Tests", data: compilerTestData },
        { desc: "Services Tests", data: servicesTestData },
    ]);
    var perfchart = new Chart.Bar(d3.select('#performanceChart'));
    perfchart.render([
        { desc: 'Emit', data: emitData },
        { desc: 'Typecheck', data: typecheckData },
        { desc: 'Parse', data: parseData }
    ]);
});
//# sourceMappingURL=ManyLens.js.map