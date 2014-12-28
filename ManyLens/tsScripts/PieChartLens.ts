///<reference path = "../tsScripts/BaseD3Lens.ts" />
module ManyLens{

    export class PieChartLens extends BaseD3Lens {

        private _innerRadius: number = this._lc_radius - 20;
        private _outterRadius: number = this._lc_radius - 0;
        private _pie: D3.Layout.PieLayout = d3.layout.pie();
        private _arc: D3.Svg.Arc = d3.svg.arc()
            .innerRadius(this._innerRadius)
            .outerRadius(this._outterRadius)
        //    .startAngle(0)
        ;
        private _color: D3.Scale.OrdinalScale = d3.scale.category20();

        constructor(element: D3.Selection) {
            super(element);

        }

        public render(): void {
            super.render();
            
        }

        protected extractData(): Array<any> {
            var data: Array<any>;

            data = d3.range(6).map(function (d) {
                return Math.random() * 70;
            });

            return data;
        }

        protected showLens(data: Array<any>): any {
            var p = super.showLens();
            var container = this._element;
            this._pie.value((d) => {
                    return d;
                 })
                .sort(null)
            ;

            var lensG = container
                .select("g.lcthings").append("g").datum(data)
                .attr("opacity", "1e-6")
                .attr("transform", "translate(" + [p.ncx, p.ncy] + ")")
                .on("mousedown", () => {
                    lensG
                        .on("mousemove", () => {
                            var p = d3.mouse(container[0][0]);
                            d3.select("g.lcthings").select("g")
                                .attr("transform", "translate(" + [p[0], p[1]] + ")")
                            ;

                            var theta = Math.atan((p[1] - this._sc_cy) / (p[0] - this._sc_cx));
                            var cosTheta = p[0] > this._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                            var sinTheta = p[0] > this._sc_cx ? Math.sin(theta) : -Math.sin(theta);

                            d3.select("g.lcthings").select("line")
                                .attr("x1", this._sc_cx + this._sc_radius * cosTheta)
                                .attr("y1", this._sc_cy + this._sc_radius * sinTheta)
                                .attr("x2", p[0] - this._lc_radius * cosTheta)
                                .attr("y2", p[1] - this._lc_radius * sinTheta)
                            ;
                        })
                })
                .on("mouseup", function () {
                    d3.select(this)
                        .on("mousemove", null);
                })
            ;

            lensG.selectAll("path")
                .data(this._pie)
            .enter().append("path")
                .attr("fill", (d, i) => {
                    return this._color(i);
                })
                .attr("d", this._arc)
            ;

            d3.select("g.lcthings").select("g")
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this._innerRadius)
                .attr("fill", "rgb(221,221,221)")
                .attr("fill-opacity", 0.3)
            ;
            d3.select("g.lcthings").select("g")
                .transition().duration(p.duration)
                .attr("opacity", "1")
        }
    }
} 