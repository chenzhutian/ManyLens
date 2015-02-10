module ManyLens {
    export module MapArea {

        interface UnitData {
            colorIndex: number;
            unitID: number;
            count: number;
            contents: string;
            labels: string;
            tweetIDs: string;
            x: number;
            y: number
        }
        interface MapData {
            mapID: string;
            width: number;
            height: number;
            max: number;
            min: number;
            unitsData: Array<UnitData>;
        }

        export class SOMMap extends D3ChartObject {

            private _lensPane: Pane.ClassicLensPane;
            private _colorPalettes: string[] = ["rgb(99,133,255)", "rgb(98,252,250)", "rgb(99,255,127)", "rgb(241,255,99)", "rgb(255,187,99)", "rgb(255,110,99)"];

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);
                this._lensPane = new Pane.ClassicLensPane(element, manyLens);


                this._manyLens.ManyLensHubRegisterClientFunction(this, "showVis", this.ShowVis);
            }

            public Render() {
                this._lensPane.Render();
            }

            public ShowVis(visData: MapData): void {
                var scale = d3.scale.quantize().domain([visData.min, visData.max]).range(d3.range(this._colorPalettes.length - 1));
                var data0 = [];
                visData.unitsData.forEach(function (d) {
                    var index = scale(d.count);
                    d.colorIndex = index;
                    if (data0[index] == null) {
                        data0[index] = [d.count];
                    } else {
                        data0[index].push(d.count);
                    }
                });


                var somMapWidth = 300.0;
                var somMapHeight = 300.0;

                var xPadding = somMapWidth / (visData.width + 1);
                var yPadding = somMapHeight / (visData.height + 1);

                var svg = this._element
                    .append("g")
                    .data([{ mapID: visData.mapID, width: visData.width, height: visData.height, xPadding: xPadding, yPadding: yPadding }])
                    .attr("id", function (d) { return "mapSvg" + d.mapID; })
                    .attr("width", somMapWidth)
                    .attr("height", somMapHeight)
                ;

                svg.append("g")
                    .attr("class", "units")
                    .selectAll("rect")
                    .data(visData.unitsData)
                    .enter().append("rect")
                    .attr("class","unit")
                    //.attr("r", 4)
                    //.attr("cx", function (d) { return (d.x + 0.5) * xPadding; })
                    //.attr("cy", function (d) { return (d.y + 0.5) * yPadding; })
                    .attr("x", function (d, i) { return d.x * 20; })
                    .attr("y", function (d, i) { return d.y * 20; })
                    .attr({
                        width: 20,
                        height:20
                    })
                    .attr("fill", (d: UnitData) => {
                        //var interpalote = d3.interpolateRgb(this._colorPalettes[d.colorIndex], this._colorPalettes[d.colorIndex+1]);
                        //var extent = d3.extent<number>(data0[d.colorIndex]);
                        //return interpalote((d.count - extent[0]) / (extent[1] - extent[0]));

                        var colorScale = d3.scale.linear()
                            .domain(d3.extent(data0[d.colorIndex]))
                            .range([this._colorPalettes[d.colorIndex], this._colorPalettes[d.colorIndex+1]]);

                        return colorScale(d.count);
                    })
                ;

            }
        }
    }

} 