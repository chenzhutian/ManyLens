///<reference path = "./cBaseMapLens.ts" />
module ManyLens {
    export module Lens {
        export class cMapWordCloudLens extends cBaseMapLens {

            public static Type: string = "cMapWordCloudLens";

            private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _cloud: D3.Layout.CloudLayout = d3.layout.cloud();

            private _cloud_w: number = this._lens_circle_radius * 2;//Math.SQRT2;
            private _cloud_h: number = this._cloud_w;
            private _cloud_padding: number = 0;
            private _cloud_font: string = "Calibri"
            private _cloud_font_weight: string = "normal";
            private _text_color: D3.Scale.OrdinalScale;

            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cMapWordCloudLens.Type, manyLens, firstLens, secondLens);

                this._text_color = d3.scale.ordinal()
                    .domain([1,2])
                    .range(["#d62728","#ff7f0e"]);

            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            // data shape {text: size:}
            protected ExtractData(): any {
                var data: Array<D3.Layout.ICloudData>
                data = [
              
                    { Key: "lxzcvk", Value: 7 },
                    { Key: "tyu", Value: 7 },

                ]
                ;

                data.forEach( (d, i) => {
                    d.Value -= 3;
                    d["group"] = (i % 2) + 1;
                    d["coordinates"] = d["group"] == 1 ? this._projection([-86.674368, 34.646554]) : this._projection([-118.176008, 34.200463]);
                });

                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(data, function (d) { return d.Value; }))
                ;

                return data;
            }

            public DisplayLens(): void {
                super.DisplayLens();
                var barData = this.ExtractData();

                var data = this.ExtractData();

                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(data)
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.value); })
                    .on("end", (words, bound) => {
                        this.DrawCloud(words, bound);
                    })
                ;
                this._cloud.start();
            }

            private DrawCloud(words: any[], bounds: any[]) {

                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text");

                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font })
                    .style("fill", (d, i) => { return this._text_color(d.group); })
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