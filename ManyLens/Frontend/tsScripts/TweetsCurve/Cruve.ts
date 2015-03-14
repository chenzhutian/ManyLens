﻿///<reference path = "../D3ChartObject.ts" />

module ManyLens {

    export module TweetsCurve {

        interface Point {
            value: number;
            trueValue: number;
            isPeak: boolean;
            id: string;
            type: number;
            beg: string;
            end: string;
        }

        interface Section {
            beg: number;
            end: number;
            id: string;
            pathPoints: [{
                index: number;
                value: number;
                trueValue: number;
            }];
        }

        interface StackRect {
            //width: number;
            id: string;
            x: number;
            ox: number;
        }
        interface StackDate {
            id: string;
            type: number;
            num: number;
            date: Date;
            
            //  width: number;
            isRemove: boolean;
            x: number;
            ox: number;
            fill: string;
            intervals: Array<StackRect>;
        }

        export class Curve extends D3ChartObject {

            private _curveSvg: D3.Selection;
            private _mainView: D3.Selection;
            private _subView: D3.Selection;

            private _x_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _x_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _x_axis: D3.Selection;
            private _y_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _y_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _y_axis: D3.Selection;
            private _fisheye_scale: D3.FishEyeOrdinalScale = d3.fisheye.ordinal();

            private _section_num: number = 50;
            private _view_height: number = 130;
            private _view_width: number;
            private _view_top_padding: number = 15;
            private _view_botton_padding: number = 5;
            private _view_left_padding: number = 50;
            private _view_right_padding: number = 50;
            private _coordinate_margin_left: number = 200;

            private _intervals: Array<StackRect>;
            protected _data: Array<Point>;

            //private _stackrect_width: number = 0;
            private _subView_width: number = this._coordinate_margin_left + this._view_left_padding - 50;

            private _time_formater: D3.Time.TimeFormat;
            private _stack_date: Array<StackDate>;
            private _stack_date_id_gen: number = 0;
            //private _stackdate_width: number = 0;
            private _stack_bar_width: number = 15;

            private _cluster_peak: Map<number, StackRect[]>;

            public get Section_Num(): number {
                return this._section_num;
            }
            public set Section_Num(num: number) {
                if (typeof num === 'number') {
                    this._section_num = Math.ceil(num);
                }
            }
            public get StackID(): string {
                return "id" + this._stack_date_id_gen++;
            }

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);

                this._data = new Array<Point>();
                this._intervals = new Array<StackRect>();
                this._stack_date = new Array<StackDate>();

                this._view_width = parseFloat(this._element.style("width"));

                this._x_scale
                    .domain([0, this._section_num])
                    .range([this._view_left_padding + this._coordinate_margin_left, this._view_width - this._view_right_padding])
                ;
                this._y_scale
                    .domain([0, 20])
                    .range([this._view_height - this._view_botton_padding, this._view_top_padding])
                ;
                this._x_axis_gen
                    .scale(this._x_scale)
                    .ticks(0)
                    .orient("bottom")
                ;
                this._y_axis_gen
                    .scale(this._y_scale)
                    .ticks(2)
                    .orient("left")
                ;

                this._fisheye_scale
                    .rangeRoundBands([0, this._subView_width])
                    .focus(this._coordinate_margin_left + this._view_left_padding)
                ;

