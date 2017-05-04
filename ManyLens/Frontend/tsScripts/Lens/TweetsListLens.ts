///<reference path = "./BaseSingleLens.ts" />
module ManyLens {

    export module Lens {

        export class TweetsListLens extends D3ChartObject {

            public static Type: string = "TweetsListLens";
            protected _id: string;
            protected _units_id: number[] = [];
            protected _map_id: string;

            private _current_tweets: string[];
            private _num_of_tweets_in_a_page: number = 3;
            private _page_count: number;

            protected _attribute_name: string;
            protected _sc_lc_svg: D3.Selection = null;
            protected _select_circle_svg: D3.Selection;
            protected _select_circle: D3.Selection;
            protected _select_circle_radius: number = 0;
            protected _select_circle_cx: number = -10;
            protected _select_circle_cy: number = -10;
            protected _select_circle_scale: number = 1;
            protected _select_circle_zoom: D3.Behavior.Zoom = d3.behavior.zoom();
            protected _select_circle_drag: D3.Behavior.Drag = d3.behavior.drag();

            private _list_x: number;
            private _list_y: number;
            private _list_width: number = 260;

            private _list_container: D3.Selection;
            private _list_drag: D3.Behavior.Drag = d3.behavior.drag();

            protected _has_put_down: boolean = false;
            protected _has_showed_lens: boolean = false;

            protected _sc_lc_default_dist = 200;

            protected _extract_data_map_func: ExtractDataFunc = null;

            public get ID(): string {
                return this._id;
            }
            public get MapID(): string {
                return this._map_id;
            }
            public get UnitsID(): number[] {
                return this._units_id.sort();
            }
            public get AttributeName(): string {
                return this._attribute_name;
            }

