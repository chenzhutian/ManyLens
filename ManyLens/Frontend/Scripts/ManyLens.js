var ManyLens;
(function (ManyLens) {
    var Hub;
    (function (Hub) {
        /*------------------Extent by myself -----------*/
        var SignalRHub = (function () {
            function SignalRHub() {
            }
            SignalRHub.HubConnection = $.connection.hub;
            return SignalRHub;
        })();
        Hub.SignalRHub = SignalRHub;
        var ManyLensHub = (function () {
            function ManyLensHub() {
                this.server = $.connection.manyLensHub.server;
                this.client = $.connection.manyLensHub.client;
            }
            return ManyLensHub;
        })();
        Hub.ManyLensHub = ManyLensHub;
    })(Hub = ManyLens.Hub || (ManyLens.Hub = {}));
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var Navigation;
    (function (Navigation) {
        var SideBarNavigation = (function () {
            function SideBarNavigation(element, brandName, mapSvg, manyLens) {
                var _this = this;
                /*-----------------Data menu-----------------*/
                this._isLoaded = false;
                this._element = element;
                this._manyLens = manyLens;
                this._brand_name = brandName;
                this._map_Svg = mapSvg;
                this._launchDataBtn = this._element.append("button").attr({
                    type: "button",
                    class: "btn btn-primary btn-block disabled"
                }).style({
                    "margin-top": "30px",
                    "margin-bottom": "90px"
                }).text("Launch").on("click", function () {
                    _this._launchDataBtn.classed("disabled", true);
                    _this.PullData();
                });
                this._brand = this._element.append("div").attr("class", "nav-brand").text(this._brand_name);
                this._menu_list = this._element.append("div").attr("class", "menu-list").append("ul").attr("id", "side-menu-content").attr("class", "menu-content");
            }
            SideBarNavigation.prototype.DemoData = function () {
                var data = {
                    name: "root",
                    icon: null,
                    children: [
                        {
                            name: "Annulus Chart",
                            icon: "fui-html5",
                            children: [
                                {
                                    name: "Tweet Length",
                                    lensConstructFunc: ManyLens.Lens.PieChartLens,
                                    extractDataFunc: function (d, newData) {
                                        if (newData)
                                            d.tweetLengthDistribute = newData;
                                        return d.tweetLengthDistribute;
                                    }
                                },
                                {
                                    name: "Hashtag Count",
                                    lensConstructFunc: ManyLens.Lens.PieChartLens,
                                    extractDataFunc: function (d, newData) {
                                        if (newData)
                                            d.hashTagDistribute = newData;
                                        return d.hashTagDistribute;
                                    }
                                },
                                {
                                    name: "Url Count",
                                    lensConstructFunc: ManyLens.Lens.PieChartLens
                                },
                                {
                                    name: "@Mention Count",
                                    lensConstructFunc: ManyLens.Lens.PieChartLens
                                }
                            ]
                        },
                        {
                            name: "Text",
                            icon: "fui-foursquare",
                            children: [
                                {
                                    name: "Keywords",
                                    lensConstructFunc: ManyLens.Lens.WordCloudLens,
                                    extractDataFunc: function (d, newData) {
                                        if (newData)
                                            d.keywordsDistribute = newData;
                                        return d.keywordsDistribute;
                                    }
                                },
                                {
                                    name: "Hashtag",
                                    lensConstructFunc: ManyLens.Lens.WordCloudLens,
                                    extractDataFunc: function (d, newData) {
                                        if (newData)
                                            d.hashTagDistribute = newData;
                                        return d.hashTagDistribute;
                                    }
                                }
                            ]
                        },
                        {
                            name: "Network",
                            icon: "fui-windows-8",
                            children: [
                                {
                                    name: "New Service1",
                                    lensConstructFunc: ManyLens.Lens.NetworkLens
                                }
                            ]
                        },
                        {
                            name: "Map",
                            icon: "fui-mail",
                            children: [
                                {
                                    name: "New New 1",
                                    lensConstructFunc: ManyLens.Lens.MapLens
                                },
                                { name: "New New 2" },
                                { name: "New New 3" }
                            ]
                        }
                    ]
                };
                return data;
            };
            SideBarNavigation.prototype.BuildList = function (listData) {
                var _this = this;
                this._menu_list_data = listData;
                if (!this._menu_list_data) {
                    this._menu_list_data = this.DemoData();
                }
                var menuList = this._menu_list_data.children;
                for (var i = 0, menu_len = menuList.length; i < menu_len; ++i) {
                    var sub_menu = menuList[i].children;
                    var li = this._menu_list.append("li").attr("class", "panel").html('<div data-target=#' + menuList[i].name.replace(" ", "-") + ' data-toggle="collapse" data-parent="#side-menu-content" class="collapsed"><i class="' + menuList[i].icon + '"></i>' + menuList[i].name + '</div>');
                    //add high light function
                    li.select("div").on("click", function () {
                        d3.event.preventDefault();
                        if (d3.select(this.parentNode).classed("active")) {
                            d3.select("li.active").classed("active", false);
                        }
                        else {
                            d3.select("li.active").classed("active", false);
                            d3.select(this.parentNode).classed("active", true);
                        }
                    });
                    if (sub_menu) {
                        li.select("div").append("span").attr("class", "arrow fui-triangle-down");
                        var ul = li.append("ul").attr("class", "sub-menu collapse").attr("id", menuList[i].name.replace(" ", "-"));
                        ul.selectAll("li").data(sub_menu).enter().append("li").text(function (d) {
                            return d.name;
                        }).on("click", function (d) {
                            var lens = new d.lensConstructFunc(_this._map_Svg, d.name, _this._manyLens);
                            lens.DataAccesser(d.extractDataFunc).Render("red");
                        });
                    }
                }
            };
            SideBarNavigation.prototype.FinishLoadData = function () {
                this._isLoaded = true;
                this._launchDataBtn.classed("disabled", false);
            };
            SideBarNavigation.prototype.PullData = function () {
                var _this = this;
                if (ManyLens.ManyLens.TestMode) {
                    this._manyLens.ManyLensHubServerTestPullPoint().done(function () {
                        _this._launchDataBtn.classed("disabled", false);
                    });
                }
                else {
                    this._manyLens.ManyLensHubServerPullPoint("0").done(function () {
                        _this._launchDataBtn.classed("disabled", false);
                    });
                }
            };
            return SideBarNavigation;
        })();
        Navigation.SideBarNavigation = SideBarNavigation;
    })(Navigation = ManyLens.Navigation || (ManyLens.Navigation = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../Scripts/typings/d3.cloud.layout/d3.cloud.layout.d.ts" />
var ManyLens;
(function (ManyLens) {
    var D3ChartObject = (function () {
        function D3ChartObject(element, manyLens) {
            this._element = element;
            this._manyLens = manyLens;
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
            function Curve(element, manyLens) {
                _super.call(this, element, manyLens);
                this._x_scale = d3.scale.linear();
                this._x_axis_gen = d3.svg.axis();
                this._y_scale = d3.scale.linear();
                this._y_axis_gen = d3.svg.axis();
                this._section_num = 50;
                this._view_height = 130;
                this._view_top_padding = 15;
                this._view_botton_padding = 5;
                this._view_left_padding = 50;
                this._view_right_padding = 50;
                this._section = new Array();
                this._data = new Array();
                this._markData = new Array();
                this._lastMark = {
                    id: null,
                    type: 2
                };
                this._view_width = parseFloat(this._element.style("width"));
                this._x_scale.domain([0, this._section_num]).range([this._view_left_padding, this._view_width - this._view_right_padding]);
                this._y_scale.domain([0, 20]).range([this._view_height - this._view_botton_padding, this._view_top_padding]);
                this._x_axis_gen.scale(this._x_scale).ticks(0).orient("bottom");
                this._y_axis_gen.scale(this._y_scale).ticks(2).orient("left");
                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction(this, "addPoint", this.AddPoint);
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
            Curve.prototype.Render = function () {
                _super.prototype.Render.call(this, null);
                var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
                var coordinate_view_height = this._view_height - this._view_top_padding - this._view_botton_padding;
                this._element.select(".progress").style("display", "none");
                this._curveSvg = this._element.insert("svg", ":first-child").attr("width", this._view_width).attr("height", this._view_height).style("margin-bottom", "17px");
                this._curveSvg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", coordinate_view_width).attr("height", coordinate_view_height + 10).attr("x", this._view_left_padding).attr("y", this._view_top_padding - 10);
                this._x_axis = this._curveSvg.append("g").attr("class", "curve x axis").attr("transform", "translate(0," + (this._view_height - this._view_botton_padding) + ")").call(this._x_axis_gen);
                this._y_axis = this._curveSvg.append("g").attr("class", "curve y axis").attr("transform", "translate(" + this._view_left_padding + ",0)").call(this._y_axis_gen);
                this._mainView = this._curveSvg.append("g").attr("clip-path", "url(#clip)").append("g").attr("id", "curve.mainView");
                this._mainView.append("path").attr('stroke', 'rgb(31, 145, 189)').attr('stroke-width', 2).attr('fill', 'none').attr("id", "path");
            };
            Curve.prototype.PullInterval = function (interalID) {
                var _this = this;
                if (ManyLens.ManyLens.TestMode)
                    this._manyLens.ManyLensHubServerTestPullInterval(interalID);
                else {
                    this._manyLens.ManyLensHubServerPullInterval(interalID).progress(function (percent) {
                        _this._element.select(".progress-bar").style("width", percent * 100 + "%");
                    }).done(function () {
                        _this._element.select(".progress-bar").style("width", 0);
                        _this._element.select(".progress").style("display", "none");
                        _this._curveSvg.style("margin-bottom", "17px");
                    });
                }
            };
            Curve.prototype.AddPoint = function (point) {
                this._data.push(point);
                this.RefreshGraph(point.mark);
                if (this._data.length > this._section_num + 1) {
                    this._data.shift();
                }
            };
            Curve.prototype.RefreshGraph = function (mark) {
                var _this = this;
                this._y_scale.domain([0, d3.max(this._data, function (d) {
                    return d.value;
                })]);
                this._y_axis_gen.scale(this._y_scale);
                this._y_axis.call(this._y_axis_gen);
                //if (mark.type == 2 || mark.type == 3) {
                //    var eid = mark.id;
                //    var iter = this._markData.length - 1;
                //    while (iter >= 0 && (this._markData[iter].type == 4)) {
                //        this._markData[iter].end = eid;
                //        --iter;
                //    }
                //    if (iter >= 0 && (this._markData[iter].type == 3 || this._markData[iter].type == 1)) {
                //        this._markData[iter].end = eid;
                //    }
                //    if (mark.type == 2) {
                //        mark.beg = this._lastMark.id;
                //    }
                //    this._markData.push(mark);
                //    this._lastMark = mark;
                //} else {
                //    if (mark.type == 4) {
                //        mark.beg = this._lastMark.id;
                //    }
                //    if (mark.type == 1) {
                //        this._lastMark = mark;
                //    }
                //    this._markData.push(mark);
                //}
                this._markData.push(mark);
                this._section = new Array();
                var lastSection;
                this._markData.forEach(function (d, i) {
                    try {
                        if (d.type == 1 || ((d.type == 4 || d.type == 3) && i == 0)) {
                            var section = {
                                beg: i,
                                end: 0,
                                id: d.beg,
                                values: [0]
                            };
                            lastSection = section;
                        }
                        else if (d.type == 3) {
                            lastSection.end = i;
                            _this._section.push(lastSection);
                            var section = {
                                beg: i,
                                end: 0,
                                id: d.beg,
                                values: [0]
                            };
                            lastSection = section;
                        }
                        else if (d.type == 2 && i != 0) {
                            lastSection.end = i;
                            _this._section.push(lastSection);
                        }
                        else if (d.type == 4 && i == _this._markData.length - 1) {
                            lastSection.end = i;
                            _this._section.push(lastSection);
                        }
                    }
                    catch (e) {
                        console.log(d);
                        console.log(i);
                        console.log(lastSection);
                        console.log(_this._markData);
                    }
                });
                //handle the seg line
                //this._mainView.selectAll(".curve.mark").remove();
                //var lines = this._mainView.selectAll(".curve.mark").data(this._markData);
                //lines.enter().append("line")
                //    .attr("x1", (d, i) => {
                //        return this._x_scale(i);
                //    })
                //    .attr("x2", (d, i) => {
                //        return this._x_scale(i);
                //    })
                //    .attr("y1", this._view_top_padding)
                //    .attr("y2", (d) => {
                //        if (d.type == 1 || d.type == 2 || d.type == 3)
                //            return this._view_height + this._view_top_padding;
                //        return this._view_top_padding;
                //    })
                //   // .attr('stroke', function (d) { return d.type == 1 ? 'red' : d.type == 2 ? 'green' : 'navy'; })
                //    .attr('stroke', function (d) { return "#fff"; })
                //    .attr('stroke-width', function (d) { return d.type == 3 ? 2 : 0;})
                //    .attr("class", "curve mark")
                //;
                //handle the seg rect
                var rects = this._mainView.selectAll(".curve.seg").data(this._section);
                rects.attr("x", function (d, i) {
                    return _this._x_scale(d.beg);
                }).attr("width", function (d, i) {
                    return _this._x_scale(d.end) - _this._x_scale(d.beg);
                });
                rects.enter().append("rect").attr("x", function (d, i) {
                    return _this._x_scale(d.beg);
                }).attr("y", this._view_top_padding).attr("width", function (d, i) {
                    return _this._x_scale(d.end) - _this._x_scale(d.beg);
                }).attr("height", this._view_height).attr("class", "curve seg").style({
                    fill: "#ffeda0",
                    opacity: 0.5
                }).on("click", function (d) {
                    _this.SelectSegment(d);
                });
                rects.exit().remove();
                //handle the seg node
                var nodes = this._mainView.selectAll(".curve.node").data(this._data, function (d) {
                    return d.mark.id;
                });
                nodes.attr("cx", function (d, i) {
                    return _this._x_scale(i);
                }).attr("cy", function (d) {
                    return _this._y_scale(d.value);
                });
                nodes.enter().append("circle").attr("class", "curve node").attr("cx", function (d, i) {
                    return _this._x_scale(i);
                }).attr("cy", function (d) {
                    return _this._y_scale(d.value);
                }).attr("r", function (d) {
                    return d.mark.type == 0 ? 0 : 3;
                }).style({
                    fill: "#fff",
                    stroke: "rgb(31, 145, 189)",
                    "stroke-width": 2
                });
                nodes.exit().remove();
                var lineFunc = d3.svg.line().x(function (d, i) {
                    return _this._x_scale(i);
                }).y(function (d, i) {
                    return _this._y_scale(d.value);
                }).interpolate("linear");
                //handle the line path
                this._mainView.selectAll("#path").attr("d", lineFunc(this._data));
                // move the main view
                if (this._data.length > (this._section_num + 1)) {
                    this._mainView.attr("transform", null).transition().duration(800).ease("linear").attr("transform", "translate(" + (this._x_scale(0) - this._x_scale(1)) + ",0)");
                }
                if (this._markData.length > this._section_num + 1) {
                    this._markData.shift();
                }
            };
            Curve.prototype.SelectSegment = function (d) {
                if (d.end != null) {
                    this._curveSvg.style("margin-bottom", "0px");
                    this._element.select(".progress").style("display", "block");
                    this.PullInterval(d.id);
                }
                else {
                    console.log("Segmentation hasn't finished yet!");
                }
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
            function HistoryTrees(element, manyLens) {
                _super.call(this, element, manyLens);
                this._trees = [];
                this._element.attr("height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });
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
                var _this = this;
                _super.call(this, element, manyLens);
                this._combine_failure_rebound_duration = 800;
                this._sc_lc_svg = null;
                this._lens_circle_radius = 100;
                this._lens_circle_scale = 1;
                this._lens_circle_zoom = d3.behavior.zoom();
                this._lens_circle_drag = d3.behavior.drag();
                this._is_component_lens = false;
                this._is_composite_lens = null;
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
            Object.defineProperty(BaseD3Lens.prototype, "RawData", {
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
            BaseD3Lens.prototype.ExtractData = function () {
                throw new Error('This method is abstract');
            };
            BaseD3Lens.prototype.DisplayLens = function (any) {
                var _this = this;
                if (any === void 0) { any = null; }
                var duration = 300;
                this._lens_circle_svg = this._sc_lc_svg.append("g").data([{ x: this._lens_circle_cx, y: this._lens_circle_cy }]).attr("id", "lens_" + this._manyLens.LensCount).attr("class", "lens-circle-g " + this._type).attr("transform", "translate(" + [this._lens_circle_cx, this._lens_circle_cy] + ")scale(" + this._lens_circle_scale + ")").attr("opacity", "1e-6").style("pointer-events", "none").on("contextmenu", function () {
                    //d3.event.preventDefault();
                }).on("mousedown", function () {
                    console.log("lc_mousedown " + _this._type);
                }).on("mouseup", function () {
                    console.log("lc_mouseup " + _this._type);
                }).on("click", function () {
                    console.log("lc_click " + _this._type);
                }).call(this._lens_circle_zoom).on("dblclick.zoom", null).call(this._lens_circle_drag);
                this._lens_circle = this._lens_circle_svg.append("circle").attr("class", "lens-circle").attr("cx", 0).attr("cy", 0).attr("r", this._lens_circle_radius).attr("fill", "#fff").attr("stroke", "black").attr("stroke-width", 1);
                //re-order the line, select-circle and lens-circle
                //var tempChildren = d3.selectAll(this._sc_lc_svg[0][0].children);
                //var tt = tempChildren[0][0];
                //tempChildren[0][0] = tempChildren[0][1];
                //tempChildren[0][1] = tt;
                //tempChildren.order();
                //Add this lens to the app class
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
                this._lens_circle_svg.attr("opacity", "1").style("pointer-events", "none").transition().duration(200).attr("opacity", "1e-6").remove();
            };
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
            function BaseSingleLens(element, attributeName, type, manyLens) {
                _super.call(this, element, type, manyLens);
                this._select_circle_radius = 0;
                this._select_circle_cx = -10;
                this._select_circle_cy = -10;
                this._select_circle_scale = 1;
                this._select_circle_zoom = d3.behavior.zoom();
                this._select_circle_drag = d3.behavior.drag();
                this._place = null;
                this._has_put_down = false;
                this._has_showed_lens = false;
                //protected _sc_drag_event_flag: boolean = false;
                this._sc_lc_default_dist = 100;
                this._extract_data_map_func = null;
                this._is_composite_lens = false;
                this._select_circle_radius = 10;
                this._attribute_name = attributeName;
            }
            Object.defineProperty(BaseSingleLens.prototype, "AttributeName", {
                get: function () {
                    return this._attribute_name;
                },
                enumerable: true,
                configurable: true
            });
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
            Object.defineProperty(BaseSingleLens.prototype, "LensPlace", {
                get: function () {
                    return this._place;
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
                    //this._sc_drag_event_flag = false;
                    console.log("sc_dragstart " + _this._type);
                }).on("drag", function () {
                    //if (this._sc_drag_event_flag) {
                    _this.SelectCircleDragFunc();
                    //} else {
                    //    this._sc_drag_event_flag = true;
                    //}
                    console.log("sc_drag " + _this._type);
                }).on("dragend", function (d) {
                    _this.SelectCircleDragendFunc(d);
                    console.log("sc_dragend " + _this._type);
                });
                this._sc_lc_svg.append("line").attr("stoke-width", 2).attr("stroke", "red");
                this._select_circle_svg = this._sc_lc_svg.append("g").attr("class", "select-circle");
                var selectCircle = this._select_circle = this._select_circle_svg.append("circle").data([{ x: this._select_circle_cx, y: this._select_circle_cy }]);
                selectCircle.attr("r", this._select_circle_radius).attr("fill", color).attr("fill-opacity", 0.7).attr("stroke", "black").attr("stroke-width", 1).attr({
                    cx: -50,
                    cy: -50
                }).on("mouseup", function (d) {
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
                container.on("mousemove", moveSelectCircle); //因为鼠标是在大SVG里移动，所以要绑定到大SVG上
                function moveSelectCircle() {
                    var p = d3.mouse(container[0][0]);
                    selectCircle.attr("cx", p[0]).attr("cy", p[1]);
                }
            };
            BaseSingleLens.prototype.DataAccesser = function (map) {
                if (map == null)
                    return this._extract_data_map_func;
                this._extract_data_map_func = map;
                return this;
            };
            BaseSingleLens.prototype.ExtractData = function () {
                var res = this.GetElementByMouse();
                if (!res) {
                    this._data = null;
                }
                else {
                    this._data = (d3.select(res).data()[0].lensData);
                    this._place = this._data.unitsID[0];
                }
                return this._data;
            };
            BaseSingleLens.prototype.DisplayLens = function () {
                var _this = this;
                if (this._data) {
                    var duration = _super.prototype.DisplayLens.call(this);
                    var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                    var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                    var cx = this._select_circle_cx + (this._select_circle_radius * cosTheta * this._select_circle_scale);
                    var cy = this._select_circle_cy + (this._select_circle_radius * sinTheta * this._select_circle_scale);
                    this._sc_lc_svg.select("line").attr("x1", cx).attr("y1", cy).attr("x2", cx).attr("y2", cy).attr("stoke-width", 2).attr("stroke", "red").transition().duration(duration).attr("x2", function () {
                        return _this._lens_circle_cx; //cx + (this._sc_lc_default_dist * cosTheta);
                    }).attr("y2", function () {
                        return _this._lens_circle_cy; //cy + (this._sc_lc_default_dist * sinTheta);
                    });
                    return true;
                }
                else {
                    return null;
                }
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
                    this._select_circle_cx = selectCircle.x;
                    this._select_circle_cy = selectCircle.y;
                    var theta = Math.random() * Math.PI;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);
                    this._lens_circle_cx = this._select_circle_cx + (this._select_circle_radius * this._select_circle_scale + this._sc_lc_default_dist + this._lens_circle_radius) * cosTheta;
                    this._lens_circle_cy = this._select_circle_cy + (this._select_circle_radius * this._select_circle_scale + this._sc_lc_default_dist + this._lens_circle_radius) * sinTheta;
                    this.ExtractData();
                    this.DisplayLens();
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
            BaseSingleLens.prototype.GetElementByMouse = function () {
                var res;
                var eles = [];
                try {
                    var x = d3.event.sourceEvent.x, y = d3.event.sourceEvent.y;
                }
                catch (e) {
                    return;
                }
                var p = d3.mouse(this._element.node());
                if (p[0] < 0 || p[0] > parseFloat(this._element.style("width")) || p[1] < 0 || p[1] > parseFloat(this._element.style("height")))
                    return;
                var ele = d3.select(document.elementFromPoint(x, y));
                while (ele && ele.attr("id") != "mapSvg") {
                    if (ele.classed("unit")) {
                        res = ele[0][0];
                        break;
                    }
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
                return res;
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
            function BarChartLens(element, attributeName, manyLens) {
                _super.call(this, element, attributeName, BarChartLens.Type, manyLens);
                this._x_axis_gen = d3.svg.axis();
                this._bar_chart_width = this._lens_circle_radius * Math.SQRT2;
                this._bar_chart_height = this._bar_chart_width;
            }
            BarChartLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            BarChartLens.prototype.ExtractData = function () {
                var data = _super.prototype.ExtractData.call(this);
                data = d3.range(12).map(function (d) {
                    return 10 + 70 * Math.random();
                });
                return data;
            };
            BarChartLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return;
                var x = d3.scale.linear().range([0, this._bar_chart_width]).domain([0, this._data]);
                this._x_axis_gen.scale(x).ticks(0).orient("bottom");
                this._x_axis = this._lens_circle_svg.append("g").attr("class", "x-axis").attr("transform", function () {
                    return "translate(" + [-_this._bar_chart_width / 2, _this._bar_chart_height / 2] + ")";
                }).attr("fill", "none").attr("stroke", "black").attr("stroke-width", 1).call(this._x_axis_gen);
                this._bar_width = (this._bar_chart_width - 20) / this._extract_data_map_func(this._data).length;
                var barHeight = d3.scale.linear().range([10, this._bar_chart_height]).domain(d3.extent(this._extract_data_map_func(this._data)));
                var bar = this._lens_circle_svg.selectAll(".bar").data(this._extract_data_map_func(this._data)).enter().append("g").attr("transform", function (d, i) {
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
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var MapLens = (function (_super) {
            __extends(MapLens, _super);
            function MapLens(element, attributeName, manyLens) {
                _super.call(this, element, attributeName, MapLens.Type, manyLens);
                this._projection = d3.geo.mercator();
                this._path = d3.geo.path();
                this._color = d3.scale.quantize();
                this._projection.scale(35).translate([0, 30]);
                this._path.projection(this._projection);
                this._color.range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                ]);
            }
            Object.defineProperty(MapLens.prototype, "Projection", {
                get: function () {
                    return this._projection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapLens.prototype, "Path", {
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapLens.prototype, "Color", {
                get: function () {
                    return this._color;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MapLens.prototype, "MapData", {
                get: function () {
                    return this._map_data;
                },
                enumerable: true,
                configurable: true
            });
            MapLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            MapLens.prototype.ExtractData = function () {
                var data = _super.prototype.ExtractData.call(this);
                data = [78, 72, 56, 55, 54, 53, 51, 50, 49, 48, 47, 46, 45, 44, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 13, 12, 11, 10, 9, 8, 6, 5, 4, 2, 1];
                var barData = [];
                data.forEach(function (d) {
                    barData[d] = Math.random() * 70;
                });
                return data;
            };
            MapLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return;
                if (this._map_data) {
                    this._map_data.color = [];
                    this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.countries).features).enter().append("path").attr("d", this._path).attr("fill", function (d) {
                        var color = _this._color(_this._data[d.id]);
                        _this._map_data.color.push(color);
                        return color;
                    }).on("click", function (d) {
                        if (!d3.event.defaultPrevented)
                            _this.ClickedMap(d);
                    });
                    this._lens_circle_svg.append("path").datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.countries, function (a, b) {
                        return a !== b;
                    })).attr("id", "state-borders").attr("d", this._path);
                }
                else {
                    d3.json("./testData/world.json", function (error, mapData) {
                        _this._color.domain(d3.extent(_this._extract_data_map_func(_this._data)));
                        _this._map_data = {
                            raw: mapData,
                            color: []
                        };
                        _this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(mapData, mapData.objects.countries).features).enter().append("path").attr("d", _this._path).attr("fill", function (d) {
                            var color = _this._color(d.id);
                            _this._map_data.color.push(color);
                            return color;
                        }).on("click", function (d) {
                            _this.ClickedMap(d);
                        });
                        _this._lens_circle_svg.append("path").datum(topojson.mesh(mapData, mapData.objects.countries, function (a, b) {
                            return a !== b;
                        })).attr("id", "state-borders").attr("d", _this._path);
                    });
                }
            };
            MapLens.prototype.ClickedMap = function (d) {
                var _this = this;
                if (d3.event.defaultPrevented)
                    return;
                var x, y, k;
                if (d && this._centered_state !== d) {
                    var centroid = this._path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    this._centered_state = d;
                    this._lens_circle_zoom.on("zoom", null);
                    this._lens_circle_drag.on("dragstart", null).on("drag", null).on("dragend", null);
                    this._element.on("click", function () {
                        _this.ClickedMap(_this._centered_state);
                    });
                }
                else {
                    x = 0;
                    y = 0;
                    k = this._lens_circle_scale;
                    this._centered_state = null;
                    this._lens_circle_drag.on("dragstart", function () {
                        _this.LensCircleDragstartFunc();
                    }).on("drag", function () {
                        _this.LensCircleDragFunc();
                    }).on("dragend", function () {
                        _this.LensCircleDragendFunc();
                    });
                    this._lens_circle_zoom.scale(this._lens_circle_scale).on("zoom", function () {
                        _this.LensCircleZoomFunc();
                    });
                    this._element.on("click", null);
                }
                this._lens_circle_svg.selectAll("path").classed("active", this._centered_state && (function (d) {
                    return d === _this._centered_state;
                }));
                this._lens_circle_svg.transition().duration(750).attr("transform", function (d) {
                    return "translate(" + _this._lens_circle_cx + "," + _this._lens_circle_cy + ")scale(" + k + ")translate(" + [-x, -y] + ")";
                }).style("stroke-width", 1.5 / k + "px");
                d3.event.stopPropagation();
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
            function NetworkLens(element, attributeName, manyLens) {
                _super.call(this, element, attributeName, NetworkLens.Type, manyLens);
                this._force = d3.layout.force();
                this._location_x_scale = d3.scale.linear();
                this._location_y_scale = d3.scale.linear();
                this._force.size([0, 0]).linkDistance(this._lens_circle_radius / 2).charge(-100);
                this._location_x_scale.range([-this._lens_circle_radius, this._lens_circle_radius]);
                this._location_y_scale.range([-this._lens_circle_radius, this._lens_circle_radius]);
            }
            NetworkLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            NetworkLens.prototype.ExtractData = function () {
                var data = _super.prototype.ExtractData.call(this);
                var graph = {
                    "nodes": [{ "x": 208.992345, "y": 273.053211 }, { "x": 595.98896, "y": 56.377057 }, { "x": 319.568434, "y": 278.523637 }, { "x": 214.494264, "y": 214.893585 }, { "x": 482.664139, "y": 340.386773 }, { "x": 84.078465, "y": 192.021902 }, { "x": 196.952261, "y": 370.798667 }, { "x": 107.358165, "y": 435.15643 }, { "x": 401.168523, "y": 443.407779 }, { "x": 508.368779, "y": 386.665811 }, { "x": 355.93773, "y": 460.158711 }, { "x": 283.630624, "y": 87.898162 }, { "x": 194.771218, "y": 436.366028 }, { "x": 477.520013, "y": 337.547331 }, { "x": 572.98129, "y": 453.668459 }, { "x": 106.717817, "y": 235.990363 }, { "x": 265.064649, "y": 396.904945 }, { "x": 452.719997, "y": 137.886092 }],
                    "links": [{ "target": 11, "source": 0 }, { "target": 3, "source": 0 }, { "target": 10, "source": 0 }, { "target": 16, "source": 0 }, { "target": 1, "source": 0 }, { "target": 3, "source": 0 }, { "target": 9, "source": 0 }, { "target": 5, "source": 0 }, { "target": 11, "source": 0 }, { "target": 13, "source": 0 }, { "target": 16, "source": 0 }, { "target": 3, "source": 1 }, { "target": 9, "source": 1 }, { "target": 12, "source": 1 }, { "target": 4, "source": 2 }, { "target": 6, "source": 2 }, { "target": 8, "source": 2 }, { "target": 13, "source": 2 }, { "target": 10, "source": 3 }, { "target": 16, "source": 3 }, { "target": 9, "source": 3 }, { "target": 7, "source": 3 }, { "target": 11, "source": 5 }, { "target": 13, "source": 5 }, { "target": 12, "source": 5 }, { "target": 8, "source": 6 }, { "target": 13, "source": 6 }, { "target": 10, "source": 7 }, { "target": 11, "source": 7 }, { "target": 17, "source": 8 }, { "target": 13, "source": 8 }, { "target": 11, "source": 10 }, { "target": 16, "source": 10 }, { "target": 13, "source": 11 }, { "target": 14, "source": 12 }, { "target": 14, "source": 12 }, { "target": 14, "source": 12 }, { "target": 15, "source": 12 }, { "target": 16, "source": 12 }, { "target": 15, "source": 14 }, { "target": 16, "source": 14 }, { "target": 15, "source": 14 }, { "target": 16, "source": 15 }, { "target": 16, "source": 15 }, { "target": 17, "source": 16 }]
                };
                return graph;
                return data;
            };
            NetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return;
                var testData = this.ExtractData();
                var nodes = testData.nodes, links = testData.links;
                this._location_x_scale.domain(d3.extent(nodes, function (d) {
                    return d['x'];
                }));
                this._location_y_scale.domain(d3.extent(nodes, function (d) {
                    return d['y'];
                }));
                nodes.forEach(function (d) {
                    d.x = _this._location_x_scale(d.x), d.y = _this._location_y_scale(d.y);
                });
                this._force.nodes(nodes).links(links);
                var link = this._lens_circle_svg.selectAll(".link").data(links).enter().append("line").attr("class", "link").style({
                    "stroke": "#777",
                    "stroke-width": "1px"
                });
                var node = this._lens_circle_svg.selectAll(".node").data(nodes).enter().append("circle").attr("class", "node").attr("r", 4).attr('cx', function (d) {
                    return d.x;
                }).attr('cy', function (d) {
                    return d.y;
                }).style({
                    "stroke": "steelblue",
                    "fill": "#fff",
                    "stroke-width": 1.5
                });
                this._force.on("tick", function () {
                    node.attr('cx', function (d) {
                        return d.x;
                    }).attr('cy', function (d) {
                        return d.y;
                    });
                    link.attr('x1', function (d) {
                        return d.source.x;
                    }).attr('y1', function (d) {
                        return d.source.y;
                    }).attr('x2', function (d) {
                        return d.target.x;
                    }).attr('y2', function (d) {
                        return d.target.y;
                    });
                });
                this._force.start();
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
            function PieChartLens(element, attributeName, manyLens) {
                _super.call(this, element, attributeName, PieChartLens.Type, manyLens);
                this._innerRadius = this._lens_circle_radius - 20;
                this._outterRadius = this._lens_circle_radius - 0;
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._color = d3.scale.category20();
                this._arc.innerRadius(this._innerRadius).outerRadius(this._outterRadius);
                this._pie.value(function (d) {
                    return d.Value;
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
                var data = _super.prototype.ExtractData.call(this);
                return data;
            };
            PieChartLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return;
                this._lens_circle_svg.selectAll("path").data(this._pie(this._extract_data_map_func(this._data))).enter().append("path").attr("fill", function (d) {
                    return _this._color(d.data.Key);
                }).attr("d", this._arc);
                this._lens_circle_svg.append("text").text(this._attribute_name).attr("y", function () {
                    return 0; //- this.getBBox().height / 2;
                }).attr("x", function () {
                    return -this.getBBox().width / 2;
                });
            };
            PieChartLens.Type = "PieChartLens";
            return PieChartLens;
        })(Lens.BaseSingleLens);
        Lens.PieChartLens = PieChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var TreeNetworkLens = (function (_super) {
            __extends(TreeNetworkLens, _super);
            function TreeNetworkLens(element, attributeName, manyLens) {
                _super.call(this, element, attributeName, TreeNetworkLens.Type, manyLens);
                this._theta = 360;
                this._tree = d3.layout.tree();
            }
            TreeNetworkLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            TreeNetworkLens.prototype.ExtractData = function () {
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
                        }
                    ]
                };
                return data;
            };
            TreeNetworkLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial().projection(function (d) {
                    return [d.y, d.x / 180 * Math.PI];
                });
                this._tree.size([this._theta, this._lens_circle_radius - nodeRadius]).separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(this._data), links = this._tree.links(nodes);
                var link = this._lens_circle_svg.selectAll("path").data(links).enter().append("path").attr("fill", "none").attr("stroke", "#ccc").attr("stroke-width", 1.5).attr("d", diagonal);
                var node = this._lens_circle_svg.selectAll(".node").data(nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });
                node.append("circle").attr("r", nodeRadius).style("stroke", "steelblue").style("fill", "#fff").style("stroke-width", 1.5);
            };
            TreeNetworkLens.Type = "TreeNetworkLens";
            return TreeNetworkLens;
        })(Lens.BaseSingleLens);
        Lens.TreeNetworkLens = TreeNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var WordCloudLens = (function (_super) {
            __extends(WordCloudLens, _super);
            function WordCloudLens(element, attributeName, manyLens) {
                _super.call(this, element, attributeName, WordCloudLens.Type, manyLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * Math.SQRT2;
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
                var data = _super.prototype.ExtractData.call(this);
                if (data)
                    this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(this._extract_data_map_func(data), function (d) {
                        return d.Value;
                    }));
                return data;
            };
            WordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return null;
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._extract_data_map_func(this._data)).filter(function (d) {
                    if (d.Value > 3)
                        return true;
                    return false;
                }).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.Value);
                }).on("end", function (words, bounds) {
                    _this.DrawCloud(words, bounds);
                });
                this._cloud.start();
            };
            WordCloudLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var w = this._cloud_w;
                var h = this._cloud_h;
                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
                var text = this._lens_circle_svg.selectAll("text").data(words, function (d) {
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
///<reference path = "./BaseD3Lens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var BaseCompositeLens = (function (_super) {
            __extends(BaseCompositeLens, _super);
            function BaseCompositeLens(element, type, manyLens, firstLens, secondLens) {
                _super.call(this, element, type, manyLens);
                this._base_accessor_func = null;
                this._sub_accessor_func = null;
                this._new_lens_count = 1;
                this._need_to_reshape = false;
                this._is_composite_lens = true;
                this._components_select_circle = new Array();
                this._components_kind = new Map();
                this._components_places = new Map();
                this._components_data = new Map();
                this._components_lens = new Array();
                this._base_component = firstLens;
                this._lens_circle_cx = firstLens.LensCX;
                this._lens_circle_cy = firstLens.LensCY;
                if (secondLens) {
                    var firstLens0 = firstLens;
                    this._sub_component = secondLens;
                    this._components_lens.push(firstLens0);
                    this._components_select_circle.push({
                        _line: firstLens0.LinkLine,
                        _sc_cx: firstLens0.SelectCircleCX,
                        _sc_cy: firstLens0.SelectCircleCY,
                        _sc_radius: firstLens0.SelectCircleRadius,
                        _sc_scale: firstLens0.SelectCircleScale
                    });
                    this._components_kind.set(firstLens0.Type, 1);
                    this._components_data.set(firstLens0.LensPlace, firstLens0.RawData);
                    this._components_places.set(firstLens0.LensPlace, 1);
                    this._base_accessor_func = firstLens0.DataAccesser();
                    this._components_lens.push(secondLens);
                    this._components_select_circle.push({
                        _line: secondLens.LinkLine,
                        _sc_cx: secondLens.SelectCircleCX,
                        _sc_cy: secondLens.SelectCircleCY,
                        _sc_radius: secondLens.SelectCircleRadius,
                        _sc_scale: secondLens.SelectCircleScale
                    });
                    this._components_kind.set(secondLens.Type, 1);
                    //Check if this two lens are in the same place
                    if (firstLens0.LensPlace != secondLens.LensPlace) {
                        this._components_places.set(secondLens.LensPlace, 1);
                        this._components_data.set(secondLens.LensPlace, secondLens.RawData);
                    }
                    else {
                        var t = this._components_places.get(secondLens.LensPlace) + 1;
                        this._components_places.set(secondLens.LensPlace, t);
                    }
                    this._sub_accessor_func = secondLens.DataAccesser();
                }
                else {
                }
            }
            Object.defineProperty(BaseCompositeLens.prototype, "ComponentsLens", {
                get: function () {
                    return this._components_lens;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseCompositeLens.prototype, "ComponentsSelectCircle", {
                get: function () {
                    return this._components_select_circle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseCompositeLens.prototype, "ComponentsCount", {
                get: function () {
                    return this._components_lens.length;
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
            Object.defineProperty(BaseCompositeLens.prototype, "ComponentsPlace", {
                get: function () {
                    return this._components_places;
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
                var _this = this;
                this._data = null;
                this._components_data.forEach(function (componentData) {
                    if (_this._data == null)
                        _this._data = JSON.parse(JSON.stringify(componentData));
                    _this._data.unitsID.concat(componentData.unitsID);
                    _this._data.contents.concat(componentData.contents);
                    componentData.hashTagDistribute.forEach(function (d) {
                        var key = d.Key;
                        var value = d.Value;
                        var column = _this._data.hashTagDistribute;
                        for (var i = 0, len = column.length; i < len; ++i) {
                            if (key == column[i].Key) {
                                column[i].Value += value;
                                break;
                            }
                        }
                        if (i == len) {
                            column.push(d);
                        }
                    });
                    componentData.keywordsDistribute.forEach(function (d) {
                        var key = d.Key;
                        var value = d.Value;
                        var column = _this._data.keywordsDistribute;
                        for (var i = 0, len = column.length; i < len; ++i) {
                            if (key == column[i].Key) {
                                column[i].Value += value;
                                break;
                            }
                        }
                        if (i == len) {
                            column.push(d);
                        }
                    });
                    componentData.tweetLengthDistribute.forEach(function (d) {
                        var key = d.Key;
                        var value = d.Value;
                        var column = _this._data.tweetLengthDistribute;
                        for (var i = 0, len = column.length; i < len; ++i) {
                            if (key == column[i].Key) {
                                column[i].Value += value;
                                break;
                            }
                        }
                        if (i == len) {
                            column.push(d);
                        }
                    });
                });
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
                    for (var i = 0, len = this._components_select_circle.length; i < len; ++i) {
                        var sc = this._components_select_circle[i];
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
                return this;
            };
            BaseCompositeLens.prototype.RemoveComponentLens = function (lens) {
                //TODO remove related data here;
                var index = this._components_lens.indexOf(lens);
                if (-1 != index) {
                    this._components_lens.splice(index, 1);
                    this._components_select_circle.splice(index, 1);
                    var num = this._components_places.get(lens.LensPlace) - 1;
                    if (num > 0) {
                        this._components_places.set(lens.LensPlace, num);
                    }
                    else if (num == 0) {
                        this._components_places.delete(lens.LensPlace);
                        this._components_data.delete(lens.LensPlace);
                    }
                    else {
                        throw new Error("The number of this places of component is less than 0!!");
                    }
                    if (this.ComponentsCount == 1) {
                        //if there is only one component left, we can just return this one
                        this.RemoveWholeSVG();
                        var lastLens = this._components_lens[0];
                        lastLens.LensCX = this.LensCX;
                        lastLens.LensCY = this.LensCY;
                        lastLens.LensRadius = this.LensRadius;
                        lastLens.LensScale = this.LensScale;
                        lastLens.DetachHostLens();
                        return this._components_lens[0];
                    }
                    else if (this.ComponentsCount < 1) {
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
                var i = newLensCount == 0 ? 0 : this._components_select_circle.length - newLensCount;
                for (var len = this._components_select_circle.length; i < len; ++i) {
                    var sc = this._components_select_circle[i];
                    var theta = Math.atan((this._lens_circle_cy - sc._sc_cy) / (this._lens_circle_cx - sc._sc_cx));
                    var cosTheta = this._lens_circle_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                    sc._line.attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta).attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta).attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta).attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
                }
                this._new_lens_count = 0;
            };
            //haven't handle yet
            //TODO
            BaseCompositeLens.prototype.AddCompositeLens = function (componentLens) {
                if (componentLens.ComponentsSelectCircle.length != componentLens.ComponentsLens.length)
                    throw new Error('The length of sc is different from length of lens');
                for (var i = 0, len = componentLens.ComponentsLens.length; i < len; ++i) {
                    this._components_lens.push(componentLens.ComponentsLens[i]);
                    this._components_select_circle.push(componentLens.ComponentsSelectCircle[i]);
                    if (this._components_kind.has(componentLens.ComponentsLens[i].Type)) {
                        var num = this._components_kind.get(componentLens.ComponentsLens[i].Type) + 1;
                        this._components_kind.set(componentLens.ComponentsLens[i].Type, num);
                    }
                    else {
                        this._components_kind.set(componentLens.ComponentsLens[i].Type, 1);
                    }
                    componentLens.ComponentsLens[i].ChangeHostTo(this);
                }
                componentLens.RemoveWholeSVG();
                this._manyLens.RemoveLens(componentLens);
                this._new_lens_count = componentLens.ComponentsLens.length;
            };
            BaseCompositeLens.prototype.AddSingleLens = function (lens) {
                this._components_lens.push(lens);
                this._components_select_circle.push({
                    _line: lens.LinkLine,
                    _sc_cx: lens.SelectCircleCX,
                    _sc_cy: lens.SelectCircleCY,
                    _sc_radius: lens.SelectCircleRadius,
                    _sc_scale: lens.SelectCircleScale
                });
                //Component kind
                if (this._components_kind.has(lens.Type)) {
                    var num = this._components_kind.get(lens.Type) + 1;
                    this._components_kind.set(lens.Type, num);
                }
                else {
                    this._components_kind.set(lens.Type, 1);
                }
                //Component place
                if (this._components_places.has(lens.LensPlace)) {
                    var num = this._components_places.get(lens.LensPlace) + 1;
                    this._components_places.set(lens.LensPlace, num);
                }
                else {
                    this._components_places.set(lens.LensPlace, 1);
                    this._components_data.set(lens.LensPlace, lens.RawData);
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
                this._innerRadius = this._lens_circle_radius - 0;
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
                var nodes = this._cluster.nodes(packageHierarchy(data)), links = packageImports(nodes);
                this._lens_circle_svg.selectAll(".link").data(this._boundle(links)).enter().append("path").attr("class", "link").attr("d", this._line).attr("stroke", "steelblue").attr("stroke-opacity", ".4").attr("fill", "none");
                this._lens_circle_svg.selectAll(".node").data(nodes.filter(function (n) {
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
///<reference path = "./BaseCompositeLens.ts" />
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
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cPieChartLens = (function (_super) {
            __extends(cPieChartLens, _super);
            function cPieChartLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cPieChartLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.category20();
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie.value(function (d) {
                    return d.host;
                }).startAngle(function (d, i) {
                    console.log(d, i);
                    return 0;
                }).padAngle(function (d, i) {
                    console.log(d, i);
                    return 0;
                }).sort(null);
                this._arc.innerRadius(function (d) {
                    return _this._lens_circle_radius - 20;
                }).outerRadius(function (d) {
                    return _this._lens_circle_radius;
                });
            }
            cPieChartLens.prototype.Render = function (color) {
                if (color === void 0) { color = "pupple"; }
                _super.prototype.Render.call(this, color);
            };
            cPieChartLens.prototype.ExtractData = function () {
                var _this = this;
                var data;
                data = d3.range(6).map(function (d, i) {
                    return {
                        host: _this._data[i],
                        sub: Math.random() * _this._data[i]
                    };
                });
                return data;
            };
            cPieChartLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                this._lens_circle_svg.selectAll(".innerPie").data(this._pie(data)).enter().append("path").attr("d", this._arc).style("fill", function (d, i) {
                    return _this._color(i);
                }).style("fill-rule", "evenodd");
                this._arc.innerRadius(this._lens_circle_radius).outerRadius(this._lens_circle_radius + 20).endAngle(function (d, i) {
                    return d.startAngle + (d.endAngle - d.startAngle) * (d.data.sub / d.value);
                });
                this._lens_circle_svg.selectAll(".outerPie").data(this._pie(data)).enter().append("path").attr("fill", function (d, i) {
                    return _this._color(i);
                }).attr("d", this._arc);
            };
            cPieChartLens.Type = "cPieChartLens";
            return cPieChartLens;
        })(Lens.BaseCompositeLens);
        Lens.cPieChartLens = cPieChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
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
                }).size([2 * Math.PI, this._lens_circle_radius]);
                this._arc.startAngle(function (d) {
                    return d.x;
                }).endAngle(function (d) {
                    return d.x + d.dx - .01 / (d.depth + .5);
                }).innerRadius(function (d) {
                    return _this._lens_circle_radius / 3 * d.depth;
                }).outerRadius(function (d) {
                    return _this._lens_circle_radius / 3 * (d.depth + 1) - 1;
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
                var svg = this._lens_circle_svg;
                var partition = this._partition;
                var hue = this._color;
                var luminance = this._luminance;
                var arc = this._arc;
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
                var center = svg.append("circle").attr("r", this._lens_circle_radius / 3).style("fill", "#fff").on("click", zoomOut);
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
        var cTreeNetworkLens = (function (_super) {
            __extends(cTreeNetworkLens, _super);
            function cTreeNetworkLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cTreeNetworkLens.Type, manyLens, firstLens, secondLens);
                this._theta = 360;
                this._tree = d3.layout.tree();
            }
            cTreeNetworkLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cTreeNetworkLens.prototype.ExtractData = function () {
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
                        }
                    ]
                };
                return data;
            };
            cTreeNetworkLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial().projection(function (d) {
                    return [d.y, d.x / 180 * Math.PI];
                });
                this._tree.size([this._theta, this._lens_circle_radius - nodeRadius]).separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(data), links = this._tree.links(nodes);
                var link = this._lens_circle_svg.selectAll("path").data(links).enter().append("path").attr("fill", "none").attr("stroke", "#ccc").attr("stroke-width", 1.5).attr("d", diagonal);
                var node = this._lens_circle_svg.selectAll(".node").data(nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });
                node.append("circle").attr("r", nodeRadius).attr("stroke", "steelblue").attr("fill", "#fff").attr("stroke-width", 1.5);
            };
            cTreeNetworkLens.Type = "cTreeNetworkLens";
            return cTreeNetworkLens;
        })(Lens.BaseCompositeLens);
        Lens.cTreeNetworkLens = cTreeNetworkLens;
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
                this._cloud_w = this._lens_circle_radius * Math.SQRT2; //Math.sqrt(2);
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
                _super.prototype.ExtractData.call(this);
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(this._base_accessor_func(this._data), function (d) {
                    return d.Value;
                }));
            };
            cWordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._base_accessor_func(this._data)).filter(function (d) {
                    if (d.Value > 3)
                        return true;
                    return false;
                }).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.Value);
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
                var text = this._lens_circle_svg.selectAll("text").data(words, function (d) {
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
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cWordCloudNetworkLens = (function (_super) {
            __extends(cWordCloudNetworkLens, _super);
            function cWordCloudNetworkLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cWordCloudNetworkLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2; //Math.SQRT2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 0;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._innerRadius = this._lens_circle_radius - 2;
                this._outterRadius = this._lens_circle_radius + 20;
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._chord = d3.layout.chord();
                this._color = d3.scale.category10();
                this._arc.innerRadius(this._innerRadius).outerRadius(this._outterRadius);
                this._pie.value(function (d) {
                    return d;
                }).sort(null).startAngle(-Math.PI * 8 / 3).endAngle(-Math.PI * 2 / 3);
                this._chord.padding(.05).sortSubgroups(d3.descending);
            }
            cWordCloudNetworkLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {text: size:}
            cWordCloudNetworkLens.prototype.ExtractData = function () {
                var data;
                data.forEach(function (d, i) {
                    d["group"] = (i % 3) + 1; //Math.ceil(Math.random()*3);
                });
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                    return d.Value;
                }));
                return data;
            };
            cWordCloudNetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var data = this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bound) {
                    _this.DrawCloud(words, bound);
                });
                this._cloud.start();
                var groups = [];
                for (var i = 0, len = data.length; i < len; ++i) {
                    if (groups[parseInt(data[i]['group']) - 1] != null) {
                        var group = parseInt(data[i]['group']);
                        groups[group - 1]++;
                    }
                    else {
                        groups[parseInt(data[i]['group']) - 1] = 0;
                    }
                }
                this._chord.matrix([
                    [2000, 2300, 2100],
                    [1951, 2100, 2000],
                    [2300, 2200, 2100]
                ]);
                this._lens_circle_svg.selectAll("path").data(this._chord.groups).enter().append("path").attr("fill", function (d, i) {
                    return _this._color(i + 1);
                }).attr("d", this._arc);
                this._lens_circle_svg.append("g").attr("class", "chord").selectAll("path").data(this._chord.chords).enter().append("path").attr("d", d3.svg.chord().radius(this._innerRadius)).style("fill", function (d, i) {
                    return _this._color(i + 1);
                }).style("opacity", 0.9).style("fill-opacity", 0.15);
            };
            cWordCloudNetworkLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var text = this._lens_circle_svg.selectAll("text").data(words, function (d) {
                    return d.text;
                }).enter().append("text");
                text.attr("text-anchor", "middle").style("font-size", function (d) {
                    return d.size + "px";
                }).style("font-weight", function (d) {
                    return d.weight;
                }).style("font-family", function (d) {
                    return d.font;
                }).style("fill", function (d, i) {
                    return _this._color(d.group);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            cWordCloudNetworkLens.Type = "cWordCloudNetworkLens";
            return cWordCloudNetworkLens;
        })(Lens.BaseCompositeLens);
        Lens.cWordCloudNetworkLens = cWordCloudNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cWordCloudPieLens = (function (_super) {
            __extends(cWordCloudPieLens, _super);
            function cWordCloudPieLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cWordCloudPieLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * Math.SQRT2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 1;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._cloud_text_color = d3.scale.category10();
                this._pie.value(function (d) {
                    return d.Value;
                }).sort(null);
                this._arc.innerRadius(function (d) {
                    return _this._lens_circle_radius;
                }).outerRadius(function (d) {
                    return _this._lens_circle_radius + 20;
                });
            }
            cWordCloudPieLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {Key: Value:}
            cWordCloudPieLens.prototype.ExtractData = function () {
                _super.prototype.ExtractData.call(this);
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(this._base_accessor_func(this._data), function (d) {
                    return d.Value;
                }));
            };
            cWordCloudPieLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._base_accessor_func(this._data)).filter(function (d) {
                    if (d.Value > 3)
                        return true;
                    return false;
                }).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.Value);
                }).on("end", function (words, bounds) {
                    _this.DrawCloud(words, bounds);
                });
                this._cloud.start();
                this._lens_circle_svg.selectAll(".innerPie").data(this._pie(this._sub_accessor_func(this._data))).enter().append("path").attr("d", this._arc).style("fill", function (d) {
                    return _this._cloud_text_color(d.data.Key);
                }).style("fill-rule", "evenodd");
            };
            cWordCloudPieLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var w = this._cloud_w;
                var h = this._cloud_h;
                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
                var text = this._lens_circle_svg.selectAll("text").data(words, function (d) {
                    return d.text;
                }).enter().append("text");
                text.attr("text-anchor", "middle").style("font-size", function (d) {
                    return d.size + "px";
                }).style("font-weight", function (d) {
                    return d.weight;
                }).style("font-family", function (d) {
                    return d.font;
                }).style("fill", function (d) {
                    return _this._cloud_text_color(d.Key);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            cWordCloudPieLens.Type = "cWordCloudPieLens";
            return cWordCloudPieLens;
        })(Lens.BaseCompositeLens);
        Lens.cWordCloudPieLens = cWordCloudPieLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cBaseMapLens = (function (_super) {
            __extends(cBaseMapLens, _super);
            function cBaseMapLens(element, type, manyLens, firstLens, secondLens) {
                _super.call(this, element, type, manyLens, firstLens, secondLens);
                this._projection = d3.geo.albersUsa();
                this._path = d3.geo.path();
                this._color = d3.scale.quantize();
                var mapLens;
                if (secondLens) {
                    mapLens = (firstLens.Type == "MapLens" ? firstLens : secondLens);
                }
                else {
                    mapLens = (firstLens);
                }
                this._projection = mapLens.Projection;
                this._path = mapLens.Path;
                this._color = mapLens.Color;
                this._map_data = mapLens.MapData;
            }
            Object.defineProperty(cBaseMapLens.prototype, "Projection", {
                get: function () {
                    return this._projection;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(cBaseMapLens.prototype, "Path", {
                get: function () {
                    return this._path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(cBaseMapLens.prototype, "Color", {
                get: function () {
                    return this._color;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(cBaseMapLens.prototype, "MapData", {
                get: function () {
                    return this._map_data;
                },
                enumerable: true,
                configurable: true
            });
            cBaseMapLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cBaseMapLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.states).features).enter().append("path").attr("d", this._path).attr("fill", function (d, i) {
                    return _this._map_data.color[i];
                }).on("click", function (d) {
                    if (!d3.event.defaultPrevented)
                        _this.ClickedMap(d);
                });
                this._lens_circle_svg.append("g").attr("id", "state-borders").append("path").datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.states, function (a, b) {
                    return a !== b;
                })).attr("d", this._path);
            };
            cBaseMapLens.prototype.ClickedMap = function (d) {
                var _this = this;
                if (d3.event.defaultPrevented)
                    return;
                var x, y, k;
                if (d && this._centered_state !== d) {
                    var centroid = this._path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    this._centered_state = d;
                    this._lens_circle_zoom.on("zoom", null);
                    this._lens_circle_drag.on("dragstart", null).on("drag", null).on("dragend", null);
                    this._element.on("click", function () {
                        _this.ClickedMap(_this._centered_state);
                    });
                }
                else {
                    x = 0;
                    y = 0;
                    k = this._lens_circle_scale;
                    this._centered_state = null;
                    this._lens_circle_drag.on("dragstart", function () {
                        _this.LensCircleDragstartFunc();
                    }).on("drag", function () {
                        _this.LensCircleDragFunc();
                    }).on("dragend", function () {
                        _this.LensCircleDragendFunc();
                    });
                    this._lens_circle_zoom.scale(this._lens_circle_scale).on("zoom", function () {
                        _this.LensCircleZoomFunc();
                    });
                    this._element.on("click", null);
                }
                this._lens_circle_svg.selectAll("path").classed("active", this._centered_state && (function (d) {
                    return d === _this._centered_state;
                }));
                this._lens_circle_svg.transition().duration(750).attr("transform", function (d) {
                    return "translate(" + _this._lens_circle_cx + "," + _this._lens_circle_cy + ")scale(" + k + ")translate(" + [-x, -y] + ")";
                }).style("stroke-width", 1.5 / k + "px");
                d3.event.stopPropagation();
            };
            cBaseMapLens.Type = "cBaseMapLens";
            return cBaseMapLens;
        })(Lens.BaseCompositeLens);
        Lens.cBaseMapLens = cBaseMapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cMapBarLens = (function (_super) {
            __extends(cMapBarLens, _super);
            function cMapBarLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cMapBarLens.Type, manyLens, firstLens, secondLens);
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie_color = d3.scale.category20();
                this._pie.value(function (d) {
                    return d;
                }).sort(null);
                this._arc.innerRadius(function (d) {
                    return _this._lens_circle_radius;
                }).outerRadius(function (d) {
                    return _this._lens_circle_radius + 20;
                });
            }
            cMapBarLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {text: size:}
            cMapBarLens.prototype.ExtractData = function () {
                var data = d3.range(6).map(function () {
                    return Math.random() * 60;
                });
                return data;
            };
            cMapBarLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var barData = this.ExtractData();
                this._lens_circle_svg.selectAll(".innerPie").data(this._pie(barData)).enter().append("path").attr("d", this._arc).style("fill", function (d, i) {
                    return _this._pie_color(i);
                }).style("fill-rule", "evenodd");
            };
            cMapBarLens.Type = "cMapBarLens";
            return cMapBarLens;
        })(Lens.cBaseMapLens);
        Lens.cMapBarLens = cMapBarLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cMapLens = (function (_super) {
            __extends(cMapLens, _super);
            function cMapLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cMapLens.Type, manyLens, firstLens, secondLens);
            }
            cMapLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cMapLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
            };
            cMapLens.Type = "cMapLens";
            return cMapLens;
        })(Lens.cBaseMapLens);
        Lens.cMapLens = cMapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cMapNetworkLens = (function (_super) {
            __extends(cMapNetworkLens, _super);
            function cMapNetworkLens(element, manyLens, firstLens, secondLens) {
                var _this = this;
                _super.call(this, element, cMapNetworkLens.Type, manyLens, firstLens, secondLens);
                this._link = d3.svg.diagonal();
                this._link.source(function (d) {
                    var t = _this._projection(d.coordinates[0]);
                    return {
                        x: t[0],
                        y: t[1]
                    };
                }).target(function (d) {
                    var t = _this._projection(d.coordinates[1]);
                    return {
                        x: t[0],
                        y: t[1]
                    };
                });
            }
            cMapNetworkLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {text: size:}
            cMapNetworkLens.prototype.ExtractData = function () {
                var data = [
                    [38.991621, -76.852587],
                    [28.524963, -80.650813],
                    [34.200463, -118.176008],
                    [34.613714, -118.076790],
                    [41.415891, -81.861774],
                    [34.646554, -86.674368],
                    [37.409574, -122.064292],
                    [37.092123, -76.376230],
                    [29.551508, -95.092256],
                    [30.363692, -89.600036]
                ];
                var links = [];
                for (var i = 0, len = data.length + 5; i < len; i++) {
                    if (i >= data.length - 1) {
                        var index = Math.ceil(Math.random() * (data.length - 1));
                        var nextIndex = Math.ceil(Math.random() * (data.length - 1));
                        links.push({
                            type: "LineString",
                            coordinates: [
                                [data[index][1], data[index][0]],
                                [data[nextIndex][1], data[nextIndex][0]]
                            ]
                        });
                    }
                    else {
                        links.push({
                            type: "LineString",
                            coordinates: [
                                [data[i][1], data[i][0]],
                                [data[i + 1][1], data[i + 1][0]]
                            ]
                        });
                    }
                }
                return links;
            };
            cMapNetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var networkData = this.ExtractData();
                var networkG = this._lens_circle_svg.append("g").attr("id", "network");
                var pathArcs = networkG.selectAll(".cMapPath").data(networkData);
                pathArcs.enter().append("path").attr("class", "cMapPath").style({
                    "fill": "none"
                });
                var networkNode = networkG.selectAll(".cMapNode").data(networkData).enter().append("circle").attr("class", "cMapNode").attr("cx", function (d) {
                    return _this._projection(d.coordinates[0])[0];
                }).attr("cy", function (d) {
                    return _this._projection(d.coordinates[0])[1];
                }).attr("r", 4).style({
                    "stroke": "steelblue",
                    "fill": "#fff",
                    "stroke-width": 1.5
                });
                //update
                pathArcs.attr('d', function (d) {
                    return _this._link(d);
                }).attr("stroke-dasharray", function (d) {
                    var totalLen = d3.select(this).node().getTotalLength();
                    return totalLen + "," + totalLen;
                }).attr("stroke-dashoffset", function (d) {
                    var totalLen = d3.select(this).node().getTotalLength();
                    return totalLen;
                }).style({
                    "stroke": "#d73027",
                    "stroke-width": "1.2px"
                }).transition().duration(2000).attr("stroke-dashoffset", 0);
                ;
                //exit
                pathArcs.exit().remove();
            };
            cMapNetworkLens.Type = "cMapNetworkLens";
            return cMapNetworkLens;
        })(Lens.cBaseMapLens);
        Lens.cMapNetworkLens = cMapNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var cMapWordCloudLens = (function (_super) {
            __extends(cMapWordCloudLens, _super);
            function cMapWordCloudLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cMapWordCloudLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2; //Math.SQRT2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 0;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._text_color = d3.scale.ordinal().domain([1, 2]).range(["#d62728", "#ff7f0e"]);
            }
            cMapWordCloudLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            // data shape {text: size:}
            cMapWordCloudLens.prototype.ExtractData = function () {
                var _this = this;
                var data;
                data = [
                    { Key: "lxzcvk", Value: 7 },
                    { Key: "tyu", Value: 7 },
                ];
                data.forEach(function (d, i) {
                    d.Value -= 3;
                    d["group"] = (i % 2) + 1;
                    d["coordinates"] = d["group"] == 1 ? _this._projection([-86.674368, 34.646554]) : _this._projection([-118.176008, 34.200463]);
                });
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(data, function (d) {
                    return d.Value;
                }));
                return data;
            };
            cMapWordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var barData = this.ExtractData();
                var data = this.ExtractData();
                this._cloud.size([this._cloud_w, this._cloud_h]).words(data).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bound) {
                    _this.DrawCloud(words, bound);
                });
                this._cloud.start();
            };
            cMapWordCloudLens.prototype.DrawCloud = function (words, bounds) {
                var _this = this;
                var text = this._lens_circle_svg.selectAll("text").data(words, function (d) {
                    return d.text;
                }).enter().append("text");
                text.attr("text-anchor", "middle").style("font-size", function (d) {
                    return d.size + "px";
                }).style("font-weight", function (d) {
                    return d.weight;
                }).style("font-family", function (d) {
                    return d.font;
                }).style("fill", function (d, i) {
                    return _this._text_color(d.group);
                }).style("opacity", 1e-6).attr("text-anchor", "middle").attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                }).text(function (d) {
                    return d.text;
                }).transition().duration(200).style("opacity", 1);
            };
            cMapWordCloudLens.Type = "cMapWordCloudLens";
            return cMapWordCloudLens;
        })(Lens.cBaseMapLens);
        Lens.cMapWordCloudLens = cMapWordCloudLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
