///<reference path = "./BaseSingleLens.ts" />
module ManyLens {

    export module Lens {

        export class WordCloudLens extends BaseSingleLens {

            public static Type: string = "WordCloudLens";

            private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _cloud: D3.Layout.CloudLayout = d3.layout.cloud();
            private _cloud_w: number = this._lens_circle_radius * 2;//Math.sqrt(2);
            private _cloud_h: number = this._cloud_w;
            private _cloud_padding: number = 1;
            private _cloud_font: string = "Calibri"
            private _cloud_font_weight: string = "normal";
            private _cloud_text_color: D3.Scale.OrdinalScale;
            //private _cloud_rotate: number = 0;

            public get Color(): D3.Scale.OrdinalScale {
                return this._cloud_text_color;
            }

            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, WordCloudLens.Type,manyLens);
               
                this._cloud_text_color = d3.scale.category20c();

            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            // data shape {text: size:}
            public ExtractData(map?:(d?:any)=>any): Array<D3.Layout.ICloudData> {
                var data: Array<D3.Layout.ICloudData> = super.ExtractData(map);
                if (data == null) return;

                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(data, function (d) { return d.Value; }))
                ;

                return data;
            }

            public DisplayLens(data: Array<any>): any {
                if (data == null)
                    return;
                super.DisplayLens(data);

                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(this._data)
                    .filter((d) => {
                        if (d.Value > 2)
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
                    .enter().append("text");

                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font })
                    .style("fill", (d, i) => { return this._cloud_text_color(d.size); })
                    .style("opacity", 1e-6)
                    .attr("text-anchor", "middle")
                //.attr("class", "show")
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