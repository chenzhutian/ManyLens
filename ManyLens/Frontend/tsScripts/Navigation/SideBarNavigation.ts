
module ManyLens {

    export module Navigation {

        interface MenuListData {
            name?: string;
            attributeName?: string;
            icon?: string;
            lensConstructFunc?:  new (element: D3.Selection, attributeName: string, manyLens: ManyLens)=> Lens.BaseSingleLens ;
            extractDataFunc?: Lens.ExtractDataFunc;
            children?: Array<MenuListData>;
        }

        export class SideBarNavigation {

            private _element: D3.Selection;
            private _manyLens: ManyLens;
            /*-----------------Data menu-----------------*/
            private _isLoaded: boolean = false;
            private _launchDataBtn: D3.Selection;
            private _reorganizeIntervalBtn: JQuery;

            /*--------------Attribute menu---------------*/
            private _brand: D3.Selection;
            private _brand_name: string;
            private _menu_list: D3.Selection;
            private _menu_list_data: MenuListData;

            /*--------------Map menu---------------*/
            private _refine_btn:D3.Selection;

            private _map_Svg: D3.Selection;

            constructor(element: D3.Selection, brandName: string, mapSvg: D3.Selection, manyLens: ManyLens) {
                this._element = element;
                this._manyLens = manyLens;
                this._brand_name = brandName;
                this._map_Svg = mapSvg;

                this._reorganizeIntervalBtn = $("#intervals-organize-switch")
                .on("switchChange.bootstrapSwitch",  (event,state)=> {
                    this._manyLens.ManyLensHubServerReOrganizePeak(state);
                });

                this._launchDataBtn = this._element.select("#curve-btns")
                    .append("button")
                    .attr({
                        type: "button",
                        class: "btn btn-primary btn-block disabled"
                    })
                    .style({
                        "margin-top": "30px",
                        "margin-bottom": "90px"
                    })
                    .text("Launch")
                    .on("click", () => {
                        this._launchDataBtn.classed("disabled", true);
                        this.PullData();
                    })
                ;

                this._brand = this._element.append("div")
                    .attr("class", "nav-brand")
                    .text(this._brand_name)
                ;
                this._menu_list = this._element.append("div")
                    .attr("class", "menu-list")
                    .append("ul")
                    .attr("id", "side-menu-content")
                    .attr("class", "menu-content")
                ;

                this._refine_btn = this._element.append("button")
                    .attr({
                        type: "button",
                        class: "btn btn-primary"
                    })
                    .style({
                        "margin-top": "30px",
                        "margin-bottom": "90px"
                    })
                    .text("RefineMap")
                    .on("click", () => {
                        this._manyLens.AddBrushToMap();
                    })
                ;

                this._manyLens.ManyLensHubRegisterClientFunction(this, "enableReorganizeIntervalBtn", this.EnableReorganizeIntervalBtn);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "disableReorganizeIntervalBtn", this.DisableReorganizeIntervalBtn);
            }

