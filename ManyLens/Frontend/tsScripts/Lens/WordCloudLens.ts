///<reference path = "./BaseSingleLens.ts" />
module ManyLens {

    export module Lens {

        export class WordCloudLens extends BaseSingleLens {

            public static Type: string = "WordCloudLens";

            private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _cloud: D3.Layout.CloudLayout = d3.layout.cloud();
            private _cloud_w: number = this._lens_circle_radius * 2*Math.SQRT2;
            private _cloud_h: number = this._lens_circle_radius  * 2;
            private _cloud_padding: number = 1;
            private _cloud_font: string = "Impact";
            private _cloud_font_weight: string = "normal";
            private _cloud_text_color: D3.Scale.PowScale;
            //private _cloud_rotate: number = 0;

            //public get Color(): D3.Scale.LinearScale {
            //    return this._cloud_text_color;
            //}

            constructor(element: D3.Selection, attributeName: string, manyLens: ManyLens.ManyLens) {
                super(element, attributeName, WordCloudLens.Type, manyLens);

                this._cloud_text_color = d3.scale.pow().range(["#C5EFF7","#4183D7"]);
            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            // data shape {text: size:}
            protected AfterExtractData(): void {
                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(this._extract_data_map_func.Extract(this._data), (d: { Key: any; Value: any }) => {
                        return d.Value;
                    }))
                ;
                this._cloud_text_color
                    .domain(d3.extent(this._extract_data_map_func.Extract(this._data), (d: { Key: any; Value: any }) => {
                        return this._font_size(d.Value);
                    }))
                ;
            }

            public DisplayLens(): any {
                if (!super.DisplayLens()) return null;

                this._lens_circle
                    .attr("d", ()=>{
                        return "M"+ -(Math.SQRT2*this._lens_circle_radius)+ "," + -this._lens_circle_radius
                                + "L" + -(Math.SQRT2*this._lens_circle_radius) + "," + this._lens_circle_radius
                                +"L" +(Math.SQRT2* this._lens_circle_radius) + "," + this._lens_circle_radius
                                +"L" +(Math.SQRT2* this._lens_circle_radius) + "," + -this._lens_circle_radius
                                +"Z"
                        ;
                    });

                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._extract_data_map_func.Extract(this._data))
                    .filter((d) => {
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
                    .enter().append("text").attr("class","word-cloud");

                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font })
                    .style("fill", (d, i) => { return this._cloud_text_color(d.size); })
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