///<reference path = "../tsScripts/TweetsCurve/Cruve.ts" />
///<reference path = "../tsScripts/LensHistory/HistoryTree.ts" />
///<reference path = "../tsScripts/Pane/ClassicLensPane.ts" />

module ManyLens {
    export class ManyLens {

        private _curveView_id: string = "cruveView";
        private _curveView: D3.Selection;
        private _curve: ManyLens.TweetsCurve.Curve;

        private _mapView_id: string = "mapView";
        private _mapView: D3.Selection;
        private _mapSvg_id: string = "mapSvg";
        private _mapSvg: D3.Selection;
        private _lensPane: ManyLens.Pane.ClassicLensPane;

        private _historyView_id: string = "historyView";
        private _historyView: D3.Selection;
        private _historySvg_id: string = "historySvg";
        private _historySvg: D3.Selection;
        private _historyTrees: ManyLens.LensHistory.HistoryTrees;

        //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
        private _lens: Map<string, Lens.BaseD3Lens> = new Map<string, Lens.BaseD3Lens>();
        private _lens_count: number = 0;

        public get LensCount(): number {
            return this._lens_count;
        }

        constructor() {
            this._curveView = d3.select("#"+this._curveView_id);
            this._curve = new TweetsCurve.Curve(this._curveView);
            this._curve.Render([10, 10]);

            this._mapView = d3.select("#"+this._mapView_id);
            this._mapSvg = d3.select("#"+this._mapSvg_id);
            this._lensPane = new Pane.ClassicLensPane(this._mapSvg,this);

            this._historySvg = d3.select("#"+this._historySvg_id);
            this._historyTrees = new LensHistory.HistoryTrees(this._historySvg);

            //Add a new tree here, actually the tree should not be add here
            this._historyTrees.addTree();


            this._lensPane.Render();

        }

        public GetLens(id: string): Lens.BaseD3Lens {
            return this._lens.get(id);
        }

        public AddLens(lens: Lens.BaseD3Lens): void {
            this._lens.set("lens_" + this._lens_count, lens);
            this._lens_count++;
            console.log("add Node");
            this._historyTrees.addNode({
                color: lens.LensTypeColor,
                lensType: lens.Type,
                tree_id: 0
            });

        }

        //TODO need to implementation
        public RemoveLens(lens: Lens.BaseD3Lens): Lens.BaseD3Lens {
            var lens: Lens.BaseD3Lens;

            return lens;
        }

        public DetachCompositeLens(element: D3.Selection,
            hostLens:Lens.BaseCompositeLens,
            componentLens: Lens.BaseSingleLens): void {
            var lensC: Lens.BaseD3Lens = LensAssemblyFactory.DetachLens(element, hostLens, componentLens, this);
            if (lensC.IsCompositeLens) {
                lensC.Render("black");
                lensC.DisplayLens();
            } else {
                this._lens.delete(hostLens.ID);
                lensC.ShowLens();
            }
            
        }
    }
} 