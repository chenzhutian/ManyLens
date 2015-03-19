///<reference path = "../D3ChartObject.ts" />
module ManyLens {
    export module LensHistory {
        //This history tree is not urgly, need to refine
        interface HistoryTree {
            id: number;
            tree_layout: D3.Layout.TreeLayout;
            diagonal: D3.Svg.Diagonal;
            root: HistoryNode;
            nodes: Array<HistoryNode>;
            node: any;
            link: any;
            tree_g: D3.Selection;
        }
        interface HistoryNode extends D3.Layout.GraphNode {
            color: string;
            lensType: string;
            tree_id: number;
        }

        export class HistoryTrees extends D3ChartObject {
            private _trees: Array<HistoryTree> = [];

            constructor(element: D3.Selection, manyLens:ManyLens) {
                super(element, manyLens);
                this._element.attr("height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });


            }

            public Render() {

            }

            public addTree() {
                var treeG = this._element.append("g")
                    .attr("id", this._trees.length)
                    .attr("class", "historyTree");

                var tree: HistoryTree = {
                    id: this._trees.length,
                    tree_layout: d3.layout.tree()
                        .size([parseFloat(this._element.style("width")),
                            parseFloat(this._element.style("height"))]),
                    tree_g: treeG,
                    root: { tree_id: this._trees.length, color: "black", lensType: null },
                    nodes: [],
                    node: treeG.selectAll(".node"),
                    link: treeG.selectAll(".link"),
                    diagonal: d3.svg.diagonal()
                };

                tree.tree_layout.nodes(tree.root);
                tree.root.parent = tree.root;
                tree.root.px = tree.root.x;
                tree.root.py = tree.root.y;

                tree.nodes.push(tree.root);
                this._trees.push(tree);
            }

            public addNode(node: HistoryNode) {
                var tree = this._trees[node.tree_id];
                node.id = tree.nodes.length.toString();

                var p = tree.nodes[Math.random() * tree.nodes.length | 0];
                if (p.children) p.children.push(node); else p.children = [node];
                tree.nodes.push(node);

                tree.node = tree.node.data(tree.tree_layout.nodes(tree.root), function (d) { return d.id });
                tree.link = tree.link.data(tree.tree_layout.links(tree.nodes), function (d) { return d.source.id + "-" + d.target.id; });

                // Add entering nodes in the parent’s old position.
                tree.node.enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 10)
                    .attr("fill",node.color)
                    .attr("cx", function (d) { return d.parent.px; })
                    .attr("cy", function (d) { return d.parent.py; });

                // Add entering links in the parent’s old position.
                tree.link.enter().insert("path", ".node")
                    .attr("class", "link")
                    .attr("stroke", "#000")
                    .attr("fill", "none")
                    .attr("d", function (d) {
                        var o = { x: d.source.px, y: d.source.py };
                        return tree.diagonal({ source: o, target: o });
                    });

                // Transition nodes and links to their new positions.
                var t = tree.tree_g.transition()
                    .duration(500);

                t.selectAll(".link")
                    .attr("d", tree.diagonal);

                t.selectAll(".node")
                    .attr("cx", function (d) { return d.px = d.x; })
                    .attr("cy", function (d) { return d.py = d.y; });

            }
        }
    }
}