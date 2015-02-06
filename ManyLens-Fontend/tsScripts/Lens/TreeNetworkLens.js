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
        var TreeNetworkLens = (function (_super) {
            __extends(TreeNetworkLens, _super);
            function TreeNetworkLens(element, manyLens) {
                _super.call(this, element, TreeNetworkLens.Type, manyLens);
                this._theta = 360;
                this._tree = d3.layout.tree();
            }
            TreeNetworkLens.prototype.Render = function (color) {
                _super.prototype.Render.call(this, color);
            };
            TreeNetworkLens.prototype.ExtractData = function () {
                var data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "analytics",
                            "children": [
                                {
                                    "name": "cluster",
                                    "children": [
                                        { "name": "AgglomerativeCluster", "size": 3938 },
                                        { "name": "CommunityStructure", "size": 3812 },
                                        { "name": "HierarchicalCluster", "size": 6714 },
                                        { "name": "MergeEdge", "size": 743 }
                                    ]
                                },
                                {
                                    "name": "graph",
                                    "children": [
                                        { "name": "BetweennessCentrality", "size": 3534 },
                                        { "name": "LinkDistance", "size": 5731 },
                                        { "name": "MaxFlowMinCut", "size": 7840 },
                                        { "name": "ShortestPaths", "size": 5914 },
                                        { "name": "SpanningTree", "size": 3416 }
                                    ]
                                },
                                {
                                    "name": "optimization",
                                    "children": [
                                        { "name": "AspectRatioBanker", "size": 7074 }
                                    ]
                                }
                            ]
                        }
                    ]
                };
                return data;
            };
            TreeNetworkLens.prototype.DisplayLens = function (data) {
                _super.prototype.DisplayLens.call(this, data);
                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial().projection(function (d) {
                    return [d.y, d.x / 180 * Math.PI];
                });
                this._tree.size([this._theta, this._lens_circle_radius - nodeRadius]).separation(function (a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });
                var nodes = this._tree.nodes(this._data), links = this._tree.links(nodes);
                var link = this._lens_circle_svg.selectAll("path").data(links).enter().append("path").attr("fill", "none").attr("stroke", "#ccc").attr("stroke-width", 1.5).attr("d", diagonal);
                var node = this._lens_circle_svg.selectAll(".node").data(nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                });
                node.append("circle").attr("r", nodeRadius).style("stroke", "steelblue").style("fill", "#fff").style("stroke-width", 1.5);
            };
            TreeNetworkLens.Type = "TreeNetworkLens";
            return TreeNetworkLens;
        })(Lens.BaseSingleLens);
        Lens.TreeNetworkLens = TreeNetworkLens;
    })(Lens = ManyLens.Lens || (ManyLens.Lens = {}));
})(ManyLens || (ManyLens = {}));
