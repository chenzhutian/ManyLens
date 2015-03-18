///<reference path = "./BaseD3Lens.ts" />
module ManyLens {
    export module Lens {
        export class BaseSingleLens extends BaseD3Lens {

            public static Type: string = "BaseSingleLens";

            protected _attribute_name: string;
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

            protected _extract_data_map_func: ExtractDataFunc = null;

            public get AttributeName(): string {
                return this._attribute_name;
            }
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

            constructor(element: D3.Selection, attributeName: string, type: string, manyLens: ManyLens) {
                super(element, type, manyLens);
                this._is_composite_lens = false;
                this._select_circle_radius = 10;
                this._attribute_name = attributeName;

                this._select_circle_zoom
                    .scaleExtent([1, 4])
                    .on("zoom", () => {
                        this.SelectCircleZoomFunc();
                        //console.log("sc_zoom " + this._type);
                        d3.event.sourceEvent.stopPropagation();
                    })
                ;

                this._select_circle_drag
                    .origin(function (d) { return d; })
                    .on("dragstart", () => {
                        //this._sc_drag_event_flag = false;

                        //console.log("sc_dragstart " + this._type);
                        d3.event.sourceEvent.stopPropagation();
                    })
                    .on("drag", () => {
                        //if (this._sc_drag_event_flag) {
                        this.SelectCircleDragFunc();
                        //} else {
                        //    this._sc_drag_event_flag = true;
                        //}
                        //console.log("sc_drag " + this._type);
                        d3.event.sourceEvent.stopPropagation();
                    })
                    .on("dragend", (d) => {
                        this.SelectCircleDragendFunc(d);
                        //console.log("sc_dragend " + this._type);
                        d3.event.sourceEvent.stopPropagation();
                    })
                ;


            }

            public Render(color: string): void {
                super.Render(color);
                var container = this._element;
                var hasShow = false;

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
                        cy: -50
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
                        this._manyLens.RemoveLens(this);

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
                this._sc_lc_svg.append("line")
                    .attr("stoke-width", 2)
                    .attr("stroke", "red")
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

            public DataAccesser(map?: ExtractDataFunc): any {
                if (map == null) return this._extract_data_map_func;
                this._extract_data_map_func = map;
                return this;
            }

            protected ExtractData(): void {
                var data: { unitsID: number[]; mapID: string } = this.GetElementByMouse();
                if (!data) {
                    this._data = null;
                    return null;
                }
                console.log(data.unitsID);
                console.log(data.mapID);
                this._units_id = data.unitsID.sort();
                this._map_id = data.mapID;
                
                var promise = this._manyLens.ManyLensHubServerGetLensData(this.MapID, this.ID, this.UnitsID, this._extract_data_map_func.TargetAttribute);
                promise
                    .done((d) => {
                        console.log("promise done in basesingleLens");

                        this._data = d;
                        
                        this.AfterExtractData();
                        this.DisplayLens();
                    });
            }

            protected AfterExtractData(): void {
                //Do nothing in this abstract method
            }

            public DisplayLens(): boolean {
                if (this._data) {
                    var duration: number = super.DisplayLens();
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
                    return true;
                } else {
                    return null;
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

            //The entrance of new data
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

                    this.ExtractData(); //it will invoke display automatically when finishing extractdata

                    this._has_showed_lens = true;
                }

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

            public ChangeHostTo(hostLens: BaseCompositeLens): void {
                if (this.IsComponentLens) {
                    this.HostLens = hostLens;
                } else {
                    return;
                }
            }

            protected GetElementByMouse(): { unitsID: number[]; mapID: string } {
                var unitsID = [];
                var mapID;
                var rect: SVGRect = (<SVGSVGElement>this._element.node()).createSVGRect();

                rect.x = this._select_circle_cx - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale;
                rect.y = this._select_circle_cy - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale;
                rect.height = rect.width = this._select_circle_radius * Math.SQRT2 * this._select_circle_scale;

                var ele = (<SVGSVGElement>this._element.node()).getIntersectionList(rect, null);
                var minDist2 = Number.MAX_VALUE;
                var minUnitsID = -1;
                for (var i = 0, len = ele.length; i < len; ++i) {
                    var node = d3.select(ele.item(i));
                    if (node.classed("unit")) {
                        var dx = parseFloat(node.attr("x")) + parseFloat(node.attr("width")) * 0.5 - this._select_circle_cx;
                        var dy = parseFloat(node.attr("y")) + parseFloat(node.attr("height")) * 0.5 - this._select_circle_cy;
                        var dist2 = dx * dx + dy * dy;
                        if (dist2 < (this._select_circle_radius * this._select_circle_scale * this._select_circle_radius * this._select_circle_scale)) {
                            var tID = node.data()[0]['unitID'];
                            unitsID.push(tID);
                            mapID = node.data()[0]['mapID'];
                        } else if (dist2 < minDist2) {
                            mapID = node.data()[0]['mapID'];
                            minDist2 = dist2;
                            minUnitsID = node.data()[0]['unitID'];
                        }

                    }
                }

                var res = null;
                if (unitsID.length > 0 && mapID) {
                    res = { unitsID: unitsID, mapID: mapID };
                } else if (unitsID.length == 0 && mapID) {
                    res = { unitsID: [minUnitsID], mapID: mapID };
                } else {
                    console.log("there is a bug here "+ unitsID);
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
            }
        }
    }
} 