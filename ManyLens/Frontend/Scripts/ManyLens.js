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
                this.connection = $.hubConnection();
                this.proxy = this.connection.createHubProxy("manyLensHub");
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
                this._reorganizeIntervalBtn = $("#intervals-organize-switch").on("switchChange.bootstrapSwitch", function (event, state) {
                    _this._manyLens.ManyLensHubServerReOrganizePeak(state);
                });
                this._launchDataBtn = this._element.select("#curve-btns").append("button").attr({
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
                this._manyLens.ManyLensHubRegisterClientFunction(this, "enableReorganizeIntervalBtn", this.EnableReorganizeIntervalBtn);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "disableReorganizeIntervalBtn", this.DisableReorganizeIntervalBtn);
            }
            SideBarNavigation.prototype.DemoData = function () {
                var data = {
                    name: "root",
                    icon: null,
                    children: [
                        {
                            name: "Tweet Length",
                            icon: "fui-html5",
                            children: [
                                {
                                    name: "Pie Chart",
                                    attributeName: "Tweet Length",
                                    lensConstructFunc: ManyLens.Lens.PieChartLens,
                                    extractDataFunc: new ManyLens.Lens.ExtractDataFunc("tweetLengthDistribute")
                                }
                            ]
                        },
                        {
                            name: "Hashtag Count",
                            icon: "fui-html5",
                            children: [
                                {
                                    name: "Pie Chart",
                                    attributeName: "Hashtag Count",
                                    lensConstructFunc: ManyLens.Lens.PieChartLens,
                                    extractDataFunc: new ManyLens.Lens.ExtractDataFunc("hashTagsDistribute")
                                },
                                {
                                    name: "Words Cloud",
                                    attributeName: "Hashtag Count",
                                    lensConstructFunc: ManyLens.Lens.WordCloudLens,
                                    extractDataFunc: new ManyLens.Lens.ExtractDataFunc("hashTagsDistribute")
                                }
                            ]
                        },
                        {
                            name: "Keywords",
                            icon: "fui-foursquare",
                            children: [
                                {
                                    name: "Words Cloud",
                                    attributeName: "Keywords",
                                    lensConstructFunc: ManyLens.Lens.WordCloudLens,
                                    extractDataFunc: new ManyLens.Lens.ExtractDataFunc("keywordsDistribute")
                                }
                            ]
                        },
                        {
                            name: "Retweet Network",
                            icon: "fui-windows-8",
                            children: [
                                {
                                    name: "Network",
                                    attributeName: "Retweet Network",
                                    lensConstructFunc: ManyLens.Lens.NetworkLens,
                                    extractDataFunc: new ManyLens.Lens.ExtractDataFunc("retweetNetwork")
                                }
                            ]
                        },
                        {
                            name: "Tweets Count",
                            icon: "fui-mail",
                            children: [
                                {
                                    name: "Map",
                                    attributeName: "Tweets Count",
                                    lensConstructFunc: ManyLens.Lens.MapLens,
                                    extractDataFunc: new ManyLens.Lens.ExtractDataFunc("tweetsLocationDistribute")
                                }
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
                            var lens = new d.lensConstructFunc(_this._map_Svg, d.attributeName, _this._manyLens);
                            lens.DataAccesser(d.extractDataFunc).Render("red");
                        });
                    }
                }
            };
            SideBarNavigation.prototype.FinishLoadData = function () {
                this._isLoaded = true;
                this._launchDataBtn.classed("disabled", false);
            };
            SideBarNavigation.prototype.EnableReorganizeIntervalBtn = function () {
                this._reorganizeIntervalBtn.bootstrapSwitch("disabled", false);
            };
            SideBarNavigation.prototype.DisableReorganizeIntervalBtn = function () {
                this._reorganizeIntervalBtn.bootstrapSwitch("disabled", true);
            };
            SideBarNavigation.prototype.PullData = function () {
                var _this = this;
                if (ManyLens.ManyLens.TestMode) {
                    this._manyLens.ManyLensHubServerTestPullPoint().done(function () {
                        _this._launchDataBtn.classed("disabled", false);
                    });
                }
                else {
                    this._manyLens.ManyLensHubServerPullPoint("0").done(function (d) {
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
///<reference path = "../Scripts/typings/d3.fisheye/d3.fisheye.d.ts" />
///<reference path = "../Scripts/typings/d3/plugins/d3.superformula.d.ts" />
///<reference path = "../Scripts/typings/jquery/jquery.d.ts" />
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
                this._fisheye_scale = d3.fisheye.ordinal();
                this._sub_view_x_scale = d3.scale.linear();
                this._sub_view_y_scale = d3.scale.linear();
                this._section_num = 30;
                this._view_top_padding = 15;
                this._view_botton_padding = 5;
                this._view_left_padding = 50;
                this._view_right_padding = 50;
                this._coordinate_margin_left = 400;
                this._stack_time_id_gen = 0;
                this._stack_bar_width = 15;
                this.week_days_name = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fir.", "Sat."];
                this.month_names = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
                this._data = new Array();
                this._intervals = new Array();
                this._stack_time = new Array();
                this._stack_bar_nodes = new Array();
                this._view_height = parseFloat(this._element.style("height")) - 30;
                this._view_width = parseFloat(this._element.style("width"));
                this._sub_view_height = this._view_height - this._view_botton_padding;
                this._sub_view_width = this._coordinate_margin_left + this._view_left_padding;
                this._x_scale.domain([0, this._section_num]).range([this._view_left_padding + this._coordinate_margin_left, this._view_width - this._view_right_padding]);
                this._y_scale.domain([0, 20]).range([this._view_height - this._view_botton_padding, this._view_top_padding]);
                this._x_axis_gen.scale(this._x_scale).ticks(0).orient("bottom");
                this._y_axis_gen.scale(this._y_scale).ticks(2).orient("left");
                this._fisheye_scale.rangeRoundBands([0, this._sub_view_width]).focus(this._coordinate_margin_left + this._view_left_padding);
                this._time_formater = d3.time.format("%Y%m%d%H%M%S");
                this._root = {
                    id: "root",
                    name: "",
                    type: "null",
                    date: null,
                    parent: null,
                    children: []
                };
                this._stack_bar_tree = d3.layout.tree().size([this._sub_view_width - 50, this._sub_view_height - 20]);
                this._stack_bar_tree_diagonal = d3.svg.diagonal();
                this._sub_view_x_scale.range([this._view_left_padding, this._view_left_padding + this._coordinate_margin_left]);
                this._sub_view_y_scale.range([this._view_height - this._view_botton_padding, this._view_top_padding]);
                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction(this, "addPoint", this.AddPoint);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "clusterInterval", this.ClusterInterval);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "timeInterval", this.TimeInterval);
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
            Object.defineProperty(Curve.prototype, "StackID", {
                get: function () {
                    return "id" + this._stack_time_id_gen++;
                },
                enumerable: true,
                configurable: true
            });
            Curve.prototype.Render = function () {
                _super.prototype.Render.call(this, null);
                var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
                this._element.select(".progress").style("display", "none");
                this._curveSvg = this._element.insert("svg", ":first-child").attr("width", this._view_width).attr("height", this._view_height).style("margin-bottom", "17px");
                this._curveSvg.append("defs").append("clipPath").attr("id", "stackRectClip").append("rect").attr("width", this._coordinate_margin_left + this._view_left_padding).attr("height", this._view_height - this._view_botton_padding).attr("x", 0).attr("y", 0);
                this._subView = this._curveSvg.append("g").attr("clip-path", "url(#stackRectClip)").append("g").attr("id", "curve.subView").attr("transform", "translate(0,-20)");
                this._curveSvg.append("defs").append("clipPath").attr("id", "curveClip").append("rect").attr("width", coordinate_view_width).attr("height", this._view_height - this._view_botton_padding).attr("x", this._view_left_padding + this._coordinate_margin_left).attr("y", 0);
                this._mainView = this._curveSvg.append("g").attr("clip-path", "url(#curveClip)").append("g").attr("id", "curve.mainView");
                this._x_axis = this._curveSvg.append("g").attr("class", "curve x axis").attr("transform", "translate(" + [0, (this._view_height - this._view_botton_padding)] + ")").call(this._x_axis_gen);
                this._y_axis = this._curveSvg.append("g").attr("class", "curve y axis").attr("transform", "translate(" + (this._coordinate_margin_left + this._view_left_padding) + ",0)").call(this._y_axis_gen);
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
                this.RefreshGraph(point);
                if (this._data.length > this._section_num + 1) {
                    this._data.shift();
                }
            };
            Curve.prototype.InserNode = function (name, data) {
                var node = this._root[name], i;
                if (!node) {
                    node = this._root[name] = data || {
                        id: this.StackID,
                        date: null,
                        name: "",
                        parent: null,
                        children: [],
                        type: name
                    };
                    if (name.length) {
                        node.parent = this.InserNode(name.substring(0, i = name.lastIndexOf("-")));
                        node.parent.children.push(node);
                        node.name = name.substring(i + 1);
                    }
                }
                return node;
            };
            Curve.prototype.Toggle = function (d) {
                if (d == null)
                    return;
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                }
                else {
                    d.children = d._children;
                    d._children = null;
                }
            };
            Curve.prototype.FindMinCoParent = function (a, b) {
                if (!a || !b)
                    return null;
                if (!a.parent || !b.parent)
                    return null;
                if (a.parent.id == b.parent.id) {
                    if (!a.date)
                        return a;
                    else
                        return null;
                }
                return this.FindMinCoParent(a.parent, b.parent);
            };
            Curve.prototype.Update = function (exitParent, mode) {
                var _this = this;
                if (mode === void 0) { mode = true; }
                var duration = 500;
                //Nodes
                var nodex = this._stack_bar_tree.nodes(this._root[""]).filter(function (d) {
                    return d.name != "";
                });
                this._stack_bar_node = this._subView.selectAll(".stack.node").data(nodex, function (d) {
                    return d.id;
                });
                //Enter node
                var enterNode = this._stack_bar_node.enter().append("g").attr("class", "stack node").attr("transform", function (d) {
                    if (d.date && mode)
                        return "translate(" + [_this._sub_view_width - 10, _this._sub_view_height - 10] + ")";
                    if (!d.parent)
                        return "translate(" + [d.x, d.y + 5] + ")";
                    return "translate(" + [d.parent.x, d.parent.y] + ")";
                });
                enterNode.filter(function (d) {
                    return d.parent;
                }).transition().delay(duration * 0.5).duration(duration).attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                });
                enterNode.append("path").attr("d", function (d) {
                    if (d.date && mode)
                        return d3.superformula().type("rectangle").size(1000)(d);
                    return d3.superformula().type("circle").size(50)(d);
                }).attr("transform", function (d) {
                    if (d.date && mode)
                        return "scale(1,5)";
                }).on("click", function (d) {
                    if (d.date) {
                        _this.SelectSegment(d);
                    }
                    else {
                        _this.Toggle(d);
                        _this.Update(d, false);
                    }
                }).transition().delay(duration * 0.5).duration(duration).attr("transform", null).attr("d", d3.superformula().type("circle").size(50));
                enterNode.append("text").attr("x", function (d) {
                    return d.children || d._children ? -10 : 10;
                }).attr("dy", ".35em").attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                }).text(function (d) {
                    if (d.name[0] == "y") {
                        return d.name.substring(4);
                    }
                    else if (d.name[0] == "d") {
                        return _this.week_days_name[parseInt(d.name[d.name.length - 1])];
                    }
                    else if (d.name[0] == "m") {
                        return _this.month_names[parseInt(d.name[d.name.length - 1])];
                    }
                    return d.name;
                }).style("fill-opacity", 1e-6).transition().delay(duration * 0.5).duration(duration).style("fill-opacity", 1);
                ;
                //Update node
                var colorScale = d3.scale.linear().domain([1, 8]).range(["#2574A9", "#2574A9"]);
                function sumLength(d) {
                    if (!d.children)
                        return 1;
                    var sum = 0;
                    d.children.forEach(function (d) {
                        sum += sumLength(d);
                    });
                    return sum;
                }
                this._stack_bar_node.transition().duration(duration).attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                });
                this._stack_bar_node.selectAll("path").filter(function (d) {
                    return d.children;
                }).style("fill", function (d) {
                    return colorScale(sumLength(d));
                });
                //Exit node
                var exitNode = this._stack_bar_node.exit().transition().duration(duration).attr("transform", function (d) {
                    if (exitParent) {
                        d.x = exitParent.x;
                        d.y = exitParent.y;
                    }
                    return "translate(" + [d.x, d.y] + ")";
                }).remove();
                exitNode.select("circle").transition().attr("r", 1e-6);
                exitNode.select("text").transition().style("fill-opacity", 1e-6);
                //Links
                this._stack_bar_link = this._subView.selectAll(".stack.link").data(this._stack_bar_tree.links(nodex), function (d) {
                    return d.source.id + "-" + d.target.id;
                });
                //Enter link
                this._stack_bar_link.enter().insert("path", ".stack.node").attr("class", "stack link").attr("d", function (d) {
                    var o = { x: d.source.x, y: d.source.y };
                    var result = _this._stack_bar_tree_diagonal({ source: o, target: o });
                    return result;
                }).transition().delay(duration * 0.5).duration(duration).attr("d", this._stack_bar_tree_diagonal);
                //Update link
                this._stack_bar_link.transition().duration(duration).attr("d", this._stack_bar_tree_diagonal);
                //Exit link
                this._stack_bar_link.exit().transition().duration(duration).attr("d", function (d) {
                    if (exitParent) {
                        d.x = exitParent.x;
                        d.y = exitParent.y;
                    }
                    var o = { x: d.x, y: d.y };
                    return _this._stack_bar_tree_diagonal({ source: o, target: o });
                }).remove();
            };
            Curve.prototype.RefreshGraph = function (point) {
                var _this = this;
                //Refresh the stack rect view
                if (this._data[0].type == 1 || this._data[0].type == 3) {
                    //The stack date
                    var date = this._time_formater.parse(this._data[0].beg);
                    //var stackRect: StackDate = {
                    //    id: this._data[0].beg,
                    //    x: this._stack_time.length * this._stack_bar_width,
                    //    ox: this._stack_time.length * this._stack_bar_width,
                    //    type: 0,
                    //    index: date.getDay(),
                    //    isRemove: false,
                    //    fill: null,
                    //    date:date,
                    //    intervals: null
                    //}
                    //this._intervals.push( stackRect );
                    var stackNode = {
                        id: this._data[0].beg,
                        date: date,
                        size: 1,
                        name: "H" + date.getHours(),
                        parent: null,
                        children: null,
                        type: "" + "-year" + date.getFullYear() + "-mounth" + date.getMonth() + "-week" + this.GetWeek(date) + "-day" + date.getDay() + "-hour" + date.getHours(),
                        index: date.getDay()
                    };
                    this.InserNode(stackNode.type, stackNode);
                    var exitParent = this.FindMinCoParent(this._stack_bar_nodes[this._stack_bar_nodes.length - 1], stackNode);
                    this.Toggle(exitParent);
                    this._stack_bar_nodes.push(stackNode);
                    this.Update(exitParent);
                }
                //Refresh the curve view
                this._y_scale.domain([0, d3.max([
                    d3.max(this._data, function (d) {
                        return d.trueValue;
                    }),
                    d3.max(this._data, function (d) {
                        return d.value;
                    })
                ])]);
                this._y_axis_gen.scale(this._y_scale);
                this._y_axis.call(this._y_axis_gen);
                var restPathData = [];
                var nodesData = [];
                var sectionData = new Array();
                var i = 0, len = this._data.length;
                while (i < len) {
                    if (this._data[i].beg) {
                        var section = {
                            id: this._data[i].beg,
                            beg: i,
                            end: 0,
                            pathPoints: [
                                { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue }
                            ]
                        };
                        nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });
                        while (this._data[++i] && this._data[i].beg == section.id) {
                            section.pathPoints.push({ index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                            nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });
                        }
                        if (this._data[i] && this._data[i].type == 3) {
                            section.end = i;
                            section.pathPoints.push({ index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                        }
                        else if (this._data[i] && this._data[i].type == 1) {
                            section.end = i - 1;
                            var sectionRestPath = [];
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value, trueValue: this._data[i - 1].trueValue });
                            sectionRestPath.push({ index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                            restPathData.push(sectionRestPath);
                        }
                        else {
                            section.end = i - 1;
                        }
                        sectionData.push(section);
                    }
                    else {
                        var sectionRestPath = [];
                        if (this._data[i - 1])
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value, trueValue: this._data[i - 1].trueValue });
                        sectionRestPath.push({ index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                        while (this._data[++i] && !this._data[i].beg) {
                            sectionRestPath.push({ index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                        }
                        if (this._data[i])
                            sectionRestPath.push({ index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                        restPathData.push(sectionRestPath);
                    }
                }
                //handle the seg rect
                var rects = this._mainView.selectAll(".curve.seg").data(sectionData);
                rects.attr("x", function (d, i) {
                    return _this._x_scale(d.beg);
                }).attr("width", function (d, i) {
                    return _this._x_scale(d.end) - _this._x_scale(d.beg);
                });
                rects.enter().append("rect").attr("x", function (d, i) {
                    return _this._x_scale(d.beg);
                }).attr("y", 0).attr("width", function (d, i) {
                    return _this._x_scale(d.end) - _this._x_scale(d.beg);
                }).attr("height", this._view_height + this._view_top_padding).attr("class", "curve seg").on("click", function (d) {
                    _this.SelectSegment(d);
                });
                rects.exit().remove();
                //var lineFunc = d3.svg.line()
                //    .x(( d, i ) => {
                //    return this._x_scale( d.index );
                //})
                //    .y(( d, i ) => {
                //    return this._y_scale( d.value );
                //})
                //    .interpolate( "linear" )
                //    ;
                var truelineFunc = d3.svg.line().x(function (d, i) {
                    return _this._x_scale(d.index);
                }).y(function (d, i) {
                    return _this._y_scale(d.trueValue);
                }).interpolate("basis");
                //var path = this._mainView.selectAll( ".curve.section.path" ).data( sectionData, function ( d ) { return d.id; });
                //path.attr( "d", function ( d ) {
                //    return lineFunc( d.pathPoints );
                //});
                //path
                //    .enter().append( "path" )
                //    .style( {
                //    'stroke': '#F6BB42',
                //    'stroke-width': 3,
                //    'fill': 'none'
                //})
                //    .attr( "d", function ( d ) { return lineFunc( d.pathPoints ); })
                //    .attr( "class", "curve section path" )
                //;
                //path.exit().remove();
                var truepath = this._mainView.selectAll(".curve.section.true.path").data(sectionData, function (d) {
                    return d.id;
                });
                truepath.attr("d", function (d) {
                    return truelineFunc(d.pathPoints);
                });
                truepath.enter().append("path").attr("d", function (d) {
                    return truelineFunc(d.pathPoints);
                }).attr("class", "curve section true path").transition();
                truepath.exit().remove();
                //var restPath = this._mainView.selectAll( ".curve.rest.path" ).data( restPathData );
                //restPath.attr( "d", function ( d ) {
                //    return lineFunc( d );
                //})
                //restPath
                //    .enter().append( "path" )
                //    .style( {
                //    'stroke': 'rgb(31, 145, 189)',
                //    'stroke-width': 3,
                //    'fill': 'none'
                //})
                //    .attr( "d", function ( d ) { return lineFunc( d ); })
                //    .attr( "class", "curve rest path" )
                //;
                //restPath.exit().remove();
                var trueRestPath = this._mainView.selectAll(".curve.rest.true.path").data(restPathData);
                trueRestPath.attr("d", function (d) {
                    return truelineFunc(d);
                });
                trueRestPath.enter().append("path").attr("d", function (d) {
                    return truelineFunc(d);
                }).attr("class", "curve rest true path");
                trueRestPath.exit().remove();
                //handle the seg node
                var nodes = this._mainView.selectAll(".curve.node").data(nodesData, function (d) {
                    return d.index;
                });
                nodes.attr("cx", function (d, i) {
                    return _this._x_scale(d.index);
                }).attr("cy", function (d) {
                    return _this._y_scale(d.value);
                });
                nodes.enter().append("circle").attr("class", "curve node").attr("cx", function (d, i) {
                    return _this._x_scale(d.index);
                }).attr("cy", function (d) {
                    return _this._y_scale(d.value);
                }).attr("r", function (d) {
                    return 3;
                });
                nodes.exit().remove();
                // move the main view
                if (this._data.length > (this._section_num + 1)) {
                    this._mainView.attr("transform", null).transition().duration(80).ease("linear").attr("transform", "translate(" + (this._x_scale(0) - this._x_scale(1)) + ",0)");
                }
            };
            Curve.prototype.SelectSegment = function (d) {
                if (d['end'] == -1) {
                    console.log("Segmentation hasn't finished yet!");
                }
                else if (d['end'] != null && d['end'] != -1) {
                    this._curveSvg.style("margin-bottom", "0px");
                    this._element.select(".progress").style("display", "block");
                    this.PullInterval(d.id);
                }
                else if (d['end'] == null) {
                    this._curveSvg.style("margin-bottom", "0px");
                    this._element.select(".progress").style("display", "block");
                    this.PullInterval(d.id);
                }
            };
            Curve.prototype.GetWeek = function (date) {
                var d = new Date(+date);
                d.setHours(0, 0, 0);
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                return Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 8.64e7) + 1) / 7);
            };
            Curve.prototype.ShrinkStackRect = function (filterX) {
                if (filterX === void 0) { filterX = -1; }
                if (this._subView) {
                    this._subView.selectAll("rect.stack.rect").transition().attr("x", function (d) {
                        return d.ox;
                    }).remove();
                    this._subView.select("g.stack.rect.group").remove();
                    this._subView.selectAll("rect.stack.organize").style("visibility", function (d) {
                        if (d.x != filterX)
                            return "visible";
                        return "hidden";
                    }).transition().attr("x", function (d) {
                        return d.x = d.ox;
                    }).attr("width", this._stack_bar_width);
                    this._subView.on("mousemove", null);
                }
            };
            Curve.prototype.StackBarByTime = function (date, depth, intervals, stack_time_right) {
                var _this = this;
                if (stack_time_right === void 0) { stack_time_right = null; }
                var num;
                var newDate;
                switch (depth) {
                    case 0:
                        {
                            stack_time_right = new Array();
                            newDate = intervals[0];
                        }
                        break;
                    case 1:
                        num = this.GetWeek(date);
                        break;
                    case 2:
                        num = date.getMonth();
                        break;
                    default: num = -1;
                }
                if (depth != 0) {
                    newDate = {
                        id: this.StackID,
                        type: depth,
                        index: num,
                        isRemove: false,
                        x: this._stack_time.length * this._stack_bar_width,
                        ox: this._stack_time.length * this._stack_bar_width,
                        fill: null,
                        date: date,
                        intervals: intervals
                    };
                }
                var colorScale = d3.scale.ordinal().domain([0, 1, 2]).range(["#2A9CC8", "#2574A9", "#34495E"]);
                stack_time_right.push(newDate);
                var tempStackDate = [].concat(this._stack_time, stack_time_right.reverse()).sort(function (a, b) {
                    return (a.x > b.x) ? 1 : -1;
                });
                var stack_time_bar = this._subView.selectAll("rect.stack.organize.time").data(tempStackDate, function (d) {
                    return d.id;
                });
                var self = this;
                stack_time_bar.transition().attr("x", function (d, i) {
                    d.x = d.ox = i * _this._stack_bar_width;
                    return d.x;
                }).style("fill", function (d) {
                    return d.fill;
                });
                stack_time_bar.enter().append("rect").attr("x", function (d) {
                    if (depth == 0)
                        return _this._coordinate_margin_left + _this._view_left_padding;
                    return d.x;
                }).attr({
                    "class": "stack organize time",
                    width: this._stack_bar_width,
                    height: 50,
                    y: this._view_height + this._view_top_padding - 50
                }).style({
                    stroke: "#fff",
                    "stroke-width": 0.5
                }).style("fill", function (d) {
                    if (d.type == 0) {
                        return colorScale(d.type);
                    }
                    return colorScale(d.type - 1);
                }).on("dblclick", function (d, i) {
                    d3.select(this).style("visibility", "hidden");
                    self.ExpandStackDate(d);
                }).transition().style("fill", function (d) {
                    return d.fill = colorScale(d.type);
                }).attr("x", function (d) {
                    return d.x;
                });
                stack_time_bar.exit().filter(function (d) {
                    return !d.isRemove;
                }).transition().attr("x", function (d) {
                    d.isRemove = true;
                    return d.x;
                }).remove();
                var last_time_bar = this._stack_time.pop();
                if (last_time_bar) {
                    if (last_time_bar.type == newDate.type && last_time_bar.index != newDate.index) {
                        var newStack = [];
                        newStack.push(last_time_bar);
                        while (this._stack_time.length > 0) {
                            var tempDate = this._stack_time.pop();
                            if (tempDate.type == last_time_bar.type && tempDate.index == last_time_bar.index) {
                                newStack.push(tempDate);
                            }
                            else {
                                this._stack_time.push(tempDate);
                                break;
                            }
                        }
                        newStack.forEach(function (d) {
                            d.x = newStack[newStack.length - 1].x;
                        });
                        this.StackBarByTime(last_time_bar.date, ++depth, newStack, stack_time_right);
                    }
                    else {
                        this._stack_time.push(last_time_bar);
                    }
                }
                this._stack_time.push(newDate);
            };
            Curve.prototype.TimeInterval = function () {
                this.ShrinkStackRect();
                this._subView.selectAll("rect.stack.organize.content").transition().style("opacity", function (d) {
                    return 0;
                }).remove();
                var self = this;
                this._subView.selectAll("rect.stack.organize.time").data(this._stack_time).enter().append("rect").attr({
                    width: this._stack_bar_width,
                    "class": "stack organize time",
                    height: 50,
                    y: this._view_height + this._view_top_padding - 50
                }).style({
                    stroke: "#fff",
                    "stroke-width": 0.5
                }).attr("x", function (d) {
                    return d.x;
                }).style("fill", function (d) {
                    return d.fill;
                }).on("dblclick", function (d) {
                    d3.select(this).style("visibility", "hidden");
                    self.ExpandStackDate(d);
                });
            };
            Curve.prototype.ClusterInterval = function (intervalsInGroups) {
                var _this = this;
                this.ShrinkStackRect();
                this._subView.selectAll("rect.stack.organize.time").transition().style("opacity", function (d) {
                    return 0;
                }).remove();
                this._stack_content = new Map();
                intervalsInGroups.forEach(function (d, i) {
                    if (!_this._stack_content.has(d)) {
                        _this._stack_content.set(d, []);
                    }
                    if (_this._intervals[i])
                        _this._stack_content.get(d).push(_this._intervals[i]);
                });
                var data = [];
                var color = d3.scale.category10();
                this._stack_content.forEach(function (d) {
                    data.push(d);
                });
                var self = this;
                this._subView.selectAll("rect.stack.organize.content").data(data).enter().append("rect").attr({
                    width: this._stack_bar_width,
                    "class": "stack organize content",
                    height: this._view_height + this._view_top_padding,
                    y: 0
                }).style({
                    stroke: "#fff",
                    "stroke-width": 0.5
                }).attr("x", function (d, i) {
                    return d.x = d.ox = i * _this._stack_bar_width;
                }).style("fill", function (d, i) {
                    return d.fill = color(i);
                }).on("dblclick", function (d, i) {
                    d3.select(this).style("visibility", "hidden");
                    self.ExpandStackDate(d);
                });
            };
            Curve.prototype.ExpandStackDate = function (d) {
                var _this = this;
                this.ShrinkStackRect(d.x);
                var data = d.intervals || d;
                this._subView.append("g").attr("class", "stack rect group").selectAll("rect.stack.rect").data(data).enter().append("rect").attr({
                    width: this._stack_bar_width,
                    "class": "stack rect",
                    height: this._view_height + this._view_top_padding,
                    y: 0
                }).style({
                    stroke: "#fff",
                    "stroke-width": 0.5,
                    opacity: 1e-6
                }).attr("x", function (p, j) {
                    p.ox = d.x;
                    return p.x = d.x + j * _this._stack_bar_width;
                }).on("click", function (d) {
                    _this.SelectSegment(d);
                }).transition().style("opacity", 1);
                //  .style("fill", color)
                var maxI = -1;
                var temp_stack_bar = this._subView.selectAll("rect.stack.organize").filter(function (p, i) {
                    maxI = i > maxI ? i : maxI;
                    return p.x > d.x;
                });
                var offsetX = (data.length - 1) * this._stack_bar_width;
                if ((maxI + data.length - 1) * this._stack_bar_width > this._sub_view_width) {
                    temp_stack_bar.attr("x", function (p) {
                        return p.x = p.x + offsetX;
                    });
                    this._subView.on("mousemove", function () {
                        var mouse = d3.mouse(_this._subView.node());
                        var data = [];
                        d3.selectAll("rect.stack").attr("x", function (d, i) {
                            if (d3.select(this).style("visibility") != "hidden") {
                                data.push(d.x);
                            }
                        });
                        data.sort(function (a, b) {
                            return a > b ? 1 : -1;
                        });
                        _this._fisheye_scale.domain(data).focus(mouse[0]);
                        _this._subView.selectAll("rect.stack").filter(function () {
                            return d3.select(this).style("visibility") != "hidden";
                        }).attr("x", function (d) {
                            //if (this._fisheye_scale(d.x))
                            return _this._fisheye_scale(d.x);
                        }).attr("width", function (d) {
                            //if (this._fisheye_scale.rangeBand(d.x))
                            return _this._fisheye_scale.rangeBand(d.x);
                        });
                    });
                }
                else {
                    temp_stack_bar.transition().attr("x", function (p) {
                        return p.x = p.x + offsetX;
                    }).attr("width", this._stack_bar_width);
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
                node.id = tree.nodes.length.toString();
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
/////<reference path = "./BaseSingleLens.ts" />
//module ManyLens {
//    export module Lens {
//        export class BarChartLens extends BaseSingleLens {
//            public static Type: string = "BarChartLens";
//            private _x_axis_gen: D3.Svg.Axis = d3.svg.axis();
//            private _x_axis: D3.Selection;
//            private _bar_width: number;
//            private _bar_chart_width: number = this._lens_circle_radius * Math.SQRT2;
//            private _bar_chart_height: number = this._bar_chart_width;
//            constructor(element: D3.Selection, attributeName:string, manyLens: ManyLens.ManyLens) {
//                super(element, attributeName,BarChartLens.Type,manyLens);
//            }
//            public Render(color: string): void {
//                super.Render(color);
//            }
//            public ExtractData(): void {
//                var data: Array<number> = super.ExtractData();
//                data = d3.range(12).map(function (d) {
//                    return 10 + 70 * Math.random();
//                });
//                return data;
//            }
//            public DisplayLens():any {
//                if (!super.DisplayLens()) return;
//                var x = d3.scale.linear()
//                    .range([0, this._bar_chart_width])
//                    .domain([0, this._data]);
//                this._x_axis_gen
//                    .scale(x)
//                    .ticks(0)
//                    .orient("bottom")
//                ;
//                this._x_axis = this._lens_circle_svg.append("g")
//                    .attr("class", "x-axis")
//                    .attr("transform", () => {
//                        return "translate(" + [-this._bar_chart_width / 2, this._bar_chart_height / 2] + ")";
//                    })
//                    .attr("fill", "none")
//                    .attr("stroke", "black")
//                    .attr("stroke-width", 1)
//                    .call(this._x_axis_gen)
//                ;
//                this._bar_width = (this._bar_chart_width - 20) / this._extract_data_map_func(this._data).length;
//                var barHeight = d3.scale.linear()
//                    .range([10, this._bar_chart_height])
//                    .domain(d3.extent(this._extract_data_map_func(this._data)));
//                var bar = this._lens_circle_svg.selectAll(".bar")
//                    .data(this._extract_data_map_func(this._data))
//                    .enter().append("g")
//                    .attr("transform", (d, i) => {
//                        return "translate(" + [10 + i * this._bar_width - this._bar_chart_width / 2, this._bar_chart_height / 2 - barHeight(d)] + ")";
//                    })
//                ;
//                bar.append("rect")
//                    .attr("width", this._bar_width)
//                    .attr("height", function (d) { return barHeight(d); })
//                    .attr("fill", "steelblue")
//                ;
//            }
//        }
//    }
//} 
///<reference path = "../D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var ExtractDataFunc = (function () {
            function ExtractDataFunc(att) {
                this.targetAttribute = att;
            }
            Object.defineProperty(ExtractDataFunc.prototype, "TargetAttribute", {
                get: function () {
                    return this.targetAttribute;
                },
                enumerable: true,
                configurable: true
            });
            ExtractDataFunc.prototype.Extract = function (d, newData) {
                if (newData)
                    d[this.targetAttribute] = newData;
                return d[this.targetAttribute];
            };
            return ExtractDataFunc;
        })();
        Lens.ExtractDataFunc = ExtractDataFunc;
        var BaseD3Lens = (function (_super) {
            __extends(BaseD3Lens, _super);
            function BaseD3Lens(element, type, manyLens) {
                var _this = this;
                _super.call(this, element, manyLens);
                this._combine_failure_rebound_duration = 800;
                this._units_id = [];
                this._sc_lc_svg = null;
                this._lens_circle_radius = 100;
                this._lens_circle_scale = 1;
                this._lens_circle_zoom = d3.behavior.zoom();
                this._lens_circle_drag = d3.behavior.drag();
                this._is_component_lens = false;
                this._is_composite_lens = null;
                this._type = type;
                this._id = "lens_" + this._manyLens.LensIDGenerator;
                this._lens_circle_zoom.scaleExtent([1, 2]).on("zoom", function () {
                    _this.LensCircleZoomFunc();
                    d3.event.sourceEvent.stopPropagation();
                });
                this._lens_circle_drag.origin(function (d) {
                    return d;
                }).on("dragstart", function () {
                    _this.LensCircleDragstartFunc();
                    d3.event.sourceEvent.stopPropagation();
                    //console.log("lc_dragstart " + this._type);
                }).on("drag", function () {
                    _this.LensCircleDragFunc();
                    d3.event.sourceEvent.stopPropagation();
                    //console.log("lc_drag " + this._type);
                }).on("dragend", function () {
                    _this.LensCircleDragendFunc();
                    d3.event.sourceEvent.stopPropagation();
                    //console.log("lc_dragend " + this._type);
                });
            }
            Object.defineProperty(BaseD3Lens.prototype, "ID", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseD3Lens.prototype, "MapID", {
                get: function () {
                    return this._map_id;
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
            Object.defineProperty(BaseD3Lens.prototype, "LensSVGGroup", {
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
            Object.defineProperty(BaseD3Lens.prototype, "UnitsID", {
                get: function () {
                    return this._units_id.sort();
                },
                enumerable: true,
                configurable: true
            });
            BaseD3Lens.prototype.Render = function (color) {
                this._lens_type_color = color;
                this._sc_lc_svg = this._element.append("g").data([{ tx: 0, ty: 0, scale: 1, cx: 0, cy: 0 }]).attr("class", "lens").attr("id", this.ID);
                //Add this lens to the app class
                this._manyLens.AddLens(this);
            };
            BaseD3Lens.prototype.ExtractData = function () {
                throw new Error('This method is abstract');
            };
            BaseD3Lens.prototype.AfterExtractData = function () {
                throw new Error('This method is abstract');
            };
            BaseD3Lens.prototype.DisplayLens = function (any) {
                if (any === void 0) { any = null; }
                var duration = 300;
                this._lens_circle_svg = this._sc_lc_svg.append("g").data([{ x: this._lens_circle_cx, y: this._lens_circle_cy }]).attr("class", "lens-circle-g " + this._type).attr("transform", "translate(" + [this._lens_circle_cx, this._lens_circle_cy] + ")scale(" + this._lens_circle_scale + ")").attr("opacity", "1e-6").style("pointer-events", "none").on("contextmenu", function () {
                    //d3.event.preventDefault();
                }).on("mousedown", function () {
                    //console.log("lc_mousedown " + this._type);
                }).on("mouseup", function () {
                    //console.log("lc_mouseup " + this._type);
                }).on("click", function () {
                    //console.log("lc_click " + this._type)
                }).call(this._lens_circle_zoom).on("dblclick.zoom", null).call(this._lens_circle_drag);
                this._lens_circle = this._lens_circle_svg.append("path").attr("class", "lens-circle").attr("id", "lens-circle-" + this.ID).attr("d", d3.svg.arc().startAngle(0).endAngle(2 * Math.PI).innerRadius(0).outerRadius(this._lens_circle_radius)).style({
                    "fill": "#fff",
                    "stroke": "black",
                    "stroke-width": 1
                });
                this._manyLens.AddLensToHistoryTree(this);
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
                    _this._lens_circle_cx = d.x = d3.event.x; //Math.max(this._lens_circle_radius, Math.min(parseFloat(this._element.style("width")) - this._lens_circle_radius, d3.event.x));
                    _this._lens_circle_cy = d.y = d3.event.y; //Math.max(this._lens_circle_radius, Math.min(parseFloat(this._element.style("height")) - this._lens_circle_radius, d3.event.y));
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
                    if (ele.classed("lens-circle"))
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
                    var lensA_id = d3.select(res[0].parentNode.parentNode).attr("id");
                    var lensB_id = d3.select(res[1].parentNode.parentNode).attr("id");
                    var lensC = ManyLens.LensAssemblyFactory.CombineLens(this._element, this._manyLens, this._manyLens.GetLens(lensA_id), this._manyLens.GetLens(lensB_id));
                    if (lensC) {
                        lensC.Render("black");
                        //lensC.DisplayLens();
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
                if (this._lens_circle_svg)
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
                var _this = this;
                _super.call(this, element, type, manyLens);
                this._select_circle_radius = 0;
                this._select_circle_cx = -10;
                this._select_circle_cy = -10;
                this._select_circle_scale = 1;
                this._select_circle_zoom = d3.behavior.zoom();
                this._select_circle_drag = d3.behavior.drag();
                this._has_put_down = false;
                this._has_showed_lens = false;
                //protected _sc_drag_event_flag: boolean = false;
                this._sc_lc_default_dist = 100;
                this._extract_data_map_func = null;
                this._is_composite_lens = false;
                this._select_circle_radius = 10;
                this._attribute_name = attributeName;
                this._select_circle_zoom.scaleExtent([1, 4]).on("zoom", function () {
                    _this.SelectCircleZoomFunc();
                    //console.log("sc_zoom " + this._type);
                    d3.event.sourceEvent.stopPropagation();
                });
                this._select_circle_drag.origin(function (d) {
                    return d;
                }).on("dragstart", function () {
                    //this._sc_drag_event_flag = false;
                    //console.log("sc_dragstart " + this._type);
                    d3.event.sourceEvent.stopPropagation();
                }).on("drag", function () {
                    //if (this._sc_drag_event_flag) {
                    _this.SelectCircleDragFunc();
                    //} else {
                    //    this._sc_drag_event_flag = true;
                    //}
                    //console.log("sc_drag " + this._type);
                    d3.event.sourceEvent.stopPropagation();
                }).on("dragend", function (d) {
                    _this.SelectCircleDragendFunc(d);
                    //console.log("sc_dragend " + this._type);
                    d3.event.sourceEvent.stopPropagation();
                });
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
            BaseSingleLens.prototype.Render = function (color) {
                var _this = this;
                _super.prototype.Render.call(this, color);
                var container = this._element;
                var hasShow = false;
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
                    _this._manyLens.RemoveLens(_this);
                    var hostLens = _this.DetachHostLens();
                    if (hostLens) {
                        _this._manyLens.DetachCompositeLens(_this._element, hostLens, _this);
                    }
                    d3.event.preventDefault();
                }).call(this._select_circle_zoom).on("dblclick.zoom", null).on("mousedown.zoom", null).call(this._select_circle_drag);
                this._sc_lc_svg.append("line").attr("stoke-width", 2).attr("stroke", "red");
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
                var _this = this;
                var data = this.GetElementByMouse();
                if (!data) {
                    this._data = null;
                    return null;
                }
                console.log(data.unitsID);
                console.log(data.mapID);
                this._units_id = data.unitsID.sort();
                this._map_id = data.mapID;
                var promise = this._manyLens.ManyLensHubServerGetLensData(this.MapID, this.ID, this.UnitsID, this._extract_data_map_func.TargetAttribute);
                promise.done(function (d) {
                    console.log("promise done in basesingleLens");
                    _this._data = d;
                    _this.AfterExtractData();
                    _this.DisplayLens();
                });
            };
            BaseSingleLens.prototype.AfterExtractData = function () {
                //Do nothing in this abstract method
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
                if (!this._has_put_down)
                    return;
                if (d3.event.sourceEvent.button != 0)
                    return;
                this._sc_lc_svg.select("g.lens-circle-g").remove();
                this._sc_lc_svg.select("line").attr("x1", d3.event.x).attr("x2", d3.event.x).attr("y1", d3.event.y).attr("y2", d3.event.y);
                this._select_circle.attr("cx", function (d) {
                    return d.x = d3.event.x; //Math.max(0, Math.min(parseFloat(this._element.style("width")), d3.event.x));
                }).attr("cy", function (d) {
                    return d.y = d3.event.y; //Math.max(0, Math.min(parseFloat(this._element.style("height")), d3.event.y));
                });
                this._has_showed_lens = false;
                var hostLens = this.DetachHostLens();
                if (hostLens) {
                    this._manyLens.DetachCompositeLens(this._element, hostLens, this);
                }
            };
            //The entrance of new data
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
                    this.ExtractData(); //it will invoke display automatically when finishing extractdata
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
            BaseSingleLens.prototype.GetElementByMouse = function () {
                //this._element.select( "#rectForTest" ).remove();
                var unitsID = [];
                var mapID;
                var rect = this._element.node().createSVGRect();
                var t = this._sc_lc_svg.data()[0];
                var realX = this._select_circle_cx * t.scale + t.tx;
                var realY = this._select_circle_cy * t.scale + t.ty;
                rect.x = realX - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
                rect.y = realY - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
                rect.height = rect.width = this._select_circle_radius * Math.SQRT2 * this._select_circle_scale * t.scale;
                //this._element.append( "rect" ).attr( {
                //    id:"rectForTest",
                //    x: rect.x,
                //    y: rect.y,
                //    width: rect.width,
                //    height:rect.height
                //});
                var ele = this._element.node().getIntersectionList(rect, null);
                var minDist2 = Number.MAX_VALUE;
                var minUnitsID = -1;
                for (var i = 0, len = ele.length; i < len; ++i) {
                    var node = d3.select(ele.item(i));
                    if (node.classed("unit")) {
                        var dx = parseFloat(node.attr("x")) + parseFloat(node.attr("width")) * 0.5 - realX;
                        var dy = parseFloat(node.attr("y")) + parseFloat(node.attr("height")) * 0.5 - realY;
                        var dist2 = dx * dx + dy * dy;
                        if (dist2 < (this._select_circle_radius * this._select_circle_scale * this._select_circle_radius * this._select_circle_scale)) {
                            var tID = node.data()[0]['unitID'];
                            unitsID.push(tID);
                            mapID = node.data()[0]['mapID'];
                        }
                        else if (dist2 < minDist2) {
                            mapID = node.data()[0]['mapID'];
                            minDist2 = dist2;
                            minUnitsID = node.data()[0]['unitID'];
                        }
                    }
                }
                var res = null;
                if (unitsID.length > 0 && mapID) {
                    res = { unitsID: unitsID, mapID: mapID };
                }
                else if (unitsID.length == 0 && mapID) {
                    res = { unitsID: [minUnitsID], mapID: mapID };
                }
                else {
                    console.log(unitsID);
                    console.log(mapID);
                    console.log("there is a bug here " + unitsID);
                }
                return res;
                //var eles = [];
                //try {
                //    var x = d3.event.sourceEvent.x,
                //        y = d3.event.sourceEvent.y;
                //} catch (e) {
                //    return;
                //}
                //var p = d3.mouse(this._element.node());
                //if (p[0] < 0 || p[0] > parseFloat(this._element.style("width")) || p[1] < 0 || p[1] > parseFloat(this._element.style("height")))
                //    return;
                //var ele = d3.select(document.elementFromPoint(x, y));
                //while (ele && ele.attr("id") != "mapSvg") {
                //    if (ele.classed("unit")) {
                //        res = ele[0][0];
                //        break;
                //    }
                //    eles.push(ele);
                //    ele.style("visibility", "hidden");
                //    ele = d3.select(document.elementFromPoint(x, y));
                //    if (eles.length > 10) {
                //        throw new Error("what the fuck");
                //    }
                //}
                //for (var i = 0, len = eles.length; i < len; ++i) {
                //    eles[i].style("visibility", "");
                //}
            };
            BaseSingleLens.Type = "BaseSingleLens";
            return BaseSingleLens;
        })(Lens.BaseD3Lens);
        Lens.BaseSingleLens = BaseSingleLens;
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
                this._projection = d3.geo.orthographic();
                //d3.geo.mercator();
                this._path = d3.geo.path();
                this._color = d3.scale.quantize();
                this._projection.clipAngle(90).precision(.1).scale(100).rotate([96, -20]).translate([0, 0]);
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
            MapLens.prototype.AfterExtractData = function () {
                var data = {};
                this._color.domain(d3.extent(this._extract_data_map_func.Extract(this._data), function (d) {
                    return d['Value'];
                }));
                this._extract_data_map_func.Extract(this._data).forEach(function (d) {
                    data[d.Key] = d.Value;
                });
                this._data = data;
            };
            MapLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return;
                if (this._map_data) {
                    this._lens_circle_svg.append("g").attr("id", "country").selectAll("path").data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.countries).features).enter().append("path").attr("d", this._path).attr("fill", function (d) {
                        var color = _this._color(_this._data[d.id] || 0);
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
                    d3.json("./testData/countriesAlpha2.topo.json", function (error, mapData) {
                        _this._map_data = {
                            raw: mapData,
                        };
                        _this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(mapData, mapData.objects.countries).features).enter().append("path").attr("d", _this._path).attr("fill", function (d) {
                            var color = _this._color(_this._data[d.id] || 0);
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
                this._force.size([0, 0]).linkDistance(this._lens_circle_radius / 2).charge(-50).gravity(0.1).friction(0.5);
                this._location_x_scale.range([-this._lens_circle_radius, this._lens_circle_radius]);
                this._location_y_scale.range([-this._lens_circle_radius, this._lens_circle_radius]);
            }
            NetworkLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            NetworkLens.prototype.AfterExtractData = function () {
            };
            NetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return;
                var graph = this._extract_data_map_func.Extract(this._data);
                var nodes = graph.nodes, links = graph.links;
                nodes.forEach(function (d) {
                    d.x = d.x * _this.LensRadius;
                    d.y = d.y * _this.LensRadius;
                });
                this._location_x_scale.domain(d3.extent(nodes, function (d) {
                    return d.x;
                }));
                this._location_y_scale.domain(d3.extent(nodes, function (d) {
                    return d.y;
                }));
                nodes.forEach(function (d) {
                    if ((d.x * d.x + d.y * d.y) > _this.LensRadius * _this.LensRadius) {
                        d.x = _this._location_x_scale(d.x), d.y = _this._location_y_scale(d.y);
                    }
                });
                this._force.nodes(nodes).links(links);
                var link = this._lens_circle_svg.selectAll(".network.link").data(links).enter().append("line").attr("class", "network link").style({
                    "stroke": "#777",
                    "stroke-width": "1px"
                });
                var node = this._lens_circle_svg.selectAll(".network.node").data(nodes).enter().append("circle").attr("class", "network node").attr("r", 4).attr('cx', function (d) {
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
            //public get Color(): D3.Scale.OrdinalScale {
            //    return this._color;
            //}
            function PieChartLens(element, attributeName, manyLens) {
                _super.call(this, element, attributeName, PieChartLens.Type, manyLens);
                this._pie_innerRadius = 0;
                this._pie_outterRadius = this._lens_circle_radius - 0;
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._color = d3.scale.quantize();
                this._arc.innerRadius(this._pie_innerRadius).outerRadius(this._pie_outterRadius);
                this._pie.value(function (d) {
                    return d.Value;
                }).sort(function (a, b) {
                    if (a.Value > b.Value)
                        return -1;
                    return 1;
                }).startAngle(0);
                this._color.range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                ]);
            }
            PieChartLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            PieChartLens.prototype.AfterExtractData = function () {
                this._color.domain(d3.extent(this._extract_data_map_func.Extract(this._data), function (d) {
                    return d['Value'];
                }));
            };
            PieChartLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return;
                this._lens_circle.style({
                    "stroke": null,
                    "stroke-width": null
                });
                this._lens_circle_svg.selectAll(".pie").data(this._pie(this._extract_data_map_func.Extract(this._data))).enter().append("path").attr("id", "pie-" + this.ID).attr("class", "pie").attr("fill", function (d) {
                    return _this._color(d.value) || "rgb(158,202,225)";
                }).attr("stroke", "#fff").attr("d", this._arc).on("mouseover", function (d) {
                    _this.ShowLabel(d);
                }).on("mouseout", function () {
                    _this.ShowLabel(null);
                });
                var r = this._lens_circle_radius;
                this._lens_circle_svg.append("text").text(this._attribute_name).attr("dx", function (d) {
                    var bbox = this.getBBox();
                    return r * Math.PI - bbox.width / 2;
                }).attr("dy", "-5").text("").append("textPath").attr("xlink:href", "#lens-circle-" + this.ID).text(this._attribute_name);
            };
            PieChartLens.prototype.ShowLabel = function (d) {
                var _this = this;
                if (d) {
                    this._lens_circle_svg.selectAll("text.mylabel").data([d]).enter().append("text").attr("class", "mylabel").attr("text-anchor", "middle").attr("x", function (d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cx = Math.cos(a) * (_this._pie_innerRadius + (_this._pie_outterRadius - _this._pie_innerRadius) / 2);
                        return d.x = Math.cos(a) * (_this._pie_outterRadius + 40);
                    }).attr("y", function (d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cy = Math.sin(a) * (_this._pie_innerRadius + (_this._pie_outterRadius - _this._pie_innerRadius) / 2);
                        return d.y = Math.sin(a) * (_this._pie_outterRadius + 40);
                    }).text(function (d) {
                        return d.data.Key;
                    }).each(function (d) {
                        var bbox = this.getBBox();
                        d.sx = d.x - bbox.width / 2 - 2;
                        d.ox = d.x + bbox.width / 2 + 2;
                        d.sy = d.oy = d.y + 5;
                    });
                    this._lens_circle_svg.selectAll("path.mylabel").data([d]).enter().append("path").attr("class", "mylabel").style("fill", "none").style("stroke", "black").attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                        }
                    }).transition().duration(200).attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                        }
                    });
                }
                else {
                    this._lens_circle_svg.selectAll(".mylabel").remove();
                }
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
            WordCloudLens.prototype.AfterExtractData = function () {
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(this._extract_data_map_func.Extract(this._data), function (d) {
                    return d.Value;
                }));
            };
            WordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                if (!_super.prototype.DisplayLens.call(this))
                    return null;
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._extract_data_map_func.Extract(this._data)).filter(function (d) {
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
                var _this = this;
                _super.call(this, element, type, manyLens);
                this._base_accessor_func = null;
                this._sub_accessor_func = null;
                this._new_lens_count = 1;
                this._need_to_reshape = false;
                this._is_composite_lens = true;
                this._components_lens = new Array();
                this._components_select_circle = new Array();
                this._components_kind = new Map();
                this._components_units = new Map();
                this._base_component = firstLens;
                this._base_component.HostLens = this;
                this._map_id = firstLens.MapID;
                this._lens_circle_cx = firstLens.LensCX;
                this._lens_circle_cy = firstLens.LensCY;
                if (secondLens) {
                    var firstLens0 = firstLens;
                    this._sub_component = secondLens;
                    this._sub_component.HostLens = this;
                    this._components_lens.push(firstLens0);
                    this._components_select_circle.push({
                        _line: firstLens0.LinkLine,
                        _sc_cx: firstLens0.SelectCircleCX,
                        _sc_cy: firstLens0.SelectCircleCY,
                        _sc_radius: firstLens0.SelectCircleRadius,
                        _sc_scale: firstLens0.SelectCircleScale
                    });
                    this._components_kind.set(firstLens0.Type, 1);
                    this._components_lens.push(secondLens);
                    this._components_select_circle.push({
                        _line: secondLens.LinkLine,
                        _sc_cx: secondLens.SelectCircleCX,
                        _sc_cy: secondLens.SelectCircleCY,
                        _sc_radius: secondLens.SelectCircleRadius,
                        _sc_scale: secondLens.SelectCircleScale
                    });
                    if (firstLens0.Type == secondLens.Type) {
                        this._components_kind.set(firstLens0.Type, 2);
                    }
                    else {
                        this._components_kind.set(secondLens.Type, 1);
                    }
                    //set the place of this component lens
                    firstLens0.UnitsID.forEach(function (d, i) {
                        _this._components_units.set(d, 1);
                        _this._units_id.push(d);
                    });
                    secondLens.UnitsID.forEach(function (d, i) {
                        if (_this._components_units.has(d)) {
                            //if this place already exits, add 1 to it(which means it will be 2)
                            _this._components_units.set(d, 2);
                        }
                        else {
                            _this._components_units.set(d, 1);
                            _this._units_id.push(d);
                        }
                    });
                    this._base_accessor_func = firstLens0.DataAccesser();
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
            Object.defineProperty(BaseCompositeLens.prototype, "ComponentsUnits", {
                get: function () {
                    return this._components_units;
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
                if (this._sub_component) {
                    this._sub_component.RemoveLens();
                }
                //Update base component and sub component
                this._base_component = this;
                this._sub_component = null;
                //It will invoke display() automatically when finish extracting data;
                this.ExtractData();
            };
            BaseCompositeLens.prototype.ExtractData = function () {
                var _this = this;
                var promise = this._manyLens.ManyLensHubServerGetLensData(this.MapID, this.ID, this.UnitsID, this._base_accessor_func.TargetAttribute, this._sub_accessor_func.TargetAttribute);
                promise.done(function (d) {
                    console.log("promise done in baseCompositeLens");
                    _this._data = d;
                    _this.AfterExtractData();
                    _this.DisplayLens();
                });
                //this._components_data.forEach((componentData)=>{
                //    if (this._data == null)
                //        this._data = JSON.parse(JSON.stringify(componentData));
                //    this._data.unitsID.concat(componentData.unitsID);
                //    this._data.contents.concat(componentData.contents);
                //    componentData.hashTagDistribute.forEach((d) => {
                //        var key = d.Key;
                //        var value = d.Value;
                //        var column = this._data.hashTagDistribute;
                //        for (var i = 0, len = column.length; i < len; ++i) {
                //            if (key == column[i].Key) {
                //                column[i].Value += value;
                //                break;
                //            }
                //        }
                //        if (i == len) {
                //            column.push(d);
                //        }
                //    });
                //    componentData.keywordsDistribute.forEach((d) => {
                //        var key = d.Key;
                //        var value = d.Value;
                //        var column = this._data.keywordsDistribute;
                //        for (var i = 0, len = column.length; i < len; ++i) {
                //            if (key == column[i].Key) {
                //                column[i].Value += value;
                //                break;
                //            }
                //        }
                //        if (i == len) {
                //            column.push(d);
                //        }
                //    });
                //    componentData.tweetLengthDistribute.forEach((d) => {
                //        var key = d.Key;
                //        var value = d.Value;
                //        var column = this._data.tweetLengthDistribute;
                //        for (var i = 0, len = column.length; i < len; ++i) {
                //            if (key == column[i].Key) {
                //                column[i].Value += value;
                //                break;
                //            }
                //        }
                //        if (i == len) {
                //            column.push(d);
                //        }
                //    });
                //});
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
                var _this = this;
                lens.HostLens = this;
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
                lens.UnitsID.forEach(function (d, i) {
                    if (_this._components_units.has(d)) {
                        var num = _this._components_units.get(d) + 1;
                        _this._components_units.set(d, num);
                    }
                    else {
                        _this._components_units.set(d, 1);
                        _this._units_id.push(d);
                    }
                });
                this._new_lens_count = 1;
            };
            BaseCompositeLens.prototype.RemoveComponentLens = function (lens) {
                var _this = this;
                //TODO remove related data here;
                var index = this._components_lens.indexOf(lens);
                if (-1 != index) {
                    this._components_lens.splice(index, 1);
                    this._components_select_circle.splice(index, 1);
                    lens.UnitsID.forEach(function (d, i) {
                        var num = _this._components_units.get(d) - 1;
                        if (num > 0) {
                            _this._components_units.set(d, num);
                        }
                        else if (num == 0) {
                            _this._components_units.delete(d);
                            _this._units_id.splice(_this._units_id.indexOf(d), 1);
                        }
                        else {
                            throw new Error("The number of this places of component is less than 0!!");
                        }
                    });
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
            cBoundleLens.prototype.AfterExtractData = function () {
            };
            cBoundleLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                var graph = this._base_accessor_func.Extract(this._data);
                var nodes = this._cluster.nodes(buildTree(graph)), links = buildLinks(graph);
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
                function buildTree(graph) {
                    var nodes = graph.nodes;
                    var links = graph.links;
                    var treeRoot = { name: "root", parent: null, children: [] };
                    nodes.forEach(function (d, i) {
                        //if (!d.parent) {
                        //    d.parent = treeRoot;
                        //    treeRoot.children.push(d);
                        //}
                        treeRoot.children.push(d);
                    });
                    return treeRoot;
                }
                function buildLinks(graph) {
                    var links = [];
                    var nodes = graph.nodes;
                    graph.links.forEach(function (d) {
                        links.push({ source: nodes[d.source], target: nodes[d.target] });
                    });
                    return links;
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
            cChordDiagramLens.prototype.DisplayLens = function () {
                var _this = this;
                this._chord.matrix(this._base_accessor_func.Extract(this._data));
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
                this._color = d3.scale.quantize();
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
                this._color.range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                ]);
            }
            cPieChartLens.prototype.Render = function (color) {
                if (color === void 0) { color = "pupple"; }
                _super.prototype.Render.call(this, color);
            };
            cPieChartLens.prototype.AfterExtractData = function () {
            };
            cPieChartLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._lens_circle_svg.selectAll(".innerPie").data(this._pie(this._base_accessor_func.Extract(this._data))).enter().append("path").attr("d", this._arc).style("fill", function (d, i) {
                    return _this._color(i);
                }).style("fill-rule", "evenodd");
                this._arc.innerRadius(this._lens_circle_radius).outerRadius(this._lens_circle_radius + 20).endAngle(function (d, i) {
                    return d.startAngle + (d.endAngle - d.startAngle) * (d.data.sub / d.value);
                });
                this._lens_circle_svg.selectAll(".outerPie").data(this._pie(this._sub_accessor_func.Extract(this._data))).enter().append("path").attr("fill", function (d, i) {
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
            //protected ExtractData(): any {
            //    var data: D3.Layout.GraphNode = {
            //        "name": "flare",
            //        "children": [
            //            {
            //                "name": "analytics",
            //                "children": [
            //                    {
            //                        "name": "cluster",
            //                        "children": [
            //                            { "name": "AgglomerativeCluster", "size": 3938 },
            //                            { "name": "CommunityStructure", "size": 3812 },
            //                            { "name": "HierarchicalCluster", "size": 6714 },
            //                            { "name": "MergeEdge", "size": 743 }
            //                        ]
            //                    },
            //                    {
            //                        "name": "graph",
            //                        "children": [
            //                            { "name": "BetweennessCentrality", "size": 3534 },
            //                            { "name": "LinkDistance", "size": 5731 },
            //                            { "name": "MaxFlowMinCut", "size": 7840 },
            //                            { "name": "ShortestPaths", "size": 5914 },
            //                            { "name": "SpanningTree", "size": 3416 }
            //                        ]
            //                    },
            //                    {
            //                        "name": "optimization",
            //                        "children": [
            //                            { "name": "AspectRatioBanker", "size": 7074 }
            //                        ]
            //                    }
            //                ]
            //            }
            //        ]
            //    };
            //    return data;
            //}
            cTreeNetworkLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial().projection(function (d) {
                    return [d.y, d.x / 180 * Math.PI];
                });
                this._tree.size([this._theta, this._lens_circle_radius - nodeRadius]).separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(this._base_accessor_func.Extract(this._data)), links = this._tree.links(nodes);
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
            cWordCloudLens.prototype.AfterExtractData = function () {
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(this._base_accessor_func.Extract(this._data), function (d) {
                    return d.Value;
                }));
            };
            cWordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._base_accessor_func.Extract(this._data)).filter(function (d) {
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
            cWordCloudNetworkLens.prototype.AfterExtractData = function () {
                //data.forEach(function (d,i) {
                //    d["group"] = (i%3)+1;//Math.ceil(Math.random()*3);
                //});
                //this._font_size
                //    .range([10, this._cloud_w / 8])
                //    .domain(d3.extent(data, function (d) { return d.Value; }))
                //;
                //return data;
            };
            cWordCloudNetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._base_accessor_func.Extract(this._data)).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.value);
                }).on("end", function (words, bound) {
                    _this.DrawCloud(words, bound);
                });
                this._cloud.start();
                //var groups = [];
                //for (var i = 0, len = data.length; i < len; ++i) {
                //    if (groups[parseInt(data[i]['group']) - 1] != null) {
                //        var group = parseInt(data[i]['group']);
                //        groups[group - 1]++;
                //    }
                //    else {
                //        groups[parseInt(data[i]['group']) - 1] = 0;
                //    }
                //}
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
                _super.call(this, element, cWordCloudPieLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.quantize();
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * Math.SQRT2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 1;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie_innerRadius = this._lens_circle_radius;
                this._pie_outterRadius = this._lens_circle_radius + 20;
                this._cloud_text_color = d3.scale.category10();
                this._pie.value(function (d) {
                    return d.Value;
                }).sort(null);
                this._arc.innerRadius(this._pie_innerRadius).outerRadius(this._pie_outterRadius);
                this._color.range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                ]);
                //this._manyLens.ManyLensHubRegisterClientFunction(this, "hightLightWordsOfTweetsAtLengthOf", this.HightLightWordsOfTweetsAtLengthOf);
            }
            cWordCloudPieLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cWordCloudPieLens.prototype.AfterExtractData = function () {
                this._font_size.range([10, this._cloud_w / 8]).domain(d3.extent(this._base_accessor_func.Extract(this._data), function (d) {
                    return d.Value;
                }));
                this._color.domain(d3.extent(this._sub_accessor_func.Extract(this._data), function (d) {
                    return d['Value'];
                }));
            };
            cWordCloudPieLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._lens_circle.style({
                    "stroke": null,
                    "stroke-width": null
                });
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._base_accessor_func.Extract(this._data)).filter(function (d) {
                    if (d.Value > 3)
                        return true;
                    return false;
                }).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
                    return _this._font_size(d.Value);
                }).on("end", function (words, bounds) {
                    _this.DrawCloud(words, bounds);
                });
                this._cloud.start();
                this._lens_circle_svg.selectAll(".outterPie").data(this._pie(this._sub_accessor_func.Extract(this._data))).enter().append("path").attr("class", "outterPie").style("fill", function (d) {
                    return _this._color(d.value) || "rgb(158,202,225)";
                }).on("mouseover", function (d) {
                    _this._manyLens.ManyLensHubServercWordCloudPieLens(_this.ID, d.data.Key, _this._base_accessor_func.TargetAttribute, _this._sub_accessor_func.TargetAttribute);
                    _this.ShowLabel(d);
                }).on("mouseout", function (d) {
                    _this._lens_circle_svg.selectAll("text.wordCloudText").transition().style("opacity", 1);
                    _this.ShowLabel(null);
                });
                this._lens_circle_svg.selectAll(".outterPie").attr("d", function (d) {
                    return d3.svg.arc().innerRadius(0).outerRadius(_this._pie_outterRadius);
                }).transition().duration(300).attr("d", this._arc);
            };
            cWordCloudPieLens.prototype.HightLightWordsOfTweetsAtLengthOf = function (words) {
                this._lens_circle_svg.selectAll("text.wordCloudText").transition().style("opacity", function (p) {
                    if (words.indexOf(p.text) == -1)
                        return 0.1;
                });
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
                text.attr("text-anchor", "middle").attr("class", "wordCloudText").style("font-size", function (d) {
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
            cWordCloudPieLens.prototype.ShowLabel = function (d) {
                var _this = this;
                if (d) {
                    this._lens_circle_svg.selectAll("text.mylabel").data([d]).enter().append("text").attr("class", "mylabel").attr("text-anchor", "middle").attr("x", function (d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cx = Math.cos(a) * (_this._pie_innerRadius + (_this._pie_outterRadius - _this._pie_innerRadius) / 2);
                        return d.x = Math.cos(a) * (_this._pie_outterRadius + 40);
                    }).attr("y", function (d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cy = Math.sin(a) * (_this._pie_innerRadius + (_this._pie_outterRadius - _this._pie_innerRadius) / 2);
                        return d.y = Math.sin(a) * (_this._pie_outterRadius + 40);
                    }).text(function (d) {
                        return d.data.Key;
                    }).each(function (d) {
                        var bbox = this.getBBox();
                        d.sx = d.x - bbox.width / 2 - 2;
                        d.ox = d.x + bbox.width / 2 + 2;
                        d.sy = d.oy = d.y + 5;
                    });
                    this._lens_circle_svg.selectAll("path.mylabel").data([d]).enter().append("path").attr("class", "mylabel").style("fill", "none").style("stroke", "black").attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                        }
                    }).transition().duration(200).attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                        }
                    });
                }
                else {
                    this._lens_circle_svg.selectAll(".mylabel").remove();
                }
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
            cBaseMapLens.prototype.AfterExtractData = function () {
                var data = {};
                this._color.domain(d3.extent(this._base_accessor_func.Extract(this._data), function (d) {
                    return d['Value'];
                }));
                this._base_accessor_func.Extract(this._data).forEach(function (d) {
                    data[d.Key] = d.Value;
                });
                this._base_accessor_func.Extract(this._data, data);
            };
            cBaseMapLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._lens_circle_svg.append("g").attr("id", "states").selectAll("path").data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.countries).features).enter().append("path").attr("d", this._path).attr("fill", function (d, i) {
                    return _this._color(_this._base_accessor_func.Extract(_this._data)[d.id] || 0);
                }).on("click", function (d) {
                    if (!d3.event.defaultPrevented)
                        _this.ClickedMap(d);
                });
                this._lens_circle_svg.append("g").attr("id", "state-borders").append("path").datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.countries, function (a, b) {
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
        var cMapPieLens = (function (_super) {
            __extends(cMapPieLens, _super);
            function cMapPieLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cMapPieLens.Type, manyLens, firstLens, secondLens);
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie_color = d3.scale.quantize();
                this._pie_innerRadius = this._lens_circle_radius;
                this._pie_outterRadius = this._lens_circle_radius + 20;
                this._pie.value(function (d) {
                    return d.Value;
                }).sort(null);
                this._pie_color.range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                ]);
                this._arc.innerRadius(this._pie_innerRadius).outerRadius(this._pie_outterRadius);
            }
            cMapPieLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cMapPieLens.prototype.AfterExtractData = function () {
                _super.prototype.AfterExtractData.call(this);
                this._pie_color.domain(d3.extent(this._sub_accessor_func.Extract(this._data), function (d) {
                    return d['Value'];
                }));
            };
            cMapPieLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._lens_circle.style({
                    "stroke": null,
                    "stroke-width": null
                });
                this._lens_circle_svg.selectAll(".outterPie").data(this._pie(this._sub_accessor_func.Extract(this._data))).enter().append("path").attr("class", "outterPie").attr("d", this._arc).style("fill", function (d, i) {
                    return _this._pie_color(d.value) || "rgb(158,202,225)";
                }).on("mouseover", function (d) {
                    _this._manyLens.ManyLensHubServercMapPieLens(_this.ID, d.data.Key, _this._base_accessor_func.TargetAttribute, _this._sub_accessor_func.TargetAttribute);
                    _this.ShowLabel(d);
                }).on("mouseout", function (d) {
                    _this.ShowLabel(null);
                });
            };
            cMapPieLens.prototype.ShowLabel = function (d) {
                var _this = this;
                if (d) {
                    this._lens_circle_svg.selectAll("text.mylabel").data([d]).enter().append("text").attr("class", "mylabel").attr("text-anchor", "middle").attr("x", function (d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cx = Math.cos(a) * (_this._pie_innerRadius + (_this._pie_outterRadius - _this._pie_innerRadius) / 2);
                        return d.x = Math.cos(a) * (_this._pie_outterRadius + 40);
                    }).attr("y", function (d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cy = Math.sin(a) * (_this._pie_innerRadius + (_this._pie_outterRadius - _this._pie_innerRadius) / 2);
                        return d.y = Math.sin(a) * (_this._pie_outterRadius + 40);
                    }).text(function (d) {
                        return d.data.Key;
                    }).each(function (d) {
                        var bbox = this.getBBox();
                        d.sx = d.x - bbox.width / 2 - 2;
                        d.ox = d.x + bbox.width / 2 + 2;
                        d.sy = d.oy = d.y + 5;
                    });
                    this._lens_circle_svg.selectAll("path.mylabel").data([d]).enter().append("path").attr("class", "mylabel").style("fill", "none").style("stroke", "black").attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                        }
                    }).transition().duration(200).attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                        }
                    });
                }
                else {
                    this._lens_circle_svg.selectAll(".mylabel").remove();
                }
            };
            cMapPieLens.prototype.HightLightCountry = function (countryName) {
                console.log(countryName);
            };
            cMapPieLens.Type = "cMapBarLens";
            return cMapPieLens;
        })(Lens.cBaseMapLens);
        Lens.cMapPieLens = cMapPieLens;
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
            cMapNetworkLens.prototype.AfterExtractData = function () {
                var _this = this;
                this._sub_accessor_func.Extract(this._data).nodes.forEach(function (d) {
                    var p = _this._projection([d.x, d.y]);
                    d.x = p[0];
                    d.y = p[1];
                });
            };
            //// data shape {text: size:}
            //protected ExtractData(): any {
            //    var data = [
            //        [38.991621, -76.852587],
            //        [28.524963, -80.650813],
            //        [34.200463, -118.176008],
            //        [34.613714, -118.076790],
            //        [41.415891, -81.861774],
            //        [34.646554, -86.674368],
            //        [37.409574, -122.064292],
            //        [37.092123, -76.376230],
            //        [29.551508, -95.092256],
            //        [30.363692, -89.600036]
            //    ];
            //    var links = [];
            //    for (var i = 0, len = data.length + 5; i < len; i++) {
            //        if (i >= data.length - 1) {
            //            var index = Math.ceil(Math.random() * (data.length - 1));
            //            var nextIndex = Math.ceil(Math.random() * (data.length - 1));
            //            links.push({
            //                type: "LineString",
            //                coordinates: [
            //                    [data[index][1], data[index][0]],
            //                    [data[nextIndex][1], data[nextIndex][0]]
            //                ]
            //            });
            //        }
            //        else {
            //            links.push({
            //                type: "LineString",
            //                coordinates: [
            //                    [data[i][1], data[i][0]],
            //                    [data[i + 1][1], data[i + 1][0]]
            //                ]
            //            });
            //        }
            //    }
            //    return links;
            //}
            cMapNetworkLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                var networkG = this._lens_circle_svg.append("g").attr("id", "network");
                var pathArcs = networkG.selectAll(".cMapPath").data(this._sub_accessor_func.Extract(this._data).links);
                pathArcs.enter().append("path").attr("class", "cMapPath").style({
                    "fill": "none"
                });
                var networkNode = networkG.selectAll(".cMapNode").data(this._sub_accessor_func.Extract(this._data).nodes).enter().append("circle").attr("class", "cMapNode").attr("cx", function (d) {
                    return d.x;
                }).attr("cy", function (d) {
                    return d.y;
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
            cMapWordCloudLens.prototype.DisplayLens = function () {
                var _this = this;
                _super.prototype.DisplayLens.call(this);
                this._cloud.size([this._cloud_w, this._cloud_h]).words(this._sub_accessor_func.Extract(this._data)).padding(this._cloud_padding).rotate(0).font(this._cloud_font).fontWeight(this._cloud_font_weight).fontSize(function (d) {
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
///<reference path = "../Lens/cMapPieLens.ts" />
///<reference path = "../Lens/cMapLens.ts" />
///<reference path = "../Lens/cMapNetworkLens.ts" />
///<reference path = "../Lens/cMapWordCloudLens.ts" />
(function () {
})();
///<reference path = "../D3ChartObject.ts" />
///<reference path = "../Lens/LensList.ts" />
//module ManyLens {
//    export module Pane {
//        interface PaneG {
//            svg_g: D3.Selection;
//            lens_count: number;
//            lens_icon_r: number;
//            lens_icon_padding: number;
//            x: number;
//            y: number;
//            rect_width: number;
//            rect_height: number;
//        }
//        export class ClassicLensPane extends D3ChartObject {
//            private _lens_count: number = 6;
//            private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
//            private _pang_g: PaneG;
//            //private _history_trees: LensHistory.HistoryTrees;
//            private _drag: D3.Behavior.Drag = d3.behavior.drag();
//            constructor(element: D3.Selection,manyLens:ManyLens.ManyLens) {
//                super(element,manyLens);
//                this._manyLens = manyLens;
//                this._drag
//                    .origin(function (d) {
//                        return d;
//                    })
//                    .on("drag", () => {
//                        this.DragFunc();
//                    });
//                var pane_icon_r: number = 10;
//                var pane_icon_padding: number = 10;
//                this._pang_g = {
//                    svg_g: this._element.append("g"),
//                    x: parseFloat( this._element.style("width")) - 3 * (pane_icon_r + pane_icon_padding),
//                    y: 10,
//                    rect_height: (this._lens_count * pane_icon_r * 2) + (this._lens_count + 1) * pane_icon_padding,
//                    rect_width: 2 * (pane_icon_r + pane_icon_padding),
//                    lens_icon_r: pane_icon_r,
//                    lens_icon_padding: pane_icon_padding,
//                    lens_count: this._lens_count
//                };
//            }
//            public Render(): void {
//                this.OpenPane();
//            }
//            private OpenPane() {
//                var container = this._element;
//                var pane_g = this._pang_g.svg_g.data([this._pang_g])
//                    .attr("class", "lensPane")
//                    .attr("transform", "translate(" + [this._pang_g.x, this._pang_g.y] + ")")
//                    .call(this._drag);
//                pane_g.append("rect")
//                    .attr("x", 0)
//                    .attr("y", 0)
//                    .attr("width", this._pang_g.rect_width)
//                    .attr("height", this._pang_g.rect_height)
//                    .attr("fill", "#fff7bc")
//                    .attr("stroke", "pink")
//                    .attr("stroke-width", 2)
//                ;
//                pane_g.selectAll("circle").data(d3.range(this._lens_count))
//                    .enter().append("circle")
//                    .attr("class", "pane-Lens-Circle")
//                    .attr("r", this._pang_g.lens_icon_r)
//                    .attr("cx", this._pang_g.rect_width / 2)
//                    .attr("cy", (d, i) => {
//                        return this._pang_g.lens_icon_r
//                            + this._pang_g.lens_icon_padding
//                            + i * (2 * this._pang_g.lens_icon_r + this._pang_g.lens_icon_padding);
//                    })
//                    .attr("fill", (d, i) => { return this._pane_color(i); })
//                    .on("mousedown", function () {
//                        d3.event.stopPropagation();
//                    })
//                    .on("click", (d, i) => {
//                        var len: Lens.BaseD3Lens;
//                        switch (i) {
//                            case 0: {
//                                len = new Lens.NetworkLens(this._element,this._manyLens);
//                                break;
//                            }
//                            case 1: {
//                                len = new Lens.WordCloudLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 2: {
//                                len = new Lens.PieChartLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 3: {
//                                len = new Lens.MapLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 4: {
//                                len = new Lens.BarChartLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 5: {
//                                len = new Lens.TreeNetworkLens(this._element, this._manyLens);
//                                break;
//                            }
//                        }
//                        len.Render(this._pane_color(i));
//                        d3.event.stopPropagation();
//                    })
//                ;
//            }
//            private ClosePane(msg: string) {
//            }
//            private DragFunc() {
//                var pane_rect_width = this._pang_g.rect_width;
//                var pane_rect_height = this._pang_g.rect_height;
//                this._pang_g.svg_g
//                    .attr("transform", "translate(" + [
//                        this._pang_g.x = Math.max(0, Math.min(parseFloat(this._element.style("width")) - pane_rect_width, d3.event.x)),
//                        this._pang_g.y = Math.max(0, Math.min(parseFloat(this._element.style("height")) - pane_rect_height, d3.event.y))
//                    ] + ")");
//            }
//        }
//    }
//} 
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        var Shader = (function () {
            function Shader(gl, arg) {
                var fragment, vertex;
                this._gl = gl;
                vertex = arg.vertex, fragment = arg.fragment;
                this._program = this._gl.createProgram();
                this._vs = this._gl.createShader(this._gl.VERTEX_SHADER);
                this._fs = this._gl.createShader(this._gl.FRAGMENT_SHADER);
                this._gl.attachShader(this._program, this._vs);
                this._gl.attachShader(this._program, this._fs);
                this.compileShader(this._vs, vertex);
                this.compileShader(this._fs, fragment);
                this.link();
                this._value_cache = {};
                this._uniform_cache = {};
                this._attribCache = {};
            }
            Shader.prototype.attribLocation = function (name) {
                var location;
                location = this._attribCache[name];
                if (location === void 0) {
                    location = this._attribCache[name] = this._gl.getAttribLocation(this._program, name);
                }
                return location;
            };
            Shader.prototype.compileShader = function (shader, source) {
                this._gl.shaderSource(shader, source);
                this._gl.compileShader(shader);
                if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
                    throw "Shader Compile Error: " + (this._gl.getShaderInfoLog(shader));
                }
            };
            Shader.prototype.link = function () {
                this._gl.linkProgram(this._program);
                if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
                    throw "Shader Link Error: " + (this._gl.getProgramInfoLog(this._program));
                }
            };
            Shader.prototype.use = function () {
                this._gl.useProgram(this._program);
                return this;
            };
            Shader.prototype.uniformLoc = function (name) {
                var location;
                location = this._uniform_cache[name];
                if (location === void 0) {
                    location = this._uniform_cache[name] = this._gl.getUniformLocation(this._program, name);
                }
                return location;
            };
            Shader.prototype.int = function (name, value) {
                var cached, loc;
                cached = this._value_cache[name];
                if (cached !== value) {
                    this._value_cache[name] = value;
                    loc = this.uniformLoc(name);
                    if (loc) {
                        this._gl.uniform1i(loc, value);
                    }
                }
                return this;
            };
            Shader.prototype.vec2 = function (name, a, b) {
                var loc;
                loc = this.uniformLoc(name);
                if (loc) {
                    this._gl.uniform2f(loc, a, b);
                }
                return this;
            };
            Shader.prototype.float = function (name, value) {
                var cached, loc;
                cached = this._value_cache[name];
                if (cached !== value) {
                    this._value_cache[name] = value;
                    loc = this.uniformLoc(name);
                    if (loc) {
                        this._gl.uniform1f(loc, value);
                    }
                }
                return this;
            };
            return Shader;
        })();
        var Framebuffer = (function () {
            function Framebuffer(gl) {
                this._gl = gl;
                this._buffer = this._gl.createFramebuffer();
            }
            Framebuffer.prototype.bind = function () {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._buffer);
                return this;
            };
            Framebuffer.prototype.unbind = function () {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
                return this;
            };
            Framebuffer.prototype.check = function () {
                var result;
                result = this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER);
                switch (result) {
                    case this._gl.FRAMEBUFFER_UNSUPPORTED:
                        throw 'Framebuffer is unsupported';
                        break;
                    case this._gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                        throw 'Framebuffer incomplete attachment';
                        break;
                    case this._gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                        throw 'Framebuffer incomplete dimensions';
                        break;
                    case this._gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                        throw 'Framebuffer incomplete missing attachment';
                }
                return this;
            };
            Framebuffer.prototype.color = function (texture) {
                this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, texture.target, texture.handle, 0);
                this.check();
                return this;
            };
            return Framebuffer;
        })();
        var Texture = (function () {
            function Texture(gl, params) {
                var _ref, _ref1;
                this._gl = gl;
                if (params == null) {
                    params = {};
                }
                this._channels = this._gl[((_ref = params.channels) != null ? _ref : 'rgba').toUpperCase()];
                if (typeof params.type === 'number') {
                    this._type = params.type;
                }
                else {
                    this._type = this._gl[((_ref1 = params.type) != null ? _ref1 : 'unsigned_byte').toUpperCase()];
                }
                switch (this._channels) {
                    case this._gl.RGBA:
                        this._chancount = 4;
                        break;
                    case this._gl.RGB:
                        this._chancount = 3;
                        break;
                    case this._gl.LUMINANCE_ALPHA:
                        this._chancount = 2;
                        break;
                    default:
                        this._chancount = 1;
                }
                this.target = this._gl.TEXTURE_2D;
                this.handle = this._gl.createTexture();
            }
            Texture.prototype.bind = function (unit) {
                if (unit == null) {
                    unit = 0;
                }
                if (unit > 15) {
                    throw 'Texture unit too large: ' + unit;
                }
                this._gl.activeTexture(this._gl.TEXTURE0 + unit);
                this._gl.bindTexture(this.target, this.handle);
                return this;
            };
            Texture.prototype.setSize = function (width, height) {
                this._width = width;
                this._height = height;
                this._gl.texImage2D(this.target, 0, this._channels, this._width, this._height, 0, this._channels, this._type, null);
                return this;
            };
            Texture.prototype.upload = function (data) {
                this._width = data.width;
                this._height = data.height;
                this._gl.texImage2D(this.target, 0, this._channels, this._channels, this._type, data);
                return this;
            };
            Texture.prototype.linear = function () {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
                return this;
            };
            Texture.prototype.nearest = function () {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
                return this;
            };
            Texture.prototype.clampToEdge = function () {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
                return this;
            };
            Texture.prototype.repeat = function () {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
                return this;
            };
            return Texture;
        })();
        var NodeH = (function () {
            function NodeH(gl, width, height) {
                this.use = function () {
                    return this._fbo.bind();
                };
                this.bind = function (unit) {
                    return this._texture.bind(unit);
                };
                this.end = function () {
                    return this._fbo.unbind();
                };
                this.resize = function (width, height) {
                    this._width = width;
                    this._height = height;
                    return this._texture.bind(0).setSize(this._width, this._height);
                };
                var floatExt;
                this._gl = gl;
                this._width = width;
                this._height = height;
                gl.getExtension('OES_texture_float');
                this._texture = new Texture(this._gl, {
                    type: this._gl.FLOAT
                }).bind(0).setSize(this._width, this._height).nearest().clampToEdge();
                this._fbo = new Framebuffer(this._gl).bind().color(this._texture).unbind();
            }
            return NodeH;
        })();
        var vertexShaderBlit = '\
attribute vec4 position;\n\
varying vec2 texcoord;\n\
void main(){\n\
    texcoord = position.xy*0.5+0.5;\n\
    gl_Position = position;\n\
}';
        var vertexShaderBlit1 = '\
uniform float times;\n\
uniform vec2 center;\n\
attribute vec4 position;\n\
varying vec2 texcoord;\n\
void main(){\n\
    texcoord = ((position.xy - center)* 0.5 * times + center * 0.5 + 0.5);\n\
    gl_Position = position;\n\
}';
        var fragmentShaderBlit = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;';
        var fragmentShaderHill = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;\n\
