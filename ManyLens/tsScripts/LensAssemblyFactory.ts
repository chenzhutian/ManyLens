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

                case Lens.BoundleLens.Type + "_" + Lens.WordCloudLens.Type: {
                    if (firstLens.Type != Lens.BoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    (<Lens.BoundleLens>firstLens).AddComponentLens(secondLens);
                    return (<Lens.BoundleLens>firstLens);
                }
                case Lens.BoundleLens.Type + "_" + Lens.NetworkLens.Type: {
                    if (firstLens.Type != Lens.BoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    (<Lens.BoundleLens>firstLens).AddComponentLens(secondLens);
                    return (<Lens.BoundleLens>firstLens);
                }
                case Lens.BoundleLens.Type + "_" + Lens.BoundleLens.Type: {
                    (<Lens.BoundleLens>firstLens).AddComponentLens(secondLens);
                    return (<Lens.BoundleLens>firstLens);
                }
                default: return null;
            }
        }

        public static DetachLens(element: D3.Selection,
            hostLens: Lens.BaseCompositeLens,
            componentLens: Lens.BaseSingleLens,
            manyLens: ManyLens): Lens.BaseD3Lens {
            var t = [hostLens.Type, componentLens.Type].sort().join("_");
            switch (t) {
                case Lens.BoundleLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.NetworkLens(element, manyLens);
                }
                case Lens.BoundleLens.Type + "_" + Lens.NetworkLens.Type: {
                    return new Lens.WordCloudLens(element, manyLens);
                }
                default: return null;
            }
        }
    }
}