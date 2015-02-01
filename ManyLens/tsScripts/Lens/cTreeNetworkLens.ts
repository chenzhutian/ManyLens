///<reference path = "./BaseCompositeLens.ts" />
module ManyLens {
    export module Lens {
        export class cTreeNetworkLens extends BaseCompositeLens {

            public static Type: string = "cTreeNetworkLens";

            private _theta: number = 360;
            private _tree: D3.Layout.TreeLayout = d3.layout.tree();


            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cTreeNetworkLens.Type, manyLens, firstLens, secondLens);

            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            protected ExtractData(): any {
                var data: D3.Layout.GraphNode = {
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
            }

            public DisplayLens(): void {
                super.DisplayLens();
                var data = this.ExtractData();
                var lensG = this._lens_circle_svg;

                var nodeRadius = 4.5;
                var diagonal = d3.svg.diagonal.radial()
                    .projection(function (d) { return [d.y, d.x / 180 * Math.PI]; });

                this._tree
                    .size([this._theta, this._lens_circle_radius - nodeRadius])
                    .separation(function (a, b) {
                        return (a.parent == b.parent ? 1 : 2) / a.depth;
                    });

                var nodes = this._tree.nodes(data),
                    links = this._tree.links(nodes);

                var link = lensG.selectAll("path")
                    .data(links)
                    .enter().append("path")
                    .attr("fill", "none")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1.5)
                    .attr("d", diagonal)
                ;

                var node = lensG.selectAll(".node")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                    })
                ;

                node.append("circle")
                    .attr("r", nodeRadius)
                    .attr("stroke", "steelblue")
                    .attr("fill", "#fff")
                    .attr("stroke-width", 1.5)
                ;

            }


        }
    }
} 