uniform vec2 viewport;\
void main(){\
    bool newPos = true;\
    float testVal;\
    float currentVal = 0.0;\
    vec2 texPos;\
    vec2 newTexPos;\
    texPos = texcoord;\
    newTexPos = texcoord;\
    \
    int flag = 0;\
    const int band = 5;\
    const int band1 = 5;\
    currentVal = texture2D(source, texPos).a;\
    for(int i=-band; i<=band; i++){\
        for(int j=-band; j<=band; j++){\
            vec2 offset = vec2(i,j)/viewport;\
            float Val = texture2D(source, texPos+offset).a;\
            if (Val > currentVal) {\
                flag = 1;\
            }\
        }\
    }\
    if(flag==0){\
        for(int i=0;i<2;i++){\
            newPos = false;\
            currentVal = texture2D(source, texPos).a;\
            for(int x=0; x>=-band1; x--){\
                for(int y=-band1; y<=band1; y++){\
                    if(x==0&&y<=0)continue;\
                    vec2 off = vec2(x,y)/viewport;\
                    testVal = texture2D(source, texPos+off).a;\
                    if (testVal >= currentVal) {\
                        currentVal = testVal;\
                        newPos = true;\
                        newTexPos = texPos + off;\
                    }\
                }\
            }\
            texPos = newTexPos;\
            if(newPos==false) {break;}\
        }\
    }else{\
        for(int i=0; i<2; i++){\
            newPos = false;\
            currentVal = texture2D(source, texPos).a;\
            for(int x=-band; x<=band; x++){\
                for(int y=-band; y<=band; y++){\
                    vec2 off = vec2(x,y)/viewport;\
                    testVal = texture2D(source, texPos+off).a;\
                    if (testVal >currentVal) {\
                        currentVal = testVal;\
                        newPos = true;\
                        newTexPos = texPos + off;\
                    }\
                }\
            }\
            texPos = newTexPos;\
            if(newPos==false) {break;}\
        }\
    }\
    gl_FragColor = vec4(vec2(texPos), currentVal, 1.0);\
}';
        var fragmentShaderFinalHill = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\nuniform sampler2D source;\n\
