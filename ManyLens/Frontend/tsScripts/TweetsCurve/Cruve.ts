///<reference path = "../D3ChartObject.ts" />

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

        export class Curve extends D3ChartObject {

            private _curveSvg: D3.Selection;
            private _mainView: D3.Selection;

            private _x_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _x_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _x_axis: D3.Selection;
            private _y_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _y_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _y_axis: D3.Selection;

            private _section_num: number = 50;
            private _view_height: number = 130;
            private _view_width: number;
            private _view_top_padding: number = 15;
            private _view_botton_padding: number = 5;
            private _view_left_padding: number = 50;
            private _view_right_padding: number = 50;

            protected _data: Array<Point>;

            public get Section_Num(): number {
                return this._section_num;
            }
            public set Section_Num(num: number) {
                if (typeof num === 'number') {
                    this._section_num = Math.ceil(num);
                }
            }

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);

                this._data = new Array<Point>();
                //this._markData = new Array<Mark>();
                //this._lastMark = {
                //    id: null,
                //    type: 2
                //};

                this._view_width = parseFloat(this._element.style("width"));

                this._x_scale
                    .domain([0, this._section_num])
                    .range([this._view_left_padding, this._view_width - this._view_right_padding])
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

                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction(this, "addPoint", this.AddPoint);
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
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", coordinate_view_width)
                    .attr("height", this._view_height - this._view_botton_padding)
                    .attr("x", this._view_left_padding)
                    .attr("y", 0)
                ;

                this._x_axis = this._curveSvg.append("g")
                    .attr("class", "curve x axis")
                    .attr("transform", "translate(0," + (this._view_height - this._view_botton_padding) + ")")
                    .call(this._x_axis_gen)
                ;

                this._y_axis = this._curveSvg.append("g")
                    .attr("class", "curve y axis")
                    .attr("transform", "translate(" + this._view_left_padding + ",0)")
                    .call(this._y_axis_gen)
                ;

                this._mainView = this._curveSvg.append("g")
                    .attr("clip-path", "url(#clip)")
                    .append("g")
                    .attr("id", "curve.mainView")
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
                            pathPoints: [{ index: i, value: this._data[i].value,trueValue : this._data[i].trueValue }]
                        };
                        nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });

                        while (this._data[++i] && this._data[i].beg == section.id) {
                            section.pathPoints.push({ index: i, value: this._data[i].value, trueValue:this._data[i].trueValue });
                            nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });
                        }

                        if (this._data[i] && this._data[i].type == 3) {
                            section.end = i;
                            section.pathPoints.push({ index: i, value: this._data[i].value,trueValue:this._data[i].trueValue });
                        } else if (this._data[i] && this._data[i].type == 1) {

                            section.end = i - 1;
                            var sectionRestPath = [];
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value,trueValue:this._data[i-1].trueValue });
                            sectionRestPath.push({ index: i, value: this._data[i].value,trueValue:this._data[i].trueValue });
                            restPathData.push(sectionRestPath);
                        } else {
                            section.end = i - 1;
                        }

                        sectionData.push(section);

                    } else {
                        var sectionRestPath = [];
                        if (this._data[i - 1])
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value,trueValue:this._data[i-1].trueValue });
                        sectionRestPath.push({ index: i, value: this._data[i].value,trueValue:this._data[i].trueValue });

                        while (this._data[++i] && !this._data[i].beg) {
                            sectionRestPath.push({ index: i, value: this._data[i].value,trueValue:this._data[i].trueValue });
                        }

                        if (this._data[i])
                            sectionRestPath.push({ index: i, value: this._data[i].value,trueValue:this._data[i].trueValue });

                        restPathData.push(sectionRestPath);
                    }
                }

                //handle the seg rect
                var rects = this._mainView.selectAll(".curve.seg").data(sectionData);
                rects.attr("x", (d, i) => {
                    return this._x_scale(d.beg);
                })
                    .attr("width", (d, i) => {
                        return this._x_scale(d.end) - this._x_scale(d.beg);
                    })
                ;
                rects.enter().append("rect")
                    .attr("x", (d, i) => {
                        return this._x_scale(d.beg);
                    })
                    .attr("y", 0)
                    .attr("width", (d, i) => {
                        return this._x_scale(d.end) - this._x_scale(d.beg);
                    })
                    .attr("height", this._view_height + this._view_top_padding)
                    .attr("class", "curve seg")
                    .style({
                        fill: 'rgb(31, 145, 189)',
                        stroke: "#fff",
                        "stroke-width":0.5
                    })
                    .on("click", (d: Section) => {
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
                        'fill':'none'
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
                    .attr("cx", (d, i) => {
                        return this._x_scale(d.index);
                    })
                    .attr("cy", (d) => {
                        return this._y_scale(d.value);
                    })
                ;
                nodes.enter().append("circle")
                    .attr("class", "curve node")
                    .attr("cx", (d, i) => {
                        return this._x_scale(d.index);
                    })
                    .attr("cy", (d) => {
                        return this._y_scale(d.value);
                    })
                    .attr("r", (d) => {
                        return  3;
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

        }
    }
}