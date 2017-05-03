///<reference path = "../tsScripts/ManyLens.ts" />
"use strict";
var manyLens;
document.addEventListener('DOMContentLoaded', function () {
    manyLens = new ManyLens.ManyLens();
});
define("Hub", ["require", "exports", "signalr"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // export interface IPromise<T> {
    //     always(...alwaysCallbacks: any[]): IPromise<T>;
    //     done(...doneCallbacks: any[]): IPromise<T>;
    //     fail(...failCallbacks: any[]): IPromise<T>;
    //     progress(...progressCallbacks: any[]): IPromise<T>;
    //     then<U>(onFulfill: (...values: any[]) => U, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): IPromise<U>;
    // }
    // export interface IDeferred<T> extends IPromise<T> {
    //     always(...alwaysCallbacks: any[]): IDeferred<T>;
    //     done(...doneCallbacks: any[]): IDeferred<T>;
    //     fail(...failCallbacks: any[]): IDeferred<T>;
    //     progress(...progressCallbacks: any[]): IDeferred<T>;
    //     notify(...args: any[]): IDeferred<T>;
    //     notifyWith(context: any, ...args: any[]): IDeferred<T>;
    //     reject(...args: any[]): IDeferred<T>;
    //     rejectWith(context: any, ...args: any[]): IDeferred<T>;
    //     resolve(val: T): IDeferred<T>;
    //     resolve(...args: any[]): IDeferred<T>;
    //     resolveWith(context: any, ...args: any[]): IDeferred<T>;
    //     state(): string;
    //     promise(target?: any): IPromise<T>;
    // }
    // interface HubMethod {
    //     (callback: (data: string) => void);
    // }
    // interface SignalREvents {
    //     onStart: string;
    //     onStarting: string;
    //     onReceived: string;
    //     onError: string;
    //     onConnectionSlow: string;
    //     onReconnect: string;
    //     onStateChanged: string;
    //     onDisconnect: string;
    // }
    // interface SignalRStateChange {
    //     oldState: number;
    //     newState: number;
    // }
    // interface SignalR {
    //     events: SignalREvents;
    //     connectionState: any;
    //     transports: any;
    //     hub: HubConnection;
    //     id: string;
    //     logging: boolean;
    //     messageId: string;
    //     url: string;
    //     qs: any;
    //     state: number;
    //     (url: string, queryString?: any, logging?: boolean): SignalR;
    //     hubConnection(url?: string): SignalR;
    //     log(msg: string, logging: boolean): void;
    //     isCrossDomain(url: string): boolean;
    //     changeState(connection: SignalR, expectedState: number, newState: number): boolean;
    //     isDisconnecting(connection: SignalR): boolean;
    //     // createHubProxy(hubName: string): SignalR;
    //     start(): IPromise<any>;
    //     start(callback: () => void): IPromise<any>;
    //     start(settings: ConnectionSettings): IPromise<any>;
    //     start(settings: ConnectionSettings, callback: () => void): IPromise<any>;
    //     send(data: string): void;
    //     stop(async?: boolean, notifyServer?: boolean): void;
    //     starting(handler: () => void): SignalR;
    //     received(handler: (data: any) => void): SignalR;
    //     error(handler: (error: string) => void): SignalR;
    //     stateChanged(handler: (change: SignalRStateChange) => void): SignalR;
    //     disconnected(handler: () => void): SignalR;
    //     connectionSlow(handler: () => void): SignalR;
    //     sending(handler: () => void): SignalR;
    //     reconnecting(handler: () => void): SignalR;
    //     reconnected(handler: () => void): SignalR;
    // }
    // interface HubProxy {
    //     (connection: HubConnection, hubName: string): HubProxy;
    //     state: any;
    //     connection: HubConnection;
    //     hubName: string;
    //     init(connection: HubConnection, hubName: string): void;
    //     hasSubscriptions(): boolean;
    //     on(eventName: string, callback: (...msg) => void): HubProxy;
    //     off(eventName: string, callback: (msg) => void): HubProxy;
    //     invoke(methodName: string, ...args: any[]): any; // IDeferred<any>;
    // }
    // interface HubConnectionSettings {
    //     queryString?: string;
    //     logging?: boolean;
    //     useDefaultPath?: boolean;
    // }
    // interface HubConnection extends SignalR {
    //     //(url?: string, queryString?: any, logging?: boolean): HubConnection;
    //     proxies: any;
    //     received(callback: (data: { Id; Method; Hub; State; Args; }) => void): HubConnection;
    //     createHubProxy(hubName: string): HubProxy;
    // }
    // interface SignalRfn {
    //     init(url, qs, logging);
    // }
    // interface ConnectionSettings {
    //     transport?: any;
    //     callback?: any;
    //     waitForPageLoad?: boolean;
    //     jsonp?: boolean;
    // }
    // declare var $: {
    //     (): any;
    //     (any): any;
    //     signalR: SignalR;
    //     connection: SignalR;
    //     hubConnection(url?: string, queryString?: any, logging?: boolean): HubConnection;
    // };
    /*------------------Extent by myself -----------*/
    // export class SignalRHub {
    //     static HubConnection: HubConnection = $.connection.hub;
    // }
    // interface SignalR {
    //     manyLensHub: IManyLensHub;
    // }
    // /*-------------ManyLens Hub -----------*/
    // interface IManyLensHub {
    // }
    //interface IManyLensHubServer extends HubProxy{
    //    //loadData(): IPromise<void>;
    //    //pullPoint(start: string): IPromise<void>;
    //    //testPullPoint(): IPromise<void>;
    //    //pullInterval(intervalID: string): IPromise<void>;
    //    //testPullInterval(intervalID: string): IPromise<void>;
    //    //getLensData(visMapID: string,lensID:string, unitsID: number[], whichData: string):IPromise<void>;
    //    //removeLensData(visMapID: string, lensID: string): IPromise<void>;
    //    //cPieWordCloudLens(lensID: string, pieKey: string, whichData: string): IPromise<void>;
    //    //reOrganize(visMapID: string, selectedUnits: Array<any>): IPromise<void>;
    //    //moveTweets(visMapID: string, fromUnitsID: Array<any>, toUnitsID: Array<any>): IPromise<void>;
    //    //doLongRunningThing(): IPromise<void>;
    //}
    //interface IManyLensHubClient extends HubProxy {
    //    //addPoint(obj: any): void;
    //    //showVIS(obj:any): void;
    //}
    class ManyLensHub {
        constructor() {
            this.connection = $.hubConnection();
            this.proxy = this.connection.createHubProxy("manyLensHub");
        }
    }
    exports.ManyLensHub = ManyLensHub;
});
define("ManyLens", ["require", "exports"], function (require, exports) {
    ///<reference path="../tsScripts/Navigation/SideBarNavigation.ts" />
    ///<reference path = "../tsScripts/TweetsCurve/Cruve.ts" />
    ///<reference path = "../tsScripts/LensHistory/HistoryTree.ts" />
    ///<reference path = "../tsScripts/Pane/ClassicLensPane.ts" />
    ///<reference path = "../tsScripts/MapArea/SOMMAP.ts" />
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class ManyLens {
        constructor() {
            this._nav_sideBarView_id = "sidebar-nav";
            this._nav_sideBar_timeSpan = 3; //0:Day, 1:Hour, 2:Minute,3:Second
            this._curveView_id = "curveView";
            this._mapSvg_id = "mapSvg";
            this._geo_map_mode = false;
            // private _historyView_id: string = "historyView";
            // private _historyView: D3.Selection;
            // private _historySvg_id: string = "historySvg";
            // private _historySvg: D3.Selection;
            // private _historyTrees: ManyLens.LensHistory.HistoryTrees;
            // private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
            this._lens = new Map();
            this._lens_id_generator = 0;
            // private _lens_count: number = 0;
            this._current_classifier_map_id = null;
            /*--------------------------Initial all the hub------------------------------*/
            this._manyLens_hub = new Hub.ManyLensHub();
            /*------------------------Initial other Component--------------------------------*/
            this._mapSvg = d3.select("#" + this._mapSvg_id);
            this._SOM_mapArea = new MapArea.SOMMap(this._mapSvg, this);
            this._SOM_mapArea.Render();
            this._GEO_mapArea = new MapArea.WorldMap(this._mapSvg, this);
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
                }
                else {
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
        get LensIDGenerator() {
            return this._lens_id_generator++;
        }
        get LensCount() {
            return this._lens.size;
        }
        get CurrentClassifierMapID() {
            return this._current_classifier_map_id;
        }
        set CurrentClassifierMapID(value) {
            this._current_classifier_map_id = value;
        }
        set TimeSpan(index) {
            this._nav_sideBar_timeSpan = index;
        }
        get TimeSpan() {
            return this._nav_sideBar_timeSpan;
        }
        AddBrushToMap() {
            this._SOM_mapArea.AddBrush();
        }
        SwitchMap() {
            this._SOM_mapArea.Toggle();
            this._GEO_mapArea.Toggle();
            this._geo_map_mode = !this._geo_map_mode;
            if (this._geo_map_mode) {
                d3.select("div.view-title.view-title-md-red p").text("Geo Map");
            }
            else {
                d3.select("div.view-title.view-title-md-red p").text("Topic Maps");
            }
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            this._manyLens_hub.proxy.invoke("switchMap", this._geo_map_mode);
        }
        /* -------------------- Lens related Function -----------------------*/
        GetLens(id) {
            return this._lens.get(id);
        }
        AddLens(lens) {
            this._lens.set(lens.ID, lens);
        }
        AddLensToHistoryTree(lens) {
            //this._historyTrees.addNode({
            //    color: lens.LensTypeColor,
            //    lensType: lens.Type,
            //    tree_id: 0
            //});
        }
        //TODO need to implementation
        RemoveLens(lens) {
            this._lens.delete(lens.ID);
            this.ManyLensHubServerRemoveLensData(lens.MapID, lens.ID);
            return lens;
        }
        DetachCompositeLens(element, hostLens, componentLens) {
            var lensC = LensAssemblyFactory.DetachLens(element, hostLens, componentLens, this);
            if (lensC.IsCompositeLens) {
                if (lensC.NeedtoReshape)
                    this._lens.set(hostLens.ID, lensC);
                lensC.Render("black");
            }
            else {
                this.RemoveLens(hostLens);
                lensC.DisplayLens();
            }
        }
        /* -------------------- Hub related Function -----------------------*/
        ManyLensHubRegisterClientFunction(registerObj, funcName, func) {
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
        ManyLensHubServerReOrganizePeak(state) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("reOrganizePeak", state);
        }
        ManyLensHubServerChangeTimeSpan(index) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("changeTimeSpan", index);
        }
        ManyLensHubServerPullPoint(start = null) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("pullPoint", start);
            //return this._manyLens_hub.server.pullPoint(start);
        }
        ManyLensHubServerTestPullPoint() {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("testPullPoint");
            //return this._manyLens_hub.server.testPullPoint();
        }
        ManyLensHubServerPullInterval(id, classifierID) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("pullInterval", id, classifierID);
            //return this._manyLens_hub.server.pullInterval(id);
        }
        ManyLensHubServerTestPullInterval(id) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("testPullInterval", id);
            //return this._manyLens_hub.server.testPullInterval(id);
        }
        ManyLensHubServerRefineMap(mapId, mapIndex, fromUnitsId, toUnitsID) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("refineTheMap", mapId, mapIndex, fromUnitsId, toUnitsID);
        }
        ManyLensHubServerGetLensData(visMapID, lensID, unitsID, baseData, subData) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("getLensData", visMapID, lensID, unitsID, baseData, subData);
            //return this._manyLens_hub.server.getLensData(visMapID,lensID, unitsID, whichData);
        }
        ManyLensHubServerRemoveLensData(visMapID, lensID) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("removeLensData", visMapID, lensID);
            //return this._manyLens_hub.server.removeLensData(visMapID, lensID);
        }
        /*-------------Lens interactivation method-------------*/
        InteractiveOnLens(lensID, ...args) {
            var lens = this._lens.get(lensID);
            console.log(args);
            if (lens.Type == "cWordCloudPieLens") {
                lens.HightLightWordsOfTweetsAtLengthOf(args[0]);
            }
            else if (lens.Type == "cMapPieLens") {
                lens.HightLightCountry(args[0]);
            }
        }
        ManyLensHubServercWordCloudPieLens(lensID, pieKey, baseData, subData) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("cWordCloudPieLens", lensID, pieKey, baseData, subData);
        }
        ManyLensHubServercMapPieLens(lensID, pieKey, baseData, subData) {
            if (!this._manyLens_hub) {
                console.log("No hub");
                this._manyLens_hub = new Hub.ManyLensHub();
            }
            return this._manyLens_hub.proxy.invoke("cMapPieLens", lensID, pieKey, baseData, subData);
        }
    }
    ManyLens.TestMode = false;
    exports.ManyLens = ManyLens;
});
define("D3ChartObject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class D3ChartObject {
        constructor(element, manyLens) {
            this._element = element;
            this._manyLens = manyLens;
        }
        Render(any) {
        }
    }
    exports.D3ChartObject = D3ChartObject;
});
define("Lens/BaseD3Lens", ["require", "exports", "d3", "D3ChartObject"], function (require, exports, d3, D3ChartObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ExtractDataFunc {
        get TargetAttribute() {
            return this.targetAttribute;
        }
        constructor(att) {
            this.targetAttribute = att;
        }
        Extract(d, newData) {
            if (newData)
                d[this.targetAttribute] = newData;
            return d[this.targetAttribute];
        }
    }
    exports.ExtractDataFunc = ExtractDataFunc;
    class BaseD3Lens extends D3ChartObject_1.D3ChartObject {
        constructor(element, type, manyLens) {
            super(element, manyLens);
            this._combine_failure_rebound_duration = 800;
            this._units_id = [];
            this._sc_lc_svg = null;
            this._lens_circle_radius = 100;
            this._lens_circle_scale = 1;
            this._lens_circle_zoom = d3.behavior.zoom();
            this._lens_circle_drag = d3.behavior.drag();
            this._is_component_lens = false;
            this._is_composite_lens = null;
            this._type = type;
            this._id = "lens_" + this._manyLens.LensIDGenerator;
            this._lens_circle_zoom
                .scaleExtent([1, 2])
                .on("zoom", () => {
                this.LensCircleZoomFunc();
                d3.event.sourceEvent.stopPropagation();
            });
            this._lens_circle_drag
                .origin(function (d) { return d; })
                .on("dragstart", () => {
                this.LensCircleDragstartFunc();
                d3.event.sourceEvent.stopPropagation();
                //console.log("lc_dragstart " + this._type);
            })
                .on("drag", () => {
                this.LensCircleDragFunc();
                d3.event.sourceEvent.stopPropagation();
                //console.log("lc_drag " + this._type);
            })
                .on("dragend", () => {
                this.LensCircleDragendFunc();
                d3.event.sourceEvent.stopPropagation();
                //console.log("lc_dragend " + this._type);
            });
        }
        get ID() {
            return this._id;
        }
        get MapID() {
            return this._map_id;
        }
        get Type() {
            return this._type;
        }
        get LensTypeColor() {
            return this._lens_type_color;
        }
        get LensCX() {
            return this._lens_circle_cx;
        }
        set LensCX(cx) {
            this._lens_circle_cx = cx;
        }
        get LensCY() {
            return this._lens_circle_cy;
        }
        set LensCY(cy) {
            this._lens_circle_cy = cy;
        }
        get LensScale() {
            return this._lens_circle_scale;
        }
        set LensScale(scale) {
            this._lens_circle_scale = scale;
        }
        get LensRadius() {
            return this._lens_circle_radius;
        }
        set LensRadius(radius) {
            this._lens_circle_radius = radius;
        }
        get LensSVGGroup() {
            return this._lens_circle_svg;
        }
        set LensSVGGroup(lensG) {
            this._lens_circle_svg = lensG;
        }
        get IsCompositeLens() {
            return this._is_composite_lens;
        }
        get IsComponentLens() {
            return this._is_component_lens;
        }
        get HostLens() {
            return this._host_lens;
        }
        set HostLens(hostLens) {
            if (hostLens) {
                this._host_lens = hostLens;
                this._is_component_lens = true;
            }
            else {
                this._host_lens = null;
                this._is_component_lens = false;
            }
        }
        get RawData() {
            return this._data;
        }
        get UnitsID() {
            return this._units_id.sort();
        }
        Render(color) {
            this._lens_type_color = color;
            this._sc_lc_svg = this._element
                .append("g")
                .data([{ tx: 0, ty: 0, scale: 1, cx: 0, cy: 0 }])
                .attr("class", "lens")
                .attr("id", this.ID);
            //Add this lens to the app class
            this._manyLens.AddLens(this);
        }
        ExtractData() {
            throw new Error('This method is abstract');
        }
        AfterExtractData() {
            throw new Error('This method is abstract');
        }
        DisplayLens(any = null) {
            var duration = 300;
            this._lens_circle_svg = this._sc_lc_svg.append("g")
                .data([{ x: this._lens_circle_cx, y: this._lens_circle_cy }])
                .attr("class", "lens-circle-g " + this._type)
                .attr("transform", "translate(" + [this._lens_circle_cx, this._lens_circle_cy] + ")scale(" + this._lens_circle_scale + ")")
                .attr("opacity", "1e-6")
                .style("pointer-events", "none")
                .on("contextmenu", () => {
                //d3.event.preventDefault();
            })
                .on("mousedown", () => {
                //console.log("lc_mousedown " + this._type);
            })
                .on("mouseup", () => {
                //console.log("lc_mouseup " + this._type);
            })
                .on("click", () => {
                //console.log("lc_click " + this._type)
            })
                .call(this._lens_circle_zoom)
                .on("dblclick.zoom", null)
                .call(this._lens_circle_drag);
            this._lens_circle = this._lens_circle_svg.append("path")
                .attr("class", "lens-circle")
                .attr("id", "lens-circle-" + this.ID)
                .attr("d", d3.svg.arc().startAngle(0).endAngle(2 * Math.PI).innerRadius(0).outerRadius(this._lens_circle_radius))
                .style({
                "fill": "#fff",
                "stroke": "#ccc",
                "stroke-width": 1.5
            });
            this._manyLens.AddLensToHistoryTree(this);
            this._lens_circle_svg
                .transition().duration(duration)
                .attr("opacity", "1")
                .each("end", function () {
                d3.select(this).style("pointer-events", "");
            });
            ;
            return duration;
        }
        LensCircleDragstartFunc() {
            if (d3.event.sourceEvent.button != 0)
                return;
            var tempGs = d3.select("#mapView").selectAll("svg > g");
            var index = tempGs[0].indexOf(this._sc_lc_svg[0][0]);
            tempGs[0].splice(index, 1);
            tempGs[0].push(this._sc_lc_svg[0][0]);
            tempGs.order();
            this._lens_drag_start_cx = this._lens_circle_cx;
            this._lens_drag_start_cy = this._lens_circle_cy;
        }
        LensCircleDragFunc() {
            var transform = this._lens_circle_svg.attr("transform");
            this._lens_circle_svg.attr("transform", (d) => {
                this._lens_circle_cx = d.x = d3.event.x; //Math.max(this._lens_circle_radius, Math.min(parseFloat(this._element.style("width")) - this._lens_circle_radius, d3.event.x));
                this._lens_circle_cy = d.y = d3.event.y; //Math.max(this._lens_circle_radius, Math.min(parseFloat(this._element.style("height")) - this._lens_circle_radius, d3.event.y));
                transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                return transform;
            });
        }
        LensCircleDragendFunc() {
            var res = [];
            var eles = [];
            var x = d3.event.sourceEvent.x, y = d3.event.sourceEvent.y;
            var p = d3.mouse(this._element.node());
            if (p[0] < 0 || p[0] > parseFloat(this._element.style("width")) || p[1] < 0 || p[1] > parseFloat(this._element.style("height")))
                return;
            var ele = d3.select(document.elementFromPoint(x, y));
            while (ele && ele.attr("id") != "mapSvg") {
                if (ele.classed("lens-circle"))
                    res.push(ele[0][0]);
                eles.push(ele);
                ele.style("visibility", "hidden");
                ele = d3.select(document.elementFromPoint(x, y));
                if (eles.length > 10) {
                    throw new Error("what the fuck");
                }
            }
            for (var i = 0, len = eles.length; i < len; ++i) {
                eles[i].style("visibility", "");
            }
            if (res.length == 2) {
                var lensA_id = d3.select(res[0].parentNode.parentNode).attr("id");
                var lensB_id = d3.select(res[1].parentNode.parentNode).attr("id");
                var lensC = LensAssemblyFactory.CombineLens(this._element, this._manyLens, this._manyLens.GetLens(lensA_id), this._manyLens.GetLens(lensB_id));
                if (lensC) {
                    lensC.Render("black");
                    //lensC.DisplayLens();
                    return true;
                }
                else {
                    var transform = this._lens_circle_svg.attr("transform");
                    this._lens_circle_svg.transition()
                        .ease('back-out')
                        .duration(this._combine_failure_rebound_duration)
                        .attr("transform", (d) => {
                        this._lens_circle_cx = d.x = this._lens_drag_start_cx;
                        this._lens_circle_cy = d.y = this._lens_drag_start_cy;
                        transform = transform.replace(/(translate\()\-?\d+\.?\d*,\-?\d+\.?\d*(\))/, "$1" + d.x + "," + d.y + "$2");
                        return transform;
                    });
                }
            }
            return false;
        }
        LensCircleZoomFunc() {
            if (d3.event.sourceEvent.type != "wheel") {
                return;
            }
            if (d3.event.scale == this._lens_circle_scale) {
                return;
            }
            var scale = this._lens_circle_scale = d3.event.scale;
            this._lens_circle_svg
                .attr("transform", function () {
                var transform = d3.select(this).attr("transform");
                transform = transform.replace(/(scale\()\d+\.?\d*\,?\d*\.?\d*(\))/, "$1" + scale + "$2");
                return transform;
            });
        }
        //public HideLens() {
        //    this._lens_circle_G
        //        .attr("opacity", "1")
        //        .transition()
        //        .duration(500)  //this is hard code, should be optimize
        //        .attr("opacity", "1e-6")
        //        .style("visibility", "hidden");
        //}
        //public ShowLens() {
        //    this._lens_circle_G
        //        .attr("opacity", "1e-6")
        //        .attr("transform", () => {
        //            return "translate(" + [this._lc_cx, this._lc_cy] + ")scale(" + this._lc_scale + ")";
        //        })
        //        .transition()
        //        .duration(500)  //this is hard code, should be optimize
        //        .attr("opacity","1")
        //        .style("visibility", "visible");
        //}
        RemoveLens() {
            if (this._lens_circle_svg)
                this._lens_circle_svg
                    .attr("opacity", "1")
                    .style("pointer-events", "none")
                    .transition()
                    .duration(200) //this is hard code, should be optimize
                    .attr("opacity", "1e-6")
                    .remove();
        }
    }
    exports.BaseD3Lens = BaseD3Lens;
});
define("Lens/BaseSingleLens", ["require", "exports", "d3", "Lens/BaseD3Lens"], function (require, exports, d3, BaseD3Lens_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseSingleLens extends BaseD3Lens_1.BaseD3Lens {
        constructor(element, attributeName, type, manyLens) {
            super(element, type, manyLens);
            this._select_circle_radius = 0;
            this._select_circle_cx = -10;
            this._select_circle_cy = -10;
            this._select_circle_scale = 1;
            this._select_circle_zoom = d3.behavior.zoom();
            this._select_circle_drag = d3.behavior.drag();
            this._has_put_down = false;
            this._has_showed_lens = false;
            //protected _sc_drag_event_flag: boolean = false;
            this._sc_lc_default_dist = 100;
            this._extract_data_map_func = null;
            this._is_composite_lens = false;
            this._select_circle_radius = 10;
            this._attribute_name = attributeName;
            this._select_circle_zoom
                .scaleExtent([1, 4])
                .on("zoom", () => {
                this.SelectCircleZoomFunc();
                //console.log("sc_zoom " + this._type);
                d3.event.sourceEvent.stopPropagation();
            });
            this._select_circle_drag
                .origin(function (d) { return d; })
                .on("dragstart", () => {
                //this._sc_drag_event_flag = false;
                //console.log("sc_dragstart " + this._type);
                d3.event.sourceEvent.stopPropagation();
            })
                .on("drag", () => {
                //if (this._sc_drag_event_flag) {
                this.SelectCircleDragFunc();
                //} else {
                //    this._sc_drag_event_flag = true;
                //}
                //console.log("sc_drag " + this._type);
                d3.event.sourceEvent.stopPropagation();
            })
                .on("dragend", (d) => {
                this.SelectCircleDragendFunc(d);
                //console.log("sc_dragend " + this._type);
                d3.event.sourceEvent.stopPropagation();
            });
        }
        get AttributeName() {
            return this._attribute_name;
        }
        get LinkLine() {
            return this._sc_lc_svg.select("line");
        }
        get SelectCircleCX() {
            return this._select_circle_cx;
        }
        get SelectCircleCY() {
            return this._select_circle_cy;
        }
        get SelectCircleScale() {
            return this._select_circle_scale;
        }
        get SelectCircleRadius() {
            return this._select_circle_radius;
        }
        Render(color) {
            super.Render(color);
            const container = this._element;
            this._select_circle_svg = this._sc_lc_svg.append("g")
                .attr("class", "select-circle");
            var selectCircle = this._select_circle =
                this._select_circle_svg.append("circle")
                    .data([{ x: this._select_circle_cx, y: this._select_circle_cy }]);
            selectCircle
                .attr("r", this._select_circle_radius)
                .attr("fill", "#E9573F")
                .attr("fill-opacity", 0.7)
                .attr("stroke", "#ccc")
                .attr("stroke-width", 1)
                .attr({
                cx: -50,
                cy: -50
            })
                .on("mouseup", (d) => {
                if (!this._has_put_down) {
                    this._has_put_down = true;
                    d.x = this._select_circle_cx = parseFloat(selectCircle.attr("cx"));
                    d.y = this._select_circle_cy = parseFloat(selectCircle.attr("cy"));
                    container.on("mousemove", null);
                }
            })
                .on("contextmenu", () => {
                d3.event.preventDefault();
                d3.event.stopPropagation();
                this._sc_lc_svg.remove();
                this._manyLens.RemoveLens(this);
                var hostLens = this.DetachHostLens();
                if (hostLens) {
                    this._manyLens.DetachCompositeLens(this._element, hostLens, this);
                }
            })
                .call(this._select_circle_zoom)
                .on("dblclick.zoom", null)
                .on("mousedown.zoom", null)
                .call(this._select_circle_drag);
            this._sc_lc_svg.append("line")
                .attr("stoke-width", 2)
                .attr("stroke", "#E9573F");
            container.on("mousemove", moveSelectCircle); //因为鼠标是在大SVG里移动，所以要绑定到大SVG上
            function moveSelectCircle() {
                var p = d3.mouse(container[0][0]);
                selectCircle
                    .attr("cx", p[0])
                    .attr("cy", p[1]);
            }
        }
        DataAccesser(map) {
            if (map == null)
                return this._extract_data_map_func;
            this._extract_data_map_func = map;
            return this;
        }
        ExtractData() {
            var data = this.GetElementByMouse();
            if (!data) {
                this._data = null;
                return null;
            }
            console.log(data.unitsID);
            console.log(data.mapID);
            this._units_id = data.unitsID.sort();
            this._map_id = data.mapID;
            var promise = this._manyLens.ManyLensHubServerGetLensData(this.MapID, this.ID, this.UnitsID, this._extract_data_map_func.TargetAttribute);
            promise
                .done((d) => {
                console.log("promise done in basesingleLens");
                this._data = d;
                this.AfterExtractData();
                this.DisplayLens();
            });
        }
        AfterExtractData() {
            //Do nothing in this abstract method
        }
        DisplayLens() {
            if (this._data) {
                var duration = super.DisplayLens();
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                var cx = this._select_circle_cx + (this._select_circle_radius * cosTheta * this._select_circle_scale);
                var cy = this._select_circle_cy + (this._select_circle_radius * sinTheta * this._select_circle_scale);
                this._sc_lc_svg.select("line")
                    .attr("x1", cx)
                    .attr("y1", cy)
                    .attr("x2", cx)
                    .attr("y2", cy)
                    .attr("stoke-width", 2)
                    .attr("stroke", "red")
                    .transition().duration(duration)
                    .attr("x2", () => {
                    return this._lens_circle_cx; //cx + (this._sc_lc_default_dist * cosTheta);
                })
                    .attr("y2", () => {
                    return this._lens_circle_cy; //cy + (this._sc_lc_default_dist * sinTheta);
                });
                return true;
            }
            else {
                return null;
            }
        }
        SelectCircleDragFunc() {
            if (!this._has_put_down)
                return;
            if (d3.event.sourceEvent.button != 0)
                return;
            this._sc_lc_svg.select("g.lens-circle-g").remove();
            this._sc_lc_svg.select("line")
                .attr("x1", d3.event.x)
                .attr("x2", d3.event.x)
                .attr("y1", d3.event.y)
                .attr("y2", d3.event.y);
            this._select_circle
                .attr("cx", (d) => {
                return d.x = d3.event.x; //Math.max(0, Math.min(parseFloat(this._element.style("width")), d3.event.x));
            })
                .attr("cy", (d) => {
                return d.y = d3.event.y; //Math.max(0, Math.min(parseFloat(this._element.style("height")), d3.event.y));
            });
            this._has_showed_lens = false;
            var hostLens = this.DetachHostLens();
            if (hostLens) {
                this._manyLens.DetachCompositeLens(this._element, hostLens, this);
            }
        }
        //The entrance of new data
        SelectCircleDragendFunc(selectCircle) {
            if (!this._has_put_down)
                return;
            if (d3.event.sourceEvent.button != 0)
                return;
            //传递数据给Lens显示
            if (!this._has_showed_lens) {
                this._select_circle_cx = selectCircle.x;
                this._select_circle_cy = selectCircle.y;
                var theta = Math.random() * Math.PI;
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);
                this._lens_circle_cx = this._select_circle_cx
                    + (this._select_circle_radius * this._select_circle_scale
                        + this._sc_lc_default_dist
                        + this._lens_circle_radius) * cosTheta;
                this._lens_circle_cy = this._select_circle_cy
                    + (this._select_circle_radius * this._select_circle_scale
                        + this._sc_lc_default_dist
                        + this._lens_circle_radius) * sinTheta;
                this.ExtractData(); //it will invoke display automatically when finishing extractdata
                this._has_showed_lens = true;
            }
        }
        SelectCircleZoomFunc() {
            if (d3.event.sourceEvent.type != "wheel") {
                return;
            }
            if (d3.event.scale == this._select_circle_scale) {
                return;
            }
            this._select_circle_scale = d3.event.scale;
            var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
            var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
            var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
            this._select_circle
                .attr("r", this._select_circle_radius * this._select_circle_scale);
            this._sc_lc_svg.select("line")
                .attr("x1", this._select_circle_cx + this._select_circle_radius * d3.event.scale * cosTheta)
                .attr("y1", this._select_circle_cy + this._select_circle_radius * d3.event.scale * sinTheta);
        }
        LensCircleDragFunc() {
            super.LensCircleDragFunc();
            this.ReDrawLinkLine();
        }
        LensCircleDragendFunc() {
            var res = super.LensCircleDragendFunc();
            if (!res) {
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                this._sc_lc_svg.select("line")
                    .transition()
                    .duration(this._combine_failure_rebound_duration)
                    .ease('back-out')
                    .attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta)
                    .attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta)
                    .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                    .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
            }
            return res;
        }
        LensCircleZoomFunc() {
            super.LensCircleZoomFunc();
            this.ReDrawLinkLine();
        }
        ReDrawLinkLine() {
            var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
            var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
            var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
            this._sc_lc_svg.select("line")
                .attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta)
                .attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta)
                .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
        }
        DetachHostLens() {
            if (this.IsComponentLens) {
                var hostLens = this._host_lens;
                this.HostLens = null;
                return hostLens;
            }
            else {
                return null;
            }
        }
        ChangeHostTo(hostLens) {
            if (this.IsComponentLens) {
                this.HostLens = hostLens;
            }
            else {
                return;
            }
        }
        GetElementByMouse() {
            var unitsID = [];
            var mapID;
            var rect = this._element.node().createSVGRect();
            var t = this._sc_lc_svg.data()[0];
            var realX = this._select_circle_cx * t.scale + t.tx;
            var realY = this._select_circle_cy * t.scale + t.ty;
            rect.x = realX - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
            rect.y = realY - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
            rect.height = rect.width = this._select_circle_radius * Math.SQRT2 * this._select_circle_scale * t.scale;
            //this._element.select( "#rectForTest" ).remove();
            //this._element.append( "rect" ).attr( {
            //    id:"rectForTest",
            //    x: rect.x,
            //    y: rect.y,
            //    width: rect.width,
            //    height:rect.height
            //})
            //.style("pointer-events","none");
            var ele = this._element.node().getIntersectionList(rect, null);
            var minDist2 = Number.MAX_VALUE;
            var minUnitsID = -1;
            for (var i = 0, len = ele.length; i < len; ++i) {
                var node = d3.select(ele.item(i));
                if (node.classed("unit")) {
                    var dx = parseFloat(node.attr("x")) + parseFloat(node.attr("width")) * 0.5 - realX;
                    var dy = parseFloat(node.attr("y")) + parseFloat(node.attr("height")) * 0.5 - realY;
                    var dist2 = dx * dx + dy * dy;
                    if (dist2 < (this._select_circle_radius * this._select_circle_scale * this._select_circle_radius * this._select_circle_scale)) {
                        var tID = node.data()[0]['unitID'];
                        unitsID.push(tID);
                        mapID = node.data()[0]['mapID'];
                    }
                    else if (dist2 < minDist2) {
                        mapID = node.data()[0]['mapID'];
                        minDist2 = dist2;
                        minUnitsID = node.data()[0]['unitID'];
                    }
                }
            }
            var res = null;
            if (unitsID.length > 0 && mapID) {
                res = { unitsID: unitsID, mapID: mapID };
            }
            else if (unitsID.length == 0 && mapID) {
                res = { unitsID: [minUnitsID], mapID: mapID };
            }
            else {
                console.log(unitsID);
                console.log(mapID);
                console.log("there is a bug here " + unitsID);
            }
            return res;
            //var eles = [];
            //try {
            //    var x = d3.event.sourceEvent.x,
            //        y = d3.event.sourceEvent.y;
            //} catch (e) {
            //    return;
            //}
            //var p = d3.mouse(this._element.node());
            //if (p[0] < 0 || p[0] > parseFloat(this._element.style("width")) || p[1] < 0 || p[1] > parseFloat(this._element.style("height")))
            //    return;
            //var ele = d3.select(document.elementFromPoint(x, y));
            //while (ele && ele.attr("id") != "mapSvg") {
            //    if (ele.classed("unit")) {
            //        res = ele[0][0];
            //        break;
            //    }
            //    eles.push(ele);
            //    ele.style("visibility", "hidden");
            //    ele = d3.select(document.elementFromPoint(x, y));
            //    if (eles.length > 10) {
            //        throw new Error("what the fuck");
            //    }
            //}
            //for (var i = 0, len = eles.length; i < len; ++i) {
            //    eles[i].style("visibility", "");
            //}
        }
    }
    BaseSingleLens.Type = "BaseSingleLens";
    exports.BaseSingleLens = BaseSingleLens;
});
define("Lens/BaseCompositeLens", ["require", "exports", "Lens/BaseD3Lens"], function (require, exports, BaseD3Lens_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseCompositeLens extends BaseD3Lens_2.BaseD3Lens {
        constructor(element, type, manyLens, firstLens, secondLens) {
            super(element, type, manyLens);
            this._base_accessor_func = null;
            this._sub_accessor_func = null;
            this._new_lens_count = 1;
            this._need_to_reshape = false;
            this._is_composite_lens = true;
            this._components_lens = new Array();
            this._components_select_circle = new Array();
            this._components_kind = new Map();
            this._components_units = new Map();
            this._base_component = firstLens;
            this._base_component.HostLens = this;
            this._map_id = firstLens.MapID;
            this._lens_circle_cx = firstLens.LensCX;
            this._lens_circle_cy = firstLens.LensCY;
            if (secondLens) {
                var firstLens0 = firstLens;
                this._sub_component = secondLens;
                this._sub_component.HostLens = this;
                this._components_lens.push(firstLens0);
                this._components_select_circle.push({
                    _line: firstLens0.LinkLine,
                    _sc_cx: firstLens0.SelectCircleCX,
                    _sc_cy: firstLens0.SelectCircleCY,
                    _sc_radius: firstLens0.SelectCircleRadius,
                    _sc_scale: firstLens0.SelectCircleScale
                });
                this._components_kind.set(firstLens0.Type, 1);
                this._components_lens.push(secondLens);
                this._components_select_circle.push({
                    _line: secondLens.LinkLine,
                    _sc_cx: secondLens.SelectCircleCX,
                    _sc_cy: secondLens.SelectCircleCY,
                    _sc_radius: secondLens.SelectCircleRadius,
                    _sc_scale: secondLens.SelectCircleScale
                });
                if (firstLens0.Type == secondLens.Type) {
                    this._components_kind.set(firstLens0.Type, 2);
                }
                else {
                    this._components_kind.set(secondLens.Type, 1);
                }
                //set the place of this component lens
                firstLens0.UnitsID.forEach((d, i) => {
                    this._components_units.set(d, 1);
                    this._units_id.push(d);
                });
                secondLens.UnitsID.forEach((d, i) => {
                    if (this._components_units.has(d)) {
                        //if this place already exits, add 1 to it(which means it will be 2)
                        this._components_units.set(d, 2);
                    }
                    else {
                        this._components_units.set(d, 1);
                        this._units_id.push(d);
                    }
                });
                this._base_accessor_func = firstLens0.DataAccesser();
                this._sub_accessor_func = secondLens.DataAccesser();
            }
            else {
                ////haven't finish yet
                //var firstLens1: BaseCompositeLens = (<BaseCompositeLens>firstLens);
                //for (var i = 0, len = firstLens1.Lens.length; i < len; ++i) {
                //    this._lens.push(firstLens1.Lens[i]);
                //    this._select_circle.push(firstLens1.SelectCircle[i]);
                //    if (this._components_kind.has(firstLens1.Lens[i].Type)) {
                //        var num: number = this._components_kind.get(firstLens1.Lens[i].Type) + 1;
                //        this._components_kind.set(firstLens1.Lens[i].Type, num);
                //    } else {
                //        this._components_kind.set(firstLens1.Lens[i].Type, 1);
                //    }
                //    firstLens1.Lens[i].ChangeHostTo(this);
                //}
                ////？this._sub_data = firstLens1.RawData;
                //firstLens1.RawData.forEach((v)=>{
                //    this._data.push(v);
                //});
            }
        }
        get ComponentsLens() {
            return this._components_lens;
        }
        get ComponentsSelectCircle() {
            return this._components_select_circle;
        }
        get ComponentsCount() {
            return this._components_lens.length;
        }
        get ComponentsKind() {
            return this._components_kind;
        }
        get ComponentsUnits() {
            return this._components_units;
        }
        get NeedtoReshape() {
            return this._need_to_reshape;
        }
        Render(color) {
            if (!this._sc_lc_svg) {
                super.Render(color);
            }
            this._base_component.RemoveLens();
            if (this._sub_component) {
                this._sub_component.RemoveLens();
            }
            //Update base component and sub component
            this._base_component = this;
            this._sub_component = null;
            //It will invoke display() automatically when finish extracting data;
            this.ExtractData();
        }
        ExtractData() {
            var promise = this._manyLens.ManyLensHubServerGetLensData(this.MapID, this.ID, this.UnitsID, this._base_accessor_func.TargetAttribute, this._sub_accessor_func.TargetAttribute);
            promise
                .done((d) => {
                console.log("promise done in baseCompositeLens");
                this._data = d;
                this.AfterExtractData();
                this.DisplayLens();
            });
            //this._components_data.forEach((componentData)=>{
            //    if (this._data == null)
            //        this._data = JSON.parse(JSON.stringify(componentData));
            //    this._data.unitsID.concat(componentData.unitsID);
            //    this._data.contents.concat(componentData.contents);
            //    componentData.hashTagDistribute.forEach((d) => {
            //        var key = d.Key;
            //        var value = d.Value;
            //        var column = this._data.hashTagDistribute;
            //        for (var i = 0, len = column.length; i < len; ++i) {
            //            if (key == column[i].Key) {
            //                column[i].Value += value;
            //                break;
            //            }
            //        }
            //        if (i == len) {
            //            column.push(d);
            //        }
            //    });
            //    componentData.keywordsDistribute.forEach((d) => {
            //        var key = d.Key;
            //        var value = d.Value;
            //        var column = this._data.keywordsDistribute;
            //        for (var i = 0, len = column.length; i < len; ++i) {
            //            if (key == column[i].Key) {
            //                column[i].Value += value;
            //                break;
            //            }
            //        }
            //        if (i == len) {
            //            column.push(d);
            //        }
            //    });
            //    componentData.tweetLengthDistribute.forEach((d) => {
            //        var key = d.Key;
            //        var value = d.Value;
            //        var column = this._data.tweetLengthDistribute;
            //        for (var i = 0, len = column.length; i < len; ++i) {
            //            if (key == column[i].Key) {
            //                column[i].Value += value;
            //                break;
            //            }
            //        }
            //        if (i == len) {
            //            column.push(d);
            //        }
            //    });
            //});
        }
        DisplayLens() {
            super.DisplayLens();
            this.ReDrawLinkLine(this._new_lens_count);
        }
        LensCircleDragFunc() {
            super.LensCircleDragFunc();
            this.ReDrawLinkLine();
        }
        LensCircleDragendFunc() {
            var res = super.LensCircleDragendFunc();
            if (!res) {
                for (var i = 0, len = this._components_select_circle.length; i < len; ++i) {
                    var sc = this._components_select_circle[i];
                    var theta = Math.atan((this._lens_circle_cy - sc._sc_cy) / (this._lens_circle_cx - sc._sc_cx));
                    var cosTheta = this._lens_circle_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                    sc._line
                        .transition()
                        .duration(this._combine_failure_rebound_duration)
                        .ease('back-out')
                        .attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta)
                        .attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta)
                        .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                        .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
                }
            }
            return res;
        }
        LensCircleZoomFunc() {
            super.LensCircleZoomFunc();
            this.ReDrawLinkLine();
        }
        AddComponentLens(lens) {
            this._sub_component = lens;
            if (lens.IsCompositeLens) {
                this.AddCompositeLens(lens);
            }
            else {
                this.AddSingleLens(lens);
            }
            return this;
        }
        //haven't handle yet
        //TODO
        AddCompositeLens(componentLens) {
            if (componentLens.ComponentsSelectCircle.length != componentLens.ComponentsLens.length)
                throw new Error('The length of sc is different from length of lens');
            for (var i = 0, len = componentLens.ComponentsLens.length; i < len; ++i) {
                this._components_lens.push(componentLens.ComponentsLens[i]);
                this._components_select_circle.push(componentLens.ComponentsSelectCircle[i]);
                if (this._components_kind.has(componentLens.ComponentsLens[i].Type)) {
                    var num = this._components_kind.get(componentLens.ComponentsLens[i].Type) + 1;
                    this._components_kind.set(componentLens.ComponentsLens[i].Type, num);
                }
                else {
                    this._components_kind.set(componentLens.ComponentsLens[i].Type, 1);
                }
                componentLens.ComponentsLens[i].ChangeHostTo(this);
            }
            componentLens.RemoveWholeSVG();
            this._manyLens.RemoveLens(componentLens);
            this._new_lens_count = componentLens.ComponentsLens.length;
        }
        AddSingleLens(lens) {
            lens.HostLens = this;
            this._components_lens.push(lens);
            this._components_select_circle.push({
                _line: lens.LinkLine,
                _sc_cx: lens.SelectCircleCX,
                _sc_cy: lens.SelectCircleCY,
                _sc_radius: lens.SelectCircleRadius,
                _sc_scale: lens.SelectCircleScale
            });
            //Component kind
            if (this._components_kind.has(lens.Type)) {
                var num = this._components_kind.get(lens.Type) + 1;
                this._components_kind.set(lens.Type, num);
            }
            else {
                this._components_kind.set(lens.Type, 1);
            }
            //Component place
            lens.UnitsID.forEach((d, i) => {
                if (this._components_units.has(d)) {
                    var num = this._components_units.get(d) + 1;
                    this._components_units.set(d, num);
                }
                else {
                    this._components_units.set(d, 1);
                    this._units_id.push(d);
                }
            });
            this._new_lens_count = 1;
        }
        RemoveComponentLens(lens) {
            //TODO remove related data here;
            var index = this._components_lens.indexOf(lens);
            if (-1 != index) {
                this._components_lens.splice(index, 1);
                this._components_select_circle.splice(index, 1);
                lens.UnitsID.forEach((d, i) => {
                    var num = this._components_units.get(d) - 1;
                    if (num > 0) {
                        this._components_units.set(d, num);
                    }
                    else if (num == 0) {
                        this._components_units.delete(d);
                        this._units_id.splice(this._units_id.indexOf(d), 1);
                    }
                    else {
                        throw new Error("The number of this places of component is less than 0!!");
                    }
                });
                if (this.ComponentsCount == 1) {
                    //if there is only one component left, we can just return this one
                    this.RemoveWholeSVG();
                    var lastLens = this._components_lens[0];
                    lastLens.LensCX = this.LensCX;
                    lastLens.LensCY = this.LensCY;
                    lastLens.LensRadius = this.LensRadius;
                    lastLens.LensScale = this.LensScale;
                    lastLens.DetachHostLens();
                    return this._components_lens[0];
                }
                else if (this.ComponentsCount < 1) {
                    throw new Error('The number of component of this lens is less than 2!!');
                }
                else {
                    var num = this._components_kind.get(lens.Type) - 1;
                    if (num > 0) {
                        this._components_kind.set(lens.Type, num);
                        return this;
                    }
                    else if (num == 0) {
                        this.RemoveWholeSVG();
                        this._components_kind.delete(lens.Type);
                        this._need_to_reshape = true;
                        return this;
                    }
                    else {
                        throw new Error("The number of this kind of component is less than 0!!");
                    }
                }
            }
        }
        ReDrawLinkLine(newLensCount = 0) {
            var i = newLensCount == 0 ? 0 : this._components_select_circle.length - newLensCount;
            for (var len = this._components_select_circle.length; i < len; ++i) {
                var sc = this._components_select_circle[i];
                var theta = Math.atan((this._lens_circle_cy - sc._sc_cy) / (this._lens_circle_cx - sc._sc_cx));
                var cosTheta = this._lens_circle_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);
                sc._line
                    .attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta)
                    .attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta)
                    .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                    .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
            }
            this._new_lens_count = 0;
        }
        RemoveWholeSVG() {
            this._sc_lc_svg
                .style("pointer-events", "none")
                .transition()
                .duration(200) //this is hard code, should be optimize
                .attr("opacity", "1e-6")
                .remove();
        }
    }
    BaseCompositeLens.Type = "BaseCompositeLens";
    exports.BaseCompositeLens = BaseCompositeLens;
});
define("Lens/BaseHackLens", ["require", "exports", "d3", "Lens/BaseD3Lens"], function (require, exports, d3, BaseD3Lens_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseHackLens extends BaseD3Lens_3.BaseD3Lens {
        constructor(element, attributeName, type, manyLens) {
            super(element, type, manyLens);
            this._select_circle_radius = 0;
            this._select_circle_cx = -10;
            this._select_circle_cy = -10;
            this._select_circle_scale = 1;
            this._select_circle_zoom = d3.behavior.zoom();
            this._select_circle_drag = d3.behavior.drag();
            this._has_put_down = false;
            this._has_showed_lens = false;
            //protected _sc_drag_event_flag: boolean = false;
            this._sc_lc_default_dist = 100;
            this._extract_data_map_func = null;
            this._is_composite_lens = false;
            this._select_circle_radius = 10;
            this._attribute_name = attributeName;
            this._select_circle_zoom
                .scaleExtent([1, 4])
                .on("zoom", () => {
                this.SelectCircleZoomFunc();
                //console.log("sc_zoom " + this._type);
                d3.event.sourceEvent.stopPropagation();
            });
            this._select_circle_drag
                .origin(function (d) { return d; })
                .on("dragstart", () => {
                //this._sc_drag_event_flag = false;
                //console.log("sc_dragstart " + this._type);
                d3.event.sourceEvent.stopPropagation();
            })
                .on("drag", () => {
                //if (this._sc_drag_event_flag) {
                this.SelectCircleDragFunc();
                //} else {
                //    this._sc_drag_event_flag = true;
                //}
                //console.log("sc_drag " + this._type);
                d3.event.sourceEvent.stopPropagation();
            })
                .on("dragend", (d) => {
                this.SelectCircleDragendFunc(d);
                //console.log("sc_dragend " + this._type);
                d3.event.sourceEvent.stopPropagation();
            });
        }
        get AttributeName() {
            return this._attribute_name;
        }
        get LinkLine() {
            return this._sc_lc_svg.select("line");
        }
        get SelectCircleCX() {
            return this._select_circle_cx;
        }
        get SelectCircleCY() {
            return this._select_circle_cy;
        }
        get SelectCircleScale() {
            return this._select_circle_scale;
        }
        get SelectCircleRadius() {
            return this._select_circle_radius;
        }
        Render(color) {
            super.Render(color);
            var container = this._element;
            this._select_circle_svg = this._sc_lc_svg.append("g")
                .attr("class", "select-circle");
            var selectCircle = this._select_circle =
                this._select_circle_svg.append("circle")
                    .data([{ x: this._select_circle_cx, y: this._select_circle_cy }]);
            selectCircle
                .attr("r", this._select_circle_radius)
                .attr("fill", color)
                .attr("fill-opacity", 0.7)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr({
                cx: -50,
                cy: -50
            })
                .on("mouseup", (d) => {
                if (!this._has_put_down) {
                    this._has_put_down = true;
                    d.x = this._select_circle_cx = parseFloat(selectCircle.attr("cx"));
                    d.y = this._select_circle_cy = parseFloat(selectCircle.attr("cy"));
                    container.on("mousemove", null);
                }
            })
                .on("contextmenu", () => {
                d3.event.preventDefault();
                d3.event.stopPropagation();
                this._sc_lc_svg.remove();
                this._manyLens.RemoveLens(this);
            })
                .call(this._select_circle_zoom)
                .on("dblclick.zoom", null)
                .on("mousedown.zoom", null)
                .call(this._select_circle_drag);
            this._sc_lc_svg.append("line")
                .attr("stoke-width", 2)
                .attr("stroke", "red");
            container.on("mousemove", moveSelectCircle); //因为鼠标是在大SVG里移动，所以要绑定到大SVG上
            function moveSelectCircle() {
                var p = d3.mouse(container[0][0]);
                selectCircle
                    .attr("cx", p[0])
                    .attr("cy", p[1]);
            }
        }
        DataAccesser(map) {
            if (map == null)
                return this._extract_data_map_func;
            this._extract_data_map_func = map;
            return this;
        }
        ExtractData() {
        }
        AfterExtractData() {
            //Do nothing in this abstract method
        }
        DisplayLens() {
            if (this._data) {
                var duration = super.DisplayLens();
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                var cx = this._select_circle_cx + (this._select_circle_radius * cosTheta * this._select_circle_scale);
                var cy = this._select_circle_cy + (this._select_circle_radius * sinTheta * this._select_circle_scale);
                this._sc_lc_svg.select("line")
                    .attr("x1", cx)
                    .attr("y1", cy)
                    .attr("x2", cx)
                    .attr("y2", cy)
                    .attr("stoke-width", 2)
                    .attr("stroke", "red")
                    .transition().duration(duration)
                    .attr("x2", () => {
                    return this._lens_circle_cx; //cx + (this._sc_lc_default_dist * cosTheta);
                })
                    .attr("y2", () => {
                    return this._lens_circle_cy; //cy + (this._sc_lc_default_dist * sinTheta);
                });
                return true;
            }
            else {
                return null;
            }
        }
        SelectCircleDragFunc() {
            if (!this._has_put_down)
                return;
            if (d3.event.sourceEvent.button != 0)
                return;
            this._sc_lc_svg.select("g.lens-circle-g").remove();
            this._sc_lc_svg.select("line")
                .attr("x1", d3.event.x)
                .attr("x2", d3.event.x)
                .attr("y1", d3.event.y)
                .attr("y2", d3.event.y);
            this._select_circle
                .attr("cx", (d) => {
                return d.x = d3.event.x; //Math.max(0, Math.min(parseFloat(this._element.style("width")), d3.event.x));
            })
                .attr("cy", (d) => {
                return d.y = d3.event.y; //Math.max(0, Math.min(parseFloat(this._element.style("height")), d3.event.y));
            });
            this._has_showed_lens = false;
        }
        //The entrance of new data
        SelectCircleDragendFunc(selectCircle) {
            if (!this._has_put_down)
                return;
            if (d3.event.sourceEvent.button != 0)
                return;
            //传递数据给Lens显示
            if (!this._has_showed_lens) {
                this._select_circle_cx = selectCircle.x;
                this._select_circle_cy = selectCircle.y;
                var theta = Math.random() * Math.PI;
                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);
                this._lens_circle_cx = this._select_circle_cx
                    + (this._select_circle_radius * this._select_circle_scale
                        + this._sc_lc_default_dist
                        + this._lens_circle_radius) * cosTheta;
                this._lens_circle_cy = this._select_circle_cy
                    + (this._select_circle_radius * this._select_circle_scale
                        + this._sc_lc_default_dist
                        + this._lens_circle_radius) * sinTheta;
                this.ExtractData(); //it will invoke display automatically when finishing extractdata
                this._has_showed_lens = true;
            }
        }
        SelectCircleZoomFunc() {
            if (d3.event.sourceEvent.type != "wheel") {
                return;
            }
            if (d3.event.scale == this._select_circle_scale) {
                return;
            }
            this._select_circle_scale = d3.event.scale;
            var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
            var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
            var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
            this._select_circle
                .attr("r", this._select_circle_radius * this._select_circle_scale);
            this._sc_lc_svg.select("line")
                .attr("x1", this._select_circle_cx + this._select_circle_radius * d3.event.scale * cosTheta)
                .attr("y1", this._select_circle_cy + this._select_circle_radius * d3.event.scale * sinTheta);
        }
        LensCircleDragFunc() {
            super.LensCircleDragFunc();
            this.ReDrawLinkLine();
        }
        LensCircleDragendFunc() {
            var res = super.LensCircleDragendFunc();
            if (!res) {
                var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                this._sc_lc_svg.select("line")
                    .transition()
                    .duration(this._combine_failure_rebound_duration)
                    .ease('back-out')
                    .attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta)
                    .attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta)
                    .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                    .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
            }
            return res;
        }
        LensCircleZoomFunc() {
            super.LensCircleZoomFunc();
            this.ReDrawLinkLine();
        }
        ReDrawLinkLine() {
            var theta = Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
            var cosTheta = this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
            var sinTheta = this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
            this._sc_lc_svg.select("line")
                .attr("x1", this._select_circle_cx + this._select_circle_radius * this._select_circle_scale * cosTheta)
                .attr("y1", this._select_circle_cy + this._select_circle_radius * this._select_circle_scale * sinTheta)
                .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta);
        }
        DetachHostLens() {
            if (this.IsComponentLens) {
                var hostLens = this._host_lens;
                this.HostLens = null;
                return hostLens;
            }
            else {
                return null;
            }
        }
        ChangeHostTo(hostLens) {
            if (this.IsComponentLens) {
                this.HostLens = hostLens;
            }
            else {
                return;
            }
        }
        GetElementByMouse() {
            var unitsID = [];
            var mapID;
            var rect = this._element.node().createSVGRect();
            var t = this._sc_lc_svg.data()[0];
            var realX = this._select_circle_cx * t.scale + t.tx;
            var realY = this._select_circle_cy * t.scale + t.ty;
            rect.x = realX - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
            rect.y = realY - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
            rect.height = rect.width = this._select_circle_radius * Math.SQRT2 * this._select_circle_scale * t.scale;
            this._element.select("#rectForTest").remove();
            this._element.append("rect").attr({
                id: "rectForTest",
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            })
                .style("pointer-events", "none");
            var ele = this._element.node().getIntersectionList(rect, null);
            var minDist2 = Number.MAX_VALUE;
            var minUnitsID = -1;
            for (var i = 0, len = ele.length; i < len; ++i) {
                var node = d3.select(ele.item(i));
                if (node.classed("unit")) {
                    var dx = parseFloat(node.attr("x")) + parseFloat(node.attr("width")) * 0.5 - realX;
                    var dy = parseFloat(node.attr("y")) + parseFloat(node.attr("height")) * 0.5 - realY;
                    var dist2 = dx * dx + dy * dy;
                    if (dist2 < (this._select_circle_radius * this._select_circle_scale * this._select_circle_radius * this._select_circle_scale)) {
                        var tID = node.data()[0]['unitID'];
                        unitsID.push(tID);
                        mapID = node.data()[0]['mapID'];
                    }
                    else if (dist2 < minDist2) {
                        mapID = node.data()[0]['mapID'];
                        minDist2 = dist2;
                        minUnitsID = node.data()[0]['unitID'];
                    }
                }
            }
            var res = null;
            if (unitsID.length > 0 && mapID) {
                res = { unitsID: unitsID, mapID: mapID };
            }
            else if (unitsID.length == 0 && mapID) {
                res = { unitsID: [minUnitsID], mapID: mapID };
            }
            else {
                console.log(unitsID);
                console.log(mapID);
                console.log("there is a bug here " + unitsID);
            }
            return res;
        }
    }
    BaseHackLens.Type = "BaseHackLens";
    exports.BaseHackLens = BaseHackLens;
});
///<reference path = "./BaseHackLens.ts" />
define("Lens/BarChartLens", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BarChartLens extends BaseHackLens {
        constructor(element, attributeName, manyLens) {
            super(element, attributeName, BarChartLens.Type, manyLens);
            this._x_axis_gen = d3.svg.axis();
            this._bar_chart_width = this._lens_circle_radius * Math.SQRT2;
            this._bar_chart_height = this._bar_chart_width;
        }
        Render(color) {
            super.Render(color);
        }
        ExtractData() {
            var data = d3.range(12).map(function (d) {
                return 10 + 70 * Math.random();
            });
            this._data = data;
            this.DisplayLens();
        }
        DisplayLens() {
            if (!super.DisplayLens())
                return;
            var x = d3.scale.linear()
                .range([0, this._bar_chart_width])
                .domain([0, this._data]);
            this._x_axis_gen
                .scale(x)
                .ticks(0)
                .orient("bottom");
            this._x_axis = this._lens_circle_svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", () => {
                return "translate(" + [-this._bar_chart_width / 2, this._bar_chart_height / 2] + ")";
            })
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .call(this._x_axis_gen);
            this._bar_width = (this._bar_chart_width - 20) / this._data.length;
            var barHeight = d3.scale.linear()
                .range([10, this._bar_chart_height])
                .domain(d3.extent(this._data));
            var bar = this._lens_circle_svg.selectAll(".bar")
                .data(this._data)
                .enter().append("g")
                .attr("transform", (d, i) => {
                return "translate(" + [10 + i * this._bar_width - this._bar_chart_width / 2, this._bar_chart_height / 2 - barHeight(d)] + ")";
            });
            bar.append("rect")
                .attr("width", this._bar_width)
                .attr("height", function (d) { return barHeight(d); })
                .attr("fill", "steelblue");
        }
    }
    BarChartLens.Type = "BarChartLens";
    exports.BarChartLens = BarChartLens;
});
///<reference path = "./BaseSingleLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class MapLens extends BaseSingleLens {
            constructor(element, attributeName, manyLens) {
                super(element, attributeName, MapLens.Type, manyLens);
                this._projection = d3.geo.equirectangular();
                //d3.geo.mercator();
                this._path = d3.geo.path();
                this._color = d3.scale.quantize();
                this._projection
                    .precision(.1)
                    .scale(76)
                    .rotate([0, 0])
                    .center([-0.6, 38.7])
                    .translate([0, -30]);
                this._path
                    .projection(this._projection);
                this._color
                    .range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                    // "rgb(8, 81, 156)"
                    // "rgb(8, 48, 107)"
                ]);
                this._hack_color = ["rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"];
            }
            get Projection() {
                return this._projection;
            }
            get Path() {
                return this._path;
            }
            get Color() {
                return this._color;
            }
            get MapData() {
                return this._map_data;
            }
            Render(color) {
                super.Render(color);
            }
            AfterExtractData() {
                var data = {};
                this._color.domain(d3.extent(this._extract_data_map_func.Extract(this._data), function (d) { return d['Value']; }));
                this._extract_data_map_func.Extract(this._data).forEach((d) => {
                    data[d.Key] = d.Value;
                });
                this._data = data;
            }
            DisplayLens() {
                if (!super.DisplayLens())
                    return;
                this._lens_circle
                    .attr("d", () => {
                    return "M" + -(2.5 * this._lens_circle_radius) + "," + -this._lens_circle_radius
                        + "L" + -(2.5 * this._lens_circle_radius) + "," + this._lens_circle_radius
                        + "L" + (2.5 * this._lens_circle_radius) + "," + this._lens_circle_radius
                        + "L" + (2.5 * this._lens_circle_radius) + "," + -this._lens_circle_radius
                        + "Z";
                });
                if (this._map_data) {
                    this._lens_circle_svg.append("g")
                        .attr("id", "country")
                        .selectAll("path")
                        .data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.countries).features)
                        .enter().append("path")
                        .attr("d", this._path)
                        .attr("fill", (d) => {
                        var color = this._color(this._data[d.id] || 0);
                        //var color = this._hack_color[Math.floor(Math.random()*5)];
                        return color;
                    })
                        .on("click", (d) => {
                        if (!d3.event.defaultPrevented)
                            this.ClickedMap(d);
                    });
                    this._lens_circle_svg.append("path")
                        .datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.countries, function (a, b) { return a !== b; }))
                        .attr("id", "state-borders")
                        .attr("d", this._path);
                }
                else {
                    d3.json("./testData/countriesAlpha2.topo.json", (error, mapData) => {
                        this._map_data = {
                            raw: mapData,
                        };
                        var pathData = topojson.feature(mapData, mapData.objects.countries);
                        this._lens_circle_svg.append("g")
                            .attr("id", "states")
                            .selectAll("path")
                            .data(pathData.features)
                            .enter().append("path")
                            .attr("d", this._path)
                            .attr("fill", (d) => {
                            //var color = this._color(this._data[d.id]||0);
                            var color = this._hack_color[Math.floor(Math.random() * 5)];
                            return color;
                        })
                            .on("click", (d) => {
                            this.ClickedMap(d);
                        });
                        this._lens_circle_svg.append("path")
                            .datum(topojson.mesh(mapData, mapData.objects.countries, function (a, b) { return a !== b; }))
                            .attr("id", "state-borders")
                            .attr("d", this._path);
                    });
                }
            }
            ClickedMap(d) {
                if (d3.event.defaultPrevented)
                    return;
                var x, y, k;
                if (d && this._centered_state !== d) {
                    var centroid = this._path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    this._centered_state = d;
                    this._lens_circle_zoom.on("zoom", null);
                    this._lens_circle_drag
                        .on("dragstart", null)
                        .on("drag", null)
                        .on("dragend", null);
                    this._element.on("click", () => {
                        this.ClickedMap(this._centered_state);
                    });
                }
                else {
                    x = 0;
                    y = 0;
                    k = this._lens_circle_scale;
                    this._centered_state = null;
                    this._lens_circle_drag
                        .on("dragstart", () => {
                        this.LensCircleDragstartFunc();
                    })
                        .on("drag", () => {
                        this.LensCircleDragFunc();
                    })
                        .on("dragend", () => {
                        this.LensCircleDragendFunc();
                    });
                    this._lens_circle_zoom
                        .scale(this._lens_circle_scale)
                        .on("zoom", () => {
                        this.LensCircleZoomFunc();
                    });
                    this._element.on("click", null);
                }
                this._lens_circle_svg.selectAll("path")
                    .classed("active", this._centered_state && ((d) => {
                    return d === this._centered_state;
                }));
                this._lens_circle_svg.transition()
                    .duration(750)
                    .attr("transform", (d) => {
                    return "translate(" + this._lens_circle_cx + "," + this._lens_circle_cy + ")scale(" + k + ")translate(" + [-x, -y] + ")";
                })
                    .style("stroke-width", 1.5 / k + "px");
                d3.event.stopPropagation();
            }
        }
        MapLens.Type = "MapLens";
        Lens.MapLens = MapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class NetworkLens extends BaseSingleLens {
            constructor(element, attributeName, manyLens) {
                super(element, attributeName, NetworkLens.Type, manyLens);
                this._force = d3.layout.force();
                this._location_x_scale = d3.scale.linear();
                this._location_y_scale = d3.scale.linear();
                this._force
                    .size([0, 0])
                    .linkDistance(this._lens_circle_radius / 2)
                    .charge(-50)
                    .gravity(0.1)
                    .friction(0.5);
                this._location_x_scale
                    .range([-this._lens_circle_radius, this._lens_circle_radius]);
                this._location_y_scale
                    .range([-this._lens_circle_radius, this._lens_circle_radius]);
            }
            Render(color) {
                super.Render(color);
            }
            AfterExtractData() {
            }
            DisplayLens() {
                if (!super.DisplayLens())
                    return;
                var graph = this._extract_data_map_func.Extract(this._data);
                var nodes = graph.nodes, links = graph.links;
                nodes.forEach((d) => {
                    d.x = d.x * this.LensRadius;
                    d.y = d.y * this.LensRadius;
                });
                this._location_x_scale
                    .domain(d3.extent(nodes, function (d) { return d.x; }));
                this._location_y_scale
                    .domain(d3.extent(nodes, function (d) { return d.y; }));
                nodes.forEach((d) => {
                    if ((d.x * d.x + d.y * d.y) > this.LensRadius * this.LensRadius) {
                        d.x = this._location_x_scale(d.x),
                            d.y = this._location_y_scale(d.y);
                    }
                });
                this._force
                    .nodes(nodes)
                    .links(links);
                var link = this._lens_circle_svg
                    .selectAll(".network.link")
                    .data(links)
                    .enter().append("line")
                    .attr("class", "network link")
                    .style({
                    "stroke": "#777",
                    "stroke-width": "1px"
                });
                var node = this._lens_circle_svg
                    .selectAll(".network.node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "network node")
                    .attr("r", 4)
                    .attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; })
                    .style({
                    "stroke": "steelblue",
                    "fill": "#fff",
                    "stroke-width": 1.5
                });
                this._force.on("tick", () => {
                    node
                        .attr('cx', function (d) { return d.x; })
                        .attr('cy', function (d) { return d.y; });
                    link
                        .attr('x1', function (d) { return d.source.x; })
                        .attr('y1', function (d) { return d.source.y; })
                        .attr('x2', function (d) { return d.target.x; })
                        .attr('y2', function (d) { return d.target.y; });
                });
                this._force.start();
            }
        }
        NetworkLens.Type = "NetworkLens";
        Lens.NetworkLens = NetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
