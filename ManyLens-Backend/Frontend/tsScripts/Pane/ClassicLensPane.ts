﻿///<reference path = "../D3ChartObject.ts" />
///<reference path = "../Lens/LensList.ts" />



module ManyLens {
    export module Pane {
        interface PaneG {
            svg_g: D3.Selection;
            lens_count: number;
            lens_icon_r: number;
            lens_icon_padding: number;
            x: number;
            y: number;
            rect_width: number;
            rect_height: number;
        }

        export class ClassicLensPane extends D3ChartObject {

            private _manyLens: ManyLens.ManyLens;

            private _lens_count: number = 6;
            private _pane_color: D3.Scale.OrdinalScale = d3.scale.category20();
            private _pang_g: PaneG;

            //private _history_trees: LensHistory.HistoryTrees;
            
            private _drag: D3.Behavior.Drag = d3.behavior.drag();

            constructor(element: D3.Selection,manyLens:ManyLens.ManyLens) {
                super(element);
                this._manyLens = manyLens;

                this._drag
                    .origin(function (d) {
                        return d;
                    })
                    .on("drag", () => {
                        this.DragFunc();
                    });

                var pane_icon_r: number = 10;
                var pane_icon_padding: number = 10;
                this._pang_g = {
                    svg_g: this._element.append("g"),
                    x: 10,
                    y: 10,
                    rect_height: (this._lens_count * pane_icon_r * 2) + (this._lens_count + 1) * pane_icon_padding,
                    rect_width: 2 * (pane_icon_r + pane_icon_padding),
                    lens_icon_r: pane_icon_r,
                    lens_icon_padding: pane_icon_padding,
                    lens_count: this._lens_count
                };

            }

            public Render(): void {


                this.OpenPane();
            }

            private OpenPane() {
                var container = this._element;

                var pane_g = this._pang_g.svg_g.data([this._pang_g])
                    .attr("class", "lensPane")
                    .attr("transform", "translate(" + [10, 10] + ")")
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

                pane_g.selectAll("circle").data(d3.range(this._lens_count))
                    .enter().append("circle")
                    .attr("class", "pane-Lens-Circle")
                    .attr("r", this._pang_g.lens_icon_r)
                    .attr("cx", this._pang_g.rect_width / 2)
                    .attr("cy", (d, i) => {
                        return this._pang_g.lens_icon_r
                            + this._pang_g.lens_icon_padding
                            + i * (2 * this._pang_g.lens_icon_r + this._pang_g.lens_icon_padding);
                    })
                    .attr("fill", (d, i) => { return this._pane_color(i); })
                    .on("mousedown", function () {
                        d3.event.stopPropagation();
                    })
                    .on("click", (d, i) => {
                        var len: Lens.BaseD3Lens;
                        switch (i) {
                            case 0: {
                                len = new Lens.NetworkLens(this._element,this._manyLens);
                                break;
                            }
                            case 1: {
                                len = new Lens.WordCloudLens(this._element, this._manyLens);
                                break;
                            }
                            case 2: {
                                len = new Lens.PieChartLens(this._element, this._manyLens);
                                break;
                            }
                            case 3: {
                                len = new Lens.MapLens(this._element, this._manyLens);
                                break;
                            }
                            case 4: {
                                len = new Lens.BarChartLens(this._element, this._manyLens);
                                break;
                            }
                            case 5: {
                                len = new Lens.TreeNetworkLens(this._element, this._manyLens);
                                break;
                            }
                        }
                        len.Render(this._pane_color(i));

                        d3.event.stopPropagation();
                    })
                ;

            }

            private ClosePane(msg: string) {

            }

            private DragFunc() {
                var pane_rect_width = this._pang_g.rect_width;
                var pane_rect_height = this._pang_g.rect_height;
                this._pang_g.svg_g
                    .attr("transform", "translate(" + [
                        this._pang_g.x = Math.max(0, Math.min(parseFloat(this._element.style("width")) - pane_rect_width, d3.event.x)),
                        this._pang_g.y = Math.max(0, Math.min(parseFloat(this._element.style("height")) - pane_rect_height, d3.event.y))
                    ] + ")");
            }
        }
    }
}