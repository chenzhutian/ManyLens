var ManyLens;
(function (ManyLens) {
    var LensAssemblyFactory = (function () {
        function LensAssemblyFactory() {
        }
        LensAssemblyFactory.CombineLens = function (element, manyLens, firstLens, secondLens) {
            var t = [firstLens.Type, secondLens.Type].join("_");
            switch (t) {
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cBoundleLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cBoundleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.cBoundleLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.cSunBrustLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.cSunBrustLens.Type:
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
                        console.log(firstLens, secondLens);
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cChordDiagramLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
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
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudLens(element, manyLens, firstLens, secondLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cPackingCircleLens(element, manyLens, firstLens, secondLens);
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
