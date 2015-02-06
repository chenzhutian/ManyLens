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
        var ClassicLensPane = (function (_super) {
            __extends(ClassicLensPane, _super);
            function ClassicLensPane(element, manyLens) {
                var _this = this;
                _super.call(this, element);
                this._lens_count = 6;
                this._pane_color = d3.scale.category20();
                this._drag = d3.behavior.drag();
                this._manyLens = manyLens;
                this._drag.origin(function (d) {
                    return d;
                }).on("drag", function () {
                    _this.DragFunc();
                });
                var pane_icon_r = 10;
                var pane_icon_padding = 10;
                this._pang_g = {
                    svg_g: this._element.append("g"),
                    x: 10,
                    y: 10,
                    rect_height: (this._lens_count * pane_icon_r * 2) + (this._lens_count + 1) * pane_icon_padding,
                    rect_width: 2 * (pane_icon_r + pane_icon_padding),
                    lens_icon_r: pane_icon_r,
                    lens_icon_padding: pane_icon_padding,
                    lens_count: this._lens_count
                };
            }
            ClassicLensPane.prototype.Render = function () {
                this.OpenPane();
            };
            ClassicLensPane.prototype.OpenPane = function () {
                var _this = this;
                var container = this._element;
                var pane_g = this._pang_g.svg_g.data([this._pang_g]).attr("class", "lensPane").attr("transform", "translate(" + [10, 10] + ")").call(this._drag);
                pane_g.append("rect").attr("x", 0).attr("y", 0).attr("width", this._pang_g.rect_width).attr("height", this._pang_g.rect_height).attr("fill", "#fff7bc").attr("stroke", "pink").attr("stroke-width", 2);
                pane_g.selectAll("circle").data(d3.range(this._lens_count)).enter().append("circle").attr("class", "pane-Lens-Circle").attr("r", this._pang_g.lens_icon_r).attr("cx", this._pang_g.rect_width / 2).attr("cy", function (d, i) {
                    return _this._pang_g.lens_icon_r + _this._pang_g.lens_icon_padding + i * (2 * _this._pang_g.lens_icon_r + _this._pang_g.lens_icon_padding);
                }).attr("fill", function (d, i) {
                    return _this._pane_color(i);
                }).on("mousedown", function () {
                    d3.event.stopPropagation();
                }).on("click", function (d, i) {
                    var len;
                    switch (i) {
                        case 0:
                            {
                                len = new ManyLens.Lens.NetworkLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 1:
                            {
                                len = new ManyLens.Lens.WordCloudLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 2:
                            {
                                len = new ManyLens.Lens.PieChartLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 3:
                            {
                                len = new ManyLens.Lens.MapLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 4:
                            {
                                len = new ManyLens.Lens.BarChartLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 5:
                            {
                                len = new ManyLens.Lens.TreeNetworkLens(_this._element, _this._manyLens);
                                break;
                            }
                    }
                    len.Render(_this._pane_color(i));
                    d3.event.stopPropagation();
                });
            };
            ClassicLensPane.prototype.ClosePane = function (msg) {
            };
            ClassicLensPane.prototype.DragFunc = function () {
                var pane_rect_width = this._pang_g.rect_width;
                var pane_rect_height = this._pang_g.rect_height;
                this._pang_g.svg_g.attr("transform", "translate(" + [
                    this._pang_g.x = Math.max(0, Math.min(parseFloat(this._element.style("width")) - pane_rect_width, d3.event.x)),
                    this._pang_g.y = Math.max(0, Math.min(parseFloat(this._element.style("height")) - pane_rect_height, d3.event.y))
                ] + ")");
            };
            return ClassicLensPane;
        })(ManyLens.D3ChartObject);
        Pane.ClassicLensPane = ClassicLensPane;
    })(Pane = ManyLens.Pane || (ManyLens.Pane = {}));
})(ManyLens || (ManyLens = {}));