            constructor(element: D3.Selection, attributeName: string, manyLens: ManyLens.ManyLens) {
                super(element, manyLens);
                this._id = "lens_" + this._manyLens.LensIDGenerator;

                this._current_tweets = [];

                this._select_circle_radius = 10;
                this._attribute_name = attributeName;
                this._select_circle_zoom
                    .scaleExtent([1, 4])
                    .on("zoom", () => {
                        this.SelectCircleZoomFunc();
                        d3.event.sourceEvent.stopPropagation();
                    })

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
                    })

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
                            })

                        this._sc_lc_svg.select("line")
                            .attr("x1", this._select_circle_cx)
                            .attr("y1", this._select_circle_cy)
                            .attr("x2", tData.tx + this._list_x / tData.scale)
                            .attr("y2", tData.ty + this._list_y / tData.scale)

                    })
                    .on("dragend", () => {

                    })
            }

            public Render(color: string): void {
                super.Render(color);
                var container = this._element;
                var hasShow = false;
                this._sc_lc_svg = this._element
                    .append("g")
                    .data([{ tx: 0, ty: 0, scale: 1, cx: 0, cy: 0 }])
                    .attr("class", "lens")
                    .attr("id", this.ID)

                this._select_circle_svg = this._sc_lc_svg.append("g")
                    .attr("class", "select-circle")

                var selectCircle = this._select_circle =
                    this._select_circle_svg.append("circle")
                        .data([{ x: this._select_circle_cx, y: this._select_circle_cy }])

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
                    .call(this._select_circle_drag)

                this._sc_lc_svg.append("line")
                    .attr("stoke-width", 2)
                    .attr("stroke", "#E9573F")

                container.on("mousemove", moveSelectCircle);            //因为鼠标是在大SVG里移动，所以要绑定到大SVG上
                function moveSelectCircle() {
                    var p = d3.mouse(container[0][0]);
                    selectCircle
                        .attr("cx", p[0])
                        .attr("cy", p[1])
                }
            }

            public DataAccesser(map?: ExtractDataFunc): any {
                if (map == null) return this._extract_data_map_func;
                this._extract_data_map_func = map;
                return this;
            }

            protected ExtractData(): void {
                var data: { unitsID: number[]; mapID: string } = this.GetElementByMouse();
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

            protected AfterExtractData(): void {
                this._page_count = Math.ceil(this._extract_data_map_func.Extract(this._data).length / this._num_of_tweets_in_a_page);
                this._current_tweets = this.GetTweetsInPage(0);
            }

            private GetTweetsInPage(index: number) {
                var allTweets = this._extract_data_map_func.Extract(this._data);
                var tweetsForShow = [];
                for (var i = 0; i < this._num_of_tweets_in_a_page; ++i) {
                    if (allTweets[index + i])
                        tweetsForShow.push(allTweets[index + i]);
                }
                return tweetsForShow;
            }

            public DisplayLens(): boolean {
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
                        })

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
                        .call(this._list_drag)

                    this._list_container
                        .selectAll(".list-group-item")
                        .data(this._current_tweets, function (d) { return d; })
                        .enter().append("a")
                        .attr("class", "list-group-item")
                        .append("p")
                        .attr("class", "list-group-item-text")
                        .text(function (d) { return d; })

                    this._list_container.append("div")
                        .style("text-align", "center")
                        .append("div")
                        .attr("id", "pagination")

                    this._list_container.selectAll("p").style("font-size", function (d) {
                        var fontSize: any = d3.select(this).style("font-size");
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
                } else {
                    return null;
                }
            }

            private ChangePage(index: number) {
                this._current_tweets = this.GetTweetsInPage(index);
                var tData = d3.select("#" + this.ID).data()[0];
                var newTweets = this._list_container
                    .selectAll(".list-group-item")
                    .data(this._current_tweets, function (d) { return d; });

                newTweets.enter().insert("a", "div")
                    .attr("class", "list-group-item")
                    .append("p")
                    .attr("class", "list-group-item-text")
                    .text(function (d) { return d; })

                this._list_container.selectAll("p").style("font-size", function (d) {
                    var fontSize: any = d3.select(this).style("font-size");
                    fontSize = parseFloat(fontSize.substring(0, fontSize.length - 2));
                    fontSize = fontSize * tData.scale > 18 ? 18 : fontSize * tData.scale;
                    return fontSize + "px";
                });

                newTweets.exit().remove();
            }

            protected SelectCircleDragFunc(): void {
                if (!this._has_put_down) return;
                if (d3.event.sourceEvent.button != 0) return;

                d3.select("#mapView").select("div#listView-" + this.ID).remove();
                this._sc_lc_svg.select("line")
                    .attr("x1", d3.event.x)
                    .attr("x2", d3.event.x)
                    .attr("y1", d3.event.y)
                    .attr("y2", d3.event.y);

                this._select_circle
                    .attr("cx", (d) => {
                        return d.x = d3.event.x;//Math.max(0, Math.min(parseFloat(this._element.style("width")), d3.event.x));
                    })
                    .attr("cy", (d) => {
                        return d.y = d3.event.y;//Math.max(0, Math.min(parseFloat(this._element.style("height")), d3.event.y));
                    })

                this._has_showed_lens = false;
            }

            //The entrance of new data
            protected SelectCircleDragendFunc(selectCircle): void {
                if (!this._has_put_down) return;
                if (d3.event.sourceEvent.button != 0) return;

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

            protected SelectCircleZoomFunc(): void {

                if (d3.event.sourceEvent.type != "wheel") {
                    return;
                }

                if (d3.event.scale == this._select_circle_scale) {
                    return;
                }

                this._select_circle_scale = d3.event.scale;
                var theta = Math.PI / 4;//Math.atan((this._lens_circle_cy - this._select_circle_cy) / (this._lens_circle_cx - this._select_circle_cx));
                var cosTheta = Math.cos(theta); //this._lens_circle_cx > this._select_circle_cx ? Math.cos(theta) : -Math.cos(theta);
                var sinTheta = Math.sin(theta); //this._lens_circle_cx > this._select_circle_cx ? Math.sin(theta) : -Math.sin(theta);

                this._select_circle
                    .attr("r", this._select_circle_radius * this._select_circle_scale)

                this._sc_lc_svg.select("line")
                    .attr("x1", this._select_circle_cx + this._select_circle_radius * d3.event.scale * cosTheta)
                    .attr("y1", this._select_circle_cy + this._select_circle_radius * d3.event.scale * sinTheta)
            }

            protected GetElementByMouse(): { unitsID: number[]; mapID: string } {

                var unitsID = [];
                var mapID;
                var rect: SVGRect = (<SVGSVGElement>this._element.node()).createSVGRect();

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

                var ele = (<SVGSVGElement>this._element.node()).getIntersectionList(rect, null);
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
                        } else if (dist2 < minDist2) {
                            mapID = node.data()[0]['mapID'];
                            minDist2 = dist2;
                            minUnitsID = node.data()[0]['unitID'];
                        }

                    }
                }

                var res = null;
                if (unitsID.length > 0 && mapID) {
                    res = { unitsID: unitsID, mapID: mapID };
                } else if (unitsID.length == 0 && mapID) {
                    res = { unitsID: [minUnitsID], mapID: mapID };
                } else {
                    console.log(unitsID);
                    console.log(mapID);
                    console.log("there is a bug here " + unitsID);
                }

                return res;
            }
        }
    }
}