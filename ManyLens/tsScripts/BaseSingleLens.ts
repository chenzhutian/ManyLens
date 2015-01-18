///<reference path = "../tsScripts/BaseD3Lens.ts" />
module ManyLens {
    export module Lens{
        export class BaseSingleLens extends Lens.BaseD3Lens {

            protected _has_put_down: boolean = false;
            protected _has_showed_lens: boolean = false;

            protected _select_circle_G: D3.Selection;
            protected _select_circle: D3.Selection;

            protected _sc_zoom: D3.Behavior.Zoom = d3.behavior.zoom();
            protected _sc_drag: D3.Behavior.Drag = d3.behavior.drag();

            constructor(element: D3.Selection, type: string, manyLens: ManyLens) {
                super(element,type,manyLens);
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

            public showLens(any = null): { lcx: number; lcy: number; duration: number } {
                
                var duration: number = 300;

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


                super.showLens();
                return {
                    lcx: this._lc_cx,
                    lcy: this._lc_cy,
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

        }
    }
} 