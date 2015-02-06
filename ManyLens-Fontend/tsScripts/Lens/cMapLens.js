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
        var cMapLens = (function (_super) {
            __extends(cMapLens, _super);
            function cMapLens(element, manyLens, firstLens, secondLens) {
                _super.call(this, element, cMapLens.Type, manyLens, firstLens, secondLens);
            }
            cMapLens.prototype.Render = function (color) {
                if (color === void 0) { color = "red"; }
                _super.prototype.Render.call(this, color);
            };
            cMapLens.prototype.DisplayLens = function () {
                _super.prototype.DisplayLens.call(this);
            };
            cMapLens.Type = "cMapLens";
            return cMapLens;
        })(Lens.cBaseMapLens);
        Lens.cMapLens = cMapLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
