var ManyLens;
(function (ManyLens) {
    var LensAssemblyFactory = (function () {
        function LensAssemblyFactory() {
        }
        LensAssemblyFactory.CombineLens = function (element, firstLens, secondLens, manyLens) {
            var t = [firstLens.Type, secondLens.Type].sort().join("_");
            switch (t) {
                case ManyLens.Lens.NetworkLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.BoundleLens(element, firstLens, secondLens, manyLens);
                    }
                case ManyLens.Lens.BoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.BoundleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                        firstLens.AddComponentLens(secondLens);
                        return firstLens;
                    }
                case ManyLens.Lens.BoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        if (firstLens.Type != ManyLens.Lens.BoundleLens.Type) {
                            var tempLens = firstLens;
                            firstLens = secondLens;
                            secondLens = tempLens;
                        }
                        firstLens.AddComponentLens(secondLens);
                        return firstLens;
                    }
                case ManyLens.Lens.BoundleLens.Type + "_" + ManyLens.Lens.BoundleLens.Type:
                    {
                        firstLens.AddComponentLens(secondLens);
                        return firstLens;
                    }
                default:
                    return null;
            }
        };
        LensAssemblyFactory.DetachLens = function (element, hostLens, componentLens, manyLens) {
            var t = [hostLens.Type, componentLens.Type].sort().join("_");
            switch (t) {
                case ManyLens.Lens.BoundleLens.Type + "_" + ManyLens.Lens.WordCloudLens.Type:
                    {
                        return new ManyLens.Lens.NetworkLens(element, manyLens);
                    }
                case ManyLens.Lens.BoundleLens.Type + "_" + ManyLens.Lens.NetworkLens.Type:
                    {
                        return new ManyLens.Lens.WordCloudLens(element, manyLens);
                    }
                default:
                    return null;
            }
        };
        return LensAssemblyFactory;
    })();
    ManyLens.LensAssemblyFactory = LensAssemblyFactory;
})(ManyLens || (ManyLens = {}));
