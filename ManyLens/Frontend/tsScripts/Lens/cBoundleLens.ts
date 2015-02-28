///<reference path = "./BaseCompositeLens.ts" />
module ManyLens {
    export module Lens {
        export class cBoundleLens extends BaseCompositeLens {

            public static Type: string = "cBoundleLens";

            private _innerRadius: number = this._lens_circle_radius - 0;
            private _cluster: D3.Layout.ClusterLayout = d3.layout.cluster();
            private _boundle: D3.Layout.BundleLayout = d3.layout.bundle();
            private _line: D3.Svg.LineRadial = d3.svg.line.radial();

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cBoundleLens.Type, manyLens,firstLens, secondLens);

                this._cluster.size([360, this._innerRadius])
                    .sort(null)
                    .value(function (d) { return d.size; })
                ;

                this._line.interpolate("bundle")
                    .tension(.85)
                    .radius(function (d) { return d.y; })
                    .angle(function (d) { return d.x / 180 * Math.PI; })
                ;

            }

            public Render(color: string): void {
                super.Render(color);

            }

            public AfterExtractData(): void {

            }
   
            public DisplayLens(): void {
                super.DisplayLens();

                var graph = this._base_accessor_func.Extract(this._data);

                console.log(graph);
                var nodes = this._cluster.nodes(graph),
                    links = buildLinks(graph.links)
                ;

                this._lens_circle_svg.selectAll(".link")
                    .data(this._boundle(links))
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", this._line)
                    .attr("stroke", "steelblue")
                    .attr("stroke-opacity", ".4")
                    .attr("fill", "none")
                ;

                this._lens_circle_svg.selectAll(".node")
                    .data(nodes.filter(function (n) { return !n.children; }))
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
                    .attr("font", '11px "Helvetica Neue", Helvetica, Arial, sans-serif')
                    .append("text")
                    .attr("dx", function (d) { return d.x < 180 ? 8 : -8; })
                    .attr("dy", ".31em")
                    .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
                    .attr("transform", function (d) { return d.x < 180 ? null : "rotate(180)"; })
                    .text(function (d) { return d.key; })
                ;

                function buildTree(graph) {
                    var nodes = graph.nodes;
                    var links = graph.links;
                    var treeRoot = {name:"root",parent:null,children:[]};

                    function find() {
                        //TODO here
                        asdf
                    }

                    links.forEach(function (d) {
                        if (nodes[d.source].children) {
                            nodes[d.source].children.push(nodes[d.target]);
                        } else {
                            nodes[d.source].children = [nodes[d.target]];
                        }
                        if (nodes[d.target].parent) {
                            nodes[d.target].parent.push(nodes[d.source]);
                        } else {
                            nodes[d.target].parent = [nodes[d.source]];
                        }
                    });


                    nodes.forEach(function (d,i) {
                        if (!d.parent) {
                            d.parent = treeRoot;
                            treeRoot.children.push(d);
                        }
                    });
                }

                function buildLinks(graph) {
                    var links = [];
                    var nodes = graph.nodes;
                    graph.links.forEach(function (d) {
                        links.push({ source: nodes[d.source], target: nodes[d.target] });
                    });
                    return links;
                }

                function packageHierarchy(classes) {
                    var map = {};

                    function find(name, data) {
                        var node = map[name], i;
                        if (!node) {
                            node = map[name] = data || { name: name, children: [] };
                            if (name.length) {
                                node.parent = find(name.substring(0, i = name.lastIndexOf(".")), null);
                                node.parent.children.push(node);
                                node.key = name.substring(i + 1);
                            }
                        }
                        return node;
                    }

                    classes.forEach(function (d) {
                        find(d.name, d);
                    });

                    return map[""];
                }

                // Return a list of imports for the given array of nodes.
                function packageImports(nodes) {
                    var map = {},
                        imports = [];

                    // Compute a map from name to node.
                    nodes.forEach(function (d) {
                        map[d.name] = d;
                    });

                    // For each import, construct a link from the source to target node.
                    nodes.forEach(function (d) {
                        if (d.imports)
                            d.imports.forEach(function (i) {
                                var t = map[i];
                                if (t) {
                                    imports.push({ source: map[d.name], target: t });
                                }
                            });
                    });

                    return imports;
                }

            }
        }

    }
}