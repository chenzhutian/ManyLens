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
        var BaseD3Lens = (function (_super) {
            __extends(BaseD3Lens, _super);
            function BaseD3Lens(element, type, manyLens) {
                var _this = this;
                _super.call(this, element);
                this._combine_failure_rebound_duration = 800;
                this._sc_lc_svg = null;
                this._lens_circle_radius = 100;
                this._lens_circle_scale = 1;
                this._lens_circle_zoom = d3.behavior.zoom();
                this._lens_circle_drag = d3.behavior.drag();
                this._is_component_lens = false;
                this._is_composite_lens = null;
                this._manyLens = manyLens;
                this._type = type;
                this._lens_circle_zoom.scaleExtent([1, 2]).on("zoom", function () {
                    _this.LensCircleZoomFunc();
                });
                this._lens_circle_drag.origin(function (d) {
                    return d;
                }).on("dragstart", function () {
                    _this.LensCircleDragstartFunc();
                    console.log("lc_dragstart " + _this._type);
                }).on("drag", function () {
                    _this.LensCircleDragFunc();
                    console.log("lc_drag " + _this._type);
                }).on("dragend", function () {
                    _this.LensCircleDragendFunc();
                    console.log("lc_dragend " + _this._type);
                });
            }
            Object.defineProperty(BaseD3Lens.prototype, "ID", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "Type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensTypeColor", {
                get: function () {
                    return this._lens_type_color;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensCX", {
                get: function () {
                    return this._lens_circle_cx;
                },
                set: function (cx) {
                    this._lens_circle_cx = cx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensCY", {
                get: function () {
                    return this._lens_circle_cy;
                },
                set: function (cy) {
                    this._lens_circle_cy = cy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensScale", {
                get: function () {
                    return this._lens_circle_scale;
                },
                set: function (scale) {
                    this._lens_circle_scale = scale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensRadius", {
                get: function () {
                    return this._lens_circle_radius;
                },
                set: function (radius) {
                    this._lens_circle_radius = radius;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensGroup", {
                get: function () {
                    return this._lens_circle_svg;
                },
                set: function (lensG) {
                    this._lens_circle_svg = lensG;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "IsCompositeLens", {
                get: function () {
                    return this._is_composite_lens;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "IsComponentLens", {
                get: function () {
                    return this._is_component_lens;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "HostLens", {
                get: function () {
                    return this._host_lens;
                },
                set: function (hostLens) {
                    if (hostLens) {
                        this._host_lens = hostLens;
                        this._is_component_lens = true;
                    }
                    else {
                        this._host_lens = null;
                        this._is_component_lens = false;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "Data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            BaseD3Lens.prototype.Render = function (color) {
                this._lens_type_color = color;
                this._sc_lc_svg = this._element.append("g").attr("class", "lens");
            };
            BaseD3Lens.prototype.ExtractData = function (any) {
                if (any === void 0) { any = null; }
                throw new Error('This method is abstract');
            };
            BaseD3Lens.prototype.DisplayLens = function (any) {
                var _this = this;
                if (any === void 0) { any = null; }
                var duration = 300;
                this._lens_circle_svg = this._sc_lc_svg.append("g").data([{ x: this._lens_circle_cx, y: this._lens_circle_cy }]).attr("id", "lens_" + this._manyLens.LensCount).attr("class", "lens-circle-g " + this._type).attr("transform", "translate(" + [this._lens_circle_cx, this._lens_circle_cy] + ")scale(" + this._lens_circle_scale + ")").attr("opacity", "1e-6").style("pointer-events", "none").on("contextmenu", function () {
                }).on("mousedown", function () {
                    console.log("lc_mousedown " + _this._type);
                }).on("mouseup", function () {
                    console.log("lc_mouseup " + _this._type);
                }).on("click", function () {
                    console.log("lc_click " + _this._type);
                }).call(this._lens_circle_zoom).on("dblclick.zoom", null).call(this._lens_circle_drag);
                this._lens_circle = this._lens_circle_svg.append("circle").attr("class", "lens-circle").attr("cx", 0).attr("cy", 0).attr("r", this._lens_circle_radius).attr("fill", "#fff").attr("stroke", "black").attr("stroke-width", 1);
                this._manyLens.AddLens(this);
                this._lens_circle_svg.transition().duration(duration).attr("opacity", "1").each("end", function () {
                    d3.select(this).style("pointer-events", "");
                });
                ;
                return duration;
            };
            BaseD3Lens.prototype.LensCircleDragstartFunc = function () {
                if (d3.event.sourceEvent.button != 0)
                    return;
                var tempGs = d3.select("#mapView").selectAll("svg > g");
                var index = tempGs[0].indexOf(this._sc_lc_svg[0][0]);
                tempGs[0].splice(index, 1);
                tempGs[0].push(this._sc_lc_svg[0][0]);
                tempGs.order();
                this._lens_drag_start_cx = this._lens_circle_cx;
                this._lens_drag_start_cy = this._lens_circle_cy;
            };
            BaseD3Lens.prototype.LensCircleDragFunc = function () {
                var _this = this;
                var transform = this._lens_circle_svg.attr("transform");
                this._lens_circle_svg.attr("transform", function (d) {
                    _this._lens_circle_cx = d.x = Math.max(_this._lens_circle_radius, Math.min(parseFloat(_this._element.style("width")) - _this._lens_circle_radius, d3.event.x));
                    _this._lens_circle_cy = d.y = Math.max(_this._lens_circle_radius, Math.min(parseFloat(_this._element.style("height")) - _this._lens_circle_radius, d3.event.y));
                    transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                    return transform;
                });
            };
            BaseD3Lens.prototype.LensCircleDragendFunc = function () {
                var _this = this;
                var res = [];
                var eles = [];
                var x = d3.event.sourceEvent.x, y = d3.event.sourceEvent.y;
                var p = d3.mouse(this._element.node());
                if (p[0] < 0 || p[0] > parseFloat(this._element.style("width")) || p[1] < 0 || p[1] > parseFloat(this._element.style("height")))
                    return;
                var ele = d3.select(document.elementFromPoint(x, y));
                while (ele && ele.attr("id") != "mapSvg") {
                    if (ele.attr("class") == "lens-circle")
                        res.push(ele[0][0]);
                    eles.push(ele);
                    ele.style("visibility", "hidden");
                    ele = d3.select(document.elementFromPoint(x, y));
                    if (eles.length > 10) {
                        throw new Error("what the fuck");
                    }
                }
                for (var i = 0, len = eles.length; i < len; ++i) {
                    eles[i].style("visibility", "");
                }
                if (res.length == 2) {
                    var lensA_id = d3.select(res[0].parentNode).attr("id");
                    var lensB_id = d3.select(res[1].parentNode).attr("id");
                    var lensC = ManyLens.LensAssemblyFactory.CombineLens(this._element, this._manyLens, this._manyLens.GetLens(lensA_id), this._manyLens.GetLens(lensB_id));
                    if (lensC) {
                        lensC.Render("black");
                        lensC.DisplayLens();
                        return true;
                    }
                    else {
                        var transform = this._lens_circle_svg.attr("transform");
                        this._lens_circle_svg.transition().ease('back-out').duration(this._combine_failure_rebound_duration).attr("transform", function (d) {
                            _this._lens_circle_cx = d.x = _this._lens_drag_start_cx;
                            _this._lens_circle_cy = d.y = _this._lens_drag_start_cy;
                            transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                            return transform;
                        });
                    }
                }
                return false;
            };
            BaseD3Lens.prototype.LensCircleZoomFunc = function () {
                if (d3.event.sourceEvent.type != "wheel") {
                    return;
                }
                if (d3.event.scale == this._lens_circle_scale) {
                    return;
                }
                if (d3.event.scale == this._lens_circle_scale) {
                    return;
                }
                var scale = this._lens_circle_scale = d3.event.scale;
                this._lens_circle_svg.attr("transform", function () {
                    var transform = d3.select(this).attr("transform");
                    transform = transform.replace(/(scale\()\d+\.?\d*\,?\d*\.?\d*(\))/, "$1" + scale + "$2");
                    return transform;
                });
            };
            BaseD3Lens.prototype.RemoveLens = function () {
                this._lens_circle_svg.attr("opacity", "1").style("pointer-events", "none").transition().duration(200).attr("opacity", "1e-6").remove();
            };
            BaseD3Lens.Type = "BaseD3Lens";
            return BaseD3Lens;
        })(ManyLens.D3ChartObject);
        Lens.BaseD3Lens = BaseD3Lens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