define("Lens/PieChartLens", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PieChartLens extends BaseSingleLens {
        //public get Color(): D3.Scale.OrdinalScale {
        //    return this._color;
        //}
        constructor(element, attributeName, manyLens) {
            super(element, attributeName, PieChartLens.Type, manyLens);
            this._pie_innerRadius = 0;
            this._pie_outterRadius = this._lens_circle_radius - 0;
            this._pie = d3.layout.pie();
            this._arc = d3.svg.arc();
            this._color = d3.scale.quantize();
            this._arc
                .innerRadius(this._pie_innerRadius)
                .outerRadius(this._pie_outterRadius);
            this._pie
                .value((d) => {
                return d.Value;
            })
                .sort(function (a, b) {
                if (a.Value > b.Value)
                    return -1;
                return 1;
            })
                .startAngle(0);
            this._color
                .range([
                "rgb(198,219,239)",
                "rgb(158,202,225)",
                "rgb(107, 174, 214)",
                "rgb(66, 146, 198)",
                "rgb(33, 113, 181)"
                // "rgb(8, 81, 156)"
                // "rgb(8, 48, 107)"
            ]);
        }
        Render(color) {
            super.Render(color);
        }
        AfterExtractData() {
            this._color.domain(d3.extent(this._extract_data_map_func.Extract(this._data), function (d) { return d['Value']; }));
        }
        DisplayLens() {
            if (!super.DisplayLens())
                return;
            this._lens_circle.style({
                "stroke": null,
                "stroke-width": null
            });
            this._lens_circle_svg.selectAll(".pie")
                .data(this._pie(this._extract_data_map_func.Extract(this._data)))
                .enter().append("path")
                .attr("id", "pie-" + this.ID)
                .attr("class", "pie")
                .attr("fill", (d) => {
                return this._color(d.value) || "rgb(158,202,225)";
            })
                .attr("stroke", "#fff")
                .attr("d", this._arc)
                .on("mouseover", (d) => {
                this.ShowLabel(d);
            })
                .on("mouseout", () => {
                this.ShowLabel(null);
            });
            var r = this._lens_circle_radius;
            this._lens_circle_svg
                .append("text")
                .text(this._attribute_name)
                .attr("dx", function (d) {
                var bbox = this.getBBox();
                return r * Math.PI - bbox.width / 2;
            })
                .attr("dy", "-5")
                .text("")
                .append("textPath")
                .attr("xlink:href", "#lens-circle-" + this.ID)
                .text(this._attribute_name);
        }
        ShowLabel(d) {
            if (d) {
                this._lens_circle_svg.selectAll("text.mylabel")
                    .data([d])
                    .enter().append("text")
                    .attr("class", "mylabel")
                    .attr("text-anchor", "middle")
                    .attr("x", (d) => {
                    var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                    d.cx = Math.cos(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                    return d.x = Math.cos(a) * (this._pie_outterRadius + 40);
                })
                    .attr("y", (d) => {
                    var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                    d.cy = Math.sin(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                    return d.y = Math.sin(a) * (this._pie_outterRadius + 40);
                })
                    .text(function (d) { return d.data.Key; })
                    .each(function (d) {
                    var bbox = this.getBBox();
                    d.sx = d.x - bbox.width / 2 - 2;
                    d.ox = d.x + bbox.width / 2 + 2;
                    d.sy = d.oy = d.y + 5;
                });
                this._lens_circle_svg.selectAll("path.mylabel")
                    .data([d])
                    .enter().append("path")
                    .attr("class", "mylabel")
                    .style("fill", "none")
                    .style("stroke", "black")
                    .attr("d", function (d) {
                    if (d.cx > d.ox) {
                        return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                    }
                    else {
                        return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                    }
                })
                    .transition().duration(200)
                    .attr("d", function (d) {
                    if (d.cx > d.ox) {
                        return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                    }
                    else {
                        return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                    }
                });
            }
            else {
                this._lens_circle_svg.selectAll(".mylabel").remove();
            }
        }
    }
    PieChartLens.Type = "PieChartLens";
    exports.PieChartLens = PieChartLens;
});
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class TreeNetworkLens extends BaseSingleLens {
            constructor(element, attributeName, manyLens) {
                super(element, attributeName, TreeNetworkLens.Type, manyLens);
                this._theta = 360;
                this._tree = d3.layout.tree();
            }
            Render(color) {
                super.Render(color);
            }
            ExtractData() {
                var data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "analytics",
                            "children": [
                                {
                                    "name": "cluster",
                                    "children": [
                                        { "name": "AgglomerativeCluster", "size": 3938 },
                                        { "name": "CommunityStructure", "size": 3812 },
                                        { "name": "HierarchicalCluster", "size": 6714 },
                                        { "name": "MergeEdge", "size": 743 }
                                    ]
                                },
                                {
                                    "name": "graph",
                                    "children": [
                                        { "name": "BetweennessCentrality", "size": 3534 },
                                        { "name": "LinkDistance", "size": 5731 },
                                        { "name": "MaxFlowMinCut", "size": 7840 },
                                        { "name": "ShortestPaths", "size": 5914 },
                                        { "name": "SpanningTree", "size": 3416 }
                                    ]
                                },
                                {
                                    "name": "optimization",
                                    "children": [
                                        { "name": "AspectRatioBanker", "size": 7074 }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                return data;
            }
            DisplayLens() {
                super.DisplayLens();
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial()
                    .projection(function (d) { return [d.y, d.x / 180 * Math.PI]; });
                this._tree
                    .size([this._theta, this._lens_circle_radius - nodeRadius])
                    .separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(this._data), links = this._tree.links(nodes);
                var link = this._lens_circle_svg.selectAll("path")
                    .data(links)
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1.5)
                    .attr("d", diagonal);
                var node = this._lens_circle_svg.selectAll(".node")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });
                node.append("circle")
                    .attr("r", nodeRadius)
                    .style("stroke", "steelblue")
                    .style("fill", "#fff")
                    .style("stroke-width", 1.5);
            }
        }
        TreeNetworkLens.Type = "TreeNetworkLens";
        Lens.TreeNetworkLens = TreeNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class WordCloudLens extends BaseSingleLens {
            //private _cloud_rotate: number = 0;
            //public get Color(): D3.Scale.LinearScale {
            //    return this._cloud_text_color;
            //}
            constructor(element, attributeName, manyLens) {
                super(element, attributeName, WordCloudLens.Type, manyLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2 * Math.SQRT2;
                this._cloud_h = this._lens_circle_radius * 2;
                this._cloud_padding = 1;
                this._cloud_font = "Impact";
                this._cloud_font_weight = "normal";
                this._cloud_text_color = d3.scale.pow().range(["#C5EFF7", "#4183D7"]);
            }
            Render(color = "red") {
                super.Render(color);
            }
            // data shape {text: size:}
            AfterExtractData() {
                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(this._extract_data_map_func.Extract(this._data), (d) => {
                    return d.Value;
                }));
                this._cloud_text_color
                    .domain(d3.extent(this._extract_data_map_func.Extract(this._data), (d) => {
                    return this._font_size(d.Value);
                }));
            }
            DisplayLens() {
                if (!super.DisplayLens())
                    return null;
                this._lens_circle
                    .attr("d", () => {
                    return "M" + -(Math.SQRT2 * this._lens_circle_radius) + "," + -this._lens_circle_radius
                        + "L" + -(Math.SQRT2 * this._lens_circle_radius) + "," + this._lens_circle_radius
                        + "L" + (Math.SQRT2 * this._lens_circle_radius) + "," + this._lens_circle_radius
                        + "L" + (Math.SQRT2 * this._lens_circle_radius) + "," + -this._lens_circle_radius
                        + "Z";
                });
                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._extract_data_map_func.Extract(this._data))
                    .filter((d) => {
                    if (d.Value > 3)
                        return true;
                    return false;
                })
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.Value); })
                    .on("end", (words, bounds) => {
                    this.DrawCloud(words, bounds);
                });
                this._cloud.start();
            }
            DrawCloud(words, bounds) {
                var w = this._cloud_w;
                var h = this._cloud_h;
                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text").attr("class", "word-cloud");
                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font; })
                    .style("fill", (d, i) => { return this._cloud_text_color(d.size); })
                    .style("opacity", 1e-6)
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                    .text(function (d) { return d.text; })
                    .transition().duration(200)
                    .style("opacity", 1);
            }
        }
        WordCloudLens.Type = "WordCloudLens";
        Lens.WordCloudLens = WordCloudLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cBoundleLens extends BaseCompositeLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cBoundleLens.Type, manyLens, firstLens, secondLens);
                this._innerRadius = this._lens_circle_radius - 0;
                this._cluster = d3.layout.cluster();
                this._boundle = d3.layout.bundle();
                this._line = d3.svg.line.radial();
                this._cluster.size([360, this._innerRadius])
                    .sort(null)
                    .value(function (d) { return d.size; });
                this._line.interpolate("bundle")
                    .tension(.85)
                    .radius(function (d) { return d.y; })
                    .angle(function (d) { return d.x / 180 * Math.PI; });
            }
            Render(color) {
                super.Render(color);
            }
            AfterExtractData() {
            }
            DisplayLens() {
                super.DisplayLens();
                var graph = this._base_accessor_func.Extract(this._data);
                var nodes = this._cluster.nodes(buildTree(graph)), links = buildLinks(graph);
                this._lens_circle_svg.selectAll(".link")
                    .data(this._boundle(links))
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", this._line)
                    .attr("stroke", "steelblue")
                    .attr("stroke-opacity", ".4")
                    .attr("fill", "none");
                this._lens_circle_svg.selectAll(".node")
                    .data(nodes.filter(function (n) { return !n.children; }))
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
                    .attr("font", '11px "Helvetica Neue", Helvetica, Arial, sans-serif')
                    .append("text")
                    .attr("dx", function (d) { return d.x < 180 ? 8 : -8; })
                    .attr("dy", ".31em")
                    .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
                    .attr("transform", function (d) { return d.x < 180 ? null : "rotate(180)"; })
                    .text(function (d) { return d.key; });
                function buildTree(graph) {
                    var nodes = graph.nodes;
                    var links = graph.links;
                    var treeRoot = { name: "root", parent: null, children: [] };
                    nodes.forEach(function (d, i) {
                        //if (!d.parent) {
                        //    d.parent = treeRoot;
                        //    treeRoot.children.push(d);
                        //}
                        treeRoot.children.push(d);
                    });
                    return treeRoot;
                }
                function buildLinks(graph) {
                    var links = [];
                    var nodes = graph.nodes;
                    graph.links.forEach(function (d) {
                        links.push({ source: nodes[d.source], target: nodes[d.target] });
                    });
                    return links;
                }
            }
        }
        cBoundleLens.Type = "cBoundleLens";
        Lens.cBoundleLens = cBoundleLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cChordDiagramLens extends BaseCompositeLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cChordDiagramLens.Type, manyLens, firstLens, secondLens);
                this._chord = d3.layout.chord();
                this._innerRadius = this._lens_circle_radius * 1;
                this._outterRadius = this._lens_circle_radius * 1.1;
                this._chord
                    .padding(.05)
                    .sortSubgroups(d3.descending);
                //this._fill
                //    .domain(d3.range(4))
                //    .range(["#000000", "#FFDD89", "#957244", "#F26223"])
                //;
                //if (firstLens.Type == "WordCloudLens") {
                //    this._fill = (<WordCloudLens>firstLens).Color;
                //} else if (secondLens.Type == "WordCloudLens") {
                //    this._fill = (<WordCloudLens>secondLens).Color;
                //}
                this._fill = d3.scale.category10();
            }
            Render(color = "green") {
                super.Render(color);
            }
            DisplayLens() {
                this._chord.matrix(this._base_accessor_func.Extract(this._data));
                var svg = this._lens_circle_svg;
                this._lens_circle_svg.append("g").selectAll("path")
                    .data(this._chord.groups)
                    .enter().append("path")
                    .style("fill", (d, i) => { return this._fill(i); })
                    .style("stroke", (d, i) => { return this._fill(i); })
                    .attr("d", d3.svg.arc().innerRadius(this._innerRadius).outerRadius(this._outterRadius))
                    .on("mouseover", fade(.1))
                    .on("mouseout", fade(1));
                var ticks = this._lens_circle_svg.append("g").selectAll("g")
                    .data(this._chord.groups)
                    .enter().append("g").selectAll("g")
                    .data(groupTicks)
                    .enter().append("g")
                    .attr("transform", (d) => {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                        + "translate(" + this._outterRadius + ",0)";
                });
                ticks.append("line")
                    .attr("x1", 1)
                    .attr("y1", 0)
                    .attr("x2", 5)
                    .attr("y2", 0)
                    .style("stroke", "#000");
                ticks.append("text")
                    .attr("x", 8)
                    .attr("dy", ".35em")
                    .attr("transform", function (d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
                    .style("text-anchor", function (d) { return d.angle > Math.PI ? "end" : null; })
                    .text(function (d) { return d.label; });
                this._lens_circle_svg.append("g")
                    .attr("class", "chord")
                    .selectAll("path")
                    .data(this._chord.chords)
                    .enter().append("path")
                    .attr("d", d3.svg.chord().radius(this._innerRadius))
                    .style("fill", (d) => { return this._fill(d.target.index); })
                    .style("opacity", 1)
                    .style("fill-opacity", 0.67)
                    .style("stroke", "#000")
                    .style("stroke-width", ".5px");
                function groupTicks(d) {
                    var k = (d.endAngle - d.startAngle) / d.value;
                    return d3.range(0, d.value, 1000).map(function (v, i) {
                        return {
                            angle: v * k + d.startAngle,
                            label: i % 5 ? null : v / 1000 + "k"
                        };
                    });
                }
                function fade(opacity) {
                    return function (g, i) {
                        svg.selectAll(".chord path")
                            .filter(function (d) { return d.source.index != i && d.target.index != i; })
                            .transition()
                            .style("opacity", opacity);
                    };
                }
            }
        }
        cChordDiagramLens.Type = "cChordDiagramLens";
        Lens.cChordDiagramLens = cChordDiagramLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cPieChartLens extends BaseCompositeLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cPieChartLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.quantize();
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie
                    .value((d) => {
                    return d.host;
                })
                    .startAngle((d, i) => {
                    console.log(d, i);
                    return 0;
                })
                    .padAngle((d, i) => {
                    console.log(d, i);
                    return 0;
                })
                    .sort(null);
                this._arc
                    .innerRadius((d) => {
                    return this._lens_circle_radius - 20;
                })
                    .outerRadius((d) => {
                    return this._lens_circle_radius;
                });
                this._color
                    .range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                    // "rgb(8, 81, 156)"
                    // "rgb(8, 48, 107)"
                ]);
            }
            Render(color = "pupple") {
                super.Render(color);
            }
            AfterExtractData() {
            }
            DisplayLens() {
                super.DisplayLens();
                this._lens_circle_svg.selectAll(".innerPie")
                    .data(this._pie(this._base_accessor_func.Extract(this._data)))
                    .enter().append("path")
                    .attr("d", this._arc)
                    .style("fill", (d, i) => {
                    return this._color(i);
                })
                    .style("fill-rule", "evenodd");
                this._arc.innerRadius(this._lens_circle_radius)
                    .outerRadius(this._lens_circle_radius + 20)
                    .endAngle(function (d, i) {
                    return d.startAngle + (d.endAngle - d.startAngle) * (d.data.sub / d.value);
                });
                this._lens_circle_svg.selectAll(".outerPie")
                    .data(this._pie(this._sub_accessor_func.Extract(this._data)))
                    .enter().append("path")
                    .attr("fill", (d, i) => {
                    return this._color(i);
                })
                    .attr("d", this._arc);
            }
        }
        cPieChartLens.Type = "cPieChartLens";
        Lens.cPieChartLens = cPieChartLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cSunBrustLens extends BaseCompositeLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cSunBrustLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.category10();
                this._luminance = d3.scale.sqrt();
                this._partition = d3.layout.partition();
                this._arc = d3.svg.arc();
                this._luminance
                    .domain([0, 1e6])
                    .clamp(true)
                    .range([90, 20]);
                this._partition
                    .sort(function (a, b) { return d3.ascending(a.name, b.name); })
                    .size([2 * Math.PI, this._lens_circle_radius]);
                this._arc
                    .startAngle(function (d) { return d.x; })
                    .endAngle(function (d) { return d.x + d.dx - .01 / (d.depth + .5); })
                    .innerRadius((d) => { return this._lens_circle_radius / 3 * d.depth; })
                    .outerRadius((d) => { return this._lens_circle_radius / 3 * (d.depth + 1) - 1; });
            }
            Render() {
                super.Render("yellow");
            }
            ExtractData() {
                var data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "query",
                            "children": [
                                { "name": "AggregateExpression", "size": 1616 },
                                { "name": "And", "size": 1027 },
                                { "name": "Arithmetic", "size": 3891 },
                                { "name": "Average", "size": 891 },
                                { "name": "BinaryExpression", "size": 2893 },
                                { "name": "Comparison", "size": 5103 },
                                { "name": "CompositeExpression", "size": 3677 },
                                { "name": "Count", "size": 781 },
                                { "name": "DateUtil", "size": 4141 },
                                {
                                    "name": "methods",
                                    "children": [
                                        { "name": "add", "size": 593 },
                                        { "name": "and", "size": 330 },
                                        { "name": "average", "size": 287 },
                                        { "name": "count", "size": 277 },
                                        { "name": "distinct", "size": 292 },
                                        { "name": "div", "size": 595 },
                                        { "name": "eq", "size": 594 },
                                        { "name": "fn", "size": 460 },
                                        { "name": "gt", "size": 603 },
                                        { "name": "gte", "size": 625 },
                                        { "name": "iff", "size": 748 },
                                        { "name": "isa", "size": 461 },
                                        { "name": "lt", "size": 597 },
                                        { "name": "lte", "size": 619 },
                                        { "name": "max", "size": 283 },
                                        { "name": "min", "size": 283 },
                                        { "name": "mod", "size": 591 },
                                        { "name": "mul", "size": 603 },
                                        { "name": "neq", "size": 599 },
                                        { "name": "not", "size": 386 },
                                        { "name": "or", "size": 323 },
                                        { "name": "orderby", "size": 307 },
                                        { "name": "range", "size": 772 },
                                        { "name": "select", "size": 296 },
                                        { "name": "stddev", "size": 363 },
                                        { "name": "sub", "size": 600 },
                                        { "name": "sum", "size": 280 },
                                        { "name": "update", "size": 307 },
                                        { "name": "variance", "size": 335 },
                                        { "name": "where", "size": 299 },
                                        { "name": "xor", "size": 354 },
                                        { "name": "_", "size": 264 }
                                    ]
                                },
                                { "name": "Minimum", "size": 843 },
                                { "name": "Not", "size": 1554 },
                                { "name": "Or", "size": 970 },
                                { "name": "Query", "size": 13896 },
                                { "name": "Range", "size": 1594 },
                            ]
                        },
                        {
                            "name": "scale",
                            "children": [
                                { "name": "IScaleMap", "size": 2105 },
                                { "name": "LinearScale", "size": 1316 },
                                { "name": "LogScale", "size": 3151 },
                            ]
                        },
                        {
                            "name": "util",
                            "children": [
                                { "name": "Arrays", "size": 8258 },
                                { "name": "IEvaluable", "size": 335 },
                                { "name": "IPredicate", "size": 383 },
                                { "name": "IValueProxy", "size": 874 },
                                {
                                    "name": "math",
                                    "children": [
                                        { "name": "DenseMatrix", "size": 3165 },
                                        { "name": "IMatrix", "size": 2815 },
                                        { "name": "SparseMatrix", "size": 3366 }
                                    ]
                                },
                                { "name": "Maths", "size": 17705 },
                                { "name": "Orientation", "size": 1486 },
                                {
                                    "name": "palette",
                                    "children": [
                                        { "name": "ColorPalette", "size": 6367 },
                                        { "name": "Palette", "size": 1229 },
                                        { "name": "ShapePalette", "size": 2059 },
                                        { "name": "SizePalette", "size": 2291 }
                                    ]
                                },
                                { "name": "Property", "size": 5559 },
                                { "name": "Shapes", "size": 19118 },
                                { "name": "Sort", "size": 6887 },
                                { "name": "Stats", "size": 6557 },
                                { "name": "Strings", "size": 22026 }
                            ]
                        },
                        {
                            "name": "vis",
                            "children": [
                                {
                                    "name": "axis",
                                    "children": [
                                        { "name": "Axes", "size": 1302 },
                                        { "name": "Axis", "size": 24593 },
                                        { "name": "AxisGridLine", "size": 652 },
                                        { "name": "AxisLabel", "size": 636 },
                                        { "name": "CartesianAxes", "size": 6703 }
                                    ]
                                },
                                {
                                    "name": "controls",
                                    "children": [
                                        { "name": "AnchorControl", "size": 2138 },
                                        { "name": "ClickControl", "size": 3824 },
                                        { "name": "Control", "size": 1353 },
                                        { "name": "ControlList", "size": 4665 },
                                        { "name": "DragControl", "size": 2649 },
                                        { "name": "ExpandControl", "size": 2832 },
                                        { "name": "HoverControl", "size": 4896 },
                                        { "name": "IControl", "size": 763 },
                                        { "name": "PanZoomControl", "size": 5222 },
                                        { "name": "SelectionControl", "size": 7862 },
                                        { "name": "TooltipControl", "size": 8435 }
                                    ]
                                },
                                {
                                    "name": "data",
                                    "children": [
                                        { "name": "Data", "size": 20544 },
                                        { "name": "DataList", "size": 19788 },
                                        { "name": "DataSprite", "size": 10349 },
                                        { "name": "EdgeSprite", "size": 3301 },
                                        { "name": "NodeSprite", "size": 19382 },
                                        {
                                            "name": "render",
                                            "children": [
                                                { "name": "ArrowType", "size": 698 },
                                                { "name": "EdgeRenderer", "size": 5569 },
                                                { "name": "IRenderer", "size": 353 },
                                                { "name": "ShapeRenderer", "size": 2247 }
                                            ]
                                        },
                                        { "name": "ScaleBinding", "size": 11275 },
                                        { "name": "Tree", "size": 7147 },
                                        { "name": "TreeBuilder", "size": 9930 }
                                    ]
                                },
                                { "name": "Visualization", "size": 16540 }
                            ]
                        }
                    ]
                };
                return data;
            }
            DisplayLens() {
                super.DisplayLens();
                var data = this.ExtractData();
                var svg = this._lens_circle_svg;
                var partition = this._partition;
                var hue = this._color;
                var luminance = this._luminance;
                var arc = this._arc;
                this._partition
                    .value(function (d) { return d.size; })
                    .children(function (d) { return d.children; })
                    .nodes(data)
                    .forEach(function (d) {
                    d._children = d.children;
                    //d['sum'] = d.value;
                    d['key'] = key(d);
                    d['fill'] = fill(d);
                });
                // Now redefine the value function to use the previously-computed sum.
                this._partition
                    .children(function (d, depth) { return depth < 2 ? d._children : null; })
                    .value(function (d) { return d.value; });
                var center = svg.append("circle")
                    .attr("r", this._lens_circle_radius / 3)
                    .style("fill", "#fff")
                    .on("click", zoomOut);
                center.append("title")
                    .text("zoom out");
                var path = svg.selectAll("path")
                    .data(this._partition.nodes(data).slice(1))
                    .enter().append("path")
                    .attr("d", this._arc)
                    .style("fill", function (d) { return d.fill; })
                    .each(function (d) { this._current = updateArc(d); })
                    .on("click", zoomIn);
                console.log("where is it?");
                function zoomIn(p) {
                    if (p.depth > 1)
                        p = p.parent;
                    if (!p.children)
                        return;
                    zoom(p, p);
                }
                function zoomOut(p) {
                    if (!p.parent)
                        return;
                    zoom(p.parent, p);
                }
                // Zoom to the specified new root.
                function zoom(root, p) {
                    if (document.documentElement['__transition__'])
                        return;
                    // Rescale outside angles to match the new layout.
                    var enterArc, exitArc, outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]).range([p.x, p.x + p.dx]);
                    function insideArc(d) {
                        return p.key > d.key
                            ? { depth: d.depth - 1, x: 0, dx: 0 } : p.key < d.key
                            ? { depth: d.depth - 1, x: 2 * Math.PI, dx: 0 }
                            : { depth: 0, x: 0, dx: 2 * Math.PI };
                    }
                    function outsideArc(d) {
                        return {
                            depth: d.depth + 1,
                            x: outsideAngle(d.x),
                            dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)
                        };
                    }
                    center.datum(root);
                    // When zooming in, arcs enter from the outside and exit to the inside.
                    // Entering outside arcs start from the old layout.
                    if (root === p)
                        enterArc = outsideArc, exitArc = insideArc;
                    // When zooming out, arcs enter from the inside and exit to the outside.
                    // Exiting outside arcs transition to the new layout.
                    if (root !== p)
                        enterArc = insideArc, exitArc = outsideArc;
                    path = path.data(partition.nodes(root).slice(1), function (d) { return d.key; });
                    d3.transition()
                        .duration(d3.event.altKey ? 7500 : 750)
                        .each(function () {
                        path.exit().transition()
                            .style("fill-opacity", function (d) {
                            return +(d.depth === 1 + ((root === p) ? 1 : 0));
                        })
                            .attrTween("d", function (d) {
                            return arcTween.call(this, exitArc(d));
                        })
                            .remove();
                        path.enter().append("path")
                            .style("fill-opacity", function (d) {
                            return +(d.depth === (2 - ((root === p) ? 1 : 0)));
                        })
                            .style("fill", function (d) { return d.fill; })
                            .on("click", zoomIn)
                            .each(function (d) {
                            this._current = enterArc(d);
                        });
                        path.transition()
                            .style("fill-opacity", 1)
                            .attrTween("d", function (d) {
                            return arcTween.call(this, updateArc(d));
                        });
                    });
                }
                function key(d) {
                    var k = [], p = d;
                    while (p.depth)
                        k.push(p.name), p = p.parent;
                    return k.reverse().join(".");
                }
                function fill(d) {
                    var p = d;
                    while (p.depth > 1)
                        p = p.parent;
                    var c = d3.lab(hue(p.name));
                    c.l = luminance(d.value);
                    return c;
                }
                function arcTween(b) {
                    var i = d3.interpolate(this._current, b);
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }
                function updateArc(d) {
                    return { depth: d.depth, x: d.x, dx: d.dx };
                }
            }
        }
        //TODO need to refine this lens
        cSunBrustLens.Type = "cSunBrustLens";
        Lens.cSunBrustLens = cSunBrustLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseHackLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cTreeNetworkLens extends BaseHackLens {
            constructor(element, attributeName, manyLens) {
                super(element, attributeName, Lens.MapLens.Type, manyLens);
                this._theta = 360;
                this._tree = d3.layout.tree();
            }
            Render(color = "red") {
                super.Render(color);
            }
            ExtractData() {
                var data = {
                    "name": "root",
                    "children": [
                        { "name": "test",
                            "children": [
                                {
                                    "name": "cluster",
                                    "children": [
                                        { "name": "AgglomerativeCluster", "size": 3938 },
                                        { "name": "CommunityStructure", "size": 3812 },
                                        { "name": "HierarchicalCluster", "size": 6714 },
                                        { "name": "MergeEdge", "size": 743 }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "analytics",
                            "children": [
                                {
                                    "name": "cluster",
                                    "children": [
                                        { "name": "AgglomerativeCluster", "size": 3938 },
                                        { "name": "CommunityStructure", "size": 3812 },
                                        { "name": "HierarchicalCluster", "size": 6714 },
                                        { "name": "MergeEdge", "size": 743 }
                                    ]
                                },
                                {
                                    "name": "graph",
                                    "children": [
                                        { "name": "BetweennessCentrality", "size": 3534 },
                                        { "name": "LinkDistance", "size": 5731 },
                                        { "name": "MaxFlowMinCut", "size": 7840 },
                                        { "name": "ShortestPaths", "size": 5914 },
                                        { "name": "SpanningTree", "size": 3416 }
                                    ]
                                },
                                {
                                    "name": "optimization",
                                    "children": [
                                        { "name": "AspectRatioBanker", "size": 7074 }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                this._data = data;
                this.DisplayLens();
            }
            DisplayLens() {
                super.DisplayLens();
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial()
                    .projection(function (d) { return [d.y, d.x / 180 * Math.PI]; });
                this._tree
                    .size([this._theta, this._lens_circle_radius - nodeRadius])
                    .separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(this._data), links = this._tree.links(nodes);
                var link = this._lens_circle_svg.selectAll("path")
                    .data(links)
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1.5)
                    .attr("d", diagonal);
                var node = this._lens_circle_svg.selectAll(".node")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });
                node.append("circle")
                    .attr("r", nodeRadius)
                    .attr("stroke", "steelblue")
                    .attr("fill", "#fff")
                    .attr("stroke-width", 1.5);
            }
        }
        cTreeNetworkLens.Type = "cTreeNetworkLens";
        Lens.cTreeNetworkLens = cTreeNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cWordCloudLens extends BaseCompositeLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cWordCloudLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * Math.SQRT2; //Math.sqrt(2);
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 1;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._cloud_text_color = d3.scale.category20c();
            }
            Render(color = "red") {
                super.Render(color);
            }
            // data shape {text: size:}
            AfterExtractData() {
                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(this._base_accessor_func.Extract(this._data), (d) => {
                    return d.Value;
                }));
            }
            DisplayLens() {
                super.DisplayLens();
                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._base_accessor_func.Extract(this._data))
                    .filter((d) => {
                    if (d.Value > 3)
                        return true;
                    return false;
                })
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.Value); })
                    .on("end", (words, bounds) => {
                    this.DrawCloud(words, bounds);
                });
                this._cloud.start();
            }
            DrawCloud(words, bounds) {
                var w = this._cloud_w;
                var h = this._cloud_h;
                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text");
                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font; })
                    .style("fill", (d, i) => { return this._cloud_text_color(d.size); })
                    .style("opacity", 1e-6)
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                    .text(function (d) { return d.text; })
                    .transition().duration(200)
                    .style("opacity", 1);
            }
        }
        cWordCloudLens.Type = "cWordCloudLens";
        Lens.cWordCloudLens = cWordCloudLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cWordCloudNetworkLens extends BaseCompositeLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cWordCloudNetworkLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2; //Math.SQRT2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 0;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._innerRadius = this._lens_circle_radius - 2;
                this._outterRadius = this._lens_circle_radius + 20;
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._chord = d3.layout.chord();
                this._color = d3.scale.category10();
                this._arc
                    .innerRadius(this._innerRadius)
                    .outerRadius(this._outterRadius);
                this._pie
                    .value((d) => {
                    return d;
                })
                    .sort(null)
                    .startAngle(-Math.PI * 8 / 3)
                    .endAngle(-Math.PI * 2 / 3);
                this._chord
                    .padding(.05)
                    .sortSubgroups(d3.descending);
            }
            Render(color = "red") {
                super.Render(color);
            }
            AfterExtractData() {
                //data.forEach(function (d,i) {
                //    d["group"] = (i%3)+1;//Math.ceil(Math.random()*3);
                //});
                //this._font_size
                //    .range([10, this._cloud_w / 8])
                //    .domain(d3.extent(data, function (d) { return d.Value; }))
                //;
                //return data;
            }
            DisplayLens() {
                super.DisplayLens();
                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._base_accessor_func.Extract(this._data))
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.value); })
                    .on("end", (words, bound) => {
                    this.DrawCloud(words, bound);
                });
                this._cloud.start();
                //var groups = [];
                //for (var i = 0, len = data.length; i < len; ++i) {
                //    if (groups[parseInt(data[i]['group']) - 1] != null) {
                //        var group = parseInt(data[i]['group']);
                //        groups[group - 1]++;
                //    }
                //    else {
                //        groups[parseInt(data[i]['group']) - 1] = 0;
                //    }
                //}
                this._chord.matrix([
                    [2000, 2300, 2100],
                    [1951, 2100, 2000],
                    [2300, 2200, 2100]
                ]);
                this._lens_circle_svg.selectAll("path")
                    .data(this._chord.groups)
                    .enter().append("path")
                    .attr("fill", (d, i) => {
                    return this._color(i + 1);
                })
                    .attr("d", this._arc);
                this._lens_circle_svg.append("g")
                    .attr("class", "chord")
                    .selectAll("path")
                    .data(this._chord.chords)
                    .enter().append("path")
                    .attr("d", d3.svg.chord().radius(this._innerRadius))
                    .style("fill", (d, i) => { return this._color(i + 1); })
                    .style("opacity", 0.9)
                    .style("fill-opacity", 0.15);
            }
            DrawCloud(words, bounds) {
                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text");
                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font; })
                    .style("fill", (d, i) => { return this._color(d.group); })
                    .style("opacity", 1e-6)
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                    .text(function (d) { return d.text; })
                    .transition().duration(200)
                    .style("opacity", 1);
            }
        }
        cWordCloudNetworkLens.Type = "cWordCloudNetworkLens";
        Lens.cWordCloudNetworkLens = cWordCloudNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cWordCloudPieLens extends BaseCompositeLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cWordCloudPieLens.Type, manyLens, firstLens, secondLens);
                this._color = d3.scale.quantize();
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * Math.SQRT2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 1;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie_innerRadius = this._lens_circle_radius;
                this._pie_outterRadius = this._lens_circle_radius + 20;
                this._cloud_text_color = d3.scale.category10();
                this._pie
                    .value((d) => {
                    return d.Value;
                })
                    .sort(null);
                this._arc
                    .innerRadius(this._pie_innerRadius)
                    .outerRadius(this._pie_outterRadius);
                this._color
                    .range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                    // "rgb(8, 81, 156)"
                    // "rgb(8, 48, 107)"
                ]);
                //this._manyLens.ManyLensHubRegisterClientFunction(this, "hightLightWordsOfTweetsAtLengthOf", this.HightLightWordsOfTweetsAtLengthOf);
            }
            Render(color = "red") {
                super.Render(color);
            }
            AfterExtractData() {
                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(this._base_accessor_func.Extract(this._data), (d) => {
                    return d.Value;
                }));
                this._color.domain(d3.extent(this._sub_accessor_func.Extract(this._data), function (d) { return d['Value']; }));
            }
            DisplayLens() {
                super.DisplayLens();
                this._lens_circle.style({
                    "stroke": null,
                    "stroke-width": null
                });
                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._base_accessor_func.Extract(this._data))
                    .filter((d) => {
                    if (d.Value > 3)
                        return true;
                    return false;
                })
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.Value); })
                    .on("end", (words, bounds) => {
                    this.DrawCloud(words, bounds);
                });
                this._cloud.start();
                this._lens_circle_svg.selectAll(".outterPie")
                    .data(this._pie(this._sub_accessor_func.Extract(this._data)))
                    .enter().append("path")
                    .attr("class", "outterPie")
                    .style("fill", (d) => {
                    return this._color(d.value) || "rgb(158,202,225)";
                })
                    .on("mouseover", (d) => {
                    this._manyLens.ManyLensHubServercWordCloudPieLens(this.ID, d.data.Key, this._base_accessor_func.TargetAttribute, this._sub_accessor_func.TargetAttribute);
                    this.ShowLabel(d);
                })
                    .on("mouseout", (d) => {
                    this._lens_circle_svg.selectAll("text.wordCloudText")
                        .transition()
                        .style("opacity", 1);
                    this.ShowLabel(null);
                });
                this._lens_circle_svg.selectAll(".outterPie")
                    .attr("d", (d) => {
                    return d3.svg.arc().innerRadius(0).outerRadius(this._pie_outterRadius);
                })
                    .transition().duration(300)
                    .attr("d", this._arc);
            }
            HightLightWordsOfTweetsAtLengthOf(words) {
                this._lens_circle_svg.selectAll("text.wordCloudText")
                    .transition()
                    .style("opacity", function (p) {
                    if (words.indexOf(p.text) == -1)
                        return 0.1;
                });
            }
            DrawCloud(words, bounds) {
                var w = this._cloud_w;
                var h = this._cloud_h;
                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(w / Math.abs(bounds[1].x - w / 2), w / Math.abs(bounds[0].x - w / 2), h / Math.abs(bounds[1].y - h / 2), h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text");
                text.attr("text-anchor", "middle")
                    .attr("class", "wordCloudText")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font; })
                    .style("fill", (d) => { return this._cloud_text_color(d.Key); })
                    .style("opacity", 1e-6)
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                    .text(function (d) { return d.text; })
                    .transition().duration(200)
                    .style("opacity", 1);
            }
            ShowLabel(d) {
                if (d) {
                    this._lens_circle_svg.selectAll("text.mylabel")
                        .data([d])
                        .enter().append("text")
                        .attr("class", "mylabel")
                        .attr("text-anchor", "middle")
                        .attr("x", (d) => {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cx = Math.cos(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                        return d.x = Math.cos(a) * (this._pie_outterRadius + 40);
                    })
                        .attr("y", (d) => {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cy = Math.sin(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                        return d.y = Math.sin(a) * (this._pie_outterRadius + 40);
                    })
                        .text(function (d) { return d.data.Key; })
                        .each(function (d) {
                        var bbox = this.getBBox();
                        d.sx = d.x - bbox.width / 2 - 2;
                        d.ox = d.x + bbox.width / 2 + 2;
                        d.sy = d.oy = d.y + 5;
                    });
                    this._lens_circle_svg.selectAll("path.mylabel")
                        .data([d])
                        .enter().append("path")
                        .attr("class", "mylabel")
                        .style("fill", "none")
                        .style("stroke", "black")
                        .attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                        }
                    })
                        .transition().duration(200)
                        .attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                        }
                    });
                }
                else {
                    this._lens_circle_svg.selectAll(".mylabel").remove();
                }
            }
        }
        cWordCloudPieLens.Type = "cWordCloudPieLens";
        Lens.cWordCloudPieLens = cWordCloudPieLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./BaseCompositeLens.ts" />
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cBaseMapLens extends BaseCompositeLens {
            constructor(element, type, manyLens, firstLens, secondLens) {
                super(element, type, manyLens, firstLens, secondLens);
                this._projection = d3.geo.albersUsa();
                this._path = d3.geo.path();
                this._color = d3.scale.quantize();
                var mapLens;
                if (secondLens) {
                    mapLens = (firstLens.Type == "MapLens" ? firstLens : secondLens);
                }
                else {
                    mapLens = (firstLens);
                }
                this._projection = mapLens.Projection;
                this._path = mapLens.Path;
                this._color = mapLens.Color;
                this._map_data = mapLens.MapData;
            }
            get Projection() {
                return this._projection;
            }
            get Path() {
                return this._path;
            }
            get Color() {
                return this._color;
            }
            get MapData() {
                return this._map_data;
            }
            Render(color = "red") {
                super.Render(color);
            }
            AfterExtractData() {
                var data = {};
                this._color.domain(d3.extent(this._base_accessor_func.Extract(this._data), function (d) { return d['Value']; }));
                this._base_accessor_func.Extract(this._data).forEach((d) => {
                    data[d.Key] = d.Value;
                });
                this._base_accessor_func.Extract(this._data, data);
            }
            DisplayLens() {
                super.DisplayLens();
                this._lens_circle_svg.append("g")
                    .attr("id", "states")
                    .selectAll("path")
                    .data(topojson.feature(this._map_data.raw, this._map_data.raw.objects.countries).features)
                    .enter().append("path")
                    .attr("d", this._path)
                    .attr("fill", (d, i) => {
                    return this._color(this._base_accessor_func.Extract(this._data)[d.id] || 0);
                })
                    .on("click", (d) => {
                    if (!d3.event.defaultPrevented)
                        this.ClickedMap(d);
                });
                this._lens_circle_svg.append("g")
                    .attr("id", "state-borders")
                    .append("path")
                    .datum(topojson.mesh(this._map_data.raw, this._map_data.raw.objects.countries, function (a, b) { return a !== b; }))
                    .attr("d", this._path);
            }
            ClickedMap(d) {
                if (d3.event.defaultPrevented)
                    return;
                var x, y, k;
                if (d && this._centered_state !== d) {
                    var centroid = this._path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 4;
                    this._centered_state = d;
                    this._lens_circle_zoom.on("zoom", null);
                    this._lens_circle_drag
                        .on("dragstart", null)
                        .on("drag", null)
                        .on("dragend", null);
                    this._element.on("click", () => {
                        this.ClickedMap(this._centered_state);
                    });
                }
                else {
                    x = 0;
                    y = 0;
                    k = this._lens_circle_scale;
                    this._centered_state = null;
                    this._lens_circle_drag
                        .on("dragstart", () => {
                        this.LensCircleDragstartFunc();
                    })
                        .on("drag", () => {
                        this.LensCircleDragFunc();
                    })
                        .on("dragend", () => {
                        this.LensCircleDragendFunc();
                    });
                    this._lens_circle_zoom
                        .scale(this._lens_circle_scale)
                        .on("zoom", () => {
                        this.LensCircleZoomFunc();
                    });
                    this._element.on("click", null);
                }
                this._lens_circle_svg.selectAll("path")
                    .classed("active", this._centered_state && ((d) => {
                    return d === this._centered_state;
                }));
                this._lens_circle_svg.transition()
                    .duration(750)
                    .attr("transform", (d) => {
                    return "translate(" + this._lens_circle_cx + "," + this._lens_circle_cy + ")scale(" + k + ")translate(" + [-x, -y] + ")";
                })
                    .style("stroke-width", 1.5 / k + "px");
                d3.event.stopPropagation();
            }
        }
        cBaseMapLens.Type = "cBaseMapLens";
        Lens.cBaseMapLens = cBaseMapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cMapPieLens extends Lens.cBaseMapLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cMapPieLens.Type, manyLens, firstLens, secondLens);
                this._pie = d3.layout.pie();
                this._arc = d3.svg.arc();
                this._pie_color = d3.scale.quantize();
                this._pie_innerRadius = this._lens_circle_radius;
                this._pie_outterRadius = this._lens_circle_radius + 20;
                this._pie
                    .value((d) => {
                    return d.Value;
                })
                    .sort(null);
                this._pie_color
                    .range([
                    "rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)"
                    // "rgb(8, 81, 156)"
                    // "rgb(8, 48, 107)"
                ]);
                this._arc
                    .innerRadius(this._pie_innerRadius)
                    .outerRadius(this._pie_outterRadius);
            }
            Render(color = "red") {
                super.Render(color);
            }
            AfterExtractData() {
                super.AfterExtractData();
                this._pie_color.domain(d3.extent(this._sub_accessor_func.Extract(this._data), function (d) { return d['Value']; }));
            }
            DisplayLens() {
                super.DisplayLens();
                this._lens_circle.style({
                    "stroke": null,
                    "stroke-width": null
                });
                this._lens_circle_svg.selectAll(".outterPie")
                    .data(this._pie(this._sub_accessor_func.Extract(this._data)))
                    .enter().append("path")
                    .attr("class", "outterPie")
                    .attr("d", this._arc)
                    .style("fill", (d, i) => {
                    return this._pie_color(d.value) || "rgb(158,202,225)";
                })
                    .on("mouseover", (d) => {
                    this._manyLens.ManyLensHubServercMapPieLens(this.ID, d.data.Key, this._base_accessor_func.TargetAttribute, this._sub_accessor_func.TargetAttribute);
                    this.ShowLabel(d);
                })
                    .on("mouseout", (d) => {
                    this.ShowLabel(null);
                });
            }
            ShowLabel(d) {
                if (d) {
                    this._lens_circle_svg.selectAll("text.mylabel")
                        .data([d])
                        .enter().append("text")
                        .attr("class", "mylabel")
                        .attr("text-anchor", "middle")
                        .attr("x", (d) => {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cx = Math.cos(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                        return d.x = Math.cos(a) * (this._pie_outterRadius + 40);
                    })
                        .attr("y", (d) => {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        d.cy = Math.sin(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                        return d.y = Math.sin(a) * (this._pie_outterRadius + 40);
                    })
                        .text(function (d) { return d.data.Key; })
                        .each(function (d) {
                        var bbox = this.getBBox();
                        d.sx = d.x - bbox.width / 2 - 2;
                        d.ox = d.x + bbox.width / 2 + 2;
                        d.sy = d.oy = d.y + 5;
                    });
                    this._lens_circle_svg.selectAll("path.mylabel")
                        .data([d])
                        .enter().append("path")
                        .attr("class", "mylabel")
                        .style("fill", "none")
                        .style("stroke", "black")
                        .attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                        }
                    })
                        .transition().duration(200)
                        .attr("d", function (d) {
                        if (d.cx > d.ox) {
                            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                        }
                        else {
                            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                        }
                    });
                }
                else {
                    this._lens_circle_svg.selectAll(".mylabel").remove();
                }
            }
            HightLightCountry(countryName) {
                console.log(countryName);
            }
        }
        cMapPieLens.Type = "cMapBarLens";
        Lens.cMapPieLens = cMapPieLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cMapLens extends Lens.cBaseMapLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cMapLens.Type, manyLens, firstLens, secondLens);
            }
            Render(color = "red") {
                super.Render(color);
            }
            DisplayLens() {
                super.DisplayLens();
            }
        }
        cMapLens.Type = "cMapLens";
        Lens.cMapLens = cMapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cMapNetworkLens extends Lens.cBaseMapLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cMapNetworkLens.Type, manyLens, firstLens, secondLens);
                this._link = d3.svg.diagonal();
                this._link
                    .source((d) => {
                    var t = this._projection(d.coordinates[0]);
                    return {
                        x: t[0],
                        y: t[1]
                    };
                })
                    .target((d) => {
                    var t = this._projection(d.coordinates[1]);
                    return {
                        x: t[0],
                        y: t[1]
                    };
                });
            }
            Render(color = "red") {
                super.Render(color);
            }
            AfterExtractData() {
                this._sub_accessor_func.Extract(this._data).nodes.forEach((d) => {
                    var p = this._projection([d.x, d.y]);
                    d.x = p[0];
                    d.y = p[1];
                });
            }
            //// data shape {text: size:}
            //protected ExtractData(): any {
            //    var data = [
            //        [38.991621, -76.852587],
            //        [28.524963, -80.650813],
            //        [34.200463, -118.176008],
            //        [34.613714, -118.076790],
            //        [41.415891, -81.861774],
            //        [34.646554, -86.674368],
            //        [37.409574, -122.064292],
            //        [37.092123, -76.376230],
            //        [29.551508, -95.092256],
            //        [30.363692, -89.600036]
            //    ];
            //    var links = [];
            //    for (var i = 0, len = data.length + 5; i < len; i++) {
            //        if (i >= data.length - 1) {
            //            var index = Math.ceil(Math.random() * (data.length - 1));
            //            var nextIndex = Math.ceil(Math.random() * (data.length - 1));
            //            links.push({
            //                type: "LineString",
            //                coordinates: [
            //                    [data[index][1], data[index][0]],
            //                    [data[nextIndex][1], data[nextIndex][0]]
            //                ]
            //            });
            //        }
            //        else {
            //            links.push({
            //                type: "LineString",
            //                coordinates: [
            //                    [data[i][1], data[i][0]],
            //                    [data[i + 1][1], data[i + 1][0]]
            //                ]
            //            });
            //        }
            //    }
            //    return links;
            //}
            DisplayLens() {
                super.DisplayLens();
                var networkG = this._lens_circle_svg.append("g")
                    .attr("id", "network");
                var pathArcs = networkG
                    .selectAll(".cMapPath")
                    .data(this._sub_accessor_func.Extract(this._data).links);
                pathArcs.enter()
                    .append("path")
                    .attr("class", "cMapPath")
                    .style({
                    "fill": "none"
                });
                var networkNode = networkG
                    .selectAll(".cMapNode")
                    .data(this._sub_accessor_func.Extract(this._data).nodes).enter()
                    .append("circle")
                    .attr("class", "cMapNode")
                    .attr("cx", (d) => {
                    return d.x;
                })
                    .attr("cy", (d) => {
                    return d.y;
                })
                    .attr("r", 4)
                    .style({
                    "stroke": "steelblue",
                    "fill": "#fff",
                    "stroke-width": 1.5
                });
                //update
                pathArcs
                    .attr('d', (d) => {
                    return this._link(d);
                })
                    .attr("stroke-dasharray", function (d) {
                    var totalLen = d3.select(this).node().getTotalLength();
                    return totalLen + "," + totalLen;
                })
                    .attr("stroke-dashoffset", function (d) {
                    var totalLen = d3.select(this).node().getTotalLength();
                    return totalLen;
                })
                    .style({
                    "stroke": "#d73027",
                    "stroke-width": "1.2px"
                })
                    .transition()
                    .duration(2000)
                    .attr("stroke-dashoffset", 0);
                ;
                //exit
                pathArcs.exit().remove();
            }
        }
        cMapNetworkLens.Type = "cMapNetworkLens";
        Lens.cMapNetworkLens = cMapNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./cBaseMapLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class cMapWordCloudLens extends Lens.cBaseMapLens {
            constructor(element, manyLens, firstLens, secondLens) {
                super(element, cMapWordCloudLens.Type, manyLens, firstLens, secondLens);
                this._font_size = d3.scale.sqrt();
                this._cloud = d3.layout.cloud();
                this._cloud_w = this._lens_circle_radius * 2; //Math.SQRT2;
                this._cloud_h = this._cloud_w;
                this._cloud_padding = 0;
                this._cloud_font = "Calibri";
                this._cloud_font_weight = "normal";
                this._text_color = d3.scale.ordinal()
                    .domain([1, 2])
                    .range(["#d62728", "#ff7f0e"]);
            }
            Render(color = "red") {
                super.Render(color);
            }
            DisplayLens() {
                super.DisplayLens();
                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._sub_accessor_func.Extract(this._data))
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.value); })
                    .on("end", (words, bound) => {
                    this.DrawCloud(words, bound);
                });
                this._cloud.start();
            }
            DrawCloud(words, bounds) {
                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text");
                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font; })
                    .style("fill", (d, i) => { return this._text_color(d.group); })
                    .style("opacity", 1e-6)
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")";
                })
                    .text(function (d) { return d.text; })
                    .transition().duration(200)
                    .style("opacity", 1);
            }
        }
        cMapWordCloudLens.Type = "cMapWordCloudLens";
        Lens.cMapWordCloudLens = cMapWordCloudLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
