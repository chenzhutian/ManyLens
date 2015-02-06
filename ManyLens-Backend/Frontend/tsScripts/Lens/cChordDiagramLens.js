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
        var cChordDiagramLens = (function (_super) {
            __extends(cChordDiagramLens, _super);
            function cChordDiagramLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cChordDiagramLens.Type, manyLens, firstLens, secondLens);
                this._chord = d3.layout.chord();
                this._innerRadius = this._lens_circle_radius * 1;
                this._outterRadius = this._lens_circle_radius * 1.1;
                this._chord.padding(.05).sortSubgroups(d3.descending);
                this._fill = d3.scale.category10();
            }
            cChordDiagramLens.prototype.Render = function (color) {
                if (color === void 0) { color = "green"; }
                _super.prototype.Render.call(this, color);
            };
            cChordDiagramLens.prototype.ExtractData = function () {
                var matrix = [
                    [11975, 5871, 8916, 2868, 5550],
                    [1951, 10048, 2060, 6171, 2043],
                    [8010, 16145, 8090, 8045, 1028],
                    [3034, 9564, 983, 4203, 7022],
                    [1013, 990, 940, 6907, 2303]
                ];
                return matrix;
            };
            cChordDiagramLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                this._chord.matrix(data);
                var svg = this._lens_circle_svg;
                this._lens_circle_svg.append("g").selectAll("path").data(this._chord.groups).enter().append("path").style("fill", function (d, i) {
                    return _this._fill(i);
                }).style("stroke", function (d, i) {
                    return _this._fill(i);
                }).attr("d", d3.svg.arc().innerRadius(this._innerRadius).outerRadius(this._outterRadius)).on("mouseover", fade(.1)).on("mouseout", fade(1));
                var ticks = this._lens_circle_svg.append("g").selectAll("g").data(this._chord.groups).enter().append("g").selectAll("g").data(groupTicks).enter().append("g").attr("transform", function (d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + _this._outterRadius + ",0)";
                });
                ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5).attr("y2", 0).style("stroke", "#000");
                ticks.append("text").attr("x", 8).attr("dy", ".35em").attr("transform", function (d) {
                    return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
                }).style("text-anchor", function (d) {
                    return d.angle > Math.PI ? "end" : null;
                }).text(function (d) {
                    return d.label;
                });
                this._lens_circle_svg.append("g").attr("class", "chord").selectAll("path").data(this._chord.chords).enter().append("path").attr("d", d3.svg.chord().radius(this._innerRadius)).style("fill", function (d) {
                    return _this._fill(d.target.index);
                }).style("opacity", 1).style("fill-opacity", 0.67).style("stroke", "#000").style("stroke-width", ".5px");
                function groupTicks(d) {
                    var k = (d.endAngle - d.startAngle) / d.value;
                    return d3.range(0, d.value, 1000).map(function (v, i) {
                        return {
                            angle: v * k + d.startAngle,
                            label: i % 5 ? null : v / 1000 + "k"
                        };
                    });
                }
                function fade(opacity) {
                    return function (g, i) {
                        svg.selectAll(".chord path").filter(function (d) {
                            return d.source.index != i && d.target.index != i;
                        }).transition().style("opacity", opacity);
                    };
                }
            };
            cChordDiagramLens.Type = "cChordDiagramLens";
            return cChordDiagramLens;
        })(Lens.BaseCompositeLens);
        Lens.cChordDiagramLens = cChordDiagramLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
