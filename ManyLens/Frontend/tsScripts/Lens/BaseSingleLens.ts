///<reference path = "./BaseD3Lens.ts" />
module ManyLens {
    export module Lens{
        export class BaseSingleLens extends BaseD3Lens {

            public static Type: string = "BaseSingleLens";

            protected _select_circle_svg: D3.Selection;
            protected _select_circle: D3.Selection;
            protected _select_circle_radius: number = 0;
            protected _select_circle_cx: number = -10;
            protected _select_circle_cy: number = -10;
            protected _select_circle_scale: number = 1;
            protected _select_circle_zoom: D3.Behavior.Zoom = d3.behavior.zoom();
            protected _select_circle_drag: D3.Behavior.Drag = d3.behavior.drag();

            protected _has_put_down: boolean = false;
            protected _has_showed_lens: boolean = false;

            //protected _sc_drag_event_flag: boolean = false;
            protected _sc_lc_default_dist = 100;

            protected _extract_data_map_func: (d?: any) => any = null;

            public get LinkLine(): D3.Selection {
                return this._sc_lc_svg.select("line");
            }
            public get SelectCircleCX(): number {
                return this._select_circle_cx;
            }
            public get SelectCircleCY(): number {
                return this._select_circle_cy;
            }
            public get SelectCircleScale(): number {
                return this._select_circle_scale;
            }
            public get SelectCircleRadius(): number {
                return this._select_circle_radius;
            }

            constructor(element: D3.Selection, type: string, manyLens: ManyLens) {
                super(element, type, manyLens);
                this._is_composite_lens = false;
                this._select_circle_radius = 10;
            }

            public Render(color: string): void {
                super.Render(color);
                var container = this._element;
                var hasShow = false;

                this._select_circle_zoom
                    .scaleExtent([1, 4])
                    .on("zoom", () => {
                        this.SelectCircleZoomFunc();
                        console.log("sc_zoom " + this._type);
                    })
                ;

                this._select_circle_drag
                    .origin(function (d) { return d; })
                    .on("dragstart", () => {
                        //this._sc_drag_event_flag = false;

                        console.log("sc_dragstart " + this._type);
                    })
                    .on("drag", () => {
                        //if (this._sc_drag_event_flag) {
                            this.SelectCircleDragFunc();
                        //} else {
                        //    this._sc_drag_event_flag = true;
                        //}
                        console.log("sc_drag " + this._type);
                    })
                    .on("dragend", (d) => {
                        this.SelectCircleDragendFunc(d);
                        console.log("sc_dragend " + this._type);
                    })
                ;

                this._sc_lc_svg.append("line")
                    .attr("stoke-width", 2)
                    .attr("stroke", "red")
                ;

                this._select_circle_svg = this._sc_lc_svg.append("g")
                    .attr("class", "select-circle")
                ;

                var selectCircle = this._select_circle =
                    this._select_circle_svg.append("circle")
                        .data([{ x: this._select_circle_cx, y: this._select_circle_cy }])
                ;

                selectCircle
                    .attr("r", this._select_circle_radius)
                    .attr("fill", color)
                    .attr("fill-opacity", 0.7)
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr({
                        cx: -50,
                        cy:-50
                    })
                    .on("mouseup", (d) => {
                        if (!this._has_put_down) {
                            this._has_put_down = true;
                            d.x = this._select_circle_cx = parseFloat(selectCircle.attr("cx"));
                            d.y = this._select_circle_cy = parseFloat(selectCircle.attr("cy"));
                            container.on("mousemove", null);
                        }
                    })
                    .on("contextmenu", () => {
                        this._sc_lc_svg.remove();
                        var hostLens: BaseCompositeLens = this.DetachHostLens()
                        if (hostLens) {
                            this._manyLens.DetachCompositeLens(this._element, hostLens, this);
                        }
                        d3.event.preventDefault();
                    })
                    .call(this._select_circle_zoom)
                    .on("dblclick.zoom", null)
                    .on("mousedown.zoom", null)
                    .call(this._select_circle_drag)
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

            public ExtractData(map?: (d?: any) => any): any {
                if (map != null) {
                    this._extract_data_map_func = map;
                    return null;
                }

                if (!this._extract_data_map_func) return null;

                var res = this.GetElementByMouse();
                if (!res) return null;

                return this._extract_data_map_func(d3.select(res).data()[0]);
            }

            public DisplayLens() {
                
                var duration: number = super.DisplayLens();

                //if is new area with new data, then show the link line 
                if (this._data) {
                    var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                    var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);

                    var cx = this._select_circle_cx + (this._select_circle_radius * cosTheta * this._select_circle_scale);
                    var cy = this._select_circle_cy + (this._select_circle_radius * sinTheta * this._select_circle_scale);

                    this._sc_lc_svg.select("line")
                        .attr("x1", cx)
                        .attr("y1", cy)
                        .attr("x2", cx)
                        .attr("y2", cy)
                        .attr("stoke-width", 2)
                        .attr("stroke", "red")
                        .transition().duration(duration)
                        .attr("x2", () => {
                            return this._lens_circle_cx;//cx + (this._sc_lc_default_dist * cosTheta);
                        })
                        .attr("y2", () => {
                            return this._lens_circle_cy;//cy + (this._sc_lc_default_dist * sinTheta);
                        })
                    ;
                } 
            }

