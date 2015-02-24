///<reference path = "../D3ChartObject.ts" />
module ManyLens {
    export module Lens {
        export interface UnitsDataForLens {
            unitsID: Array<number>;
            keywordsDistribute: Array<{ Key: string; Value: number }>;
            tweetLengthDistribute: Array<{ Key: number; Value: number }>;
            contents: Array<string>;
            hashTagDistribute: Array<{ Key: string; Value: number }>;
        }

        export class BaseD3Lens extends D3ChartObject {

            protected _id: string;
            protected _type: string;
            protected _lens_type_color: string;
            protected _map_id: string;
            protected _combine_failure_rebound_duration = 800;
            protected _data: UnitsDataForLens;
            protected _units_id: number[] = null;

            protected _sc_lc_svg: D3.Selection = null;

            protected _lens_circle_svg: D3.Selection;
            protected _lens_circle: D3.Selection;
            protected _lens_circle_radius: number = 100;
            protected _lens_circle_cx: number;
            protected _lens_circle_cy: number;
            protected _lens_drag_start_cx: number;
            protected _lens_drag_start_cy: number;
            protected _lens_circle_scale: number = 1;
            protected _lens_circle_zoom: D3.Behavior.Zoom = d3.behavior.zoom();
            protected _lens_circle_drag: D3.Behavior.Drag = d3.behavior.drag();

            protected _is_component_lens: boolean = false;
            protected _is_composite_lens: boolean = null;
            protected _host_lens: BaseCompositeLens;

            public get ID(): string {
                return this._id;
            }
            public get MapID(): string {
                return this._map_id;
            }
            public get Type(): string {
                return this._type;
            }
            public get LensTypeColor(): string {
                return this._lens_type_color;
            }
            public get LensCX(): number {
                return this._lens_circle_cx;
            }
            public set LensCX(cx: number) {
                this._lens_circle_cx = cx;
            }
            public get LensCY(): number {
                return this._lens_circle_cy;
            }
            public set LensCY(cy: number) {
                this._lens_circle_cy = cy;
            }
            public get LensScale(): number {
                return this._lens_circle_scale;
            }
            public set LensScale(scale: number) {
                this._lens_circle_scale = scale;
            }
            public get LensRadius(): number {
                return this._lens_circle_radius;
            }
            public set LensRadius(radius: number) {
                this._lens_circle_radius = radius;
            }
            public get LensSVGGroup(): D3.Selection {
                return this._lens_circle_svg;
            }
            public set LensSVGGroup(lensG: D3.Selection) {
                this._lens_circle_svg = lensG;
            }
            public get IsCompositeLens(): boolean {
                return this._is_composite_lens;
            }
            public get IsComponentLens(): boolean {
                return this._is_component_lens;
            }
            public get HostLens(): BaseCompositeLens {
                return this._host_lens;
            }
            public set HostLens(hostLens: BaseCompositeLens) {
                if (hostLens) {
                    this._host_lens = hostLens;
                    this._is_component_lens = true;
                } else {
                    this._host_lens = null;
                    this._is_component_lens = false;
                }
            }
            public get RawData(): any {
                return this._data;
            }
            public get UnitsID(): number[] {
                return this._units_id.sort();
            }

            constructor(element: D3.Selection, type: string,manyLens:ManyLens) {
                super(element,manyLens);
                this._type = type;
                this._id = "lens_" + this._manyLens.LensCount;
                this._units_id = [];

                this._lens_circle_zoom
                    .scaleExtent([1, 2])
                    .on("zoom", () => {
                        this.LensCircleZoomFunc();
                    })
                ;

                this._lens_circle_drag
                    .origin(function (d) { return d; })
                    .on("dragstart", () => {
                        
                        this.LensCircleDragstartFunc();
                        console.log("lc_dragstart " + this._type);
                    })
                    .on("drag", () => {
                        this.LensCircleDragFunc();
                        console.log("lc_drag " + this._type);
                    })
                    .on("dragend", () => {
                        this.LensCircleDragendFunc();
                        console.log("lc_dragend " + this._type);
                    })
                ;
            }

            public Render(color: string): void {
                this._lens_type_color = color;
                this._sc_lc_svg = this._element
                    .append("g")
                    .attr("class", "lens")
                ;

            }

            protected ExtractData(): void {
                throw new Error('This method is abstract');
            }

            protected AfterExtractData(): void {
                throw new Error('This method is abstract');
            }