/*--------------- Single Lens  ----------------*/
///<reference path = "../Lens/BarChartLens.ts" />
///<reference path = "../Lens/MapLens.ts" />
///<reference path = "../Lens/NetworkLens.ts" />
///<reference path = "../Lens/PieChartLens.ts" />
///<reference path = "../Lens/TreeNetworkLens.ts"  />
///<reference path = "../Lens/WordCloudLens.ts"/>
/*------------ CompositeLens Lens -------------*/
///<reference path = "../Lens/cBoundleLens.ts" />
///<reference path = "../Lens/cChordDiagramLens.ts" />
///<reference path = "../Lens/cPieChartLens.ts" />
///<reference path = "../Lens/cSunBrustLens.ts" />
///<reference path = "../Lens/cTreeNetworkLens.ts" />
///<reference path = "../Lens/cWordCloudLens.ts" />
///<reference path = "../Lens/cWordCloudNetworkLens.ts" />
///<reference path = "../Lens/cWordCloudPieLens.ts" />
///<reference path = "../Lens/cBaseMapLens.ts" />
///<reference path = "../Lens/cMapPieLens.ts" />
///<reference path = "../Lens/cMapLens.ts" />
///<reference path = "../Lens/cMapNetworkLens.ts" />
///<reference path = "../Lens/cMapWordCloudLens.ts" />
(function () {
})();
///<reference path = "./Lens/LensList.ts" />
var ManyLens;
(function (ManyLens) {
    class LensAssemblyFactory {
        //TODO add more laws here
        static CombineLens(element, manyLens, firstLens, secondLens) {
            var t = [firstLens.Type, secondLens.Type]
                .join("_");
            switch (t) {
                /*--------------------------------cBoundle Lens------------------------------*/
                //single + single = composite
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    return new ManyLens.Lens.cBoundleLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cBoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    //  case Lens.cBoundleLens.Type + "_" + Lens.cBoundleLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*--------------------------------cWordCloudNetwork Digram Lens------------------------------*/
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    return new ManyLens.Lens.cWordCloudNetworkLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cWordCloudNetworkLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    // case Lens.cWordCloudNetworkLens.Type + "_" + Lens.cWordCloudNetworkLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*--------------------------------cWordCloudPie Digram Lens------------------------------*/
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.WordCloudLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    return new ManyLens.Lens.cWordCloudPieLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cWordCloudPieLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    //   case Lens.cWordCloudPieLens.Type + "_" + Lens.cWordCloudPieLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*-----------------------------cSunBrust Diagram Lens--------------------------*/
                //single + single = composite
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    return new ManyLens.Lens.cSunBrustLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cSunBrustLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    // case Lens.cSunBrustLens.Type + "_" + Lens.cSunBrustLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*-----------------------------cChord Diagram Lens--------------------------*/
                //single + single = composite
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    return new ManyLens.Lens.cChordDiagramLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cChordDiagramLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    // case Lens.cChordDiagramLens.Type + "_" + Lens.cChordDiagramLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*-----------------------------cMapNetwork Diagram Lens--------------------------*/
                //single + single = composite
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    return new ManyLens.Lens.cMapNetworkLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cMapNetworkLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type: {
                    //  case Lens.cMapNetworkLens.Type + "_" + Lens.cMapNetworkLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*-----------------------------cMapPie Diagram Lens--------------------------*/
                //single + single = composite
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.MapLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    return new ManyLens.Lens.cMapPieLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapPieLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cMapPieLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cMapPieLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cMapPieLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapPieLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    //  case Lens.cMapBarLens.Type + "_" + Lens.cMapBarLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*-----------------------------cMapWordCloud Diagram Lens--------------------------*/
                //single + single = composite
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    return new ManyLens.Lens.cMapWordCloudLens(element, manyLens, firstLens, secondLens);
                }
                //composite + single||composite = composite
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type: {
                    if (firstLens.Type != ManyLens.Lens.cMapWordCloudLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    //    case Lens.cMapWordCloudLens.Type + "_" + Lens.cMapWordCloudLens.Type: {
                    return firstLens.AddComponentLens(secondLens);
                }
                /*----------------------------Single Lens Self Increment---------------------*/
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type: {
                    return new ManyLens.Lens.cWordCloudLens(element, manyLens, firstLens, secondLens);
                }
                //case Lens.NetworkLens.Type + "_" + Lens.NetworkLens.Type: {
                //    return new Lens.cTreeNetworkLens(element,
                //        manyLens,
                //        <Lens.BaseSingleLens>firstLens,
                //        <Lens.BaseSingleLens>secondLens);
                //}
                //just for test now
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.PieChartLens.Type: {
                    return new ManyLens.Lens.cPieChartLens(element, manyLens, firstLens, secondLens);
                }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.MapLens.Type: {
                    return new ManyLens.Lens.cMapLens(element, manyLens, firstLens, secondLens);
                }
                default: {
                    console.log(t);
                    return null;
                }
            }
        }
        static DetachLens(element, hostLens, componentLens, manyLens) {
            var res = hostLens.RemoveComponentLens(componentLens);
            if (res.IsCompositeLens && res.NeedtoReshape) {
                var componentsKind = [];
                var cLens = res;
                cLens.ComponentsKind.forEach((value, key) => {
                    componentsKind.push(key);
                });
                var t = componentsKind.join("_");
                switch (t) {
                    case ManyLens.Lens.WordCloudLens.Type: {
                        return new ManyLens.Lens.cWordCloudLens(element, manyLens, cLens);
                    }
                    //case Lens.NetworkLens.Type: {
                    //    return new Lens.cTreeNetworkLens(element, manyLens, cLens);
                    //}
                    case ManyLens.Lens.PieChartLens.Type: {
                        return new ManyLens.Lens.cPieChartLens(element, manyLens, cLens);
                    }
                    case ManyLens.Lens.MapLens.Type: {
                        return new ManyLens.Lens.cMapLens(element, manyLens, cLens);
                    }
                }
            }
            else {
                return res;
            }
        }
    }
    ManyLens.LensAssemblyFactory = LensAssemblyFactory;
})(ManyLens || (ManyLens = {}));
define("SideBarNavigation", ["require", "exports", "ManyLens", "Lens/BaseD3Lens"], function (require, exports, ManyLens_1, BaseD3Lens_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SideBarNavigation {
        constructor(element, brandName, mapSvg, manyLens) {
            this._demo_data = {
                name: "root",
                icon: null,
                children: [
                    {
                        name: "Tweet Length",
                        children: [
                            {
                                name: "Pie Chart",
                                icon: "fui-pie-chart",
                                attributeName: "Tweet Length",
                                lensConstructFunc: Lens.PieChartLens,
                                extractDataFunc: BaseD3Lens_4.ExtractDataFunc("tweetLengthDistribute")
                            }
                        ]
                    },
                    {
                        name: "Hashtag Count",
                        children: [
                            {
                                name: "Pie Chart",
                                icon: "fui-pie-chart",
                                attributeName: "Hashtag Count",
                                lensConstructFunc: Lens.PieChartLens,
                                extractDataFunc: BaseD3Lens_4.ExtractDataFunc("hashTagsDistribute")
                            },
                            {
                                name: "Words Cloud",
                                icon: "fui-list-thumbnailed",
                                attributeName: "Hashtag Count",
                                lensConstructFunc: Lens.WordCloudLens,
                                extractDataFunc: BaseD3Lens_4.ExtractDataFunc("hashTagsDistribute")
                            }
                        ]
                    },
                    {
                        name: "Keywords",
                        children: [
                            {
                                name: "Words Cloud",
                                icon: "fui-list-thumbnailed",
                                attributeName: "Keywords",
                                lensConstructFunc: Lens.WordCloudLens,
                                extractDataFunc: BaseD3Lens_4.ExtractDataFunc("keywordsDistribute")
                            }
                        ]
                    },
                    {
                        name: "Retweet Network",
                        children: [
                            {
                                name: "Network",
                                icon: "fui-stats-dots",
                                attributeName: "Retweet Network",
                                lensConstructFunc: Lens.NetworkLens,
                                extractDataFunc: BaseD3Lens_4.ExtractDataFunc("retweetNetwork")
                            }
                        ]
                    },
                    {
                        name: "Tweets Content",
                        children: [
                            {
                                name: "List",
                                icon: "fui-list-numbered",
                                attributeName: "Tweets Content",
                                lensConstructFunc: Lens.TweetsListLens,
                                extractDataFunc: BaseD3Lens_4.ExtractDataFunc("tweetsContent")
                            }
                        ]
                    },
                    {
                        name: "Tweets Count",
                        children: [
                            {
                                name: "Map",
                                icon: "fui-stats-bars2",
                                attributeName: "Tweets Count",
                                lensConstructFunc: Lens.MapLens,
                                extractDataFunc: BaseD3Lens_4.ExtractDataFunc("tweetsLocationDistribute")
                            }
                        ]
                    }
                ]
            };
            /*-----------------Data menu-----------------*/
            this._isLoaded = false;
            this._element = element;
            this._manyLens = manyLens;
            this._brand_name = brandName;
            this._map_Svg = mapSvg;
            // this._element.select("#curve-btns").append("input")
            //    .attr({
            //        "id":"intervals-organize-switch",
            //        type:"checkbox",
            //        "data-on-color":"info",
            //         "data-off-color":"danger",
            //         "data-on-text":"Time",
            //         "data-off-text":"Content"
            //    })
            //    .property("checked",true)
            //;
            // $("#intervals-organize-switch").bootstrapSwitch("disabled",true);
            // this._reorganizeIntervalBtn = $("#intervals-organize-switch")
            //.on("switchChange.bootstrapSwitch",  (event,state)=> {
            //    this._manyLens.ManyLensHubServerReOrganizePeak(state);
            //});
            this._element.select("#curve-btns")
                .append("div").attr("class", "btn-group").style({
                "margin-top": "30px",
                "margin-bottom": "250px"
            })
                .html('<button class="btn btn-primary" type="button" id="hack-drop-down" style="padding-left: 25px;padding-right: 24px;">Second</button><button data-toggle="dropdown" class="btn btn-primary dropdown-toggle" type="button"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul role="menu" class="dropdown-menu" style="min-width: 150px;border: 1px solid #dae1e8;"><li><a>Second</a></li><li><a>Minutes</a></li><li><a>Hours</a></li><li><a>Days</a></li></ul>');
            d3.select("ul.dropdown-menu").selectAll("li")
                .on("click", function (d, i) {
                var text = d3.select(this).select("a").text();
                d3.select("#hack-drop-down").text(text);
                manyLens.TimeSpan = 3 - i;
                console.log(i + "," + manyLens.TimeSpan);
                //manyLens.ManyLensHubServerChangeTimeSpan(manyLens.TimeSpan);
            });
            this._launchDataBtn =
                d3.select("#navbarInput-01")
                    .on("keydown", (d) => {
                    if (d3.event.keyCode == 13) {
                        d3.event.preventDefault();
                        this._manyLens.ManyLensHubServerPullPoint("11");
                    }
                });
            d3.select("#navbarInput-02")
                .on("click", (d) => {
                d3.event.preventDefault();
                console.log("pullPoint");
                this._manyLens.ManyLensHubServerPullPoint();
            });
            this._brand = this._element.select("#map-btns").append("div")
                .attr("class", "nav-brand")
                .text(this._brand_name);
            this._menu_list = this._element.select("#map-btns").append("div")
                .attr("class", "menu-list")
                .append("ul")
                .attr("id", "side-menu-content")
                .attr("class", "menu-content");
            var mapBtns = this._element.select("#map-btns").append("div")
                .style("text-align", "center");
            this._refine_btn = mapBtns.append("button")
                .attr({
                type: "button",
                class: "btn btn-primary"
            })
                .style({
                "margin-top": "90px",
                "margin-bottom": "30px",
                "padding": "9px 35px"
            })
                .text(" Refine  Map ")
                .on("click", () => {
                this._manyLens.AddBrushToMap();
            });
            mapBtns.append("input")
                .attr({
                "id": "maps-switch",
                type: "checkbox",
                "data-on-color": "info",
                "data-off-color": "danger",
                "data-on-text": " Topics ",
                "data-off-text": " GEO "
            })
                .property("checked", true);
            $("#maps-switch").bootstrapSwitch("handleWidth", 48);
            this._som_geo_switch_btn = $("#maps-switch")
                .on("switchChange.bootstrapSwitch", (event, state) => {
                this._manyLens.SwitchMap();
            });
            this._manyLens.ManyLensHubRegisterClientFunction(this, "setTimeSpan", this.SetTimeSpan);
            //this._manyLens.ManyLensHubRegisterClientFunction(this, "enableReorganizeIntervalBtn", this.EnableReorganizeIntervalBtn);
            //this._manyLens.ManyLensHubRegisterClientFunction(this, "disableReorganizeIntervalBtn", this.DisableReorganizeIntervalBtn);
        }
        BuildList(listData) {
            //TODO remove if default paramter works
            //this._menu_list_data = listData;
            //if ( !this._menu_list_data ) {
            //    this._menu_list_data = this.DemoData();
            //}
            this._menu_list_data = listData || this._demo_data;
            var menuList = this._menu_list_data.children;
            for (var i = 0, menu_len = menuList.length; i < menu_len; ++i) {
                console.log('try init menu');
                var sub_menu = menuList[i].children;
                var li = this._menu_list.append("li")
                    .attr("class", "panel")
                    .html('<div data-target=#' + menuList[i].name.replace(" ", "-") + ' data-toggle="collapse" data-parent="#side-menu-content" class="collapsed">' + menuList[i].name + '</div>');
                //<i class="' + menuList[i].icon + '"></i>' 
                //add high light function
                li.select("div")
                    .on("click", function () {
                    d3.event.preventDefault();
                    if (d3.select(this.parentNode).classed("active")) {
                        d3.select("li.active").classed("active", false);
                    }
                    else {
                        d3.select("li.active").classed("active", false);
                        d3.select(this.parentNode).classed("active", true);
                    }
                });
                if (sub_menu) {
                    li.select("div").append("span").attr("class", "arrow fui-triangle-up");
                    var ul = li.append("ul")
                        .attr("class", "sub-menu collapse")
                        .attr("id", menuList[i].name.replace(" ", "-"));
                    ul.selectAll("li")
                        .data(sub_menu)
                        .enter().append("li")
                        .html(function (d) { return '<i class= "' + d.icon + '"></i>' + d.name; })
                        .on("click", (d) => {
                        var lens = new d.lensConstructFunc(this._map_Svg, d.attributeName, this._manyLens);
                        lens
                            .DataAccesser(d.extractDataFunc)
                            .Render("red");
                    });
                }
            }
        }
        FinishLoadData() {
            this._isLoaded = true;
            this._launchDataBtn.classed("disabled", false);
        }
        SetTimeSpan(index) {
            d3.select("ul.dropdown-menu").selectAll("li")[0][3 - index].click();
        }
        EnableReorganizeIntervalBtn() {
            this._reorganizeIntervalBtn.bootstrapSwitch("disabled", false);
        }
        DisableReorganizeIntervalBtn() {
            this._reorganizeIntervalBtn.bootstrapSwitch("disabled", true);
        }
        PullData() {
            if (ManyLens_1.ManyLens.TestMode) {
                this._manyLens.ManyLensHubServerTestPullPoint().done(() => {
                    this._launchDataBtn.classed("disabled", false);
                });
            }
            else {
                this._manyLens.ManyLensHubServerPullPoint().done((d) => {
                    this._launchDataBtn.classed("disabled", false);
                });
            }
        }
    }
    exports.SideBarNavigation = SideBarNavigation;
});
///<reference path = "./BaseSingleLens.ts" />
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        class TweetsListLens extends D3ChartObject {
            constructor(element, attributeName, manyLens) {
                super(element, manyLens);
                this._units_id = [];
                this._num_of_tweets_in_a_page = 3;
                this._sc_lc_svg = null;
                this._select_circle_radius = 0;
                this._select_circle_cx = -10;
                this._select_circle_cy = -10;
                this._select_circle_scale = 1;
                this._select_circle_zoom = d3.behavior.zoom();
                this._select_circle_drag = d3.behavior.drag();
                this._list_width = 260;
                this._list_drag = d3.behavior.drag();
                this._has_put_down = false;
                this._has_showed_lens = false;
                this._sc_lc_default_dist = 200;
                this._extract_data_map_func = null;
                this._id = "lens_" + this._manyLens.LensIDGenerator;
                this._current_tweets = [];
                this._select_circle_radius = 10;
                this._attribute_name = attributeName;
                this._select_circle_zoom
                    .scaleExtent([1, 4])
                    .on("zoom", () => {
                    this.SelectCircleZoomFunc();
                    d3.event.sourceEvent.stopPropagation();
                });
                this._select_circle_drag
                    .origin(function (d) { return d; })
                    .on("dragstart", () => {
                    d3.event.sourceEvent.stopPropagation();
                })
                    .on("drag", () => {
                    this.SelectCircleDragFunc();
                    d3.event.sourceEvent.stopPropagation();
                })
                    .on("dragend", (d) => {
                    this.SelectCircleDragendFunc(d);
                    d3.event.sourceEvent.stopPropagation();
                });
                this._list_drag
                    .origin(function (d) { return { x: d.ox, y: d.oy }; })
                    .on("dragstart", () => {
                })
                    .on("drag", (d) => {
                    this._list_x = d.ox = d3.event.x;
                    this._list_y = d.oy = d3.event.y;
                    var tData = d3.select("#" + this.ID).data()[0];
                    this._list_container
                        .style({
                        left: (tData.tx + this._list_x) + "px",
                        top: (tData.ty + this._list_y) + "px",
                    });
                    this._sc_lc_svg.select("line")
                        .attr("x1", this._select_circle_cx)
                        .attr("y1", this._select_circle_cy)
                        .attr("x2", tData.tx + this._list_x / tData.scale)
                        .attr("y2", tData.ty + this._list_y / tData.scale);
                })
                    .on("dragend", () => {
                });
            }
            get ID() {
                return this._id;
            }
            get MapID() {
                return this._map_id;
            }
            get UnitsID() {
                return this._units_id.sort();
            }
            get AttributeName() {
                return this._attribute_name;
            }
            Render(color) {
                super.Render(color);
                var container = this._element;
                var hasShow = false;
                this._sc_lc_svg = this._element
                    .append("g")
                    .data([{ tx: 0, ty: 0, scale: 1, cx: 0, cy: 0 }])
                    .attr("class", "lens")
                    .attr("id", this.ID);
                this._select_circle_svg = this._sc_lc_svg.append("g")
                    .attr("class", "select-circle");
                var selectCircle = this._select_circle =
                    this._select_circle_svg.append("circle")
                        .data([{ x: this._select_circle_cx, y: this._select_circle_cy }]);
                selectCircle
                    .attr("r", this._select_circle_radius)
                    .attr("fill", "#E9573F")
                    .attr("fill-opacity", 0.7)
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1)
                    .attr({
                    cx: -50,
                    cy: -50
                })
                    .on("mouseup", (d) => {
                    if (!this._has_put_down) {
                        this._has_put_down = true;
                        d.x = this._select_circle_cx = parseFloat(selectCircle.attr("cx"));
                        d.y = this._select_circle_cy = parseFloat(selectCircle.attr("cy"));
                        container.on("mousemove", null);
                    }
                })
                    .on("contextmenu", () => {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                    this._list_container.remove();
                    this._sc_lc_svg.remove();
                })
                    .call(this._select_circle_zoom)
                    .on("dblclick.zoom", null)
                    .on("mousedown.zoom", null)
                    .call(this._select_circle_drag);
                this._sc_lc_svg.append("line")
                    .attr("stoke-width", 2)
                    .attr("stroke", "#E9573F");
                container.on("mousemove", moveSelectCircle); //因为鼠标是在大SVG里移动，所以要绑定到大SVG上
                function moveSelectCircle() {
                    var p = d3.mouse(container[0][0]);
                    selectCircle
                        .attr("cx", p[0])
                        .attr("cy", p[1]);
                }
            }
            DataAccesser(map) {
                if (map == null)
                    return this._extract_data_map_func;
                this._extract_data_map_func = map;
                return this;
            }
            ExtractData() {
                var data = this.GetElementByMouse();
                if (!data) {
                    this._data = null;
                    this.DisplayLens();
                    return null;
                }
                console.log(data.unitsID);
                console.log(data.mapID);
                this._units_id = data.unitsID.sort();
                this._map_id = data.mapID;
                var promise = this._manyLens.ManyLensHubServerGetLensData(this.MapID, this.ID, this.UnitsID, this._extract_data_map_func.TargetAttribute);
                promise
                    .done((d) => {
                    console.log("promise done in basesingleLens");
                    this._data = d;
                    this.AfterExtractData();
                    this.DisplayLens();
                });
            }
            AfterExtractData() {
                this._page_count = Math.ceil(this._extract_data_map_func.Extract(this._data).length / this._num_of_tweets_in_a_page);
                this._current_tweets = this.GetTweetsInPage(0);
            }
            GetTweetsInPage(index) {
                var allTweets = this._extract_data_map_func.Extract(this._data);
                var tweetsForShow = [];
                for (var i = 0; i < this._num_of_tweets_in_a_page; ++i) {
                    if (allTweets[index + i])
                        tweetsForShow.push(allTweets[index + i]);
                }
                return tweetsForShow;
            }
            DisplayLens() {
                if (this._data) {
                    var theta = Math.PI / 4; //Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                    var cosTheta = Math.cos(theta); //this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = Math.sin(theta); //this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                    var cx = this._select_circle_cx + (this._select_circle_radius * cosTheta * this._select_circle_scale);
                    var cy = this._select_circle_cy + (this._select_circle_radius * sinTheta * this._select_circle_scale);
                    console.log("displaylens");
                    this._sc_lc_svg.select("line")
                        .attr("x1", cx)
                        .attr("y1", cy)
                        .attr("x2", cx)
                        .attr("y2", cy)
                        .attr("stoke-width", 2)
                        .attr("stroke", "red")
                        .transition().duration(300)
                        .attr("x2", () => {
                        return cx + (this._sc_lc_default_dist * cosTheta);
                    })
                        .attr("y2", () => {
                        return cy + (this._sc_lc_default_dist * sinTheta);
                    });
                    var tData = d3.select("#" + this.ID).data()[0];
                    this._list_container = d3.select("#mapView")
                        .append("div")
                        .data([{
                            ox: this._list_x,
                            oy: this._list_y,
                            oWidth: this._list_width
                        }])
                        .attr({
                        "id": "listView-" + this.ID,
                        "class": "list-group"
                    })
                        .style({
                        left: (tData.tx + this._list_x * tData.scale) + "px",
                        top: (tData.ty + this._list_y * tData.scale) + "px",
                    })
                        .style("width", (d) => {
                        var w = this._list_width * tData.scale;
                        w = w < 260 ? 260 : w;
                        return w + "px";
                    })
                        .call(this._list_drag);
                    this._list_container
                        .selectAll(".list-group-item")
                        .data(this._current_tweets, function (d) { return d; })
                        .enter().append("a")
                        .attr("class", "list-group-item")
                        .append("p")
                        .attr("class", "list-group-item-text")
                        .text(function (d) { return d; });
                    this._list_container.append("div")
                        .style("text-align", "center")
                        .append("div")
                        .attr("id", "pagination");
                    this._list_container.selectAll("p").style("font-size", function (d) {
                        var fontSize = d3.select(this).style("font-size");
                        fontSize = parseFloat(fontSize.substring(0, fontSize.length - 2));
                        fontSize = fontSize * tData.scale > 18 ? 18 : fontSize * tData.scale;
                        return fontSize + "px";
                    });
                    $("#pagination").bootstrapPaginator({
                        currentPage: 1,
                        totalPages: this._page_count,
                        size: 'large',
                        shouldShowPage: function (type, page, current) {
                            switch (type) {
                                case "first":
                                case "last":
                                    return false;
                                default:
                                    return true;
                            }
                        },
                        onPageClicked: (e, originalEvent, type, page) => {
                            this.ChangePage(page);
                        }
                    });
                    return true;
                }
                else {
                    return null;
                }
            }
            ChangePage(index) {
                this._current_tweets = this.GetTweetsInPage(index);
                var tData = d3.select("#" + this.ID).data()[0];
                var newTweets = this._list_container
                    .selectAll(".list-group-item")
                    .data(this._current_tweets, function (d) { return d; });
                newTweets.enter().insert("a", "div")
                    .attr("class", "list-group-item")
                    .append("p")
                    .attr("class", "list-group-item-text")
                    .text(function (d) { return d; });
                this._list_container.selectAll("p").style("font-size", function (d) {
                    var fontSize = d3.select(this).style("font-size");
                    fontSize = parseFloat(fontSize.substring(0, fontSize.length - 2));
                    fontSize = fontSize * tData.scale > 18 ? 18 : fontSize * tData.scale;
                    return fontSize + "px";
                });
                newTweets.exit().remove();
            }
            SelectCircleDragFunc() {
                if (!this._has_put_down)
                    return;
                if (d3.event.sourceEvent.button != 0)
                    return;
                d3.select("#mapView").select("div#listView-" + this.ID).remove();
                this._sc_lc_svg.select("line")
                    .attr("x1", d3.event.x)
                    .attr("x2", d3.event.x)
                    .attr("y1", d3.event.y)
                    .attr("y2", d3.event.y);
                this._select_circle
                    .attr("cx", (d) => {
                    return d.x = d3.event.x; //Math.max(0, Math.min(parseFloat(this._element.style("width")), d3.event.x));
                })
                    .attr("cy", (d) => {
                    return d.y = d3.event.y; //Math.max(0, Math.min(parseFloat(this._element.style("height")), d3.event.y));
                });
                this._has_showed_lens = false;
            }
            //The entrance of new data
            SelectCircleDragendFunc(selectCircle) {
                if (!this._has_put_down)
                    return;
                if (d3.event.sourceEvent.button != 0)
                    return;
                //传递数据给Lens显示
                if (!this._has_showed_lens) {
                    this._select_circle_cx = selectCircle.x;
                    this._select_circle_cy = selectCircle.y;
                    var theta = Math.PI / 4;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);
                    this._list_x = this._select_circle_cx
                        + (this._select_circle_radius * this._select_circle_scale
                            + this._sc_lc_default_dist) * cosTheta;
                    this._list_y = this._select_circle_cy
                        + (this._select_circle_radius * this._select_circle_scale
                            + this._sc_lc_default_dist) * sinTheta;
                    this.ExtractData(); //it will invoke display automatically when finishing extractdata
                    this._has_showed_lens = true;
                }
            }
            SelectCircleZoomFunc() {
                if (d3.event.sourceEvent.type != "wheel") {
                    return;
                }
                if (d3.event.scale == this._select_circle_scale) {
                    return;
                }
                this._select_circle_scale = d3.event.scale;
                var theta = Math.PI / 4; //Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = Math.cos(theta); //this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = Math.sin(theta); //this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);
                this._select_circle
                    .attr("r", this._select_circle_radius * this._select_circle_scale);
                this._sc_lc_svg.select("line")
                    .attr("x1", this._select_circle_cx + this._select_circle_radius * d3.event.scale * cosTheta)
                    .attr("y1", this._select_circle_cy + this._select_circle_radius * d3.event.scale * sinTheta);
            }
            GetElementByMouse() {
                var unitsID = [];
                var mapID;
                var rect = this._element.node().createSVGRect();
                var t = this._sc_lc_svg.data()[0];
                var realX = this._select_circle_cx * t.scale + t.tx;
                var realY = this._select_circle_cy * t.scale + t.ty;
                rect.x = realX - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
                rect.y = realY - this._select_circle_radius * Math.SQRT1_2 * this._select_circle_scale * t.scale;
                rect.height = rect.width = this._select_circle_radius * Math.SQRT2 * this._select_circle_scale * t.scale;
                //this._element.select( "#rectForTest" ).remove();
                //this._element.append( "rect" ).attr( {
                //    id:"rectForTest",
                //    x: rect.x,
                //    y: rect.y,
                //    width: rect.width,
                //    height:rect.height
                //})
                //.style("pointer-events","none");
                var ele = this._element.node().getIntersectionList(rect, null);
                var minDist2 = Number.MAX_VALUE;
                var minUnitsID = -1;
                for (var i = 0, len = ele.length; i < len; ++i) {
                    var node = d3.select(ele.item(i));
                    if (node.classed("unit")) {
                        var dx = parseFloat(node.attr("x")) + parseFloat(node.attr("width")) * 0.5 - realX;
                        var dy = parseFloat(node.attr("y")) + parseFloat(node.attr("height")) * 0.5 - realY;
                        var dist2 = dx * dx + dy * dy;
                        if (dist2 < (this._select_circle_radius * this._select_circle_scale * this._select_circle_radius * this._select_circle_scale)) {
                            var tID = node.data()[0]['unitID'];
                            unitsID.push(tID);
                            mapID = node.data()[0]['mapID'];
                        }
                        else if (dist2 < minDist2) {
                            mapID = node.data()[0]['mapID'];
                            minDist2 = dist2;
                            minUnitsID = node.data()[0]['unitID'];
                        }
                    }
                }
                var res = null;
                if (unitsID.length > 0 && mapID) {
                    res = { unitsID: unitsID, mapID: mapID };
                }
                else if (unitsID.length == 0 && mapID) {
                    res = { unitsID: [minUnitsID], mapID: mapID };
                }
                else {
                    console.log(unitsID);
                    console.log(mapID);
                    console.log("there is a bug here " + unitsID);
                }
                return res;
            }
        }
        TweetsListLens.Type = "TweetsListLens";
        Lens.TweetsListLens = TweetsListLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var LensHistory;
    (function (LensHistory) {
        class HistoryTrees extends D3ChartObject {
            constructor(element, manyLens) {
                super(element, manyLens);
                this._trees = [];
                this._element.attr("height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });
            }
            Render() {
            }
            addTree() {
                var treeG = this._element.append("g")
                    .attr("id", this._trees.length)
                    .attr("class", "historyTree");
                var tree = {
                    id: this._trees.length,
                    tree_layout: d3.layout.tree()
                        .size([parseFloat(this._element.style("width")),
                        parseFloat(this._element.style("height"))]),
                    tree_g: treeG,
                    root: { tree_id: this._trees.length, color: "black", lensType: null },
                    nodes: [],
                    node: treeG.selectAll(".node"),
                    link: treeG.selectAll(".link"),
                    diagonal: d3.svg.diagonal()
                };
                tree.tree_layout.nodes(tree.root);
                tree.root.parent = tree.root;
                tree.root.px = tree.root.x;
                tree.root.py = tree.root.y;
                tree.nodes.push(tree.root);
                this._trees.push(tree);
            }
            addNode(node) {
                var tree = this._trees[node.tree_id];
                node.id = tree.nodes.length.toString();
                var p = tree.nodes[Math.random() * tree.nodes.length | 0];
                if (p.children)
                    p.children.push(node);
                else
                    p.children = [node];
                tree.nodes.push(node);
                tree.node = tree.node.data(tree.tree_layout.nodes(tree.root), function (d) { return d.id; });
                tree.link = tree.link.data(tree.tree_layout.links(tree.nodes), function (d) { return d.source.id + "-" + d.target.id; });
                // Add entering nodes in the parent’s old position.
                tree.node.enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 10)
                    .attr("fill", node.color)
                    .attr("cx", function (d) { return d.parent.px; })
                    .attr("cy", function (d) { return d.parent.py; });
                // Add entering links in the parent’s old position.
                tree.link.enter().insert("path", ".node")
                    .attr("class", "link")
                    .attr("stroke", "#000")
                    .attr("fill", "none")
                    .attr("d", function (d) {
                    var o = { x: d.source.px, y: d.source.py };
                    return tree.diagonal({ source: o, target: o });
                });
                // Transition nodes and links to their new positions.
                var t = tree.tree_g.transition()
                    .duration(500);
                t.selectAll(".link")
                    .attr("d", tree.diagonal);
                t.selectAll(".node")
                    .attr("cx", function (d) { return d.px = d.x; })
                    .attr("cy", function (d) { return d.py = d.y; });
            }
        }
        LensHistory.HistoryTrees = HistoryTrees;
    })(LensHistory = ManyLens.LensHistory || (ManyLens.LensHistory = {}));
})(ManyLens || (ManyLens = {}));
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        class Shader {
            constructor(gl, arg) {
                var fragment, vertex;
                this._gl = gl;
                vertex = arg.vertex, fragment = arg.fragment;
                this._program = this._gl.createProgram();
                this._vs = this._gl.createShader(this._gl.VERTEX_SHADER);
                this._fs = this._gl.createShader(this._gl.FRAGMENT_SHADER);
                this._gl.attachShader(this._program, this._vs);
                this._gl.attachShader(this._program, this._fs);
                this.compileShader(this._vs, vertex);
                this.compileShader(this._fs, fragment);
                this.link();
                this._value_cache = {};
                this._uniform_cache = {};
                this._attribCache = {};
            }
            attribLocation(name) {
                var location;
                location = this._attribCache[name];
                if (location === void 0) {
                    location = this._attribCache[name] = this._gl.getAttribLocation(this._program, name);
                }
                return location;
            }
            compileShader(shader, source) {
                this._gl.shaderSource(shader, source);
                this._gl.compileShader(shader);
                if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
                    throw "Shader Compile Error: " + (this._gl.getShaderInfoLog(shader));
                }
            }
            link() {
                this._gl.linkProgram(this._program);
                if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
                    throw "Shader Link Error: " + (this._gl.getProgramInfoLog(this._program));
                }
            }
            use() {
                this._gl.useProgram(this._program);
                return this;
            }
            uniformLoc(name) {
                var location;
                location = this._uniform_cache[name];
                if (location === void 0) {
                    location = this._uniform_cache[name] = this._gl.getUniformLocation(this._program, name);
                }
                return location;
            }
            int(name, value) {
                var cached, loc;
                cached = this._value_cache[name];
                if (cached !== value) {
                    this._value_cache[name] = value;
                    loc = this.uniformLoc(name);
                    if (loc) {
                        this._gl.uniform1i(loc, value);
                    }
                }
                return this;
            }
            vec2(name, a, b) {
                var loc;
                loc = this.uniformLoc(name);
                if (loc) {
                    this._gl.uniform2f(loc, a, b);
                }
                return this;
            }
            float(name, value) {
                var cached, loc;
                cached = this._value_cache[name];
                if (cached !== value) {
                    this._value_cache[name] = value;
                    loc = this.uniformLoc(name);
                    if (loc) {
                        this._gl.uniform1f(loc, value);
                    }
                }
                return this;
            }
        }
        class Framebuffer {
            constructor(gl) {
                this._gl = gl;
                this._buffer = this._gl.createFramebuffer();
            }
            bind() {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._buffer);
                return this;
            }
            unbind() {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
                return this;
            }
            check() {
                var result;
                result = this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER);
                switch (result) {
                    case this._gl.FRAMEBUFFER_UNSUPPORTED:
                        throw 'Framebuffer is unsupported';
                    case this._gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                        throw 'Framebuffer incomplete attachment';
                    case this._gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                        throw 'Framebuffer incomplete dimensions';
                    case this._gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                        throw 'Framebuffer incomplete missing attachment';
                }
                return this;
            }
            color(texture) {
                this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, texture.target, texture.handle, 0);
                this.check();
                return this;
            }
        }
        class Texture {
            constructor(gl, params) {
                var _ref, _ref1;
                this._gl = gl;
                if (params == null) {
                    params = {};
                }
                this._channels = this._gl[((_ref = params.channels) != null ? _ref : 'rgba').toUpperCase()];
                if (typeof params.type === 'number') {
                    this._type = params.type;
                }
                else {
                    this._type = this._gl[((_ref1 = params.type) != null ? _ref1 : 'unsigned_byte').toUpperCase()];
                }
                switch (this._channels) {
                    case this._gl.RGBA:
                        this._chancount = 4;
                        break;
                    case this._gl.RGB:
                        this._chancount = 3;
                        break;
                    case this._gl.LUMINANCE_ALPHA:
                        this._chancount = 2;
                        break;
                    default:
                        this._chancount = 1;
                }
                this.target = this._gl.TEXTURE_2D;
                this.handle = this._gl.createTexture();
            }
            bind(unit) {
                if (unit == null) {
                    unit = 0;
                }
                if (unit > 15) {
                    throw 'Texture unit too large: ' + unit;
                }
                this._gl.activeTexture(this._gl.TEXTURE0 + unit);
                this._gl.bindTexture(this.target, this.handle);
                return this;
            }
            setSize(width, height) {
                this._width = width;
                this._height = height;
                this._gl.texImage2D(this.target, 0, this._channels, this._width, this._height, 0, this._channels, this._type, null);
                return this;
            }
            upload(data) {
                this._width = data.width;
                this._height = data.height;
                this._gl.texImage2D(this.target, 0, this._channels, this._channels, this._type, data);
                return this;
            }
            linear() {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR);
                return this;
            }
            nearest() {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
                return this;
            }
            clampToEdge() {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
                return this;
            }
            repeat() {
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT);
                this._gl.texParameteri(this.target, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT);
                return this;
            }
        }
        class NodeH {
            constructor(gl, width, height) {
                this.use = function () {
                    return this._fbo.bind();
                };
                this.bind = function (unit) {
                    return this._texture.bind(unit);
                };
                this.end = function () {
                    return this._fbo.unbind();
                };
                this.resize = function (width, height) {
                    this._width = width;
                    this._height = height;
                    return this._texture.bind(0).setSize(this._width, this._height);
                };
                var floatExt;
                this._gl = gl;
                this._width = width;
                this._height = height;
                gl.getExtension('OES_texture_float');
                this._texture = new Texture(this._gl, {
                    type: this._gl.FLOAT
                }).bind(0).setSize(this._width, this._height).nearest().clampToEdge();
                this._fbo = new Framebuffer(this._gl).bind().color(this._texture).unbind();
            }
        }
        var vertexShaderBlit = '\
attribute vec4 position;\n\
varying vec2 texcoord;\n\
void main(){\n\
    texcoord = position.xy*0.5+0.5;\n\
    gl_Position = position;\n\
}';
        var vertexShaderBlit1 = '\
uniform float times;\n\
uniform vec2 center;\n\
attribute vec4 position;\n\
varying vec2 texcoord;\n\
void main(){\n\
    texcoord = ((position.xy - center)* 0.5 * times + center * 0.5 + 0.5);\n\
    gl_Position = position;\n\
}';
        var fragmentShaderBlit = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;';
        var fragmentShaderHill = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;\n\
