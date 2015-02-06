var ManyLens;
(function (ManyLens) {
    var LensAssemblyFactory = (function () {
        function LensAssemblyFactory() {
        }
        LensAssemblyFactory.CombineLens = function (element, manyLens, firstLens, secondLens) {
            var t = [firstLens.Type, secondLens.Type].join("_");
            switch (t) {
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cBoundleLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cBoundleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudNetworkLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cWordCloudNetworkLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.cWordCloudNetworkLens.Type + "_" + ManyLens.Lens.cWordCloudNetworkLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudPieLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cWordCloudPieLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cWordCloudPieLens.Type + "_" + ManyLens.Lens.cWordCloudPieLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cSunBrustLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cSunBrustLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.cSunBrustLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cChordDiagramLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cChordDiagramLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapNetworkLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cMapNetworkLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.cMapNetworkLens.Type + "_" + ManyLens.Lens.cMapNetworkLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapBarLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapBarLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cMapBarLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cMapBarLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cMapBarLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapBarLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cMapBarLens.Type + "_" + ManyLens.Lens.cMapBarLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapWordCloudLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type:
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cMapWordCloudLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cMapWordCloudLens.Type + "_" + ManyLens.Lens.cMapWordCloudLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cTreeNetworkLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cPieChartLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.MapLens.Type + "_" + ManyLens.Lens.MapLens.Type:
                    {
                        return new ManyLens.Lens.cMapLens(element, manyLens, firstLens, secondLens);
                    }
                default:
                    {
                        console.log(t);
                        return null;
                    }
            }
        };
        LensAssemblyFactory.DetachLens = function (element, hostLens, componentLens, manyLens) {
            var res = hostLens.RemoveComponentLens(componentLens);
            if (res.IsCompositeLens && res.NeedtoReshape) {
                var componentsKind = [];
                var cLens = res;
                cLens.ComponentsKind.forEach(function (value, key) {
                    componentsKind.push(key);
                });
                var t = componentsKind.join("_");
                switch (t) {
                    case ManyLens.Lens.WordCloudLens.Type:
                        {
                            return new ManyLens.Lens.cWordCloudLens(element, manyLens, cLens);
                        }
                    case ManyLens.Lens.NetworkLens.Type:
                        {
                            return new ManyLens.Lens.cTreeNetworkLens(element, manyLens, cLens);
                        }
                    case ManyLens.Lens.PieChartLens.Type:
                        {
                            return new ManyLens.Lens.cPieChartLens(element, manyLens, cLens);
                        }
                    case ManyLens.Lens.MapLens.Type:
                        {
                            return new ManyLens.Lens.cMapLens(element, manyLens, cLens);
                        }
                }
            }
            else {
                return res;
            }
        };
        return LensAssemblyFactory;
    })();
    ManyLens.LensAssemblyFactory = LensAssemblyFactory;
})(ManyLens || (ManyLens = {}));
