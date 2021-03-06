﻿///<reference path = "./BaseSingleLens.ts" />
module ManyLens {
    export module Lens {

        interface Node {
            x: number;
            y: number;
        }

        export class NetworkLens extends BaseSingleLens {

            public static Type: string = "NetworkLens";

            private _force: D3.Layout.ForceLayout = d3.layout.force();
            private _location_x_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _location_y_scale: D3.Scale.LinearScale = d3.scale.linear();

            constructor(element:D3.Selection,attributeName:string, manyLens:ManyLens) {
                super(element, attributeName, NetworkLens.Type, manyLens);

                this._force
                    .size([0, 0])
                    .linkDistance(this._lens_circle_radius/2)
                    .charge(-50)
                    .gravity(0.1)
                    .friction(0.5)
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

            public AfterExtractData(): void {


            }

            public DisplayLens(): any {
                if (!super.DisplayLens()) return;

                var graph = this._extract_data_map_func.Extract(this._data);
           
                var nodes = graph.nodes,
                    links = graph.links

                nodes.forEach((d) => {
                    d.x = d.x * this.LensRadius;
                    d.y = d.y * this.LensRadius;
                });

                this._location_x_scale
                    .domain(d3.extent(nodes, function (d:Node) { return d.x; }))

                this._location_y_scale
                    .domain(d3.extent(nodes, function (d:Node) { return d.y; }))

                nodes.forEach((d) => {
                    if ((d.x * d.x + d.y * d.y) > this.LensRadius * this.LensRadius) {

                        d.x = this._location_x_scale(d.x),
                        d.y = this._location_y_scale(d.y);
                    }
                });

                this._force
                    .nodes(nodes)
                    .links(links)

                var link = this._lens_circle_svg
                    .selectAll(".network.link")
                    .data(links)
                    .enter().append("line")
                    .attr("class", "network link")
                    .style({
                        "stroke": "#777",
                        "stroke-width": "1px"
                    })

                var node = this._lens_circle_svg
                    .selectAll(".network.node")
                    .data(nodes)
                    .enter().append("circle")
                    .attr("class", "network node")
                    .attr("r",4)
                    .attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; })
                    .style({
                        "stroke": "steelblue",
                        "fill": "#fff",
                        "stroke-width": 1.5
                    })

                this._force.on("tick", ()=>{
                 
                    node
                        .attr('cx', function (d) { return d.x; })
                        .attr('cy', function (d) { return d.y; });

                    link
                        .attr('x1', function (d) { return d.source.x; })
                        .attr('y1', function (d) { return d.source.y; })
                        .attr('x2', function (d) { return d.target.x; })
                        .attr('y2', function (d) { return d.target.y; });

                });

                this._force.start();
            }
        }
    }
} 