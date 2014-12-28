///<reference path = "../tsScripts/D3ChartObject.ts" />
module ManyLens {

    export class BaseD3Lens extends D3ChartObject {


        protected _select_circle: D3.Selection;
        protected _sc_radius: number = 10;
        protected _sc_cx: number;
        protected _sc_cy: number;

        protected _lens_circle: D3.Selection;
        protected _lc_radius: number = 100;
        //protected _lc_cx: number;
        //protected _lc_cy: number;

        constructor(element: D3.Selection) {
            super(element);

        }

        public render<T>(data?: Array<T>): void {
            var container = this._element;
            var cr = this._sc_radius; 
            var hasShow = false;

            var selectCircle = this._select_circle = this._element.append("circle")
                .attr("r", cr)

                .attr("fill", "purple")
                .attr("fill-opacity",0.3)
                .on("mousedown", () => {
                    container.on("mousemove", moveSelectCircle);
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
                })
            ;

            container
                .on("mousemove", moveSelectCircle)
            ;

            function moveSelectCircle() {
                container.select(".lcthings").remove();
                var p = d3.mouse(container[0][0]);
                selectCircle
                    .attr("cx", p[0])
                    .attr("cy", p[1])
                ;
                hasShow = false;
            }
        }

        protected extractData<T>(): Array<T> {
            throw new Error('This method is abstract');
        }

        protected showLens(any = null): { ncx: number; ncy: number; theta: number; duration:number} {
            var sc_lc_dist = 100;
            var theta = Math.PI / 2.5;
            var container = this._element;
            var cr = this._sc_radius;
            var cx = this._sc_cx + (cr * Math.cos(theta));
            var cy = this._sc_cy + (cr * Math.sin(theta));
            var duration: number = 200;

            container.append("g")
                .attr("class","lcthings")
            .append("line")
                .attr("x1", cx)
                .attr("y1", cy)
                .attr("x2", cx)
                .attr("y2", cy)
                .attr("stoke-width", 2)
                .attr("stroke", "red")
            .transition().duration(duration)
                .attr("x2", () => {
                    cx = cx + (sc_lc_dist * Math.cos(theta));
                    return cx;
                })
                .attr("y2", () => {
                    cy = cy + (sc_lc_dist * Math.sin(theta));
                    return cy;
                })
            ;
            return {
                ncx: cx + (this._lc_radius*Math.cos(theta)),
                ncy: cy + (this._lc_radius*Math.sin(theta)),
                theta: theta,
                duration: duration
            }
        }
    }
}