///<reference path = "../Lens/LensList.ts" />

module ManyLens {
    export module Pane {
        interface PaneG {
            svg_g: D3.Selection;
            timer: number;
            isOpened: boolean;
        }

        export class BlossomLensPane extends D3ChartObject {

            //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
            private _pane_radius: number = 100;
            private _pane_arc: D3.Svg.Arc = d3.svg.arc();
            private _pane_pie: D3.Layout.PieLayout = d3.layout.pie();
            private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
            private _current_pane_g: PaneG = null;

            private _lens_count: number = 2;
            private _manyLens: ManyLens.ManyLens;

            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element);

                this._manyLens = manyLens;
                this._pane_pie
                    .startAngle(-Math.PI / 2)
                    .endAngle(Math.PI / 2).value(() => { return 1; });

                this._pane_arc
                    .innerRadius(this._pane_radius - 40)
                    .outerRadius(this._pane_radius)
                ;
            }

            public Render(): void {
                var container = this._element;
                container.on("click", () => {
                    this.OpenPane();
                });

            }


            private OpenPane() {
                if (this._current_pane_g && this._current_pane_g.isOpened) {
                    (() => {
                        this.ClosePane("click close");
                    })();
                }
                var p = d3.mouse(this._element[0][0]);

                var timer = setTimeout(() => { this.ClosePane("time out close"); }, 2000);
                var svg = this._element
                    .append("g")
                    .attr("transform", "translate(" + p[0] + "," + p[1] + ")");

                svg.selectAll("circle")
                    .data(this._pane_pie([1, 1, 1, 1, 1]))
                    .enter().append("circle")
                    .attr("class", "pane-Lens-Circle")
                    .attr("id", (d, i) => { return "lens" + i; })
                    .style("fill", (d, i) => { return this._pane_color(i); })
                    .attr("r", 10)
                    .on("mouseover", () => {
                        clearTimeout(this._current_pane_g.timer);
                    })
                    .on("mouseout", () => {
                        this._current_pane_g.timer = setTimeout(() => {
                            this.ClosePane("time out close");
                        }, 1000);
                    })
                    .on("click", (d, i) => {
                        var len: Lens.BaseD3Lens;
                        switch (i) {
                            case 0: {
                                len = new Lens.BarChartLens(this._element,this._manyLens);
                                break;
                            }
                            case 1: {
                                len = new Lens.MapLens(this._element, this._manyLens);
                                break;
                            }
                            case 2: {
                                len = new Lens.NetworkLens(this._element, this._manyLens);
                                break;
                            }
                            case 3: {
                                len = new Lens.PieChartLens(this._element, this._manyLens);
                                break;
                            }
                            case 4: {
                                len = new Lens.WordCloudLens(this._element, this._manyLens);
                                break;
                            }
                        }
                        //this._lens.push(len);
                        len.Render(this._pane_color(i));
                        //this._history_trees.addNode({ color: this._pane_color(i), lensType: len.Type, tree_id: 0 });
                        d3.event.stopPropagation();
                        this.ClosePane("select a lens");
                    })
                    .transition().duration(750)
                    .attr("transform", (d) => {
                        return "translate(" + this._pane_arc.centroid(d) + ")";
                    })
                ;
                this._current_pane_g = { svg_g: svg, timer: timer, isOpened: true };
            }

            private ClosePane(msg: string) {
                console.log(msg);
                var t = 400;
                var closeG = this._current_pane_g;
                clearTimeout(closeG.timer);
                closeG.isOpened = false;
                closeG.svg_g
                    .selectAll(".paneCircle")
                    .transition().duration(t)
                    .attr("transform", "translate(0)")
                    .remove()
                ;
                setTimeout(() => { closeG.svg_g.remove(); }, t);
            }
        }
    }
}