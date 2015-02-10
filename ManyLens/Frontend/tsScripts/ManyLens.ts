///<reference path = "../tsScripts/Hub/Hub.ts" />
///<reference path="../tsScripts/Navigation/SideBarNavigation.ts" />
///<reference path = "../tsScripts/TweetsCurve/Cruve.ts" />
///<reference path = "../tsScripts/LensHistory/HistoryTree.ts" />
///<reference path = "../tsScripts/Pane/ClassicLensPane.ts" />

module ManyLens {
    export class ManyLens {
        private _manyLens_hub: Hub.ManyLensHub;

        private _nav_sideBarView_id: string = "sideBar";
        private _nav_sideBarView: D3.Selection;
        private _nav_sidebar: Navigation.SideBarNavigation;

        private _curveView_id: string = "curveView";
        private _curveView: D3.Selection;
        private _curve: TweetsCurve.Curve;

        private _mapSvg_id: string = "mapSvg";
        private _mapSvg: D3.Selection;
        private _mapArea: MapArea.SOMMap;


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
            /*--------------------------Initial all the hub------------------------------*/
            this._manyLens_hub = new Hub.ManyLensHub();


            /*------------------------Initial other Component--------------------------------*/
            this._nav_sideBarView = d3.select("#" + this._nav_sideBarView_id);
            this._nav_sidebar = new Navigation.SideBarNavigation(this._nav_sideBarView, "Attribute",this);
            this._nav_sidebar.BuildList(null);

            this._curveView = d3.select("#" + this._curveView_id);
            this._curve = new TweetsCurve.Curve(this._curveView, this);
            this._curve.Render([10, 10]);

            this._mapSvg = d3.select("#" + this._mapSvg_id);
            this._mapArea = new MapArea.SOMMap(this._mapSvg, this);
            this._mapArea.Render();

            this._historySvg = d3.select("#"+this._historySvg_id);
            this._historyTrees = new LensHistory.HistoryTrees(this._historySvg,this);
            //Add a new tree here, actually the tree should not be add here
            this._historyTrees.addTree();

            /*-------------------------Start the hub-------------------------------------------*/
            Hub.SignalRHub.HubConnection.start().done(() => {
                console.log("start connection");
                this._manyLens_hub.server.loadData().done(() => {
                    console.log("Load data success");
                    this._nav_sidebar.FinishLoadData();
                }).fail(() => {
                        console.log("load data fail");
                    });
            });

        }


        /* -------------------- Lens related Function -----------------------*/
        public GetLens(id: string): Lens.BaseD3Lens {
            return this._lens.get(id);
        }

        public AddLens(lens: Lens.BaseD3Lens): void {
            this._lens.set("lens_" + this._lens_count, lens);
            this._lens_count++;

            this._historyTrees.addNode({
                color: lens.LensTypeColor,
                lensType: lens.Type,
                tree_id: 0
            });

        }

        //TODO need to implementation
        public RemoveLens(lens: Lens.BaseD3Lens): Lens.BaseD3Lens {
            var lens: Lens.BaseD3Lens;
            this._lens.delete(lens.ID);
            return lens;
        }

        public DetachCompositeLens(element: D3.Selection,
            hostLens:Lens.BaseCompositeLens,
            componentLens: Lens.BaseSingleLens): void {
            var lensC: Lens.BaseD3Lens = LensAssemblyFactory.DetachLens(element, hostLens, componentLens, this);
            if (lensC.IsCompositeLens) {
                if ((<Lens.BaseCompositeLens>lensC).NeedtoReshape)
                    this._lens.set(hostLens.ID, lensC);
                lensC.Render("black");
                lensC.DisplayLens();
            } else {
                this.RemoveLens(hostLens);
                lensC.DisplayLens();
            }
            
        }

        /* -------------------- Curve related Function -----------------------*/
        public ManyLensHubRegisterClientFunction(obj:any,funcName: string, func: (...any) => any) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            this._manyLens_hub.client[funcName] = function () {
                func.apply(obj, arguments);
            }
        }

        public ManyLensHubServerPullPoint(start: string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.server.pullPoint(start);
        }

        public ManyLensHubServerPullInteral(id: string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.server.pullInteral(id);
        }

    }
} 