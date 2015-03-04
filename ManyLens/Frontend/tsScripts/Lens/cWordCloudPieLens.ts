///<reference path = "./BaseCompositeLens.ts" />
module ManyLens {
    export module Lens {

        export class cWordCloudPieLens extends BaseCompositeLens {

            public static Type: string = "cWordCloudPieLens";

            private _color: D3.Scale.QuantizeScale = d3.scale.quantize();
            
            private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _cloud: D3.Layout.CloudLayout = d3.layout.cloud();

            private _cloud_w: number = this._lens_circle_radius * Math.SQRT2;
            private _cloud_h: number = this._cloud_w;
            private _cloud_padding: number = 1;
            private _cloud_font: string = "Calibri"
            private _cloud_font_weight: string = "normal";
            private _cloud_text_color: D3.Scale.OrdinalScale;

            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();
            private _pie_innerRadius: number = this._lens_circle_radius;
            private _pie_outterRadius: number = this._lens_circle_radius + 20;


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
                    .innerRadius(this._pie_innerRadius)
                    .outerRadius(this._pie_outterRadius)
                ;

                this._color
                    .range([
                        "rgb(198,219,239)",
                        "rgb(158,202,225)",
                        "rgb(107, 174, 214)",
                        "rgb(66, 146, 198)",
                        "rgb(33, 113, 181)"
                        // "rgb(8, 81, 156)"
                        // "rgb(8, 48, 107)"
                    ]);
                //this._manyLens.ManyLensHubRegisterClientFunction(this, "hightLightWordsOfTweetsAtLengthOf", this.HightLightWordsOfTweetsAtLengthOf);
            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            protected AfterExtractData() {
                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(this._base_accessor_func.Extract(this._data), (d: { Key: any; Value: any }) => {
                        return d.Value;
                    }))
                ;
                this._color.domain(d3.extent(this._sub_accessor_func.Extract(this._data), function (d) { return d['Value']; }));
            }

            public DisplayLens(): void {
                super.DisplayLens();

                this._lens_circle.style({
                    "stroke": null,
                    "stroke-width":null
                });

                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._base_accessor_func.Extract(this._data))
                    .filter((d)=>{
                        if (d.Value > 3)
                            return true;
                        return false;
                    })
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

                this._lens_circle_svg.selectAll(".outterPie")
                    .data(this._pie(this._sub_accessor_func.Extract(this._data)))
                    .enter().append("path")
                    .attr("class", "outterPie")

                    .style("fill", (d) => {
                        return this._color(d.value) || "rgb(158,202,225)";
                    })
                    .on("mouseover", (d) => {
                        this._manyLens.ManyLensHubServercWordCloudPieLens(this.ID, d.data.Key, this._base_accessor_func.TargetAttribute,this._sub_accessor_func.TargetAttribute);
                        this.ShowLabel(d);

                    })
                    .on("mouseout", (d) => {
                        this._lens_circle_svg.selectAll("text.wordCloudText")
                            .transition()
                            .style("opacity", 1)
                        ;
                        this.ShowLabel(null);
                    })
                ;
                this._lens_circle_svg.selectAll(".outterPie")
                    .attr("d", (d) => {
                        return d3.svg.arc().innerRadius(0).outerRadius(this._pie_outterRadius);
                    })
                    .transition().duration(300)
                    .attr("d", this._arc)
                ;
            }

            public HightLightWordsOfTweetsAtLengthOf(words: string[]): void {
                
                this._lens_circle_svg.selectAll("text.wordCloudText")
                    .transition()
                    .style("opacity", function (p) {
                        if (words.indexOf(p.text) == -1)
                            return 0.1;
                    })
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
                    .attr("class","wordCloudText")
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

            private ShowLabel(d: any): void {
                if (d) {
                    this._lens_circle_svg.selectAll("text.mylabel")
                        .data([d])
                        .enter().append("text")
                        .attr("class", "mylabel")
                        .attr("text-anchor", "middle")
                        .attr("x", (d) => {
                            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            d.cx = Math.cos(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius)/2);
                            return d.x = Math.cos(a) * (this._pie_outterRadius + 40);
                        })
                        .attr("y", (d) => {
                            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            d.cy = Math.sin(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                            return d.y = Math.sin(a) * (this._pie_outterRadius + 40);
                        })
                        .text(function (d) { return d.data.Key; })
                        .each(function (d) {
                            var bbox = this.getBBox();
                            d.sx = d.x - bbox.width / 2 - 2;
                            d.ox = d.x + bbox.width / 2 + 2;
                            d.sy = d.oy = d.y + 5;
                        });

                    this._lens_circle_svg.selectAll("path.mylabel")
                        .data([d])
                        .enter().append("path")
                        .attr("class", "mylabel")
                        .style("fill", "none")
                        .style("stroke", "black")
                        .attr("d", function (d) {
                            if (d.cx > d.ox) {
                                return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                            } else {
                                return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                            }
                        })
                        .transition().duration(200)
                        .attr("d", function (d) {
                            if (d.cx > d.ox) {
                                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                            } else {
                                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                            }
                        });
                } else {
                    this._lens_circle_svg.selectAll(".mylabel").remove();
                }
            }
        }
    }
}