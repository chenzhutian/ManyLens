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
    var lensPane = new ManyLens.LensPane(d3.select("#mapView").select("svg"));
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
            var cr = this._sc_radius;
            var hasShow = false;
            console.log(color);
            var selectCircle = this._select_circle = this._element.append("circle").attr("r", cr).attr("fill", color).attr("fill-opacity", 0.3).on("mousedown", function () {
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
            }).on("click", function () {
                d3.event.stopPropagation();
            });
            container.on("mousemove", moveSelectCircle);
            function moveSelectCircle() {
                container.select(".lcthings").remove();
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
            var container = this._element;
            var cr = this._sc_radius;
            var cx = this._sc_cx + (cr * Math.cos(theta));
            var cy = this._sc_cy + (cr * Math.sin(theta));
            var duration = 300;
            var svg = container.append("g").attr("class", "lcthings");
            svg.append("line").attr("x1", cx).attr("y1", cy).attr("x2", cx).attr("y2", cy).attr("stoke-width", 2).attr("stroke", "red").transition().duration(duration).attr("x2", function () {
                cx = cx + (sc_lc_dist * Math.cos(theta));
                return cx;
            }).attr("y2", function () {
                cy = cy + (sc_lc_dist * Math.sin(theta));
                return cy;
            });
            this._lc_cx = cx + (this._lc_radius * Math.cos(theta));
            this._lc_cy = cy + (this._lc_radius * Math.sin(theta));
            this._zoom.scaleExtent([1, 2]).on("zoom", function () {
                _this.zoomFunc();
            });
            svg.append("g").call(this._zoom);
            this._lensG = container.select("g.lcthings").select("g").attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")").attr("opacity", "1e-6").on("mousedown", function () {
                d3.event.stopPropagation();
            }).on("click", function () {
                d3.event.stopPropagation();
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
            d3.select("g.lcthings").select("g").attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + d3.event.scale + ")");
            d3.select("g.lcthings").select("line").attr("x1", this._sc_cx + this._sc_radius * cosTheta).attr("y1", this._sc_cy + this._sc_radius * sinTheta).attr("x2", this._lc_cx - this._lc_radius * d3.event.scale * cosTheta).attr("y2", this._lc_cy - this._lc_radius * d3.event.scale * sinTheta);
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
            this._lens.push(new ManyLens.BarChartLens(element));
            this._lens.push(new ManyLens.LocationLens(element));
            this._lens.push(new ManyLens.NetworkTreeLens(element));
            this._lens.push(new ManyLens.PieChartLens(element));
            this._lens.push(new ManyLens.WordCloudLens(element));
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
            svg.selectAll("circle").data(this._pane_pie(this._lens)).enter().append("circle").attr("class", "paneCircle").attr("id", function (d, i) {
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
                var c = _this._pane_color(i);
                _this._lens[i].render(c);
                d3.event.stopPropagation();
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
        function WordCloudLens(element) {
            _super.call(this, element, "WordCloudLens");
            this._font_size = d3.scale.sqrt();
            this._cloud = d3.layout.cloud();
            this._cloud_w = this._lc_radius * 2; //Math.sqrt(2);
            this._cloud_h = this._cloud_w;
            this._cloud_padding = 1;
            this._cloud_font = "Calibri";
            this._cloud_font_weight = "normal";
            this._cloud_rotate = 0;
            this._color = d3.scale.category20c();
        }
        WordCloudLens.prototype.render = function (color) {
            _super.prototype.render.call(this, color);
        };
        // data shape {text: size:}
        WordCloudLens.prototype.extractData = function () {
            var data;
            data = [{ text: "Samsung", value: 90 }, { text: "Apple", value: 80 }, { text: "Lenovo", value: 50 }, { text: "LG", value: 60 }, { text: "Nokia", value: 30 }, { text: "Huawei", value: 40 }, { text: "Meizu", value: 50 }, { text: "HTC", value: 60 }, { text: "XiaoMi", value: 60 }, { text: "ZTE", value: 40 }, { text: "Galaxy Note Edge", value: 60 }, { text: "LED H5205", value: 70 }, { text: "Galaxy Tab3 8.0", value: 50 }, { text: "Galaxy Tab3 10.1", value: 50 }, { text: "Gear S", value: 70 }, { text: "Gear Fit", value: 40 }, { text: "Gear Fit2", value: 30 }, { text: "Galaxy S4", value: 60 }];
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
            this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(this._cloud_rotate).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
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
            console.log(scale);
            var text = container.select("g.lcthings").select("g").selectAll("text").data(words, function (d) {
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
            }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("class", "show").attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
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