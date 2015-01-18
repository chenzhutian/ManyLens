///<reference path = "../tsScripts/D3ChartObject.ts" />
module ManyLens {
    export module Lens {
        export interface ILens {
            ID: string;
            Type: string;
            IsCompositeLens: boolean;
            LensTypeColor: string;
            LensCX: number;
            LensCY: number;
            LensGroup: D3.Selection;
        }

        export class BaseD3Lens extends D3ChartObject implements ILens{

            protected _id: string;
            protected _type: string;
            protected _lens_type_color: string;
            protected _manyLens: ManyLens.ManyLens;
            protected _has_put_down: boolean = false;
            protected _has_showed_lens: boolean = false;
            protected _sc_lc_svg: D3.Selection;
            public IsCompositeLens: boolean = false;

            protected _select_circle_G: D3.Selection;
            protected _select_circle: D3.Selection;

            protected _sc_radius: number = 0;
            protected _sc_cx: number = 0;
            protected _sc_cy: number = 0;
            protected _sc_scale: number = 1;
            protected _sc_zoom: D3.Behavior.Zoom = d3.behavior.zoom();
            protected _sc_drag: D3.Behavior.Drag = d3.behavior.drag();

            protected _lens_circle_G: D3.Selection;
            protected _lens_circle: D3.Selection;
            protected _lc_radius: number = 100;
            protected _lc_cx: number;
            protected _lc_cy: number;
            protected _lc_scale: number = 1;
            protected _lc_zoom: D3.Behavior.Zoom = d3.behavior.zoom();
            protected _lc_drag: D3.Behavior.Drag = d3.behavior.drag();

            public get ID(): string {
                return this._id;
            }
            public get Type(): string {
                return this._type;
            }
            public get LensTypeColor(): string {
                return this._lens_type_color;
            }
            public get LensCX(): number {
                return this._lc_cx;
            }
            public get LensCY(): number {
                return this._lc_cy;
            }
            public get LensGroup(): D3.Selection {
                return this._lens_circle_G;
            }
            public set LensGroup(lensG: D3.Selection) {
                this._lens_circle_G = lensG;
            }

            constructor(element: D3.Selection, type: string,manyLens:ManyLens.ManyLens) {
                super(element);
                this._manyLens = manyLens;
                this._type = type;
                this._sc_radius = 10;
            }

            public render(color: string): void {
                var container = this._element;
                var hasShow = false;
                this._lens_type_color = color;

                this._sc_lc_svg = container
                //.insert("g", ":first-child")
                    .append("g")
                    .attr("class", "lens");

                this._sc_zoom
                    .scaleExtent([1, 4])
                    .on("zoom", () => {
                        this.SelectCircleZoomFunc();
                    })
                ;

                this._sc_drag
                    .origin(function (d) { return d; })
                    .on("dragstart", () => {
                        //if (!this._has_put_down) return;
                        //if (d3.event.sourceEvent.button != 0) return;
                    })
                    .on("drag", () => {
                        this.SelectCircleDragFunc();
                    })
                    .on("dragend", (d) => {
                        this.SelectCircleDragendFunc(d);
                    })
                ;

                this._sc_lc_svg.append("line")
                    .attr("stoke-width", 2)
                    .attr("stroke", "red")
                ;

                this._select_circle_G = this._sc_lc_svg.append("g")
                    .attr("class", "select-circle")
                ;

                var selectCircle = this._select_circle =
                    this._select_circle_G.append("circle")
                        .data([{ x: this._sc_cx, y: this._sc_cy }])
                ;

                selectCircle
                    .attr("r", this._sc_radius)
                    .attr("fill", color)
                    .attr("fill-opacity", 0.7)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .on("mouseup", (d) => {
                        if (!this._has_put_down) {
                            this._has_put_down = true;
                            d.x = this._sc_cx = parseFloat(selectCircle.attr("cx"));
                            d.y = this._sc_cy = parseFloat(selectCircle.attr("cy"));
                            container.on("mousemove", null);
                        }
                    })
                    .on("contextmenu", () => {
                        this._sc_lc_svg.remove();
                        d3.event.preventDefault();
                    })
                    .call(this._sc_zoom)
                    .call(this._sc_drag)
                ;

                container.on("mousemove", moveSelectCircle);            //因为鼠标是在大SVG里移动，所以要绑定到大SVG上
                function moveSelectCircle() {
                    var p = d3.mouse(container[0][0]);
                    selectCircle
                        .attr("cx", p[0])
                        .attr("cy", p[1])
                    ;
                }
            }

