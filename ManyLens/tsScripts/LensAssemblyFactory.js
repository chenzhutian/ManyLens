var ManyLens;
(function (ManyLens) {
    var LensAssemblyFactory = (function () {
        function LensAssemblyFactory() {
        }
        LensAssemblyFactory.CombineLens = function (element, firstLens, secondLens, manyLens) {
            var t = [firstLens.Type, secondLens.Type].sort(function (a, b) {
                return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
            }).join("_");
            console.log(ManyLens.Lens.cBoundleLens.Type);
            switch (t) {
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cBoundleLens(element, firstLens, secondLens, manyLens);
                    }
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
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cChordDiagramLens(element, firstLens, secondLens, manyLens);
                    }
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.cChordDiagramLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                    }
                case ManyLens.Lens.cChordDiagramLens.Type + "_" + ManyLens.Lens.cChordDiagramLens.Type:
                    {
                        return firstLens.AddComponentLens(secondLens);
                    }
                case ManyLens.Lens.WordCloudLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.cWordCloudLens(element, firstLens, secondLens, manyLens);
                    }
                case ManyLens.Lens.PieChartLens.Type + "_" + ManyLens.Lens.PieChartLens.Type:
                    {
                        return new ManyLens.Lens.cPackingCircleLens(element, firstLens, secondLens, manyLens);
                    }
                default:
                    {
                        console.log(t);
                        return null;
                    }
            }
        };
        LensAssemblyFactory.DetachLens = function (element, hostLens, componentLens, manyLens) {
            var t = [hostLens.Type, componentLens.Type].sort(function (a, b) {
                return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
            }).join("_");
            switch (t) {
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return hostLens.RemoveComponentLens(componentLens);
                    }
                case ManyLens.Lens.cBoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return hostLens.RemoveComponentLens(componentLens);
                    }
                default:
                    return null;
            }
        };
        return LensAssemblyFactory;
    })();
    ManyLens.LensAssemblyFactory = LensAssemblyFactory;
})(ManyLens || (ManyLens = {}));
