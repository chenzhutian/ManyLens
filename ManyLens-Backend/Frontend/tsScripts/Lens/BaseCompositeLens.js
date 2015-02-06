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
        var BaseCompositeLens = (function (_super) {
            __extends(BaseCompositeLens, _super);
            function BaseCompositeLens(element, type, manyLens, firstLens, secondLens) {
                _super.call(this, element, type, manyLens);
                this._new_lens_count = 1;
                this._need_to_reshape = false;
                this._is_composite_lens = true;
                this._select_circle = new Array();
                this._components_kind = new Map();
                this._lens = new Array();
                this._base_component = firstLens;
                this._lens_circle_cx = firstLens.LensCX;
                this._lens_circle_cy = firstLens.LensCY;
                if (secondLens) {
                    var firstLens0 = firstLens;
                    this._sub_component = secondLens;
                    this._lens.push(firstLens0);
                    this._select_circle.push({
                        _line: firstLens0.LinkLine,
                        _sc_cx: firstLens0.SelectCircleCX,
                        _sc_cy: firstLens0.SelectCircleCY,
                        _sc_radius: firstLens0.SelectCircleRadius,
                        _sc_scale: firstLens0.SelectCircleScale
                    });
                    this._data = firstLens0.Data;
                    this._components_kind.set(firstLens.Type, 1);
                    this._lens.push(secondLens);
                    this._select_circle.push({
                        _line: secondLens.LinkLine,
                        _sc_cx: secondLens.SelectCircleCX,
                        _sc_cy: secondLens.SelectCircleCY,
                        _sc_radius: secondLens.SelectCircleRadius,
                        _sc_scale: secondLens.SelectCircleScale
                    });
                    this._sub_data = secondLens.Data;
                    this._components_kind.set(secondLens.Type, 1);
                }
                else {
                    var firstLens1 = firstLens;
                    for (var i = 0, len = firstLens1.Lens.length; i < len; ++i) {
                        this._lens.push(firstLens1.Lens[i]);
                        this._select_circle.push(firstLens1.SelectCircle[i]);
                        if (this._components_kind.has(firstLens1.Lens[i].Type)) {
                            var num = this._components_kind.get(firstLens1.Lens[i].Type) + 1;
                            this._components_kind.set(firstLens1.Lens[i].Type, num);
                        }
                        else {
                            this._components_kind.set(firstLens1.Lens[i].Type, 1);
                        }
                        firstLens1.Lens[i].ChangeHostTo(this);
                    }
                    this._sub_data = firstLens1.Data;
                }
            }
            Object.defineProperty(BaseCompositeLens.prototype, "Lens", {
                get: function () {
                    return this._lens;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseCompositeLens.prototype, "SelectCircle", {
                get: function () {
                    return this._select_circle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseCompositeLens.prototype, "ComponentNum", {
                get: function () {
                    return this._lens.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseCompositeLens.prototype, "ComponentsKind", {
                get: function () {
                    return this._components_kind;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseCompositeLens.prototype, "NeedtoReshape", {
                get: function () {
                    return this._need_to_reshape;
                },
                enumerable: true,
                configurable: true
            });
            BaseCompositeLens.prototype.Render = function (color) {
                if (!this._sc_lc_svg) {
                    _super.prototype.Render.call(this, color);
                }
                this._base_component.RemoveLens();
                this._base_component.HostLens = this;
                if (this._sub_component) {
                    this._sub_component.RemoveLens();
                    this._sub_component.HostLens = this;
                }
                this._base_component = this;
                this._sub_component = null;
            };
            BaseCompositeLens.prototype.ExtractData = function () {
                throw new Error('This method is abstract');
            };
            BaseCompositeLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                this.ReDrawLinkLine(this._new_lens_count);
            };
            BaseCompositeLens.prototype.LensCircleDragFunc = function () {
                _super.prototype.LensCircleDragFunc.call(this);
                this.ReDrawLinkLine();
            };
            BaseCompositeLens.prototype.LensCircleDragendFunc = function () {
                var res = _super.prototype.LensCircleDragendFunc.call(this);
                if (!res) {
                    for (var i = 0, len = this._select_circle.length; i < len; ++i) {
                        var sc = this._select_circle[i];
                        var theta = Math.atan((this._lens_circle_cy - sc._sc_cy) / (this._lens_circle_cx - sc._sc_cx));
                        var cosTheta = this._lens_circle_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                        var sinTheta = this._lens_circle_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                        sc._line.transition().duration(this._combine_failure_rebound_duration).ease('back-out').attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta).attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta).attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta).attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
                    }
                }
                return res;
            };
            BaseCompositeLens.prototype.LensCircleZoomFunc = function () {
                _super.prototype.LensCircleZoomFunc.call(this);
                this.ReDrawLinkLine();
            };
            BaseCompositeLens.prototype.AddComponentLens = function (lens) {
                this._sub_component = lens;
                if (lens.IsCompositeLens) {
                    this.AddCompositeLens(lens);
                }
                else {
                    this.AddSingleLens(lens);
                }
                this._sub_data = lens.Data;
                return this;
            };
            BaseCompositeLens.prototype.RemoveComponentLens = function (lens) {
                var index = this._lens.indexOf(lens);
                if (-1 != index) {
                    this._lens.splice(index, 1);
                    this._select_circle.splice(index, 1);
                    if (this.ComponentNum == 1) {
                        this.RemoveWholeSVG();
                        var lastLens = this._lens[0];
                        lastLens.LensCX = this.LensCX;
                        lastLens.LensCY = this.LensCY;
                        lastLens.LensRadius = this.LensRadius;
                        lastLens.LensScale = this.LensScale;
                        lastLens.DetachHostLens();
                        return this._lens[0];
                    }
                    else if (this.ComponentNum < 1) {
                        throw new Error('The number of component of this lens is less than 2!!');
                    }
                    else {
                        var num = this._components_kind.get(lens.Type) - 1;
                        if (num > 0) {
                            this._components_kind.set(lens.Type, num);
                            return this;
                        }
                        else if (num == 0) {
                            this.RemoveWholeSVG();
                            this._components_kind.delete(lens.Type);
                            this._need_to_reshape = true;
                            return this;
                        }
                        else {
                            throw new Error("The number of this kind of component is less than 0!!");
                        }
                    }
                }
            };
            BaseCompositeLens.prototype.ReDrawLinkLine = function (newLensCount) {
                if (newLensCount === void 0) { newLensCount = 0; }
                var i = newLensCount == 0 ? 0 : this._select_circle.length - newLensCount;
                for (var len = this._select_circle.length; i < len; ++i) {
                    var sc = this._select_circle[i];
                    var theta = Math.atan((this._lens_circle_cy - sc._sc_cy) / (this._lens_circle_cx - sc._sc_cx));
                    var cosTheta = this._lens_circle_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                    sc._line.attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta).attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta).attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta).attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
                }
                this._new_lens_count = 0;
            };
            BaseCompositeLens.prototype.AddCompositeLens = function (componentLens) {
                if (componentLens.SelectCircle.length != componentLens.Lens.length)
                    throw new Error('The length of sc is different from length of lens');
                for (var i = 0, len = componentLens.Lens.length; i < len; ++i) {
                    this._lens.push(componentLens.Lens[i]);
                    this._select_circle.push(componentLens.SelectCircle[i]);
                    if (this._components_kind.has(componentLens.Lens[i].Type)) {
                        var num = this._components_kind.get(componentLens.Lens[i].Type) + 1;
                        this._components_kind.set(componentLens.Lens[i].Type, num);
                    }
                    else {
                        this._components_kind.set(componentLens.Lens[i].Type, 1);
                    }
                    componentLens.Lens[i].ChangeHostTo(this);
                }
                componentLens.RemoveWholeSVG();
                this._manyLens.RemoveLens(componentLens);
                this._new_lens_count = componentLens.Lens.length;
            };
            BaseCompositeLens.prototype.AddSingleLens = function (lens) {
                this._lens.push(lens);
                this._select_circle.push({
                    _line: lens.LinkLine,
                    _sc_cx: lens.SelectCircleCX,
                    _sc_cy: lens.SelectCircleCY,
                    _sc_radius: lens.SelectCircleRadius,
                    _sc_scale: lens.SelectCircleScale
                });
                if (this._components_kind.has(lens.Type)) {
                    var num = this._components_kind.get(lens.Type) + 1;
                    this._components_kind.set(lens.Type, num);
                }
                else {
                    this._components_kind.set(lens.Type, 1);
                }
                this._new_lens_count = 1;
            };
            BaseCompositeLens.prototype.RemoveWholeSVG = function () {
                this._sc_lc_svg.style("pointer-events", "none").transition().duration(200).attr("opacity", "1e-6").remove();
            };
            BaseCompositeLens.Type = "BaseCompositeLens";
            return BaseCompositeLens;
        })(Lens.BaseD3Lens);
        Lens.BaseCompositeLens = BaseCompositeLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