            protected extractData(any = null): any {
                throw new Error('This method is abstract');
            }

            public showLens(any = null, lc_cx = null, lc_cy = null): { lcx: number; lcy: number; /*theta: number;*/ duration: number } {
                var container = this._element;
                var duration: number = 300;

                if (this._sc_lc_svg) {
                    var sc_lc_dist = 100;
                    var theta = Math.random() * Math.PI;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);

                    var cx = this._sc_cx + (this._sc_radius * cosTheta * this._sc_scale);
                    var cy = this._sc_cy + (this._sc_radius * sinTheta * this._sc_scale);

                    this._sc_lc_svg.select("line")
                        .attr("x1", cx)
                        .attr("y1", cy)
                        .attr("x2", cx)
                        .attr("y2", cy)
                        .attr("stoke-width", 2)
                        .attr("stroke", "red")
                        .transition().duration(duration)
                        .attr("x2", () => {
                            cx = cx + (sc_lc_dist * cosTheta);
                            return cx;
                        })
                        .attr("y2", () => {
                            cy = cy + (sc_lc_dist * sinTheta);
                            return cy;
                        })
                    ;
                    this._lc_cx = cx + (this._lc_radius * cosTheta);
                    this._lc_cy = cy + (this._lc_radius * sinTheta);

                } else if (lc_cx && lc_cy) {
                    this._sc_lc_svg = container
                        .append("g")
                        .attr("class", "lens")
                    ;
                    this._lc_cx = lc_cx;
                    this._lc_cy = lc_cy;

                } else {
                    throw new Error("Show lens wrong!");
                }

                this._lc_zoom
                    .scaleExtent([1, 2])
                    .on("zoom", () => {
                        this.LensCircleZoomFunc();
                    })
                ;

                this._lc_drag
                    .origin(function (d) { return d; })
                    .on("dragstart", () => {
                        console.log("dragstart " + this._type);
                        this.LensCircleDragstartFunc();
                    })
                    .on("drag", () => {
                        this.LensCircleDragFunc();
                    })
                    .on("dragend", () => {
                        console.log("dragend " + this._type);
                        this.LensCircleDragendFunc();

                    })
                ;

                this._lens_circle_G = this._sc_lc_svg.append("g")
                    .data([{ x: this._lc_cx, y: this._lc_cy }])
                    .attr("id","lens_"+this._manyLens.LensCount)
                    .attr("class", "lens-circle-g " + this._type)
                    .attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + this._lc_scale + ")")
                    .attr("opacity", "1e-6")
                    .on("contextmenu", () => {
                        //d3.event.preventDefault();
                    })
                    .on("mousedown", () => {
                        console.log("mousedown " + this._type);
                    })
                    .on("mouseup", () => {
                        console.log("mouseup " + this._type);
                    })
                    .on("click", () => {
                        console.log("click " + this._type)
                    })
                    .call(this._lc_zoom)
                    .call(this._lc_drag)
                ;

                this._lens_circle = this._lens_circle_G.append("circle")
                    .attr("class", "lens-circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", this._lc_radius)
                    .attr("fill", "#fff")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                ;

                //re-order the line, select-circle and lens-circle
                //var tempChildren = d3.selectAll(this._sc_lc_svg[0][0].children);
                //var tt = tempChildren[0][0];
                //tempChildren[0][0] = tempChildren[0][1];
                //tempChildren[0][1] = tt;
                //tempChildren.order();

                //Add this lens to the app class
                this._manyLens.AddLens(this);

                return {
                    lcx: this._lc_cx,
                    lcy: this._lc_cy,
                    //theta: theta,
                    duration: duration
                }
            }

            protected SelectCircleDragFunc(): void {
                if (!this._has_put_down) return;
                if (d3.event.sourceEvent.button != 0) return;

                this._sc_lc_svg.select("g.lens-circle-g").remove();
                this._sc_lc_svg.select("line").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 0);

