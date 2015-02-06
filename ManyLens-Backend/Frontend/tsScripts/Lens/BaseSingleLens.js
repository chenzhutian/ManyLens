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
        var BaseSingleLens = (function (_super) {
            __extends(BaseSingleLens, _super);
            function BaseSingleLens(element, type, manyLens) {
                _super.call(this, element, type, manyLens);
                this._select_circle_radius = 0;
                this._select_circle_cx = 0;
                this._select_circle_cy = 0;
                this._select_circle_scale = 1;
                this._select_circle_zoom = d3.behavior.zoom();
                this._select_circle_drag = d3.behavior.drag();
                this._has_put_down = false;
                this._has_showed_lens = false;
                this._sc_lc_default_dist = 100;
                this._is_composite_lens = false;
                this._select_circle_radius = 10;
            }
            Object.defineProperty(BaseSingleLens.prototype, "LinkLine", {
                get: function () {
                    return this._sc_lc_svg.select("line");
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSingleLens.prototype, "SelectCircleCX", {
                get: function () {
                    return this._select_circle_cx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSingleLens.prototype, "SelectCircleCY", {
                get: function () {
                    return this._select_circle_cy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSingleLens.prototype, "SelectCircleScale", {
                get: function () {
                    return this._select_circle_scale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSingleLens.prototype, "SelectCircleRadius", {
                get: function () {
                    return this._select_circle_radius;
                },
                enumerable: true,
                configurable: true
            });
            BaseSingleLens.prototype.Render = function (color) {
                var _this = this;
                _super.prototype.Render.call(this, color);
                var container = this._element;
                var hasShow = false;
                this._select_circle_zoom.scaleExtent([1, 4]).on("zoom", function () {
                    _this.SelectCircleZoomFunc();
                    console.log("sc_zoom " + _this._type);
                });
                this._select_circle_drag.origin(function (d) {
                    return d;
                }).on("dragstart", function () {
                    console.log("sc_dragstart " + _this._type);
                }).on("drag", function () {
                    _this.SelectCircleDragFunc();
                    console.log("sc_drag " + _this._type);
                }).on("dragend", function (d) {
                    _this.SelectCircleDragendFunc(d);
                    console.log("sc_dragend " + _this._type);
                });
                this._sc_lc_svg.append("line").attr("stoke-width", 2).attr("stroke", "red");
                this._select_circle_svg = this._sc_lc_svg.append("g").attr("class", "select-circle");
                var selectCircle = this._select_circle = this._select_circle_svg.append("circle").data([{ x: this._select_circle_cx, y: this._select_circle_cy }]);
                selectCircle.attr("r", this._select_circle_radius).attr("fill", color).attr("fill-opacity", 0.7).attr("stroke", "black").attr("stroke-width", 1).on("mouseup", function (d) {
                    if (!_this._has_put_down) {
                        _this._has_put_down = true;
                        d.x = _this._select_circle_cx = parseFloat(selectCircle.attr("cx"));
                        d.y = _this._select_circle_cy = parseFloat(selectCircle.attr("cy"));
                        container.on("mousemove", null);
                    }
                }).on("contextmenu", function () {
                    _this._sc_lc_svg.remove();
                    var hostLens = _this.DetachHostLens();
                    if (hostLens) {
                        _this._manyLens.DetachCompositeLens(_this._element, hostLens, _this);
                    }
                    d3.event.preventDefault();
                }).call(this._select_circle_zoom).on("dblclick.zoom", null).on("mousedown.zoom", null).call(this._select_circle_drag);
                container.on("mousemove", moveSelectCircle);
                function moveSelectCircle() {
                    var p = d3.mouse(container[0][0]);
                    selectCircle.attr("cx", p[0]).attr("cy", p[1]);
                }
            };
            BaseSingleLens.prototype.ExtractData = function () {
                throw new Error('This method is abstract');
            };
            BaseSingleLens.prototype.DisplayLens = function (data) {
                var _this = this;
                var duration = _super.prototype.DisplayLens.call(this);
                this._data = data || this._data;
                if (data) {
                    var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                    var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                    var cx = this._select_circle_cx + (this._select_circle_radius * cosTheta * this._select_circle_scale);
                    var cy = this._select_circle_cy + (this._select_circle_radius * sinTheta * this._select_circle_scale);
                    this._sc_lc_svg.select("line").attr("x1", cx).attr("y1", cy).attr("x2", cx).attr("y2", cy).attr("stoke-width", 2).attr("stroke", "red").transition().duration(duration).attr("x2", function () {
                        return _this._lens_circle_cx;
                    }).attr("y2", function () {
                        return _this._lens_circle_cy;
                    });
                }
                return {
                    lcx: this._lens_circle_cx,
                    lcy: this._lens_circle_cy,
                    duration: duration
                };
            };
            BaseSingleLens.prototype.SelectCircleDragFunc = function () {
                var _this = this;
                if (!this._has_put_down)
                    return;
                if (d3.event.sourceEvent.button != 0)
                    return;
                this._sc_lc_svg.select("g.lens-circle-g").remove();
                this._sc_lc_svg.select("line").attr("x1", d3.event.x).attr("x2", d3.event.x).attr("y1", d3.event.y).attr("y2", d3.event.y);
                this._select_circle.attr("cx", function (d) {
                    return d.x = Math.max(0, Math.min(parseFloat(_this._element.style("width")), d3.event.x));
                }).attr("cy", function (d) {
                    return d.y = Math.max(0, Math.min(parseFloat(_this._element.style("height")), d3.event.y));
                });
                this._has_showed_lens = false;
                var hostLens = this.DetachHostLens();
                if (hostLens) {
                    this._manyLens.DetachCompositeLens(this._element, hostLens, this);
                }
            };
            BaseSingleLens.prototype.SelectCircleDragendFunc = function (selectCircle) {
                if (!this._has_put_down)
                    return;
                if (d3.event.sourceEvent.button != 0)
                    return;
                if (!this._has_showed_lens) {
                    this._select_circle_cx = selectCircle.x;
                    this._select_circle_cy = selectCircle.y;
                    var theta = Math.random() * Math.PI;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);
                    this._lens_circle_cx = this._select_circle_cx + (this._select_circle_radius * this._select_circle_scale + this._sc_lc_default_dist + this._lens_circle_radius) * cosTheta;
                    this._lens_circle_cy = this._select_circle_cy + (this._select_circle_radius * this._select_circle_scale + this._sc_lc_default_dist + this._lens_circle_radius) * sinTheta;
                    this._data = this.ExtractData();
                    this.DisplayLens(this._data);
                    this._has_showed_lens = true;
                }
            };
            BaseSingleLens.prototype.SelectCircleZoomFunc = function () {
                if (d3.event.sourceEvent.type != "wheel") {
                    return;
                }
                if (d3.event.scale == this._select_circle_scale) {
                    return;
                }
                this._select_circle_scale = d3.event.scale;
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                this._select_circle.attr("r", this._select_circle_radius * this._select_circle_scale);
                this._sc_lc_svg.select("line").attr("x1", this._select_circle_cx + this._select_circle_radius * d3.event.scale * cosTheta).attr("y1", this._select_circle_cy + this._select_circle_radius * d3.event.scale * sinTheta);
            };
            BaseSingleLens.prototype.LensCircleDragFunc = function () {
                _super.prototype.LensCircleDragFunc.call(this);
                this.ReDrawLinkLine();
            };
            BaseSingleLens.prototype.LensCircleDragendFunc = function () {
                var res = _super.prototype.LensCircleDragendFunc.call(this);
                if (!res) {
                    var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                    var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                    this._sc_lc_svg.select("line").transition().duration(this._combine_failure_rebound_duration).ease('back-out').attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta).attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta).attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta).attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
                }
                return res;
            };
            BaseSingleLens.prototype.LensCircleZoomFunc = function () {
                _super.prototype.LensCircleZoomFunc.call(this);
                this.ReDrawLinkLine();
            };
            BaseSingleLens.prototype.ReDrawLinkLine = function () {
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                this._sc_lc_svg.select("line").attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta).attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta).attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta).attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
            };
            BaseSingleLens.prototype.DetachHostLens = function () {
                if (this.IsComponentLens) {
                    var hostLens = this._host_lens;
                    this.HostLens = null;
                    return hostLens;
                }
                else {
                    return null;
                }
            };
            BaseSingleLens.prototype.ChangeHostTo = function (hostLens) {
                if (this.IsComponentLens) {
                    this.HostLens = hostLens;
                }
                else {
                    return;
                }
            };
            BaseSingleLens.Type = "BaseSingleLens";
            return BaseSingleLens;
        })(Lens.BaseD3Lens);
        Lens.BaseSingleLens = BaseSingleLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
