import * as d3 from "d3";
import { Selection, layout, scale, svg } from "d3";
import { BaseSingleLens } from "./index";
import { ManyLens } from "../ManyLens";

export class PieChartLens extends BaseSingleLens {

    public static Type: string = "PieChartLens";

    private _pie_innerRadius: number = 0;
    private _pie_outterRadius: number = this._lens_circle_radius - 0;
    private _pie: layout.Pie<any> = d3.layout.pie();
    private _arc: svg.Arc<any> = d3.svg.arc();

    private _color: scale.Quantize<any> = d3.scale.quantize();

    //public get Color(): D3.Scale.OrdinalScale {
    //    return this._color;
    //}

    constructor(element: Selection<any>, attributeName: string, manyLens: ManyLens) {
        super(element, attributeName, PieChartLens.Type, manyLens);
        this._arc
            .innerRadius(this._pie_innerRadius)
            .outerRadius(this._pie_outterRadius)
            //    .startAngle(0)
            ;

        this._pie
            .value((d) => d.Value)
            .sort((a, b) => a.Value - b.Value)
            .startAngle(0)
            // .padAngle(.02)
            ;

        this._color
            .range([
                "rgb(198,219,239)",
                "rgb(158,202,225)",
                "rgb(107, 174, 214)",
                "rgb(66, 146, 198)",
                "rgb(33, 113, 181)"
                // "rgb(8, 81, 156)"
                // "rgb(8, 48, 107)"
            ]);

    }

    public Render(color: string): void {
        super.Render(color);

    }

    protected AfterExtractData(): void {
        this._color.domain(d3.extent(this._extract_data_map_func.Extract(this._data), function (d) { return d['Value']; }));
    }

    public DisplayLens(): any {
        if (!super.DisplayLens()) return;

        this._lens_circle.style({
            "stroke": null,
            "stroke-width": null
        });

        this._lens_circle_svg.selectAll(".pie")
            .data(this._pie(this._extract_data_map_func.Extract(this._data)))
            .enter().append("path")
            .attr("id", "pie-" + this.ID)
            .attr("class", "pie")
            .attr("fill", (d) => {
                return this._color(d.value) || "rgb(158,202,225)";
            })
            .attr("stroke", "#fff")
            .attr("d", this._arc)
            .on("mouseover", (d) => {
                this.ShowLabel(d);
            })
            .on("mouseout", () => {
                this.ShowLabel(null);
            })
            ;

        var r = this._lens_circle_radius;
        this._lens_circle_svg
            .append("text")
            .text(this._attribute_name)
            .attr("dx", function (d) {
                var bbox = this.getBBox();
                return r * Math.PI - bbox.width / 2;
            })
            .attr("dy", "-5")
            .text("")
            .append("textPath")
            .attr("xlink:href", "#lens-circle-" + this.ID)
            .text(this._attribute_name)
            ;
    }

    private ShowLabel(d: any): void {
        if (d) {
            this._lens_circle_svg.selectAll("text.mylabel")
                .data([d])
                .enter().append("text")
                .attr("class", "mylabel")
                .attr("text-anchor", "middle")
                .attr("x", (d) => {
                    var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                    d.cx = Math.cos(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                    return d.x = Math.cos(a) * (this._pie_outterRadius + 40);
                })
                .attr("y", (d) => {
                    var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                    d.cy = Math.sin(a) * (this._pie_innerRadius + (this._pie_outterRadius - this._pie_innerRadius) / 2);
                    return d.y = Math.sin(a) * (this._pie_outterRadius + 40);
                })
                .text(function (d) { return d.data.Key; })
                .each(function (d) {
                    var bbox = this.getBBox();
                    d.sx = d.x - bbox.width / 2 - 2;
                    d.ox = d.x + bbox.width / 2 + 2;
                    d.sy = d.oy = d.y + 5;
                });

            this._lens_circle_svg.selectAll("path.mylabel")
                .data([d])
                .enter().append("path")
                .attr("class", "mylabel")
                .style("fill", "none")
                .style("stroke", "black")
                .attr("d", function (d) {
                    if (d.cx > d.ox) {
                        return "M" + d.sx + "," + d.sy + "L" + d.sx + "," + d.sy;
                    } else {
                        return "M" + d.ox + "," + d.oy + "L" + d.ox + "," + d.oy;
                    }
                })
                .transition().duration(200)
                .attr("d", function (d) {
                    if (d.cx > d.ox) {
                        return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                    } else {
                        return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                    }
                });
        } else {
            this._lens_circle_svg.selectAll(".mylabel").remove();
        }
    }
}

