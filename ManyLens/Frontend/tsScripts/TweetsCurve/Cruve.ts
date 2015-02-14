///<reference path = "../D3ChartObject.ts" />

module ManyLens {

    export module TweetsCurve {

        interface Mark {
            id: string;
            type: number;
            beg: string;
            end: string;
        }

        interface Point {
            value: number;
            isPeak: boolean;
            mark: Mark;
        }

        interface Section {
            beg: number;
            end: number;
            id: string;
            values: number[];
        }

        export class Curve extends D3ChartObject {
            //Try
            private _section: Array<Section>;


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
            private _markData: Array<Mark>;
            private _lastMark: { id: string; type: number };

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
                this._section = new Array<Section>();

                this._data = new Array<Point>();
                this._markData = new Array<Mark>();
                this._lastMark = {
                    id: null,
                    type: 2
                };

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
                var coordinate_view_height = this._view_height - this._view_top_padding - this._view_botton_padding;
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
                    .attr("height", coordinate_view_height + 10)
                    .attr("x", this._view_left_padding)
                    .attr("y", this._view_top_padding - 10)
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
                this._mainView.append("path")
                    .attr('stroke', 'rgb(31, 145, 189)')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none')
                    .attr("id", "path")
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
                this.RefreshGraph(point.mark);

                if (this._data.length > this._section_num + 1) {
                    this._data.shift();
                }
            }

            private RefreshGraph(mark: Mark) {
                this._y_scale.domain([0, d3.max(this._data, function (d) { return d.value; })]);
                this._y_axis_gen.scale(this._y_scale);
                this._y_axis.call(this._y_axis_gen);

                if (mark.type == 2 || mark.type == 3) {
                    var eid = mark.id;
                    var iter = this._markData.length - 1;
                    while (iter >= 0 && (this._markData[iter].type == 4)) {
                        this._markData[iter].end = eid;
                        --iter;
                    }
                    if (iter >= 0 && (this._markData[iter].type == 3 || this._markData[iter].type == 1)) {
                        this._markData[iter].end = eid;
                    }
                    if (mark.type == 2) {
                        mark.beg = this._lastMark.id;
                    }

                    this._markData.push(mark);
                    this._lastMark = mark;
                } else {
                    if (mark.type == 4) {
                        mark.beg = this._lastMark.id;
                    }

                    if (mark.type == 1) {
                        this._lastMark = mark;
                    }
                    this._markData.push(mark);
                }

                this._section = new Array<Section>();
                var lastSection: Section;
                this._markData.forEach((d, i) => {
                    try {
                        if (d.type == 1 || ((d.type == 4 || d.type == 3) && i == 0)) {
                            var section: Section = {
                                beg: i,
                                end: 0,
                                id:d.beg,
                                values: [0]
                            };
                            lastSection = section;
                        } else if (d.type == 3) {
                            lastSection.end = i;
                            this._section.push(lastSection);

                            var section: Section = {
                                beg: i,
                                end: 0,
                                id:d.beg,
                                values: [0]
                            };
                            lastSection = section;

                        } else if (d.type == 2 && i != 0) {
                            lastSection.end = i;
                            this._section.push(lastSection);

                        } else if (d.type == 4 && i == this._markData.length -1 ) {
                            lastSection.end = i;
                            this._section.push(lastSection);
                        }
                    } catch (e) {
                        console.log(d);
                        console.log(i);
                        console.log(lastSection);
                        console.log(this._markData);
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
                    .attr("y", this._view_top_padding)
                    .attr("width", (d, i) => {
                        return this._x_scale(d.end) - this._x_scale(d.beg);
                    })
                    .attr("height", this._view_height)
                    .attr("class", "curve seg")
                    .style({
                        fill: "#ffeda0",
                        opacity: 0.5
                    })
                    .on("click", (d: Mark) => {
                        this.SelectSegment(d);
                    })
                ;
                rects.exit().remove();

                //handle the seg node
                var nodes = this._mainView.selectAll(".curve.node").data(this._data, function (d) { return d.mark.id; });
                nodes
                    .attr("cx", (d, i) => {
                        return this._x_scale(i);
                    })
                    .attr("cy", (d) => {
                        return this._y_scale(d.value);
                    })
                ;
                nodes.enter().append("circle")
                    .attr("class", "curve node")
                    .attr("cx", (d, i) => {
                        return this._x_scale(i);
                    })
                    .attr("cy", (d) => {
                        return this._y_scale(d.value);
                    })
                    .attr("r", (d) => {
                        return d.mark.type == 0? 0 : 3;
                    })
                    .style({
                        fill: "#fff",
                        stroke: "rgb(31, 145, 189)",
                        "stroke-width": 2
                    });
                nodes.exit().remove();

                var lineFunc = d3.svg.line()
                    .x((d, i) => {
                        return this._x_scale(i);
                    })
                    .y((d, i) => {
                        return this._y_scale(d.value);
                    })
                    .interpolate("linear")
                ;

                //handle the line path
                this._mainView.selectAll("#path")
                    .attr("d", lineFunc(this._data))
                ;

                // move the main view
                if (this._data.length > (this._section_num + 1)) {
                    this._mainView
                        .attr("transform", null)
                        .transition()
                        .duration(800)  //this time-step should be equale to the time step of AddPoint() in server.hub
                        .ease("linear")
                        .attr("transform", "translate(" + (this._x_scale(0) - this._x_scale(1)) + ",0)")
                    ;
                }
                if (this._markData.length > this._section_num + 1) {
                    this._markData.shift();
                }
            }

            private SelectSegment(d: Mark) {
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