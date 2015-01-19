///<reference path = "./Lens/LensList.ts" />

module ManyLens {

    export class LensAssemblyFactory {

        public static CombineLens(element: D3.Selection,
            firstLens: Lens.BaseD3Lens,
            secondLens: Lens.BaseD3Lens,
            manyLens:ManyLens): Lens.BaseCompositeLens {
            var t = [firstLens.Type, secondLens.Type].sort().join("_");
            switch (t) {
                case Lens.NetworkLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.BoundleLens(element,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens,
                        manyLens);
                }
                default: return null;
            }

            return;
        }

    }
}