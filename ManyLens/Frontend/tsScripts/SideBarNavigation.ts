///<reference path = "../Scripts/typings/jquery/jquery.d.ts" />
///<reference path = "../Scripts/typings/html2canvas/html2canvas.d.ts" />
module ManyLens {

    export module Navigation {

        interface MenuListData {
            name?: string;
            attributeName?: string;
            icon?: string;
            lensConstructFunc?:  new (element: D3.Selection, attributeName: string, manyLens: ManyLens)=> any ;
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
            private _som_geo_switch_btn:JQuery;
            private _screen_shot_btn:D3.Selection;

            private _map_Svg: D3.Selection;

            constructor(element: D3.Selection, brandName: string, mapSvg: D3.Selection, manyLens: ManyLens) {
                this._element = element;
                this._manyLens = manyLens;
                this._brand_name = brandName;
                this._map_Svg = mapSvg;

                //this._element.select("#curve-btns").append("input")
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
                //$("#intervals-organize-switch").bootstrapSwitch("disabled",true);
                //this._reorganizeIntervalBtn = $("#intervals-organize-switch")
                //.on("switchChange.bootstrapSwitch",  (event,state)=> {
                //    this._manyLens.ManyLensHubServerReOrganizePeak(state);
                //});

                this._element.select("#curve-btns")
                .append("div").attr("class","btn-group").style({
                    "margin-top":"30px",
                    "margin-bottom":"250px"
                })
                .html('<button class="btn btn-primary" type="button" id="hack-drop-down" style="padding-left: 25px;padding-right: 24px;">Minutes</button><button data-toggle="dropdown" class="btn btn-primary dropdown-toggle" type="button"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul role="menu" class="dropdown-menu" style="min-width: 150px;border: 1px solid #dae1e8;"><li><a>Seconds</a></li><li><a>Minutes</a></li><li><a>Hours</a></li><li><a>Days</a></li></ul>');
                d3.select("ul.dropdown-menu").selectAll("li")
                .on("click",function(d){
                    var text = d3.select(this).select("a").text();
                    d3.select("#hack-drop-down").text(text);
                });

                this._launchDataBtn = 
                //this._element.select("#curve-btns")
                //    .append("button")
                //    .attr({
                //        type: "button",
                //        class: "btn btn-primary btn-block disabled"
                //    })
                //    .style({
                //        "margin-top": "30px",
                //        "margin-bottom": "170px"
                //    })
                //    .text("Launch")
                d3.select("#navbarInput-01")
                    .on("keydown",(d)=>{
                        
                        if(d3.event.keyCode == 13){
                            d3.event.preventDefault();
                            this._manyLens.ManyLensHubServerPullPoint("0");
                        }
                    
                    })
                    //.on("click", () => {
                    //    this._launchDataBtn.classed("disabled", true);
                    //    this.PullData();
                    //})
                ;

                d3.select("#navbarInput-02")
                .on("click",(d)=>{
                    d3.event.preventDefault();
                    this._manyLens.ManyLensHubServerPullPoint("0");
                });

                this._brand = this._element.select("#map-btns").append("div")
                    .attr("class", "nav-brand")
                    .text(this._brand_name)
                ;
                this._menu_list = this._element.select("#map-btns").append("div")
                    .attr("class", "menu-list")
                    .append("ul")
                    .attr("id", "side-menu-content")
                    .attr("class", "menu-content")
                ;

                var mapBtns = this._element.select("#map-btns").append("div")
                    .style("text-align","center");

                this._refine_btn = mapBtns.append("button")
                    .attr({
                        type: "button",
                        class: "btn btn-primary"
                    })
                    .style({
                        "margin-top": "90px",
                        "margin-bottom":"30px",
                        "padding":"9px 35px"
                    })
                    .text(" Refine  Map ")
                    .on("click", () => {
                        this._manyLens.AddBrushToMap();
                    })
                ;

                mapBtns.append("input")
                    .attr({
                        "id":"maps-switch",
                        type:"checkbox",
                        "data-on-color":"info",
                         "data-off-color":"danger",
                         "data-on-text":" Topics ",
                         "data-off-text":" GEO "
                    })
                    .property("checked",true)
                ;
                $("#maps-switch").bootstrapSwitch("handleWidth",48);
                this._som_geo_switch_btn = $("#maps-switch")
                            .on("switchChange.bootstrapSwitch",  (event,state)=> {
                                this._manyLens.SwitchMap();
                             });

                //var screenShotBtns = mapBtns.append("button")
                //    .attr({
                //        type: "button",
                //        class: "btn btn-primary"
                //    })
                //    .style({
                //        "margin-top": "30px",
                //        "margin-bottom":"30px",
                //        "padding":"9px 32px"
                //    })
                //    .text(" Screen  Shot ")
                //    .on("click", () => {
                //        take($("#mapView"));

                //        function take(targetElem) {
                //        // First render all SVGs to canvases
                //        var elements = targetElem.find('svg').map(function() {
                //            var svg = $(this);
                //            var canvas = $('<canvas></canvas>');
                //            svg.replaceWith(canvas);

                //            // Get the raw SVG string and curate it
                //            var content = svg.wrap('<p></p>').parent().html();
                //            content = content.replace(/xlink:title="hide\/show"/g, "");
                //            content = encodeURIComponent(content);
                //            svg.unwrap();

                //            // Create an image from the svg
                //            var image = new Image();
                //            image.src = 'data:image/svg+xml,' + content;
                //            image.onload = function() {
                //                canvas[0]['width'] = image.width;
                //                canvas[0]['height']= image.height;

                //                // Render the image to the canvas
                //                var context = (<HTMLCanvasElement>canvas[0]).getContext('2d');
                //                context.drawImage(image, 0, 0);
                //            };
                //            return {
                //                svg: svg,
                //                canvas: canvas
                //            };
                //        });
                //        targetElem.imagesLoaded(function() {
                //            // At this point the container has no SVG, it only has HTML and Canvases.
                //            html2canvas(targetElem[0], {
                //                onrendered: function(canvas) {
                //                    // Put the SVGs back in place
                //                    elements.each(function() {
                //                        this.canvas.replaceWith(this.svg);
                //                    });

                //                    // Do something with the canvas, for example put it at the bottom
                //                 $(canvas).appendTo('body');
                //                }
                //            })
                //        })
                //    }


                //        //html2canvas(document.getElementById("mapView"), {
                //        //        onrendered: function(canvas) {
                //        //                document.body.appendChild(canvas);
                //        //      },
                //        //    allowTaint: true
                //        //});
                //    })
                //;

                //this._manyLens.ManyLensHubRegisterClientFunction(this, "enableReorganizeIntervalBtn", this.EnableReorganizeIntervalBtn);
                //this._manyLens.ManyLensHubRegisterClientFunction(this, "disableReorganizeIntervalBtn", this.DisableReorganizeIntervalBtn);
            }

