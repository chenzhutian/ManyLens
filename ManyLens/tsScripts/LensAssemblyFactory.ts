///<reference path = "./Lens/LensList.ts" />

module ManyLens {

    export class LensAssemblyFactory {

        public static Combine(element: D3.Selection,
            firstLens: Lens.BaseD3Lens,
            secondLens: Lens.BaseD3Lens,
            manyLens:ManyLens): Lens.BaseCompositeLens {
            var t = [firstLens.Type, secondLens.Type].sort().join("_");
            switch (t) {
                case Lens.NetworkLens.Type + "_" + Lens.WordCloudLens.Type: {
                    console.log("here");
                }
                    break;
            }

            return;
        }

    }
}