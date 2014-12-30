///<reference path = "../tsScripts/D3ChartObject.ts" />

module ManyLens {

    interface PaneG {
        svg_g: D3.Selection;
        timer: number;
        isOpened: boolean;
    }

    export class LensPane extends D3ChartObject {

        private _lens: Array<BaseD3Lens> = new Array<BaseD3Lens>();
        private _pane_radius: number = 100;
        private _pane_arc: D3.Svg.Arc = d3.svg.arc();
        private _pane_pie: D3.Layout.PieLayout = d3.layout.pie();
        private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
        private _current_pane_g: PaneG = null;

        private _history_trees: HistoryTrees;

        constructor(element: D3.Selection) {
            super(element);

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

        public bindHistoryTrees(historyTrees: HistoryTrees) {
            this._history_trees = historyTrees;

            //the new tree should not be added here, need to re-write
            this._history_trees.addTree();
        }

        private openPane() {
            if (this._current_pane_g && this._current_pane_g.isOpened) {
                (() => {
                    this.closePane("click close");
                })();
            }
            var p = d3.mouse(this._element[0][0]);

            var timer = setTimeout(() => { this.closePane("time out close"); }, 2000);
            var svg = this._element
                .append("g")
                .attr("transform", "translate(" + p[0] + "," + p[1] + ")");

            svg.selectAll("circle")
                .data(this._pane_pie([1,1,1,1,1]))
                .enter().append("circle")
                .attr("class", "paneCircle")
                .attr("id", (d, i) => { return "lens" + i; })
                .style("fill", (d, i) => { return this._pane_color(i); })
                .attr("r", 10)
                .on("mouseover", () => {
                    clearTimeout(this._current_pane_g.timer);
                })
                .on("mouseout", () => {
                    this._current_pane_g.timer = setTimeout(() => {
                        this.closePane("time out close");
                    }, 1000);
                })
                .on("click", (d, i) => {
                    var len:BaseD3Lens;
                    switch (i) {
                        case 0: {
                            len = new BarChartLens(this._element);
                            break;
                        }
                        case 1: {
                            len = new LocationLens(this._element);
                            break;
                        }
                        case 2: {
                            len = new NetworkTreeLens(this._element);
                            break;
                        }
                        case 3: {
                            len = new PieChartLens(this._element);
                            break;
                        }
                        case 4: {
                            len = new WordCloudLens(this._element);
                            break;
                        }
                    }
                    this._lens.push(len);
                    len.render(this._pane_color(i));
                    this._history_trees.addNode({ color: this._pane_color(i), lensType: len.Type, tree_id: 0 });
                    d3.event.stopPropagation();
                    this.closePane("select a lens");
                })
                .transition().duration(750)
                .attr("transform", (d) => {
                    return "translate(" + this._pane_arc.centroid(d) + ")";
                })
            ;
            this._current_pane_g = { svg_g: svg, timer: timer, isOpened: true};
        }

        private closePane(msg: string) {
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