                this._select_circle
                    .attr("cx", (d) => { return d.x = Math.max(0, Math.min(parseFloat(this._element.style("width")), d3.event.x)); })
                    .attr("cy", (d) => { return d.y = Math.max(0, Math.min(parseFloat(this._element.style("height")), d3.event.y)); })
                ;
                this._has_showed_lens = false;
            }

            protected SelectCircleDragendFunc(selectCircle): void {
                if (!this._has_put_down) return;
                if (d3.event.sourceEvent.button != 0) return;

                this._sc_cx = selectCircle.x;
                this._sc_cy = selectCircle.y;

                //传递数据给Lens显示
                var data = this.extractData();
                if (!this._has_showed_lens) {
                    this.showLens(data);

                    this._has_showed_lens = true;
                }

                //z-index的问题先不解决
                ////re-order the g elements so the paneG could on the toppest
                //var tempGs = d3.select("#mapView").selectAll("svg > g");
                //tempGs[0].splice(tempGs[0].length - 2, 0, tempGs[0].pop());
                //tempGs.order();
            }

            protected SelectCircleZoomFunc(): void {

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

                this._select_circle
                    .attr("r", this._sc_radius * this._sc_scale)
                ;

                this._sc_lc_svg.select("line")
                    .attr("x1", this._sc_cx + this._sc_radius * d3.event.scale * cosTheta)
                    .attr("y1", this._sc_cy + this._sc_radius * d3.event.scale * sinTheta)
                ;
            }

            protected LensCircleDragstartFunc(): void {
                var tempGs = d3.select("#mapView").selectAll("svg > g");
                var index = tempGs[0].indexOf(this._sc_lc_svg[0][0]);
                tempGs[0].splice(index, 1);
                tempGs[0].push(this._sc_lc_svg[0][0]);
                tempGs.order();

            }

            protected LensCircleDragFunc(): void {

                var transform = this._lens_circle_G.attr("transform");
                this._lens_circle_G.attr("transform", (d) => {
                    this._lc_cx = d.x = Math.max(this._lc_radius, Math.min(parseFloat(this._element.style("width")) - this._lc_radius, d3.event.x));
                    this._lc_cy = d.y = Math.max(this._lc_radius, Math.min(parseFloat(this._element.style("height")) - this._lc_radius, d3.event.y));
                    transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                    return transform;
                });

                var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
                var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);

                this._sc_lc_svg.select("line")
                    .attr("x1", this._sc_cx + this._sc_radius * this._sc_scale * cosTheta)
                    .attr("y1", this._sc_cy + this._sc_radius * this._sc_scale * sinTheta)
                    .attr("x2", this._lc_cx - this._lc_radius * this._lc_scale * cosTheta)
                    .attr("y2", this._lc_cy - this._lc_radius * this._lc_scale * sinTheta)
                ;
            }

            protected LensCircleDragendFunc(): Array<Element> {
                var res = [];
                var eles = [];
                var x = d3.event.sourceEvent.x,
                    y = d3.event.sourceEvent.y;
                var ele = d3.select(document.elementFromPoint(x, y));
                while (ele && ele.attr("id") != "mapSvg") {
                    if (ele.attr("class") == "lens-circle") res.push(ele[0][0]);
                    eles.push(ele);
                    ele.style("visibility", "hidden");
                    ele = d3.select(document.elementFromPoint(x, y));
                }

                for (var i = 0; i < eles.length; i++) {
                    eles[i].style("visibility", "visible");
                }

                if (res.length == 2) {
                    var lensA_id: string = d3.select(res[0].parentNode).attr("id");
                    var lensB_id: string = d3.select(res[1].parentNode).attr("id");
                    var lensC = new BaseCompositeLens(this._element,
                        this._manyLens.GetLens(lensA_id),
                        this._manyLens.GetLens(lensB_id),
                        this._manyLens);

                    if (lensC.isSuccess) {
                        console.log("Base Lens add lens");
                        lensC.render(lensC.extractData());
                    }
                }

                return res;
            }

            protected LensCircleZoomFunc(): void {
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

                this._lens_circle_G
                    .attr("transform", function () {
                        var transform = d3.select(this).attr("transform");
                        transform = transform.replace(/(scale\()\d+\.?\d*(\))/, "$1" + scale + "$2");
                        return transform;
                    })
                ;

                var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
                var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);

                this._sc_lc_svg.select("line")
                    .attr("x1", this._sc_cx + this._sc_radius * this._sc_scale * cosTheta)
                    .attr("y1", this._sc_cy + this._sc_radius * this._sc_scale * sinTheta)
                    .attr("x2", this._lc_cx - this._lc_radius * this._lc_scale * cosTheta)
                    .attr("y2", this._lc_cy - this._lc_radius * this._lc_scale * sinTheta)
                ;
            }

            public HideLens() {
                this._lens_circle_G.style("visibility", "hidden");
            }

            public ShowLens() {
                this._lens_circle_G.style("visibility", "visible");
            }
        }

    }
}