varying vec2 texcoord;\n\
uniform vec2 viewport;\n\
void main(){\
    vec2 newTexPos;\
    newTexPos = texcoord;\
    for(int i=0;i<16;i++){\
        newTexPos = vec2(texture2D(source, newTexPos).r, texture2D(source, newTexPos).g);\
        if(newTexPos.x==texture2D(source, newTexPos).r&&newTexPos.y==texture2D(source, newTexPos).g) {break;}\
    }\
    float x = floor(newTexPos.x*viewport.x);\
    float y = floor(newTexPos.y*viewport.y);\
    gl_FragColor = vec4(x,y,0.0,0.0);\
}';
        var vsCopy = vertexShaderBlit;
        var fsCopy = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;\n\
void main(){\
    float intensity = texture2D(source, texcoord).a;\
    gl_FragColor = vec4(intensity);\
}';
        var Heights = (function () {
            function Heights(heatmap, gl, width, height) {
                var i, _i, _ref;
                this._heatmap = heatmap;
                this._gl = gl;
                this._width = width;
                this._height = height;
                this._textureBuffer = new Float32Array(this._width * this._height * 4);
                this._shader = new Shader(this._gl, {
                    vertex: '\
attribute vec4 position, intensity;\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
uniform vec2 viewport;\n\
void main(){\n\
    dim = abs(position.zw);\n\
    off = position.zw;\n\
    vec2 pos = position.xy + position.zw;\n\
    vIntensity = intensity.x;\n\
    gl_Position = vec4((pos / viewport) * 2.0 - 1.0, 0.0, 1.0);\n\
}',
                    fragment: '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
void main(){\n\
    float falloff = (1.0 - smoothstep(0.0, 1.0, length(off / dim)));\n\
    float intensity = falloff * vIntensity;\n\
    gl_FragColor = vec4(intensity, intensity, intensity, intensity);\n\
}'
                });
                this._rawEdgeShader = new Shader(this._gl, {
                    vertex: '\
attribute vec4 position, intensity;\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
uniform vec2 viewport;\n\
void main(){\n\
    dim = abs(position.zw);\n\
    off = position.zw;\n\
    vec2 pos = position.xy + position.zw;\n\
    vIntensity = intensity.x;\n\
    gl_Position = vec4((pos/viewport)*2.0-1.0, 0.0, 1.0);\n\
}',
                    fragment: '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
void main(){\n\
    float falloff = (1.0);\n\
    float intensity = falloff * vIntensity;\n\
    gl_FragColor = vec4(-intensity);\n\
}'
                });
                this._hillShader = new Shader(this._gl, {
                    vertex: vertexShaderBlit,
                    //fragment: this.getShaderByScriptID("fragmentShaderHill")
                    fragment: fragmentShaderHill
                });
                this._dumpHillShader = new Shader(this._gl, {
                    vertex: vertexShaderBlit,
                    fragment: fragmentShaderFinalHill
                });
                this._copyShader = new Shader(this._gl, {
                    vertex: vsCopy,
                    fragment: fsCopy
                });
                this._nodeBack = new NodeH(this._gl, this._width, this._height);
                this.nodeFront = new NodeH(this._gl, this._width, this._height);
                this._nodeHill = new NodeH(this._gl, this._width, this._height);
                this._nodeDensity = new NodeH(this._gl, this._width, this._height);
                //for Nodes
                this._vertexBuffer = this._gl.createBuffer();
                this._vertexSize = 8;
                this._maxPointCount = 1024 * 256;
                this._vertexBufferData = new Float32Array(this._maxPointCount * this._vertexSize * 6);
                this._vertexBufferViews = [];
                for (i = _i = 0, _ref = this._maxPointCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this._vertexBufferViews.push(new Float32Array(this._vertexBufferData.buffer, 0, i * this._vertexSize * 6));
                }
                this._bufferIndex = 0;
                this._pointCount = 0;
                //for Edges
                this._edgevertexBuffer = this._gl.createBuffer();
                this._edgevertexSize = 8;
                this._edgemaxPointCount = 1024 * 256;
                this._edgevertexBufferData = new Float32Array(this._edgemaxPointCount * this._edgevertexSize * 6);
                this._edgevertexBufferViews = [];
                for (i = _i = 0, _ref = this._edgemaxPointCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this._edgevertexBufferViews.push(new Float32Array(this._edgevertexBufferData.buffer, 0, i * this._edgevertexSize * 6));
                }
                this._edgebufferIndex = 0;
                this._edgepointCount = 0;
            }
            //将某个script转化成字符串
            Heights.prototype.getShaderByScriptID = function (id) {
                var shaderScript = document.getElementById(id);
                if (!shaderScript) {
                    alert("Error: getShader.");
                    return null;
                }
                var str = "";
                var k = shaderScript.firstChild;
                while (k) {
                    if (k.nodeType == 3) {
                        str += k.textContent;
                    }
                    k = k.nextSibling;
                }
                return str;
            };
            Heights.prototype.resize = function (width, height) {
                this._width = width;
                this._height = height;
                this._textureBuffer = new Float32Array(this._width * this._height * 4);
                this._nodeHill.resize(this._width, this._height);
                this._nodeBack.resize(this._width, this._height);
                this._nodeDensity.resize(this._width, this._height);
                return this.nodeFront.resize(this._width, this._height);
            };
            Heights.prototype.clear = function () {
                this.nodeFront.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                return this.nodeFront.end();
            };
            //将点画到帧缓冲区（nodeFront）
            Heights.prototype.update = function () {
                var intensityLoc, positionLoc;
                if (this._pointCount > 0) {
                    this._gl.enable(this._gl.BLEND);
                    this.nodeFront.use();
                    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
                    this._gl.bufferData(this._gl.ARRAY_BUFFER, this._vertexBufferViews[this._pointCount], this._gl.STREAM_DRAW);
                    positionLoc = this._shader.attribLocation('position');
                    intensityLoc = this._shader.attribLocation('intensity');
                    this._gl.enableVertexAttribArray(1);
                    this._gl.vertexAttribPointer(positionLoc, 4, this._gl.FLOAT, false, 8 * 4, 0 * 4);
                    this._gl.vertexAttribPointer(intensityLoc, 4, this._gl.FLOAT, false, 8 * 4, 4 * 4);
                    this._shader.use().vec2('viewport', this._width, this._height);
                    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._pointCount * 6);
                    this._gl.disableVertexAttribArray(1);
                    this._pointCount = 0;
                    this._bufferIndex = 0;
                    this.nodeFront.end();
                    this._nodeDensity = this.nodeFront;
                    this._gl.disable(this._gl.BLEND);
                }
            };
            //将边画到帧缓冲区（nodeFront）
            Heights.prototype.updateEdges = function () {
                var intensityLoc, positionLoc;
                if (this._edgepointCount > 0) {
                    this.nodeFront.use();
                    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._edgevertexBuffer);
                    this._gl.bufferData(this._gl.ARRAY_BUFFER, this._edgevertexBufferViews[this._edgepointCount], this._gl.STREAM_DRAW);
                    positionLoc = this._rawEdgeShader.attribLocation('position');
                    intensityLoc = this._rawEdgeShader.attribLocation('intensity');
                    this._gl.enableVertexAttribArray(1);
                    this._gl.vertexAttribPointer(positionLoc, 4, this._gl.FLOAT, false, 8 * 4, 0 * 4);
                    this._gl.vertexAttribPointer(intensityLoc, 4, this._gl.FLOAT, false, 8 * 4, 4 * 4);
                    this._rawEdgeShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._edgepointCount * 6);
                    this._gl.disableVertexAttribArray(1);
                    this._edgepointCount = 0;
                    this._edgebufferIndex = 0;
                    this.nodeFront.end();
                }
            };
            Heights.prototype.addVertex = function (x, y, xs, ys, intensity) {
                this._vertexBufferData[this._bufferIndex++] = x;
                this._vertexBufferData[this._bufferIndex++] = y;
                this._vertexBufferData[this._bufferIndex++] = xs;
                this._vertexBufferData[this._bufferIndex++] = ys;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                return this._vertexBufferData[this._bufferIndex++] = intensity;
            };
            Heights.prototype.addNode = function (x, y, size, intensity) {
                var s;
                if (size == null) {
                    size = 50;
                }
                if (intensity == null) {
                    intensity = 0.2;
                }
                if (this._pointCount >= this._maxPointCount - 1) {
                    this.update();
                }
                s = size / 2;
                this.addVertex(x, y, -s, -s, intensity);
                this.addVertex(x, y, +s, -s, intensity);
                this.addVertex(x, y, -s, +s, intensity);
                this.addVertex(x, y, -s, +s, intensity);
                this.addVertex(x, y, +s, -s, intensity);
                this.addVertex(x, y, +s, +s, intensity);
                return this._pointCount += 1;
            };
            Heights.prototype.addEdgeVertex = function (x, y, xs, ys, intensity) {
                this._edgevertexBufferData[this._edgebufferIndex++] = x;
                this._edgevertexBufferData[this._edgebufferIndex++] = y;
                this._edgevertexBufferData[this._edgebufferIndex++] = xs;
                this._edgevertexBufferData[this._edgebufferIndex++] = ys;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                return this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
            };
            Heights.prototype.addEdge = function (x0, y0, x1, y1, size, intensity) {
                var s, x, y;
                if (size == null) {
                    size = 50;
                }
                if (intensity == null) {
                    intensity = 0.2;
                }
                if (this._edgepointCount >= this._edgemaxPointCount - 1) {
                    this.updateEdges();
                }
                var lineLength = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
                x = (x0 + x1) / 2;
                y = (y0 + y1) / 2;
                size = size / 2;
                var px0, px1, px2, px3, px4, py0, py1, py2, py3, py4;
                py0 = (x1 - x0) / lineLength;
                px0 = (y0 - y1) / lineLength;
                px1 = x0 + px0 * size;
                py1 = y0 + py0 * size;
                px2 = x1 + px0 * size;
                py2 = y1 + py0 * size;
                px3 = x0 - px0 * size;
                py3 = y0 - py0 * size;
                px4 = x1 - px0 * size;
                py4 = y1 - py0 * size;
                this.addEdgeVertex(x, y, px1 - x, py1 - y, intensity);
                this.addEdgeVertex(x, y, px2 - x, py2 - y, intensity);
                this.addEdgeVertex(x, y, px3 - x, py3 - y, intensity);
                this.addEdgeVertex(x, y, px3 - x, py3 - y, intensity);
                this.addEdgeVertex(x, y, px2 - x, py2 - y, intensity);
                this.addEdgeVertex(x, y, px4 - x, py4 - y, intensity);
                this._edgepointCount += 1;
            };
            //将帧缓冲区的内容copy回本地(CPU上的内存)
            Heights.prototype.dumpDensityMapTexureBuffer = function () {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._heatmap.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this._nodeDensity.bind(0);
                this._nodeBack.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                this._copyShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
                this._gl.readPixels(0, 0, this._width, this._height, this._gl.RGBA, this._gl.FLOAT, this._textureBuffer);
                this._nodeBack.end();
            };
            //获得当前本地端内存所存储的帧缓冲区内容
            Heights.prototype.getTextureBuffer = function () {
                return this._textureBuffer;
            };
            //进行点聚合爬山算法
            Heights.prototype.hillClimbing = function () {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._heatmap.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this.nodeFront.bind(0);
                this._nodeHill.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                this._hillShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
                this._nodeHill.end();
            };
            //将爬山结果copy回本地端内存缓冲区
            Heights.prototype.dumpFinalHillClimbingResult = function () {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._heatmap.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this._nodeHill.bind(0);
                this._nodeBack.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                this._dumpHillShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
                this._gl.readPixels(0, 0, this._width, this._height, this._gl.RGBA, this._gl.FLOAT, this._textureBuffer);
                this._nodeBack.end();
            };
            return Heights;
        })();
        var WebGLHeatmap = (function () {
            function WebGLHeatmap(arg) {
                var _ref;
                _ref = arg != null ? arg : {}, this.canvas = _ref.canvas, this._width = _ref.width, this._height = _ref.height;
                if (!this.canvas) {
                    this.canvas = document.createElement('canvas');
                }
                this._gl = this.canvas.getContext('experimental-webgl', { antialias: true });
                if (this._gl === null) {
                    throw 'WebGL not supported';
                }
                this._gl.enableVertexAttribArray(0);
                this._gl.getExtension('OES_texture_float');
                this._gl.blendFunc(this._gl.ONE, this._gl.ONE);
                var alphaRange;
                var _ref1 = alphaRange != null ? alphaRange : [0, 1], alphaStart = _ref1[0], alphaEnd = _ref1[1];
                var output = "vec4 alphaFun(vec3 color, float intensity){\n    float alpha = smoothstep(" + (alphaStart.toFixed(8)) + ", " + (alphaEnd.toFixed(8)) + ", intensity);\n    return vec4(color*alpha, alpha);\n}";
                /*-----------------different color scheme------------*/
                //var getColorFun = 'float a0 = 0.3; float a1 = 0.6; vec4 getColor(float intensity){\n vec4 color;\n if(intensity>=0.0) {if(intensity>=level6)color= vec4(0.03,0.19,0.42,1);else if(intensity>=level5)color= vec4(0.03,0.32,0.61,1);else if(intensity>=level4)color= vec4(0.13,0.44,0.71,1);else if(intensity>=level3)color= vec4(0.26,0.57,0.78,1);else if(intensity>=level2)color= vec4(0.42,0.68,0.84,1);else if(intensity>=level1)color= vec4(0.62,0.80,0.88,1);else if(intensity>=level0)color= vec4(0.78,0.86,0.94,1); else color=vec4(0,0,0,intensity);}\nelse{color = vec4((1.0+intensity)*0.7,(1.0+intensity)*0.7,1.0,1.0);}\n    return color;\n}';
                var getColorFun = 'float a0 = 0.3; float a1 = 0.6; vec4 getColor(float intensity){\n vec4 color;\n if(intensity>=0.0) {if(intensity>=level6)color= vec4(0.1,0.2,0.4,0.85);else if(intensity>=level5)color= vec4(0.1,0.2,0.5,0.7);else if(intensity>=level4)color= vec4(0.15,0.4,0.7,0.9);else if(intensity>=level3)color= vec4(0.15,0.4,0.7,0.7);else if(intensity>=level2)color= vec4(0.2,0.4,0.6,0.60);else if(intensity>=level1)color= vec4(0.55*a1,0.8*a1,0.95*a1,a1);else if(intensity>=level0)color= vec4(0.55*a0,0.8*a0,0.95*a0,a0); else color=vec4(0,0,0,intensity);}\nelse{color = vec4((1.0+intensity)*0.7,(1.0+intensity)*0.7,1.0,1.0);}\n  return color;\n}';
                var rawgetColorFun = 'vec3 getColor(float intensity){\n    vec3 blue = vec3(0.0, 0.0, 1.0);\n    vec3 cyan = vec3(0.0, 1.0, 1.0);\n    vec3 green = vec3(0.0, 1.0, 0.0);\n    vec3 yellow = vec3(1.0, 1.0, 0.0);\n    vec3 red = vec3(1.0, 0.0, 0.0);\n\n    vec3 color = (\n        fade(-0.25, 0.25, intensity)*blue +\n        fade(0.0, 0.5, intensity)*cyan +\n        fade(0.25, 0.75, intensity)*green +\n        fade(0.5, 1.0, intensity)*yellow +\n        smoothstep(0.75, 1.0, intensity)*red\n    );\n    return color;\n}';
                this._shader = new Shader(this._gl, {
                    vertex: vertexShaderBlit1,
                    fragment: fragmentShaderBlit + ("uniform float level0;\nuniform float level1;\nuniform float level2;\nuniform float level3;\nuniform float level4;\nuniform float level5;\nuniform float level6;\n") + ("float linstep(float low, float high, float value){\n    return clamp((value-low)/(high-low), 0.0, 1.0);\n}\n\nfloat fade(float low, float high, float value){\n    float mid = (low+high)*0.5;\n    float range = (high-low)*0.5;\n    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);\n    return smoothstep(0.0, 1.0, x);\n}\n\n" + getColorFun + "\n" + "\n\nvoid main(){\n    float intensity = (texture2D(source, texcoord).r);\n    vec4 color = getColor(intensity);\n   gl_FragColor = color;\n}")
                });
                this._rawshader = new Shader(this._gl, {
                    vertex: vertexShaderBlit1,
                    fragment: fragmentShaderBlit + ("float linstep(float low, float high, float value){\n    return clamp((value-low)/(high-low), 0.0, 1.0);\n}\n\nfloat fade(float low, float high, float value){\n    float mid = (low+high)*0.5;\n    float range = (high-low)*0.5;\n    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);\n    return smoothstep(0.0, 1.0, x);\n}\n\n" + rawgetColorFun + "\n" + output + "\n\nvoid main(){\n    float intensity = smoothstep(0.0, 1.0, texture2D(source, texcoord).r);\n    vec3 color = getColor(intensity);\n    gl_FragColor = alphaFun(color, intensity);\n}")
                });
                if (this._width == null) {
                    this._width = this.canvas.offsetWidth || 2;
                }
                if (this._height == null) {
                    this._height = this.canvas.offsetHeight || 2;
                }
                this.canvas.width = this._width;
                this.canvas.height = this._height;
                this._gl.viewport(0, 0, this._width, this._height);
                this.quad = this._gl.createBuffer();
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.quad);
                var quad = new Float32Array([-1, -1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1, 1, 1, 0, 1]);
                this._gl.bufferData(this._gl.ARRAY_BUFFER, quad, this._gl.STATIC_DRAW);
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
                this._heights = new Heights(this, this._gl, this._width, this._height);
            }
            WebGLHeatmap.prototype.adjustSize = function () {
                var canvasHeight, canvasWidth;
                canvasWidth = this.canvas.offsetWidth || 2;
                canvasHeight = this.canvas.offsetHeight || 2;
                if (this._width !== canvasWidth || this._height !== canvasHeight) {
                    this._gl.viewport(0, 0, canvasWidth, canvasHeight);
                    this.canvas.width = canvasWidth;
                    this.canvas.height = canvasHeight;
                    this._width = canvasWidth;
                    this._height = canvasHeight;
                    this._heights.resize(this._width, this._height);
                }
            };
            WebGLHeatmap.prototype.display = function (x, y, times, contourForIntensity) {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this._heights.nodeFront.bind(0);
                if (!times)
                    times = 1.0;
                if (!x)
                    x = 0;
                if (!y)
                    y = 0;
                if (!contourForIntensity) {
                    contourForIntensity = [1, 1, 1, 1, 1, 1, 1];
                }
                if (this._gradientTexture) {
                    this._gradientTexture.bind(1);
                }
                var flag = true;
                if (MapArea.config.shaderStyle == null)
                    flag = true;
                else if (MapArea.config.shaderStyle == 0)
                    flag = true;
                else
                    flag = false;
                if (flag) {
                    this._shader.use().int('source', 0).int('gradientTexture', 1).float('level0', contourForIntensity[0]).float('level1', contourForIntensity[1]).float('level2', contourForIntensity[2]).float('level3', contourForIntensity[3]).float('level4', contourForIntensity[4]).float('level5', contourForIntensity[5]).float('level6', contourForIntensity[6]).float('times', times).vec2('center', x, y);
                }
                else {
                    this._rawshader.use().int('source', 0).int('gradientTexture', 1).float('times', times).vec2('center', x, y);
                }
                return this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
            };
            WebGLHeatmap.prototype.dumpDensityMapTexureBuffer = function () {
                this._heights.dumpDensityMapTexureBuffer();
            };
            WebGLHeatmap.prototype.getTextureBuffer = function () {
                return this._heights.getTextureBuffer();
            };
            WebGLHeatmap.prototype.getDensityMapTextureBuffer = function () {
                return this._heights.getTextureBuffer();
            };
            WebGLHeatmap.prototype.getHillClimbingResultTextureBuffer = function () {
                return this._heights.getTextureBuffer();
            };
            WebGLHeatmap.prototype.hillClimbing = function () {
                this._heights.hillClimbing();
            };
            WebGLHeatmap.prototype.dumpFinalHillClimbingResult = function () {
                this._heights.dumpFinalHillClimbingResult();
            };
            WebGLHeatmap.prototype.addNode = function (x, y, size, intensity) {
                return this._heights.addNode(x, y, size, intensity);
            };
            WebGLHeatmap.prototype.updateNodes = function () {
                return this._heights.update();
            };
            WebGLHeatmap.prototype.addEdge = function (x0, y0, x1, y1, size, intensity) {
                return this._heights.addEdge(x0, y0, x1, y1, size, intensity);
            };
            WebGLHeatmap.prototype.updateEdges = function () {
                return this._heights.updateEdges();
            };
            WebGLHeatmap.prototype.clear = function () {
                return this._heights.clear();
            };
            WebGLHeatmap.prototype.changTimes = function (x, y, times) {
                //this._width *= times;
                //this._height *= times;
                //this._gl.viewport( 0, 0, this._width, this._height );
                this._gl.viewport(x, y, this._width * times, this._height * times);
                //this._gl.viewport( -x * ( times - 1 ), -( this._height - y ) * ( times - 1 ), this._width * times, this._height * times );
            };
            WebGLHeatmap.prototype.returnToInitial = function () {
                this._gl.viewport(0, 0, this._width, this._height);
            };
            return WebGLHeatmap;
        })();
        MapArea.WebGLHeatmap = WebGLHeatmap;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./WebGLLod.ts" />
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        var config = (function () {
            function config() {
            }
            config.setKernelBandWidth = function (val) {
                config.kernelBandwidth = val;
                config.LoDMap.DrawCanvas();
            };
            config.setIntensity = function (val) {
                config.intensity = val;
                config.LoDMap.DrawCanvas();
            };
            config.setShader = function (val) {
                config.shaderStyle = val;
                config.LoDMap.DrawCanvas();
            };
            config.kernelBandwidth = 64;
            config.intensity = 3;
            config.shaderStyle = 0;
            config.stops = [0.007, 0.02, 0.037, 0.065, 0.114, 0.21, 0.295];
            return config;
        })();
        MapArea.config = config;
        var HeatMapLayer = (function () {
            function HeatMapLayer(id, parentContainer, canvasWidth, canvasHeight, unitWidth, unitHeight, topOffset, leftOffset, nodeArray) {
                config.LoDMap = this;
                this._id = id;
                this._parent_container = parentContainer;
                this._canvas_width = canvasWidth * unitWidth;
                this._canvas_height = canvasHeight * unitHeight;
                this._canvas_top_offset = topOffset;
                this._canvas_left_offset = leftOffset;
                //this._unit_size = unitSize;
                this._nodeArray = nodeArray.map(function (d) {
                    return { x: d.x * unitWidth, y: d.y * unitHeight, value: d.value };
                });
                this.addAndInitCanvas();
                this.DrawCanvas();
            }
            //在html上添加canvas并初始化，热力图和LoD就画在这个canvas上
            HeatMapLayer.prototype.addAndInitCanvas = function () {
                this._canvas = document.createElement('canvas');
                this._canvas.id = this._id;
                this._canvas.height = this._canvas_height;
                this._canvas.width = this._canvas_width;
                this._canvas.style.top = this._canvas_top_offset + 'px';
                this._canvas.style.left = this._canvas_left_offset + 'px';
                this._parent_container.appendChild(this._canvas);
                //创建热力图
                this._LoD = new MapArea.WebGLHeatmap({ canvas: this._canvas });
                //初始化像素矩阵
                var width = this._LoD.canvas.width;
                var height = this._LoD.canvas.height;
                this._pixelMatrix = new Array(this._canvas_height);
                for (var i = 0; i < height; ++i) {
                    this._pixelMatrix[i] = new Array(this._canvas_width);
                }
                ;
                //初始化等高线值,这里设置为7层
                this._contourForIntensity = new Array(7);
                for (var i = 0, len = this._contourForIntensity.length; i < len; ++i) {
                    this._contourForIntensity[i] = 0.0;
                }
                ;
            };
            HeatMapLayer.prototype.ScaleCanvas = function (scale) {
                this._canvas_width *= scale;
                this._canvas_height *= scale;
                this._canvas_top_offset *= (1 + scale);
                this._canvas_left_offset *= scale;
                this._canvas.height = this._canvas_height;
                this._canvas.width = this._canvas_width;
                this._canvas.style.top = this._canvas_top_offset + 'px';
                this._canvas.style.left = this._canvas_left_offset + 'px';
                //初始化像素矩阵
                var width = Math.ceil(this._canvas_width);
                var height = Math.ceil(this._canvas_height);
                this._pixelMatrix = new Array(height);
                for (var i = 0; i < height; ++i) {
                    this._pixelMatrix[i] = new Array(width);
                }
                ;
                this._nodeArray = this._nodeArray.map(function (d) {
                    return { x: d.x * scale, y: d.y * scale, value: d.value };
                });
                this.DrawCanvas();
            };
            //每次页面刷新，或者Bing Map的视角改变时，就根据当前Bing Map的状态重新绘制热力图或LoD
            HeatMapLayer.prototype.DrawCanvas = function () {
                var dStart = new Date();
                this.getEdgesNodesAndDraw();
                var nSpan = (new Date()).getMilliseconds() - dStart.getMilliseconds();
                console.log("overall time is :" + nSpan + "ms");
            };
            //1、统计pixel矩阵上每个点出现的次数，然后根据每个Pixel点上不同的点个数赋予不同的强度，然后画到帧缓冲区中;并将当前的densityMap的结果copy回CPU端
            //2、根据densityMap的强度矩阵获得强度矩阵的最大值，并设置等高线的值;
            HeatMapLayer.prototype.getEdgesNodesAndDraw = function () {
                this._LoD.clear(); //每次重新绘制图时都需要将GPU的帧缓冲区清零
                //var s: string = "[";
                //this._nodeArray.forEach(( d ) => {
                //    s += '{"x":'+d.x+',"y":'+d.y+',"value":'+d.value+'},'
                //});
                //s += "]";
                //console.log( s );
                this.drawNodes(this._nodeArray); //画点，渲染的结果在帧缓冲区中
                this._LoD.display(0, 0, 1.0, this._contourForIntensity); //将最终渲染的帧缓冲区的结果展示到屏幕上
            };
            HeatMapLayer.prototype.drawNodes = function (nodes) {
                //初始像素矩阵为零
                var width = this._pixelMatrix[0].length;
                var height = this._pixelMatrix.length;
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++)
                        this._pixelMatrix[i][j] = 0;
                }
                for (var i = 0, len = nodes.length; i < len; ++i) {
                    var x = Math.floor(nodes[i].x); //* this._unit_size;
                    var y = Math.floor(height - 1 - nodes[i].y); //* this._unit_size;
                    if (this._pixelMatrix[y][x] != null)
                        this._pixelMatrix[y][x] = nodes[i].value;
                    else
                        console.log(this._pixelMatrix[y]);
                }
                //获得当前bing Map的放大倍数
                var zoomLevel = 5; //this._map.getZoom();
                //根据不同的zoomLevel设置不同的强度基数和核半径
                var density = config.intensity;
                density = density * zoomLevel / 5.0; //Math.max(zoomLevel-4.0, 1.0);
                var ans = 0;
                var kernelBand = 0;
                var BaseKernelBand = config.kernelBandwidth;
                if (zoomLevel < 5.0) {
                    kernelBand = BaseKernelBand * Math.pow(0.75, 5.0 - zoomLevel);
                }
                else
                    kernelBand = BaseKernelBand * Math.atan(zoomLevel - 3.3) * Math.pow(1.05, zoomLevel - 5.0);
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++) {
                        if (this._pixelMatrix[i][j] > 0) {
                            //遍历点聚合后的像素矩阵，将点的坐标以及其对应的核半径和强度值加入点缓冲区中
                            this._LoD.addNode(j, i, kernelBand, Math.sqrt(this._pixelMatrix[i][j]) * density / 300);
                            ans++;
                        }
                    }
                }
                //在GPU中画点的热力图，帧缓冲与纹理nodeFront绑定
                this._LoD.updateNodes();
                // get the Maximum Val of density from the retrieved Buffer, and compute the contour Map
                //画完热力图，将热力图的强度矩阵拷贝回CPU端，CPU端计算热力图中的最大强度，然后根据这个最大强度设置等高线的值。
                this.getTextureBufferIntensity(null);
            };
            HeatMapLayer.prototype.getTextureBufferIntensity = function (textureBuffer) {
                // dump the densityMap from GPU's FrameBuffer (bind the TextureBuffer)
                this._LoD.dumpDensityMapTexureBuffer();
                if (textureBuffer == null)
                    textureBuffer = this._LoD.getDensityMapTextureBuffer();
                var maxVal = 0;
                for (var idx = 0, len = textureBuffer.length; idx < len; idx += 16) {
                    maxVal = Math.max(textureBuffer[idx], maxVal);
                }
                //var rate = [0.01,0.02,0.04,0.08,0.15,0.19,0.28];
                if (maxVal == 0)
                    maxVal = 1.0;
                //提前估算好各个等高线的值与最大值的比率，然后根据得到的densityMap的最大值计算出当前各个等高线的值
                var rate = config.stops;
                for (var idx = 0, len = this._contourForIntensity.length; idx < len; idx++) {
                    this._contourForIntensity[idx] = maxVal * rate[idx];
                }
            };
            //zoom in zoom out 操作
            HeatMapLayer.prototype.transform = function (times, centerX, centerY) {
                //if ( type == 1 ) {//zoom in 放大
                //    //this._LoD.display( x / this._canvas.width * 2 - 1,( this._canvas.height - y ) / this._canvas.height * 2 - 1, 1 / ( 1 + times ), this._contourForIntensity );
                //    var scale = ( 1 + times );
                //    this._canvas.style.width = this._canvas_width * scale + "px";
                //    this._canvas.style.height = this._canvas_height * scale + "px";
                //    this._LoD.changTimes( x, y, scale );
                //    this._LoD.display( 0, 0, 1.0, this._contourForIntensity );
                //}
                //else if ( type == 0 ) {//zoom out 缩小
                //    var scale = 1 / ( 1 + times );
                //    this._canvas.style.width = this._canvas_width * scale + "px";
                //    this._canvas.style.height = this._canvas_height * scale + "px";
                //    this._LoD.changTimes( x, y, scale );
                //    this._LoD.display( 0, 0, 1.0, this._contourForIntensity );
                //}
                //var l = Math.sqrt( this._canvas_height * this._canvas_height + this._canvas_width * this._canvas_width );
                //var widthScale = ( this._canvas_width / l ) * times;
                //var heightScale = ( this._canvas_height / l ) * times;
                this._canvas.width = this._canvas_width * times;
                this._canvas.height = this._canvas_height * times;
                this._LoD.changTimes(0, 0, times);
                this._LoD.display(0, 0, 1.0, this._contourForIntensity);
                //this._LoD.returnToInitial();
            };
            //平移操作
            HeatMapLayer.prototype.transformPan = function (xDif, yDif, times) {
                this._canvas.style.top = this._canvas_top_offset * times + yDif + 'px';
                this._canvas.style.left = this._canvas_left_offset * times + xDif + 'px';
                this._LoD.display(0, 0, 1.0, this._contourForIntensity);
            };
            return HeatMapLayer;
        })();
        MapArea.HeatMapLayer = HeatMapLayer;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./HeatmapLayer.ts" />
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        var SOMMap = (function (_super) {
            __extends(SOMMap, _super);
            function SOMMap(element, manyLens) {
                var _this = this;
                _super.call(this, element, manyLens);
                // private _lensPane: Pane.ClassicLensPane;
                //private _colorPalettes: string[] = ["rgb(99,133,255)", "rgb(98,252,250)", "rgb(99,255,127)", "rgb(241,255,99)", "rgb(255,187,99)", "rgb(255,110,99)", "rgb(255,110,99)"];
                this._maps = [];
                this._heatMaps = [];
                this._scale = 1;
                this._left_offset = 0;
                this._top_offset = null;
                this._translate_x = 0;
                this._translate_y = 0;
                this._map_gap = 10;
                this._unit_width = 20;
                this._unit_height = 20;
                this._colorPalettes = ["rgb(198,219,239)", "rgb(158,202,225)", "rgb(107, 174, 214)", "rgb(66, 146, 198)", "rgb(33, 113, 181)", "rgb(8, 81, 156)", "rgb(8, 81, 156)"];
                // this._lensPane = new Pane.ClassicLensPane(element, manyLens);
                this._element.attr("height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });
                this._total_width = parseFloat(this._element.style("width"));
                this._heatmap_container = document.createElement('div');
                this._heatmap_container.id = "heatmap-container";
                this._heatmap_container.style.left = this._element.node().offsetLeft.toString() + "px";
                this._heatmap_container.style.top = this._element.node().offsetTop.toString() + "px";
                this._heatmap_container.style.height = this._element.node().offsetHeight.toString() + "px";
                this._heatmap_container.style.width = this._element.node().offsetWidth.toString() + "px";
                document.getElementById("mapView").insertBefore(this._heatmap_container, this._element.node());
                this._center_x = 0.5 * parseFloat(this._element.style("width"));
                this._center_y = 0.5 * parseFloat(this._element.style("height"));
                this._zoom = d3.behavior.zoom().scaleExtent([0.5, 1.5]).on("zoomstart", function () {
                    var p = d3.mouse(_this._element.node());
                    _this._zoom.center([p[0], _this._center_y]);
                }).on("zoom", function () {
                    clearInterval(_this._move_view_timer);
                    var currentLevel = d3.event.scale;
                    _this._heatMaps.forEach(function (d, i) {
                        if (_this._scale != currentLevel) {
                            d.transform(currentLevel, 0, 0);
                        }
                        d.transformPan(d3.event.translate[0], d3.event.translate[1], currentLevel);
                    });
                    _this._element.selectAll(".units").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    _this._element.selectAll(".lens").attr("transform", function (d) {
                        if (d.cx == 0) {
                            d.cx = d3.event.translate[0];
                            d.cy = d3.event.translate[1];
                        }
                        d.scale = d3.event.scale;
                        d.tx = d3.event.translate[0] - d.cx * d.scale;
                        d.ty = d3.event.translate[1] - d.cy * d.scale;
                        return "translate(" + [d.tx, d.ty] + ")scale(" + d3.event.scale + ")";
                    });
                    _this._translate_x = d3.event.translate[0];
                    _this._translate_y = d3.event.translate[1];
                    _this._scale = currentLevel;
                });
                this._element.call(this._zoom);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "showVis", this.ShowVis);
            }
            SOMMap.prototype.Render = function () {
                //this._lensPane.Render();
            };
            SOMMap.prototype.ShowVis = function (visData) {
                var _this = this;
                this._maps.push(visData);
                if (this._top_offset == null) {
                    this._top_offset = (parseFloat(this._element.style("height")) - visData.height * this._unit_height) / 2;
                }
                var newHeatMap = new MapArea.HeatMapLayer("mapCanvas" + visData.mapID, this._heatmap_container, visData.width, visData.height, this._unit_width, this._unit_height, this._top_offset, this._left_offset, visData.unitsData);
                newHeatMap.transform(this._scale, 0, 0);
                newHeatMap.transformPan(this._translate_x, this._translate_y, this._scale);
                this._heatMaps.push(newHeatMap);
                var svg = this._element.append("g").data([{ mapID: visData.mapID, width: visData.width, height: visData.height }]).attr("id", function (d) {
                    return "mapSvg" + d.mapID;
                }).attr("class", "units").attr("transform", "translate(" + [this._translate_x, this._translate_y] + ")scale(" + this._scale + ")").selectAll("rect").data(visData.unitsData).enter().append("rect").attr("class", "unit").attr("x", function (d) {
                    return _this._left_offset + d.x * _this._unit_width;
                }).attr("y", function (d) {
                    return _this._top_offset + d.y * _this._unit_height;
                }).attr({
                    width: this._unit_width,
                    height: this._unit_height
                }).style({
                    opacity: 0.5
                });
                this._left_offset += this._unit_width * visData.width + this._map_gap;
                var leftMost = this._left_offset * this._scale + this._translate_x;
                if (leftMost > this._total_width) {
                    var t = d3.interpolate(0, leftMost - this._total_width + this._map_gap);
                    var i = 0;
                    var sTx = this._translate_x;
                    clearInterval(this._move_view_timer);
                    this._move_view_timer = setInterval(function () {
                        _this._translate_x = sTx - t(i / 100);
                        _this._heatMaps.forEach(function (d) {
                            d.transformPan(_this._translate_x, _this._translate_y, _this._scale);
                        });
                        _this._element.selectAll(".units").attr("transform", "translate(" + [_this._translate_x, _this._translate_y] + ")scale(" + _this._scale + ")");
                        _this._element.selectAll(".lens").attr("transform", function (d) {
                            if (d.cx == 0) {
                                d.cx = _this._translate_x;
                                d.cy = _this._translate_y;
                            }
                            d.scale = _this._scale;
                            d.tx = _this._translate_x - d.cx * d.scale;
                            d.ty = _this._translate_y - d.cy * d.scale;
                            return "translate(" + [d.tx, d.ty] + ")scale(" + _this._scale + ")";
                        });
                        _this._zoom.scale(_this._scale).translate([_this._translate_x, _this._translate_y]);
                        _this._element.call(_this._zoom);
                        ++i;
                        if (i >= 100) {
                            clearInterval(_this._move_view_timer);
                            _this._move_view_timer = -1;
                        }
                    }, 10);
                }
            };
            return SOMMap;
        })(ManyLens.D3ChartObject);
        MapArea.SOMMap = SOMMap;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../tsScripts/Hub/Hub.ts" />
