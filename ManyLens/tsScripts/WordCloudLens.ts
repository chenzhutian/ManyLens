///<reference path = "../tsScripts/BaseD3Lens.ts" />
module ManyLens{
    interface cloudData {
        text: string;
        value: number;
    }
    export class WordCloudLens extends BaseD3Lens {

        private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
        private _cloud:D3.Layout.CloudLayout = d3.layout.cloud();
        private _cloud_w: number = this._lc_radius * 2;//Math.sqrt(2);
        private _cloud_h: number = this._cloud_w;
        private _cloud_padding: number = 1;
        private _cloud_font: string = "Calibri"
        private _cloud_font_weight: string = "normal";
        private _cloud_rotate: number = 0;

        constructor(element: D3.Selection) {
            super(element,"WordCloudLens");
            this._color = d3.scale.category20c();

        }

        public render(color:string): void {
            super.render(color);
            
        }

        // data shape {text: size:}
        protected extractData(): Array<cloudData> {
            var data: Array<cloudData>
            data = [{ text: "Samsung", value: 90 },
                { text: "Apple", value: 80 },
                { text: "Lenovo", value: 50 },
                { text: "LG", value: 60 },
                { text: "Nokia", value: 30 },
                { text: "Huawei", value: 40 },
                { text: "Meizu", value: 50 },
                { text: "HTC", value: 60 },
                { text: "XiaoMi", value: 60 },
                { text: "ZTE", value: 40 },
                { text: "Galaxy Note Edge", value: 60 },
                { text: "LED H5205", value: 70 },
                { text: "Galaxy Tab3 8.0", value: 50 },
                { text: "Galaxy Tab3 10.1", value: 50 },
                { text: "Gear S", value: 70 },
                { text: "Gear Fit", value: 40 },
                { text: "Gear Fit2", value: 30 },
                { text: "Galaxy S4", value: 60 }]
            ;

            this._font_size
                .range([10, this._cloud_w/8])
                .domain(d3.extent(data, function (d) { return d.value; }))
            ;

            return data;
        }

        protected showLens(data: Array<any>): any {
            var p = super.showLens();
            var container = this._element;
            var lensG = this._lensG;

            this._lens_circle = lensG.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", this._lc_radius)
                .attr("fill", "#fff")
                .attr("stroke", "black")
                .attr("stroke-width",1)
            ;


            lensG
                .transition().duration(p.duration)
                .attr("opacity", "1")
            ;

            this._cloud.size([this._cloud_w,this._cloud_h])
                .words(data)
                .padding(this._cloud_padding)
                .rotate(this._cloud_rotate)
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

            console.log(scale);
            var text = container
                .select("g.lcthings").select("g").selectAll("text")
                .data(words, function (d) { return d.text; })
                .enter().append("text");

            text.attr("text-anchor", "middle")
                .style("font-size", function (d) { return d.size + "px"; })
                .style("font-weight", function (d) { return d.weight; })
                .style("font-family", function (d) { return d.font })
                .style("fill", (d, i) =>{ return this._color(d.size); })
                .style("opacity", 1e-6)
                .attr("text-anchor", "middle")
                .attr("class", "show")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; })
                .transition().duration(200)
                .style("opacity", 1)
            ;
        }

        protected zoomFunc(): void {
            super.zoomFunc();
        }
    }
}