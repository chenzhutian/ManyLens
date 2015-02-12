///<reference path = "./BaseSingleLens.ts" />
module ManyLens {
    export module Lens {

        export class BarChartLens extends BaseSingleLens {

            public static Type: string = "BarChartLens";

            private _x_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _x_axis: D3.Selection;
            private _bar_width: number;
            private _bar_chart_width: number = this._lens_circle_radius * Math.SQRT2;
            private _bar_chart_height: number = this._bar_chart_width;

            constructor(element: D3.Selection, manyLens: ManyLens.ManyLens) {
                super(element, BarChartLens.Type,manyLens);
            }

            public Render(color: string): void {
                super.Render(color);

            }

            public ExtractData(): any {
                var data: Array<number>;
                data = d3.range(12).map(function (d) {
                    return 10 + 70 * Math.random();
                });

                return data;
            }

            public DisplayLens(data: Array<number>): any {
                super.DisplayLens(data);

                var x = d3.scale.linear()
                    .range([0, this._bar_chart_width])
                    .domain([0, this._data.length]);

                this._x_axis_gen
                    .scale(x)
                    .ticks(0)
                    .orient("bottom")
                ;
                this._x_axis = this._lens_circle_svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", () => {
                        return "translate(" + [-this._bar_chart_width / 2, this._bar_chart_height / 2] + ")";
                    })
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .call(this._x_axis_gen)
                ;

                this._bar_width = (this._bar_chart_width - 20) / this._data.length;
                var barHeight = d3.scale.linear()
                    .range([10, this._bar_chart_height])
                    .domain(d3.extent(this._data));

                var bar = this._lens_circle_svg.selectAll(".bar")
                    .data(this._data)
                    .enter().append("g")
                    .attr("transform", (d, i) => {
                        return "translate(" + [10 + i * this._bar_width - this._bar_chart_width / 2, this._bar_chart_height / 2 - barHeight(d)] + ")";
                    })
                ;

                bar.append("rect")
                    .attr("width", this._bar_width)
                    .attr("height", function (d) { return barHeight(d); })
                    .attr("fill", "steelblue")
                ;

            }
        }
    }
}