module ManyLens {

    export module Lens {

        export class BaseCompositeLens extends D3ChartObject implements ILens{

            protected _id: string;
            protected _type: string;
            protected _lens_type_color: string;
            protected _manyLens: ManyLens;
            public IsCompositeLens: boolean = true;

            protected _lens_circle_G: D3.Selection;
            protected _lc_cx: number;
            protected _lc_cy: number;


            protected _lens: Array<Lens.ILens>;
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

            constructor(element: D3.Selection,firstLens:Lens.ILens,secondLens:Lens.ILens,manyLens:ManyLens) {
                super(element);
                this._manyLens = manyLens;
                this._lens = new Array<Lens.ILens>();
                this._lens.push(firstLens);
                this._lens.push(secondLens);
                this._lc_cx = firstLens.LensCX;
                this._lc_cy = firstLens.LensCY;


                this._success = true;
            }

            public render(data: Array<any>): void {

                var bl = new BoundleLens(this._element, this._manyLens);
                bl.showLens(bl.testExtractData(), this._lc_cx, this._lc_cy);

                this._lens.forEach(function (d) {
                    d.LensGroup = bl.LensGroup;
                    console.log(d);
                });

            }

            public extractData(): Array<any> {
                var data: Array<any> = new Array<any>();

                return data;
            }

            
        }
    }
}