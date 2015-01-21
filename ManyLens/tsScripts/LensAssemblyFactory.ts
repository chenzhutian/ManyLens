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

                /*--------------------------------cBoundle Lens------------------------------*/
                //single + single = composite
                case Lens.NetworkLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.cBoundleLens(element,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens,
                        manyLens);
                }
                //composite + single||composite = composite
                case Lens.cBoundleLens.Type + "_" + Lens.WordCloudLens.Type: 
                case Lens.cBoundleLens.Type + "_" + Lens.NetworkLens.Type: {
                    if (firstLens.Type != Lens.cBoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cBoundleLens.Type + "_" + Lens.cBoundleLens.Type: {
                    return (<Lens.cBoundleLens>firstLens).AddComponentLens(secondLens);
                }


                /*-----------------------------cChord Diagram Lens--------------------------*/
                //single + single = composite
                case Lens.NetworkLens.Type + "_" + Lens.PieChartLens.Type: {
                    return new Lens.cChordDiagramLens(element,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens,
                        manyLens);
                }
                //composite + single||composite = composite
                case Lens.cChordDiagramLens.Type + "_" + Lens.PieChartLens.Type: 
                case Lens.cChordDiagramLens.Type + "_" + Lens.NetworkLens.Type: {
                    if (firstLens.Type != Lens.cChordDiagramLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cChordDiagramLens.Type + "_" + Lens.cChordDiagramLens.Type: {
                    return (<Lens.cChordDiagramLens>firstLens).AddComponentLens(secondLens);
                }
                
                /*----------------------------Single Lens Self Increment---------------------*/
                case Lens.WordCloudLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.cWordCloudLens(element,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens,
                        manyLens);
                }

                case Lens.PieChartLens.Type + "_" + Lens.PieChartLens.Type: {
                    return new Lens.cPieChartLens(element,
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

                /*--------------------------------cBoundle Lens------------------------------*/
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