/*--------------- Single Lens  ----------------*/
///<reference path = "../Lens/BarChartLens.ts" />
///<reference path = "../Lens/MapLens.ts" />
///<reference path = "../Lens/NetworkLens.ts" />
///<reference path = "../Lens/PieChartLens.ts" />
///<reference path = "../Lens/TreeNetworkLens.ts"  />
///<reference path = "../Lens/WordCloudLens.ts"/>
/*------------ CompositeLens Lens -------------*/
///<reference path = "../Lens/cBoundleLens.ts" />
///<reference path = "../Lens/cChordDiagramLens.ts" />
///<reference path = "../Lens/cPieChartLens.ts" />
///<reference path = "../Lens/cSunBrustLens.ts" />
///<reference path = "../Lens/cTreeNetworkLens.ts" />
///<reference path = "../Lens/cWordCloudLens.ts" />
///<reference path = "../Lens/cWordCloudNetworkLens.ts" />
///<reference path = "../Lens/cWordCloudPieLens.ts" />
///<reference path = "../Lens/cBaseMapLens.ts" />
///<reference path = "../Lens/cMapBarLens.ts" />
///<reference path = "../Lens/cMapLens.ts" />
///<reference path = "../Lens/cMapNetworkLens.ts" />
///<reference path = "../Lens/cMapWordCloudLens.ts" />
(function () {
})();
///<reference path = "../D3ChartObject.ts" />
///<reference path = "../Lens/LensList.ts" />
///<reference path = "../tsScripts/Hub/Hub.ts" />
///<reference path="../tsScripts/Navigation/SideBarNavigation.ts" />
///<reference path = "../tsScripts/TweetsCurve/Cruve.ts" />
///<reference path = "../tsScripts/LensHistory/HistoryTree.ts" />
///<reference path = "../tsScripts/Pane/ClassicLensPane.ts" />
var ManyLens;
(function (_ManyLens) {
    var ManyLens = (function () {
        function ManyLens() {
            var _this = this;
            this._nav_sideBarView_id = "sidebar-nav";
            this._curveView_id = "curveView";
            this._mapSvg_id = "mapSvg";
            this._historyView_id = "historyView";
            this._historySvg_id = "historySvg";
            //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
            this._lens = new Map();
            this._lens_count = 0;
            /*--------------------------Initial all the hub------------------------------*/
            this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            /*------------------------Initial other Component--------------------------------*/
            this._mapSvg = d3.select("#" + this._mapSvg_id);
            this._mapArea = new _ManyLens.MapArea.SOMMap(this._mapSvg, this);
            this._mapArea.Render();
            this._curveView = d3.select("#" + this._curveView_id);
            this._curve = new _ManyLens.TweetsCurve.Curve(this._curveView, this);
            this._curve.Render();
            this._nav_sideBarView = d3.select("#" + this._nav_sideBarView_id);
            this._nav_sidebar = new _ManyLens.Navigation.SideBarNavigation(this._nav_sideBarView, "Attribute", this._mapSvg, this);
            this._nav_sidebar.BuildList(null);
            this._historySvg = d3.select("#" + this._historySvg_id);
            this._historyTrees = new _ManyLens.LensHistory.HistoryTrees(this._historySvg, this);
            //Add a new tree here, actually the tree should not be add here
            this._historyTrees.addTree();
            /*-------------------------Start the hub-------------------------------------------*/
            _ManyLens.Hub.SignalRHub.HubConnection.start().done(function () {
                console.log("start connection");
                if (ManyLens.TestMode) {
                    _this._nav_sidebar.FinishLoadData();
                }
                else {
                    _this._manyLens_hub.server.loadData().done(function () {
                        console.log("Load data success");
                        _this._nav_sidebar.FinishLoadData();
                    }).fail(function () {
                        console.log("load data fail");
                    });
                }
            });
        }
        Object.defineProperty(ManyLens.prototype, "LensCount", {
            get: function () {
                return this._lens_count;
            },
            enumerable: true,
            configurable: true
        });
        /* -------------------- Lens related Function -----------------------*/
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
        /* -------------------- Curve related Function -----------------------*/
        ManyLens.prototype.ManyLensHubRegisterClientFunction = function (obj, funcName, func) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            this._manyLens_hub.client[funcName] = function () {
                func.apply(obj, arguments);
            };
        };
        ManyLens.prototype.ManyLensHubServerPullPoint = function (start) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.server.pullPoint(start);
        };
        ManyLens.prototype.ManyLensHubServerTestPullPoint = function () {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.server.testPullPoint();
        };
        ManyLens.prototype.ManyLensHubServerPullInterval = function (id) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.server.pullInterval(id);
        };
        ManyLens.prototype.ManyLensHubServerTestPullInterval = function (id) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.server.testPullInterval(id);
        };
        ManyLens.TestMode = true;
        return ManyLens;
    })();
    _ManyLens.ManyLens = ManyLens;
})(ManyLens || (ManyLens = {}));
"use strict";
var manyLens;
document.addEventListener('DOMContentLoaded', function () {
    manyLens = new ManyLens.ManyLens();
});
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
                    {
                        if (firstLens.Type != ManyLens.Lens.cBoundleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        //  case Lens.cBoundleLens.Type + "_" + Lens.cBoundleLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudNetworkLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cWordCloudNetworkLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        // case Lens.cWordCloudNetworkLens.Type + "_" + Lens.cWordCloudNetworkLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.WordCloudLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                        return new ManyLens.Lens.cWordCloudPieLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cWordCloudPieLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        //   case Lens.cWordCloudPieLens.Type + "_" + Lens.cWordCloudPieLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cSunBrustLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cSunBrustLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        // case Lens.cSunBrustLens.Type + "_" + Lens.cSunBrustLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cChordDiagramLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cChordDiagramLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        // case Lens.cChordDiagramLens.Type + "_" + Lens.cChordDiagramLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapNetworkLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cMapNetworkLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        //  case Lens.cMapNetworkLens.Type + "_" + Lens.cMapNetworkLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapBarLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapBarLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cMapBarLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cMapBarLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cMapBarLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapBarLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        //  case Lens.cMapBarLens.Type + "_" + Lens.cMapBarLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapWordCloudLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cMapWordCloudLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        //    case Lens.cMapWordCloudLens.Type + "_" + Lens.cMapWordCloudLens.Type: {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cTreeNetworkLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cPieChartLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapLens(element, manyLens, firstLens, secondLens);
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
                            return new ManyLens.Lens.cTreeNetworkLens(element, manyLens, cLens);
                        }
                    case ManyLens.Lens.PieChartLens.Type:
                        {
                            return new ManyLens.Lens.cPieChartLens(element, manyLens, cLens);
                        }
                    case ManyLens.Lens.MapLens.Type:
                        {
                            return new ManyLens.Lens.cMapLens(element, manyLens, cLens);
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
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        var SOMMap = (function (_super) {
            __extends(SOMMap, _super);
            function SOMMap(element, manyLens) {
                _super.call(this, element, manyLens);
                // private _lensPane: Pane.ClassicLensPane;
                this._colorPalettes = ["rgb(99,133,255)", "rgb(98,252,250)", "rgb(99,255,127)", "rgb(241,255,99)", "rgb(255,187,99)", "rgb(255,110,99)", "rgb(255,110,99)"];
                // this._lensPane = new Pane.ClassicLensPane(element, manyLens);
                this._element.attr("height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });
                this._manyLens.ManyLensHubRegisterClientFunction(this, "showVis", this.ShowVis);
            }
            SOMMap.prototype.Render = function () {
                //this._lensPane.Render();
            };
            SOMMap.prototype.ShowVis = function (visData) {
                var _this = this;
                var deviation = d3.deviation(visData.unitsData, function (d) {
                    return d.count;
                });
                var mean = d3.mean(visData.unitsData, function (d) {
                    return d.count;
                });
                var median = d3.median(visData.unitsData, function (d) {
                    return d.count;
                });
                var oneDeviationMin = (mean - deviation) > 0 ? (mean - deviation) : 0;
                var twoDeviationMax = (mean + 2 * deviation);
                var oneDeviationMax = (mean + deviation);
                var scale = d3.scale.quantize().domain([oneDeviationMin, oneDeviationMax]).range([1, 2, 3]);
                var data0 = [];
                visData.unitsData.forEach(function (d) {
                    if (d.count > twoDeviationMax) {
                        d.colorIndex = 5;
                    }
                    else if (d.count > oneDeviationMax) {
                        d.colorIndex = 4;
                    }
                    else if (d.count < oneDeviationMin || d.count < median) {
                        d.colorIndex = 0;
                    }
                    else {
                        d.colorIndex = scale(d.count);
                    }
                    if (data0[d.colorIndex] == null) {
                        data0[d.colorIndex] = [d.count];
                    }
                    else {
                        data0[d.colorIndex].push(d.count);
                    }
                });
                console.log(visData.min, visData.max);
                console.log(d3.deviation(visData.unitsData, function (d) {
                    return d.count;
                }));
                console.log(d3.mean(visData.unitsData, function (d) {
                    return d.count;
                }));
                console.log(d3.median(visData.unitsData, function (d) {
                    return d.count;
                }));
                console.log(data0);
                var somMapWidth = 300.0;
                var somMapHeight = 300.0;
                var xPadding = somMapWidth / (visData.width + 1);
                var yPadding = somMapHeight / (visData.height + 1);
                var svg = this._element.append("g").data([{ mapID: visData.mapID, width: visData.width, height: visData.height, xPadding: xPadding, yPadding: yPadding }]).attr("id", function (d) {
                    return "mapSvg" + d.mapID;
                }).attr("width", somMapWidth).attr("height", somMapHeight);
                svg.append("g").attr("class", "units").selectAll("rect").data(visData.unitsData).enter().append("rect").attr("class", "unit").attr("x", function (d, i) {
                    return 100 + d.x * 20;
                }).attr("y", function (d, i) {
                    return 100 + d.y * 20;
                }).attr({
                    width: 20,
                    height: 20
                }).attr("fill", function (d) {
                    //var interpalote = d3.interpolateRgb(this._colorPalettes[d.colorIndex], this._colorPalettes[d.colorIndex+1]);
                    //var extent = d3.extent<number>(data0[d.colorIndex]);
                    //return interpalote((d.count - extent[0]) / (extent[1] - extent[0]));
                    var colorScale = d3.scale.linear().domain(d3.extent(data0[d.colorIndex])).range([_this._colorPalettes[d.colorIndex], _this._colorPalettes[d.colorIndex + 1]]);
                    return colorScale(d.count);
                });
            };
            return SOMMap;
        })(ManyLens.D3ChartObject);
        MapArea.SOMMap = SOMMap;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../Lens/LensList.ts" />
//# sourceMappingURL=ManyLens.js.map