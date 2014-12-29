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
        protected _color: D3.Scale.OrdinalScale = d3.scale.category20();

        constructor(element: D3.Selection) {
            super(element,"PieChartLens");

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
                .select("g.lcthings").select("g")
                .datum(data)
                .attr("opacity", "1e-6")
                .attr("transform", "translate(" + [p.lcx, p.lcy] + ")")
            ;
                lensG.selectAll("path")
                    .data(this._pie)
                .enter().append("path")
                    .attr("fill", (d, i) => {
                        return this._color(i);
                    })
                    .attr("d", this._arc)
            ;

           this._lens_circle =  lensG
                .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this._innerRadius)
                .attr("fill", "rgb(221,221,221)")
                //.attr("fill-opacity", 0.3)
            ;
            lensG
                .transition().duration(p.duration)
                .attr("opacity", "1")
            ;
        }

        protected zoomFunc(): void {
            super.zoomFunc();
        }
    }
} 