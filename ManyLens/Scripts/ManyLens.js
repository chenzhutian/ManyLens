var ManyLens;
(function (ManyLens) {
    var D3ChartObject = (function () {
        function D3ChartObject(element) {
            this._element = element;
        }
        D3ChartObject.prototype.render = function (any) {
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
    //var pieChartLens = new ManyLens.PieChartLens(d3.select("#mapView").select("svg"));
    //pieChartLens.render();
    //var wordCloudLens = new ManyLens.WordCloudLens(d3.select("#mapView").select("svg"));
    //wordCloudLens.render();
    //var networkLens = new ManyLens.NetworkTreeLens(d3.select("#mapView").select("svg"));
    //networkLens.render();
    //var barChartLens = new ManyLens.BarChartLens(d3.select("#mapView").select("svg"));
    //barChartLens.render();
    //var locationMap = new ManyLens.LocationLens(d3.select("#mapView").select("svg"));
    //locationMap.render();
    //var historyTrees = new ManyLens.HistoryTrees(d3.select("#historyView").select("svg"));
    //var lensPane = new ManyLens.LensPane(d3.select("#mapView").select("svg"));
    //lensPane.bindHistoryTrees(historyTrees);
    //lensPane.render();
    var lensPane = new ManyLens.ClassicLensPane(d3.select("#mapView").select("svg"));
    lensPane.render();
});
///<reference path = "../tsScripts/D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var BaseD3Lens = (function (_super) {
        __extends(BaseD3Lens, _super);
        function BaseD3Lens(element, type) {
            _super.call(this, element);
            this._sc_radius = 10;
            this._lc_radius = 100;
            this._zoom = d3.behavior.zoom();
            this._type = type;
        }
        Object.defineProperty(BaseD3Lens.prototype, "Type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        BaseD3Lens.prototype.render = function (color) {
            var _this = this;
            var container = this._element;
            var hasShow = false;
            var sclcSvg = this._sc_lc_svg = container.append("g").attr("class", "lcthings");
            var selectCircle = this._select_circle = this._sc_lc_svg.append("circle").attr("r", this._sc_radius).attr("fill", color).attr("fill-opacity", 0.3).on("mousedown", function () {
                container.on("mousemove", moveSelectCircle);
                d3.event.stopPropagation();
            }).on("mouseup", function () {
                _this._sc_cx = parseFloat(selectCircle.attr("cx"));
                _this._sc_cy = parseFloat(selectCircle.attr("cy"));
                var data = _this.extractData();
                if (!hasShow) {
                    _this.showLens(data);
                    hasShow = true;
                }
                container.on("mousemove", null);
                d3.event.stopPropagation();
            }).on("click", function () {
                d3.event.stopPropagation();
            });
            container.on("mousemove", moveSelectCircle);
            function moveSelectCircle() {
                sclcSvg.select("g").remove();
                sclcSvg.select("line").remove();
                var p = d3.mouse(container[0][0]);
                selectCircle.attr("cx", p[0]).attr("cy", p[1]);
                hasShow = false;
            }
        };
        BaseD3Lens.prototype.extractData = function (any) {
            if (any === void 0) { any = null; }
            throw new Error('This method is abstract');
        };
        BaseD3Lens.prototype.showLens = function (any) {
            var _this = this;
            if (any === void 0) { any = null; }
            var sc_lc_dist = 100;
            var theta = Math.random() * Math.PI;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            var container = this._element;
            var cr = this._sc_radius;
            var cx = this._sc_cx + (cr * cosTheta);
            var cy = this._sc_cy + (cr * sinTheta);
            var duration = 300;
            this._sc_lc_svg.append("line").attr("x1", cx).attr("y1", cy).attr("x2", cx).attr("y2", cy).attr("stoke-width", 2).attr("stroke", "red").transition().duration(duration).attr("x2", function () {
                cx = cx + (sc_lc_dist * cosTheta);
                return cx;
            }).attr("y2", function () {
                cy = cy + (sc_lc_dist * sinTheta);
                return cy;
            });
            this._lc_cx = cx + (this._lc_radius * cosTheta);
            this._lc_cy = cy + (this._lc_radius * sinTheta);
            this._zoom.scaleExtent([1, 2]).on("zoomstart", function () {
            }).on("zoom", function () {
                _this.zoomFunc();
            }).on("zoomend", function () {
            });
            this._lensG = this._sc_lc_svg.append("g").attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")").attr("opacity", "1e-6").on("click", function () {
                d3.event.stopPropagation();
            }).call(this._zoom).on("mousedown", function () {
            }).on("mouseup", function () {
            });
            this._lens_circle = this._lensG.append("circle").attr("cx", 0).attr("cy", 0).attr("r", this._lc_radius).attr("fill", "#fff").attr("stroke", "black").attr("stroke-width", 1);
            return {
                lcx: this._lc_cx,
                lcy: this._lc_cy,
                theta: theta,
                duration: duration
            };
        };
        BaseD3Lens.prototype.zoomFunc = function () {
            if (d3.event.sourceEvent.type == "mousemove") {
                var p1 = d3.mouse(this._element[0][0]);
                this._lc_cx = p1[0];
                this._lc_cy = p1[1];
            }
            var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
            var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
            var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);
            this._lensG.attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + d3.event.scale + ")");
            this._sc_lc_svg.select("line").attr("x1", this._sc_cx + this._sc_radius * cosTheta).attr("y1", this._sc_cy + this._sc_radius * sinTheta).attr("x2", this._lc_cx - this._lc_radius * d3.event.scale * cosTheta).attr("y2", this._lc_cy - this._lc_radius * d3.event.scale * sinTheta);
        };
        return BaseD3Lens;
    })(ManyLens.D3ChartObject);
    ManyLens.BaseD3Lens = BaseD3Lens;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var BarChartLens = (function (_super) {
        __extends(BarChartLens, _super);
        function BarChartLens(element) {
            _super.call(this, element, "BarChartLens");
            this._x_axis_gen = d3.svg.axis();
            this._bar_chart_width = this._lc_radius * Math.SQRT2;
            this._bar_chart_height = this._bar_chart_width;
        }
        BarChartLens.prototype.render = function (color) {
            _super.prototype.render.call(this, color);
        };
        BarChartLens.prototype.extractData = function () {
            var data;
            data = d3.range(12).map(function (d) {
                return 10 + 70 * Math.random();
            });
            return data;
        };
        BarChartLens.prototype.showLens = function (data) {
            var _this = this;
            var p = _super.prototype.showLens.call(this);
            var container = this._element;
            var lensG = this._lensG;
            var x = d3.scale.linear().range([0, this._bar_chart_width]).domain([0, data.length]);
            this._x_axis_gen.scale(x).ticks(0).orient("bottom");
            this._x_axis = lensG.append("g").attr("class", "x-axis").attr("transform", function () {
                return "translate(" + [-_this._bar_chart_width / 2, _this._bar_chart_height / 2] + ")";
            }).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1).call(this._x_axis_gen);
            this._bar_width = (this._bar_chart_width - 20) / data.length;
            var barHeight = d3.scale.linear().range([10, this._bar_chart_height]).domain(d3.extent(data));
            var bar = lensG.selectAll(".bar").data(data).enter().append("g").attr("transform", function (d, i) {
                return "translate(" + [10 + i * _this._bar_width - _this._bar_chart_width / 2, _this._bar_chart_height / 2 - barHeight(d)] + ")";
            });
            bar.append("rect").attr("width", this._bar_width).attr("height", function (d) {
                return barHeight(d);
            }).attr("fill", "steelblue");
            lensG.transition().duration(p.duration).attr("opacity", "1");
        };
        BarChartLens.prototype.zoomFunc = function () {
            _super.prototype.zoomFunc.call(this);
        };
        return BarChartLens;
    })(ManyLens.BaseD3Lens);
    ManyLens.BarChartLens = BarChartLens;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var ClassicLensPane = (function (_super) {
        __extends(ClassicLensPane, _super);
        function ClassicLensPane(element) {
            var _this = this;
            _super.call(this, element);
            this._lens = new Array();
            this._pane_color = d3.scale.category20();
            this._drag = d3.behavior.drag();
            this._drag.origin(function (d) {
                return d;
            }).on("drag", function () {
                _this.dragFunc();
            });
        }
        ClassicLensPane.prototype.render = function () {
            this.openPane();
        };
        ClassicLensPane.prototype.bindHistoryTrees = function (historyTrees) {
            this._history_trees = historyTrees;
            //the new tree should not be added here, need to re-write
            this._history_trees.addTree();
        };
        ClassicLensPane.prototype.openPane = function () {
            var container = this._element;
            var pane_g_x = 10, pane_g_y = 10;
            this._pang_g = {
                svg_g: container.append("g"),
                x: 10,
                y: 10,
                rect_height: 100,
                rect_width: 50
            };
            var pane_g = this._pang_g.svg_g.data([this._pang_g]).attr("transform", "translate(" + [pane_g_x, pane_g_y] + ")").call(this._drag);
            pane_g.append("rect").attr("x", 0).attr("y", 0).attr("width", this._pang_g.rect_width).attr("height", this._pang_g.rect_height).attr("fill", "#fff7bc").attr("stroke", "pink").attr("stroke-width", 2);
        };
        ClassicLensPane.prototype.closePane = function (msg) {
        };
        ClassicLensPane.prototype.dragFunc = function () {
            this._pang_g.svg_g.attr("transform", "translate(" + [this._pang_g.x = d3.event.x, this._pang_g.y = d3.event.y] + ")");
        };
        return ClassicLensPane;
    })(ManyLens.D3ChartObject);
    ManyLens.ClassicLensPane = ClassicLensPane;
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var HistoryTrees = (function (_super) {
        __extends(HistoryTrees, _super);
        function HistoryTrees(element) {
            _super.call(this, element);
            this._trees = [];
        }
        HistoryTrees.prototype.render = function () {
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
            tree.node.enter().append("circle").attr("class", "node").attr("r", 4).attr("cx", function (d) {
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
    ManyLens.HistoryTrees = HistoryTrees;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var LensPane = (function (_super) {
        __extends(LensPane, _super);
        function LensPane(element) {
            _super.call(this, element);
            this._lens = new Array();
            this._pane_radius = 100;
            this._pane_arc = d3.svg.arc();
            this._pane_pie = d3.layout.pie();
            this._pane_color = d3.scale.category20();
            this._current_pane_g = null;
            this._pane_pie.startAngle(-Math.PI / 2).endAngle(Math.PI / 2).value(function () {
                return 1;
            });
            this._pane_arc.innerRadius(this._pane_radius - 40).outerRadius(this._pane_radius);
        }
        LensPane.prototype.render = function () {
            var _this = this;
            var container = this._element;
            container.on("click", function () {
                _this.openPane();
            });
        };
        LensPane.prototype.bindHistoryTrees = function (historyTrees) {
            this._history_trees = historyTrees;
            //the new tree should not be added here, need to re-write
            this._history_trees.addTree();
        };
        LensPane.prototype.openPane = function () {
            var _this = this;
            if (this._current_pane_g && this._current_pane_g.isOpened) {
                (function () {
                    _this.closePane("click close");
                })();
            }
            var p = d3.mouse(this._element[0][0]);
            var timer = setTimeout(function () {
                _this.closePane("time out close");
            }, 2000);
            var svg = this._element.append("g").attr("transform", "translate(" + p[0] + "," + p[1] + ")");
            svg.selectAll("circle").data(this._pane_pie([1, 1, 1, 1, 1])).enter().append("circle").attr("class", "paneCircle").attr("id", function (d, i) {
                return "lens" + i;
            }).style("fill", function (d, i) {
                return _this._pane_color(i);
            }).attr("r", 10).on("mouseover", function () {
                clearTimeout(_this._current_pane_g.timer);
            }).on("mouseout", function () {
                _this._current_pane_g.timer = setTimeout(function () {
                    _this.closePane("time out close");
                }, 1000);
            }).on("click", function (d, i) {
                var len;
                switch (i) {
                    case 0:
                        {
                            len = new ManyLens.BarChartLens(_this._element);
                            break;
                        }
                    case 1:
                        {
                            len = new ManyLens.LocationLens(_this._element);
                            break;
                        }
                    case 2:
                        {
                            len = new ManyLens.NetworkTreeLens(_this._element);
                            break;
                        }
                    case 3:
                        {
                            len = new ManyLens.PieChartLens(_this._element);
                            break;
                        }
                    case 4:
                        {
                            len = new ManyLens.WordCloudLens(_this._element);
                            break;
                        }
                }
                _this._lens.push(len);
                len.render(_this._pane_color(i));
                _this._history_trees.addNode({ color: _this._pane_color(i), lensType: len.Type, tree_id: 0 });
                d3.event.stopPropagation();
                _this.closePane("select a lens");
            }).transition().duration(750).attr("transform", function (d) {
                return "translate(" + _this._pane_arc.centroid(d) + ")";
            });
            this._current_pane_g = { svg_g: svg, timer: timer, isOpened: true };
        };
        LensPane.prototype.closePane = function (msg) {
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
        return LensPane;
    })(ManyLens.D3ChartObject);
    ManyLens.LensPane = LensPane;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var LocationLens = (function (_super) {
        __extends(LocationLens, _super);
        function LocationLens(element) {
            _super.call(this, element, "LocationLens");
            this._map_width = this._lc_radius * Math.SQRT2;
            this._map_height = this._map_width;
            this._map_path = "./img/chinamap.svg";
        }
        LocationLens.prototype.render = function (color) {
            _super.prototype.render.call(this, color);
        };
        LocationLens.prototype.extractData = function () {
            var data;
            return data;
        };
        LocationLens.prototype.showLens = function (data) {
            var p = _super.prototype.showLens.call(this);
            var container = this._element;
            var lensG = this._lensG;
            //TODO
            lensG.append("image").attr("xlink:href", this._map_path).attr("x", -this._map_width / 2).attr("y", -this._map_height / 2).attr("width", this._map_width).attr("height", this._map_height);
            lensG.transition().duration(p.duration).attr("opacity", "1");
        };
        return LocationLens;
    })(ManyLens.BaseD3Lens);
    ManyLens.LocationLens = LocationLens;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var NetworkTreeLens = (function (_super) {
        __extends(NetworkTreeLens, _super);
        function NetworkTreeLens(element) {
            _super.call(this, element, "NetworkLens");
            this._theta = 360;
            this._tree = d3.layout.tree();
        }
        NetworkTreeLens.prototype.render = function (color) {
            _super.prototype.render.call(this, color);
        };
        NetworkTreeLens.prototype.extractData = function () {
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
        NetworkTreeLens.prototype.showLens = function (data) {
            var p = _super.prototype.showLens.call(this);
            var container = this._element;
            var lensG = this._lensG;
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
            lensG.transition().duration(p.duration).attr("opacity", "1");
        };
        NetworkTreeLens.prototype.zoomFunc = function () {
            _super.prototype.zoomFunc.call(this);
        };
        return NetworkTreeLens;
    })(ManyLens.BaseD3Lens);
    ManyLens.NetworkTreeLens = NetworkTreeLens;
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var PieChartLens = (function (_super) {
        __extends(PieChartLens, _super);
        function PieChartLens(element) {
            _super.call(this, element, "PieChartLens");
            this._innerRadius = this._lc_radius - 20;
            this._outterRadius = this._lc_radius - 0;
            this._pie = d3.layout.pie();
            this._arc = d3.svg.arc().innerRadius(this._innerRadius).outerRadius(this._outterRadius);
            this._color = d3.scale.category20();
        }
        PieChartLens.prototype.render = function (color) {
            _super.prototype.render.call(this, color);
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
            var lensG = this._lensG;
            this._pie.value(function (d) {
                return d;
            }).sort(null);
            lensG.selectAll("path").data(this._pie(data)).enter().append("path").attr("fill", function (d, i) {
                return _this._color(i);
            }).attr("d", this._arc);
            lensG.transition().duration(p.duration).attr("opacity", "1");
        };
        PieChartLens.prototype.zoomFunc = function () {
            _super.prototype.zoomFunc.call(this);
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
///<reference path = "../tsScripts/BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var WordCloudLens = (function (_super) {
        __extends(WordCloudLens, _super);
        //private _cloud_rotate: number = 0;
        function WordCloudLens(element) {
            _super.call(this, element, "WordCloudLens");
            this._font_size = d3.scale.sqrt();
            this._cloud = d3.layout.cloud();
            this._cloud_w = this._lc_radius * 2; //Math.sqrt(2);
            this._cloud_h = this._cloud_w;
            this._cloud_padding = 1;
            this._cloud_font = "Calibri";
            this._cloud_font_weight = "normal";
            this._color = d3.scale.category20c();
        }
        WordCloudLens.prototype.render = function (color) {
            if (color === void 0) { color = "red"; }
            _super.prototype.render.call(this, color);
        };
        // data shape {text: size:}
        WordCloudLens.prototype.extractData = function () {
            var data;
            data = [
                { text: "Samsung", value: 90 },
                { text: "Apple", value: 80 },
                { text: "Lenovo", value: 50 },
                { text: "LG", value: 60 },
                { text: "Nokia", value: 30 },
                { text: "Huawei", value: 40 },
                { text: "Meizu", value: 50 },
                { text: "HTC", value: 60 },
                { text: "XiaoMi", value: 60 },
                { text: "ZTE", value: 40 },
                { text: "Galaxy Note Edge", value: 60 },
                { text: "LED H5205", value: 70 },
                { text: "Galaxy Tab3 8.0", value: 50 },
                { text: "Galaxy Tab3 10.1", value: 50 },
                { text: "Gear S", value: 70 },
                { text: "Gear Fit", value: 40 },
                { text: "Gear Fit2", value: 30 },
                { text: "Galaxy S4", value: 60 }
            ];
            this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                return d.value;
            }));
            return data;
        };
        WordCloudLens.prototype.showLens = function (data) {
            var _this = this;
            var p = _super.prototype.showLens.call(this);
            var container = this._element;
            var lensG = this._lensG;
            lensG.transition().duration(p.duration).attr("opacity", "1");
            this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                return _this._font_size(d.value);
            }).on("end", function (words, bounds) {
                _this.drawCloud(words, bounds);
            });
            this._cloud.start();
        };
        WordCloudLens.prototype.drawCloud = function (words, bounds) {
            var _this = this;
            var w = this._cloud_w;
            var h = this._cloud_h;
            var container = this._element;
            //Maybe need to scale, but I haven't implemented it now
            var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
            var text = this._lensG.selectAll("text").data(words, function (d) {
                return d.text;
            }).enter().append("text");
            text.attr("text-anchor", "middle").style("font-size", function (d) {
                return d.size + "px";
            }).style("font-weight", function (d) {
                return d.weight;
            }).style("font-family", function (d) {
                return d.font;
            }).style("fill", function (d, i) {
                return _this._color(d.size);
            }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")";
            }).text(function (d) {
                return d.text;
            }).transition().duration(200).style("opacity", 1);
        };
        WordCloudLens.prototype.zoomFunc = function () {
            _super.prototype.zoomFunc.call(this);
        };
        return WordCloudLens;
    })(ManyLens.BaseD3Lens);
    ManyLens.WordCloudLens = WordCloudLens;
})(ManyLens || (ManyLens = {}));
//# sourceMappingURL=ManyLens.js.map