///<reference path="../tsScripts/Navigation/SideBarNavigation.ts" />
///<reference path = "../tsScripts/TweetsCurve/Cruve.ts" />
///<reference path = "../tsScripts/LensHistory/HistoryTree.ts" />
///<reference path = "../tsScripts/Pane/ClassicLensPane.ts" />
///<reference path = "../tsScripts/MapArea/SOMMAP.ts" />
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
            this._lens_id_generator = 0;
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
            //this._historySvg = d3.select("#" + this._historySvg_id);
            //this._historyTrees = new LensHistory.HistoryTrees(this._historySvg, this);
            //Add a new tree here, actually the tree should not be add here
            //this._historyTrees.addTree();
            this.ManyLensHubRegisterClientFunction(this, "interactiveOnLens", this.InteractiveOnLens);
            /*-------------------------Start the hub-------------------------------------------*/
            this._manyLens_hub.connection.start().done(function () {
                console.log("start connection");
                if (ManyLens.TestMode) {
                    _this._nav_sidebar.FinishLoadData();
                }
                else {
                    _this._manyLens_hub.proxy.invoke("loadData").done(function () {
                        console.log("Load data success");
                        _this._nav_sidebar.FinishLoadData();
                    }).fail(function () {
                        console.log("load data fail");
                    });
                }
            });
        }
        Object.defineProperty(ManyLens.prototype, "LensIDGenerator", {
            //private _lens_count: number = 0;
            get: function () {
                return this._lens_id_generator++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ManyLens.prototype, "LensCount", {
            get: function () {
                return this._lens.size;
            },
            enumerable: true,
            configurable: true
        });
        /* -------------------- Lens related Function -----------------------*/
        ManyLens.prototype.GetLens = function (id) {
            return this._lens.get(id);
        };
        ManyLens.prototype.AddLens = function (lens) {
            this._lens.set(lens.ID, lens);
        };
        ManyLens.prototype.AddLensToHistoryTree = function (lens) {
            //this._historyTrees.addNode({
            //    color: lens.LensTypeColor,
            //    lensType: lens.Type,
            //    tree_id: 0
            //});
        };
        //TODO need to implementation
        ManyLens.prototype.RemoveLens = function (lens) {
            this._lens.delete(lens.ID);
            this.ManyLensHubServerRemoveLensData(lens.MapID, lens.ID);
            return lens;
        };
        ManyLens.prototype.DetachCompositeLens = function (element, hostLens, componentLens) {
            var lensC = _ManyLens.LensAssemblyFactory.DetachLens(element, hostLens, componentLens, this);
            if (lensC.IsCompositeLens) {
                if (lensC.NeedtoReshape)
                    this._lens.set(hostLens.ID, lensC);
                lensC.Render("black");
            }
            else {
                this.RemoveLens(hostLens);
                lensC.DisplayLens();
            }
        };
        /* -------------------- Hub related Function -----------------------*/
        ManyLens.prototype.ManyLensHubRegisterClientFunction = function (registerObj, funcName, func) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            this._manyLens_hub.proxy.on(funcName, function () {
                func.apply(registerObj, arguments);
            });
            //this._manyLens_hub.client[funcName] = function () {
            //    func.apply(registerObj, arguments);
            //}
        };
        ManyLens.prototype.ManyLensHubServerReOrganizePeak = function (state) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("reOrganizePeak", state);
        };
        ManyLens.prototype.ManyLensHubServerPullPoint = function (start) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("pullPoint", start);
            //return this._manyLens_hub.server.pullPoint(start);
        };
        ManyLens.prototype.ManyLensHubServerTestPullPoint = function () {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("testPullPoint");
            //return this._manyLens_hub.server.testPullPoint();
        };
        ManyLens.prototype.ManyLensHubServerPullInterval = function (id) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("pullInterval", id);
            //return this._manyLens_hub.server.pullInterval(id);
        };
        ManyLens.prototype.ManyLensHubServerTestPullInterval = function (id) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("testPullInterval", id);
            //return this._manyLens_hub.server.testPullInterval(id);
        };
        ManyLens.prototype.ManyLensHubServerGetLensData = function (visMapID, lensID, unitsID, baseData, subData) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("getLensData", visMapID, lensID, unitsID, baseData, subData);
            //return this._manyLens_hub.server.getLensData(visMapID,lensID, unitsID, whichData);
        };
        ManyLens.prototype.ManyLensHubServerRemoveLensData = function (visMapID, lensID) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("removeLensData", visMapID, lensID);
            //return this._manyLens_hub.server.removeLensData(visMapID, lensID);
        };
        /*-------------Lens interactivation method-------------*/
        ManyLens.prototype.InteractiveOnLens = function (lensID) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var lens = this._lens.get(lensID);
            console.log(args);
            if (lens.Type == "cWordCloudPieLens") {
                lens.HightLightWordsOfTweetsAtLengthOf(args[0]);
            }
            else if (lens.Type == "cMapPieLens") {
                lens.HightLightCountry(args[0]);
            }
        };
        ManyLens.prototype.ManyLensHubServercWordCloudPieLens = function (lensID, pieKey, baseData, subData) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("cWordCloudPieLens", lensID, pieKey, baseData, subData);
        };
        ManyLens.prototype.ManyLensHubServercMapPieLens = function (lensID, pieKey, baseData, subData) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new _ManyLens.Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("cMapPieLens", lensID, pieKey, baseData, subData);
        };
        ManyLens.TestMode = false;
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
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    return new ManyLens.Lens.cBoundleLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cBoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    //  case Lens.cBoundleLens.Type + "_" + Lens.cBoundleLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    return new ManyLens.Lens.cWordCloudNetworkLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cWordCloudNetworkLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    // case Lens.cWordCloudNetworkLens.Type + "_" + Lens.cWordCloudNetworkLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.WordCloudLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    return new ManyLens.Lens.cWordCloudPieLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cWordCloudPieLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    //   case Lens.cWordCloudPieLens.Type + "_" + Lens.cWordCloudPieLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    return new ManyLens.Lens.cSunBrustLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cSunBrustLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    // case Lens.cSunBrustLens.Type + "_" + Lens.cSunBrustLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    return new ManyLens.Lens.cChordDiagramLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cChordDiagramLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    // case Lens.cChordDiagramLens.Type + "_" + Lens.cChordDiagramLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    return new ManyLens.Lens.cMapNetworkLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cMapNetworkLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    //  case Lens.cMapNetworkLens.Type + "_" + Lens.cMapNetworkLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.MapLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    return new ManyLens.Lens.cMapPieLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapPieLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cMapPieLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cMapPieLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cMapPieLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapPieLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    //  case Lens.cMapBarLens.Type + "_" + Lens.cMapBarLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    return new ManyLens.Lens.cMapWordCloudLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cMapWordCloudLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    //    case Lens.cMapWordCloudLens.Type + "_" + Lens.cMapWordCloudLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    return new ManyLens.Lens.cWordCloudLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    return new ManyLens.Lens.cTreeNetworkLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    return new ManyLens.Lens.cPieChartLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    return new ManyLens.Lens.cMapLens(element, manyLens, firstLens, secondLens);
                }
                default: {
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
                    case ManyLens.Lens.WordCloudLens.Type: {
                        return new ManyLens.Lens.cWordCloudLens(element, manyLens, cLens);
                    }
                    case ManyLens.Lens.NetworkLens.Type: {
                        return new ManyLens.Lens.cTreeNetworkLens(element, manyLens, cLens);
                    }
                    case ManyLens.Lens.PieChartLens.Type: {
                        return new ManyLens.Lens.cPieChartLens(element, manyLens, cLens);
                    }
                    case ManyLens.Lens.MapLens.Type: {
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
///<reference path = "../Lens/LensList.ts" />
//module ManyLens {
//    export module Pane {
//        interface PaneG {
//            svg_g: D3.Selection;
//            timer: number;
//            isOpened: boolean;
//        }
//        export class BlossomLensPane extends D3ChartObject {
//            //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
//            private _pane_radius: number = 100;
//            private _pane_arc: D3.Svg.Arc = d3.svg.arc();
//            private _pane_pie: D3.Layout.PieLayout = d3.layout.pie();
//            private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
//            private _current_pane_g: PaneG = null;
//            private _lens_count: number = 2;
//            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
//                super(element,manyLens);
//                this._manyLens = manyLens;
//                this._pane_pie
//                    .startAngle(-Math.PI / 2)
//                    .endAngle(Math.PI / 2).value(() => { return 1; });
//                this._pane_arc
//                    .innerRadius(this._pane_radius - 40)
//                    .outerRadius(this._pane_radius)
//                ;
//            }
//            public Render(): void {
//                var container = this._element;
//                container.on("click", () => {
//                    this.OpenPane();
//                });
//            }
//            private OpenPane() {
//                if (this._current_pane_g && this._current_pane_g.isOpened) {
//                    (() => {
//                        this.ClosePane("click close");
//                    })();
//                }
//                var p = d3.mouse(this._element[0][0]);
//                var timer = setTimeout(() => { this.ClosePane("time out close"); }, 2000);
//                var svg = this._element
//                    .append("g")
//                    .attr("transform", "translate(" + p[0] + "," + p[1] + ")");
//                svg.selectAll("circle")
//                    .data(this._pane_pie([1, 1, 1, 1, 1]))
//                    .enter().append("circle")
//                    .attr("class", "pane-Lens-Circle")
//                    .attr("id", (d, i) => { return "lens" + i; })
//                    .style("fill", (d, i) => { return this._pane_color(i); })
//                    .attr("r", 10)
//                    .on("mouseover", () => {
//                        clearTimeout(this._current_pane_g.timer);
//                    })
//                    .on("mouseout", () => {
//                        this._current_pane_g.timer = setTimeout(() => {
//                            this.ClosePane("time out close");
//                        }, 1000);
//                    })
//                    .on("click", (d, i) => {
//                        var len: Lens.BaseD3Lens;
//                        switch (i) {
//                            case 0: {
//                                len = new Lens.BarChartLens(this._element,this._manyLens);
//                                break;
//                            }
//                            case 1: {
//                                len = new Lens.MapLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 2: {
//                                len = new Lens.TreeNetworkLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 3: {
//                                len = new Lens.PieChartLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 4: {
//                                len = new Lens.WordCloudLens(this._element, this._manyLens);
//                                break;
//                            }
//                        }
//                        //this._lens.push(len);
//                        len.Render(this._pane_color(i));
//                        //this._history_trees.addNode({ color: this._pane_color(i), lensType: len.Type, tree_id: 0 });
//                        d3.event.stopPropagation();
//                        this.ClosePane("select a lens");
//                    })
//                    .transition().duration(750)
//                    .attr("transform", (d) => {
//                        return "translate(" + this._pane_arc.centroid(d) + ")";
//                    })
//                ;
//                this._current_pane_g = { svg_g: svg, timer: timer, isOpened: true };
//            }
//            private ClosePane(msg: string) {
//                console.log(msg);
//                var t = 400;
//                var closeG = this._current_pane_g;
//                clearTimeout(closeG.timer);
//                closeG.isOpened = false;
//                closeG.svg_g
//                    .selectAll(".paneCircle")
//                    .transition().duration(t)
//                    .attr("transform", "translate(0)")
//                    .remove()
//                ;
//                setTimeout(() => { closeG.svg_g.remove(); }, t);
//            }
//        }
//    }
//} 
//# sourceMappingURL=ManyLens.js.map