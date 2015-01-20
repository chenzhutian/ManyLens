///<reference path = "./Lens/LensList.ts" />

module ManyLens {

    export class LensAssemblyFactory {

        public static CombineLens(element: D3.Selection,
            firstLens: Lens.BaseD3Lens,
            secondLens: Lens.BaseD3Lens,
            manyLens:ManyLens): Lens.BaseCompositeLens {
            var t = [firstLens.Type, secondLens.Type]
                .sort(function (a, b) {
                    return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
                })
                .join("_");
            console.log(Lens.cBoundleLens.Type);
            switch (t) {
                case Lens.NetworkLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.cBoundleLens(element,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens,
                        manyLens);
                }
                case Lens.cBoundleLens.Type + "_" + Lens.WordCloudLens.Type: {
                    if (firstLens.Type != Lens.cBoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    return (<Lens.cBoundleLens>firstLens).AddComponentLens(secondLens);
                }
                case Lens.cBoundleLens.Type + "_" + Lens.NetworkLens.Type: {
                    if (firstLens.Type != Lens.cBoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                    return (<Lens.cBoundleLens>firstLens).AddComponentLens(secondLens);
                }
                case Lens.cBoundleLens.Type + "_" + Lens.cBoundleLens.Type: {
                    return (<Lens.cBoundleLens>firstLens).AddComponentLens(secondLens);
                }

                case Lens.WordCloudLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.cWordCloudLens(element,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens,
                        manyLens);
                }
                default: {
                    console.log(t);
                    return null;
                }
            }
        }

        public static DetachLens(element: D3.Selection,
            hostLens: Lens.BaseCompositeLens,
            componentLens: Lens.BaseSingleLens,
            manyLens: ManyLens): Lens.BaseD3Lens {
            var t = [hostLens.Type, componentLens.Type]
                .sort(function (a, b) {
                    return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
                })
                .join("_");
            switch (t) {
                case Lens.cBoundleLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return hostLens.RemoveComponentLens(componentLens);
                }
                case Lens.cBoundleLens.Type + "_" + Lens.NetworkLens.Type: {
                    return hostLens.RemoveComponentLens(componentLens);
                }
                default: return null;
            }
        }
    }
}