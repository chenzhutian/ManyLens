///<reference path = "./BaseD3Lens.ts" />
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

            protected _base_component: BaseD3Lens;
            protected _sub_component: BaseD3Lens;

            protected _lens: Array<BaseD3Lens>;
            protected _success: boolean = false;

            public get IsSuccess(): boolean {
                return this._success;
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

                this._select_circle = new Array<selectCircle>();
                this._lens = new Array<BaseD3Lens>();

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

            public Render(color:string): void {
                super.Render(color);

            }

            public DisplayLens(any = null): {
                lcx: number; lcy: number; duration: number
            } {
                super.DisplayLens();

                return {
                    lcx:this._lc_cx,
                    lcy: this._lc_cy,
                    duration:300
                };
            }

            protected ExtractData(): Array<any> {
                var data: Array<any> = new Array<any>();

                return data;
            }

            protected LensCircleDragFunc(): void {
                super.LensCircleDragFunc();

                this.ReDrawLinkLine();
            }

            protected LensCircleZoomFunc(): void {
                super.LensCircleZoomFunc();

                this.ReDrawLinkLine();
            }

            private ReDrawLinkLine(): void {

                for (var i = 0, len = this._select_circle.length; i < len - 1; ++i) {
                    var sc = this._select_circle[i];
                    var theta = Math.atan((this._lc_cy - sc._sc_cy) / (this._lc_cx - sc._sc_cx));
                    var cosTheta = this._lc_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lc_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);

                    sc._line
                        .attr("x1", sc._sc_cx + sc._sc_cx * sc._sc_scale * cosTheta)
                        .attr("y1", sc._sc_cy + sc._sc_cy * sc._sc_scale * sinTheta)
                        .attr("x2", this._lc_cx - this._lc_radius * this._lc_scale * cosTheta)
                        .attr("y2", this._lc_cy - this._lc_radius * this._lc_scale * sinTheta)
                }

            }



        }
    } 
}