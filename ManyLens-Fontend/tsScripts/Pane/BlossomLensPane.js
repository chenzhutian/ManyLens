var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ManyLens;
(function (ManyLens) {
    var Pane;
    (function (Pane) {
        var BlossomLensPane = (function (_super) {
            __extends(BlossomLensPane, _super);
            function BlossomLensPane(element, manyLens) {
                _super.call(this, element);
                this._pane_radius = 100;
                this._pane_arc = d3.svg.arc();
                this._pane_pie = d3.layout.pie();
                this._pane_color = d3.scale.category20();
                this._current_pane_g = null;
                this._lens_count = 2;
                this._manyLens = manyLens;
                this._pane_pie.startAngle(-Math.PI / 2).endAngle(Math.PI / 2).value(function () {
                    return 1;
                });
                this._pane_arc.innerRadius(this._pane_radius - 40).outerRadius(this._pane_radius);
            }
            BlossomLensPane.prototype.Render = function () {
                var _this = this;
                var container = this._element;
                container.on("click", function () {
                    _this.OpenPane();
                });
            };
            BlossomLensPane.prototype.OpenPane = function () {
                var _this = this;
                if (this._current_pane_g && this._current_pane_g.isOpened) {
                    (function () {
                        _this.ClosePane("click close");
                    })();
                }
                var p = d3.mouse(this._element[0][0]);
                var timer = setTimeout(function () {
                    _this.ClosePane("time out close");
                }, 2000);
                var svg = this._element.append("g").attr("transform", "translate(" + p[0] + "," + p[1] + ")");
                svg.selectAll("circle").data(this._pane_pie([1, 1, 1, 1, 1])).enter().append("circle").attr("class", "pane-Lens-Circle").attr("id", function (d, i) {
                    return "lens" + i;
                }).style("fill", function (d, i) {
                    return _this._pane_color(i);
                }).attr("r", 10).on("mouseover", function () {
                    clearTimeout(_this._current_pane_g.timer);
                }).on("mouseout", function () {
                    _this._current_pane_g.timer = setTimeout(function () {
                        _this.ClosePane("time out close");
                    }, 1000);
                }).on("click", function (d, i) {
                    var len;
                    switch (i) {
                        case 0:
                            {
                                len = new ManyLens.Lens.BarChartLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 1:
                            {
                                len = new ManyLens.Lens.MapLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 2:
                            {
                                len = new ManyLens.Lens.TreeNetworkLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 3:
                            {
                                len = new ManyLens.Lens.PieChartLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 4:
                            {
                                len = new ManyLens.Lens.WordCloudLens(_this._element, _this._manyLens);
                                break;
                            }
                    }
                    len.Render(_this._pane_color(i));
                    d3.event.stopPropagation();
                    _this.ClosePane("select a lens");
                }).transition().duration(750).attr("transform", function (d) {
                    return "translate(" + _this._pane_arc.centroid(d) + ")";
                });
                this._current_pane_g = { svg_g: svg, timer: timer, isOpened: true };
            };
            BlossomLensPane.prototype.ClosePane = function (msg) {
                console.log(msg);
                var t = 400;
                var closeG = this._current_pane_g;
                clearTimeout(closeG.timer);
                closeG.isOpened = false;
                closeG.svg_g.selectAll(".paneCircle").transition().duration(t).attr("transform", "translate(0)").remove();
                setTimeout(function () {
                    closeG.svg_g.remove();
                }, t);
            };
            return BlossomLensPane;
        })(ManyLens.D3ChartObject);
        Pane.BlossomLensPane = BlossomLensPane;
    })(Pane = ManyLens.Pane || (ManyLens.Pane = {}));
})(ManyLens || (ManyLens = {}));
