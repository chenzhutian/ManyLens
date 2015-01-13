///<reference path = "../tsScripts/D3ChartObject.ts" />
module ManyLens {

    export class BaseD3Lens extends D3ChartObject {

        protected _type: string;
        protected _sc_lc_svg: D3.Selection;

        protected _select_circle_G: D3.Selection;
        protected _select_circle: D3.Selection;
        protected _sc_radius: number = 10;
        protected _sc_cx: number;
        protected _sc_cy: number;
        protected _sc_scale: number = 1;
        protected _sc_zoom: D3.Behavior.Zoom = d3.behavior.zoom();

        protected _lens_circle_G: D3.Selection;
        protected _lens_circle: D3.Selection;
        protected _lc_radius: number = 100;
        protected _lc_cx: number;
        protected _lc_cy: number;
        protected _lc_zoom: D3.Behavior.Zoom = d3.behavior.zoom();

        protected _color: D3.Scale.OrdinalScale;

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
                .scaleExtent([1, 2])
                .on("zoomstart", () => {

                })
                .on("zoom", () => {
                    this.SelectCircleZoomFunc();
                })
                .on("zoomend", () => {

                })
            ;

             var sc_g =  this._select_circle_G = this._sc_lc_svg.append("g")
                .attr("class", "select-circle")
            ;
            var selectCircle = this._select_circle = 
                this._select_circle_G.append("circle")
            ;

            selectCircle
                .attr("r", this._sc_radius)
                .attr("fill", color)
                .attr("fill-opacity", 0.3)
                .attr("stroke", "black")
                .attr("stroke-width",1)
                .on("mousedown", () => {
                    container.on("mousemove", moveSelectCircle);    //因为鼠标是在大SVG里移动，所以要绑定到大SVG上

                    //d3.event.stopPropagation();                   //sc重叠的时候会出问题
                })
                .on("mouseup", () => {
                    this._sc_cx = parseFloat(selectCircle.attr("cx"));
                    this._sc_cy = parseFloat(selectCircle.attr("cy"));

                    //传递数据给Lens显示
                    var data = this.extractData();
                    if (!hasShow) {
                        this.showLens(data);
                        hasShow = true;
                    }

                    container.on("mousemove", null);                //鼠标松开，取消回调函数

                    //re-order the g elements so the paneG could on the toppest
                    var tempGs = d3.select("#mapView").selectAll("svg > g");
                    tempGs[0].splice(tempGs[0].length - 2, 0, tempGs[0].pop());
                    tempGs.order();

                    //d3.event.stopPropagation();
                })
                .on("click", () => {
                    //d3.event.stopPropagation();
                })
                .call(this._sc_zoom)
            ;

            container.on("mousemove", moveSelectCircle);            //因为鼠标是在大SVG里移动，所以要绑定到大SVG上

            function moveSelectCircle() {
                sclcSvg.select("g.lens-circle").remove();
                sclcSvg.select("line").remove();
                var p = d3.mouse(container[0][0]);
                selectCircle
                    .attr("cx", p[0])
                    .attr("cy", p[1])
                ;
                hasShow = false;
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

            this._lens_circle_G = this._sc_lc_svg.append("g")
                .attr("class","lens-circle")
                .attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")")
                .attr("opacity", "1e-6")
                .on("click", () => {
                    d3.event.stopPropagation(); //为了防止重叠的问题，还没做好
                })
                .call(this._lc_zoom)
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

            //re-order the line, select-circle and lens-circle
            var tempChildren = d3.selectAll(this._sc_lc_svg[0][0].children);
            var tt = tempChildren[0][0];
            tempChildren[0][0] = tempChildren[0][1];
            tempChildren[0][1] = tt;
            tempChildren.order();

            return {
                lcx: this._lc_cx,
                lcy: this._lc_cy,
                theta: theta,
                duration: duration
            }
        }

        protected SelectCircleZoomFunc(): void {

            if (d3.event.sourceEvent.type == "mousemove") {
                return;
            }

            //if (d3.event.scale >= this._sc_zoom.scaleExtent()[1]) {
            //    return;
            //}
            //if (d3.event.scale <= this._sc_zoom.scaleExtent()[0]) {
            //    return;
            //}
            


            console.log(d3.event.scale);
            var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
            var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
            var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);

            this._sc_scale = d3.event.scale;
            this._select_circle
                .attr("r", this._sc_radius * this._sc_scale)
            ;

            this._sc_lc_svg.select("line")
                .attr("x1", this._sc_cx + this._sc_radius * d3.event.scale * cosTheta)
                .attr("y1", this._sc_cy + this._sc_radius * d3.event.scale * sinTheta)
                //.attr("x2", this._lc_cx - this._lc_radius *  * cosTheta)
                //.attr("y2", this._lc_cy - this._lc_radius *  * sinTheta)
            ;

        }

        protected LensCircleZoomFunc(): void {
            if (d3.event.sourceEvent.type == "mousemove") {
                var p1 = d3.mouse(this._element[0][0]);

                this._lc_cx = p1[0];
                this._lc_cy = p1[1];
                //this._lc_cx += d3.event.sourceEvent.movementX;
                //this._lc_cy += d3.event.sourceEvent.movementY;
            }

            var theta = Math.atan((this._lc_cy - this._sc_cy) / (this._lc_cx - this._sc_cx));
            var cosTheta = this._lc_cx > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
            var sinTheta = this._lc_cx > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);

            this._lens_circle_G
                .attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + d3.event.scale + ")")
            ;

            this._sc_lc_svg.select("line")
                .attr("x1", this._sc_cx + this._sc_radius * this._sc_scale * cosTheta)
                .attr("y1", this._sc_cy + this._sc_radius * this._sc_scale * sinTheta)
                .attr("x2", this._lc_cx - this._lc_radius * d3.event.scale * cosTheta)
                .attr("y2", this._lc_cy - this._lc_radius * d3.event.scale * sinTheta)
            ;
        }
    }
}