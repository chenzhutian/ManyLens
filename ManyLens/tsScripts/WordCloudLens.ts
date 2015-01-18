///<reference path = "../tsScripts/BaseSingleLens.ts" />
module ManyLens {

    export module Lens {

        interface cloudData {
            text: string;
            value: number;
        }
        export class WordCloudLens extends BaseSingleLens {

            private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _cloud: D3.Layout.CloudLayout = d3.layout.cloud();
            private _cloud_w: number = this._lc_radius * 2;//Math.sqrt(2);
            private _cloud_h: number = this._cloud_w;
            private _cloud_padding: number = 1;
            private _cloud_font: string = "Calibri"
            private _cloud_font_weight: string = "normal";
            private _cloud_text_color: D3.Scale.OrdinalScale;
            //private _cloud_rotate: number = 0;

            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, "WordCloudLens",manyLens);
               
                this._cloud_text_color = d3.scale.category20c();

            }

            public render(color = "red"): void {
                super.render(color);

            }

            // data shape {text: size:}
            protected extractData(): Array<cloudData> {
                var data: Array<cloudData>
                data = [
                    { text: "Samsung", value: 90 },
                    { text: "Apple", value: 50 },
                    { text: "Lenovo", value: 50 },
                    { text: "LG", value: 60 },
                    { text: "Nokia", value: 30 },
                    { text: "Huawei", value: 40 },
                    { text: "Meizu", value: 50 },
                    { text: "eizu", value: 50 },
                    { text: "ZTE", value: 40 },
                    { text: "Fiiit", value: 40 },
                    { text: "qweri", value: 40 },
                    { text: "bnm", value: 40 },
                    { text: "tytyt", value: 40 },
                    { text: "asdf", value: 40 },
                    { text: "Fit", value: 40 },
                    { text: "Gear", value: 30 },
                    { text: "fear", value: 20 },
                    { text: "pear", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "jjear", value: 20 },
                    { text: "weqr", value: 20 },
                    { text: "vbn", value: 20 },
                    { text: "lk", value: 20 },
                    { text: "lopxcv", value: 20 },
                    { text: "yyyy", value: 20 },
                    { text: "lxzcvk", value: 20 },
                    { text: "tyu", value: 20 },
                    { text: "Gea", value: 10 },
                    { text: "Ge", value: 10 },
                    { text: "Gfa", value: 10 },
                    { text: "a", value: 10 },
                    { text: "bvea", value: 10 },
                    { text: "Gea", value: 10 },
                    { text: "cea", value: 10 },
                    { text: "uea", value: 10 },
                    { text: "lea", value: 10 },
                    { text: "ea", value: 10 },
                    { text: "pp", value: 10 },
                    { text: "nh", value: 10 },
                    { text: "erw", value: 10 }
                ]
                ;

                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(data, function (d) { return d.value; }))
                ;

                return data;
            }

            public showLens(data: Array<any>, lc_cx = null, lc_cy = null): any {
                var p = super.showLens(null);
                var container = this._element;
                var lensG = this._lens_circle_G;

                lensG
                    .transition().duration(p.duration)
                    .attr("opacity", "1")
                ;

                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(data)
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.value); })
                    .on("end", (words, bounds) => {
                        this.drawCloud(words, bounds);
                    })
                ;
                this._cloud.start();
            }

            private drawCloud(words: any[], bounds: any[]) {
                var w = this._cloud_w;
                var h = this._cloud_h;
                var container = this._element;

                //Maybe need to scale, but I haven't implemented it now
                var scale = bounds ? Math.min(
                    w / Math.abs(bounds[1].x - w / 2),
                    w / Math.abs(bounds[0].x - w / 2),
                    h / Math.abs(bounds[1].y - h / 2),
                    h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

                var text = this._lens_circle_G.selectAll("text")
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