﻿///<reference path = "./BaseD3Lens.ts" />
module ManyLens {

    export module Lens {

        interface selectCircle {
            _line: D3.Selection;
            _sc_radius: number;
            _sc_cx: number;
            _sc_cy: number;
            _sc_scale: number;
        }

        export class BaseCompositeLens extends BaseD3Lens {

            public static Type: string = "BaseCompositeLens";

            protected _select_circle: Array<selectCircle>;
            protected _lens: Array<BaseSingleLens>;

            protected _base_component: BaseD3Lens;
            protected _sub_component: BaseD3Lens;

            protected _new_lens_count: number = 1;

            public get Lens(): Array<BaseSingleLens> {
                //这里我感觉有问题，是直接返回本体还是返回复本好
                return this._lens;
            }
            public get SelectCircle(): Array<selectCircle> {
                return this._select_circle;
            }
            public get ComponentNum(): number {
                return this._lens.length;
            }

            constructor(element: D3.Selection,
                type:string,
                firstLens: BaseSingleLens,
                secondLens: BaseSingleLens,
                manyLens: ManyLens) {
                super(element, type, manyLens);

                this._is_composite_lens = true;
                this._lc_cx = firstLens.LensCX;
                this._lc_cy = firstLens.LensCY;

                this._base_component = firstLens;
                this._sub_component = secondLens;

                this._select_circle = new Array<selectCircle>();
                this._lens = new Array<BaseSingleLens>();

                this._lens.push(firstLens);
                this._select_circle.push({
                    _line: firstLens.LinkLine,
                    _sc_cx: firstLens.SelectCircleCX,
                    _sc_cy: firstLens.SelectCircleCY,
                    _sc_radius: firstLens.SelectCircleRadius,
                    _sc_scale:firstLens.SelectCircleScale
                })
                this._lens.push(secondLens);
                this._select_circle.push({
                    _line: secondLens.LinkLine,
                    _sc_cx: secondLens.SelectCircleCX,
                    _sc_cy: secondLens.SelectCircleCY,
                    _sc_radius: secondLens.SelectCircleRadius,
                    _sc_scale: secondLens.SelectCircleScale
                });

            }

            public Render(color: string): void {
                if (!this._sc_lc_svg) {
                    super.Render(color);
                }

                this._base_component.RemoveLens();
                this._base_component.HostLens = this;
                

                if (this._sub_component) {
                    this._sub_component.RemoveLens();
                    this._sub_component.HostLens = this;
                    
                }

                //Update base component and sub component
                this._base_component = this;
                this._sub_component = null;
            }

            protected ExtractData(): Array<any> {
                throw new Error('This method is abstract');
            }

            public DisplayLens():void {
                super.DisplayLens();


                this.ReDrawLinkLine(this._new_lens_count);
            }

            protected LensCircleDragFunc(): void {
                super.LensCircleDragFunc();

                console.log("drag composite lens");
                this.ReDrawLinkLine();
            }

            protected LensCircleZoomFunc(): void {
                super.LensCircleZoomFunc();

                this.ReDrawLinkLine();
            }

            public AddComponentLens(lens: BaseD3Lens):BaseCompositeLens {

                this._sub_component = lens;
                if (lens.IsCompositeLens) {
                    this.AddCompositeLens(<Lens.BaseCompositeLens>lens);

                } else {
                    this.AddSingleLens(<Lens.BaseSingleLens>lens);
                }
                return this;
            }

            public RemoveComponentLens(lens: BaseSingleLens): BaseD3Lens {
                //TODO #1
                var index: number = this._lens.indexOf(lens);
                if (-1 != index) {
                    this._lens.splice(index, 1);
                    this._select_circle.splice(index, 1);
                    if (this.ComponentNum == 1) {
                        this.RemoveWholeSVG();

                        var lastLens = this._lens[0];
                        lastLens.LensCX = this.LensCX;
                        lastLens.LensCY = this.LensCY;
                        lastLens.LensRadius = this.LensRadius;
                        lastLens.LensScale = this.LensScale;
                        lastLens.DetachHostLens();

                        return this._lens[0];

                    } else if (this.ComponentNum < 1) {
                        throw new Error('The number of component of this lens is less than 2!!');
                    }
                }

                return this;
            }

            private ReDrawLinkLine(newLensCount:number = 0): void {
                var i = newLensCount == 0 ? 0 : this._select_circle.length - newLensCount;
                for (var len = this._select_circle.length; i < len; ++i) {
                    var sc = this._select_circle[i];
                    var theta = Math.atan((this._lc_cy - sc._sc_cy) / (this._lc_cx - sc._sc_cx));
                    var cosTheta = this._lc_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lc_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);

                    sc._line
                        .attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta)
                        .attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta)
                        .attr("x2", this._lc_cx - this._lc_radius * this._lc_scale * cosTheta)
                        .attr("y2", this._lc_cy - this._lc_radius * this._lc_scale * sinTheta)
                   // console.log("redraw composite link:" + i);
                }
            }

            private AddCompositeLens(componentLens: BaseCompositeLens): void {
                if (componentLens.SelectCircle.length != componentLens.Lens.length)
                    throw new Error('The length of sc is different from length of lens');

                for (var i = 0, len = componentLens.Lens.length; i < len; ++i) {
                    this._lens.push(componentLens.Lens[i]);
                    this._select_circle.push(componentLens.SelectCircle[i]);
                    componentLens.Lens[i].ChangeHostTo(this);
                }

                componentLens.RemoveWholeSVG();
                this._manyLens.RemoveLens(componentLens);
                this._new_lens_count = componentLens.Lens.length;
            }

            private AddSingleLens(lens: BaseSingleLens):void {
                this._lens.push(lens);
                this._select_circle.push({
                    _line: lens.LinkLine,
                    _sc_cx: lens.SelectCircleCX,
                    _sc_cy: lens.SelectCircleCY,
                    _sc_radius: lens.SelectCircleRadius,
                    _sc_scale: lens.SelectCircleScale
                });
                this._new_lens_count = 1;


            }

            private RemoveWholeSVG() {
                
                this._sc_lc_svg
                    .style("pointer-events", "none")
                    .transition()
                    .duration(200)  //this is hard code, should be optimize
                    .attr("opacity","1e-6")
                    .remove();
            }
        }
    } 
}