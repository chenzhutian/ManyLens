///<reference path = "../tsScripts/Hub/Hub.ts" />
///<reference path="../tsScripts/Navigation/SideBarNavigation.ts" />
///<reference path = "../tsScripts/TweetsCurve/Cruve.ts" />
///<reference path = "../tsScripts/LensHistory/HistoryTree.ts" />
///<reference path = "../tsScripts/Pane/ClassicLensPane.ts" />
///<reference path = "../tsScripts/MapArea/SOMMAP.ts" />
module ManyLens {

    export class ManyLens {
        public static TestMode: boolean = false;

        private _manyLens_hub: Hub.ManyLensHub;

        private _nav_sideBarView_id: string = "sidebar-nav";
        private _nav_sideBarView: D3.Selection;
        private _nav_sideBar: Navigation.SideBarNavigation;
        private _nav_sideBar_timeSpan:number = 2;//0:Day, 1:Hour, 2:Minute,3:Second

        private _curveView_id: string = "curveView";
        private _curveView: D3.Selection;
        private _curve: TweetsCurve.Curve;

        private _mapSvg_id: string = "mapSvg";
        private _mapSvg: D3.Selection;
        private _SOM_mapArea: MapArea.SOMMap;
        private _GEO_mapArea: MapArea.WorldMap;
        private _geo_map_mode:boolean = false;
        private _current_map;

        private _historyView_id: string = "historyView";
        private _historyView: D3.Selection;
        private _historySvg_id: string = "historySvg";
        private _historySvg: D3.Selection;
        private _historyTrees: ManyLens.LensHistory.HistoryTrees;

        //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
        private _lens: Map<string, Lens.BaseD3Lens> = new Map<string, Lens.BaseD3Lens>();
        private _lens_id_generator: number = 0;
        //private _lens_count: number = 0;
        
        private _current_classifier_map_id:string = null;

        public get LensIDGenerator(): number {
            return this._lens_id_generator++;
        }
        public get LensCount(): number {
            return this._lens.size;
        }
        public get CurrentClassifierMapID():string{
            return this._current_classifier_map_id;
        }
        public set CurrentClassifierMapID(value:string){
            this._current_classifier_map_id = value;
        }
        public set TimeSpan(index:number){
            this._nav_sideBar_timeSpan = index;    
        }
        public get TimeSpan(){
            return this._nav_sideBar_timeSpan;    
        }

        constructor() {
            /*--------------------------Initial all the hub------------------------------*/
            this._manyLens_hub = new Hub.ManyLensHub();

            /*------------------------Initial other Component--------------------------------*/
            this._mapSvg = d3.select("#" + this._mapSvg_id);
            this._SOM_mapArea = new MapArea.SOMMap(this._mapSvg, this);
            this._SOM_mapArea.Render();

            this._GEO_mapArea = new MapArea.WorldMap(this._mapSvg,this);
            //this._GEO_mapArea.Render();

            //var listViewContainer = d3.select("#tweetsView")
            //                                .style({
            //                                        left:(<HTMLElement>this._mapSvg.node()).offsetLeft.toString()+"px",
            //                                        top:(<HTMLElement>this._mapSvg.node()).offsetTop.toString()+"px",
            //                                        height:(<HTMLElement>this._mapSvg.node()).offsetHeight.toString()+"px",
            //                                        width:(<HTMLElement>this._mapSvg.node()).offsetWidth.toString()+"px"
            //                                    });


            this._curveView = d3.select("#" + this._curveView_id);
            this._curve = new TweetsCurve.Curve(this._curveView, this);
            this._curve.Render();

            this._nav_sideBarView = d3.select("#" + this._nav_sideBarView_id);
            this._nav_sideBar = new Navigation.SideBarNavigation(this._nav_sideBarView, "Attribute", this._mapSvg, this);
            this._nav_sideBar.BuildList(null);

            //this._historySvg = d3.select("#" + this._historySvg_id);
            //this._historyTrees = new LensHistory.HistoryTrees(this._historySvg, this);
            //Add a new tree here, actually the tree should not be add here
            //this._historyTrees.addTree();

            this.ManyLensHubRegisterClientFunction(this, "interactiveOnLens", this.InteractiveOnLens);
            /*-------------------------Start the hub-------------------------------------------*/
            this._manyLens_hub.connection.start().done(() => {
                console.log("start connection");
                if (ManyLens.TestMode) {
                    this._nav_sideBar.FinishLoadData();
                } else {
                    this._manyLens_hub.proxy.invoke("loadData")
                        .done(() => {
                            console.log("Load data success");
                            this._nav_sideBar.FinishLoadData();
                        })
                        .fail(() => {
                            console.log("load data fail");
                        });
                }
            });
        }

        public AddBrushToMap(){
             this._SOM_mapArea.AddBrush();
        }

