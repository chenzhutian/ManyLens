///<reference path = "../tsScripts/D3ChartObject.ts" />
module ManyLens {

    export class BaseD3Lens extends D3ChartObject {

        protected _type: string;
        protected _has_put_down: boolean = false;
        protected _sc_lc_svg: D3.Selection;
        protected _color: D3.Scale.OrdinalScale;

        protected _select_circle_G: D3.Selection;
        protected _select_circle: D3.Selection;
        protected _sc_radius: number = 10;
        protected _sc_cx: number;
        protected _sc_cy: number;
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

        public get Type(): string {
            return this._type;
        }

        constructor(element: D3.Selection,type:string) {
            super(element);
            this._type = type;
        }

        public render(color:string): void {
            var container = this._element;
            var hasShow = false;

            var sclcSvg = this._sc_lc_svg = container
                //.insert("g", ":first-child")
                .append("g")
                .attr("class", "lens");

            this._sc_zoom
                .scaleExtent([1, 4])
                .on("zoomstart", () => {

                })
                .on("zoom", () => {
                    this.SelectCircleZoomFunc();
                })
                .on("zoomend", () => {

                })
            ;

            this._sc_drag
                .origin(function (d) { return d; })
                .on("dragstart", () => {
                    console.log("drag start!");
                })
                .on("drag", () => {
                    sclcSvg.select("g.lens-circle").remove(); 
                    sclcSvg.select("line").remove();
                    selectCircle
                        .attr("cx", (d) => { return d.x = d3.event.x; })
                        .attr("cy", (d) => { return d.y = d3.event.y; })
                    ;
                    hasShow = false;
                })
                .on("dragend", (d) => {
                    this._sc_cx = d.x;
                    this._sc_cy = d.y;

                    //传递数据给Lens显示
                    var data = this.extractData();
                    if (!hasShow) {
                        this.showLens(data);
                        hasShow = true;
                    }

                    //re-order the g elements so the paneG could on the toppest
                    var tempGs = d3.select("#mapView").selectAll("svg > g");
                    tempGs[0].splice(tempGs[0].length - 2, 0, tempGs[0].pop());
                    tempGs.order();
                })
            ;

            this._select_circle_G = this._sc_lc_svg.append("g")
                .attr("class", "select-circle")
            ;
            var selectCircle = this._select_circle = 
                this._select_circle_G.append("circle").data([{x:this._sc_cx,y:this._sc_cy}])
            ;

            selectCircle
                .attr("r", this._sc_radius)
                .attr("fill", color)
                .attr("fill-opacity", 0.3)
                .attr("stroke", "black")
                .attr("stroke-width",1)
                .on("mouseup", (d) => {
                    if (!this._has_put_down) {
                        this._has_put_down = true;
                        d.x = this._sc_cx = parseFloat(selectCircle.attr("cx"));
                        d.y = this._sc_cy = parseFloat(selectCircle.attr("cy"));
                        container.on("mousemove", null);
                    }

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

        protected showLens(any = null): { lcx: number; lcy: number; theta: number; duration:number} {

            var sc_lc_dist = 100;
            var theta = Math.random() * Math.PI;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            var container = this._element;
            var cr = this._sc_radius;
            var cx = this._sc_cx + (cr * cosTheta * this._sc_scale);
            var cy = this._sc_cy + (cr * sinTheta * this._sc_scale);
            var duration: number = 300;

            this._sc_lc_svg.append("line")
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

            this._lc_zoom
                .scaleExtent([1, 2])
                .on("zoomstart", () => {
                })
                .on("zoom", () => {
                    this.LensCircleZoomFunc();
                })
                .on("zoomend", () => {
                })
            ;

            this._lc_drag
                .origin(function (d) { return d; })
                .on("drag", () => {
                    this.LensCircleDragFunc();
                })
            ;

            this._lens_circle_G = this._sc_lc_svg.append("g")
                .data([{x:this._lc_cx,y:this._lc_cy}])
                .attr("class","lens-circle")
                .attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")scale("+this._lc_scale+")")
                .attr("opacity", "1e-6")
                .on("click", () => {
                    d3.event.stopPropagation(); //为了防止重叠的问题，还没做好
                })
                .call(this._lc_zoom)
                .call(this._lc_drag)
                .on("mousedown", () => {
                    //TODO
                })
                .on("mouseup", () => {
                    //TODO
                })
            ;

            this._lens_circle = this._lens_circle_G.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this._lc_radius)
                .attr("fill", "#fff")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
            ;

            ////re-order the line, select-circle and lens-circle
            //var tempChildren = d3.selectAll(this._sc_lc_svg[0][0].children);
            //var tt = tempChildren[0][0];
            //tempChildren[0][0] = tempChildren[0][1];
            //tempChildren[0][1] = tt;
            //tempChildren.order();

            return {
                lcx: this._lc_cx,
                lcy: this._lc_cy,
                theta: theta,
                duration: duration
            }
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

        protected LensCircleZoomFunc(): void {
            if (d3.event.sourceEvent.type == "mousemove") {
                return;
            }
            
            if (d3.event.scale == this._lc_scale && d3.event.sourceEvent.type == "wheel") {
                return;
            }
            if (d3.event.scale == this._lc_scale && d3.event.sourceEvent.type == "wheel") {
                return;
            }
            var scale = this._lc_scale = d3.event.scale;

            this._lens_circle_G
                .attr("transform",  function(){
                    var transform = d3.select(this).attr("transform");
                    transform = transform.replace(/(scale\()\d+\.?\d*(\))/, "$1" + scale + "$2");
                    return transform;
                })
            ;
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
    }
}