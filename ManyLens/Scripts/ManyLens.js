///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../Scripts/typings/d3.cloud.layout/d3.cloud.layout.d.ts" />
var ManyLens;
(function (ManyLens) {
    var D3ChartObject = (function () {
        function D3ChartObject(element) {
            this._element = element;
        }
        D3ChartObject.prototype.Render = function (any) {
        };
        return D3ChartObject;
    })();
    ManyLens.D3ChartObject = D3ChartObject;
})(ManyLens || (ManyLens = {}));
///<reference path = "../D3ChartObject.ts" />
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
            Curve.prototype.Render = function (data) {
                _super.prototype.Render.call(this, data);
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
        TweetsCurve.Curve = Curve;
    })(TweetsCurve = ManyLens.TweetsCurve || (ManyLens.TweetsCurve = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var LensHistory;
    (function (LensHistory) {
        var HistoryTrees = (function (_super) {
            __extends(HistoryTrees, _super);
            function HistoryTrees(element) {
                _super.call(this, element);
                this._trees = [];
            }
            HistoryTrees.prototype.Render = function () {
            };
            HistoryTrees.prototype.addTree = function () {
                var treeG = this._element.append("g").attr("id", this._trees.length).attr("class", "historyTree");
                var tree = {
                    id: this._trees.length,
                    tree_layout: d3.layout.tree().size([parseFloat(this._element.style("width")), parseFloat(this._element.style("height"))]),
                    tree_g: treeG,
                    root: { tree_id: this._trees.length, color: "black", lensType: null },
                    nodes: [],
                    node: treeG.selectAll(".node"),
                    link: treeG.selectAll(".link"),
                    diagonal: d3.svg.diagonal()
                };
                tree.tree_layout.nodes(tree.root);
                tree.root.parent = tree.root;
                tree.root.px = tree.root.x;
                tree.root.py = tree.root.y;
                tree.nodes.push(tree.root);
                this._trees.push(tree);
            };
            HistoryTrees.prototype.addNode = function (node) {
                var tree = this._trees[node.tree_id];
                node.id = tree.nodes.length;
                var p = tree.nodes[Math.random() * tree.nodes.length | 0];
                if (p.children)
                    p.children.push(node);
                else
                    p.children = [node];
                tree.nodes.push(node);
                tree.node = tree.node.data(tree.tree_layout.nodes(tree.root), function (d) {
                    return d.id;
                });
                tree.link = tree.link.data(tree.tree_layout.links(tree.nodes), function (d) {
                    return d.source.id + "-" + d.target.id;
                });
                // Add entering nodes in the parent’s old position.
                tree.node.enter().append("circle").attr("class", "node").attr("r", 10).attr("fill", node.color).attr("cx", function (d) {
                    return d.parent.px;
                }).attr("cy", function (d) {
                    return d.parent.py;
                });
                // Add entering links in the parent’s old position.
                tree.link.enter().insert("path", ".node").attr("class", "link").attr("stroke", "#000").attr("fill", "none").attr("d", function (d) {
                    var o = { x: d.source.px, y: d.source.py };
                    return tree.diagonal({ source: o, target: o });
                });
                // Transition nodes and links to their new positions.
                var t = tree.tree_g.transition().duration(500);
                t.selectAll(".link").attr("d", tree.diagonal);
                t.selectAll(".node").attr("cx", function (d) {
                    return d.px = d.x;
                }).attr("cy", function (d) {
                    return d.py = d.y;
                });
            };
            return HistoryTrees;
        })(ManyLens.D3ChartObject);
        LensHistory.HistoryTrees = HistoryTrees;
    })(LensHistory = ManyLens.LensHistory || (ManyLens.LensHistory = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var BaseD3Lens = (function (_super) {
            __extends(BaseD3Lens, _super);
            function BaseD3Lens(element, type, manyLens) {
                _super.call(this, element);
                this._is_composite_lens = null;
                this._sc_lc_svg = null;
                this._lc_radius = 100;
                this._lc_scale = 1;
                this._lc_zoom = d3.behavior.zoom();
                this._lc_drag = d3.behavior.drag();
                this._is_component_lens = false;
                this._manyLens = manyLens;
                this._type = type;
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
                    return this._lc_cx;
                },
                set: function (cx) {
                    this._lc_cx = cx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensCY", {
                get: function () {
                    return this._lc_cy;
                },
                set: function (cy) {
                    this._lc_cy = cy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensScale", {
                get: function () {
                    return this._lc_scale;
                },
                set: function (scale) {
                    this._lc_scale = scale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensRadius", {
                get: function () {
                    return this._lc_radius;
                },
                set: function (radius) {
                    this._lc_radius = radius;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "LensGroup", {
                get: function () {
                    return this._lens_circle_G;
                },
                set: function (lensG) {
                    this._lens_circle_G = lensG;
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
                var _this = this;
                this._lens_type_color = color;
                this._sc_lc_svg = this._element.append("g").attr("class", "lens");
                this._lc_zoom.scaleExtent([1, 2]).on("zoom", function () {
                    _this.LensCircleZoomFunc();
                });
                this._lc_drag.origin(function (d) {
                    return d;
                }).on("dragstart", function () {
                    _this.LensCircleDragstartFunc();
                }).on("drag", function () {
                    _this.LensCircleDragFunc();
                }).on("dragend", function () {
                    _this.LensCircleDragendFunc();
                });
            };
            BaseD3Lens.prototype.ExtractData = function (any) {
                if (any === void 0) { any = null; }
                throw new Error('This method is abstract');
            };
            BaseD3Lens.prototype.DisplayLens = function (any) {
                var _this = this;
                if (any === void 0) { any = null; }
                var duration = 300;
                this._lens_circle_G = this._sc_lc_svg.append("g").data([{ x: this._lc_cx, y: this._lc_cy }]).attr("id", "lens_" + this._manyLens.LensCount).attr("class", "lens-circle-g " + this._type).attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + this._lc_scale + ")").attr("opacity", "1e-6").style("pointer-events", "none").on("contextmenu", function () {
                    //d3.event.preventDefault();
                }).on("mousedown", function () {
                    console.log("mousedown " + _this._type);
                }).on("mouseup", function () {
                    console.log("mouseup " + _this._type);
                }).on("click", function () {
                    console.log("click " + _this._type);
                }).call(this._lc_zoom).call(this._lc_drag);
                this._lens_circle = this._lens_circle_G.append("circle").attr("class", "lens-circle").attr("cx", 0).attr("cy", 0).attr("r", this._lc_radius).attr("fill", "#fff").attr("stroke", "black").attr("stroke-width", 1);
                //re-order the line, select-circle and lens-circle
                //var tempChildren = d3.selectAll(this._sc_lc_svg[0][0].children);
                //var tt = tempChildren[0][0];
                //tempChildren[0][0] = tempChildren[0][1];
                //tempChildren[0][1] = tt;
                //tempChildren.order();
                //Add this lens to the app class
                this._manyLens.AddLens(this);
                this._lens_circle_G.transition().duration(duration).attr("opacity", "1").each("end", function () {
                    d3.select(this).style("pointer-events", "");
                });
                ;
                return duration;
            };
            BaseD3Lens.prototype.LensCircleDragstartFunc = function () {
                var tempGs = d3.select("#mapView").selectAll("svg > g");
                var index = tempGs[0].indexOf(this._sc_lc_svg[0][0]);
                tempGs[0].splice(index, 1);
                tempGs[0].push(this._sc_lc_svg[0][0]);
                tempGs.order();
            };
            BaseD3Lens.prototype.LensCircleDragFunc = function () {
                var _this = this;
                var transform = this._lens_circle_G.attr("transform");
                this._lens_circle_G.attr("transform", function (d) {
                    _this._lc_cx = d.x = Math.max(_this._lc_radius, Math.min(parseFloat(_this._element.style("width")) - _this._lc_radius, d3.event.x));
                    _this._lc_cy = d.y = Math.max(_this._lc_radius, Math.min(parseFloat(_this._element.style("height")) - _this._lc_radius, d3.event.y));
                    transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                    return transform;
                });
            };
            BaseD3Lens.prototype.LensCircleDragendFunc = function () {
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
                    }
                }
                return res;
            };
            BaseD3Lens.prototype.LensCircleZoomFunc = function () {
                if (d3.event.sourceEvent.type != "wheel") {
                    return;
                }
                if (d3.event.scale == this._lc_scale) {
                    return;
                }
                if (d3.event.scale == this._lc_scale) {
                    return;
                }
                var scale = this._lc_scale = d3.event.scale;
                this._lens_circle_G.attr("transform", function () {
                    var transform = d3.select(this).attr("transform");
                    transform = transform.replace(/(scale\()\d+\.?\d*(\))/, "$1" + scale + "$2");
                    return transform;
                });
            };
            //public HideLens() {
            //    this._lens_circle_G
            //        .attr("opacity", "1")
            //        .transition()
            //        .duration(500)  //this is hard code, should be optimize
            //        .attr("opacity", "1e-6")
            //        .style("visibility", "hidden");
            //}
            //public ShowLens() {
            //    this._lens_circle_G
            //        .attr("opacity", "1e-6")
            //        .attr("transform", () => {
            //            return "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + this._lc_scale + ")";
            //        })
            //        .transition()
            //        .duration(500)  //this is hard code, should be optimize
            //        .attr("opacity","1")
            //        .style("visibility", "visible");
            //}
            BaseD3Lens.prototype.RemoveLens = function () {
                this._lens_circle_G.attr("opacity", "1").style("pointer-events", "none").transition().duration(200).attr("opacity", "1e-6").remove();
            };
            BaseD3Lens.Type = "BaseD3Lens";
            return BaseD3Lens;
        })(ManyLens.D3ChartObject);
        Lens.BaseD3Lens = BaseD3Lens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var BaseSingleLens = (function (_super) {
            __extends(BaseSingleLens, _super);
            function BaseSingleLens(element, type, manyLens) {
                _super.call(this, element, type, manyLens);
                this._sc_radius = 0;
                this._sc_cx = 0;
                this._sc_cy = 0;
                this._sc_scale = 1;
                this._has_put_down = false;
                this._has_showed_lens = false;
                this._sc_zoom = d3.behavior.zoom();
                this._sc_drag = d3.behavior.drag();
                this._sc_drag_event_flag = false;
                this._sc_lc_default_dist = 100;
                this._is_composite_lens = false;
                this._sc_radius = 10;
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
                    return this._sc_cx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSingleLens.prototype, "SelectCircleCY", {
                get: function () {
                    return this._sc_cy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSingleLens.prototype, "SelectCircleScale", {
                get: function () {
                    return this._sc_scale;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseSingleLens.prototype, "SelectCircleRadius", {
                get: function () {
                    return this._sc_radius;
                },
                enumerable: true,
                configurable: true
            });
            BaseSingleLens.prototype.Render = function (color) {
                var _this = this;
                _super.prototype.Render.call(this, color);
                var container = this._element;
                var hasShow = false;
                this._sc_zoom.scaleExtent([1, 4]).on("zoom", function () {
                    _this.SelectCircleZoomFunc();
                });
                this._sc_drag.origin(function (d) {
                    return d;
                }).on("dragstart", function () {
                    _this._sc_drag_event_flag = false;
                }).on("drag", function () {
                    if (_this._sc_drag_event_flag) {
                        _this.SelectCircleDragFunc();
                    }
                    else {
                        _this._sc_drag_event_flag = true;
                    }
                }).on("dragend", function (d) {
                    _this.SelectCircleDragendFunc(d);
                });
                this._sc_lc_svg.append("line").attr("stoke-width", 2).attr("stroke", "red");
                this._select_circle_G = this._sc_lc_svg.append("g").attr("class", "select-circle");
                var selectCircle = this._select_circle = this._select_circle_G.append("circle").data([{ x: this._sc_cx, y: this._sc_cy }]);
                selectCircle.attr("r", this._sc_radius).attr("fill", color).attr("fill-opacity", 0.7).attr("stroke", "black").attr("stroke-width", 1).on("mouseup", function (d) {
                    if (!_this._has_put_down) {
                        _this._has_put_down = true;
                        d.x = _this._sc_cx = parseFloat(selectCircle.attr("cx"));
                        d.y = _this._sc_cy = parseFloat(selectCircle.attr("cy"));
                        container.on("mousemove", null);
                    }
                }).on("contextmenu", function () {
                    _this._sc_lc_svg.remove();
                    var hostLens = _this.DetachHostLens();
                    if (hostLens) {
                        _this._manyLens.DetachCompositeLens(_this._element, hostLens, _this);
                    }
                    d3.event.preventDefault();
                }).call(this._sc_zoom).call(this._sc_drag);
                container.on("mousemove", moveSelectCircle); //因为鼠标是在大SVG里移动，所以要绑定到大SVG上
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
                //if is new area with new data, then show the link line 
                if (data) {
                    var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
                    var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                    var cx = this._sc_cx + (this._sc_radius * cosTheta * this._sc_scale);
                    var cy = this._sc_cy + (this._sc_radius * sinTheta * this._sc_scale);
                    this._sc_lc_svg.select("line").attr("x1", cx).attr("y1", cy).attr("x2", cx).attr("y2", cy).attr("stoke-width", 2).attr("stroke", "red").transition().duration(duration).attr("x2", function () {
                        return _this._lc_cx; //cx + (this._sc_lc_default_dist * cosTheta);
                    }).attr("y2", function () {
                        return _this._lc_cy; //cy + (this._sc_lc_default_dist * sinTheta);
                    });
                }
                return {
                    lcx: this._lc_cx,
                    lcy: this._lc_cy,
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
                //传递数据给Lens显示
                if (!this._has_showed_lens) {
                    this._sc_cx = selectCircle.x;
                    this._sc_cy = selectCircle.y;
                    var theta = Math.random() * Math.PI;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);
                    this._lc_cx = this._sc_cx + (this._sc_radius * this._sc_scale + this._sc_lc_default_dist + this._lc_radius) * cosTheta;
                    this._lc_cy = this._sc_cy + (this._sc_radius * this._sc_scale + this._sc_lc_default_dist + this._lc_radius) * sinTheta;
                    this._data = this.ExtractData();
                    this.DisplayLens(this._data);
                    this._has_showed_lens = true;
                }
                //z-index的问题先不解决
                ////re-order the g elements so the paneG could on the toppest
                //var tempGs = d3.select("#mapView").selectAll("svg > g");
                //tempGs[0].splice(tempGs[0].length - 2, 0, tempGs[0].pop());
                //tempGs.order();
            };
            BaseSingleLens.prototype.SelectCircleZoomFunc = function () {
                if (d3.event.sourceEvent.type != "wheel") {
                    return;
                }
                if (d3.event.scale == this._sc_scale) {
                    return;
                }
                if (d3.event.scale == this._sc_scale) {
                    return;
                }
                this._sc_scale = d3.event.scale;
                var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
                var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                this._select_circle.attr("r", this._sc_radius * this._sc_scale);
                this._sc_lc_svg.select("line").attr("x1", this._sc_cx + this._sc_radius * d3.event.scale * cosTheta).attr("y1", this._sc_cy + this._sc_radius * d3.event.scale * sinTheta);
            };
            BaseSingleLens.prototype.LensCircleDragFunc = function () {
                _super.prototype.LensCircleDragFunc.call(this);
                this.ReDrawLinkLine();
            };
            BaseSingleLens.prototype.LensCircleZoomFunc = function () {
                _super.prototype.LensCircleZoomFunc.call(this);
                this.ReDrawLinkLine();
            };
            BaseSingleLens.prototype.ReDrawLinkLine = function () {
                var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
                var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                this._sc_lc_svg.select("line").attr("x1", this._sc_cx + this._sc_radius * this._sc_scale * cosTheta).attr("y1", this._sc_cy + this._sc_radius * this._sc_scale * sinTheta).attr("x2", this._lc_cx - this._lc_radius * this._lc_scale * cosTheta).attr("y2", this._lc_cy - this._lc_radius * this._lc_scale * sinTheta);
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
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var BarChartLens = (function (_super) {
            __extends(BarChartLens, _super);
            function BarChartLens(element, manyLens) {
                _super.call(this, element, BarChartLens.Type, manyLens);
                this._x_axis_gen = d3.svg.axis();
                this._bar_chart_width = this._lc_radius * Math.SQRT2;
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
                var p = _super.prototype.DisplayLens.call(this, data);
                var container = this._element;
                var lensG = this._lens_circle_G;
                var x = d3.scale.linear().range([0, this._bar_chart_width]).domain([0, this._data.length]);
                this._x_axis_gen.scale(x).ticks(0).orient("bottom");
                this._x_axis = lensG.append("g").attr("class", "x-axis").attr("transform", function () {
                    return "translate(" + [-_this._bar_chart_width / 2, _this._bar_chart_height / 2] + ")";
                }).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1).call(this._x_axis_gen);
                this._bar_width = (this._bar_chart_width - 20) / this._data.length;
                var barHeight = d3.scale.linear().range([10, this._bar_chart_height]).domain(d3.extent(this._data));
                var bar = lensG.selectAll(".bar").data(this._data).enter().append("g").attr("transform", function (d, i) {
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
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var WordCloudLens = (function (_super) {
            __extends(WordCloudLens, _super);
            function WordCloudLens(element, manyLens) {
                _super.call(this, element, WordCloudLens.Type, manyLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lc_radius * 2; //Math.sqrt(2);
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 1;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._cloud_text_color = d3.scale.category20c();
            }
            Object.defineProperty(WordCloudLens.prototype, "Color", {
                //private _cloud_rotate: number = 0;
                get: function () {
                    return this._cloud_text_color;
                },
                enumerable: true,
                configurable: true
            });
            WordCloudLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {text: size:}
            WordCloudLens.prototype.ExtractData = function () {
                var data;
                data = [
                    { text: "Samsung", value: 90 },
                    { text: "Apple", value: 50 },
                    { text: "Lenovo", value: 50 },
                    { text: "LG", value: 60 },
                    { text: "Nokia", value: 30 },
                    { text: "Huawei", value: 40 },
                    { text: "Meizu", value: 50 },
                    { text: "eizu", value: 50 },
                    { text: "ZTE", value: 40 },
                    { text: "Fiiit", value: 40 },
                    { text: "qweri", value: 40 },
                    { text: "bnm", value: 40 },
                    { text: "tytyt", value: 40 },
                    { text: "asdf", value: 40 },
                    { text: "Fit", value: 40 },
                    { text: "Gear", value: 30 },
                    { text: "fear", value: 20 },
                    { text: "pear", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "Gea", value: 10 },
                    { text: "Ge", value: 10 },
                    { text: "Gfa", value: 10 },
                    { text: "a", value: 10 },
                    { text: "bvea", value: 10 },
                    { text: "Gea", value: 10 },
                    { text: "cea", value: 10 },
                    { text: "uea", value: 10 },
                    { text: "lea", value: 10 },
                    { text: "ea", value: 10 },
                    { text: "pp", value: 10 },
                    { text: "nh", value: 10 },
                    { text: "erw", value: 10 }
                ];
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                    return d.value;
                }));
                return data;
            };
            WordCloudLens.prototype.DisplayLens = function (data) {
                var _this = this;
                var p = _super.prototype.DisplayLens.call(this, data);
                var container = this._element;
                var lensG = this._lens_circle_G;
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bounds) {
                    _this.DrawCloud(words, bounds);
                });
                this._cloud.start();
            };
            WordCloudLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var w = this._cloud_w;
                var h = this._cloud_h;
                var container = this._element;
                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
                var text = this._lens_circle_G.selectAll("text").data(words, function (d) {
                    return d.text;
                }).enter().append("text");
                text.attr("text-anchor", "middle").style("font-size", function (d) {
                    return d.size + "px";
                }).style("font-weight", function (d) {
                    return d.weight;
                }).style("font-family", function (d) {
                    return d.font;
                }).style("fill", function (d, i) {
                    return _this._cloud_text_color(d.size);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            WordCloudLens.Type = "WordCloudLens";
            return WordCloudLens;
        })(Lens.BaseSingleLens);
        Lens.WordCloudLens = WordCloudLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseSingleLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var MapLens = (function (_super) {
            __extends(MapLens, _super);
            function MapLens(element, manyLens) {
                _super.call(this, element, MapLens.Type, manyLens);
                this._map_width = this._lc_radius * Math.SQRT2;
                this._map_height = this._map_width;
                this._projection = d3.geo.albersUsa();
                this._path = d3.geo.path();
                this._projection.scale(250).translate([0, 0]);
                this._path.projection(this._projection);
            }
            MapLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            MapLens.prototype.ExtractData = function () {
            };
            MapLens.prototype.DisplayLens = function (data) {
                var _this = this;
                d3.json("../testData/us.json", function (error, data) {
                    _super.prototype.DisplayLens.call(_this, data);
                    var path = _this._path;
                    var width = _this._map_width;
                    var height = _this._map_height;
                    var g = _this._lens_circle_G.append("g");
                    var centered;
                    g.append("g").attr("id", "states").selectAll("path").data(topojson.feature(data, data.objects.states).features).enter().append("path").attr("d", _this._path).on("click", clicked);
                    g.append("path").datum(topojson.mesh(data, data.objects.states, function (a, b) {
                        return a !== b;
                    })).attr("id", "state-borders").attr("d", _this._path);
                    function clicked(d) {
                        var x, y, k;
                        if (d && centered !== d) {
                            var centroid = path.centroid(d);
                            x = centroid[0];
                            y = centroid[1];
                            k = 4;
                            centered = d;
                        }
                        else {
                            x = 0;
                            y = 0;
                            k = 1;
                            centered = null;
                        }
                        g.selectAll("path").classed("active", centered && function (d) {
                            return d === centered;
                        });
                        g.transition().duration(750).attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + k + ")translate(" + -x + "," + -y + ")").style("stroke-width", 1.5 / k + "px");
                    }
                });
            };
            MapLens.Type = "MapLens";
            return MapLens;
        })(Lens.BaseSingleLens);
        Lens.MapLens = MapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var NetworkLens = (function (_super) {
            __extends(NetworkLens, _super);
            function NetworkLens(element, manyLens) {
                _super.call(this, element, NetworkLens.Type, manyLens);
                this._theta = 360;
                this._tree = d3.layout.tree();
            }
            NetworkLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            NetworkLens.prototype.ExtractData = function () {
                var data;
                data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "analytics",
                            "children": [
                                {
                                    "name": "cluster",
                                    "children": [
                                        { "name": "AgglomerativeCluster", "size": 3938 },
                                        { "name": "CommunityStructure", "size": 3812 },
                                        { "name": "HierarchicalCluster", "size": 6714 },
                                        { "name": "MergeEdge", "size": 743 }
                                    ]
                                },
                                {
                                    "name": "graph",
                                    "children": [
                                        { "name": "BetweennessCentrality", "size": 3534 },
                                        { "name": "LinkDistance", "size": 5731 },
                                        { "name": "MaxFlowMinCut", "size": 7840 },
                                        { "name": "ShortestPaths", "size": 5914 },
                                        { "name": "SpanningTree", "size": 3416 }
                                    ]
                                },
                                {
                                    "name": "optimization",
                                    "children": [
                                        { "name": "AspectRatioBanker", "size": 7074 }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                return data;
            };
            NetworkLens.prototype.DisplayLens = function (data) {
                var p = _super.prototype.DisplayLens.call(this, data);
                var container = this._element;
                var lensG = this._lens_circle_G;
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial().projection(function (d) {
                    return [d.y, d.x / 180 * Math.PI];
                });
                this._tree.size([this._theta, this._lc_radius - nodeRadius]).separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(this._data), links = this._tree.links(nodes);
                var link = lensG.selectAll("path").data(links).enter().append("path").attr("fill", "none").attr("stroke", "#ccc").attr("stroke-width", 1.5).attr("d", diagonal);
                var node = lensG.selectAll(".node").data(nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });
                node.append("circle").attr("r", nodeRadius).attr("stroke", "steelblue").attr("fill", "#fff").attr("stroke-width", 1.5);
            };
            NetworkLens.Type = "NetworkLens";
            return NetworkLens;
        })(Lens.BaseSingleLens);
        Lens.NetworkLens = NetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var PieChartLens = (function (_super) {
            __extends(PieChartLens, _super);
            function PieChartLens(element, manyLens) {
                _super.call(this, element, PieChartLens.Type, manyLens);
                this._innerRadius = this._lc_radius - 20;
                this._outterRadius = this._lc_radius - 0;
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._color = d3.scale.category20();
                this._arc.innerRadius(this._innerRadius).outerRadius(this._outterRadius);
                this._pie.value(function (d) {
                    return d;
                }).sort(null);
            }
            Object.defineProperty(PieChartLens.prototype, "Color", {
                get: function () {
                    return this._color;
                },
                enumerable: true,
                configurable: true
            });
            PieChartLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            PieChartLens.prototype.ExtractData = function () {
                var data;
                data = d3.range(6).map(function (d) {
                    return Math.random() * 70;
                });
                return data;
            };
            PieChartLens.prototype.DisplayLens = function (data) {
                var _this = this;
                var p = _super.prototype.DisplayLens.call(this, data);
                var container = this._element;
                this._lens_circle_G.selectAll("path").data(this._pie(this._data)).enter().append("path").attr("fill", function (d, i) {
                    return _this._color(i);
                }).attr("d", this._arc);
            };
            PieChartLens.Type = "PieChartLens";
            return PieChartLens;
        })(Lens.BaseSingleLens);
        Lens.PieChartLens = PieChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseD3Lens.ts" />
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
                this._lc_cx = firstLens.LensCX;
                this._lc_cy = firstLens.LensCY;
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
                    this._lens.push(secondLens);
                    this._select_circle.push({
                        _line: secondLens.LinkLine,
                        _sc_cx: secondLens.SelectCircleCX,
                        _sc_cy: secondLens.SelectCircleCY,
                        _sc_radius: secondLens.SelectCircleRadius,
                        _sc_scale: secondLens.SelectCircleScale
                    });
                    this._components_kind.set(firstLens.Type, 1);
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
                }
            }
            Object.defineProperty(BaseCompositeLens.prototype, "Lens", {
                get: function () {
                    //这里我感觉有问题，是直接返回本体还是返回复本好
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
                //Update base component and sub component
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
                return this;
            };
            BaseCompositeLens.prototype.RemoveComponentLens = function (lens) {
                var index = this._lens.indexOf(lens);
                if (-1 != index) {
                    this._lens.splice(index, 1);
                    this._select_circle.splice(index, 1);
                    if (this.ComponentNum == 1) {
                        //if there is only one component left, we can just return this one
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
                    var theta = Math.atan((this._lc_cy - sc._sc_cy) / (this._lc_cx - sc._sc_cx));
                    var cosTheta = this._lc_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lc_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                    sc._line.attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta).attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta).attr("x2", this._lc_cx - this._lc_radius * this._lc_scale * cosTheta).attr("y2", this._lc_cy - this._lc_radius * this._lc_scale * sinTheta);
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
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cBoundleLens = (function (_super) {
            __extends(cBoundleLens, _super);
            function cBoundleLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cBoundleLens.Type, manyLens, firstLens, secondLens);
                this._innerRadius = this._lc_radius - 0;
                this._cluster = d3.layout.cluster();
                this._boundle = d3.layout.bundle();
                this._line = d3.svg.line.radial();
                this._cluster.size([360, this._innerRadius]).sort(null).value(function (d) {
                    return d.size;
                });
                this._line.interpolate("bundle").tension(.85).radius(function (d) {
                    return d.y;
                }).angle(function (d) {
                    return d.x / 180 * Math.PI;
                });
            }
            cBoundleLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            cBoundleLens.prototype.ExtractData = function () {
                var data = [
                    { "name": "flare.util.palette.ShapePalette", "size": 2059, "imports": ["flare.util.palette.Palette", "flare.util.Shapes"] },
                    { "name": "flare.util.palette.SizePalette", "size": 2291, "imports": ["flare.util.palette.Palette"] },
                    { "name": "flare.util.Property", "size": 5559, "imports": ["flare.util.IPredicate", "flare.util.IValueProxy", "flare.util.IEvaluable"] },
                    { "name": "flare.util.Shapes", "size": 19118, "imports": ["flare.util.Arrays"] },
                    { "name": "flare.util.Sort", "size": 6887, "imports": ["flare.util.Arrays", "flare.util.Property"] },
                    { "name": "flare.util.Stats", "size": 6557, "imports": ["flare.util.Arrays", "flare.util.Property"] },
                    { "name": "flare.util.Strings", "size": 22026, "imports": ["flare.util.Dates", "flare.util.Property"] },
                    { "name": "flare.vis.axis.Axes", "size": 1302, "imports": ["flare.animate.Transitioner", "flare.vis.Visualization"] },
                    { "name": "flare.vis.axis.Axis", "size": 24593, "imports": ["flare.animate.Transitioner", "flare.scale.LinearScale", "flare.util.Arrays", "flare.scale.ScaleType", "flare.util.Strings", "flare.display.TextSprite", "flare.scale.Scale", "flare.util.Stats", "flare.scale.IScaleMap", "flare.vis.axis.AxisLabel", "flare.vis.axis.AxisGridLine"] },
                    { "name": "flare.vis.axis.AxisGridLine", "size": 652, "imports": ["flare.vis.axis.Axis", "flare.display.LineSprite"] },
                    { "name": "flare.vis.axis.AxisLabel", "size": 636, "imports": ["flare.vis.axis.Axis", "flare.display.TextSprite"] },
                    { "name": "flare.vis.axis.CartesianAxes", "size": 6703, "imports": ["flare.animate.Transitioner", "flare.display.RectSprite", "flare.vis.axis.Axis", "flare.display.TextSprite", "flare.vis.axis.Axes", "flare.vis.Visualization", "flare.vis.axis.AxisGridLine"] },
                    { "name": "flare.vis.controls.AnchorControl", "size": 2138, "imports": ["flare.vis.controls.Control", "flare.vis.Visualization", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.controls.ClickControl", "size": 3824, "imports": ["flare.vis.events.SelectionEvent", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.Control", "size": 1353, "imports": ["flare.vis.controls.IControl", "flare.util.Filter"] },
                    { "name": "flare.vis.controls.ControlList", "size": 4665, "imports": ["flare.vis.controls.IControl", "flare.util.Arrays", "flare.vis.Visualization", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.DragControl", "size": 2649, "imports": ["flare.vis.controls.Control", "flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.controls.ExpandControl", "size": 2832, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.vis.controls.Control", "flare.vis.Visualization"] },
                    { "name": "flare.vis.controls.HoverControl", "size": 4896, "imports": ["flare.vis.events.SelectionEvent", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.IControl", "size": 763, "imports": ["flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.PanZoomControl", "size": 5222, "imports": ["flare.util.Displays", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.SelectionControl", "size": 7862, "imports": ["flare.vis.events.SelectionEvent", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.TooltipControl", "size": 8435, "imports": ["flare.animate.Tween", "flare.display.TextSprite", "flare.vis.controls.Control", "flare.vis.events.TooltipEvent"] },
                    { "name": "flare.vis.data.Data", "size": 20544, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.vis.data.DataSprite", "flare.vis.data.Tree", "flare.vis.events.DataEvent", "flare.data.DataSet", "flare.vis.data.TreeBuilder", "flare.vis.data.DataList", "flare.data.DataSchema", "flare.util.Sort", "flare.data.DataField", "flare.util.Property"] },
                    { "name": "flare.vis.data.DataList", "size": 19788, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.util.math.DenseMatrix", "flare.vis.data.DataSprite", "flare.vis.data.EdgeSprite", "flare.vis.events.DataEvent", "flare.util.Stats", "flare.util.math.IMatrix", "flare.util.Sort", "flare.util.Filter", "flare.util.Property", "flare.util.IEvaluable", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.DataSprite", "size": 10349, "imports": ["flare.util.Colors", "flare.vis.data.Data", "flare.display.DirtySprite", "flare.vis.data.render.IRenderer", "flare.vis.data.render.ShapeRenderer"] },
                    { "name": "flare.vis.data.EdgeSprite", "size": 3301, "imports": ["flare.vis.data.render.EdgeRenderer", "flare.vis.data.DataSprite", "flare.vis.data.NodeSprite", "flare.vis.data.render.ArrowType", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.NodeSprite", "size": 19382, "imports": ["flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.data.DataSprite", "flare.vis.data.EdgeSprite", "flare.vis.data.Tree", "flare.util.Sort", "flare.util.Filter", "flare.util.IEvaluable", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.render.ArrowType", "size": 698, "imports": [] },
                    { "name": "flare.vis.data.render.EdgeRenderer", "size": 5569, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.vis.data.DataSprite", "flare.vis.data.render.IRenderer", "flare.util.Shapes", "flare.util.Geometry", "flare.vis.data.render.ArrowType"] },
                    { "name": "flare.vis.data.render.IRenderer", "size": 353, "imports": ["flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.data.render.ShapeRenderer", "size": 2247, "imports": ["flare.util.Shapes", "flare.vis.data.render.IRenderer", "flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.data.ScaleBinding", "size": 11275, "imports": ["flare.scale.TimeScale", "flare.scale.ScaleType", "flare.scale.LinearScale", "flare.scale.LogScale", "flare.scale.OrdinalScale", "flare.scale.RootScale", "flare.scale.Scale", "flare.scale.QuantileScale", "flare.util.Stats", "flare.scale.QuantitativeScale", "flare.vis.events.DataEvent", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.Tree", "size": 7147, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.events.DataEvent", "flare.vis.data.NodeSprite", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.TreeBuilder", "size": 9930, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.vis.data.Tree", "flare.util.heap.HeapNode", "flare.util.heap.FibonacciHeap", "flare.util.Property", "flare.util.IEvaluable", "flare.vis.data.Data"] },
                    { "name": "flare.vis.events.DataEvent", "size": 2313, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.vis.data.DataList", "flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.events.SelectionEvent", "size": 1880, "imports": ["flare.vis.events.DataEvent"] },
                    { "name": "flare.vis.operator.layout.IndentedTreeLayout", "size": 3174, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.vis.operator.layout.Layout", "flare.vis.data.EdgeSprite"] },
                    { "name": "flare.vis.operator.layout.Layout", "size": 7881, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.vis.data.DataList", "flare.vis.data.DataSprite", "flare.vis.data.EdgeSprite", "flare.vis.Visualization", "flare.vis.axis.CartesianAxes", "flare.vis.axis.Axes", "flare.animate.TransitionEvent", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.layout.NodeLinkTreeLayout", "size": 12870, "imports": ["flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.util.Orientation", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.layout.PieLayout", "size": 2728, "imports": ["flare.vis.data.DataList", "flare.vis.data.DataSprite", "flare.util.Shapes", "flare.util.Property", "flare.vis.operator.layout.Layout", "flare.vis.data.Data"] },
                    { "name": "flare.vis.operator.layout.RadialTreeLayout", "size": 12348, "imports": ["flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.layout.RandomLayout", "size": 870, "imports": ["flare.vis.operator.layout.Layout", "flare.vis.data.DataSprite", "flare.vis.data.Data"] },
                    { "name": "flare.vis.operator.layout.StackedAreaLayout", "size": 9121, "imports": ["flare.scale.TimeScale", "flare.scale.LinearScale", "flare.util.Arrays", "flare.scale.OrdinalScale", "flare.vis.data.NodeSprite", "flare.scale.Scale", "flare.vis.axis.CartesianAxes", "flare.util.Stats", "flare.util.Orientation", "flare.scale.QuantitativeScale", "flare.util.Maths", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.layout.TreeMapLayout", "size": 9191, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.util.Property", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.Operator", "size": 2490, "imports": ["flare.animate.Transitioner", "flare.vis.operator.IOperator", "flare.util.Property", "flare.util.IEvaluable", "flare.vis.Visualization"] },
                    { "name": "flare.vis.operator.OperatorList", "size": 5248, "imports": ["flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.operator.IOperator", "flare.vis.Visualization", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.OperatorSequence", "size": 4190, "imports": ["flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.operator.IOperator", "flare.vis.operator.OperatorList", "flare.animate.FunctionSequence", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.OperatorSwitch", "size": 2581, "imports": ["flare.animate.Transitioner", "flare.vis.operator.OperatorList", "flare.vis.operator.IOperator", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.SortOperator", "size": 2023, "imports": ["flare.vis.operator.Operator", "flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.data.Data"] },
                    { "name": "flare.vis.Visualization", "size": 16540, "imports": ["flare.animate.Transitioner", "flare.vis.operator.IOperator", "flare.animate.Scheduler", "flare.vis.events.VisualizationEvent", "flare.vis.data.Tree", "flare.vis.events.DataEvent", "flare.vis.axis.Axes", "flare.vis.axis.CartesianAxes", "flare.util.Displays", "flare.vis.operator.OperatorList", "flare.vis.controls.ControlList", "flare.animate.ISchedulable", "flare.vis.data.Data"] }
                ];
                return data;
            };
            cBoundleLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                var container = this._element;
                var lensG = this._lens_circle_G;
                var nodes = this._cluster.nodes(packageHierarchy(data)), links = packageImports(nodes);
                lensG.selectAll(".link").data(this._boundle(links)).enter().append("path").attr("class", "link").attr("d", this._line).attr("stroke", "steelblue").attr("stroke-opacity", ".4").attr("fill", "none");
                lensG.selectAll(".node").data(nodes.filter(function (n) {
                    return !n.children;
                })).enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                }).attr("font", '11px "Helvetica Neue", Helvetica, Arial, sans-serif').append("text").attr("dx", function (d) {
                    return d.x < 180 ? 8 : -8;
                }).attr("dy", ".31em").attr("text-anchor", function (d) {
                    return d.x < 180 ? "start" : "end";
                }).attr("transform", function (d) {
                    return d.x < 180 ? null : "rotate(180)";
                }).text(function (d) {
                    return d.key;
                });
                function packageHierarchy(classes) {
                    var map = {};
                    function find(name, data) {
                        var node = map[name], i;
                        if (!node) {
                            node = map[name] = data || { name: name, children: [] };
                            if (name.length) {
                                node.parent = find(name.substring(0, i = name.lastIndexOf(".")), null);
                                node.parent.children.push(node);
                                node.key = name.substring(i + 1);
                            }
                        }
                        return node;
                    }
                    classes.forEach(function (d) {
                        find(d.name, d);
                    });
                    return map[""];
                }
                // Return a list of imports for the given array of nodes.
                function packageImports(nodes) {
                    var map = {}, imports = [];
                    // Compute a map from name to node.
                    nodes.forEach(function (d) {
                        map[d.name] = d;
                    });
                    // For each import, construct a link from the source to target node.
                    nodes.forEach(function (d) {
                        if (d.imports)
                            d.imports.forEach(function (i) {
                                var t = map[i];
                                if (t) {
                                    imports.push({ source: map[d.name], target: t });
                                }
                            });
                    });
                    return imports;
                }
            };
            cBoundleLens.Type = "cBoundleLens";
            return cBoundleLens;
        })(Lens.BaseCompositeLens);
        Lens.cBoundleLens = cBoundleLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cChordDiagramLens = (function (_super) {
            __extends(cChordDiagramLens, _super);
            function cChordDiagramLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cChordDiagramLens.Type, manyLens, firstLens, secondLens);
                this._chord = d3.layout.chord();
                this._innerRadius = this._lc_radius * 1;
                this._outterRadius = this._lc_radius * 1.1;
                this._chord.padding(.05).sortSubgroups(d3.descending);
                //this._fill
                //    .domain(d3.range(4))
                //    .range(["#000000", "#FFDD89", "#957244", "#F26223"])
                //;
                //if (firstLens.Type == "WordCloudLens") {
                //    this._fill = (<WordCloudLens>firstLens).Color;
                //} else if (secondLens.Type == "WordCloudLens") {
                //    this._fill = (<WordCloudLens>secondLens).Color;
                //}
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
                var svg = this._lens_circle_G;
                this._lens_circle_G.append("g").selectAll("path").data(this._chord.groups).enter().append("path").style("fill", function (d, i) {
                    return _this._fill(i);
                }).style("stroke", function (d, i) {
                    return _this._fill(i);
                }).attr("d", d3.svg.arc().innerRadius(this._innerRadius).outerRadius(this._outterRadius)).on("mouseover", fade(.1)).on("mouseout", fade(1));
                var ticks = this._lens_circle_G.append("g").selectAll("g").data(this._chord.groups).enter().append("g").selectAll("g").data(groupTicks).enter().append("g").attr("transform", function (d) {
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
                this._lens_circle_G.append("g").attr("class", "chord").selectAll("path").data(this._chord.chords).enter().append("path").attr("d", d3.svg.chord().radius(this._innerRadius)).style("fill", function (d) {
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
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cNetworkLens = (function (_super) {
            __extends(cNetworkLens, _super);
            function cNetworkLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cNetworkLens.Type, manyLens, firstLens, secondLens);
                this._theta = 360;
                this._tree = d3.layout.tree();
            }
            cNetworkLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cNetworkLens.prototype.ExtractData = function () {
                var data;
                data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "analytics",
                            "children": [
                                {
                                    "name": "cluster",
                                    "children": [
                                        { "name": "AgglomerativeCluster", "size": 3938 },
                                        { "name": "CommunityStructure", "size": 3812 },
                                        { "name": "HierarchicalCluster", "size": 6714 },
                                        { "name": "MergeEdge", "size": 743 }
                                    ]
                                },
                                {
                                    "name": "graph",
                                    "children": [
                                        { "name": "BetweennessCentrality", "size": 3534 },
                                        { "name": "LinkDistance", "size": 5731 },
                                        { "name": "MaxFlowMinCut", "size": 7840 },
                                        { "name": "ShortestPaths", "size": 5914 },
                                        { "name": "SpanningTree", "size": 3416 }
                                    ]
                                },
                                {
                                    "name": "optimization",
                                    "children": [
                                        { "name": "AspectRatioBanker", "size": 7074 }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                return data;
            };
            cNetworkLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                var lensG = this._lens_circle_G;
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial().projection(function (d) {
                    return [d.y, d.x / 180 * Math.PI];
                });
                this._tree.size([this._theta, this._lc_radius - nodeRadius]).separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(data), links = this._tree.links(nodes);
                var link = lensG.selectAll("path").data(links).enter().append("path").attr("fill", "none").attr("stroke", "#ccc").attr("stroke-width", 1.5).attr("d", diagonal);
                var node = lensG.selectAll(".node").data(nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });
                node.append("circle").attr("r", nodeRadius).attr("stroke", "steelblue").attr("fill", "#fff").attr("stroke-width", 1.5);
            };
            cNetworkLens.Type = "cNetworkLens";
            return cNetworkLens;
        })(Lens.BaseCompositeLens);
        Lens.cNetworkLens = cNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cPackingCircleLens = (function (_super) {
            __extends(cPackingCircleLens, _super);
            function cPackingCircleLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cPackingCircleLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.linear();
                this._pack = d3.layout.pack();
                this._diameter = this._lc_radius * 2;
                this._color.domain([-1, 5]).range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"]).interpolate(d3.interpolateHcl);
                this._pack.padding(2).size([this._diameter, this._diameter]).value(function (d) {
                    return d.size;
                });
            }
            cPackingCircleLens.prototype.Render = function (color) {
                if (color === void 0) { color = "pupple"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {text: size:}
            cPackingCircleLens.prototype.ExtractData = function () {
                var data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "analytics",
                            "children": [
                                {
                                    "name": "cluster",
                                    "children": [
                                        { "name": "AgglomerativeCluster", "size": 3938 },
                                        { "name": "CommunityStructure", "size": 3812 },
                                        { "name": "HierarchicalCluster", "size": 6714 },
                                        { "name": "MergeEdge", "size": 743 }
                                    ]
                                },
                                {
                                    "name": "graph",
                                    "children": [
                                        { "name": "BetweennessCentrality", "size": 3534 },
                                        { "name": "LinkDistance", "size": 5731 },
                                        { "name": "MaxFlowMinCut", "size": 7840 },
                                        { "name": "ShortestPaths", "size": 5914 },
                                        { "name": "SpanningTree", "size": 3416 }
                                    ]
                                },
                                {
                                    "name": "optimization",
                                    "children": [
                                        { "name": "AspectRatioBanker", "size": 7074 }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "animate",
                            "children": [
                                { "name": "Easing", "size": 17010 },
                                { "name": "FunctionSequence", "size": 5842 },
                                {
                                    "name": "interpolate",
                                    "children": [
                                        { "name": "ArrayInterpolator", "size": 1983 },
                                        { "name": "ColorInterpolator", "size": 2047 },
                                        { "name": "DateInterpolator", "size": 1375 },
                                        { "name": "Interpolator", "size": 8746 },
                                        { "name": "MatrixInterpolator", "size": 2202 },
                                        { "name": "NumberInterpolator", "size": 1382 },
                                        { "name": "ObjectInterpolator", "size": 1629 },
                                        { "name": "PointInterpolator", "size": 1675 },
                                        { "name": "RectangleInterpolator", "size": 2042 }
                                    ]
                                },
                                { "name": "ISchedulable", "size": 1041 },
                                { "name": "Parallel", "size": 5176 },
                                { "name": "Pause", "size": 449 },
                                { "name": "Scheduler", "size": 5593 },
                                { "name": "Sequence", "size": 5534 },
                                { "name": "Transition", "size": 9201 },
                                { "name": "Transitioner", "size": 19975 },
                                { "name": "TransitionEvent", "size": 1116 },
                                { "name": "Tween", "size": 6006 }
                            ]
                        },
                        {
                            "name": "data",
                            "children": [
                                {
                                    "name": "converters",
                                    "children": [
                                        { "name": "Converters", "size": 721 },
                                        { "name": "DelimitedTextConverter", "size": 4294 },
                                        { "name": "GraphMLConverter", "size": 9800 },
                                        { "name": "IDataConverter", "size": 1314 },
                                        { "name": "JSONConverter", "size": 2220 }
                                    ]
                                },
                                { "name": "DataField", "size": 1759 },
                                { "name": "DataSchema", "size": 2165 },
                                { "name": "DataSet", "size": 586 },
                                { "name": "DataSource", "size": 3331 },
                                { "name": "DataTable", "size": 772 },
                                { "name": "DataUtil", "size": 3322 }
                            ]
                        },
                        {
                            "name": "display",
                            "children": [
                                { "name": "DirtySprite", "size": 8833 },
                                { "name": "LineSprite", "size": 1732 },
                                { "name": "RectSprite", "size": 3623 },
                                { "name": "TextSprite", "size": 10066 }
                            ]
                        },
                        {
                            "name": "flex",
                            "children": [
                                { "name": "FlareVis", "size": 4116 }
                            ]
                        },
                        {
                            "name": "physics",
                            "children": [
                                { "name": "DragForce", "size": 1082 },
                                { "name": "GravityForce", "size": 1336 },
                                { "name": "IForce", "size": 319 },
                                { "name": "NBodyForce", "size": 10498 },
                                { "name": "Particle", "size": 2822 },
                                { "name": "Simulation", "size": 9983 },
                                { "name": "Spring", "size": 2213 },
                                { "name": "SpringForce", "size": 1681 }
                            ]
                        },
                        {
                            "name": "query",
                            "children": [
                                { "name": "AggregateExpression", "size": 1616 },
                                { "name": "And", "size": 1027 },
                                { "name": "Arithmetic", "size": 3891 },
                                { "name": "Average", "size": 891 },
                                { "name": "BinaryExpression", "size": 2893 },
                                { "name": "Comparison", "size": 5103 },
                                { "name": "CompositeExpression", "size": 3677 },
                                { "name": "Count", "size": 781 },
                                { "name": "DateUtil", "size": 4141 },
                                { "name": "Distinct", "size": 933 },
                                { "name": "Expression", "size": 5130 },
                                { "name": "ExpressionIterator", "size": 3617 },
                                { "name": "Fn", "size": 3240 },
                                { "name": "If", "size": 2732 },
                                { "name": "IsA", "size": 2039 },
                                { "name": "Literal", "size": 1214 },
                                { "name": "Match", "size": 3748 },
                                { "name": "Maximum", "size": 843 },
                                {
                                    "name": "methods",
                                    "children": [
                                        { "name": "add", "size": 593 },
                                        { "name": "and", "size": 330 },
                                        { "name": "average", "size": 287 },
                                        { "name": "count", "size": 277 },
                                        { "name": "distinct", "size": 292 },
                                        { "name": "div", "size": 595 },
                                        { "name": "eq", "size": 594 },
                                        { "name": "fn", "size": 460 },
                                        { "name": "gt", "size": 603 },
                                        { "name": "gte", "size": 625 },
                                        { "name": "iff", "size": 748 },
                                        { "name": "isa", "size": 461 },
                                        { "name": "lt", "size": 597 },
                                        { "name": "lte", "size": 619 },
                                        { "name": "max", "size": 283 },
                                        { "name": "min", "size": 283 },
                                        { "name": "mod", "size": 591 },
                                        { "name": "mul", "size": 603 },
                                        { "name": "neq", "size": 599 },
                                        { "name": "not", "size": 386 },
                                        { "name": "or", "size": 323 },
                                        { "name": "orderby", "size": 307 },
                                        { "name": "range", "size": 772 },
                                        { "name": "select", "size": 296 },
                                        { "name": "stddev", "size": 363 },
                                        { "name": "sub", "size": 600 },
                                        { "name": "sum", "size": 280 },
                                        { "name": "update", "size": 307 },
                                        { "name": "variance", "size": 335 },
                                        { "name": "where", "size": 299 },
                                        { "name": "xor", "size": 354 },
                                        { "name": "_", "size": 264 }
                                    ]
                                },
                                { "name": "Minimum", "size": 843 },
                                { "name": "Not", "size": 1554 },
                                { "name": "Or", "size": 970 },
                                { "name": "Query", "size": 13896 },
                                { "name": "Range", "size": 1594 },
                                { "name": "StringUtil", "size": 4130 },
                                { "name": "Sum", "size": 791 },
                                { "name": "Variable", "size": 1124 },
                                { "name": "Variance", "size": 1876 },
                                { "name": "Xor", "size": 1101 }
                            ]
                        },
                        {
                            "name": "scale",
                            "children": [
                                { "name": "IScaleMap", "size": 2105 },
                                { "name": "LinearScale", "size": 1316 },
                                { "name": "LogScale", "size": 3151 },
                                { "name": "OrdinalScale", "size": 3770 },
                                { "name": "QuantileScale", "size": 2435 },
                                { "name": "QuantitativeScale", "size": 4839 },
                                { "name": "RootScale", "size": 1756 },
                                { "name": "Scale", "size": 4268 },
                                { "name": "ScaleType", "size": 1821 },
                                { "name": "TimeScale", "size": 5833 }
                            ]
                        },
                        {
                            "name": "util",
                            "children": [
                                { "name": "Arrays", "size": 8258 },
                                { "name": "Colors", "size": 10001 },
                                { "name": "Dates", "size": 8217 },
                                { "name": "Displays", "size": 12555 },
                                { "name": "Filter", "size": 2324 },
                                { "name": "Geometry", "size": 10993 },
                                {
                                    "name": "heap",
                                    "children": [
                                        { "name": "FibonacciHeap", "size": 9354 },
                                        { "name": "HeapNode", "size": 1233 }
                                    ]
                                },
                                { "name": "IEvaluable", "size": 335 },
                                { "name": "IPredicate", "size": 383 },
                                { "name": "IValueProxy", "size": 874 },
                                {
                                    "name": "math",
                                    "children": [
                                        { "name": "DenseMatrix", "size": 3165 },
                                        { "name": "IMatrix", "size": 2815 },
                                        { "name": "SparseMatrix", "size": 3366 }
                                    ]
                                },
                                { "name": "Maths", "size": 17705 },
                                { "name": "Orientation", "size": 1486 },
                                {
                                    "name": "palette",
                                    "children": [
                                        { "name": "ColorPalette", "size": 6367 },
                                        { "name": "Palette", "size": 1229 },
                                        { "name": "ShapePalette", "size": 2059 },
                                        { "name": "SizePalette", "size": 2291 }
                                    ]
                                },
                                { "name": "Property", "size": 5559 },
                                { "name": "Shapes", "size": 19118 },
                                { "name": "Sort", "size": 6887 },
                                { "name": "Stats", "size": 6557 },
                                { "name": "Strings", "size": 22026 }
                            ]
                        },
                        {
                            "name": "vis",
                            "children": [
                                {
                                    "name": "axis",
                                    "children": [
                                        { "name": "Axes", "size": 1302 },
                                        { "name": "Axis", "size": 24593 },
                                        { "name": "AxisGridLine", "size": 652 },
                                        { "name": "AxisLabel", "size": 636 },
                                        { "name": "CartesianAxes", "size": 6703 }
                                    ]
                                },
                                {
                                    "name": "controls",
                                    "children": [
                                        { "name": "AnchorControl", "size": 2138 },
                                        { "name": "ClickControl", "size": 3824 },
                                        { "name": "Control", "size": 1353 },
                                        { "name": "ControlList", "size": 4665 },
                                        { "name": "DragControl", "size": 2649 },
                                        { "name": "ExpandControl", "size": 2832 },
                                        { "name": "HoverControl", "size": 4896 },
                                        { "name": "IControl", "size": 763 },
                                        { "name": "PanZoomControl", "size": 5222 },
                                        { "name": "SelectionControl", "size": 7862 },
                                        { "name": "TooltipControl", "size": 8435 }
                                    ]
                                },
                                {
                                    "name": "data",
                                    "children": [
                                        { "name": "Data", "size": 20544 },
                                        { "name": "DataList", "size": 19788 },
                                        { "name": "DataSprite", "size": 10349 },
                                        { "name": "EdgeSprite", "size": 3301 },
                                        { "name": "NodeSprite", "size": 19382 },
                                        {
                                            "name": "render",
                                            "children": [
                                                { "name": "ArrowType", "size": 698 },
                                                { "name": "EdgeRenderer", "size": 5569 },
                                                { "name": "IRenderer", "size": 353 },
                                                { "name": "ShapeRenderer", "size": 2247 }
                                            ]
                                        },
                                        { "name": "ScaleBinding", "size": 11275 },
                                        { "name": "Tree", "size": 7147 },
                                        { "name": "TreeBuilder", "size": 9930 }
                                    ]
                                },
                                {
                                    "name": "events",
                                    "children": [
                                        { "name": "DataEvent", "size": 2313 },
                                        { "name": "SelectionEvent", "size": 1880 },
                                        { "name": "TooltipEvent", "size": 1701 },
                                        { "name": "VisualizationEvent", "size": 1117 }
                                    ]
                                },
                                {
                                    "name": "legend",
                                    "children": [
                                        { "name": "Legend", "size": 20859 },
                                        { "name": "LegendItem", "size": 4614 },
                                        { "name": "LegendRange", "size": 10530 }
                                    ]
                                },
                                {
                                    "name": "operator",
                                    "children": [
                                        {
                                            "name": "distortion",
                                            "children": [
                                                { "name": "BifocalDistortion", "size": 4461 },
                                                { "name": "Distortion", "size": 6314 },
                                                { "name": "FisheyeDistortion", "size": 3444 }
                                            ]
                                        },
                                        {
                                            "name": "encoder",
                                            "children": [
                                                { "name": "ColorEncoder", "size": 3179 },
                                                { "name": "Encoder", "size": 4060 },
                                                { "name": "PropertyEncoder", "size": 4138 },
                                                { "name": "ShapeEncoder", "size": 1690 },
                                                { "name": "SizeEncoder", "size": 1830 }
                                            ]
                                        },
                                        {
                                            "name": "filter",
                                            "children": [
                                                { "name": "FisheyeTreeFilter", "size": 5219 },
                                                { "name": "GraphDistanceFilter", "size": 3165 },
                                                { "name": "VisibilityFilter", "size": 3509 }
                                            ]
                                        },
                                        { "name": "IOperator", "size": 1286 },
                                        {
                                            "name": "label",
                                            "children": [
                                                { "name": "Labeler", "size": 9956 },
                                                { "name": "RadialLabeler", "size": 3899 },
                                                { "name": "StackedAreaLabeler", "size": 3202 }
                                            ]
                                        },
                                        {
                                            "name": "layout",
                                            "children": [
                                                { "name": "AxisLayout", "size": 6725 },
                                                { "name": "BundledEdgeRouter", "size": 3727 },
                                                { "name": "CircleLayout", "size": 9317 },
                                                { "name": "CirclePackingLayout", "size": 12003 },
                                                { "name": "DendrogramLayout", "size": 4853 },
                                                { "name": "ForceDirectedLayout", "size": 8411 },
                                                { "name": "IcicleTreeLayout", "size": 4864 },
                                                { "name": "IndentedTreeLayout", "size": 3174 },
                                                { "name": "Layout", "size": 7881 },
                                                { "name": "NodeLinkTreeLayout", "size": 12870 },
                                                { "name": "PieLayout", "size": 2728 },
                                                { "name": "RadialTreeLayout", "size": 12348 },
                                                { "name": "RandomLayout", "size": 870 },
                                                { "name": "StackedAreaLayout", "size": 9121 },
                                                { "name": "TreeMapLayout", "size": 9191 }
                                            ]
                                        },
                                        { "name": "Operator", "size": 2490 },
                                        { "name": "OperatorList", "size": 5248 },
                                        { "name": "OperatorSequence", "size": 4190 },
                                        { "name": "OperatorSwitch", "size": 2581 },
                                        { "name": "SortOperator", "size": 2023 }
                                    ]
                                },
                                { "name": "Visualization", "size": 16540 }
                            ]
                        }
                    ]
                };
                return data;
            };
            cPackingCircleLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                var diameter = this._diameter;
                var focus = data, nodes = this._pack.nodes(data), view;
                var circle = this._lens_circle_G.selectAll(".node").data(nodes).enter().append("circle").attr("class", function (d, i) {
                    return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
                }).style("fill", function (d) {
                    return d.children ? _this._color(d.depth) : null;
                }).on("click", function (d) {
                    if (focus !== d) {
                        zoom(d);
                    }
                    d3.event.stopPropagation();
                });
                //var text = this._lens_circle_G.selectAll("text")
                //    .data(nodes)
                //    .enter().append("text")
                //    .attr("class", "label")
                //    .style("fill-opacity", function (d) { return d.parent === data ? 1 : 0; })
                //    .style("display", function (d) { return d.parent === data ? null : "none"; })
                //    .text(function (d) { return d.name; });
                var node = this._lens_circle_G.selectAll(".node,text");
                //d3.select("body")
                //    .style("background", this._color(-1))
                //    .on("click", function () {
                //        zoom(data);
                //    });
                zoomTo([data.x, data.y, data.r * 2]);
                function zoom(d) {
                    console.log("zoom to circle");
                    var focus0 = focus;
                    focus = d;
                    var transition = d3.transition().duration(d3.event.altKey ? 7500 : 750).tween("zoom", function (d) {
                        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                        return function (t) {
                            zoomTo(i(t));
                        };
                    });
                    //transition.selectAll("text")
                    //    .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                    //    .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
                    //    .each("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                    //    .each("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
                }
                function zoomTo(v) {
                    var k = diameter / v[2];
                    view = v;
                    node.attr("transform", function (d) {
                        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
                    });
                    circle.attr("r", function (d) {
                        return d.r * k;
                    });
                }
            };
            cPackingCircleLens.Type = "cPackingCircleLens";
            return cPackingCircleLens;
        })(Lens.BaseCompositeLens);
        Lens.cPackingCircleLens = cPackingCircleLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cSunBrustLens = (function (_super) {
            __extends(cSunBrustLens, _super);
            function cSunBrustLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cSunBrustLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.category10();
                this._luminance = d3.scale.sqrt();
                this._partition = d3.layout.partition();
                this._arc = d3.svg.arc();
                this._luminance.domain([0, 1e6]).clamp(true).range([90, 20]);
                this._partition.sort(function (a, b) {
                    return d3.ascending(a.name, b.name);
                }).size([2 * Math.PI, this._lc_radius]);
                this._arc.startAngle(function (d) {
                    return d.x;
                }).endAngle(function (d) {
                    return d.x + d.dx - .01 / (d.depth + .5);
                }).innerRadius(function (d) {
                    return _this._lc_radius / 3 * d.depth;
                }).outerRadius(function (d) {
                    return _this._lc_radius / 3 * (d.depth + 1) - 1;
                });
            }
            cSunBrustLens.prototype.Render = function () {
                _super.prototype.Render.call(this, "yellow");
            };
            cSunBrustLens.prototype.ExtractData = function () {
                var data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "query",
                            "children": [
                                { "name": "AggregateExpression", "size": 1616 },
                                { "name": "And", "size": 1027 },
                                { "name": "Arithmetic", "size": 3891 },
                                { "name": "Average", "size": 891 },
                                { "name": "BinaryExpression", "size": 2893 },
                                { "name": "Comparison", "size": 5103 },
                                { "name": "CompositeExpression", "size": 3677 },
                                { "name": "Count", "size": 781 },
                                { "name": "DateUtil", "size": 4141 },
                                {
                                    "name": "methods",
                                    "children": [
                                        { "name": "add", "size": 593 },
                                        { "name": "and", "size": 330 },
                                        { "name": "average", "size": 287 },
                                        { "name": "count", "size": 277 },
                                        { "name": "distinct", "size": 292 },
                                        { "name": "div", "size": 595 },
                                        { "name": "eq", "size": 594 },
                                        { "name": "fn", "size": 460 },
                                        { "name": "gt", "size": 603 },
                                        { "name": "gte", "size": 625 },
                                        { "name": "iff", "size": 748 },
                                        { "name": "isa", "size": 461 },
                                        { "name": "lt", "size": 597 },
                                        { "name": "lte", "size": 619 },
                                        { "name": "max", "size": 283 },
                                        { "name": "min", "size": 283 },
                                        { "name": "mod", "size": 591 },
                                        { "name": "mul", "size": 603 },
                                        { "name": "neq", "size": 599 },
                                        { "name": "not", "size": 386 },
                                        { "name": "or", "size": 323 },
                                        { "name": "orderby", "size": 307 },
                                        { "name": "range", "size": 772 },
                                        { "name": "select", "size": 296 },
                                        { "name": "stddev", "size": 363 },
                                        { "name": "sub", "size": 600 },
                                        { "name": "sum", "size": 280 },
                                        { "name": "update", "size": 307 },
                                        { "name": "variance", "size": 335 },
                                        { "name": "where", "size": 299 },
                                        { "name": "xor", "size": 354 },
                                        { "name": "_", "size": 264 }
                                    ]
                                },
                                { "name": "Minimum", "size": 843 },
                                { "name": "Not", "size": 1554 },
                                { "name": "Or", "size": 970 },
                                { "name": "Query", "size": 13896 },
                                { "name": "Range", "size": 1594 },
                            ]
                        },
                        {
                            "name": "scale",
                            "children": [
                                { "name": "IScaleMap", "size": 2105 },
                                { "name": "LinearScale", "size": 1316 },
                                { "name": "LogScale", "size": 3151 },
                            ]
                        },
                        {
                            "name": "util",
                            "children": [
                                { "name": "Arrays", "size": 8258 },
                                { "name": "IEvaluable", "size": 335 },
                                { "name": "IPredicate", "size": 383 },
                                { "name": "IValueProxy", "size": 874 },
                                {
                                    "name": "math",
                                    "children": [
                                        { "name": "DenseMatrix", "size": 3165 },
                                        { "name": "IMatrix", "size": 2815 },
                                        { "name": "SparseMatrix", "size": 3366 }
                                    ]
                                },
                                { "name": "Maths", "size": 17705 },
                                { "name": "Orientation", "size": 1486 },
                                {
                                    "name": "palette",
                                    "children": [
                                        { "name": "ColorPalette", "size": 6367 },
                                        { "name": "Palette", "size": 1229 },
                                        { "name": "ShapePalette", "size": 2059 },
                                        { "name": "SizePalette", "size": 2291 }
                                    ]
                                },
                                { "name": "Property", "size": 5559 },
                                { "name": "Shapes", "size": 19118 },
                                { "name": "Sort", "size": 6887 },
                                { "name": "Stats", "size": 6557 },
                                { "name": "Strings", "size": 22026 }
                            ]
                        },
                        {
                            "name": "vis",
                            "children": [
                                {
                                    "name": "axis",
                                    "children": [
                                        { "name": "Axes", "size": 1302 },
                                        { "name": "Axis", "size": 24593 },
                                        { "name": "AxisGridLine", "size": 652 },
                                        { "name": "AxisLabel", "size": 636 },
                                        { "name": "CartesianAxes", "size": 6703 }
                                    ]
                                },
                                {
                                    "name": "controls",
                                    "children": [
                                        { "name": "AnchorControl", "size": 2138 },
                                        { "name": "ClickControl", "size": 3824 },
                                        { "name": "Control", "size": 1353 },
                                        { "name": "ControlList", "size": 4665 },
                                        { "name": "DragControl", "size": 2649 },
                                        { "name": "ExpandControl", "size": 2832 },
                                        { "name": "HoverControl", "size": 4896 },
                                        { "name": "IControl", "size": 763 },
                                        { "name": "PanZoomControl", "size": 5222 },
                                        { "name": "SelectionControl", "size": 7862 },
                                        { "name": "TooltipControl", "size": 8435 }
                                    ]
                                },
                                {
                                    "name": "data",
                                    "children": [
                                        { "name": "Data", "size": 20544 },
                                        { "name": "DataList", "size": 19788 },
                                        { "name": "DataSprite", "size": 10349 },
                                        { "name": "EdgeSprite", "size": 3301 },
                                        { "name": "NodeSprite", "size": 19382 },
                                        {
                                            "name": "render",
                                            "children": [
                                                { "name": "ArrowType", "size": 698 },
                                                { "name": "EdgeRenderer", "size": 5569 },
                                                { "name": "IRenderer", "size": 353 },
                                                { "name": "ShapeRenderer", "size": 2247 }
                                            ]
                                        },
                                        { "name": "ScaleBinding", "size": 11275 },
                                        { "name": "Tree", "size": 7147 },
                                        { "name": "TreeBuilder", "size": 9930 }
                                    ]
                                },
                                { "name": "Visualization", "size": 16540 }
                            ]
                        }
                    ]
                };
                return data;
            };
            cSunBrustLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                var svg = this._lens_circle_G;
                var partition = this._partition;
                var hue = this._color;
                var luminance = this._luminance;
                var arc = this._arc;
                console.log(data);
                this._partition.value(function (d) {
                    return d.size;
                }).children(function (d) {
                    return d.children;
                }).nodes(data).forEach(function (d) {
                    d._children = d.children;
                    //d['sum'] = d.value;
                    d['key'] = key(d);
                    d['fill'] = fill(d);
                });
                // Now redefine the value function to use the previously-computed sum.
                this._partition.children(function (d, depth) {
                    return depth < 2 ? d._children : null;
                }).value(function (d) {
                    return d.value;
                });
                var center = svg.append("circle").attr("r", this._lc_radius / 3).style("fill", "#fff").on("click", zoomOut);
                center.append("title").text("zoom out");
                var path = svg.selectAll("path").data(this._partition.nodes(data).slice(1)).enter().append("path").attr("d", this._arc).style("fill", function (d) {
                    return d.fill;
                }).each(function (d) {
                    this._current = updateArc(d);
                }).on("click", zoomIn);
                console.log("where is it?");
                function zoomIn(p) {
                    if (p.depth > 1)
                        p = p.parent;
                    if (!p.children)
                        return;
                    zoom(p, p);
                }
                function zoomOut(p) {
                    if (!p.parent)
                        return;
                    zoom(p.parent, p);
                }
                // Zoom to the specified new root.
                function zoom(root, p) {
                    if (document.documentElement['__transition__'])
                        return;
                    // Rescale outside angles to match the new layout.
                    var enterArc, exitArc, outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]).range([p.x, p.x + p.dx]);
                    function insideArc(d) {
                        return p.key > d.key ? { depth: d.depth - 1, x: 0, dx: 0 } : p.key < d.key ? { depth: d.depth - 1, x: 2 * Math.PI, dx: 0 } : { depth: 0, x: 0, dx: 2 * Math.PI };
                    }
                    function outsideArc(d) {
                        return {
                            depth: d.depth + 1,
                            x: outsideAngle(d.x),
                            dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)
                        };
                    }
                    center.datum(root);
                    // When zooming in, arcs enter from the outside and exit to the inside.
                    // Entering outside arcs start from the old layout.
                    if (root === p)
                        enterArc = outsideArc, exitArc = insideArc;
                    // When zooming out, arcs enter from the inside and exit to the outside.
                    // Exiting outside arcs transition to the new layout.
                    if (root !== p)
                        enterArc = insideArc, exitArc = outsideArc;
                    path = path.data(partition.nodes(root).slice(1), function (d) {
                        return d.key;
                    });
                    d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function () {
                        path.exit().transition().style("fill-opacity", function (d) {
                            return +(d.depth === 1 + ((root === p) ? 1 : 0));
                        }).attrTween("d", function (d) {
                            return arcTween.call(this, exitArc(d));
                        }).remove();
                        path.enter().append("path").style("fill-opacity", function (d) {
                            return +(d.depth === (2 - ((root === p) ? 1 : 0)));
                        }).style("fill", function (d) {
                            return d.fill;
                        }).on("click", zoomIn).each(function (d) {
                            this._current = enterArc(d);
                        });
                        path.transition().style("fill-opacity", 1).attrTween("d", function (d) {
                            return arcTween.call(this, updateArc(d));
                        });
                    });
                }
                function key(d) {
                    var k = [], p = d;
                    while (p.depth)
                        k.push(p.name), p = p.parent;
                    return k.reverse().join(".");
                }
                function fill(d) {
                    var p = d;
                    while (p.depth > 1)
                        p = p.parent;
                    var c = d3.lab(hue(p.name));
                    c.l = luminance(d.value);
                    return c;
                }
                function arcTween(b) {
                    var i = d3.interpolate(this._current, b);
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }
                function updateArc(d) {
                    return { depth: d.depth, x: d.x, dx: d.dx };
                }
            };
            //TODO need to refine this lens
            cSunBrustLens.Type = "cSunBrustLens";
            return cSunBrustLens;
        })(Lens.BaseCompositeLens);
        Lens.cSunBrustLens = cSunBrustLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cWordCloudLens = (function (_super) {
            __extends(cWordCloudLens, _super);
            function cWordCloudLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cWordCloudLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lc_radius * 2; //Math.sqrt(2);
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 1;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._cloud_text_color = d3.scale.category20c();
            }
            cWordCloudLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {text: size:}
            cWordCloudLens.prototype.ExtractData = function () {
                var data;
                data = [
                    { text: "Samsung", value: 90 },
                    { text: "Apple", value: 50 },
                    { text: "Lenovo", value: 50 },
                    { text: "LG", value: 60 },
                    { text: "Nokia", value: 30 },
                    { text: "Huawei", value: 40 },
                    { text: "Meizu", value: 50 },
                    { text: "eizu", value: 50 },
                    { text: "ZTE", value: 40 },
                    { text: "Fiiit", value: 40 },
                    { text: "qweri", value: 40 },
                    { text: "bnm", value: 40 },
                    { text: "tytyt", value: 40 },
                    { text: "asdf", value: 40 },
                    { text: "Fit", value: 40 },
                    { text: "Gear", value: 30 },
                    { text: "fear", value: 20 },
                    { text: "pear", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "Gea", value: 10 },
                    { text: "Ge", value: 10 },
                    { text: "Gfa", value: 10 },
                    { text: "a", value: 10 },
                    { text: "bvea", value: 10 },
                    { text: "Gea", value: 10 },
                    { text: "cea", value: 10 },
                    { text: "uea", value: 10 },
                    { text: "lea", value: 10 },
                    { text: "ea", value: 10 },
                    { text: "pp", value: 10 },
                    { text: "nh", value: 10 },
                    { text: "erw", value: 10 }
                ];
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                    return d.value;
                }));
                return data;
            };
            cWordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bounds) {
                    _this.DrawCloud(words, bounds);
                });
                this._cloud.start();
            };
            cWordCloudLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var w = this._cloud_w;
                var h = this._cloud_h;
                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
                var text = this._lens_circle_G.selectAll("text").data(words, function (d) {
                    return d.text;
                }).enter().append("text");
                text.attr("text-anchor", "middle").style("font-size", function (d) {
                    return d.size + "px";
                }).style("font-weight", function (d) {
                    return d.weight;
                }).style("font-family", function (d) {
                    return d.font;
                }).style("fill", function (d, i) {
                    return _this._cloud_text_color(d.size);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            cWordCloudLens.Type = "cWordCloudLens";
            return cWordCloudLens;
        })(Lens.BaseCompositeLens);
        Lens.cWordCloudLens = cWordCloudLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
/*--------------- Single Lens  ----------------*/
///<reference path = "../Lens/BarChartLens.ts" />
///<reference path = "../Lens/WordCloudLens.ts"/>
///<reference path = "../Lens/MapLens.ts" />
///<reference path = "../Lens/NetworkLens.ts"  />
///<reference path = "../Lens/PieChartLens.ts" />
/*------------ CompositeLens Lens -------------*/
///<reference path = "../Lens/cBoundleLens.ts" />
///<reference path = "../Lens/cChordDiagramLens.ts" />
///<reference path = "../Lens/cNetworkLens.ts" />
///<reference path = "../Lens/cPackingCircleLens.ts" />
///<reference path = "../Lens/cSunBrustLens.ts" />
///<reference path = "../Lens/cWordCloudLens.ts" />
(function () {
})();
///<reference path = "../D3ChartObject.ts" />
///<reference path = "../Lens/LensList.ts" />
var ManyLens;
(function (ManyLens) {
    var Pane;
    (function (Pane) {
        var ClassicLensPane = (function (_super) {
            __extends(ClassicLensPane, _super);
            function ClassicLensPane(element, manyLens) {
                var _this = this;
                _super.call(this, element);
                this._lens_count = 5;
                this._pane_color = d3.scale.category20();
                //private _history_trees: LensHistory.HistoryTrees;
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
                                len = new ManyLens.Lens.BarChartLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 3:
                            {
                                len = new ManyLens.Lens.PieChartLens(_this._element, _this._manyLens);
                                break;
                            }
                        case 4:
                            {
                                len = new ManyLens.Lens.MapLens(_this._element, _this._manyLens);
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
///<reference path = "../tsScripts/TweetsCurve/Cruve.ts" />
///<reference path = "../tsScripts/LensHistory/HistoryTree.ts" />
///<reference path = "../tsScripts/Pane/ClassicLensPane.ts" />
var ManyLens;
(function (_ManyLens) {
    var ManyLens = (function () {
        function ManyLens() {
            this._curveView_id = "cruveView";
            this._mapView_id = "mapView";
            this._mapSvg_id = "mapSvg";
            this._historyView_id = "historyView";
            this._historySvg_id = "historySvg";
            //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
            this._lens = new Map();
            this._lens_count = 0;
            this._curveView = d3.select("#" + this._curveView_id);
            this._curve = new _ManyLens.TweetsCurve.Curve(this._curveView);
            this._curve.Render([10, 10]);
            this._mapView = d3.select("#" + this._mapView_id);
            this._mapSvg = d3.select("#" + this._mapSvg_id);
            this._lensPane = new _ManyLens.Pane.ClassicLensPane(this._mapSvg, this);
            this._historySvg = d3.select("#" + this._historySvg_id);
            this._historyTrees = new _ManyLens.LensHistory.HistoryTrees(this._historySvg);
            //Add a new tree here, actually the tree should not be add here
            this._historyTrees.addTree();
            this._lensPane.Render();
        }
        Object.defineProperty(ManyLens.prototype, "LensCount", {
            get: function () {
                return this._lens_count;
            },
            enumerable: true,
            configurable: true
        });
        ManyLens.prototype.GetLens = function (id) {
            return this._lens.get(id);
        };
        ManyLens.prototype.AddLens = function (lens) {
            this._lens.set("lens_" + this._lens_count, lens);
            this._lens_count++;
            this._historyTrees.addNode({
                color: lens.LensTypeColor,
                lensType: lens.Type,
                tree_id: 0
            });
        };
        //TODO need to implementation
        ManyLens.prototype.RemoveLens = function (lens) {
            var lens;
            this._lens.delete(lens.ID);
            return lens;
        };
        ManyLens.prototype.DetachCompositeLens = function (element, hostLens, componentLens) {
            var lensC = _ManyLens.LensAssemblyFactory.DetachLens(element, hostLens, componentLens, this);
            if (lensC.IsCompositeLens) {
                if (lensC.NeedtoReshape)
                    this._lens.set(hostLens.ID, lensC);
                lensC.Render("black");
                lensC.DisplayLens();
            }
            else {
                this.RemoveLens(hostLens);
                lensC.DisplayLens();
            }
        };
        return ManyLens;
    })();
    _ManyLens.ManyLens = ManyLens;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/ManyLens.ts" />
"use strict";
var manyLens;
document.addEventListener('DOMContentLoaded', function () {
    manyLens = new ManyLens.ManyLens();
});
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cPieChartLens = (function (_super) {
            __extends(cPieChartLens, _super);
            function cPieChartLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cPieChartLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.category20();
                this._partition = d3.layout.partition();
                this._arc = d3.svg.arc();
                this._arc.startAngle(function (d) {
                    return d.x;
                }).endAngle(function (d) {
                    return d.x + d.dx;
                }).innerRadius(function (d) {
                    return Math.sqrt(d.y);
                }).outerRadius(function (d) {
                    return Math.sqrt(d.y + d.dy);
                });
                this._partition.sort(null).size([2 * Math.PI, this._lc_radius * this._lc_radius]);
            }
            cPieChartLens.prototype.Render = function (color) {
                if (color === void 0) { color = "pupple"; }
                _super.prototype.Render.call(this, color);
            };
            cPieChartLens.prototype.ExtractData = function () {
                var data;
                data = d3.range(6).map(function (d) {
                    var value = Math.random() * 70;
                    return {
                        value: value,
                        children: [{
                            value: value * Math.random()
                        }]
                    };
                });
                data = { children: data };
                return data;
            };
            cPieChartLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                var path = this._lens_circle_G.selectAll("path").data(this._partition.nodes(data)).enter().append("path").attr("display", function (d) {
                    return d.depth ? null : "none";
                }).attr("d", this._arc).style("stroke", "#fff").style("fill", function (d, i) {
                    return _this._color(i);
                }).style("fill-rule", "evenodd");
            };
            cPieChartLens.Type = "cPieChartLens";
            return cPieChartLens;
        })(Lens.BaseCompositeLens);
        Lens.cPieChartLens = cPieChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./Lens/LensList.ts" />
var ManyLens;
(function (ManyLens) {
    var LensAssemblyFactory = (function () {
        function LensAssemblyFactory() {
        }
        //TODO add more laws here
        LensAssemblyFactory.CombineLens = function (element, manyLens, firstLens, secondLens) {
            var t = [firstLens.Type, secondLens.Type].join("_");
            switch (t) {
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cBoundleLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cBoundleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cChordDiagramLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cBoundleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cSunBrustLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cSunBrustLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cPackingCircleLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cPackingCircleLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cPackingCircleLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cPackingCircleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cPackingCircleLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cPackingCircleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.cPackingCircleLens.Type + "_" + ManyLens.Lens.cPackingCircleLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cNetworkLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cPieChartLens(element, manyLens, firstLens, secondLens);
                    }
                default:
                    {
                        console.log(t);
                        return null;
                    }
            }
        };
        LensAssemblyFactory.DetachLens = function (element, hostLens, componentLens, manyLens) {
            var res = hostLens.RemoveComponentLens(componentLens);
            if (res.IsCompositeLens && res.NeedtoReshape) {
                var componentsKind = [];
                var cLens = res;
                cLens.ComponentsKind.forEach(function (value, key) {
                    componentsKind.push(key);
                });
                var t = componentsKind.join("_");
                switch (t) {
                    case ManyLens.Lens.WordCloudLens.Type:
                        {
                            return new ManyLens.Lens.cWordCloudLens(element, manyLens, cLens);
                        }
                    case ManyLens.Lens.NetworkLens.Type:
                        {
                            return new ManyLens.Lens.cNetworkLens(element, manyLens, cLens);
                        }
                }
            }
            else {
                return res;
            }
        };
        return LensAssemblyFactory;
    })();
    ManyLens.LensAssemblyFactory = LensAssemblyFactory;
})(ManyLens || (ManyLens = {}));
///<reference path = "../Lens/LensList.ts" />
var ManyLens;
(function (ManyLens) {
    var Pane;
    (function (Pane) {
        var BlossomLensPane = (function (_super) {
            __extends(BlossomLensPane, _super);
            function BlossomLensPane(element, manyLens) {
                _super.call(this, element);
                //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
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
                                len = new ManyLens.Lens.NetworkLens(_this._element, _this._manyLens);
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
                    //this._lens.push(len);
                    len.Render(_this._pane_color(i));
                    //this._history_trees.addNode({ color: this._pane_color(i), lensType: len.Type, tree_id: 0 });
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
//# sourceMappingURL=ManyLens.js.map