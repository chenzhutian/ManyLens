///<reference path = "./BaseCompositeLens.ts" />
module ManyLens {
    export module Lens {
        export class cBoundleLens extends BaseCompositeLens {

            public static Type: string = "cBoundleLens";

            private _innerRadius: number = this._lc_radius - 0;
            private _cluster: D3.Layout.ClusterLayout = d3.layout.cluster();
            private _boundle: D3.Layout.BundleLayout = d3.layout.bundle();
            private _line: D3.Svg.LineRadial = d3.svg.line.radial();

            constructor(element: D3.Selection,
                firstLens: BaseSingleLens,
                secondLens: BaseSingleLens,
                manyLens: ManyLens.ManyLens) {
                super(element, cBoundleLens.Type, firstLens, secondLens, manyLens);

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

            protected ExtractData(): Array<any> {
                

                var data: Array<any> = [

                    { "name": "flare.util.palette.ShapePalette", "size": 2059, "imports": ["flare.util.palette.Palette", "flare.util.Shapes"] },
                    { "name": "flare.util.palette.SizePalette", "size": 2291, "imports": ["flare.util.palette.Palette"] },
                    { "name": "flare.util.Property", "size": 5559, "imports": ["flare.util.IPredicate", "flare.util.IValueProxy", "flare.util.IEvaluable"] },
                    { "name": "flare.util.Shapes", "size": 19118, "imports": ["flare.util.Arrays"] },
                    { "name": "flare.util.Sort", "size": 6887, "imports": ["flare.util.Arrays", "flare.util.Property"] },
                    { "name": "flare.util.Stats", "size": 6557, "imports": ["flare.util.Arrays", "flare.util.Property"] },
                    { "name": "flare.util.Strings", "size": 22026, "imports": ["flare.util.Dates", "flare.util.Property"] },
                    { "name": "flare.vis.axis.Axes", "size": 1302, "imports": ["flare.animate.Transitioner", "flare.vis.Visualization"] },
                    { "name": "flare.vis.axis.Axis", "size": 24593, "imports": ["flare.animate.Transitioner", "flare.scale.LinearScale", "flare.util.Arrays", "flare.scale.ScaleType", "flare.util.Strings", "flare.display.TextSprite", "flare.scale.Scale", "flare.util.Stats", "flare.scale.IScaleMap", "flare.vis.axis.AxisLabel", "flare.vis.axis.AxisGridLine"] },
                    { "name": "flare.vis.axis.AxisGridLine", "size": 652, "imports": ["flare.vis.axis.Axis", "flare.display.LineSprite"] },
                    { "name": "flare.vis.axis.AxisLabel", "size": 636, "imports": ["flare.vis.axis.Axis", "flare.display.TextSprite"] },
                    { "name": "flare.vis.axis.CartesianAxes", "size": 6703, "imports": ["flare.animate.Transitioner", "flare.display.RectSprite", "flare.vis.axis.Axis", "flare.display.TextSprite", "flare.vis.axis.Axes", "flare.vis.Visualization", "flare.vis.axis.AxisGridLine"] },
                    { "name": "flare.vis.controls.AnchorControl", "size": 2138, "imports": ["flare.vis.controls.Control", "flare.vis.Visualization", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.controls.ClickControl", "size": 3824, "imports": ["flare.vis.events.SelectionEvent", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.Control", "size": 1353, "imports": ["flare.vis.controls.IControl", "flare.util.Filter"] },
                    { "name": "flare.vis.controls.ControlList", "size": 4665, "imports": ["flare.vis.controls.IControl", "flare.util.Arrays", "flare.vis.Visualization", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.DragControl", "size": 2649, "imports": ["flare.vis.controls.Control", "flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.controls.ExpandControl", "size": 2832, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.vis.controls.Control", "flare.vis.Visualization"] },
                    { "name": "flare.vis.controls.HoverControl", "size": 4896, "imports": ["flare.vis.events.SelectionEvent", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.IControl", "size": 763, "imports": ["flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.PanZoomControl", "size": 5222, "imports": ["flare.util.Displays", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.SelectionControl", "size": 7862, "imports": ["flare.vis.events.SelectionEvent", "flare.vis.controls.Control"] },
                    { "name": "flare.vis.controls.TooltipControl", "size": 8435, "imports": ["flare.animate.Tween", "flare.display.TextSprite", "flare.vis.controls.Control", "flare.vis.events.TooltipEvent"] },
                    { "name": "flare.vis.data.Data", "size": 20544, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.vis.data.DataSprite", "flare.vis.data.Tree", "flare.vis.events.DataEvent", "flare.data.DataSet", "flare.vis.data.TreeBuilder", "flare.vis.data.DataList", "flare.data.DataSchema", "flare.util.Sort", "flare.data.DataField", "flare.util.Property"] },
                    { "name": "flare.vis.data.DataList", "size": 19788, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.util.math.DenseMatrix", "flare.vis.data.DataSprite", "flare.vis.data.EdgeSprite", "flare.vis.events.DataEvent", "flare.util.Stats", "flare.util.math.IMatrix", "flare.util.Sort", "flare.util.Filter", "flare.util.Property", "flare.util.IEvaluable", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.DataSprite", "size": 10349, "imports": ["flare.util.Colors", "flare.vis.data.Data", "flare.display.DirtySprite", "flare.vis.data.render.IRenderer", "flare.vis.data.render.ShapeRenderer"] },
                    { "name": "flare.vis.data.EdgeSprite", "size": 3301, "imports": ["flare.vis.data.render.EdgeRenderer", "flare.vis.data.DataSprite", "flare.vis.data.NodeSprite", "flare.vis.data.render.ArrowType", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.NodeSprite", "size": 19382, "imports": ["flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.data.DataSprite", "flare.vis.data.EdgeSprite", "flare.vis.data.Tree", "flare.util.Sort", "flare.util.Filter", "flare.util.IEvaluable", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.render.ArrowType", "size": 698, "imports": [] },
                    { "name": "flare.vis.data.render.EdgeRenderer", "size": 5569, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.vis.data.DataSprite", "flare.vis.data.render.IRenderer", "flare.util.Shapes", "flare.util.Geometry", "flare.vis.data.render.ArrowType"] },
                    { "name": "flare.vis.data.render.IRenderer", "size": 353, "imports": ["flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.data.render.ShapeRenderer", "size": 2247, "imports": ["flare.util.Shapes", "flare.vis.data.render.IRenderer", "flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.data.ScaleBinding", "size": 11275, "imports": ["flare.scale.TimeScale", "flare.scale.ScaleType", "flare.scale.LinearScale", "flare.scale.LogScale", "flare.scale.OrdinalScale", "flare.scale.RootScale", "flare.scale.Scale", "flare.scale.QuantileScale", "flare.util.Stats", "flare.scale.QuantitativeScale", "flare.vis.events.DataEvent", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.Tree", "size": 7147, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.events.DataEvent", "flare.vis.data.NodeSprite", "flare.vis.data.Data"] },
                    { "name": "flare.vis.data.TreeBuilder", "size": 9930, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.vis.data.Tree", "flare.util.heap.HeapNode", "flare.util.heap.FibonacciHeap", "flare.util.Property", "flare.util.IEvaluable", "flare.vis.data.Data"] },
                    { "name": "flare.vis.events.DataEvent", "size": 2313, "imports": ["flare.vis.data.EdgeSprite", "flare.vis.data.NodeSprite", "flare.vis.data.DataList", "flare.vis.data.DataSprite"] },
                    { "name": "flare.vis.events.SelectionEvent", "size": 1880, "imports": ["flare.vis.events.DataEvent"] },

                    { "name": "flare.vis.operator.layout.IndentedTreeLayout", "size": 3174, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.vis.operator.layout.Layout", "flare.vis.data.EdgeSprite"] },
                    { "name": "flare.vis.operator.layout.Layout", "size": 7881, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.vis.data.DataList", "flare.vis.data.DataSprite", "flare.vis.data.EdgeSprite", "flare.vis.Visualization", "flare.vis.axis.CartesianAxes", "flare.vis.axis.Axes", "flare.animate.TransitionEvent", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.layout.NodeLinkTreeLayout", "size": 12870, "imports": ["flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.util.Orientation", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.layout.PieLayout", "size": 2728, "imports": ["flare.vis.data.DataList", "flare.vis.data.DataSprite", "flare.util.Shapes", "flare.util.Property", "flare.vis.operator.layout.Layout", "flare.vis.data.Data"] },
                    { "name": "flare.vis.operator.layout.RadialTreeLayout", "size": 12348, "imports": ["flare.vis.data.NodeSprite", "flare.util.Arrays", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.layout.RandomLayout", "size": 870, "imports": ["flare.vis.operator.layout.Layout", "flare.vis.data.DataSprite", "flare.vis.data.Data"] },
                    { "name": "flare.vis.operator.layout.StackedAreaLayout", "size": 9121, "imports": ["flare.scale.TimeScale", "flare.scale.LinearScale", "flare.util.Arrays", "flare.scale.OrdinalScale", "flare.vis.data.NodeSprite", "flare.scale.Scale", "flare.vis.axis.CartesianAxes", "flare.util.Stats", "flare.util.Orientation", "flare.scale.QuantitativeScale", "flare.util.Maths", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.layout.TreeMapLayout", "size": 9191, "imports": ["flare.animate.Transitioner", "flare.vis.data.NodeSprite", "flare.util.Property", "flare.vis.operator.layout.Layout"] },
                    { "name": "flare.vis.operator.Operator", "size": 2490, "imports": ["flare.animate.Transitioner", "flare.vis.operator.IOperator", "flare.util.Property", "flare.util.IEvaluable", "flare.vis.Visualization"] },
                    { "name": "flare.vis.operator.OperatorList", "size": 5248, "imports": ["flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.operator.IOperator", "flare.vis.Visualization", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.OperatorSequence", "size": 4190, "imports": ["flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.operator.IOperator", "flare.vis.operator.OperatorList", "flare.animate.FunctionSequence", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.OperatorSwitch", "size": 2581, "imports": ["flare.animate.Transitioner", "flare.vis.operator.OperatorList", "flare.vis.operator.IOperator", "flare.vis.operator.Operator"] },
                    { "name": "flare.vis.operator.SortOperator", "size": 2023, "imports": ["flare.vis.operator.Operator", "flare.animate.Transitioner", "flare.util.Arrays", "flare.vis.data.Data"] },
                    { "name": "flare.vis.Visualization", "size": 16540, "imports": ["flare.animate.Transitioner", "flare.vis.operator.IOperator", "flare.animate.Scheduler", "flare.vis.events.VisualizationEvent", "flare.vis.data.Tree", "flare.vis.events.DataEvent", "flare.vis.axis.Axes", "flare.vis.axis.CartesianAxes", "flare.util.Displays", "flare.vis.operator.OperatorList", "flare.vis.controls.ControlList", "flare.animate.ISchedulable", "flare.vis.data.Data"] }
                ]

                return data;
            }

            public DisplayLens(): void {
                super.DisplayLens();
                var data = this.ExtractData();

                var container = this._element;
                var lensG = this._lens_circle_G;

                var nodes = this._cluster.nodes(packageHierarchy(data)),
                    links = packageImports(nodes);

                lensG.selectAll(".link")
                    .data(this._boundle(links))
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", this._line)
                    .attr("stroke", "steelblue")
                    .attr("stroke-opacity", ".4")
                    .attr("fill", "none")
                ;

                lensG.selectAll(".node")
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