var ManyLens;
(function (_ManyLens) {
    var ManyLens = (function () {
        function ManyLens() {
            this._curveView_id = "cruveView";
            this._mapView_id = "mapView";
            this._mapSvg_id = "mapSvg";
            this._historyView_id = "historyView";
            this._historySvg_id = "historySvg";
            this._lens = new Map();
            this._lens_count = 0;
            this._curveView = d3.select("#" + this._curveView_id);
            this._curve = new _ManyLens.TweetsCurve.Curve(this._curveView);
            this._curve.Render([10, 10]);
            this._mapView = d3.select("#" + this._mapView_id);
            this._mapSvg = d3.select("#" + this._mapSvg_id);
            this._lensPane = new _ManyLens.Pane.ClassicLensPane(this._mapSvg, this);
            this._historySvg = d3.select("#" + this._historySvg_id);
            this._historyTrees = new _ManyLens.LensHistory.HistoryTrees(this._historySvg);
            this._historyTrees.addTree();
            this._lensPane.Render();
        }
        Object.defineProperty(ManyLens.prototype, "LensCount", {
            get: function () {
                return this._lens_count;
            },
            enumerable: true,
            configurable: true
        });
        ManyLens.prototype.GetLens = function (id) {
            return this._lens.get(id);
        };
        ManyLens.prototype.AddLens = function (lens) {
            this._lens.set("lens_" + this._lens_count, lens);
            this._lens_count++;
            this._historyTrees.addNode({
                color: lens.LensTypeColor,
                lensType: lens.Type,
                tree_id: 0
            });
        };
        ManyLens.prototype.RemoveLens = function (lens) {
            var lens;
            this._lens.delete(lens.ID);
            return lens;
        };
        ManyLens.prototype.DetachCompositeLens = function (element, hostLens, componentLens) {
            var lensC = _ManyLens.LensAssemblyFactory.DetachLens(element, hostLens, componentLens, this);
            if (lensC.IsCompositeLens) {
                lensC.Render("black");
                lensC.DisplayLens();
            }
            else {
                this.RemoveLens(hostLens);
                lensC.DisplayLens();
            }
        };
        return ManyLens;
    })();
    _ManyLens.ManyLens = ManyLens;
})(ManyLens || (ManyLens = {}));
