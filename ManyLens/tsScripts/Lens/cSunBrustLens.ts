module ManyLens {
    export module Lens {
        export class cSunBrustLens extends BaseCompositeLens {

            //TODO need to refine this lens

            public static Type: string = "cSunBrustLens";

            private _color: D3.Scale.OrdinalScale = d3.scale.category10();
            private _luminance: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _partition: D3.Layout.PartitionLayout = d3.layout.partition();
            private _arc: D3.Svg.Arc = d3.svg.arc();

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cSunBrustLens.Type, manyLens,firstLens, secondLens );

                this._luminance
                    .domain([0, 1e6])
                    .clamp(true)
                    .range([90, 20])
                ;

                this._partition
                    .sort(function (a, b) { return d3.ascending(a.name, b.name); })
                    .size([2 * Math.PI, this._lens_circle_radius])
                ;

                this._arc
                    .startAngle(function (d) { return d.x; })
                    .endAngle(function (d) { return d.x + d.dx - .01 / (d.depth + .5); })
                    .innerRadius((d) => { return this._lens_circle_radius / 3 * d.depth; })
                    .outerRadius((d) => { return this._lens_circle_radius / 3 * (d.depth + 1) - 1; })
                ;

            }

            public Render(): void {
                super.Render("yellow");
            }

            protected ExtractData(): any {
                var data = {
                    "name": "flare",
                    "children": [
                        {
                            "name": "query",
                            "children": [
                                { "name": "AggregateExpression", "size": 1616 },
                                { "name": "And", "size": 1027 },
                                { "name": "Arithmetic", "size": 3891 },
                                { "name": "Average", "size": 891 },
                                { "name": "BinaryExpression", "size": 2893 },
                                { "name": "Comparison", "size": 5103 },
                                { "name": "CompositeExpression", "size": 3677 },
                                { "name": "Count", "size": 781 },
                                { "name": "DateUtil", "size": 4141 },
                                {
                                    "name": "methods",
                                    "children": [
                                        { "name": "add", "size": 593 },
                                        { "name": "and", "size": 330 },
                                        { "name": "average", "size": 287 },
                                        { "name": "count", "size": 277 },
                                        { "name": "distinct", "size": 292 },
                                        { "name": "div", "size": 595 },
                                        { "name": "eq", "size": 594 },
                                        { "name": "fn", "size": 460 },
                                        { "name": "gt", "size": 603 },
                                        { "name": "gte", "size": 625 },
                                        { "name": "iff", "size": 748 },
                                        { "name": "isa", "size": 461 },
                                        { "name": "lt", "size": 597 },
                                        { "name": "lte", "size": 619 },
                                        { "name": "max", "size": 283 },
                                        { "name": "min", "size": 283 },
                                        { "name": "mod", "size": 591 },
                                        { "name": "mul", "size": 603 },
                                        { "name": "neq", "size": 599 },
                                        { "name": "not", "size": 386 },
                                        { "name": "or", "size": 323 },
                                        { "name": "orderby", "size": 307 },
                                        { "name": "range", "size": 772 },
                                        { "name": "select", "size": 296 },
                                        { "name": "stddev", "size": 363 },
                                        { "name": "sub", "size": 600 },
                                        { "name": "sum", "size": 280 },
                                        { "name": "update", "size": 307 },
                                        { "name": "variance", "size": 335 },
                                        { "name": "where", "size": 299 },
                                        { "name": "xor", "size": 354 },
                                        { "name": "_", "size": 264 }
                                    ]
                                },
                                { "name": "Minimum", "size": 843 },
                                { "name": "Not", "size": 1554 },
                                { "name": "Or", "size": 970 },
                                { "name": "Query", "size": 13896 },
                                { "name": "Range", "size": 1594 },
                            ]
                        },
                        {
                            "name": "scale",
                            "children": [
                                { "name": "IScaleMap", "size": 2105 },
                                { "name": "LinearScale", "size": 1316 },
                                { "name": "LogScale", "size": 3151 },

                            ]
                        },
                        {
                            "name": "util",
                            "children": [
                                { "name": "Arrays", "size": 8258 },
                                { "name": "IEvaluable", "size": 335 },
                                { "name": "IPredicate", "size": 383 },
                                { "name": "IValueProxy", "size": 874 },
                                {
                                    "name": "math",
                                    "children": [
                                        { "name": "DenseMatrix", "size": 3165 },
                                        { "name": "IMatrix", "size": 2815 },
                                        { "name": "SparseMatrix", "size": 3366 }
                                    ]
                                },
                                { "name": "Maths", "size": 17705 },
                                { "name": "Orientation", "size": 1486 },
                                {
                                    "name": "palette",
                                    "children": [
                                        { "name": "ColorPalette", "size": 6367 },
                                        { "name": "Palette", "size": 1229 },
                                        { "name": "ShapePalette", "size": 2059 },
                                        { "name": "SizePalette", "size": 2291 }
                                    ]
                                },
                                { "name": "Property", "size": 5559 },
                                { "name": "Shapes", "size": 19118 },
                                { "name": "Sort", "size": 6887 },
                                { "name": "Stats", "size": 6557 },
                                { "name": "Strings", "size": 22026 }
                            ]
                        },
                        {
                            "name": "vis",
                            "children": [
                                {
                                    "name": "axis",
                                    "children": [
                                        { "name": "Axes", "size": 1302 },
                                        { "name": "Axis", "size": 24593 },
                                        { "name": "AxisGridLine", "size": 652 },
                                        { "name": "AxisLabel", "size": 636 },
                                        { "name": "CartesianAxes", "size": 6703 }
                                    ]
                                },
                                {
                                    "name": "controls",
                                    "children": [
                                        { "name": "AnchorControl", "size": 2138 },
                                        { "name": "ClickControl", "size": 3824 },
                                        { "name": "Control", "size": 1353 },
                                        { "name": "ControlList", "size": 4665 },
                                        { "name": "DragControl", "size": 2649 },
                                        { "name": "ExpandControl", "size": 2832 },
                                        { "name": "HoverControl", "size": 4896 },
                                        { "name": "IControl", "size": 763 },
                                        { "name": "PanZoomControl", "size": 5222 },
                                        { "name": "SelectionControl", "size": 7862 },
                                        { "name": "TooltipControl", "size": 8435 }
                                    ]
                                },
                                {
                                    "name": "data",
                                    "children": [
                                        { "name": "Data", "size": 20544 },
                                        { "name": "DataList", "size": 19788 },
                                        { "name": "DataSprite", "size": 10349 },
                                        { "name": "EdgeSprite", "size": 3301 },
                                        { "name": "NodeSprite", "size": 19382 },
                                        {
                                            "name": "render",
                                            "children": [
                                                { "name": "ArrowType", "size": 698 },
                                                { "name": "EdgeRenderer", "size": 5569 },
                                                { "name": "IRenderer", "size": 353 },
                                                { "name": "ShapeRenderer", "size": 2247 }
                                            ]
                                        },
                                        { "name": "ScaleBinding", "size": 11275 },
                                        { "name": "Tree", "size": 7147 },
                                        { "name": "TreeBuilder", "size": 9930 }
                                    ]
                                },
                                { "name": "Visualization", "size": 16540 }
                            ]
                        }
                    ]
                };

                return data;
            }

            public DisplayLens(): void {
                super.DisplayLens();

                var data = this.ExtractData();
                var svg = this._lens_circle_svg;
                var partition = this._partition;
                var hue = this._color;
                var luminance = this._luminance;
                var arc = this._arc;

                this._partition
                    .value(function (d) { return d.size; })
                    .children(function (d) { return d.children;})
                    .nodes(data)
                    .forEach(function (d) {
                        d._children = d.children;
                        //d['sum'] = d.value;
                        d['key'] = key(d);
                        d['fill'] = fill(d);
                    })
                ;

                // Now redefine the value function to use the previously-computed sum.
                this._partition
                    .children(function (d, depth) { return depth < 2 ? d._children : null; })
                    .value(function (d) { return d.value; })
                ;

                var center = svg.append("circle")
                    .attr("r", this._lens_circle_radius / 3)
                    .style("fill", "#fff")
                    .on("click", zoomOut)
                ;

                center.append("title")
                    .text("zoom out");

                var path = svg.selectAll("path")
                        .data(this._partition.nodes(data).slice(1))
                    .enter().append("path")
                        .attr("d", this._arc)
                        .style("fill", function (d) { return d.fill; })
                        .each(function (d) { this._current = updateArc(d); })
                        .on("click", zoomIn)
                ;
                console.log("where is it?");

                function zoomIn(p) {
                    if (p.depth > 1) p = p.parent;
                    if (!p.children) return;
                    zoom(p, p);
                }

                function zoomOut(p) {
                    if (!p.parent) return;
                    zoom(p.parent, p);
                }

                // Zoom to the specified new root.
                function zoom(root, p) {
                    if (document.documentElement['__transition__']) return;

                    // Rescale outside angles to match the new layout.
                    var enterArc,
                        exitArc,
                        outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]).range([p.x, p.x + p.dx]);

                    function insideArc(d) {
                        return p.key > d.key
                            ? { depth: d.depth - 1, x: 0, dx: 0 } : p.key < d.key
                            ? { depth: d.depth - 1, x: 2 * Math.PI, dx: 0 }
                            : { depth: 0, x: 0, dx: 2 * Math.PI };
                    }

                    function outsideArc(d) {
                        return {
                            depth: d.depth + 1,
                            x: outsideAngle(d.x),
                            dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)
                        };
                    }

                    center.datum(root);

                    // When zooming in, arcs enter from the outside and exit to the inside.
                    // Entering outside arcs start from the old layout.
                    if (root === p) enterArc = outsideArc, exitArc = insideArc;

                    // When zooming out, arcs enter from the inside and exit to the outside.
                    // Exiting outside arcs transition to the new layout.
                    if (root !== p) enterArc = insideArc, exitArc = outsideArc;

                    path = path.data(partition.nodes(root).slice(1), function (d) { return d.key; });

                    d3.transition()
                        .duration(d3.event.altKey ? 7500 : 750)
                        .each(function () {
                            (<D3.UpdateSelection>path).exit().transition()
                                .style("fill-opacity", function (d) {
                                    return +(d.depth === 1 + ((root === p) ? 1 : 0));
                                })
                                .attrTween("d", function (d) {
                                    return arcTween.call(this, exitArc(d));
                                })
                                .remove();

                            (<D3.UpdateSelection>path).enter().append("path")
                                .style("fill-opacity", function (d) {
                                    return +(d.depth === (2 - ((root === p) ? 1 : 0)));
                                })
                                .style("fill", function (d) { return d.fill; })
                                .on("click", zoomIn)
                                .each(function (d) {
                                    this._current = enterArc(d);
                                });

                            path.transition()
                                .style("fill-opacity", 1)
                                .attrTween("d", function (d) {
                                    return arcTween.call(this, updateArc(d));
                                });
                        });
                }

                function key(d) {
                    var k = [], p = d;
                    while (p.depth) k.push(p.name), p = p.parent;
                    return k.reverse().join(".");
                }

                function fill(d) {
                    var p = d;
                    while (p.depth > 1) p = p.parent;
                    var c = d3.lab(hue(p.name));
                    c.l = luminance(d.value);
                    return c;
                }

                function arcTween(b) {
                    var i = d3.interpolate(this._current, b);
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }

                function updateArc(d) {
                    return { depth: d.depth, x: d.x, dx: d.dx };
                }

            }



        }
    }
}