uniform vec2 viewport;\
void main(){\
    bool newPos = true;\
    float testVal;\
    float currentVal = 0.0;\
    vec2 texPos;\
    vec2 newTexPos;\
    texPos = texcoord;\
    newTexPos = texcoord;\
    \
    int flag = 0;\
    const int band = 5;\
    const int band1 = 5;\
    currentVal = texture2D(source, texPos).a;\
    for(int i=-band; i<=band; i++){\
        for(int j=-band; j<=band; j++){\
            vec2 offset = vec2(i,j)/viewport;\
            float Val = texture2D(source, texPos+offset).a;\
            if (Val > currentVal) {\
                flag = 1;\
            }\
        }\
    }\
    if(flag==0){\
        for(int i=0;i<2;i++){\
            newPos = false;\
            currentVal = texture2D(source, texPos).a;\
            for(int x=0; x>=-band1; x--){\
                for(int y=-band1; y<=band1; y++){\
                    if(x==0&&y<=0)continue;\
                    vec2 off = vec2(x,y)/viewport;\
                    testVal = texture2D(source, texPos+off).a;\
                    if (testVal >= currentVal) {\
                        currentVal = testVal;\
                        newPos = true;\
                        newTexPos = texPos + off;\
                    }\
                }\
            }\
            texPos = newTexPos;\
            if(newPos==false) {break;}\
        }\
    }else{\
        for(int i=0; i<2; i++){\
            newPos = false;\
            currentVal = texture2D(source, texPos).a;\
            for(int x=-band; x<=band; x++){\
                for(int y=-band; y<=band; y++){\
                    vec2 off = vec2(x,y)/viewport;\
                    testVal = texture2D(source, texPos+off).a;\
                    if (testVal >currentVal) {\
                        currentVal = testVal;\
                        newPos = true;\
                        newTexPos = texPos + off;\
                    }\
                }\
            }\
            texPos = newTexPos;\
            if(newPos==false) {break;}\
        }\
    }\
    gl_FragColor = vec4(vec2(texPos), currentVal, 1.0);\
}';
        var fragmentShaderFinalHill = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\nuniform sampler2D source;\n\