            public DisplayLens(any = null): any {
                var duration: number = 300;

                this._lens_circle_svg = this._sc_lc_svg.append("g")
                    .data([{ x: this._lens_circle_cx, y: this._lens_circle_cy }])
                    .attr("id",this.ID)
                    .attr("class", "lens-circle-g " + this._type)
                    .attr("transform", "translate(" + [this._lens_circle_cx, this._lens_circle_cy] + ")scale(" + this._lens_circle_scale + ")")
                    .attr("opacity", "1e-6")
                    .style("pointer-events", "none")
                    .on("contextmenu", () => {
                        //d3.event.preventDefault();
                    })
                    .on("mousedown", () => {

                        console.log("lc_mousedown " + this._type);
                    })
                    .on("mouseup", () => {

                        console.log("lc_mouseup " + this._type);
                    })
                    .on("click", () => {

                        console.log("lc_click " + this._type)
                    })
                    .call(this._lens_circle_zoom)
                    .on("dblclick.zoom", null)
                    .call(this._lens_circle_drag)
                ;

                this._lens_circle = this._lens_circle_svg.append("circle")
                    .attr("class", "lens-circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", this._lens_circle_radius)
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

                this._lens_circle_svg
                    .transition().duration(duration)
                    .attr("opacity", "1")
                    .each("end", function () {
                        d3.select(this).style("pointer-events", "");
                    });
                ;

                return duration;
            }

            protected LensCircleDragstartFunc(): void {
                if (d3.event.sourceEvent.button != 0) return;

                var tempGs = d3.select("#mapView").selectAll("svg > g");
                var index = tempGs[0].indexOf(this._sc_lc_svg[0][0]);
                tempGs[0].splice(index, 1);
                tempGs[0].push(this._sc_lc_svg[0][0]);
                tempGs.order();

                this._lens_drag_start_cx = this._lens_circle_cx;
                this._lens_drag_start_cy = this._lens_circle_cy;
            }

            protected LensCircleDragFunc(): void {
                var transform = this._lens_circle_svg.attr("transform");
                this._lens_circle_svg.attr("transform", (d) => {
                    this._lens_circle_cx = d.x = Math.max(this._lens_circle_radius, Math.min(parseFloat(this._element.style("width")) - this._lens_circle_radius, d3.event.x));
                    this._lens_circle_cy = d.y = Math.max(this._lens_circle_radius, Math.min(parseFloat(this._element.style("height")) - this._lens_circle_radius, d3.event.y));
                    transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                    return transform;
                });
            }

            protected LensCircleDragendFunc(): boolean {
                var res = [];
                var eles = [];
                var x = d3.event.sourceEvent.x,
                    y = d3.event.sourceEvent.y;

                var p = d3.mouse(this._element.node());
                if (p[0] < 0 || p[0] >parseFloat(this._element.style("width")) || p[1] < 0 || p[1] >parseFloat(this._element.style("height")))
                    return;

                var ele = d3.select(document.elementFromPoint(x, y));
                while (ele && ele.attr("id") != "mapSvg") {
                    if (ele.classed("lens-circle")) res.push(ele[0][0]);
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
                    var lensA_id: string = d3.select(res[0].parentNode).attr("id");
                    var lensB_id: string = d3.select(res[1].parentNode).attr("id");
                    var lensC:BaseCompositeLens = LensAssemblyFactory.CombineLens(
                        this._element,
                        this._manyLens,
                        this._manyLens.GetLens(lensA_id),
                        this._manyLens.GetLens(lensB_id));

                    if (lensC) {
                        lensC.Render("black");
                        //lensC.DisplayLens();

                        return true;
                    } else {

                        var transform = this._lens_circle_svg.attr("transform");
                        this._lens_circle_svg.transition()
                            .ease('back-out')
                            .duration(this._combine_failure_rebound_duration)
                            .attr("transform", (d) => {
                                this._lens_circle_cx = d.x = this._lens_drag_start_cx;
                                this._lens_circle_cy = d.y = this._lens_drag_start_cy;
                                transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                                return transform;
                            })
                        ;

                    }
                }
                return false;
            }

            protected LensCircleZoomFunc(): void {
                if (d3.event.sourceEvent.type != "wheel") {
                    return;
                }

                if (d3.event.scale == this._lens_circle_scale) {
                    return;
                }
                var scale = this._lens_circle_scale = d3.event.scale;

                this._lens_circle_svg
                    .attr("transform", function () {
                        var transform = d3.select(this).attr("transform");
                        transform = transform.replace(/(scale\()\d+\.?\d*\,?\d*\.?\d*(\))/, "$1" + scale + "$2");
                        return transform;
                    })
                ;

            }

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

            public RemoveLens() {
                this._lens_circle_svg
                    .attr("opacity", "1")
                    .style("pointer-events", "none")
                    .transition()
                    .duration(200)  //this is hard code, should be optimize
                    .attr("opacity", "1e-6")
                    .remove();
            }
        }

    }
}