            protected SelectCircleDragFunc(): void {
                if (!this._has_put_down) return;
                if (d3.event.sourceEvent.button != 0) return;

                this._sc_lc_svg.select("g.lens-circle-g").remove();
                this._sc_lc_svg.select("line")
                    .attr("x1", d3.event.x)
                    .attr("x2", d3.event.x)
                    .attr("y1", d3.event.y)
                    .attr("y2", d3.event.y);

                this._select_circle
                    .attr("cx", (d) => {
                        return d.x = Math.max(0, Math.min(parseFloat(this._element.style("width")), d3.event.x));
                    })
                    .attr("cy", (d) => {
                        return d.y = Math.max(0, Math.min(parseFloat(this._element.style("height")), d3.event.y));
                    })
                ;
                this._has_showed_lens = false;

                var hostLens: BaseCompositeLens = this.DetachHostLens()
                if (hostLens) {
                    this._manyLens.DetachCompositeLens(this._element, hostLens, this);
                }
            }

            protected SelectCircleDragendFunc(selectCircle): void {
                if (!this._has_put_down) return;
                if (d3.event.sourceEvent.button != 0) return;

                //传递数据给Lens显示
                if (!this._has_showed_lens) {
                    this._select_circle_cx = selectCircle.x;
                    this._select_circle_cy = selectCircle.y;

                    var theta = Math.random() * Math.PI;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);

                    this._lens_circle_cx = this._select_circle_cx
                    + (this._select_circle_radius * this._select_circle_scale
                    + this._sc_lc_default_dist
                    + this._lens_circle_radius) * cosTheta;

                    this._lens_circle_cy = this._select_circle_cy
                    + (this._select_circle_radius * this._select_circle_scale
                    + this._sc_lc_default_dist
                    + this._lens_circle_radius) * sinTheta;

                    this._data = this.ExtractData();
                    this.DisplayLens();

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

                if (d3.event.scale == this._select_circle_scale) {
                    return;
                }


                this._select_circle_scale = d3.event.scale;
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);

                this._select_circle
                    .attr("r", this._select_circle_radius * this._select_circle_scale)
                ;

                this._sc_lc_svg.select("line")
                    .attr("x1", this._select_circle_cx + this._select_circle_radius * d3.event.scale * cosTheta)
                    .attr("y1", this._select_circle_cy + this._select_circle_radius * d3.event.scale * sinTheta)
                ;
            }

            protected LensCircleDragFunc(): void {
                super.LensCircleDragFunc();

                this.ReDrawLinkLine();

            }

            protected LensCircleDragendFunc(): boolean {
                var res = super.LensCircleDragendFunc();

                if (!res) {
                    var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                    var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);

                    this._sc_lc_svg.select("line")
                        .transition()
                        .duration(this._combine_failure_rebound_duration)
                        .ease('back-out')
                        .attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta)
                        .attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta)
                        .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                        .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta)
                    ;
                }

                return res;

            }

            protected LensCircleZoomFunc(): void {
                super.LensCircleZoomFunc();

                this.ReDrawLinkLine();
            }

            private ReDrawLinkLine(): void {
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);

                this._sc_lc_svg.select("line")
                    .attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta)
                    .attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta)
                    .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                    .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta)
                ;
            }

            public DetachHostLens(): BaseCompositeLens {
                if (this.IsComponentLens) {
                    var hostLens: BaseCompositeLens = this._host_lens;
                    this.HostLens = null;
                    return hostLens;
                } else {
                    return null;
                }
            }

            public ChangeHostTo(hostLens: BaseCompositeLens):void {
                if (this.IsComponentLens) {
                    this.HostLens = hostLens;
                } else {
                    return;
                }
            }

            protected GetElementByMouse(): Element {
                var res;
                var eles = [];
                try {
                    var x = d3.event.sourceEvent.x,
                        y = d3.event.sourceEvent.y;
                }catch(e){
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
            }
        }
    }
} 