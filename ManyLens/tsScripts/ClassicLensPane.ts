///<reference path = "../tsScripts/D3ChartObject.ts" />

module ManyLens {

    interface PaneG {
        svg_g: D3.Selection;
        x: number;
        y: number;
        rect_width: number;
        rect_height: number;
    }

    export class ClassicLensPane extends D3ChartObject {

        private _lens: Array<BaseD3Lens> = new Array<BaseD3Lens>();
        private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
        private _pang_g: PaneG;
        private _history_trees: HistoryTrees;

        private _drag: D3.Behavior.Drag = d3.behavior.drag();

        constructor(element: D3.Selection) {
            super(element);
            this._drag.origin(function (d) {
                    return d;
                })
                .on("drag", () => {
                    this.dragFunc();
                });

        }

        public render(): void {


            this.openPane();
        }

        public bindHistoryTrees(historyTrees: HistoryTrees) {
            this._history_trees = historyTrees;

            //the new tree should not be added here, need to re-write
            this._history_trees.addTree();
        }

        private openPane() {
            var container = this._element;
            var pane_g_x = 10,
                pane_g_y = 10;



            
            this._pang_g = {
                svg_g: container.append("g"),
                x: 10,
                y: 10,
                rect_height: 100,
                rect_width: 50
            };

            var pane_g = this._pang_g.svg_g.data([this._pang_g])
                .attr("transform", "translate(" + [pane_g_x, pane_g_y] + ")")
                .call(this._drag);

            pane_g.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", this._pang_g.rect_width)
                .attr("height", this._pang_g.rect_height)
                .attr("fill", "#fff7bc")
                .attr("stroke", "pink")
                .attr("stroke-width", 2)
            ;

        }


        
        private closePane(msg: string) {

        }

        private dragFunc() {
            this._pang_g.svg_g
                .attr("transform", "translate(" + [this._pang_g.x = d3.event.x,this._pang_g.y = d3.event.y] + ")");
        }
    }
}