            private DemoData(): MenuListData {
                var data: MenuListData = {
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
                                    extractDataFunc: new Lens.ExtractDataFunc("tweetLengthDistribute")
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
                                    extractDataFunc: new Lens.ExtractDataFunc("hashTagsDistribute")
                                },
                                {
                                    name: "Words Cloud",
                                    icon:"fui-list-thumbnailed",
                                    attributeName: "Hashtag Count",
                                    lensConstructFunc: Lens.WordCloudLens,
                                    extractDataFunc: new Lens.ExtractDataFunc("hashTagsDistribute")
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
                                    extractDataFunc: new Lens.ExtractDataFunc("keywordsDistribute")
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
                                    extractDataFunc: new Lens.ExtractDataFunc("retweetNetwork")
                                }
                            ]
                        },
                        {
                            name:"Tweets Content",
                           
                            children:[
                                {
                                    name:"List",
                                    icon:"fui-list-numbered",
                                    attributeName:"Tweets Content",
                                    lensConstructFunc:Lens.TweetsListLens,
                                    extractDataFunc:new Lens.ExtractDataFunc("tweetsContent")
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
                        .html('<div data-target=#' + menuList[i].name.replace(" ", "-") + ' data-toggle="collapse" data-parent="#side-menu-content" class="collapsed">'+menuList[i].name+'</div>')
                    ;
                    //<i class="' + menuList[i].icon + '"></i>' 
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
                        li.select("div").append("span").attr("class", "arrow fui-triangle-up")

                        var ul = li.append("ul")
                            .attr("class", "sub-menu collapse")
                            .attr("id", menuList[i].name.replace(" ", "-"));

                        ul.selectAll("li")
                            .data(sub_menu)
                            .enter().append("li")
                            .html(function(d){return '<i class= "'+d.icon+'"></i>'+d.name;})
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