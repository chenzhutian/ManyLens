﻿module ManyLens {

    export module Navigation {

        interface MenuListData {
            name: string;
            icon?: string;
            lensConstructFunc?: (element: D3.Selection, manyLens: ManyLens) => void;
            extractDataFunc?: (d?: any) => any;
            children?: Array<MenuListData>;
        }
        export class SideBarNavigation {

            private _element: D3.Selection;
            private _manyLens: ManyLens;
            /*-----------------Data menu-----------------*/
            private _isLoaded: boolean = false;
            //private _signalLight: D3.Selection;
            private _launchDataBtn: D3.Selection;

            /*--------------Attribute menu---------------*/
            private _brand: D3.Selection;
            private _brand_name: string;
            private _menu_list: D3.Selection;
            private _menu_list_data: MenuListData;

            private _map_Svg: D3.Selection;


            constructor(element: D3.Selection, brandName: string, mapSvg: D3.Selection, manyLens: ManyLens) {
                this._element = element;
                this._manyLens = manyLens;
                this._brand_name = brandName;
                this._map_Svg = mapSvg;

                this._launchDataBtn = this._element.append("button")
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
            }

            private DemoData(): MenuListData {
                var data: MenuListData = {
                    name: "root",
                    icon: null,
                    children: [
                        {
                            name: "Annulus Chart",
                            icon: "fui-html5",
                            children: [
                                {
                                    name: "Tweet Length",
                                    lensConstructFunc: Lens.PieChartLens,
                                    extractDataFunc: (d) => { return d.tweetLengthDistribute;}
                                },
                                {
                                    name: "Hashtag Count",
                                    lensConstructFunc: Lens.PieChartLens,
                                    extractDataFunc: (d) => { return d.tweetLengthDistribute; }
                                },
                                {
                                    name: "Url Count",
                                    lensConstructFunc: Lens.PieChartLens
                                },
                                {
                                    name: "@Mention Count",
                                    lensConstructFunc: Lens.PieChartLens
                                }

                            ]
                        },
                        {
                            name: "Text",
                            icon: "fui-foursquare",
                            children: [
                                {
                                    name: "Keywords",
                                    lensConstructFunc: Lens.WordCloudLens,
                                    extractDataFunc: (d) => { return d.labels;}
                                },
                                {
                                    name: "Hashtag",
                                    lensConstructFunc: Lens.WordCloudLens,
                                    extractDataFunc: (d) => { return d.hashTagDistribute;}
                                }
                            ]
                        },
                        {
                            name: "Network",
                            icon: "fui-windows-8",
                            children: [
                                {
                                    name: "New Service1",
                                    lensConstructFunc: Lens.NetworkLens
                                }
                            ]
                        },
                        {
                            name: "Map",
                            icon: "fui-mail",
                            children: [
                                {
                                    name: "New New 1",
                                    lensConstructFunc: Lens.MapLens
                                },
                                { name: "New New 2" },
                                { name: "New New 3" }
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
                                var len:Lens.BaseSingleLens = new d.lensConstructFunc(this._map_Svg, this._manyLens);
                                len.ExtractData(d.extractDataFunc);
                                len.Render("red");
                            });
                    }
                }
            }

            public FinishLoadData() {
                this._isLoaded = true;
                this._launchDataBtn.classed("disabled", false);
            }

            private PullData(): void {
                this._manyLens.ManyLensHubServerPullPoint("0").done(() => {
                    this._launchDataBtn.classed("disabled", false);
                });
            }
        }
    }

}