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
                    return (<Lens.BoundleLens>firstLens).AddComponentLens(secondLens);
                }
                case Lens.BoundleLens.Type + "_" + Lens.NetworkLens.Type: {
                    if (firstLens.Type != Lens.BoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    return (<Lens.BoundleLens>firstLens).AddComponentLens(secondLens);
                }
                case Lens.BoundleLens.Type + "_" + Lens.BoundleLens.Type: {
                    return (<Lens.BoundleLens>firstLens).AddComponentLens(secondLens);
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
                    return hostLens.RemoveComponentLens(componentLens);
                }
                case Lens.BoundleLens.Type + "_" + Lens.NetworkLens.Type: {
                    return hostLens.RemoveComponentLens(componentLens);
                }
                default: return null;
            }
        }
    }
}