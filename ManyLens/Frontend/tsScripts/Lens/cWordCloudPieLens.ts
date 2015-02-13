﻿///<reference path = "./BaseCompositeLens.ts" />
module ManyLens {
    export module Lens {

        export class cWordCloudPieLens extends BaseCompositeLens {

            public static Type: string = "cWordCloudPieLens";

            private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _cloud: D3.Layout.CloudLayout = d3.layout.cloud();

            private _cloud_w: number = this._lens_circle_radius * 2;//Math.sqrt(2);
            private _cloud_h: number = this._cloud_w;
            private _cloud_padding: number = 1;
            private _cloud_font: string = "Calibri"
            private _cloud_font_weight: string = "normal";
            private _cloud_text_color: D3.Scale.OrdinalScale;

            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cWordCloudPieLens.Type, manyLens, firstLens, secondLens);

                this._cloud_text_color = d3.scale.category10();
                
                this._pie
                    .value((d) => {
                        return d.Value;
                    })
                    .sort(null)
                ;

                this._arc
                    .innerRadius((d) => {
                        return this._lens_circle_radius;
                    })
                    .outerRadius((d) => {
                        return this._lens_circle_radius + 20;
                    })
                ;

            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            // data shape {text: size:}
            protected ExtractData() {

                //Intersection of base data
                var newbaseData = [];
                this._base_accessor_func(this._base_data).forEach((d) => {

                    var joinData = this._base_accessor_func(this._sub_data);
                    joinData.forEach(function (p) {
                        if (d.Key == p.Key)
                            newbaseData.push(p);
                    });
                });
                this._base_accessor_func(this._base_data, newbaseData);

                //Intersection of sub data
                var newsubData = [];
                this._sub_accessor_func(this._sub_data).forEach((d) => {

                    var joinData = this._sub_accessor_func(this._base_data);
                    joinData.forEach(function (p) {
                        if (d.Key == p.Key)
                            newsubData.push(p);
                    });

                });
                this._sub_accessor_func(this._base_data, newsubData);

                //I dont know how to fix it, just hard code for now
                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(newbaseData, function (d) { return d.Value; }))
                ;

            }

            public DisplayLens(): void {
                super.DisplayLens();
                var data = this.ExtractData();

                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._base_accessor_func(this._base_data))
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.Value); })
                    .on("end", (words, bounds) => {
                        this.DrawCloud(words, bounds);
                    })
                ;
                this._cloud.start();

                this._lens_circle_svg.selectAll(".innerPie")
                    .data(this._pie(this._sub_accessor_func(this._base_data)))
                    .enter().append("path")
                    .attr("d", this._arc)
                    .style("fill", (d) => { return this._cloud_text_color(d.data.Key); })
                    .style("fill-rule", "evenodd")
                ;
            }

            private DrawCloud(words: any[], bounds: any[]) {
                var w = this._cloud_w;
                var h = this._cloud_h;

                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(
                    w / Math.abs(bounds[1].x - w / 2),
                    w / Math.abs(bounds[0].x - w / 2),
                    h / Math.abs(bounds[1].y - h / 2),
                    h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text");

                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font })
                    .style("fill", (d) => { return this._cloud_text_color(d.Key); })
                    .style("opacity", 1e-6)
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) {
                        return "translate(" + [d.x, d.y] + ")";
                    })
                    .text(function (d) { return d.text; })
                    .transition().duration(200)
                    .style("opacity", 1)
                ;
            }
        }
    }
}