///<reference path = "./Lens/LensList.ts" />

module ManyLens {

    export class LensAssemblyFactory {
        //TODO add more laws here
        public static CombineLens(element: D3.Selection,
            manyLens: ManyLens,
            firstLens: Lens.BaseD3Lens,
            secondLens: Lens.BaseD3Lens): Lens.BaseCompositeLens {
            var t = [firstLens.Type, secondLens.Type]
                //.sort(function (a, b) {
                //    return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
                //})
                .join("_");

            switch (t) {

                /*--------------------------------cBoundle Lens------------------------------*/
                //single + single = composite
                case Lens.WordCloudLens.Type + "_" + Lens.NetworkLens.Type:{
                    return new Lens.cBoundleLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.WordCloudLens.Type + "_" + Lens.cBoundleLens.Type:
                case Lens.NetworkLens.Type + "_" + Lens.cBoundleLens.Type:{
                    if (firstLens.Type != Lens.cBoundleLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cBoundleLens.Type + "_" + Lens.WordCloudLens.Type:
                case Lens.cBoundleLens.Type + "_" + Lens.NetworkLens.Type: {
              //  case Lens.cBoundleLens.Type + "_" + Lens.cBoundleLens.Type: {
                    return (<Lens.cBoundleLens>firstLens).AddComponentLens(secondLens);
                }


                /*--------------------------------cWordCloudNetwork Digram Lens------------------------------*/
                case Lens.NetworkLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.cWordCloudNetworkLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.NetworkLens.Type + "_" + Lens.cWordCloudNetworkLens.Type:
                case Lens.WordCloudLens.Type + "_" + Lens.cWordCloudNetworkLens.Type:{
                    if (firstLens.Type != Lens.cWordCloudNetworkLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cWordCloudNetworkLens.Type + "_" + Lens.WordCloudLens.Type:
                case Lens.cWordCloudNetworkLens.Type + "_" + Lens.NetworkLens.Type:{
               // case Lens.cWordCloudNetworkLens.Type + "_" + Lens.cWordCloudNetworkLens.Type: {
                    return (<Lens.cWordCloudNetworkLens>firstLens).AddComponentLens(secondLens);
                }

                /*--------------------------------cWordCloudPie Digram Lens------------------------------*/
                case Lens.WordCloudLens.Type + "_" + Lens.PieChartLens.Type:
                case Lens.PieChartLens.Type + "_" + Lens.WordCloudLens.Type: {
                    //if (firstLens.Type != Lens.WordCloudLens.Type) {
                    //    var tempLens = firstLens;
                    //    firstLens = secondLens;
                    //    secondLens = tempLens;
                    //}

                    return new Lens.cWordCloudPieLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.PieChartLens.Type + "_" + Lens.cWordCloudPieLens.Type:
                case Lens.WordCloudLens.Type + "_" + Lens.cWordCloudPieLens.Type: {
                    if (firstLens.Type != Lens.cWordCloudPieLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cWordCloudPieLens.Type + "_" + Lens.WordCloudLens.Type:
                case Lens.cWordCloudPieLens.Type + "_" + Lens.PieChartLens.Type:{
             //   case Lens.cWordCloudPieLens.Type + "_" + Lens.cWordCloudPieLens.Type: {
                    return (<Lens.cWordCloudPieLens>firstLens).AddComponentLens(secondLens);
                }


                /*-----------------------------cSunBrust Diagram Lens--------------------------*/
                //single + single = composite
                case Lens.PieChartLens.Type + "_" + Lens.NetworkLens.Type: {
                    return new Lens.cSunBrustLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.PieChartLens.Type + "_" + Lens.cSunBrustLens.Type: 
                case Lens.NetworkLens.Type + "_" + Lens.cSunBrustLens.Type:{
                    if (firstLens.Type != Lens.cSunBrustLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cSunBrustLens.Type + "_" + Lens.PieChartLens.Type:
                case Lens.cSunBrustLens.Type + "_" + Lens.NetworkLens.Type: {
               // case Lens.cSunBrustLens.Type + "_" + Lens.cSunBrustLens.Type: {
                    return (<Lens.cSunBrustLens>firstLens).AddComponentLens(secondLens);
                }

                /*-----------------------------cChord Diagram Lens--------------------------*/
                //single + single = composite
                case Lens.NetworkLens.Type + "_" + Lens.PieChartLens.Type: {
                    return new Lens.cChordDiagramLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.PieChartLens.Type + "_" + Lens.cChordDiagramLens.Type: 
                case Lens.NetworkLens.Type + "_" + Lens.cChordDiagramLens.Type: {
                    if (firstLens.Type != Lens.cChordDiagramLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cChordDiagramLens.Type + "_" + Lens.PieChartLens.Type: 
                case Lens.cChordDiagramLens.Type + "_" + Lens.NetworkLens.Type: {
               // case Lens.cChordDiagramLens.Type + "_" + Lens.cChordDiagramLens.Type: {
                    return (<Lens.cChordDiagramLens>firstLens).AddComponentLens(secondLens);
                }
                
                /*-----------------------------cMapNetwork Diagram Lens--------------------------*/
                //single + single = composite
                case Lens.MapLens.Type + "_" + Lens.NetworkLens.Type:
                case Lens.NetworkLens.Type + "_" + Lens.MapLens.Type: {
                    return new Lens.cMapNetworkLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.MapLens.Type + "_" + Lens.cMapNetworkLens.Type:
                case Lens.NetworkLens.Type + "_" + Lens.cMapNetworkLens.Type: {
                    if (firstLens.Type != Lens.cMapNetworkLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cMapNetworkLens.Type + "_" + Lens.MapLens.Type:
                case Lens.cMapNetworkLens.Type + "_" + Lens.NetworkLens.Type:{
              //  case Lens.cMapNetworkLens.Type + "_" + Lens.cMapNetworkLens.Type: {
                    return (<Lens.cMapNetworkLens>firstLens).AddComponentLens(secondLens);
                }

                /*-----------------------------cMapBar Diagram Lens--------------------------*/
                //single + single = composite
                case Lens.MapLens.Type + "_" + Lens.PieChartLens.Type:
                case Lens.PieChartLens.Type + "_" + Lens.MapLens.Type: {
                    return new Lens.cMapBarLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.MapLens.Type + "_" + Lens.cMapBarLens.Type:
                case Lens.PieChartLens.Type + "_" + Lens.cMapBarLens.Type: {
                    if (firstLens.Type != Lens.cMapBarLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cMapBarLens.Type + "_" + Lens.MapLens.Type:
                case Lens.cMapBarLens.Type + "_" + Lens.PieChartLens.Type:{
              //  case Lens.cMapBarLens.Type + "_" + Lens.cMapBarLens.Type: {
                    return (<Lens.cMapBarLens>firstLens).AddComponentLens(secondLens);
                }

                /*-----------------------------cMapWordCloud Diagram Lens--------------------------*/
                //single + single = composite
                case Lens.MapLens.Type + "_" + Lens.WordCloudLens.Type:
                case Lens.WordCloudLens.Type + "_" + Lens.MapLens.Type: {
                    return new Lens.cMapWordCloudLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                //composite + single||composite = composite
                case Lens.MapLens.Type + "_" + Lens.cMapWordCloudLens.Type:
                case Lens.WordCloudLens.Type + "_" + Lens.cMapWordCloudLens.Type: {
                    if (firstLens.Type != Lens.cMapWordCloudLens.Type) {
                        var tempLens = firstLens;
                        firstLens = secondLens;
                        secondLens = tempLens;
                    }
                }
                case Lens.cMapWordCloudLens.Type + "_" + Lens.MapLens.Type:
                case Lens.cMapWordCloudLens.Type + "_" + Lens.WordCloudLens.Type:{
            //    case Lens.cMapWordCloudLens.Type + "_" + Lens.cMapWordCloudLens.Type: {
                    return (<Lens.cMapWordCloudLens>firstLens).AddComponentLens(secondLens);
                }

                /*----------------------------Single Lens Self Increment---------------------*/
                case Lens.WordCloudLens.Type + "_" + Lens.WordCloudLens.Type: {
                    return new Lens.cWordCloudLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                case Lens.NetworkLens.Type + "_" + Lens.NetworkLens.Type: {
                    return new Lens.cTreeNetworkLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }

                    //just for test now
                case Lens.PieChartLens.Type + "_" + Lens.PieChartLens.Type: {
                    return new Lens.cPieChartLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
                }
                case Lens.MapLens.Type + "_" + Lens.MapLens.Type: {
                    return new Lens.cMapLens(element,
                        manyLens,
                        <Lens.BaseSingleLens>firstLens,
                        <Lens.BaseSingleLens>secondLens);
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
            var res:Lens.BaseD3Lens = hostLens.RemoveComponentLens(componentLens);

            if (res.IsCompositeLens && (<Lens.BaseCompositeLens>res).NeedtoReshape) {
                var componentsKind: string[] = [];
                var cLens: Lens.BaseCompositeLens = (<Lens.BaseCompositeLens>res);
                cLens.ComponentsKind.forEach((value,key) => {
                    componentsKind.push(key);
                });
                var t: string = componentsKind.join("_");

                switch (t) {
                    case Lens.WordCloudLens.Type: {
                        return new Lens.cWordCloudLens(element, manyLens, cLens);
                    }
                    case Lens.NetworkLens.Type: {
                        return new Lens.cTreeNetworkLens(element, manyLens, cLens);
                    }
                    case Lens.PieChartLens.Type: {
                        return new Lens.cPieChartLens(element, manyLens, cLens);
                    }
                    case Lens.MapLens.Type: {
                        return new Lens.cMapLens(element, manyLens, cLens);
                    }
                }
            } else {
                return res;
            }
        }
    }
}