///<reference path = "../tsScripts/D3ChartObject.ts" />

module ManyLens {
    export class LensPane extends D3ChartObject {

        private _lens: Array<BaseD3Lens> = new Array<BaseD3Lens>();
        private _pane_radius: number = 100;
        private _pane_arc: D3.Svg.Arc = d3.svg.arc();
        private _pane_pie: D3.Layout.PieLayout = d3.layout.pie();
        private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
        private _pane_svg_g: D3.Selection = null;
        private _pane_timer;

        constructor(element: D3.Selection) {
            super(element);
            this._lens.push(new BarChartLens(element));
            this._lens.push(new LocationLens(element));
            this._lens.push(new NetworkTreeLens(element));
            this._lens.push(new PieChartLens(element));
            this._lens.push(new WordCloudLens(element));

            this._pane_pie
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2).value(() => { return 1; });

            this._pane_arc
                .innerRadius(this._pane_radius - 40)
                .outerRadius(this._pane_radius)
            ;
        }

        public render(): void {
            var container = this._element;
            container.on("click", () => {
                this.openPane();
            });

        }

        private openPane() {
            if (this._pane_svg_g) {
                () => {
                    this.closePane();
                }
            }
            var p = d3.mouse(this._element[0][0]);

            this._pane_svg_g = this._element
                .append("g")
                .attr("transform", "translate(" + p[0] + "," + p[1] + ")");

            this._pane_svg_g.selectAll("circle")
                .data(this._pane_pie(this._lens))
                .enter().append("circle")
                .attr("class", "paneCircle")
                .style("fill", (d, i) => { return this._pane_color(i); })
                .attr("r", 10)

                .transition().duration(750)
                .attr("transform", (d) => {
                    return "translate(" + this._pane_arc.centroid(d) + ")";
                })
                .each("end", () => {
                    this._pane_svg_g.selectAll(".paneCircle")
                        .on("mouseover", () => {
                            if (this._pane_timer) {
                                clearTimeout(this._pane_timer);
                                console.log("ffff");
                            }
                    })
                })
            ;

            this._pane_timer = setTimeout(() => { console.log("f"); this.closePane(); }, 2000);
        }

        private closePane() {
            var t = 400;
            var closeG = this._pane_svg_g;
            closeG.selectAll(".paneCircle")
                .transition().duration(t)
                .attr("transform", "translate(0)")
            ;

            setTimeout(() => { closeG.remove() }, t);
        }
    }
}