        public SwitchMap(){
            this._SOM_mapArea.Toggle();
            this._GEO_mapArea.Toggle();
            this._geo_map_mode = !this._geo_map_mode;

            if(this._geo_map_mode){
                d3.select("div.view-title.view-title-md-red p").text("Geo Map");
            }else{
                d3.select("div.view-title.view-title-md-red p").text("Topic Maps");
            }
            
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            this._manyLens_hub.proxy.invoke("switchMap", this._geo_map_mode);
        }


        /* -------------------- Lens related Function -----------------------*/
        public GetLens(id: string): Lens.BaseD3Lens {
            return this._lens.get(id);
        }
        public AddLens(lens: Lens.BaseD3Lens): void {
            this._lens.set(lens.ID, lens);
        }
        public AddLensToHistoryTree(lens: Lens.BaseD3Lens): void {
            //this._historyTrees.addNode({
            //    color: lens.LensTypeColor,
            //    lensType: lens.Type,
            //    tree_id: 0
            //});
        }

        //TODO need to implementation
        public RemoveLens(lens: Lens.BaseD3Lens): Lens.BaseD3Lens {
            this._lens.delete(lens.ID);
            this.ManyLensHubServerRemoveLensData(lens.MapID, lens.ID);
            return lens;
        }
        public DetachCompositeLens(element: D3.Selection,
            hostLens: Lens.BaseCompositeLens,
            componentLens: Lens.BaseSingleLens): void {
            var lensC: Lens.BaseD3Lens = LensAssemblyFactory.DetachLens(element, hostLens, componentLens, this);
            if (lensC.IsCompositeLens) {
                if ((<Lens.BaseCompositeLens>lensC).NeedtoReshape)
                    this._lens.set(hostLens.ID, lensC);
                lensC.Render("black");
            } else {
                this.RemoveLens(hostLens);
                lensC.DisplayLens();
            }

        }

        /* -------------------- Hub related Function -----------------------*/
        public ManyLensHubRegisterClientFunction(registerObj: any, funcName: string, func: (...any) => any) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            this._manyLens_hub.proxy.on(funcName, function () {
                func.apply(registerObj, arguments);
            }); 
            //this._manyLens_hub.client[funcName] = function () {
            //    func.apply(registerObj, arguments);
            //}
        }

        public ManyLensHubServerReOrganizePeak(state: boolean): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("reOrganizePeak", state);

        }

        public ManyLensHubServerChangeTimeSpan(index:number):Hub.IPromise<void>{
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("changeTimeSpan",index);
        }

        public ManyLensHubServerPullPoint(start: string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("pullPoint", start);
            //return this._manyLens_hub.server.pullPoint(start);
        }

        public ManyLensHubServerTestPullPoint(): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("testPullPoint");
            //return this._manyLens_hub.server.testPullPoint();
        }

        public ManyLensHubServerPullInterval(id: string, classifierID:string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("pullInterval", id, classifierID);
            //return this._manyLens_hub.server.pullInterval(id);
        }

        public ManyLensHubServerTestPullInterval(id: string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("testPullInterval", id);
            //return this._manyLens_hub.server.testPullInterval(id);
        }

        public ManyLensHubServerRefineMap(mapId:string, mapIndex:number,fromUnitsId:number[],toUnitsID:number[]){
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("refineTheMap", mapId,mapIndex,fromUnitsId,toUnitsID);
        
        }


        public ManyLensHubServerGetLensData(visMapID:string,lensID:string, unitsID: number[],baseData:string,subData?:string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("getLensData", visMapID, lensID, unitsID, baseData,subData);
            //return this._manyLens_hub.server.getLensData(visMapID,lensID, unitsID, whichData);
        }

        public ManyLensHubServerRemoveLensData(visMapID: string, lensID: string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("removeLensData", visMapID, lensID);
            //return this._manyLens_hub.server.removeLensData(visMapID, lensID);
        }

        /*-------------Lens interactivation method-------------*/
        public InteractiveOnLens(lensID: string, ...args: Array<any>) {
            var lens: Lens.BaseD3Lens = this._lens.get(lensID);
            console.log(args);
            if (lens.Type == "cWordCloudPieLens") {
                (<Lens.cWordCloudPieLens>lens).HightLightWordsOfTweetsAtLengthOf(args[0]);
            } else if(lens.Type == "cMapPieLens"){
                (<Lens.cMapPieLens>lens).HightLightCountry(args[0]);
            }
        }

        public ManyLensHubServercWordCloudPieLens(lensID: string, pieKey: string, baseData: string, subData:string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("cWordCloudPieLens", lensID, pieKey, baseData,subData);
        }
        public ManyLensHubServercMapPieLens(lensID: string, pieKey: string, baseData: string, subData: string): Hub.IPromise<void> {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("cMapPieLens", lensID, pieKey, baseData, subData);
        }


    }
} 