///<reference path = "./BaseCompositeLens.ts" />
module ManyLens {
    export module Lens{
        export class cWordCloudNetworkLens extends BaseCompositeLens {

            public static Type: string = "cWordCloudNetworkLens";

            private _font_size: D3.Scale.SqrtScale = d3.scale.sqrt();
            private _cloud: D3.Layout.CloudLayout = d3.layout.cloud();

            private _cloud_w: number = this._lens_circle_radius * 2;//Math.SQRT2;
            private _cloud_h: number = this._cloud_w;
            private _cloud_padding: number = 0;
            private _cloud_font: string = "Calibri"
            private _cloud_font_weight: string = "normal";
            private _color: D3.Scale.OrdinalScale;



            private _innerRadius: number = this._lens_circle_radius - 2;
            private _outterRadius: number = this._lens_circle_radius + 20;
            private _pie: D3.Layout.PieLayout = d3.layout.pie();
            private _arc: D3.Svg.Arc = d3.svg.arc();

            private _chord: D3.Layout.ChordLayout = d3.layout.chord();


            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseCompositeLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseSingleLens, secondLens: BaseSingleLens);
            constructor(element: D3.Selection, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, cWordCloudNetworkLens.Type, manyLens, firstLens, secondLens);

                this._color = d3.scale.category10();

                this._arc
                    .innerRadius(this._innerRadius)
                    .outerRadius(this._outterRadius)
                ;

                this._pie
                    .value((d) => {
                        return d;
                    })
                    .sort(null)
                    .startAngle(-Math.PI * 8/3)
                    .endAngle(-Math.PI * 2/3)
                ;

                this._chord
                    .padding(.05)
                    .sortSubgroups(d3.descending)
                
                ;
            }

            public Render(color = "red"): void {
                super.Render(color);

            }

            // data shape {text: size:}
            protected ExtractData(): Array<D3.Layout.ICloudData> {
                var data: Array<D3.Layout.ICloudData>
                data = [
                    { text: "aaa", value: 10 },
                    { text: "bbb", value: 10 },
                    { text: "ccc", value: 9 },
                    { text: "LG", value: 9 },
                    { text: "Nokia", value: 9 },
                    { text: "Gear", value: 9 },
                    { text: "fear", value: 9 },
                    { text: "pear", value: 8 },
                    { text: "jjear", value: 8 },
                    { text: "weqr", value: 8 },
                    { text: "vbn", value: 8 },
                    { text: "lk", value: 8 },
                    { text: "lopxcv", value: 7 },
                    { text: "yyyy", value: 7 },
                    { text: "lxzcvk", value: 7 },
                    { text: "tyu", value: 7 },
                    { text: "jjear", value: 6 },
                    { text: "weqr", value: 6 },
                    { text: "vbn", value: 6 },
                    { text: "lk", value: 6 },
                    { text: "lopxcv", value: 5 },
                    { text: "yyyy", value: 5 },
                    { text: "lxzcvk", value: 5 },
                    //{ text: "Gea", value: 10 },
                    //{ text: "cea", value: 10 },
                    //{ text: "uea", value: 10 },
                    //{ text: "lea", value: 10 },
                    //{ text: "ea", value: 10 },
                    //{ text: "pp", value: 10 },
                    //{ text: "nh", value: 10 },
                    //{ text: "erw", value: 10 }
                ]
                ;

                data.forEach(function (d,i) {
                    d["group"] = (i%3)+1;//Math.ceil(Math.random()*3);
                });

                this._font_size
                    .range([10, this._cloud_w / 8])
                    .domain(d3.extent(data, function (d) { return d.value; }))
                ;

                return data;
            }

            public DisplayLens(): void {
                super.DisplayLens();
                var data = this.ExtractData();

                this._cloud.size([this._cloud_w, this._cloud_h])
                    .words(data)
                    .padding(this._cloud_padding)
                    .rotate(0)
                    .font(this._cloud_font)
                    .fontWeight(this._cloud_font_weight)
                    .fontSize((d) => { return this._font_size(d.value); })
                    .on("end", (words,bound) => {
                        this.DrawCloud(words,bound);
                    })
                ;
                this._cloud.start();


                var groups = [];
                for (var i = 0, len = data.length; i < len; ++i) {

                    if (groups[parseInt(data[i]['group']) - 1] != null) {
                        var group = parseInt(data[i]['group']);
                        groups[group - 1]++;
                    }
                    else {
                        groups[parseInt(data[i]['group']) - 1] = 0;
                    }
                }


                this._chord.matrix([
                    [2000, 2300, 2100],
                    [1951, 2100, 2000],
                    [2300, 2200, 2100]
                ]);

                this._lens_circle_svg.selectAll("path")
                    .data(this._chord.groups)
                    .enter().append("path")
                    .attr("fill", (d, i) => {
                        return this._color(i+1);
                    })
                    .attr("d", this._arc)
                ;


                this._lens_circle_svg.append("g")
                    .attr("class", "chord")
                    .selectAll("path")
                    .data(this._chord.chords)
                    .enter().append("path")
                    .attr("d", d3.svg.chord().radius(this._innerRadius))
                    .style("fill", (d, i) => { return this._color(i+1); })
                    .style("opacity", 0.9)
                    .style("fill-opacity", 0.15)
                    //.style("stroke", "#000")
                    //.style("stroke-width", ".5px")
                ;

            }

            private DrawCloud(words: any[], bounds: any[]) {

                var text = this._lens_circle_svg.selectAll("text")
                    .data(words, function (d) { return d.text; })
                    .enter().append("text");

                text.attr("text-anchor", "middle")
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("font-weight", function (d) { return d.weight; })
                    .style("font-family", function (d) { return d.font })
                    .style("fill", (d, i) => { return this._color(d.group); })
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