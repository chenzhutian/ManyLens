import { Selection } from "d3";
import * as d3 from "d3";
import { ManyLens } from "./ManyLens";
import { PieChartLens, ExtractDataFunc, WordCloudLens, NetworkLens, MapLens, TweetsListLens, BaseSingleLens } from "./Lens/index";

interface MenuListData {
    name?: string;
    attributeName?: string;
    icon?: string;
    lensConstructFunc?: new (element: Selection<any>, attributeName: string, manyLens: ManyLens) => any;
    extractDataFunc?: ExtractDataFunc;
    children?: Array<MenuListData>;
}

export class SideBarNavigation {

    private _element: Selection<any>;
    private _manyLens: ManyLens;
    private _demo_data: MenuListData = {
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
                        lensConstructFunc: PieChartLens,
                        extractDataFunc: new ExtractDataFunc("tweetLengthDistribute")
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
                        lensConstructFunc: PieChartLens,
                        extractDataFunc: new ExtractDataFunc("hashTagsDistribute")
                    },
                    {
                        name: "Words Cloud",
                        icon: "fui-list-thumbnailed",
                        attributeName: "Hashtag Count",
                        lensConstructFunc: WordCloudLens,
                        extractDataFunc: new ExtractDataFunc("hashTagsDistribute")
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
                        lensConstructFunc: WordCloudLens,
                        extractDataFunc: new ExtractDataFunc("keywordsDistribute")
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
                        lensConstructFunc: NetworkLens,
                        extractDataFunc: new ExtractDataFunc("retweetNetwork")
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
                        lensConstructFunc: TweetsListLens,
                        extractDataFunc: new ExtractDataFunc("tweetsContent")
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
                        lensConstructFunc: MapLens,
                        extractDataFunc: new ExtractDataFunc("tweetsLocationDistribute")
                    }
                ]
            }
        ]
    };
    /*-----------------Data menu-----------------*/
    private _isLoaded: boolean = false;
    private _launchDataBtn: Selection<any>;
    // private _reorganizeIntervalBtn: JQuery;

    /*--------------Attribute menu---------------*/
    private _brand: Selection<any>;
    private _brand_name: string;
    private _menu_list: Selection<any>;
    private _menu_list_data: MenuListData;

    /*--------------Map menu---------------*/
    private _refine_btn: Selection<any>;
    private _som_geo_switch_btn: JQuery;
    // private _screen_shot_btn: Selection<any>;

    private _map_Svg: Selection<any>;

    constructor(element: Selection<any>, brandName: string, mapSvg: Selection<any>, manyLens: ManyLens) {
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
                })
            //.on("click", () => {
            //    this._launchDataBtn.classed("disabled", true);
            //    this.PullData();
            //})
            ;

        d3.select("#navbarInput-02")
            .on("click", (d) => {
                (d3.event as Event).preventDefault();
                console.log("pullPoint");
                this._manyLens.ManyLensHubServerPullPoint();
            });

        this._brand = this._element.select("#map-btns").append("div")
            .attr("class", "nav-brand")
            .text(this._brand_name)
            ;
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

    public BuildList(listData: MenuListData) {
        //TODO remove if default paramter works
        //this._menu_list_data = listData;
        //if ( !this._menu_list_data ) {
        //    this._menu_list_data = this.DemoData();
        //}
        this._menu_list_data = listData || this._demo_data;
        var menuList = this._menu_list_data.children;

        for (var i = 0, menu_len = menuList.length; i < menu_len; ++i) {
            console.log('try init menu');
            var sub_menu: Array<MenuListData> = menuList[i].children;
            var li = this._menu_list.append("li")
                .attr("class", "panel")
                .html('<div data-target=#' + menuList[i].name.replace(" ", "-") + ' data-toggle="collapse" data-parent="#side-menu-content" class="collapsed">' + menuList[i].name + '</div>')
                ;
            //<i class="' + menuList[i].icon + '"></i>' 
            //add high light function
            li.select("div")
                .on("click", function () {
                    (d3.event as Event).preventDefault();
                    if (d3.select(this.parentNode).classed("active")) {
                        d3.select("li.active").classed("active", false);
                    } else {
                        d3.select("li.active").classed("active", false);
                        d3.select(this.parentNode).classed("active", true);
                    }
                });


            if (sub_menu) {
                li.select("div").append("span").attr("class", "arrow fui-triangle-up")

                var ul = li.append("ul")
                    .attr("class", "sub-menu collapse")
                    .attr("id", menuList[i].name.replace(" ", "-"));

                ul.selectAll("li")
                    .data(sub_menu)
                    .enter().append("li")
                    .html(function (d) { return '<i class= "' + d.icon + '"></i>' + d.name; })
                    .on("click", (d: MenuListData) => {
                        var lens: BaseSingleLens = new d.lensConstructFunc(this._map_Svg, d.attributeName, this._manyLens);
                        lens
                            .DataAccesser(d.extractDataFunc)
                            .Render("red");
                    });
            }
        }
    }

    public FinishLoadData() {
        this._isLoaded = true;
        this._launchDataBtn.classed("disabled", false);
    }

    private SetTimeSpan(index): void {
        d3.select("ul.dropdown-menu").selectAll("li")[0][3 - index].click();
    }
    // private EnableReorganizeIntervalBtn(): void {
    //     this._reorganizeIntervalBtn.bootstrapSwitch("disabled", false);
    // }
    // private DisableReorganizeIntervalBtn(): void {
    //     this._reorganizeIntervalBtn.bootstrapSwitch("disabled", true);
    // }

    // private PullData(): void {
    //     if (ManyLens.TestMode) {
    //         this._manyLens.ManyLensHubServerTestPullPoint().done(() => {
    //             this._launchDataBtn.classed("disabled", false);
    //         });
    //     } else {
    //         this._manyLens.ManyLensHubServerPullPoint().done((d) => {
    //             this._launchDataBtn.classed("disabled", false);
    //         });
    //     }
    // }
}
