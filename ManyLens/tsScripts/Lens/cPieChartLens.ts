module ManyLens {
    export module Lens {
        export class cPieChartLens extends BaseCompositeLens {

            public static Type: string = "cPieChartLens";


            private _color: D3.Scale.OrdinalScale = d3.scale.category20();
            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();

            constructor(element: D3.Selection,
                manyLens: ManyLens.ManyLens,
                firstLens: BaseSingleLens,
                secondLens: BaseSingleLens) {
                super(element, cPieChartLens.Type, manyLens, firstLens, secondLens);

                this._pie
                    .value((d) => {
                        return d.host;
                    })
                    .sort(null)
                ;

                this._arc
                    .innerRadius((d) => {
                        return this._lc_radius - 20;
                    })
                    .outerRadius((d) => {
                        return this._lc_radius;
                    })
                ;

                
            }

            public Render(color = "pupple"): void {
                super.Render(color);

            }

            protected ExtractData(): any {
                var data: Array<any>;

                data = d3.range(6).map((d,i)=> {
                    return {
                        host: this._data[i],
                        sub: Math.random() * this._data[i]
                    };
                });

                return data;
            }

            public DisplayLens(): void {
                super.DisplayLens();
                var data = this.ExtractData();

                this._lens_circle_G.selectAll(".innerPie")
                    .data(this._pie(data))
                    .enter().append("path")
                    .attr("d", this._arc)
                    .style("fill", (d,i) =>{ return this._color(i); })
                    .style("fill-rule", "evenodd")
                ;

                console.log(this._pie(data));

                this._arc.innerRadius(this._lc_radius-40)
                    .outerRadius(this._lc_radius -20)
                    .endAngle(function (d, i) {
                        return d.startAngle + (d.endAngle - d.startAngle) * (d.data.sub / d.value);
                    });

                this._lens_circle_G.selectAll(".outerPie")
                    .data(this._pie(data))
                    .enter().append("path")
                    .attr("fill", (d, i)=>{ return this._color(i); })
                    .attr("d", this._arc)
                ;
            }
        }
    }
} 