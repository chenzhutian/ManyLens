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
            mark: Mark;
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

            private _section_num: number = 100;
            private _view_height: number = 150;
            private _view_width: number = d3.select("#mainView").node().clientWidth - 15;
            private _view_top_padding: number = 15;
            private _view_botton_padding: number = 20;
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
                this._data = new Array<Point>();
                this._markData = new Array<Mark>();
                this._lastMark = {
                    id: null,
                    type: 2
                };

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
                    .ticks(10)
                    .orient("bottom")
                ;
                this._y_axis_gen
                    .scale(this._y_scale)
                    .ticks(2)
                    .orient("left")
                ;

                /*---Please register all the client function here---*/
                this._manyLens.CurveHubRegisterClientFunction(this, "addPoint", this.AddPoint);
            }

            public Render<T>(data: Array<T>): void {
                super.Render(data);
                var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
                var coordinate_view_height = this._view_height - this._view_top_padding - this._view_botton_padding;

                this._curveSvg = this._element.append("svg")
                    .attr("width", this._view_width)
                    .attr("height", this._view_height)
                ;

                this._curveSvg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", coordinate_view_width)
                    .attr("height", coordinate_view_height)
                    .attr("x", this._view_left_padding)
                    .attr("y", this._view_top_padding)
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
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none')
                    .attr("id", "path")
                ;

            }


            public PullInteral(interalID: string):void {
                this._manyLens.CurveHubServerPullInteral(interalID);
            }

            public AddPoint(point: Point): void {
                this._data.push(point);
                this.RefreshGraph(point.mark);

                if (this._data.length > this._section_num) {
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
                    if (iter >= 0 && this._markData[iter].type == 3 || this._markData[iter].type == 1) {
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

                //handle the seg line
                this._mainView.selectAll(".curve.mark").remove();
                var lines = this._mainView.selectAll(".curve.mark").data(this._markData);
                lines.enter().append("line")
                    .attr("x1", (d, i) => {
                        return this._x_scale(i);
                    })
                    .attr("x2", (d, i) => {
                        return this._x_scale(i);
                    })
                    .attr("y1", this._view_top_padding)
                    .attr("y2", (d) => {
                        if (d.type == 1 || d.type == 2 || d.type == 3)
                            return this._view_height + this._view_top_padding;
                        return this._view_top_padding;
                    })
                    .attr('stroke', function (d) { return d.type == 1 ? 'red' : d.type == 2 ? 'green' : 'navy'; })
                    .attr('stroke-width', 2)
                    .attr("class", "curve mark")
                ;

                //handle the seg rect
                this._mainView.selectAll(".curve.seg").remove();
                var rects = this._mainView.selectAll(".curve.seg").data(this._markData);
                rects.enter().append("rect")
                    .attr("x", (d, i) => {
                        return this._x_scale(i);
                    })
                    .attr("y", this._view_top_padding)
                    .attr("width", (d) => {
                        if (d.type == 1 || d.type == 4 || d.type == 3)
                            return (this._x_scale(1) - this._x_scale(0));
                        return 0;
                    })
                    .attr("height", this._view_height)
                    .attr("class", "curve seg")
                    .style({
                        fill: "#ffeda0",
                        opacity: 0.5
                    })
                //.on("click", selectSegment)
                ;

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
                //.transition(1)
                    .attr("d", lineFunc(this._data))
                ;

                // move the main view
                if (this._data.length > (this._section_num+1)) {
                    this._mainView
                        .attr("transform", null)
                        .transition()
                        .duration(0)
                        .ease("linear")
                        .attr("transform", "translate(" + (this._x_scale(0) - this._x_scale(1)) + ",0)")
                    ;
                }
                if (this._markData.length > (this._section_num + 1)) {
                    this._markData.shift();
                }
            }

        }
    }
}