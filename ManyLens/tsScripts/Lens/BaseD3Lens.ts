﻿///<reference path = "../D3ChartObject.ts" />
module ManyLens {
    export module Lens {
        export class BaseD3Lens extends D3ChartObject{

            public static Type: string = "BaseD3Lens";

            protected _id: string;
            protected _type: string;
            protected _lens_type_color: string;
            protected _manyLens: ManyLens.ManyLens;
            protected _is_composite_lens: boolean = null;

            protected _sc_lc_svg: D3.Selection;

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
            public get IsCompositeLens(): boolean {
                return this._is_composite_lens;
            }

            constructor(element: D3.Selection, type: string,manyLens:ManyLens) {
                super(element);
                this._manyLens = manyLens;
                this._type = type;
            }

            public Render(color: string): void {
                this._lens_type_color = color;
                this._sc_lc_svg = this._element
                    .append("g")
                    .attr("class", "lens")
                ;
            }

            protected ExtractData(any = null): any {
                throw new Error('This method is abstract');
            }

            public DisplayLens(any = null): any {
                var duration: number = 300;

                this._lc_zoom
                    .scaleExtent([1, 2])
                    .on("zoom", () => {
                        this.LensCircleZoomFunc();
                    })
                ;

                this._lc_drag
                    .origin(function (d) { return d; })
                    .on("dragstart", () => {
                        this.LensCircleDragstartFunc();
                    })
                    .on("drag", () => {
                        this.LensCircleDragFunc();
                    })
                    .on("dragend", () => {
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

                this._lens_circle_G
                    .transition().duration(duration)
                    .attr("opacity", "1")
                ;

                return duration;
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
                    var lensC = LensAssemblyFactory.Combine(
                        this._element,
                        this._manyLens.GetLens(lensA_id),
                        this._manyLens.GetLens(lensB_id),
                        this._manyLens
                        );

                    if (lensC.IsSuccess) {
                        console.log("Base Lens add lens");
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