            private DemoData(): MenuListData {
                var data: MenuListData = {
                    name: "root",
                    icon: null,
                    children: [
                        {
                            name: "Tweet Length",
                            icon: "fui-html5",
                            children: [
                                {
                                    name: "Pie Chart",
                                    attributeName: "Tweet Length",
                                    lensConstructFunc: Lens.PieChartLens,
                                    extractDataFunc: new Lens.ExtractDataFunc("tweetLengthDistribute")
                                }
                            ]
                        },
                        {
                            name: "Hashtag Count",
                            icon: "fui-html5",
                            children: [
                                {
                                    name: "Pie Chart",
                                    attributeName: "Hashtag Count",
                                    lensConstructFunc: Lens.PieChartLens,
                                    extractDataFunc: new Lens.ExtractDataFunc("hashTagsDistribute")
                                },
                                {
                                    name: "Words Cloud",
                                    attributeName: "Hashtag Count",
                                    lensConstructFunc: Lens.WordCloudLens,
                                    extractDataFunc: new Lens.ExtractDataFunc("hashTagsDistribute")
                                }
                            ]
                        },
                        {
                            name: "Keywords",
                            icon: "fui-foursquare",
                            children: [
                                {
                                    name: "Words Cloud",
                                    attributeName: "Keywords",
                                    lensConstructFunc: Lens.WordCloudLens,
                                    extractDataFunc: new Lens.ExtractDataFunc("keywordsDistribute")
                                }
                            ]
                        },
                        {
                            name: "Retweet Network",
                            icon: "fui-windows-8",
                            children: [
                                {
                                    name: "Network",
                                    attributeName: "Retweet Network",
                                    lensConstructFunc: Lens.NetworkLens,
                                    extractDataFunc: new Lens.ExtractDataFunc("retweetNetwork")
                                }
                            ]
                        },
                        {
                            name: "Tweets Count",
                            icon: "fui-mail",
                            children: [
                                {
                                    name: "Map",
                                    attributeName: "Tweets Count",
                                    lensConstructFunc: Lens.MapLens,
                                    extractDataFunc: new Lens.ExtractDataFunc("tweetsLocationDistribute")
                                }
                            ]
                        }
                    ]
                };

                return data;
            }

            public BuildList(listData: MenuListData) {
                this._menu_list_data = listData;
                if (!this._menu_list_data) {
                    this._menu_list_data = this.DemoData();
                }

                var menuList = this._menu_list_data.children;

                for (var i = 0, menu_len = menuList.length; i < menu_len; ++i) {
                    var sub_menu: Array<MenuListData> = menuList[i].children;
                    var li = this._menu_list.append("li")
                        .attr("class", "panel")
                        .html('<div data-target=#' + menuList[i].name.replace(" ", "-") + ' data-toggle="collapse" data-parent="#side-menu-content" class="collapsed"><i class="' + menuList[i].icon + '"></i>' + menuList[i].name + '</div>')
                    ;

                    //add high light function
                    li.select("div")
                        .on("click", function () {
                            d3.event.preventDefault();
                            if (d3.select(this.parentNode).classed("active")) {
                                d3.select("li.active").classed("active", false);
                            } else {
                                d3.select("li.active").classed("active", false);
                                d3.select(this.parentNode).classed("active", true);
                            }
                        });


                    if (sub_menu) {
                        li.select("div").append("span").attr("class", "arrow fui-triangle-down")

                        var ul = li.append("ul")
                            .attr("class", "sub-menu collapse")
                            .attr("id", menuList[i].name.replace(" ", "-"));

                        ul.selectAll("li")
                            .data(sub_menu)
                            .enter().append("li")
                            .text(function (d) { return d.name })
                            .on("click", (d: MenuListData) => {
                                var lens: Lens.BaseSingleLens = new d.lensConstructFunc(this._map_Svg,d.attributeName, this._manyLens);
                                lens
                                    .DataAccesser(d.extractDataFunc)
                                    .Render("red")
                                ;
                            });
                    }
                }
            }

            public FinishLoadData() {
                this._isLoaded = true;
                this._launchDataBtn.classed("disabled", false);
            }

            private EnableReorganizeIntervalBtn(): void {
                this._reorganizeIntervalBtn.bootstrapSwitch("disabled", false);
            }
            private DisableReorganizeIntervalBtn(): void {
                this._reorganizeIntervalBtn.bootstrapSwitch("disabled", true);
            }

            private PullData(): void {
                if (ManyLens.TestMode) {
                    this._manyLens.ManyLensHubServerTestPullPoint().done(() => {

                        this._launchDataBtn.classed("disabled", false);
                    });
                } else {
                    this._manyLens.ManyLensHubServerPullPoint("0").done((d) => {
                        this._launchDataBtn.classed("disabled", false);
                    });
                }
            }
        }
    }

}