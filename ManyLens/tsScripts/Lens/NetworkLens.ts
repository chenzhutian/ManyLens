﻿module ManyLens {
    export module Lens {

        export class NetworkLens extends BaseSingleLens {

            public static Type: string = "NetworkLens";

            private _force: D3.Layout.ForceLayout = d3.layout.force();
            private _location_x_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _location_y_scale: D3.Scale.LinearScale = d3.scale.linear();

            constructor(element:D3.Selection, manyLens:ManyLens) {
                super(element, NetworkLens.Type, manyLens);

                this._force
                    .size([0, 0])
                    .linkDistance(this._lens_circle_radius)
                ;

                this._location_x_scale
                    .range([-this._lens_circle_radius, this._lens_circle_radius])
                ;

                this._location_y_scale
                    .range([-this._lens_circle_radius, this._lens_circle_radius])
                ;
            }

            public Render(color: string): void {
                super.Render(color);
            }

            protected ExtractData(): any {
                var graph = {
                    "nodes": [{ "x": 208.992345, "y": 273.053211 },
                        { "x": 595.98896, "y": 56.377057 },
                        { "x": 319.568434, "y": 278.523637 },
                        { "x": 214.494264, "y": 214.893585 },
                        { "x": 482.664139, "y": 340.386773 },
                        { "x": 84.078465, "y": 192.021902 },
                        { "x": 196.952261, "y": 370.798667 },
                        { "x": 107.358165, "y": 435.15643 },
                        { "x": 401.168523, "y": 443.407779 },
                        { "x": 508.368779, "y": 386.665811 },
                        { "x": 355.93773, "y": 460.158711 },
                        { "x": 283.630624, "y": 87.898162 },
                        { "x": 194.771218, "y": 436.366028 },
                        { "x": 477.520013, "y": 337.547331 },
                        { "x": 572.98129, "y": 453.668459 },
                        { "x": 106.717817, "y": 235.990363 },
                        { "x": 265.064649, "y": 396.904945 },
                        { "x": 452.719997, "y": 137.886092 }
                    ],
                    "links": [{ "target": 11, "source": 0 },
                        { "target": 3, "source": 0 },
                        { "target": 10, "source": 0 },
                        { "target": 16, "source": 0 },
                        { "target": 1, "source": 0 },
                        { "target": 3, "source": 0 },
                        { "target": 9, "source": 0 },
                        { "target": 5, "source": 0 },
                        { "target": 11, "source": 0 },
                        { "target": 13, "source": 0 },
                        { "target": 16, "source": 0 },
                        { "target": 3, "source": 1 },
                        { "target": 9, "source": 1 },
                        { "target": 12, "source": 1 },
                        { "target": 4, "source": 2 },
                        { "target": 6, "source": 2 },
                        { "target": 8, "source": 2 },
                        { "target": 13, "source": 2 },
                        { "target": 10, "source": 3 },
                        { "target": 16, "source": 3 },
                        { "target": 9, "source": 3 },
                        { "target": 7, "source": 3 },
                        { "target": 11, "source": 5 },
                        { "target": 13, "source": 5 },
                        { "target": 12, "source": 5 },
                        { "target": 8, "source": 6 },
                        { "target": 13, "source": 6 },
                        { "target": 10, "source": 7 },
                        { "target": 11, "source": 7 },
                        { "target": 17, "source": 8 },
                        { "target": 13, "source": 8 },
                        { "target": 11, "source": 10 },
                        { "target": 16, "source": 10 },
                        { "target": 13, "source": 11 },
                        { "target": 14, "source": 12 },
                        { "target": 14, "source": 12 },
                        { "target": 14, "source": 12 },
                        { "target": 15, "source": 12 },
                        { "target": 16, "source": 12 },
                        { "target": 15, "source": 14 },
                        { "target": 16, "source": 14 },
                        { "target": 15, "source": 14 },
                        { "target": 16, "source": 15 },
                        { "target": 16, "source": 15 },
                        { "target": 17, "source": 16 }
                    ]
                };

                return graph;
            }

            public DisplayLens(data: any): any {
                super.DisplayLens(data);
                var nodes = data.nodes,
                    links = data.links
                ;

                this._location_x_scale
                    .domain(d3.extent(nodes, function (d) { return d['x']; }))
                ;

                this._location_y_scale
                    .domain(d3.extent(nodes, function (d) { return d['y']; }))
                ;

                nodes.forEach((d) => {
                    d.x = this._location_x_scale(d.x),
                    d.y = this._location_y_scale(d.y);
                });

                var animationStep: number = 100;

                this._force
                    .nodes(nodes)
                    .links(links)
                ;

                var link = this._lens_circle_svg
                    .selectAll(".link")
                    .data(links)
                    .enter().append("line")
                    .attr("class", "link")
                    .attr('x1', function (d) { return nodes[d.source].x; })
                    .attr('y1', function (d) { return nodes[d.source].y; })
                    .attr('x2', function (d) { return nodes[d.target].x; })
                    .attr('y2', function (d) { return nodes[d.target].y; })
                    .style("stroke", "#777")
                    .style("stroke-width", "2px")
                ;

                var node = this._lens_circle_svg
                    .selectAll(".node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r",4)
                    .attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; })
                    .style("stroke", "steelblue")
                    .style("fill", "#fff")
                    .style("stroke-width", 1.5)
                ;

                this._force.on("tick", ()=>{
                 
                    node.transition().ease('linear').duration(animationStep)
                        .attr('cx', function (d) { return d.x; })
                        .attr('cy', function (d) { return d.y; });

                    link.transition().ease('linear').duration(animationStep)
                        .attr('x1', function (d) { return d.source.x; })
                        .attr('y1', function (d) { return d.source.y; })
                        .attr('x2', function (d) { return d.target.x; })
                        .attr('y2', function (d) { return d.target.y; });

                    this._force.stop();

                    setTimeout( ()=> {
                        this._force.start();
                    }, animationStep);

                });

                this._force.start();
            }
        }
    }
} 