                this._time_formater = d3.time.format("%Y%m%d%H%M%S");


                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction(this, "addPoint", this.AddPoint);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "clusterInterval", this.ClusterInterval);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "timeInterval", this.TimeInterval);
            }


            public Render(): void {
                super.Render(null);
                var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
                // var coordinate_view_height = this._view_height - this._view_top_padding - this._view_botton_padding;
                this._element.select(".progress").style("display", "none");

                this._curveSvg = this._element.insert("svg", ":first-child")
                    .attr("width", this._view_width)
                    .attr("height", this._view_height)
                    .style("margin-bottom", "17px")
                ;

                this._curveSvg.append("defs").append("clipPath")
                    .attr("id", "stackRectClip")
                    .append("rect")
                    .attr("width", this._coordinate_margin_left + this._view_left_padding)
                    .attr("height", this._view_height - this._view_botton_padding)
                    .attr("x", 0)
                    .attr("y", 0)
                ;

                var timer;
                this._subView = this._curveSvg.append("g")
                    .attr("clip-path", "url(#stackRectClip)")
                    .append("g")
                    .attr("id", "curve.subView")
                    .on("mouseenter",() => {
                    clearTimeout(timer);
                })
                    .on("mouseleave",() => {
                    timer = setTimeout(() => {
                        this.ShrinkStackRect();
                    }, 1000);
                })
                ;

                this._curveSvg.append("defs").append("clipPath")
                    .attr("id", "curveClip")
                    .append("rect")
                    .attr("width", coordinate_view_width)
                    .attr("height", this._view_height - this._view_botton_padding)
                    .attr("x", this._view_left_padding + this._coordinate_margin_left)
                    .attr("y", 0)
                ;

                this._mainView = this._curveSvg.append("g")
                    .attr("clip-path", "url(#curveClip)")
                    .append("g")
                    .attr("id", "curve.mainView")
                ;

                this._x_axis = this._curveSvg.append("g")
                    .attr("class", "curve x axis")
                    .attr("transform", "translate(" + [0, (this._view_height - this._view_botton_padding)] + ")")
                    .call(this._x_axis_gen)
                ;

                this._y_axis = this._curveSvg.append("g")
                    .attr("class", "curve y axis")
                    .attr("transform", "translate(" + (this._coordinate_margin_left + this._view_left_padding) + ",0)")
                    .call(this._y_axis_gen)
                ;

            }

            public PullInterval(interalID: string): void {
                if (ManyLens.TestMode)
                    this._manyLens.ManyLensHubServerTestPullInterval(interalID);
                else {
                    this._manyLens.ManyLensHubServerPullInterval(interalID)
                        .progress((percent) => {
                        this._element.select(".progress-bar")
                            .style("width", percent * 100 + "%")
                        ;
                    })
                        .done(() => {
                        this._element.select(".progress-bar")
                            .style("width", 0)
                        ;
                        this._element.select(".progress").style("display", "none");
                        this._curveSvg.style("margin-bottom", "17px")
                    });
                }
            }

            public AddPoint(point: Point): void {
                this._data.push(point);


                this.RefreshGraph(point);

                if (this._data.length > this._section_num + 1) {
                    this._data.shift();
                }
            }

            private RefreshGraph(point: Point) {

                //Refresh the stack rect view
                if (this._data[0].type == 1 || this._data[0].type == 3) {

                    var stackRect: StackRect = {
                        id: this._data[0].beg,
                        x: 0,
                        ox: 0
                    }
                    this._intervals.push(stackRect);

                    //The stack date
                    var date = this._time_formater.parse(stackRect.id);
                    this.doIt(date, 0, [stackRect]);
                }

                //Refresh the curve view
                this._y_scale.domain([0, d3.max([
                    d3.max(this._data, function (d) { return d.trueValue; }),
                    d3.max(this._data, function (d) { return d.value; })
                ])
                ]);
                this._y_axis_gen.scale(this._y_scale);
                this._y_axis.call(this._y_axis_gen);

                var restPathData = [];
                var nodesData = [];
                var sectionData = new Array<Section>();

                var i = 0, len = this._data.length;
                while (i < len) {
                    if (this._data[i].beg) {
                        var section: Section = {
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
                        } else if (this._data[i] && this._data[i].type == 1) {
                            section.end = i - 1;
                            var sectionRestPath = [];
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value, trueValue: this._data[i - 1].trueValue });
                            sectionRestPath.push({ index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                            restPathData.push(sectionRestPath);
                        } else {
                            section.end = i - 1;
                        }
                        sectionData.push(section);
                    } else {
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
                rects.attr("x",(d, i) => {
                    return this._x_scale(d.beg);
                })
                    .attr("width",(d, i) => {
                    return this._x_scale(d.end) - this._x_scale(d.beg);
                })
                ;
                rects.enter().append("rect")
                    .attr("x",(d, i) => {
                    return this._x_scale(d.beg);
                })
                    .attr("y", 0)
                    .attr("width",(d, i) => {
                    return this._x_scale(d.end) - this._x_scale(d.beg);
                })
                    .attr("height", this._view_height + this._view_top_padding)
                    .attr("class", "curve seg")
                    .style({
                    fill: '#2A9CC8',
                    stroke: "#fff",
                    "stroke-width": 0.5
                })
                    .on("click",(d: Section) => {
                    this.SelectSegment(d);
                })
                ;
                rects.exit().remove();

                var lineFunc = d3.svg.line()
                    .x((d, i) => {
                    return this._x_scale(d.index);
                })
                    .y((d, i) => {
                    return this._y_scale(d.value);
                })
                    .interpolate("linear")
                    ;
                var truelineFunc = d3.svg.line()
                    .x((d, i) => {
                    return this._x_scale(d.index);
                })
                    .y((d, i) => {
                    return this._y_scale(d.trueValue);
                })
                    .interpolate("linear")
                    ;


                var path = this._mainView.selectAll(".curve.section.path").data(sectionData, function (d) { return d.id; });
                path.attr("d", function (d) {
                    return lineFunc(d.pathPoints);
                });
                path
                    .enter().append("path")
                    .style({
                    'stroke': '#F6BB42',
                    'stroke-width': 3,
                    'fill': 'none'
                })
                    .attr("d", function (d) { return lineFunc(d.pathPoints); })
                    .attr("class", "curve section path")
                ;
                path.exit().remove();

                var truepath = this._mainView.selectAll(".curve.section.true.path").data(sectionData, function (d) { return d.id; });
                truepath.attr("d", function (d) {
                    return truelineFunc(d.pathPoints);
                });
                truepath
                    .enter().append("path")
                    .style({
                    'stroke': '#fff',
                    'stroke-width': 3,
                    'fill': 'none'
                })
                    .attr("d", function (d) { return truelineFunc(d.pathPoints); })
                    .attr("class", "curve section true path")
                ;
                truepath.exit().remove();

                var restPath = this._mainView.selectAll(".curve.rest.path").data(restPathData);
                restPath.attr("d", function (d) {
                    return lineFunc(d);
                })
                restPath
                    .enter().append("path")
                    .style({
                    'stroke': 'rgb(31, 145, 189)',
                    'stroke-width': 3,
                    'fill': 'none'
                })
                    .attr("d", function (d) { return lineFunc(d); })
                    .attr("class", "curve rest path")
                ;
                restPath.exit().remove();

                var trueRestPath = this._mainView.selectAll(".curve.rest.true.path").data(restPathData);
                trueRestPath.attr("d", function (d) {
                    return truelineFunc(d);
                })
                trueRestPath
                    .enter().append("path")
                    .style({
                    'stroke': 'rgb(31, 145, 189)',
                    'stroke-width': 3,
                    'fill': 'none'
                })
                    .attr("d", function (d) { return truelineFunc(d); })
                    .attr("class", "curve rest path")
                ;
                trueRestPath.exit().remove();


                //handle the seg node
                var nodes = this._mainView.selectAll(".curve.node").data(nodesData, function (d) { return d.index; });
                nodes
                    .attr("cx",(d, i) => {
                    return this._x_scale(d.index);
                })
                    .attr("cy",(d) => {
                    return this._y_scale(d.value);
                })
                ;
                nodes.enter().append("circle")
                    .attr("class", "curve node")
                    .attr("cx",(d, i) => {
                    return this._x_scale(d.index);
                })
                    .attr("cy",(d) => {
                    return this._y_scale(d.value);
                })
                    .attr("r",(d) => {
                    return 3;
                })
                    .style({
                    fill: "#fff",
                    stroke: "rgb(31, 145, 189)",
                    "stroke-width": 1.5
                });
                nodes.exit().remove();

                // move the main view
                if (this._data.length > (this._section_num + 1)) {
                    this._mainView
                        .attr("transform", null)
                        .transition()
                        .duration(40)  //this time-step should be equale to the time step of AddPoint() in server.hub
                        .ease("linear")
                        .attr("transform", "translate(" + (this._x_scale(0) - this._x_scale(1)) + ",0)")
                    ;
                }

            }

            private SelectSegment(d: Section) {
                if (d.end != null) {
                    this._curveSvg.style("margin-bottom", "0px")
                    this._element.select(".progress").style("display", "block");
                    this.PullInterval(d.id);

                }
                else {
                    console.log("Segmentation hasn't finished yet!");
                }
            }

            private ShrinkStackRect(filterX: number = -1) {
                if (this._subView) {
                    this._subView
                        .selectAll("rect.stack.rect")
                        .transition()
                        .attr("x",(d) => {
                        return d.ox;
                    })
                        .remove()
                    ;
                    this._subView
                        .select("g.stack.rect.group")
                        .remove()
                    ;

                    this._subView
                        .selectAll("rect.stack.organize")
                        .style("visibility", function (d) {
                        if (d.x != filterX)
                            return "visible";
                        return "hidden";
                    })
                        .transition()
                        .attr("x",(d) => { return d.x = d.ox; })
                        .attr("width", this._stack_bar_width)
                    ;

                    this._subView.on("mousemove", null);
                }
            }

            private GetWeek(date: Date): number {
                var onejan = new Date(date.getFullYear(), 0, 1);
                return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
            }

            private doIt(date: Date, depth: number, intervals: Array<StackRect>, stack_date_right: Array<StackDate> = null) {
                var num;
                switch (depth) {
                    case 0: {
                        num = date.getDay();
                        stack_date_right = new Array<StackDate>();
                    }
                        break;
                    case 1: num = this.GetWeek(date); break;
                    case 2: num = date.getMonth(); break;
                    default: num = -1;
                }

                var newDate: StackDate = {
                    id: this.StackID,
                    type: depth,
                    num: num,
                    isRemove: false,
                    x: this._stack_date.length * this._stack_bar_width,
                    ox: this._stack_date.length * this._stack_bar_width,
                    fill: null,
                    date: date,
                    intervals: intervals
                }

                var colorScale = d3.scale.ordinal().domain([0, 1, 2])
                    .range(["#2A9CC8", "#2574A9", "#34495E"]);

                stack_date_right.push(newDate);
                var tempStackDate: StackDate[] = [].concat(this._stack_date, stack_date_right.reverse()).sort(function (a, b) { return (a.x > b.x) ? 1 : -1; });
                var stackDate = this._subView.selectAll("rect.stack.organize.date").data(tempStackDate, function (d) { return d.id; });

                var self = this;
                stackDate
                    .transition()
                    .attr("x",(d, i) => {
                    d.x = d.ox = i * this._stack_bar_width
                    return d.x;
                })
                    .style("fill",(d) => {
                    return d.fill;
                })
                ;

                stackDate.enter().append("rect")
                    .attr("x",(d) => {
                    if (depth == 0)
                        return this._coordinate_margin_left + this._view_left_padding;
                    return d.x;
                })
                    .attr({
                    "class": "stack organize date",
                    width: this._stack_bar_width,
                    height: this._view_height + this._view_top_padding,
                    y: 0
                })
                    .style({
                    stroke: "#fff",
                    "stroke-width": 0.5
                })
                    .style("fill",(d) => {
                    if (d.type == 0) {
                        return colorScale(d.type);
                    }
                    return colorScale(d.type - 1);
                })
                    .on("dblclick", function (d, i) {
                    d3.select(this).style("visibility", "hidden");
                    self.ExpandStackDate(d);
                })
                    .transition()
                    .style("fill",(d) => {
                    return d.fill = colorScale(d.type);
                })
                    .attr("x", function (d) {
                    return d.x;
                })
                ;

                stackDate.exit().filter(function (d) { return !d.isRemove; })
                    .transition()
                    .attr("x", function (d) {
                    d.isRemove = true;
                    return d.x;
                })
                    .remove()
                ;

                var lastDate = this._stack_date.pop();
                if (lastDate) {
                    if (lastDate.type == newDate.type && lastDate.num != newDate.num) {
                        var newStack = [];
                        newStack.push(lastDate);
                        while (this._stack_date.length > 0) {
                            var tempDate = this._stack_date.pop();
                            if (tempDate.type == lastDate.type && tempDate.num == lastDate.num) {
                                newStack.push(tempDate);
                            } else {
                                this._stack_date.push(tempDate);
                                break;
                            }
                        }

                        var tempIntervals: Array<StackRect> = [];
                        newStack.forEach((d: StackDate) => {
                            d.x = newStack[newStack.length - 1].x;
                            tempIntervals = tempIntervals.concat(d.intervals);
                        });

                        this.doIt(lastDate.date, ++depth, tempIntervals, stack_date_right);
                    } else {
                        this._stack_date.push(lastDate);
                    }
                }

                this._stack_date.push(newDate);

            }
            private TimeInterval(): void {
                this.ShrinkStackRect();
                this._subView
                    .selectAll("rect.stack.organize.content")
                    .transition()
                    .style("opacity",(d) => {
                    return 0;
                })
                    .remove()
                ;

                var self = this;
                this._subView.selectAll("rect.stack.organize.date")
                    .data(this._stack_date)
                    .enter().append("rect")
                    .attr({
                    width: this._stack_bar_width,
                    "class": "stack organize date",
                    height: this._view_height + this._view_top_padding,
                    y: 0
                })
                    .style({
                    stroke: "#fff",
                    "stroke-width": 0.5
                })
                    .attr("x",(d) => {
                    return d.x;
                })
                    .style("fill",(d) => {
                    return d.fill;
                })
                    .on("dblclick", function (d) {
                    d3.select(this).style("visibility", "hidden");
                    self.ExpandStackDate(d);
                })
                ;

            }

            private ClusterInterval(intervalsInGroups: any[]): void {
                this.ShrinkStackRect();
                this._subView
                    .selectAll("rect.stack.organize.date")
                    .transition()
                    .style("opacity",(d) => {
                    return 0;
                })
                    .remove()
                ;

                this._cluster_peak = new Map<number, StackRect[]>();
                intervalsInGroups.forEach((d, i) => {
                    if (!this._cluster_peak.has(d)) {
                        this._cluster_peak.set(d, []);
                    }
                    if (this._intervals[i])
                        this._cluster_peak.get(d).push(this._intervals[i]);
                });

                var data = [];
                var color = d3.scale.category10();
                this._cluster_peak.forEach((d) => {
                    data.push(d);
                });

                var self = this;
                this._subView
                    .selectAll("rect.stack.organize.content")
                    .data(data)
                    .enter().append("rect")
                    .attr({
                    width: this._stack_bar_width,
                    "class": "stack organize content",
                    height: this._view_height + this._view_top_padding,
                    y: 0
                })
                    .style({
                    stroke: "#fff",
                    "stroke-width": 0.5
                })
                    .attr("x",(d, i) => {
                    return d.x = d.ox = i * this._stack_bar_width
                })
                    .style("fill",(d, i) => {
                    return d.fill = color(i);
                })
                    .on("dblclick", function (d, i) {
                    d3.select(this).style("visibility", "hidden");
                    self.ExpandStackDate(d);
                })

                ;

            }

            private ExpandStackDate(d: any): void {
                this.ShrinkStackRect(d.x);
                var data: Array<any> = d.intervals || d;

                this._subView.append("g")
                    .attr("class", "stack rect group")
                    .selectAll("rect.stack.rect")
                    .data(data)
                    .enter().append("rect")
                    .attr({
                    width: this._stack_bar_width,
                    "class": "stack rect",
                    height: this._view_height + this._view_top_padding,
                    y: 0
                })
                    .style({
                    stroke: "#fff",
                    "stroke-width": 0.5,
                    opacity: 1e-6
                })
                    .attr("x",(p, j) => {
                    p.ox = d.x;
                    return p.x = d.x + j * this._stack_bar_width
                })
                    .transition()
                    .style("opacity", 1)
                //  .style("fill", color)
                ;

                var maxI: number = -1;
                var temp = this._subView.selectAll("rect.stack.organize").filter((p, i) => { maxI = i > maxI ? i : maxI; return p.x > d.x; })

                if ((maxI + data.length - 1) * this._stack_bar_width > this._subView_width) {
                    var offsetX = (data.length - 1) * this._stack_bar_width;
                    temp
                        .attr("x",(p) => {
                            return p.x = p.x + offsetX;
                        })
                    ;

                    this._subView.on("mousemove",() => {

                        var mouse = d3.mouse(this._subView.node());
                        var data = [];
                        d3.selectAll("rect.stack").attr("x", function (d, i) {
                            if (d3.select(this).style("visibility") != "hidden") {
                                data.push(d.x);
                            }
                        });
                        data.sort(function (a, b) { return a > b ? 1 : -1; })
                        console.log(data);
                        this._fisheye_scale
                            .domain(data)
                            .focus(mouse[0])
                        ;

                        this._subView
                            .selectAll("rect.stack").filter(function () { return d3.select(this).style("visibility") != "hidden"; })
                            .attr("x",(d) => {
                            //if (this._fisheye_scale(d.x))
                            return this._fisheye_scale(d.x);
                        })
                            .attr("width",(d) => {
                            //if (this._fisheye_scale.rangeBand(d.x))
                            return this._fisheye_scale.rangeBand(d.x);
                        })
                        ;
                    })
                    ;

                } else {

                    temp.transition()
                        .attr("x",(p) => {
                            return p.x = p.x + (data.length - 1) * this._stack_bar_width;
                        })
                        .attr("width", this._stack_bar_width)
                    ;

                }




            }

        }
    }
}