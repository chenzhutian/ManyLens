///<reference path = "./cBaseMapLens.ts" />
module ManyLens {
    export module Lens {
        export class cMapLens extends cBaseMapLens {
            
            public static Type: string = "cMapLens";

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cMapLens.Type, manyLens, firstLens, secondLens);
            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            public DisplayLens(): void {
                super.DisplayLens();
            }
        }
    }
}