varying vec2 texcoord;\n\
uniform vec2 viewport;\n\
void main(){\
    vec2 newTexPos;\
    newTexPos = texcoord;\
    for(int i=0;i<16;i++){\
        newTexPos = vec2(texture2D(source, newTexPos).r, texture2D(source, newTexPos).g);\
        if(newTexPos.x==texture2D(source, newTexPos).r&&newTexPos.y==texture2D(source, newTexPos).g) {break;}\
    }\
    float x = floor(newTexPos.x*viewport.x);\
    float y = floor(newTexPos.y*viewport.y);\
    gl_FragColor = vec4(x,y,0.0,0.0);\
}';
        var vsCopy = vertexShaderBlit;
        var fsCopy = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;\n\
void main(){\
    float intensity = texture2D(source, texcoord).a;\
    gl_FragColor = vec4(intensity);\
}';
        class Heights {
            constructor(heatmap, gl, width, height) {
                var i, _i, _ref;
                this._heatmap = heatmap;
                this._gl = gl;
                this._width = width;
                this._height = height;
                this._textureBuffer = new Float32Array(this._width * this._height * 4);
                this._shader = new Shader(this._gl, {
                    vertex: '\
attribute vec4 position, intensity;\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
uniform vec2 viewport;\n\
void main(){\n\
    dim = abs(position.zw);\n\
    off = position.zw;\n\
    vec2 pos = position.xy + position.zw;\n\
    vIntensity = intensity.x;\n\
    gl_Position = vec4((pos / viewport) * 2.0 - 1.0, 0.0, 1.0);\n\
}',
                    fragment: '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
void main(){\n\
    float falloff = (1.0 - smoothstep(0.0, 1.0, length(off / dim)));\n\
    float intensity = falloff * vIntensity;\n\
    gl_FragColor = vec4(intensity, intensity, intensity, intensity);\n\
}'
                });
                this._rawEdgeShader = new Shader(this._gl, {
                    vertex: '\
attribute vec4 position, intensity;\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
uniform vec2 viewport;\n\
void main(){\n\
    dim = abs(position.zw);\n\
    off = position.zw;\n\
    vec2 pos = position.xy + position.zw;\n\
    vIntensity = intensity.x;\n\
    gl_Position = vec4((pos/viewport)*2.0-1.0, 0.0, 1.0);\n\
}',
                    fragment: '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
void main(){\n\
    float falloff = (1.0);\n\
    float intensity = falloff * vIntensity;\n\
    gl_FragColor = vec4(-intensity);\n\
}'
                });
                this._hillShader = new Shader(this._gl, {
                    vertex: vertexShaderBlit,
                    //fragment: this.getShaderByScriptID("fragmentShaderHill")
                    fragment: fragmentShaderHill
                });
                this._dumpHillShader = new Shader(this._gl, {
                    vertex: vertexShaderBlit,
                    fragment: fragmentShaderFinalHill
                });
                this._copyShader = new Shader(this._gl, {
                    vertex: vsCopy,
                    fragment: fsCopy
                });
                this._nodeBack = new NodeH(this._gl, this._width, this._height);
                this.nodeFront = new NodeH(this._gl, this._width, this._height);
                this._nodeHill = new NodeH(this._gl, this._width, this._height);
                this._nodeDensity = new NodeH(this._gl, this._width, this._height);
                //for Nodes
                this._vertexBuffer = this._gl.createBuffer();
                this._vertexSize = 8;
                this._maxPointCount = 1024 * 256;
                this._vertexBufferData = new Float32Array(this._maxPointCount * this._vertexSize * 6);
                this._vertexBufferViews = [];
                for (i = _i = 0, _ref = this._maxPointCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this._vertexBufferViews.push(new Float32Array(this._vertexBufferData.buffer, 0, i * this._vertexSize * 6));
                }
                this._bufferIndex = 0;
                this._pointCount = 0;
                //for Edges
                this._edgevertexBuffer = this._gl.createBuffer();
                this._edgevertexSize = 8;
                this._edgemaxPointCount = 1024 * 256;
                this._edgevertexBufferData = new Float32Array(this._edgemaxPointCount * this._edgevertexSize * 6);
                this._edgevertexBufferViews = [];
                for (i = _i = 0, _ref = this._edgemaxPointCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this._edgevertexBufferViews.push(new Float32Array(this._edgevertexBufferData.buffer, 0, i * this._edgevertexSize * 6));
                }
                this._edgebufferIndex = 0;
                this._edgepointCount = 0;
            }
            //将某个script转化成字符串
            getShaderByScriptID(id) {
                var shaderScript = document.getElementById(id);
                if (!shaderScript) {
                    alert("Error: getShader.");
                    return null;
                }
                var str = "";
                var k = shaderScript.firstChild;
                while (k) {
                    if (k.nodeType == 3) {
                        str += k.textContent;
                    }
                    k = k.nextSibling;
                }
                return str;
            }
            resize(width, height) {
                this._width = width;
                this._height = height;
                this._textureBuffer = new Float32Array(this._width * this._height * 4);
                this._nodeHill.resize(this._width, this._height);
                this._nodeBack.resize(this._width, this._height);
                this._nodeDensity.resize(this._width, this._height);
                return this.nodeFront.resize(this._width, this._height);
            }
            clear() {
                this.nodeFront.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                return this.nodeFront.end();
            }
            //将点画到帧缓冲区（nodeFront）
            update() {
                var intensityLoc, positionLoc;
                if (this._pointCount > 0) {
                    this._gl.enable(this._gl.BLEND);
                    this.nodeFront.use();
                    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
                    this._gl.bufferData(this._gl.ARRAY_BUFFER, this._vertexBufferViews[this._pointCount], this._gl.STREAM_DRAW);
                    positionLoc = this._shader.attribLocation('position');
                    intensityLoc = this._shader.attribLocation('intensity');
                    this._gl.enableVertexAttribArray(1);
                    this._gl.vertexAttribPointer(positionLoc, 4, this._gl.FLOAT, false, 8 * 4, 0 * 4);
                    this._gl.vertexAttribPointer(intensityLoc, 4, this._gl.FLOAT, false, 8 * 4, 4 * 4);
                    this._shader.use().vec2('viewport', this._width, this._height);
                    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._pointCount * 6);
                    this._gl.disableVertexAttribArray(1);
                    this._pointCount = 0;
                    this._bufferIndex = 0;
                    this.nodeFront.end();
                    this._nodeDensity = this.nodeFront;
                    this._gl.disable(this._gl.BLEND);
                }
            }
            //将边画到帧缓冲区（nodeFront）
            updateEdges() {
                var intensityLoc, positionLoc;
                if (this._edgepointCount > 0) {
                    this.nodeFront.use();
                    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._edgevertexBuffer);
                    this._gl.bufferData(this._gl.ARRAY_BUFFER, this._edgevertexBufferViews[this._edgepointCount], this._gl.STREAM_DRAW);
                    positionLoc = this._rawEdgeShader.attribLocation('position');
                    intensityLoc = this._rawEdgeShader.attribLocation('intensity');
                    this._gl.enableVertexAttribArray(1);
                    this._gl.vertexAttribPointer(positionLoc, 4, this._gl.FLOAT, false, 8 * 4, 0 * 4);
                    this._gl.vertexAttribPointer(intensityLoc, 4, this._gl.FLOAT, false, 8 * 4, 4 * 4);
                    this._rawEdgeShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                    this._gl.drawArrays(this._gl.TRIANGLES, 0, this._edgepointCount * 6);
                    this._gl.disableVertexAttribArray(1);
                    this._edgepointCount = 0;
                    this._edgebufferIndex = 0;
                    this.nodeFront.end();
                }
            }
            addVertex(x, y, xs, ys, intensity) {
                this._vertexBufferData[this._bufferIndex++] = x;
                this._vertexBufferData[this._bufferIndex++] = y;
                this._vertexBufferData[this._bufferIndex++] = xs;
                this._vertexBufferData[this._bufferIndex++] = ys;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                return this._vertexBufferData[this._bufferIndex++] = intensity;
            }
            addNode(x, y, size, intensity) {
                var s;
                if (size == null) {
                    size = 50;
                }
                if (intensity == null) {
                    intensity = 0.2;
                }
                if (this._pointCount >= this._maxPointCount - 1) {
                    this.update();
                }
                s = size / 2;
                this.addVertex(x, y, -s, -s, intensity);
                this.addVertex(x, y, +s, -s, intensity);
                this.addVertex(x, y, -s, +s, intensity);
                this.addVertex(x, y, -s, +s, intensity);
                this.addVertex(x, y, +s, -s, intensity);
                this.addVertex(x, y, +s, +s, intensity);
                return this._pointCount += 1;
            }
            addEdgeVertex(x, y, xs, ys, intensity) {
                this._edgevertexBufferData[this._edgebufferIndex++] = x;
                this._edgevertexBufferData[this._edgebufferIndex++] = y;
                this._edgevertexBufferData[this._edgebufferIndex++] = xs;
                this._edgevertexBufferData[this._edgebufferIndex++] = ys;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                return this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
            }
            addEdge(x0, y0, x1, y1, size, intensity) {
                var s, x, y;
                if (size == null) {
                    size = 50;
                }
                if (intensity == null) {
                    intensity = 0.2;
                }
                if (this._edgepointCount >= this._edgemaxPointCount - 1) {
                    this.updateEdges();
                }
                var lineLength = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
                x = (x0 + x1) / 2;
                y = (y0 + y1) / 2;
                size = size / 2;
                var px0, px1, px2, px3, px4, py0, py1, py2, py3, py4;
                py0 = (x1 - x0) / lineLength;
                px0 = (y0 - y1) / lineLength;
                px1 = x0 + px0 * size;
                py1 = y0 + py0 * size;
                px2 = x1 + px0 * size;
                py2 = y1 + py0 * size;
                px3 = x0 - px0 * size;
                py3 = y0 - py0 * size;
                px4 = x1 - px0 * size;
                py4 = y1 - py0 * size;
                this.addEdgeVertex(x, y, px1 - x, py1 - y, intensity);
                this.addEdgeVertex(x, y, px2 - x, py2 - y, intensity);
                this.addEdgeVertex(x, y, px3 - x, py3 - y, intensity);
                this.addEdgeVertex(x, y, px3 - x, py3 - y, intensity);
                this.addEdgeVertex(x, y, px2 - x, py2 - y, intensity);
                this.addEdgeVertex(x, y, px4 - x, py4 - y, intensity);
                this._edgepointCount += 1;
            }
            //将帧缓冲区的内容copy回本地(CPU上的内存)
            dumpDensityMapTexureBuffer() {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._heatmap.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this._nodeDensity.bind(0);
                this._nodeBack.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                this._copyShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
                this._gl.readPixels(0, 0, this._width, this._height, this._gl.RGBA, this._gl.FLOAT, this._textureBuffer);
                this._nodeBack.end();
            }
            //获得当前本地端内存所存储的帧缓冲区内容
            getTextureBuffer() {
                return this._textureBuffer;
            }
            //进行点聚合爬山算法
            hillClimbing() {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._heatmap.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this.nodeFront.bind(0);
                this._nodeHill.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                this._hillShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
                this._nodeHill.end();
            }
            //将爬山结果copy回本地端内存缓冲区
            dumpFinalHillClimbingResult() {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._heatmap.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this._nodeHill.bind(0);
                this._nodeBack.use();
                this._gl.clearColor(0, 0, 0, 0);
                this._gl.clear(this._gl.COLOR_BUFFER_BIT);
                this._dumpHillShader.use().int('source', 0).vec2('viewport', this._width, this._height);
                this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
                this._gl.readPixels(0, 0, this._width, this._height, this._gl.RGBA, this._gl.FLOAT, this._textureBuffer);
                this._nodeBack.end();
            }
        }
        class WebGLHeatmap {
            constructor(arg) {
                var _ref;
                _ref = arg != null ? arg : {}, this.canvas = _ref.canvas, this._width = _ref.width, this._height = _ref.height;
                if (!this.canvas) {
                    this.canvas = document.createElement('canvas');
                }
                this._gl = this.canvas.getContext('experimental-webgl', { antialias: true });
                if (this._gl === null) {
                    throw 'WebGL not supported';
                }
                this._gl.enableVertexAttribArray(0);
                this._gl.getExtension('OES_texture_float');
                this._gl.blendFunc(this._gl.ONE, this._gl.ONE);
                var alphaRange;
                var _ref1 = alphaRange != null ? alphaRange : [0, 1], alphaStart = _ref1[0], alphaEnd = _ref1[1];
                var output = "vec4 alphaFun(vec3 color, float intensity){\n    float alpha = smoothstep(" + (alphaStart.toFixed(8)) + ", " + (alphaEnd.toFixed(8)) + ", intensity);\n    return vec4(color*alpha, alpha);\n}";
                /*-----------------different color scheme------------*/
                //var getColorFun = 'float a0 = 0.3; float a1 = 0.6; vec4 getColor(float intensity){\n vec4 color;\n if(intensity>=0.0) {if(intensity>=level6)color= vec4(0.03,0.19,0.42,1);else if(intensity>=level5)color= vec4(0.03,0.32,0.61,1);else if(intensity>=level4)color= vec4(0.13,0.44,0.71,1);else if(intensity>=level3)color= vec4(0.26,0.57,0.78,1);else if(intensity>=level2)color= vec4(0.42,0.68,0.84,1);else if(intensity>=level1)color= vec4(0.62,0.80,0.88,1);else if(intensity>=level0)color= vec4(0.78,0.86,0.94,1); else color=vec4(0,0,0,intensity);}\nelse{color = vec4((1.0+intensity)*0.7,(1.0+intensity)*0.7,1.0,1.0);}\n    return color;\n}';
                var getColorFun = 'float a0 = 0.3; float a1 = 0.6; vec4 getColor(float intensity){\n vec4 color;\n if(intensity>=0.0) {if(intensity>=level6)color= vec4(0.1,0.2,0.4,0.85);else if(intensity>=level5)color= vec4(0.1,0.2,0.5,0.7);else if(intensity>=level4)color= vec4(0.15,0.4,0.7,0.9);else if(intensity>=level3)color= vec4(0.15,0.4,0.7,0.7);else if(intensity>=level2)color= vec4(0.2,0.4,0.6,0.60);else if(intensity>=level1)color= vec4(0.55*a1,0.8*a1,0.95*a1,a1);else if(intensity>=level0)color= vec4(0.55*a0,0.8*a0,0.95*a0,a0); else color=vec4(0,0,0,intensity);}\nelse{color = vec4((1.0+intensity)*0.7,(1.0+intensity)*0.7,1.0,1.0);}\n  return color;\n}';
                var rawgetColorFun = 'vec3 getColor(float intensity){\n    vec3 blue = vec3(0.0, 0.0, 1.0);\n    vec3 cyan = vec3(0.0, 1.0, 1.0);\n    vec3 green = vec3(0.0, 1.0, 0.0);\n    vec3 yellow = vec3(1.0, 1.0, 0.0);\n    vec3 red = vec3(1.0, 0.0, 0.0);\n\n    vec3 color = (\n        fade(-0.25, 0.25, intensity)*blue +\n        fade(0.0, 0.5, intensity)*cyan +\n        fade(0.25, 0.75, intensity)*green +\n        fade(0.5, 1.0, intensity)*yellow +\n        smoothstep(0.75, 1.0, intensity)*red\n    );\n    return color;\n}';
                this._shader = new Shader(this._gl, {
                    vertex: vertexShaderBlit1,
                    fragment: fragmentShaderBlit + ("uniform float level0;\nuniform float level1;\nuniform float level2;\nuniform float level3;\nuniform float level4;\nuniform float level5;\nuniform float level6;\n") + ("float linstep(float low, float high, float value){\n    return clamp((value-low)/(high-low), 0.0, 1.0);\n}\n\nfloat fade(float low, float high, float value){\n    float mid = (low+high)*0.5;\n    float range = (high-low)*0.5;\n    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);\n    return smoothstep(0.0, 1.0, x);\n}\n\n" + getColorFun + "\n" + "\n\nvoid main(){\n    float intensity = (texture2D(source, texcoord).r);\n    vec4 color = getColor(intensity);\n   gl_FragColor = color;\n}")
                });
                this._rawshader = new Shader(this._gl, {
                    vertex: vertexShaderBlit1,
                    fragment: fragmentShaderBlit + ("float linstep(float low, float high, float value){\n    return clamp((value-low)/(high-low), 0.0, 1.0);\n}\n\nfloat fade(float low, float high, float value){\n    float mid = (low+high)*0.5;\n    float range = (high-low)*0.5;\n    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);\n    return smoothstep(0.0, 1.0, x);\n}\n\n" + rawgetColorFun + "\n" + output + "\n\nvoid main(){\n    float intensity = smoothstep(0.0, 1.0, texture2D(source, texcoord).r);\n    vec3 color = getColor(intensity);\n    gl_FragColor = alphaFun(color, intensity);\n}")
                });
                if (this._width == null) {
                    this._width = this.canvas.offsetWidth || 2;
                }
                if (this._height == null) {
                    this._height = this.canvas.offsetHeight || 2;
                }
                this.canvas.width = this._width;
                this.canvas.height = this._height;
                this._gl.viewport(0, 0, this._width, this._height);
                this.quad = this._gl.createBuffer();
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.quad);
                var quad = new Float32Array([-1, -1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1, 1, 1, 0, 1]);
                this._gl.bufferData(this._gl.ARRAY_BUFFER, quad, this._gl.STATIC_DRAW);
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
                this._heights = new Heights(this, this._gl, this._width, this._height);
            }
            adjustSize() {
                var canvasHeight, canvasWidth;
                canvasWidth = this.canvas.offsetWidth || 2;
                canvasHeight = this.canvas.offsetHeight || 2;
                if (this._width !== canvasWidth || this._height !== canvasHeight) {
                    this._gl.viewport(0, 0, canvasWidth, canvasHeight);
                    this.canvas.width = canvasWidth;
                    this.canvas.height = canvasHeight;
                    this._width = canvasWidth;
                    this._height = canvasHeight;
                    this._heights.resize(this._width, this._height);
                }
            }
            display(x, y, times, contourForIntensity) {
                this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.quad);
                this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);
                this._heights.nodeFront.bind(0);
                if (!times)
                    times = 1.0;
                if (!x)
                    x = 0;
                if (!y)
                    y = 0;
                if (!contourForIntensity) {
                    contourForIntensity = [1, 1, 1, 1, 1, 1, 1];
                }
                if (this._gradientTexture) {
                    this._gradientTexture.bind(1);
                }
                var flag = true;
                if (MapArea.config.shaderStyle == null)
                    flag = true;
                else if (MapArea.config.shaderStyle == 0)
                    flag = true;
                else
                    flag = false;
                if (flag) {
                    this._shader.use().int('source', 0)
                        .int('gradientTexture', 1)
                        .float('level0', contourForIntensity[0])
                        .float('level1', contourForIntensity[1])
                        .float('level2', contourForIntensity[2])
                        .float('level3', contourForIntensity[3])
                        .float('level4', contourForIntensity[4])
                        .float('level5', contourForIntensity[5])
                        .float('level6', contourForIntensity[6])
                        .float('times', times)
                        .vec2('center', x, y);
                }
                else {
                    this._rawshader.use().int('source', 0)
                        .int('gradientTexture', 1)
                        .float('times', times)
                        .vec2('center', x, y);
                }
                return this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
            }
            dumpDensityMapTexureBuffer() {
                this._heights.dumpDensityMapTexureBuffer();
            }
            getTextureBuffer() {
                return this._heights.getTextureBuffer();
            }
            getDensityMapTextureBuffer() {
                return this._heights.getTextureBuffer();
            }
            getHillClimbingResultTextureBuffer() {
                return this._heights.getTextureBuffer();
            }
            hillClimbing() {
                this._heights.hillClimbing();
            }
            dumpFinalHillClimbingResult() {
                this._heights.dumpFinalHillClimbingResult();
            }
            addNode(x, y, size, intensity) {
                return this._heights.addNode(x, y, size, intensity);
            }
            updateNodes() {
                return this._heights.update();
            }
            addEdge(x0, y0, x1, y1, size, intensity) {
                return this._heights.addEdge(x0, y0, x1, y1, size, intensity);
            }
            updateEdges() {
                return this._heights.updateEdges();
            }
            clear() {
                return this._heights.clear();
            }
            changTimes(x, y, times) {
                //this._width *= times;
                //this._height *= times;
                //this._gl.viewport( 0, 0, this._width, this._height );
                this._gl.viewport(x, y, this._width * times, this._height * times);
                //this._gl.viewport( -x * ( times - 1 ), -( this._height - y ) * ( times - 1 ), this._width * times, this._height * times );
            }
            returnToInitial() {
                this._gl.viewport(0, 0, this._width, this._height);
            }
        }
        MapArea.WebGLHeatmap = WebGLHeatmap;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./WebGLLod.ts" />
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        class config {
            static setKernelBandWidth(val) {
                config.kernelBandwidth = val;
                config.LoDMap.DrawCanvas();
            }
            static setIntensity(val) {
                config.intensity = val;
                config.LoDMap.DrawCanvas();
            }
            static setShader(val) {
                config.shaderStyle = val;
                config.LoDMap.DrawCanvas();
            }
        }
        config.kernelBandwidth = 64;
        config.intensity = 3;
        config.shaderStyle = 0;
        //public static stops = [0.007, 0.02, 0.037, 0.065, 0.114, 0.21, 0.295];
        config.stops = [0.000, 0.067, 0.117, 0.24, 0.44, 0.51, 0.6];
        MapArea.config = config;
        class HeatMapLayer {
            constructor(id, parentContainer, canvasWidth, canvasHeight, unitWidth, unitHeight, topOffset, leftOffset, nodeArray) {
                config.LoDMap = this;
                this._id = id;
                this._parent_container = parentContainer;
                this._canvas_width = canvasWidth * unitWidth;
                this._canvas_height = canvasHeight * unitHeight;
                this._canvas_top_offset = topOffset;
                this._canvas_left_offset = leftOffset;
                //this._unit_size = unitSize;
                this._nodeArray = nodeArray.map((d) => {
                    return { x: d.x * unitWidth + unitWidth * 0.5, y: d.y * unitHeight + unitHeight * 0.5, value: d.value };
                });
                this.addAndInitCanvas();
                this.DrawCanvas();
            }
            //在html上添加canvas并初始化，热力图和LoD就画在这个canvas上
            addAndInitCanvas() {
                this._canvas = document.createElement('canvas');
                this._canvas.id = this._id;
                this._canvas.height = this._canvas_height;
                this._canvas.width = this._canvas_width;
                this._canvas.style.top = this._canvas_top_offset + 'px';
                this._canvas.style.left = this._canvas_left_offset + 'px';
                this._parent_container.appendChild(this._canvas);
                //创建热力图
                this._LoD = new MapArea.WebGLHeatmap({ canvas: this._canvas });
                //初始化像素矩阵
                var width = this._LoD.canvas.width;
                var height = this._LoD.canvas.height;
                this._pixelMatrix = new Array(this._canvas_height);
                for (var i = 0; i < height; ++i) {
                    this._pixelMatrix[i] = new Array(this._canvas_width);
                    //for ( var j = 0; j < width; ++j )
                    //    this._pixelMatrix[i][j] = 0;
                }
                ;
                //初始化等高线值,这里设置为7层
                this._contourForIntensity = new Array(7);
                for (var i = 0, len = this._contourForIntensity.length; i < len; ++i) {
                    this._contourForIntensity[i] = 0.0;
                }
                ;
            }
            UpdateNodeArray(unitWidth, unitHeight, nodeArray) {
                this._nodeArray = nodeArray.map((d) => {
                    return { x: d.x * unitWidth + unitWidth * 0.5, y: d.y * unitHeight + unitHeight * 0.5, value: d.value };
                });
                this.DrawCanvas();
            }
            //每次页面刷新，或者Bing Map的视角改变时，就根据当前Bing Map的状态重新绘制热力图或LoD
            DrawCanvas() {
                var dStart = new Date();
                this.getEdgesNodesAndDraw();
                var nSpan = (new Date()).getMilliseconds() - dStart.getMilliseconds();
                console.log("overall time is :" + nSpan + "ms");
            }
            //1、统计pixel矩阵上每个点出现的次数，然后根据每个Pixel点上不同的点个数赋予不同的强度，然后画到帧缓冲区中;并将当前的densityMap的结果copy回CPU端
            //2、根据densityMap的强度矩阵获得强度矩阵的最大值，并设置等高线的值;
            getEdgesNodesAndDraw() {
                this._LoD.clear(); //每次重新绘制图时都需要将GPU的帧缓冲区清零
                //var s: string = "[";
                //this._nodeArray.forEach(( d ) => {
                //    s += '{"x":'+d.x+',"y":'+d.y+',"value":'+d.value+'},'
                //});
                //s += "]";
                //console.log( s );
                this.drawNodes(this._nodeArray); //画点，渲染的结果在帧缓冲区中
                this._LoD.display(0, 0, 1.0, this._contourForIntensity); //将最终渲染的帧缓冲区的结果展示到屏幕上
            }
            drawNodes(nodes) {
                //初始像素矩阵为零
                var width = this._pixelMatrix[0].length;
                var height = this._pixelMatrix.length;
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++)
                        this._pixelMatrix[i][j] = 0;
                }
                //点聚合，对于每一个像素，统计累加落到同一个像素的点的个数
                //for ( var i = 0, len = nodes.length; i < len; i++ ) {
                //    var x = Math.floor( nodes[i].x );
                //    var y = height - Math.floor( nodes[i].y );
                //    if ( x >= 0 && x < width && y >= 0 && y < height ) {
                //        this._pixelMatrix[y][x]++;
                //    }
                //}
                for (var i = 0, len = nodes.length; i < len; ++i) {
                    var x = Math.floor(nodes[i].x); //* this._unit_size;
                    var y = Math.floor(height - 1 - nodes[i].y); //* this._unit_size;
                    if (this._pixelMatrix[y][x] != null)
                        this._pixelMatrix[y][x] = nodes[i].value;
                    else {
                        console.log(nodes[i]);
                        console.log(this._pixelMatrix[y]);
                    }
                }
                //获得当前bing Map的放大倍数
                var zoomLevel = 5; //this._map.getZoom();
                //根据不同的zoomLevel设置不同的强度基数和核半径
                var density = config.intensity;
                density = density * zoomLevel / 5.0; //Math.max(zoomLevel-4.0, 1.0);
                var ans = 0;
                var kernelBand = 0;
                var BaseKernelBand = config.kernelBandwidth;
                if (zoomLevel < 5.0) {
                    kernelBand = BaseKernelBand * Math.pow(0.75, 5.0 - zoomLevel);
                }
                else
                    kernelBand = BaseKernelBand * Math.atan(zoomLevel - 3.3) * Math.pow(1.05, zoomLevel - 5.0);
                // adds the buffered points
                //准备画点所需要的点坐标和强度
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++) {
                        if (this._pixelMatrix[i][j] > 0) {
                            //遍历点聚合后的像素矩阵，将点的坐标以及其对应的核半径和强度值加入点缓冲区中
                            this._LoD.addNode(j, i, kernelBand, Math.sqrt(this._pixelMatrix[i][j]) * density / 300);
                            ans++;
                        }
                    }
                }
                //在GPU中画点的热力图，帧缓冲与纹理nodeFront绑定
                this._LoD.updateNodes();
                // get the Maximum Val of density from the retrieved Buffer, and compute the contour Map
                //画完热力图，将热力图的强度矩阵拷贝回CPU端，CPU端计算热力图中的最大强度，然后根据这个最大强度设置等高线的值。
                this.getTextureBufferIntensity(null);
            }
            getTextureBufferIntensity(textureBuffer) {
                // dump the densityMap from GPU's FrameBuffer (bind the TextureBuffer)
                this._LoD.dumpDensityMapTexureBuffer();
                if (textureBuffer == null)
                    textureBuffer = this._LoD.getDensityMapTextureBuffer();
                var maxVal = 0;
                for (var idx = 0, len = textureBuffer.length; idx < len; idx += 16) {
                    maxVal = Math.max(textureBuffer[idx], maxVal);
                }
                //var rate = [0.01,0.02,0.04,0.08,0.15,0.19,0.28];
                if (maxVal == 0)
                    maxVal = 1.0;
                //提前估算好各个等高线的值与最大值的比率，然后根据得到的densityMap的最大值计算出当前各个等高线的值
                var rate = config.stops;
                for (var idx = 0, len = this._contourForIntensity.length; idx < len; idx++) {
                    this._contourForIntensity[idx] = maxVal * rate[idx];
                }
            }
            //zoom in zoom out 操作
            transform(times, centerX, centerY) {
                //if ( type == 1 ) {//zoom in 放大
                //    //this._LoD.display( x / this._canvas.width * 2 - 1,( this._canvas.height - y ) / this._canvas.height * 2 - 1, 1 / ( 1 + times ), this._contourForIntensity );
                //    var scale = ( 1 + times );
                //    this._canvas.style.width = this._canvas_width * scale + "px";
                //    this._canvas.style.height = this._canvas_height * scale + "px";
                //    this._LoD.changTimes( x, y, scale );
                //    this._LoD.display( 0, 0, 1.0, this._contourForIntensity );
                //}
                //else if ( type == 0 ) {//zoom out 缩小
                //    var scale = 1 / ( 1 + times );
                //    this._canvas.style.width = this._canvas_width * scale + "px";
                //    this._canvas.style.height = this._canvas_height * scale + "px";
                //    this._LoD.changTimes( x, y, scale );
                //    this._LoD.display( 0, 0, 1.0, this._contourForIntensity );
                //}
                //var l = Math.sqrt( this._canvas_height * this._canvas_height + this._canvas_width * this._canvas_width );
                //var widthScale = ( this._canvas_width / l ) * times;
                //var heightScale = ( this._canvas_height / l ) * times;
                this._canvas.width = this._canvas_width * times;
                this._canvas.height = this._canvas_height * times;
                this._LoD.changTimes(0, 0, times);
                this._LoD.display(0, 0, 1.0, this._contourForIntensity);
                //this._LoD.returnToInitial();
            }
            //平移操作
            transformPan(xDif, yDif, times) {
                this._canvas.style.top = this._canvas_top_offset * times + yDif + 'px';
                this._canvas.style.left = this._canvas_left_offset * times + xDif + 'px';
                this._LoD.display(0, 0, 1.0, this._contourForIntensity);
            }
        }
        MapArea.HeatMapLayer = HeatMapLayer;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "./HeatmapLayer.ts" />
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        class SOMMap extends D3ChartObject {
            constructor(element, manyLens) {
                super(element, manyLens);
                // private _lensPane: Pane.ClassicLensPane;
                //private _colorPalettes: string[] = ["rgb(99,133,255)", "rgb(98,252,250)", "rgb(99,255,127)", "rgb(241,255,99)", "rgb(255,187,99)", "rgb(255,110,99)", "rgb(255,110,99)"];
                this._state = true;
                this._maps = [];
                this._heatMaps = [];
                this._mapIDs = [];
                this._scale = 1;
                this._left_offset = 0;
                this._top_offset = null;
                this._translate_x = 0;
                this._translate_y = 0;
                this._map_gap = 50;
                this._unit_width = 20;
                this._unit_height = 20;
                this._classifier_context_menu = null;
                this._hightlight_classifier_arrow = null;
                this._colorPalettes = ["rgb(198,219,239)",
                    "rgb(158,202,225)",
                    "rgb(107, 174, 214)",
                    "rgb(66, 146, 198)",
                    "rgb(33, 113, 181)",
                    "rgb(8, 81, 156)",
                    "rgb(8, 81, 156)"
                ];
                // this._lensPane = new Pane.ClassicLensPane(element, manyLens);
                this._element.attr("height", function () {
                    let parentRect = this.parentNode.getBoundingClientRect();
                    let selfRect = this.getBoundingClientRect();
                    return parentRect.height - (selfRect.top - parentRect.top);
                });
                this._total_width = parseFloat(this._element.style("width"));
                this._total_height = parseFloat(this._element.style("height"));
                this._heatmap_container = document.createElement('div');
                this._heatmap_container.id = "heatmap-container";
                const heatmapContainerRect = this._element.node().getBoundingClientRect();
                //this._heatmap_container.style.left = ( <HTMLElement>this._element.node() ).offsetLeft.toString() + "px";
                //this._heatmap_container.style.top = ( <HTMLElement>this._element.node() ).offsetTop.toString() + "px";
                this._heatmap_container.style.height = heatmapContainerRect.height + "px";
                this._heatmap_container.style.width = heatmapContainerRect.width + "px";
                document.getElementById("mapView").insertBefore(this._heatmap_container, this._element.node());
                this._center_x = 0.5 * parseFloat(this._element.style("width"));
                this._center_y = 0.5 * parseFloat(this._element.style("height"));
                this._brush = d3.svg.brush()
                    .on("brushstart", () => {
                    if (d3.event.sourceEvent.altKey) {
                        var extent = d3.event.target.extent();
                        var rect = this._element.node().createSVGRect();
                        rect.x = extent[0][0] * this._scale + this._translate_x;
                        rect.y = extent[0][1] * this._scale + this._translate_y;
                        rect.width = (extent[1][0] - extent[0][0]) * this._scale;
                        rect.height = (extent[1][1] - extent[0][1]) * this._scale;
                        //this._element.select( "#rectForTest" ).remove();
                        //this._element.append( "rect" ).attr( {
                        //    id:"rectForTest",
                        //    x: rect.x,
                        //    y: rect.y,
                        //    width: rect.width,
                        //    height:rect.height
                        //})
                        //.style("pointer-events","none");
                        var ele = this._element.node().getIntersectionList(rect, null);
                        var res = [];
                        for (var i = 0, len = ele.length; i < len; ++i) {
                            var node = d3.select(ele.item(i));
                            if (node.classed("unit")) {
                                res.push(node.data()[0]['unitID']);
                            }
                        }
                        this._fromUnitsID = res;
                    }
                    d3.event.sourceEvent.stopPropagation();
                })
                    .on("brush", () => {
                    d3.event.sourceEvent.stopImmediatePropagation();
                })
                    .on("brushend", () => {
                    if (d3.event.sourceEvent.altKey) {
                        var extent = d3.event.target.extent();
                        var rect = this._element.node().createSVGRect();
                        rect.x = extent[0][0] * this._scale + this._translate_x;
                        rect.y = extent[0][1] * this._scale + this._translate_y;
                        rect.width = (extent[1][0] - extent[0][0]) * this._scale;
                        rect.height = (extent[1][1] - extent[0][1]) * this._scale;
                        //this._element.select( "#rectForTest" ).remove();
                        //this._element.append( "rect" ).attr( {
                        //    id:"rectForTest",
                        //    x: rect.x,
                        //    y: rect.y,
                        //    width: rect.width,
                        //    height:rect.height
                        //})
                        //.style("pointer-events","none");
                        var ele = this._element.node().getIntersectionList(rect, null);
                        var res = [];
                        var mapID;
                        for (var i = 0, len = ele.length; i < len; ++i) {
                            var node = d3.select(ele.item(i));
                            if (node.classed("unit")) {
                                res.push(node.data()[0]['unitID']);
                                mapID = node.data()[0]['mapID'];
                                console.log(node);
                            }
                        }
                        this._toUnitsID = res;
                        if (this._fromUnitsID && this._toUnitsID) {
                            console.log(this._fromUnitsID, this._toUnitsID);
                            this._manyLens.ManyLensHubServerRefineMap(mapID, this._mapIDs.indexOf(mapID), this._fromUnitsID, this._toUnitsID);
                        }
                    }
                    d3.event.sourceEvent.stopPropagation();
                });
                this._zoom = d3.behavior.zoom()
                    .scaleExtent([0.2, 1.5])
                    .on("zoomstart", () => {
                    var p = d3.mouse(this._element.node());
                    this._zoom
                        .center([p[0], this._center_y]);
                })
                    .on("zoom", () => {
                    clearInterval(this._move_view_timer);
                    var currentLevel = d3.event.scale;
                    this._heatMaps.forEach((d, i) => {
                        if (this._scale != currentLevel) {
                            d.transform(currentLevel, 0, 0);
                        }
                        d.transformPan(d3.event.translate[0], d3.event.translate[1], currentLevel);
                    });
                    this._element.selectAll(".som-map")
                        .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    this._element.selectAll(".lens")
                        .attr("transform", function (d) {
                        if (d.cx == 0) {
                            d.cx = d3.event.translate[0];
                            d.cy = d3.event.translate[1];
                        }
                        d.scale = currentLevel;
                        d.tx = d3.event.translate[0] - d.cx * d.scale;
                        d.ty = d3.event.translate[1] - d.cy * d.scale;
                        return "translate(" + [d.tx, d.ty] + ")scale(" + currentLevel + ")";
                    });
                    d3.select("#mapView")
                        .selectAll(".list-group")
                        .style("left", function (d) { var x = d.ox + d3.event.translate[0]; return x + "px"; })
                        .style("top", function (d) { var y = d.oy + d3.event.translate[1]; return y + "px"; })
                        .style("width", function (d) {
                        var w = d.oWidth * currentLevel;
                        w = w < 260 ? 260 : w;
                        return w + "px";
                    })
                        .selectAll("p")
                        .style("font-size", function (d) {
                        var fontSize = d3.select(this).style("font-size");
                        fontSize = parseFloat(fontSize.substring(0, fontSize.length - 2));
                        fontSize = fontSize * currentLevel > 18 ? 18 : fontSize * currentLevel;
                        return fontSize + "px";
                    });
                    this._translate_x = d3.event.translate[0];
                    this._translate_y = d3.event.translate[1];
                    this._scale = currentLevel;
                });
                this.init();
                this._manyLens.ManyLensHubRegisterClientFunction(this, "showVisMap", this.ShowVisMap);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "updateVisMap", this.UpdateVisMap);
            }
            init() {
                this._element.on("dblclick", null);
                this._element
                    .on("mousedown", () => {
                    if (d3.event.button)
                        d3.event.stopImmediatePropagation();
                    if (this._classifier_context_menu) {
                        this._classifier_context_menu.remove();
                        this._classifier_context_menu = null;
                    }
                });
                //this._element
                //      .call( this._zoom )
                //      .on("dblclick.zoom", null);
                var defs = this._element.append('svg:defs');
                // define arrow markers for leading arrow
                defs.append('svg:marker')
                    .attr({
                    'id': 'mark-end-arrow',
                    'viewBox': '0 -5 10 10',
                    'refX': 7,
                    'markerWidth': 3.5,
                    'markerHeight': 3.5,
                    'orient': 'auto'
                })
                    .append('path')
                    .attr({
                    "class": "highlight-arrow",
                    'd': 'M0,-5L10,0L0,5z'
                });
            }
            Toggle() {
                if (this._state) {
                    this.RemoveMap();
                }
                else {
                    this.init();
                    this.Render();
                }
                this._state = !this._state;
            }
            RemoveMap() {
                this._element.selectAll("*").remove();
                this._heatmap_container.innerHTML = "";
                this._left_offset = 0;
                this._heatMaps = [];
                this._maps = [];
            }
            Render() {
                //this._lensPane.Render();
            }
            AddBrush() {
                this._element
                    .style("cursor", "pointer")
                    .on("click", () => {
                    var p = d3.mouse(document.body);
                    console.log(p[0], p[1]);
                    var data = d3.select(document.elementFromPoint(p[0], p[1])).data();
                    if (data && data.length > 0 && data[0]) {
                        var mapID = data[0].mapID;
                        var map = d3.select("#mapSvg" + mapID);
                        if (map) {
                            var mapData = map.data()[0];
                            if (this._brush_svg) {
                                this._brush.clear();
                                this._brush_svg.remove();
                            }
                            this._brush.x(d3.scale.identity().domain([mapData.leftOffset, mapData.width * this._unit_width + mapData.leftOffset]))
                                .y(d3.scale.identity().domain([mapData.topOffset, mapData.height * this._unit_height + mapData.topOffset]));
                            this._brush_svg = map.append("g")
                                .attr("class", "brush")
                                .on("contextmenu", () => {
                                this._brush.clear();
                                this._brush_svg.remove();
                                d3.event.preventDefault();
                            })
                                .call(this._brush);
                        }
                    }
                    this._element.style("cursor", "default")
                        .on("click", null);
                });
            }
            ContextMenu(preMapID) {
                var p = d3.mouse(this._element.node());
                if (!this._classifier_context_menu) {
                    var contextWidth = 200;
                    this._classifier_context_menu = this._element.append("g")
                        .attr("id", "som-map-context-menu")
                        .attr("transform", "translate(" + [p[0], p[1]] + ")");
                    this._classifier_context_menu.append("rect")
                        .attr({
                        id: "context-menu-base",
                        width: contextWidth
                    })
                        .attr("height", () => {
                        if (this._manyLens.CurrentClassifierMapID)
                            return 150;
                        return 50;
                    });
                    // filters go in defs element
                    var defs = this._classifier_context_menu.append("defs");
                    // create filter with id #drop-shadow
                    // height=130% so that the shadow is not clipped
                    var filter = defs.append("filter")
                        .attr({
                        "id": "drop-shadow",
                        "height": "130%"
                    });
                    // SourceAlpha refers to opacity of graphic that this filter will be applied to
                    // convolve that with a Gaussian with standard deviation 3 and store result
                    // in blur
                    filter.append("feGaussianBlur")
                        .attr({
                        "in": "SourceAlpha",
                        "stdDeviation": 2,
                        "result": "blur"
                    });
                    // translate output of Gaussian blur to the right and downwards with 2px
                    // store result in offsetBlur
                    filter.append("feOffset")
                        .attr({
                        "in": "blur",
                        "dx": 1,
                        "dy": 1,
                        "result": "offsetBlur"
                    });
                    // overlay original SourceGraphic over translated blurred opacity by using
                    // feMerge filter. Order of specifying inputs is important!
                    var feMerge = filter.append("feMerge");
                    feMerge.append("feMergeNode")
                        .attr("in", "offsetBlur");
                    feMerge.append("feMergeNode")
                        .attr("in", "SourceGraphic");
                    var option = [
                        { mapID: preMapID, text: "Set this map as classifier" },
                        { mapID: this._manyLens.CurrentClassifierMapID, text: "Current classifier: " },
                        { mapID: this._manyLens.CurrentClassifierMapID, text: "Remove classifier" }
                    ];
                    var optionG = this._classifier_context_menu.selectAll(".context-menu-option")
                        .data(option.filter(function (d) { return d.mapID != null; }))
                        .enter().append("g")
                        .attr("class", "context-menu-option")
                        .attr("transform", function (d, i) {
                        if (i == 2)
                            return "translate(10," + (i * 50 + 10) + ")";
                        return "translate(10," + (i * 40 + 10) + ")";
                    });
                    var textHeight;
                    this._classifier_context_menu.append("text").text("text")
                        .attr("x", function (d) {
                        var box = this.getBBox();
                        textHeight = box.height;
                    })
                        .remove();
                    optionG.append("text")
                        .html(function (d) {
                        if (d.text[0] == "C") {
                            return '<tspan>Current classifier:</tspan><tspan x="40" dy=' + textHeight + '>' + d.mapID + '</tspan>';
                        }
                        return d.text;
                    })
                        .attr("y", textHeight);
                    optionG.insert("rect", ".context-menu-option text")
                        .attr("width", contextWidth - 20)
                        .attr("height", function (d, i) {
                        if (i == 1)
                            return 2 * (textHeight + 6);
                        return textHeight + 6;
                    })
                        .on("mousedown", function () { d3.event.stopPropagation(); })
                        .on("click", (d, i) => {
                        switch (i) {
                            case 0:
                                {
                                    this._manyLens.CurrentClassifierMapID = d.mapID;
                                    if (this._hightlight_classifier_arrow)
                                        this._hightlight_classifier_arrow.remove();
                                    this._hightlight_classifier_arrow = d3.select("#mapSvg" + d.mapID)
                                        .append("path")
                                        .attr({
                                        id: "hightlight-arrow-line",
                                        "class": "highlight-arrow"
                                    })
                                        .attr("d", (d) => {
                                        return 'M' + (-50 + d.leftOffset + d.width * this._unit_width * 0.5) + ',-10L' + (d.leftOffset + d.width * this._unit_width * 0.5) + ',70';
                                    });
                                }
                                break;
                            case 1:
                                {
                                }
                                break;
                            case 2:
                                {
                                    this._manyLens.CurrentClassifierMapID = null;
                                    if (this._hightlight_classifier_arrow)
                                        this._hightlight_classifier_arrow.remove();
                                }
                                break;
                        }
                        this._classifier_context_menu.remove();
                        this._classifier_context_menu = null;
                    });
                    this._classifier_context_menu.append("line")
                        .attr({
                        x1: 10,
                        x2: 180,
                        y1: 40,
                        y2: 40
                    });
                }
                this._classifier_context_menu.attr("transform", "translate(" + [p[0], p[1]] + ")");
            }
            UpdateVisMap(index, visData) {
                this._brush.clear();
                this._brush_svg.remove();
                this._maps[index] = visData;
                this._heatMaps[index].UpdateNodeArray(this._unit_width, this._unit_height, visData.unitsData);
                this._heatMaps[index].transform(this._scale, 0, 0);
                this._heatMaps[index].transformPan(this._translate_x, this._translate_y, this._scale);
                var mapData = d3.select("#mapSvg" + visData.mapID).data()[0];
                var units = d3.select("#mapSvg" + visData.mapID).selectAll("rect.unit")
                    .data(visData.unitsData, function (d) { return d.unitID; });
                units.exit().remove();
                units.enter().append("rect")
                    .attr("x", (d) => { return mapData.leftOffset + d.x * this._unit_width; })
                    .attr("y", (d) => { return mapData.topOffset + d.y * this._unit_height; })
                    .attr({
                    "class": "unit",
                    width: this._unit_width,
                    height: this._unit_height
                });
                var labels = d3.selectAll("#mapSvg" + visData.mapID).selectAll("text.map.label").remove();
                var fontSizeScale = d3.scale.pow().domain(d3.extent(visData.labels, function (d) { return d.value; })).range([10, 30]);
                console.log(visData.labels);
                d3.selectAll("#mapSvg" + visData.mapID).selectAll("text.map.label")
                    .data(visData.labels, function (d) { return d.x + "-" + d.y; })
                    .enter().append("text")
                    .attr("x", (d) => { return mapData.leftOffset + d.x * this._unit_width; })
                    .attr("y", (d) => { return mapData.topOffset + d.y * this._unit_height; })
                    .attr("dy", (d) => { return this._unit_width; })
                    .attr({
                    "class": "map label"
                })
                    .style("font-size", (d) => {
                    return fontSizeScale(d.value) + "px";
                })
                    .text(function (d) { return d.label; });
            }
            ShowVisMap(visData, classifierID) {
                this._maps.push(visData);
                this._mapIDs.push(visData.mapID);
                this._top_offset = this._top_offset || (parseFloat(this._element.style("height")) - visData.height * this._unit_height) / 2;
                var newHeatMap = new MapArea.HeatMapLayer("mapCanvas" + visData.mapID, this._heatmap_container, visData.width, visData.height, this._unit_width, this._unit_height, this._top_offset, this._left_offset, visData.unitsData);
                newHeatMap.transform(this._scale, 0, 0);
                newHeatMap.transformPan(this._translate_x, this._translate_y, this._scale);
                this._heatMaps.push(newHeatMap);
                var svg = this._element
                    .append("g")
                    .data([{ mapID: visData.mapID, width: visData.width, height: visData.height, leftOffset: this._left_offset, topOffset: this._top_offset }])
                    .attr("id", function (d) { return "mapSvg" + d.mapID; })
                    .attr("class", "som-map")
                    .attr("transform", "translate(" + [this._translate_x, this._translate_y] + ")scale(" + this._scale + ")");
                svg.selectAll("rect.unit")
                    .data(visData.unitsData, function (d) { return d.unitID; })
                    .enter().append("rect")
                    .attr("x", (d) => { return this._left_offset + d.x * this._unit_width; })
                    .attr("y", (d) => { return this._top_offset + d.y * this._unit_height; })
                    .attr({
                    "class": "unit",
                    width: this._unit_width,
                    height: this._unit_height
                });
                var fontSizeScale = d3.scale.pow().domain(d3.extent(visData.labels, function (d) { return d.value; })).range([10, 30]);
                // console.log( visData.unitsData.filter( function ( d: UnitData ) { return d.isSpam; }) );
                //svg.selectAll( "text.map.spam" )
                //    .data( visData.unitsData.filter( function ( d: UnitData ) { return d.isSpam; }), function ( d ) { return d.unitID; })
                //    .enter().append( "text" )
                //    .attr( "x", ( d ) => { return this._left_offset + d.x * this._unit_width; })
                //    .attr( "y", ( d ) => { return this._top_offset + d.y * this._unit_height; })
                //    .attr( "dy", ( d ) => { return this._unit_width })
                //    .attr( {
                //        "class": "map spam"
                //    })
                //    .style( "font-size", ( d ) => {
                //        return fontSizeScale( d.value ) + "px";
                //    })
                //    .text( function ( d ) { return "spam"; })
                //    ;
                svg.selectAll("text.map.label")
                    .data(visData.labels, function (d) { return d.x + "-" + d.y; })
                    .enter().append("text")
                    .attr("x", (d) => { return this._left_offset + d.x * this._unit_width; })
                    .attr("y", (d) => { return this._top_offset + d.y * this._unit_height; })
                    .attr("dy", (d) => { return this._unit_width; })
                    .attr({
                    "class": "map label"
                })
                    .style("font-size", (d) => {
                    return fontSizeScale(d.value) + "px";
                })
                    .text(function (d) { return d.label; });
                console.log(visData);
                //Add the hightlight and contextmenu layout
                var line = d3.svg.line()
                    .x(function (d) { return d.x; })
                    .y(function (d) { return d.y; })
                    .interpolate("linear-closed");
                svg.append("path")
                    .data([{
                        mapID: visData.mapID,
                        path: [
                            { x: this._left_offset, y: this._top_offset },
                            { x: this._left_offset, y: this._top_offset + this._unit_height * visData.height },
                            { x: this._left_offset + this._unit_width * visData.width, y: this._top_offset + this._unit_height * visData.height },
                            { x: this._left_offset + this._unit_width * visData.width, y: this._top_offset }
                        ]
                    }])
                    .attr("d", function (d) { return line(d.path); })
                    .attr("class", "control-layout")
                    .on("contextmenu", (d) => {
                    this.ContextMenu(d.mapID);
                    d3.event.preventDefault();
                });
                //Whether to add the connection link
                if (classifierID) {
                    console.log(classifierID);
                    var classifierMap = d3.select("#mapSvg" + classifierID).data()[0];
                    //var linkArrow = svg.append("g").attr("class","classifier-link");
                    //var defs = linkArrow.append('svg:defs');
                    //                // define arrow markers for leading arrow
                    //                defs.append('svg:marker')
                    //                    .attr({
                    //                        'id': 'classifier-mark-end-arrow',
                    //                        'viewBox': '0 -5 10 10',
                    //                        'refX': 7,
                    //                        'markerWidth': 3.5,
                    //                        'markerHeight': 3.5,
                    //                        'orient': 'auto'
                    //                    })
                    //                    .append('path')
                    //                    .attr({
                    //                        'd':'M0,-5L10,0L0,5z'
                    //                    })
                    //                ;
                    var scale = d3.scale.linear().domain([classifierMap.width * this._unit_width, classifierMap.width * this._unit_width * 7]).range([0, -classifierMap.topOffset * 6]);
                    var gapWidth = 0.5 * (this._left_offset + classifierMap.leftOffset + (visData.width + classifierMap.width) * this._unit_width * 0.5);
                    svg.append("path")
                        .attr("class", "classifier-link")
                        .datum([
                        [classifierMap.leftOffset + classifierMap.width * this._unit_width * 0.5, classifierMap.topOffset],
                        [gapWidth, scale(gapWidth)],
                        [this._left_offset + visData.width * this._unit_width * 0.5, classifierMap.topOffset - 10]
                    ])
                        .attr("d", d3.svg.line().interpolate("basis"));
                }
                //whether to move or not
                this._left_offset += this._unit_width * visData.width + this._map_gap;
                var leftMost = this._left_offset * this._scale + this._translate_x;
                if (leftMost > this._total_width) {
                    var t = d3.interpolate(0, leftMost - this._total_width + this._map_gap);
                    var i = 0;
                    var sTx = this._translate_x;
                    clearInterval(this._move_view_timer);
                    this._move_view_timer = setInterval(() => {
                        this._translate_x = sTx - t(i / 100);
                        this._heatMaps.forEach((d) => {
                            d.transformPan(this._translate_x, this._translate_y, this._scale);
                        });
                        this._element.selectAll(".som-map")
                            .attr("transform", "translate(" + [this._translate_x, this._translate_y] + ")scale(" + this._scale + ")");
                        this._element.selectAll(".lens")
                            .attr("transform", (d) => {
                            if (d.cx == 0) {
                                d.cx = this._translate_x;
                                d.cy = this._translate_y;
                            }
                            d.scale = this._scale;
                            d.tx = this._translate_x - d.cx * d.scale;
                            d.ty = this._translate_y - d.cy * d.scale;
                            return "translate(" + [d.tx, d.ty] + ")scale(" + this._scale + ")";
                        });
                        this._zoom
                            .scale(this._scale)
                            .translate([this._translate_x, this._translate_y]);
                        this._element.call(this._zoom);
                        ++i;
                        if (i >= 100) {
                            clearInterval(this._move_view_timer);
                            this._move_view_timer = -1;
                        }
                    }, 2);
                }
            }
        }
        MapArea.SOMMap = SOMMap;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />s 
