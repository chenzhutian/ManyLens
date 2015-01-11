///<reference path = "../tsScripts/D3ChartObject.ts" />
module ManyLens {

    export class BaseD3Lens extends D3ChartObject {

        protected _sc_lc_svg: D3.Selection;
        protected _lensG: D3.Selection;
        protected _type: string;
        protected _select_circle: D3.Selection;
        protected _sc_radius: number = 10;
        protected _sc_cx: number;
        protected _sc_cy: number;

        protected _lens_circle: D3.Selection;
        protected _lc_radius: number = 100;
        protected _lc_cx: number;
        protected _lc_cy: number;

        protected _color: D3.Scale.OrdinalScale;
        protected _zoom: D3.Behavior.Zoom = d3.behavior.zoom();

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

            var sclcSvg =  this._sc_lc_svg = container.append("g")
                .attr("class", "lcthings");

            var selectCircle = this._select_circle = this._sc_lc_svg.append("circle")
                .attr("r", this._sc_radius)
                .attr("fill", color)
                .attr("fill-opacity",0.3)
                .on("mousedown", () => {
                    container.on("mousemove", moveSelectCircle);
                    d3.event.stopPropagation();
                })
                .on("mouseup", () => {
                    this._sc_cx = parseFloat(selectCircle.attr("cx"));
                    this._sc_cy = parseFloat(selectCircle.attr("cy"));

                    var data = this.extractData();
                    if (!hasShow) {
                        this.showLens(data);
                        hasShow = true;
                    }

                    container.on("mousemove", null);
                    d3.event.stopPropagation();
                })
                .on("click", () => {
                    d3.event.stopPropagation();
                })
            ;

            container
                .on("mousemove", moveSelectCircle)
            ;

            function moveSelectCircle() {
                sclcSvg.select("g").remove();
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
            var cx = this._sc_cx + (cr * cosTheta);
            var cy = this._sc_cy + (cr * sinTheta);
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

            this._zoom
                .scaleExtent([1, 2])
                .on("zoomstart", () => {
                })
                .on("zoom", () => {
                    this.zoomFunc();
                })
                .on("zoomend", () => {
                })
            ;

            this._lensG = this._sc_lc_svg.append("g")
                .attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")")
                .attr("opacity", "1e-6")
                .on("click", () => {
                    d3.event.stopPropagation();
                })
                .call(this._zoom)
                .on("mousedown", () => {
                })
                .on("mouseup", () => {
                })
            ;

            this._lens_circle = this._lensG.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this._lc_radius)
                .attr("fill", "#fff")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
            ;

            return {
                lcx: this._lc_cx,
                lcy: this._lc_cy,
                theta: theta,
                duration: duration
            }
        }

        protected zoomFunc(): void {
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

            this._lensG
                .attr("transform", "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + d3.event.scale + ")")
            ;

            this._sc_lc_svg.select("line")
                .attr("x1", this._sc_cx + this._sc_radius * cosTheta)
                .attr("y1", this._sc_cy + this._sc_radius * sinTheta)
                .attr("x2", this._lc_cx - this._lc_radius * d3.event.scale * cosTheta)
                .attr("y2", this._lc_cy - this._lc_radius * d3.event.scale * sinTheta)
            ;
        }
    }
}