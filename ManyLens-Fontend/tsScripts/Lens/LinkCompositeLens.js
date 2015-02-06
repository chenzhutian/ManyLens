var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ManyLens;
(function (ManyLens) {
    var Lens;
    (function (Lens) {
        var LinkCompositeLens = (function (_super) {
            __extends(LinkCompositeLens, _super);
            function LinkCompositeLens() {
                _super.apply(this, arguments);
            }
            return LinkCompositeLens;
        })(Lens.BaseCompositeLens);
        Lens.LinkCompositeLens = LinkCompositeLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
