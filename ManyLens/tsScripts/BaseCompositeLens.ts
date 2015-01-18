module ManyLens {

    export module Lens {

        export class BaseCompositeLens extends BaseD3Lens {

            protected _id: string;
            protected _type: string;
            protected _lens_type_color: string;
            protected _manyLens: ManyLens;
            public IsCompositeLens: boolean = true;

            protected _lens_circle_G: D3.Selection;
            protected _lc_cx: number;
            protected _lc_cy: number;


            protected _lens: Array<Lens.BaseD3Lens>;
            protected _success: boolean = false;

            public get ID(): string {
                return this._id;
            }
            public get Type(): string {
                return this._type;
            }
            public get isSuccess(): boolean {
                return this._success;
            }
            public get LensTypeColor(): string {
                return this._lens_type_color;
            }
            public get LensCX(): number {
                return this._lc_cx;
            }
            public get LensCY(): number {
                return this._lc_cy;
            }
            public get LensGroup(): D3.Selection {
                return this._lens_circle_G;
            }
            public set LensGroup(lensG: D3.Selection) {
                this._lens_circle_G = lensG;
            }

            constructor(element: D3.Selection,firstLens:Lens.BaseD3Lens,secondLens:Lens.BaseD3Lens,manyLens:ManyLens) {
                super(element,"",manyLens);
                this._manyLens = manyLens;
                this._lens = new Array<Lens.BaseD3Lens>();
                this._lens.push(firstLens);
                this._lens.push(secondLens);
                this._lc_cx = firstLens.LensCX;
                this._lc_cy = firstLens.LensCY;


                this._success = true;
            }

            public render(data: Array<any>): void {
                this._sc_lc_svg = this._element
                    .append("g")
                    .attr("class", "lens")
                ;


                var bl = new BoundleLens(this._element, this._manyLens);
                bl.showLens(bl.testExtractData(), this._lc_cx, this._lc_cy);

                this._lens.forEach(function (d) {
                    d.LensGroup = bl.LensGroup;
                    console.log(d);
                });

            }

            public showLens(any = null): { lcx: number; lcy: number; duration: number } {


                return super.showLens();
            }

            public extractData(): Array<any> {
                var data: Array<any> = new Array<any>();

                return data;
            }

            
        }
    }
}