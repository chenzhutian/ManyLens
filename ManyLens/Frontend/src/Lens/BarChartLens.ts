import * as d3 from "d3";
import { svg, Selection } from "d3";
import { BaseHackLens } from "./index";
import { ManyLens } from "../ManyLens";

export class BarChartLens extends BaseHackLens {

    public static Type: string = "BarChartLens";

    private _x_axis_gen: svg.Axis = d3.svg.axis();
    private _x_axis: Selection<any>;
    private _bar_width: number;
    private _bar_chart_width: number = this._lens_circle_radius * Math.SQRT2;
    private _bar_chart_height: number = this._bar_chart_width;

    constructor(element: Selection<any>, attributeName: string, manyLens: ManyLens) {
        super(element, attributeName, BarChartLens.Type, manyLens);
    }

    public Render(color: string): void {
        super.Render(color);
    }

    public ExtractData(): void {
        var data: Array<number> = d3.range(12).map(function (d) {
            return 10 + 70 * Math.random();
        });

        this._data = data;
        this.DisplayLens();
    }

    public DisplayLens(): any {
        if (!super.DisplayLens()) return;

        var x = d3.scale.linear()
            .range([0, this._bar_chart_width])
            .domain([0, this._data.length]);

        this._x_axis_gen
            .scale(x)
            .ticks(0)
            .orient("bottom");

        this._x_axis = this._lens_circle_svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", () => {
                return "translate(" + [-this._bar_chart_width / 2, this._bar_chart_height / 2] + ")";
            })
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .call(this._x_axis_gen);

        this._bar_width = (this._bar_chart_width - 20) / this._data.length;
        var barHeight = d3.scale.linear()
            .range([10, this._bar_chart_height])
            .domain(d3.extent(this._data));

        var bar = this._lens_circle_svg.selectAll(".bar")
            .data(this._data)
            .enter().append("g")
            .attr("transform", (d, i) => {
                return "translate(" + [10 + i * this._bar_width - this._bar_chart_width / 2, this._bar_chart_height / 2 - barHeight(d)] + ")";
            });

        bar.append("rect")
            .attr("width", this._bar_width)
            .attr("height", d => barHeight(d))
            .attr("fill", "steelblue");

    }
}