var ManyLens;
(function (ManyLens) {
    var MapArea;
    (function (MapArea) {
        class WorldMap extends D3ChartObject {
            constructor(element, manyLens) {
                super(element, manyLens);
                this._state = false;
                this._projection = d3.geo.equirectangular();
                this._path = d3.geo.path();
                this._color = d3.scale.sqrt();
                this._world_topojson_path = "./testData/countriesAlpha2.topo.json";
                this._zoom = d3.behavior.zoom();
                this._element.attr("height", function () {
                    let parentRect = this.parentNode.getBoundingClientRect();
                    let selfRect = this.getBoundingClientRect();
                    return parentRect.height - (selfRect.top - parentRect.top);
                });
                this._total_width = parseFloat(this._element.style("width"));
                this._total_height = parseFloat(this._element.style("height"));
                this._color
                    .range([
                    "rgb(158,202,225)",
                    //"rgb(158,202,225)",
                    //"rgb(107, 174, 214)",
                    //"rgb(66, 146, 198)",
                    //"rgb(33, 113, 181)",
                    "rgb(8, 81, 156)"
                ]);
                this._projection
                    .scale(1)
                    .rotate([80, 0])
                    .translate([0, 0]);
                this._path
                    .projection(this._projection);
                this._zoom
                    .scaleExtent([1, 3])
                    .on("zoomstart", () => {
                    //d3.event.sourceEvent.stopPropagation();
                })
                    .on("zoom", () => {
                    this.Zoom(d3.event.translate, d3.event.scale);
                })
                    .on("zoomend", () => {
                    //d3.event.sourceEvent.stopPropagation();
                });
                this._manyLens.ManyLensHubRegisterClientFunction(this, "upDateGeoMap", this.UpdateMap);
            }
            init() {
                this._element.on("mousedown", null);
                this._element
                    .on("dblclick", (d) => {
                    this.Country_Clicked(d);
                })
                    .call(this._zoom)
                    .on("dblclick.zoom", null);
            }
            Toggle() {
                if (this._state) {
                    this.RemoveMap();
                }
                else {
                    this.init();
                    this.Render();
                }
                this._state = !this._state;
            }
            RemoveMap() {
                this._map.transition().style("opacity", 0).remove();
            }
            UpdateMap(mapData) {
                this._color.domain(d3.extent(mapData, function (d) { return d.tweets.length; }));
                this._data = mapData;
                var countryColor = {};
                mapData.forEach((d) => {
                    countryColor[d.countryName] = d.tweets.length;
                });
                this._map.selectAll("path")
                    .attr("fill", (d) => {
                    return "rgb(198,219,239)";
                })
                    .transition()
                    .attr("fill", (d) => {
                    if (countryColor[d.id])
                        return this._color(countryColor[d.id]);
                    return "rgb(198,219,239)";
                });
            }
            Render() {
                if (this._world_topojson_data) {
                    this._projection
                        .scale(1)
                        .rotate([80, 0])
                        .translate([0, 0]);
                    // Compute the bounds of a feature of interest, then derive scale & translate.
                    var bounds = this._path.bounds(this._world_topojson_data);
                    var s = 0.99 / Math.max((bounds[1][0] - bounds[0][0]) / this._total_width, (bounds[1][1] - bounds[0][1]) / (this._total_height));
                    this._center_xy = [(this._total_width - s * (bounds[1][0] + bounds[0][0])) / 2, (this._total_height - s * (bounds[1][1] + bounds[0][1])) / 2];
                    this._projection
                        .scale(s)
                        .translate(this._center_xy);
                    this._map = this._element.append("g")
                        .attr("id", "world-countries");
                    this._map.selectAll("path")
                        .data(this._world_topojson_data.features, function (d) { return d.id; })
                        .enter()
                        .append("path")
                        .attr("id", function (d) { return d.id; })
                        .attr("d", this._path)
                        .attr("fill", (d) => {
                        return "rgb(198,219,239)";
                    })
                        .style({
                        stroke: "#fff",
                        "stoke-width": "0.5px"
                    })
                        .on("dblclick", (d) => {
                        d3.event.stopPropagation();
                        this.Country_Clicked(d);
                    });
                }
                else {
                    d3.json(this._world_topojson_path, (error, world) => {
                        this._world_topojson_data = topojson.feature(world, world.objects.countries);
                        // Compute the bounds of a feature of interest, then derive scale & translate.
                        var bounds = this._path.bounds(this._world_topojson_data);
                        var s = 0.99 / Math.max((bounds[1][0] - bounds[0][0]) / this._total_width, (bounds[1][1] - bounds[0][1]) / (this._total_height));
                        this._center_xy = [(this._total_width - s * (bounds[1][0] + bounds[0][0])) / 2, (this._total_height - s * (bounds[1][1] + bounds[0][1])) / 2];
                        this._projection
                            .scale(s)
                            .translate(this._center_xy);
                        this._map = this._element.append("g")
                            .attr("id", "world-countries");
                        this._map.selectAll("path")
                            .data(this._world_topojson_data.features, function (d) { return d.id; })
                            .enter()
                            .append("path")
                            .attr("id", function (d) { return d.id; })
                            .attr("d", this._path)
                            .attr("fill", (d) => {
                            return "rgb(198,219,239)";
                        })
                            .style({
                            stroke: "#fff",
                            "stoke-width": "0.5px"
                        })
                            .on("dblclick", (d) => {
                            d3.event.stopPropagation();
                            this.Country_Clicked(d);
                        });
                    });
                }
            }
            Country_Clicked(d) {
                //if(this._target_country){
                //    this._map.selectAll("#"+this._target_country.id).style("display",null);
                //}
                if (d && this._target_country !== d) {
                    var xyz = this.Get_XYZ(d);
                    this._target_country = d;
                    console.log("d and different country");
                    this.Click_Zoom(xyz);
                }
                else {
                    this._target_country = null;
                    this.Click_Zoom([this._center_xy[0], this._center_xy[1], 1]);
                }
            }
            Get_XYZ(d) {
                var bounds = this._path.bounds(d);
                var w_scale = (bounds[1][0] - bounds[0][0]) / this._total_width;
                var h_scale = (bounds[1][1] - bounds[0][1]) / this._total_height;
                var z = .96 / Math.max(w_scale, h_scale);
                var x = (bounds[1][0] + bounds[0][0]) / 2;
                var y = (bounds[1][1] + bounds[0][1]) / 2 + (this._total_height / z / 6);
                return [x, y, z];
            }
            Click_Zoom(xyz) {
                this._map.transition().duration(500)
                    .attr("transform", "translate(" + this._projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
                    .style("stroke-width", 1.0 / xyz[2] + "px");
                this._zoom
                    .translate([
                    -xyz[0] * xyz[2] + this._projection.translate()[0],
                    -xyz[1] * xyz[2] + this._projection.translate()[1]
                ])
                    .scale(xyz[2]);
                this._element
                    .call(this._zoom)
                    .on("dblclick.zoom", null);
                ;
                this._scale = xyz[2];
            }
            Zoom(translate, scale) {
                if (d3.event.sourceEvent.type == "wheel") {
                    //if(d3.event.scale > this._scale){
                    //    this._zoom
                    //        .center(null);
                    //}else{
                    //    this._zoom
                    //        .center(this._center_xy);
                    //}
                    //this._element
                    //    .call(this._zoom)
                    //    .on("dblclick.zoom", null);
                    //;
                    this._map
                        .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
                        .style("stroke-width", 1.0 / scale + "px");
                    this._scale = scale;
                }
                else if (d3.event.sourceEvent.type == "mousemove") {
                    this._projection.rotate([translate[0] + 80]);
                    this._map.selectAll("path")
                        .data(this._world_topojson_data.features, function (d) { return d.id; })
                        .attr("d", this._path);
                    //    this._zoom.translate([
                    //            0,0
                    //        ]);
                    //     this._element
                    //    .call(this._zoom)
                    //    .on("dblclick.zoom", null);
                    //;
                }
            }
        }
        MapArea.WorldMap = WorldMap;
    })(MapArea = ManyLens.MapArea || (ManyLens.MapArea = {}));
})(ManyLens || (ManyLens = {}));
///<reference path = "../Lens/LensList.ts" />
//module ManyLens {
//    export module Pane {
//        interface PaneG {
//            svg_g: D3.Selection;
//            timer: number;
//            isOpened: boolean;
//        }
//        export class BlossomLensPane extends D3ChartObject {
//            //private _lens: Array<Lens.BaseD3Lens> = new Array<Lens.BaseD3Lens>();
//            private _pane_radius: number = 100;
//            private _pane_arc: D3.Svg.Arc = d3.svg.arc();
//            private _pane_pie: D3.Layout.PieLayout = d3.layout.pie();
//            private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
//            private _current_pane_g: PaneG = null;
//            private _lens_count: number = 2;
//            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
//                super(element,manyLens);
//                this._manyLens = manyLens;
//                this._pane_pie
//                    .startAngle(-Math.PI / 2)
//                    .endAngle(Math.PI / 2).value(() => { return 1; });
//                this._pane_arc
//                    .innerRadius(this._pane_radius - 40)
//                    .outerRadius(this._pane_radius)
//                ;
//            }
//            public Render(): void {
//                var container = this._element;
//                container.on("click", () => {
//                    this.OpenPane();
//                });
//            }
//            private OpenPane() {
//                if (this._current_pane_g && this._current_pane_g.isOpened) {
//                    (() => {
//                        this.ClosePane("click close");
//                    })();
//                }
//                var p = d3.mouse(this._element[0][0]);
//                var timer = setTimeout(() => { this.ClosePane("time out close"); }, 2000);
//                var svg = this._element
//                    .append("g")
//                    .attr("transform", "translate(" + p[0] + "," + p[1] + ")");
//                svg.selectAll("circle")
//                    .data(this._pane_pie([1, 1, 1, 1, 1]))
//                    .enter().append("circle")
//                    .attr("class", "pane-Lens-Circle")
//                    .attr("id", (d, i) => { return "lens" + i; })
//                    .style("fill", (d, i) => { return this._pane_color(i); })
//                    .attr("r", 10)
//                    .on("mouseover", () => {
//                        clearTimeout(this._current_pane_g.timer);
//                    })
//                    .on("mouseout", () => {
//                        this._current_pane_g.timer = setTimeout(() => {
//                            this.ClosePane("time out close");
//                        }, 1000);
//                    })
//                    .on("click", (d, i) => {
//                        var len: Lens.BaseD3Lens;
//                        switch (i) {
//                            case 0: {
//                                len = new Lens.BarChartLens(this._element,this._manyLens);
//                                break;
//                            }
//                            case 1: {
//                                len = new Lens.MapLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 2: {
//                                len = new Lens.TreeNetworkLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 3: {
//                                len = new Lens.PieChartLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 4: {
//                                len = new Lens.WordCloudLens(this._element, this._manyLens);
//                                break;
//                            }
//                        }
//                        //this._lens.push(len);
//                        len.Render(this._pane_color(i));
//                        //this._history_trees.addNode({ color: this._pane_color(i), lensType: len.Type, tree_id: 0 });
//                        d3.event.stopPropagation();
//                        this.ClosePane("select a lens");
//                    })
//                    .transition().duration(750)
//                    .attr("transform", (d) => {
//                        return "translate(" + this._pane_arc.centroid(d) + ")";
//                    })
//                ;
//                this._current_pane_g = { svg_g: svg, timer: timer, isOpened: true };
//            }
//            private ClosePane(msg: string) {
//                console.log(msg);
//                var t = 400;
//                var closeG = this._current_pane_g;
//                clearTimeout(closeG.timer);
//                closeG.isOpened = false;
//                closeG.svg_g
//                    .selectAll(".paneCircle")
//                    .transition().duration(t)
//                    .attr("transform", "translate(0)")
//                    .remove()
//                ;
//                setTimeout(() => { closeG.svg_g.remove(); }, t);
//            }
//        }
//    }
//} 
///<reference path = "../D3ChartObject.ts" />
///<reference path = "../Lens/LensList.ts" />
//module ManyLens {
//    export module Pane {
//        interface PaneG {
//            svg_g: D3.Selection;
//            lens_count: number;
//            lens_icon_r: number;
//            lens_icon_padding: number;
//            x: number;
//            y: number;
//            rect_width: number;
//            rect_height: number;
//        }
//        export class ClassicLensPane extends D3ChartObject {
//            private _lens_count: number = 6;
//            private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
//            private _pang_g: PaneG;
//            //private _history_trees: LensHistory.HistoryTrees;
//            private _drag: D3.Behavior.Drag = d3.behavior.drag();
//            constructor(element: D3.Selection,manyLens:ManyLens.ManyLens) {
//                super(element,manyLens);
//                this._manyLens = manyLens;
//                this._drag
//                    .origin(function (d) {
//                        return d;
//                    })
//                    .on("drag", () => {
//                        this.DragFunc();
//                    });
//                var pane_icon_r: number = 10;
//                var pane_icon_padding: number = 10;
//                this._pang_g = {
//                    svg_g: this._element.append("g"),
//                    x: parseFloat( this._element.style("width")) - 3 * (pane_icon_r + pane_icon_padding),
//                    y: 10,
//                    rect_height: (this._lens_count * pane_icon_r * 2) + (this._lens_count + 1) * pane_icon_padding,
//                    rect_width: 2 * (pane_icon_r + pane_icon_padding),
//                    lens_icon_r: pane_icon_r,
//                    lens_icon_padding: pane_icon_padding,
//                    lens_count: this._lens_count
//                };
//            }
//            public Render(): void {
//                this.OpenPane();
//            }
//            private OpenPane() {
//                var container = this._element;
//                var pane_g = this._pang_g.svg_g.data([this._pang_g])
//                    .attr("class", "lensPane")
//                    .attr("transform", "translate(" + [this._pang_g.x, this._pang_g.y] + ")")
//                    .call(this._drag);
//                pane_g.append("rect")
//                    .attr("x", 0)
//                    .attr("y", 0)
//                    .attr("width", this._pang_g.rect_width)
//                    .attr("height", this._pang_g.rect_height)
//                    .attr("fill", "#fff7bc")
//                    .attr("stroke", "pink")
//                    .attr("stroke-width", 2)
//                ;
//                pane_g.selectAll("circle").data(d3.range(this._lens_count))
//                    .enter().append("circle")
//                    .attr("class", "pane-Lens-Circle")
//                    .attr("r", this._pang_g.lens_icon_r)
//                    .attr("cx", this._pang_g.rect_width / 2)
//                    .attr("cy", (d, i) => {
//                        return this._pang_g.lens_icon_r
//                            + this._pang_g.lens_icon_padding
//                            + i * (2 * this._pang_g.lens_icon_r + this._pang_g.lens_icon_padding);
//                    })
//                    .attr("fill", (d, i) => { return this._pane_color(i); })
//                    .on("mousedown", function () {
//                        d3.event.stopPropagation();
//                    })
//                    .on("click", (d, i) => {
//                        var len: Lens.BaseD3Lens;
//                        switch (i) {
//                            case 0: {
//                                len = new Lens.NetworkLens(this._element,this._manyLens);
//                                break;
//                            }
//                            case 1: {
//                                len = new Lens.WordCloudLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 2: {
//                                len = new Lens.PieChartLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 3: {
//                                len = new Lens.MapLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 4: {
//                                len = new Lens.BarChartLens(this._element, this._manyLens);
//                                break;
//                            }
//                            case 5: {
//                                len = new Lens.TreeNetworkLens(this._element, this._manyLens);
//                                break;
//                            }
//                        }
//                        len.Render(this._pane_color(i));
//                        d3.event.stopPropagation();
//                    })
//                ;
//            }
//            private ClosePane(msg: string) {
//            }
//            private DragFunc() {
//                var pane_rect_width = this._pang_g.rect_width;
//                var pane_rect_height = this._pang_g.rect_height;
//                this._pang_g.svg_g
//                    .attr("transform", "translate(" + [
//                        this._pang_g.x = Math.max(0, Math.min(parseFloat(this._element.style("width")) - pane_rect_width, d3.event.x)),
//                        this._pang_g.y = Math.max(0, Math.min(parseFloat(this._element.style("height")) - pane_rect_height, d3.event.y))
//                    ] + ")");
//            }
//        }
//    }
//} 
///<reference path = "../D3ChartObject.ts" />
var ManyLens;
(function (ManyLens) {
    var TweetsCurve;
    (function (TweetsCurve) {
        class Curve extends D3ChartObject {
            constructor(element, manyLens) {
                super(element, manyLens);
                this._x_scale = d3.scale.linear();
                this._x_axis_gen = d3.svg.axis();
                this._y_scale = d3.scale.linear();
                this._y_axis_gen = d3.svg.axis();
                this._fisheye_scale = d3.fisheye.ordinal();
                this._section_num = 30;
                this._view_padding = { top: 50, bottom: 25, left: 50, right: 50 };
                this._coordinate_margin_left = 800;
                this._stack_time_id_gen = 0;
                this.week_days_name = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fir.", "Sat."];
                this.month_names = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
                this._voronoi_bound = null;
                this._voronoi = null;
                this._voronoi_color = null;
                this._voronoi_scale = null;
                this._voronoi_color_scale = null;
                this._voronoi_linear_feature = null;
                this._voronoi_feature_need_to_be_log = null;
                this._hack_entropy_for_sec = [5.52801983771866, 5.4039073835042, 5.45938781932472, 5.64250743333429, 4.93032087118836, 5.315961448569, 5.39588776065466, 4.65898722238974, 5.13062979174002, 5.33309072510927, 5.35641786696894, 5.60797765267891, 5.64988387523317, 5.59482123218907, 5.46264173515833, 5.48856459015412, 5.44034190298265, 5.45128763318033, 5.44438920405449, 5.48815635174213, 5.45029239874735, 5.48162359658213, 5.51425058455734, 5.46563788562995, 5.57272780600828, 5.46330296730694, 5.60273582067599, 5.62644804054953, 5.48286388833526, 5.52113525835715, 5.25754958192342, 5.34289384247398, 5.59875662298071, 5.26862406827515, 5.14805360492649, 5.54249244750256, 5.67943507560486, 5.71068019153901, 5.75938133509502, 5.76902770549809, 5.6978968138835, 5.91515365891259, 5.72912057307722, 5.65503261937499, 5.62699617989156, 5.48299298221877, 5.31362137362927, 5.51686127735103, 5.75727656236623, 5.65465538965307, 5.64206521599416, 5.61403218348421, 5.80250439167188, 5.91731972764689, 5.86487350971147, 5.38274841815246, 5.62215477204897, 5.70056092633215, 5.60632734047604];
                this._hack_entropy_for_minute = [5.1308094928495, 4.91187594269681, 5.35133901571066, 5.51111302509791, 5.29629862396475, 5.28875741449833, 5.25065848788969, 4.95496661930616];
                //Day is for ebola
                this._hack_entropy_for_day_fullyear = [5.69374880264309, 5.54071690329108, 5.21375567493723, 5.7364591001623, 5.67266804090054, 5.44788632513456, 5.56507687813503, 5.30118124849182, 6.38924928692222, 5.49292138443575, 5.66255265557558, 5.68311929804944, 5.50092376414015, 5.26100836113391, 5.66074791315102, 5.80350167185585, 5.19784721560846, 5.43950287241348, 5.75844480001013, 5.96897758889492, 5.96287129509671, 5.86295184921975, 6.01269251274121, 5.68335437493067, 5.82393867456836, 5.7277711426753, 5.83250284442861, 6.10911174676642, 5.89750917427565, 5.74017174495036, 5.52521691479035, 5.99649012948925, 5.9454798874942];
                this._data = new Array();
                this._section_data = {};
                this._stack_bar_nodes_data = new Array();
                this._view_height = parseFloat(this._element.style("height")) - 30;
                this._view_width = parseFloat(this._element.style("width"));
                this._sub_view_height = this._view_height - this._view_padding.bottom;
                this._sub_view_width = this._coordinate_margin_left + this._view_padding.left;
                this._x_scale
                    .domain([0, this._section_num])
                    .range([this._view_padding.left + this._coordinate_margin_left, this._view_width - this._view_padding.right]);
                this._y_scale
                    .domain([0, 10000])
                    .range([this._view_height - this._view_padding.bottom, this._view_padding.top]);
                this._x_axis_gen
                    .scale(d3.time.scale()
                    .domain([0, this._section_num])
                    .range([this._view_padding.left + this._coordinate_margin_left, this._view_width - this._view_padding.right]))
                    .ticks(0)
                    .orient("bottom");
                this._y_axis_gen
                    .scale(this._y_scale)
                    .ticks(5)
                    .orient("left");
                this._fisheye_scale
                    .rangeRoundBands([0, this._sub_view_width])
                    .focus(this._coordinate_margin_left + this._view_padding.left);
                this._voronoi = d3.geom.voronoi()
                    .x(function (d) { return d['x']; })
                    .y(function (d) { return d['y']; });
                this._voronoi_color = d3.scale.category20()
                    .domain(['tweetLength', 'follower', 'isV', 'hastagCount']);
                this._voronoi_scale = this._coordinate_margin_left / 800;
                this._voronoi_color_scale = {
                    'follower': d3.scale.quantize().range(['#FFFDE7', '#FFF59D', '#FFEE58', '#FBC02D']),
                    'isV': d3.scale.ordinal().domain([0, 1]).range(['#E0F7FA', '#00BCD4']),
                    'sentiment': d3.scale.quantize().domain([0, 1, 2, 3, 4]).range(['#C62828', '#F44336', '#FAFAFA', '#A5D6A7', '#4CAF50'])
                };
                this._voronoi_linear_feature = {
                    'follower': true,
                    'kloutScore': true,
                    'tweetsCount': true,
                };
                this._voronoi_feature_need_to_be_log = {
                    'follower': true,
                    'tweetsCount': true,
                };
                this._time_formater = d3.time.format("%Y%m%d%H%M%S");
                this._root = {
                    id: "root",
                    name: "",
                    type: "null",
                    date: null,
                    parent: null,
                    children: []
                };
                this._stack_bar_tree = d3.layout.tree()
                    .size([this._sub_view_width - 50, this._sub_view_height - 0])
                    .separation(function (a, b) {
                    if (a.parent == b.parent) {
                        if (a.children && b._children)
                            return 2 / ((a.depth + 1) * (a.depth + 1));
                    }
                    return 1 / ((a.depth + 1) * (a.depth + 1));
                });
                this._stack_bar_tree_diagonal = d3.svg.diagonal();
                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction(this, "addPoint", this.AddPoint);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "print", (msg) => {
                    console.log(msg);
                });
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "clusterInterval", this.ClusterInterval );
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "timeInterval", this.TimeInterval );
            }
            get Section_Num() {
                return this._section_num;
            }
            set Section_Num(num) {
                if (typeof num === 'number') {
                    this._section_num = Math.ceil(num);
                }
            }
            get StackID() {
                return "id" + this._stack_time_id_gen++;
            }
            Render() {
                super.Render(null);
                var coordinate_view_width = this._view_width - this._view_padding.left - this._view_padding.right;
                this._element.select(".progress").style("display", "none");
                this._curveSvg = this._element.insert("svg", ".progress")
                    .attr("width", this._view_width)
                    .attr("height", this._view_height)
                    .style("margin-bottom", "17px");
                this._subView = this._curveSvg.append("g")
                    .attr("clip-path", "url(#stackRectClip)")
                    .append("g")
                    .attr("id", "curve-subView")
                    .attr("transform", "translate(0,-30)");
                this._curveSvg.append("defs").append("clipPath")
                    .attr("id", "curveClip")
                    .append("rect")
                    .attr("width", coordinate_view_width)
                    .attr("height", this._view_height + this._view_padding.bottom + this._view_padding.top)
                    .attr("x", this._view_padding.left + this._coordinate_margin_left)
                    .attr("y", 0);
                this._mainView = this._curveSvg.append("g")
                    .attr("clip-path", "url(#curveClip)")
                    .append("g")
                    .attr("id", "curve-mainView");
                this._x_axis = this._curveSvg.append("g")
                    .attr("class", "curve x axis")
                    .attr("transform", "translate(" + [0, (this._view_height - this._view_padding.bottom)] + ")")
                    .call(this._x_axis_gen);
                this._y_axis = this._curveSvg.append("g")
                    .attr("class", "curve y axis")
                    .attr("transform", "translate(" + (this._coordinate_margin_left + this._view_padding.left) + ",0)")
                    .call(this._y_axis_gen);
            }
            PullInterval(interalID, classifierID) {
                if (ManyLens.TestMode)
                    this._manyLens.ManyLensHubServerTestPullInterval(interalID);
                else {
                    this._manyLens.ManyLensHubServerPullInterval(interalID, classifierID)
                        .progress((percent) => {
                        this._element.select(".progress-bar")
                            .style("width", percent * 100 + "%");
                    })
                        .done(() => {
                        this._element.select(".progress-bar")
                            .style("width", 0);
                        this._element.select(".progress").style("display", "none");
                        this._curveSvg.style("margin-bottom", "17px");
                    });
                }
            }
            AddPoint(point) {
                this._data.push(point);
                this.RefreshGraph(point);
                if (this._data.length > this._section_num + 1) {
                    this._data.shift();
                }
            }
            InserNode(name, data) {
                var node = this._root[name], i;
                if (!node) {
                    node = this._root[name] = data || {
                        id: this.StackID,
                        date: null,
                        name: "",
                        parent: null,
                        children: [],
                        type: name
                    };
                    if (name.length) {
                        node.parent = this.InserNode(name.substring(0, i = name.lastIndexOf("-")));
                        node.parent.children.push(node);
                        node.name = name.substring(i + 1);
                    }
                }
                return node;
            }
            Toggle(node) {
                if (node == null)
                    return;
                if (node.children) {
                    node._children = node.children;
                    node.children = null;
                }
                else {
                    node.children = node._children;
                    node._children = null;
                }
            }
            FindMinCoParent(a, b) {
                if (!a || !b)
                    return null;
                if (!a.parent || !b.parent)
                    return null;
                if (a.parent.id == b.parent.id) {
                    if (!a.date)
                        return a;
                    else
                        return null;
                }
                return this.FindMinCoParent(a.parent, b.parent);
            }
            SumEntropy(node) {
                if (!node)
                    return 0;
                if (!node.children && !node._children)
                    return this._hack_selected_entropy[node.index];
                var sum = 0;
                if (node.children)
                    node.children.forEach((d) => {
                        sum += this.SumEntropy(d);
                    });
                else if (node._children)
                    node._children.forEach((d) => {
                        sum += this.SumEntropy(d);
                    });
                return sum;
            }
            CalVoronoi(fs, constR) {
                var self = this;
                const _fs = {};
                // const _type_follower = 'follower';
                // var _follower_range = { max: -Infinity, min: Infinity };
                if (!fs[0].x) {
                    //init seed position
                    const step = 2 * Math.PI / fs.length;
                    for (let i = 0, len = fs.length; i < len; ++i) {
                        const angle = step * i;
                        const r = Math.random() * constR * 0.8;
                        fs[i].x = r * Math.cos(angle);
                        fs[i].y = r * Math.sin(angle);
                    }
                }
                for (var i = 0, len = fs.length; i < len; ++i) {
                    const feature_type = fs[i].feature_type;
                    if (feature_type in this._voronoi_linear_feature) {
                        let feature_value = fs[i].feature_value;
                        if (!(feature_type in _fs)) {
                            _fs[feature_type] = { max: -Infinity, min: Infinity };
                        }
                        if (fs[i].feature_type in this._voronoi_feature_need_to_be_log) {
                            feature_value = Math.log(feature_value);
                        }
                        _fs[feature_type].max = d3.max([_fs[feature_type].max, feature_value]);
                        _fs[feature_type].min = d3.min([_fs[feature_type].min, feature_value]);
                    }
                }
                for (let feature_type in _fs) {
                    const scaleDomain = this._voronoi_color_scale[feature_type].domain();
                    if (_fs[feature_type].max > scaleDomain[1]) {
                        this._voronoi_color_scale[feature_type].domain([scaleDomain[0], _fs[feature_type].max]);
                        this._subView.selectAll('g.cell path')
                            .style('fill', (d) => {
                            let _feature_vlaue = d.feature_value;
                            if (d.feature_type in this._voronoi_feature_need_to_be_log) {
                                _feature_vlaue = Math.log(_feature_vlaue);
                            }
                            return this._voronoi_color_scale[d.feature_type](_feature_vlaue);
                        });
                    }
                }
                var iteration = 0;
                var cnt = 0;
                while (cnt < 5) {
                    var polygon = this._voronoi(fs);
                    var dist = 0;
                    for (var i = 0; i < polygon.length; ++i) {
                        //for each voronoi polygon, clip their boundary
                        var tempPolygon = this._voronoi_bound.clip(polygon[i]);
                        var centroid = d3.geom.polygon(tempPolygon).centroid();
                        if (!isNaN(centroid[0]) && !isNaN(centroid[1])) {
                            fs[i]['p'] = tempPolygon;
                            dist += (fs[i]['x'] - centroid[0]) * (fs[i]['x'] - centroid[0])
                                + (fs[i]['y'] - centroid[1]) * (fs[i]['y'] - centroid[1]);
                            fs[i]['x'] = centroid[0];
                            fs[i]['y'] = centroid[1];
                        }
                        else {
                            dist += 1000000;
                        }
                    }
                    dist /= polygon.length;
                    if (dist <= constR * 0.05) {
                        cnt++;
                    }
                    else {
                        cnt = 0;
                    }
                    iteration++;
                    if (iteration > 10000)
                        break;
                }
            }
            UpdateSubviewTree(exitParent, mode = true) {
                var duration = 500;
                var self = this;
                switch (this._manyLens.TimeSpan) {
                    case 3:
                        this._hack_selected_entropy = this._hack_entropy_for_sec;
                        break;
                    case 2:
                        this._hack_selected_entropy = this._hack_entropy_for_minute;
                        break;
                    case 0:
                        this._hack_selected_entropy = this._hack_entropy_for_day_fullyear;
                        break;
                }
                var colorScale = d3.scale.linear().domain(d3.extent(this._hack_selected_entropy))
                    .range(["#C5EFF7", "#34495E"]);
                var arcScale = d3.scale.linear().domain(d3.extent(this._hack_selected_entropy))
                    .range([0, 1]);
                var constR = this._x_scale(1) - this._x_scale(0);
                var arc = d3.svg.arc().innerRadius(constR * this._voronoi_scale + 1).outerRadius(constR * this._voronoi_scale + 2.5).startAngle(0); // 16 18
                // constR *= 0.9;
                //Nodes
                var nodex = this._stack_bar_tree.nodes(this._root[""]).filter(function (d) {
                    return d.name != ""; //&& d.name != "day2";
                });
                this._stack_bar_node = this._subView.selectAll(".stack.node")
                    .data(nodex, d => d.id);
                //Enter node
                var enterNode = this._stack_bar_node
                    .enter().append("g")
                    .attr("class", "stack node")
                    .attr("transform", (d) => {
                    if (d.date && mode)
                        return "translate(" + [this._sub_view_width, d.oy] + ")";
                    return "translate(" + [d.parent.x, d.parent.y] + ")";
                });
                enterNode.filter(d => d.parent)
                    .on("click", (d) => {
                    this.Toggle(d);
                    this.UpdateSubviewTree(d, false);
                })
                    .transition().duration(duration)
                    .attr("transform", d => "translate(" + [d.x, d.y] + ")");
                enterNode.filter(d => d.date)
                    .each(function (d) {
                    this.appendChild(document.getElementById("cells_group" + d.id));
                    var cellsGroup = d3.select("#cells_group" + d.id)
                        .classed("curve", false)
                        .style("opacity", null)
                        .attr("transform", null);
                    cellsGroup.transition().duration(duration)
                        .attr("transform", "scale(" + self._voronoi_scale + ")");
                    if (cellsGroup.select('.entropy-ring').empty()) {
                        cellsGroup.append('path')
                            .attr('class', 'entropy-ring')
                            .attr('d', function () {
                            arc.endAngle(2 * Math.PI * arcScale(self.SumEntropy(d) / sumLength(d)));
                            return arc([0]);
                        });
                    }
                })
                    .on("click", (d) => {
                    this.SelectSegment(d);
                });
                enterNode.filter(d => !d.date)
                    .append('circle')
                    .attr('r', 7)
                    .style("fill", d => colorScale(this.SumEntropy(d) / sumLength(d)));
                enterNode.append("text")
                    .attr("x", function (d) {
                    if (d.date || (d.name[0] == "d" && d._children))
                        return -10;
                    return 5;
                })
                    .attr("dy", function (d) {
                    if (d.date || (d.name[0] == "d" && d._children))
                        return "50";
                    return ".35em";
                })
                    .attr("text-anchor", "start")
                    .text((d) => {
                    if (d.name[0] == "y") {
                        return d.name.substring(4);
                    }
                    else if (d.name[0] == "m") {
                        return this.month_names[parseInt(d.name.substring(d.name.indexOf("h") + 1))];
                    }
                    else if (d.name[0] == "d") {
                        return d.name.substring(d.name.indexOf("y") + 1); //this.week_days_name[parseInt( d.name[d.name.length - 1] )];
                    }
                    else if (d.name[0] == "h") {
                        return d.name.substring(4) + ":00";
                    }
                    else if (d.name[0] == "M") {
                        return d.name.substring(3);
                    }
                    return "Sub event";
                })
                    .style("fill-opacity", 1e-6)
                    .transition().duration(duration)
                    .style("fill-opacity", 1);
                //Update node
                function sumLength(d) {
                    if (!d)
                        return 0;
                    if (!d.children && !d._children)
                        return 1;
                    var sum = 0;
                    if (d.children)
                        d.children.forEach((d) => {
                            sum += sumLength(d);
                        });
                    else if (d._children)
                        d._children.forEach((d) => {
                            sum += sumLength(d);
                        });
                    return sum;
                }
                function getFeatures(d) {
                    if (!d)
                        return null;
                    if (!d.children && !d._children) {
                        return self._section_data[d.id].features;
                    }
                    var fs = [];
                    if (d.children) {
                        d.children.forEach((d) => {
                            fs.concat(getFeatures(d));
                        });
                    }
                    else if (d._children) {
                        d._children.forEach((d) => {
                            fs = fs.concat(getFeatures(d));
                        });
                    }
                    return fs;
                }
                this._stack_bar_node
                    .transition().duration(duration)
                    .attr("transform", d => "translate(" + [d.x, d.y] + ")");
                this._stack_bar_node.selectAll("circle")
                    .filter(d => d.children || d._children)
                    .transition().duration(duration)
                    .style("fill", d => d._children ? "#fff" : "#E87E04");
                this._stack_bar_node
                    .filter(d => d._children)
                    .each(function (d) {
                    var voronoi = document.getElementById('cells_group' + d.id);
                    if (!voronoi) {
                        var fs = getFeatures(d);
                        self.CalVoronoi(fs, constR);
                        var tempVoronoi = self._subView.append('g')
                            .attr('class', 'cells')
                            .attr('id', 'cells_group' + d.id)
                            .style('opacity', 1e-6)
                            .attr("transform", function () {
                            var scale = sumLength(d);
                            return "scale(" + (self._voronoi_scale * Math.sqrt(scale) * 0.9) + ")";
                        });
                        tempVoronoi.append('path')
                            .attr('class', 'entropy-ring')
                            .attr('d', function () {
                            arc.endAngle(2 * Math.PI * arcScale(self.SumEntropy(d) / sumLength(d)));
                            return arc([0]);
                        });
                        // .attr( 'transform', "scale(" + ( 1 / self._voronoi_scale ) + ")" );
                        tempVoronoi.selectAll(".cell")
                            .data(fs)
                            .enter().append("g")
                            .attr("class", "cell")
                            .append("path")
                            .attr("d", d => "M" + d.p.join("L") + "Z")
                            .style("fill", d => {
                            let _feature_vlaue = d.feature_value;
                            if (d.feature_type in self._voronoi_feature_need_to_be_log) {
                                _feature_vlaue = Math.log(_feature_vlaue);
                            }
                            return self._voronoi_color_scale[d.feature_type](_feature_vlaue);
                            // self._voronoi_color_scale[d.feature_type]( d.feature_type === 'follower' ? Math.log( d.feature_value ) : d.feature_value )
                        })
                            .style("stroke", 'lightgrey')
                            .style("stroke-width", 0)
                            .on('mouseout', function (d) {
                            d3.select(this.parentNode.parentNode.parentNode).select("#cell-tip").remove();
                        })
                            .on('mouseover', function (d) {
                            var mouse = d3.mouse(this);
                            d3.select(this.parentNode.parentNode.parentNode)
                                .append('text')
                                .attr('x', mouse[0])
                                .attr('y', mouse[1])
                                .attr('id', 'cell-tip')
                                .text(d.feature_type + ":" + d.feature_value);
                        });
                        voronoi = tempVoronoi.node();
                    }
                    d3.select(voronoi).transition().duration(100).style('opacity', 1);
                    this.appendChild(voronoi);
                });
                this._stack_bar_node.filter(d => d.children)
                    .each(function (d) {
                    var voronoi = document.getElementById('cells_group' + d.id);
                    if (voronoi) {
                        d3.select(voronoi)
                            .transition().duration(100)
                            .style('opacity', 1e-6).each('end', function (d) {
                            self._subView.each(function () {
                                this.appendChild(voronoi);
                            });
                        });
                    }
                });
                this._stack_bar_node.selectAll("text")
                    .filter(function (d) { return d && (d.children || d._children); })
                    .transition()
                    .attr("x", d => d._children ? -15 : 5)
                    .attr("dy", d => d._children ? 50 : ".35em")
                    .style("fill-opacity", 1);
                //Exit node
                var exitNode = this._stack_bar_node.exit();
                exitNode
                    .transition().duration(duration)
                    .each('end', function (d) {
                    d3.select("#curve-subView").each(function () {
                        this.appendChild(document.getElementById("cells_group" + d.id));
                    });
                })
                    .attr("transform", function (d) {
                    if (exitParent) {
                        d.x = exitParent.x;
                        d.y = exitParent.y;
                    }
                    return "translate(" + [d.x, d.y] + ")";
                })
                    .remove();
                exitNode.selectAll("g.cells").transition().style('opacity', 1e-6);
                exitNode.select("circle").transition().attr("r", 1e-6);
                exitNode.select("text").transition().style("fill-opacity", 1e-6);
                //Links
                this._stack_bar_link = this._subView.selectAll(".stack.link")
                    .data(this._stack_bar_tree.links(nodex), function (d) { return d.source.id + "-" + d.target.id; });
                //Enter link
                this._stack_bar_link
                    .enter().insert("path", ".stack.node")
                    .attr("class", "stack link")
                    .attr("d", (d) => {
                    var o = { x: d.source.x, y: d.source.y };
                    var result = this._stack_bar_tree_diagonal({ source: o, target: o });
                    return result;
                })
                    .transition().duration(duration)
                    .attr("d", this._stack_bar_tree_diagonal);
                //Update link
                this._stack_bar_link
                    .transition().duration(duration)
                    .attr("d", this._stack_bar_tree_diagonal);
                //Exit link
                this._stack_bar_link.exit()
                    .transition().duration(duration)
                    .attr("d", (d) => {
                    if (exitParent) {
                        d.x = exitParent.x;
                        d.y = exitParent.y;
                    }
                    var o = { x: d.x, y: d.y };
                    return this._stack_bar_tree_diagonal({ source: o, target: o });
                })
                    .remove();
            }
            GetStackNodeType(date) {
                var stackType = "";
                switch (this._manyLens.TimeSpan) {
                    case 3: stackType = "-s" + date.getSeconds();
                    case 2: stackType = "-Min" + date.getMinutes() + stackType;
                    case 1: stackType = "-hour" + date.getHours() + stackType;
                    case 0: stackType = "-day" + date.getDate() + stackType;
                }
                return "" + (this._manyLens.TimeSpan === 0 ? "-year" + date.getFullYear() + "-mounth" + date.getMonth() + stackType : stackType);
                // return "" + ;
            }
            RefreshGraph(point) {
                //Refresh the curve view
                this._y_scale.domain([0, d3.max(this._data, function (d) { return d.value; })]);
                this._y_axis_gen.scale(this._y_scale);
                this._y_axis.call(this._y_axis_gen);
                var restPathData = [];
                var nodesData = [];
                var sectionData = new Array();
                var i = 0, len = this._data.length;
                while (i < len) {
                    if (this._data[i].beg) {
                        var section = {
                            id: this._data[i].beg,
                            beg: i,
                            end: 0,
                            features: this._data[i].features,
                            fs: null,
                            pathPoints: [
                                { index: i, value: this._data[i].value }
                            ]
                        };
                        nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });
                        while (this._data[++i] && this._data[i].beg == section.id) {
                            section.features = section.features.concat(this._data[i].features);
                            section.pathPoints.push({ index: i, value: this._data[i].value });
                            nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });
                        }
                        if (this._data[i] && this._data[i].type == 3) {
                            section.end = i;
                            section.pathPoints.push({ index: i, value: this._data[i].value });
                        }
                        else if (this._data[i] && this._data[i].type == 1) {
                            section.end = i - 1;
                            var sectionRestPath = [];
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value });
                            sectionRestPath.push({ index: i, value: this._data[i].value });
                            restPathData.push(sectionRestPath);
                        }
                        else {
                            section.end = i - 1;
                        }
                        sectionData.push(section);
                        if (!this._section_data[section.id] && section.pathPoints.length == 3) {
                            this._section_data[section.id] = section;
                        }
                    }
                    else {
                        var sectionRestPath = [];
                        if (this._data[i - 1])
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value });
                        sectionRestPath.push({ index: i, value: this._data[i].value });
                        while (this._data[++i] && !this._data[i].beg) {
                            sectionRestPath.push({ index: i, value: this._data[i].value });
                        }
                        if (this._data[i])
                            sectionRestPath.push({ index: i, value: this._data[i].value });
                        restPathData.push(sectionRestPath);
                    }
                }
                var self = this;
                var cells = this._subView.selectAll("g.curve.cells")
                    .data(sectionData.filter(d => d.pathPoints.length === 3), d => d.id);
                //Voronoi here
                var sectionIds = Object.keys(this._section_data);
                var constR = this._x_scale(1) - this._x_scale(0);
                if (sectionIds.length > 0) {
                    //Calculate the bound
                    if (!this._voronoi_bound) {
                        var step = 2 * Math.PI * 0.01;
                        var bound = [];
                        for (var i = 99; i >= 0; --i) {
                            var x = constR * Math.cos(i * step);
                            var y = constR * Math.sin(i * step);
                            bound.push([x, y]);
                        }
                        this._voronoi_bound = d3.geom.polygon(bound);
                    }
                    for (let i = 1; i < 3; ++i) {
                        var section = this._section_data[sectionIds[sectionIds.length - i]];
                        if (section && !section.fs && section.pathPoints.length == 3) {
                            var fs = section.features;
                            fs.sort(function (a, b) {
                                if (a.feature_type > b.feature_type)
                                    return -1;
                                else
                                    return 1;
                            });
                            //circle type
                            this.CalVoronoi(fs, constR);
                            // LOG
                            // console.log( fs.filter( f => f.feature_type === 'sentiment' ).map( f => Math.log(f.feature_value) ).join( ',' ) );
                            //console.log( fs.filter( f => f.feature_type === 'sentiment' ).map( f => `${f.feature_value}:${f.feature_detail}` ).join( ',' ) );
                            var cellsGroup = cells.enter().insert('g', 'path.curve.section.path')
                                .attr('class', 'curve cells')
                                .attr('id', d => "cells_group" + d.id)
                                .attr("transform", function (d) {
                                if (d.pathPoints[1]) {
                                    var tY = self._y_scale(d.pathPoints[1].value) + 30;
                                    d3.select(this).attr('tY', tY);
                                    return "translate(" + self._x_scale(d.end - 1) + "," + tY + ")";
                                }
                            })
                                .on("click", (d) => {
                                this.SelectSegment(d);
                            });
                            section['fs'] = fs;
                            cellsGroup.selectAll(".cell")
                                .data(fs)
                                .enter().append("g")
                                .attr("class", "cell")
                                .append("path")
                                .attr("d", d => "M" + d.p.join("L") + "Z")
                                .style("fill", (d, i) => {
                                let _feature_vlaue = d.feature_value;
                                if (d.feature_type in this._voronoi_feature_need_to_be_log) {
                                    _feature_vlaue = Math.log(_feature_vlaue);
                                }
                                return this._voronoi_color_scale[d.feature_type](_feature_vlaue);
                            })
                                .style("stroke", 'lightgrey')
                                .style("stroke-width", .0)
                                .on('mouseout', function (d) {
                                d3.select(this.parentNode.parentNode).select("#cell-tip").remove();
                            })
                                .on('mouseover', function (d) {
                                var mouse = d3.mouse(this);
                                d3.select(this.parentNode.parentNode)
                                    .append('text')
                                    .attr('x', mouse[0])
                                    .attr('y', mouse[1])
                                    .attr('id', 'cell-tip')
                                    .text(d.feature_type + ":" + d.feature_value);
                            });
                        }
                    }
                }
                var xTime = this._mainView.selectAll(".curve.seg.time-tick").data(sectionData, d => d.id);
                xTime.attr("x", d => this._x_scale(d.beg));
                xTime.enter().append("text")
                    .attr("x", d => this._x_scale(d.beg))
                    .attr("y", this._view_height)
                    .attr("class", "curve seg time-tick")
                    .text((d) => {
                    var date = this._time_formater.parse(d.id);
                    var mon = this.month_names[date.getMonth()];
                    var day = date.getDate();
                    return mon + " " + day;
                });
                xTime.exit().remove();
                var truelineFunc = d3.svg.line()
                    .x(d => this._x_scale(d.index))
                    .y(d => this._y_scale(d.value))
                    .interpolate("linear");
                var truepath = this._mainView.selectAll(".curve.section.path").data(sectionData, d => d.id);
                truepath.attr("d", d => truelineFunc(d.pathPoints));
                truepath
                    .enter().append("path")
                    .attr("d", d => truelineFunc(d.pathPoints))
                    .attr("class", "curve section path");
                truepath.exit().remove();
                var trueRestPath = this._mainView.selectAll(".curve.rest.true.path").data(restPathData);
                trueRestPath.attr("d", truelineFunc);
                trueRestPath
                    .enter().append("path")
                    .attr("d", truelineFunc)
                    .attr("class", "curve rest true path");
                trueRestPath.exit().remove();
                //handle the seg node
                var nodes = this._mainView.selectAll(".curve.node").data(nodesData, d => d.index);
                nodes
                    .attr("cx", d => self._x_scale(d.index))
                    .attr("cy", d => self._y_scale(d.value));
                nodes.enter().append("circle")
                    .attr("class", "curve node")
                    .attr("cx", d => self._x_scale(d.index))
                    .attr("cy", d => self._y_scale(d.value))
                    .attr("r", 3);
                nodes.exit().remove();
                // move the main view
                if (this._data.length > (this._section_num + 2)) {
                    cells
                        .attr("transform", function (d) {
                        var ty = self._y_scale(d.pathPoints[1].value) + 30; //d3.select( this ).attr( 'tY' );
                        return "translate(" + self._x_scale(d.end - 1) + "," + ty + ")";
                    });
                    d3.transition().duration(50) //this time-step should be equale to the time step of AddPoint() in server.hub
                        .each(() => {
                        this._mainView
                            .attr("transform", null)
                            .transition()
                            .ease("linear")
                            .attr("transform", "translate(" + (this._x_scale(0) - this._x_scale(1)) + ",0)");
                        cells
                            .transition()
                            .ease("linear")
                            .attr("transform", function (d) {
                            var ty = self._y_scale(d.pathPoints[1].value) + 30; //d3.select( this ).attr( 'tY' );
                            return "translate(" + self._x_scale(d.end - 2) + "," + ty + ")";
                        });
                    });
                }
                else {
                    cells
                        .attr("transform", function (d) {
                        var ty = self._y_scale(d.pathPoints[1].value) + 30; //d3.select( this ).attr( 'tY' );
                        return "translate(" + self._x_scale(d.end - 1) + "," + ty + ")";
                    });
                }
                //Refresh the stack rect view
                if (this._data[0].type == 1 || this._data[0].type == 3) {
                    //The stack date
                    var date = this._time_formater.parse(this._data[0].beg);
                    var stackNode = {
                        id: this._data[0].beg,
                        date: date,
                        size: 1,
                        oy: this._y_scale(this._data[1].value),
                        name: "d" + date.getDay(),
                        parent: null,
                        children: null,
                        type: this.GetStackNodeType(date),
                        index: this._stack_bar_nodes_data.length
                    };
                    this.InserNode(stackNode.type, stackNode);
                    var exitParent = this.FindMinCoParent(this._stack_bar_nodes_data[this._stack_bar_nodes_data.length - 1], stackNode);
                    this.Toggle(exitParent);
                    this._stack_bar_nodes_data.push(stackNode);
                    this.UpdateSubviewTree(exitParent);
                }
            }
            SelectSegment(d) {
                if (d['end'] == -1) {
                    console.log("Segmentation hasn't finished yet!");
                }
                else if (d['end'] == null || d['end'] != -1) {
                    if (this._element.select(".progress").style("display") !== "block") {
                        this._curveSvg.style("margin-bottom", "0px");
                        this._element.select(".progress").style("display", "block");
                        this.PullInterval(d.id, this._manyLens.CurrentClassifierMapID);
                    }
                    else {
                        console.log("There's pulling a interval now");
                    }
                }
            }
            GetWeek(date) {
                var d = new Date(+date);
                d.setHours(0, 0, 0);
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                return Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 8.64e7) + 1) / 7);
            }
        }
        TweetsCurve.Curve = Curve;
    })(TweetsCurve = ManyLens.TweetsCurve || (ManyLens.TweetsCurve = {}));
})(ManyLens || (ManyLens = {}));
//# sourceMappingURL=ManyLens.js.map