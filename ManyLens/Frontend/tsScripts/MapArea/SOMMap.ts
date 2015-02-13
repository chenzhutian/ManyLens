module ManyLens {
    export module MapArea {

        interface UnitData {
            unitID: number;
            colorIndex: number;
            count: number;
            x: number;
            y: number;
            lensData: Array<Lens.UnitsDataForLens>;
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

           // private _lensPane: Pane.ClassicLensPane;
            private _colorPalettes: string[] = ["rgb(99,133,255)", "rgb(98,252,250)", "rgb(99,255,127)", "rgb(241,255,99)", "rgb(255,187,99)", "rgb(255,110,99)", "rgb(255,110,99)"];

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);
               // this._lensPane = new Pane.ClassicLensPane(element, manyLens);
                this._element.attr("height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });

                this._manyLens.ManyLensHubRegisterClientFunction(this, "showVis", this.ShowVis);
            }

            public Render() {
                //this._lensPane.Render();
            }

            public ShowVis(visData: MapData): void {
                var deviation = d3.deviation(visData.unitsData, function (d) { return d.count; });
                var mean = d3.mean(visData.unitsData, function (d) { return d.count; });
                var median = d3.median(visData.unitsData, function (d) { return d.count; });
                var oneDeviationMin = (mean - deviation) > 0 ? (mean - deviation) : 0;
                var twoDeviationMax = (mean + 2 * deviation);
                var oneDeviationMax = (mean + deviation);

                var scale = d3.scale.quantize().domain([oneDeviationMin,oneDeviationMax]).range([1,2,3]);
                
                var data0 = [];
                visData.unitsData.forEach((d) => {
                    if (d.count > twoDeviationMax) {
                        d.colorIndex = 5;
                    }else if (d.count > oneDeviationMax) {
                        d.colorIndex = 4;
                    }
                    else if (d.count < oneDeviationMin || d.count < median) {
                        d.colorIndex = 0;
                    } else {
                        d.colorIndex = scale(d.count);
                    }

                    if (data0[d.colorIndex] == null) {
                        data0[d.colorIndex] = [d.count];
                    } else {
                            data0[d.colorIndex].push(d.count);
                    }
                });
                console.log(visData.min, visData.max);
                console.log(d3.deviation(visData.unitsData, function (d) { return d.count; }));
                console.log(d3.mean(visData.unitsData, function (d) { return d.count; }));
                console.log(d3.median(visData.unitsData, function (d) { return d.count; }));
                console.log(data0);

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
                    .attr("x", function (d, i) { return 100+d.x * 20; })
                    .attr("y", function (d, i) { return 100+d.y * 20; })
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