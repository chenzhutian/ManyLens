///<reference path = "../tsScripts/D3ChartObject.ts" />

module ManyLens {
    export class LensPane extends D3ChartObject {

        private _lens: Array<BaseD3Lens>;


        constructor(element: D3.Selection) {
            super(element);

        }
        public render(): void {
            var container = this._element;
            container.on("click", function () {
                var p = d3.mouse(container[0][0]);
                var data = [1, 1, 2, 3, 5];

                var radius = 100;

                var arc = d3.svg.arc()
                    .innerRadius(radius - 40)
                    .outerRadius(radius)
                ;

                var pie = d3.layout.pie()
                    .startAngle(-Math.PI / 2)
                    .endAngle(Math.PI / 2).value(() => { return 1; });

                var color = d3.scale.category10();
                
                var svg = container
                    .append("g")
                    .attr("transform", "translate(" + p[0] + "," + p[1] + ")");

                svg.selectAll("circle")
                    .data(pie(data))
                    .enter().append("circle")
                    .style("fill", function (d, i) { return color(i); })
                    .attr("r", 10)
                    .transition().duration(750)
                    .attr("transform", function (d) {
                        return "translate(" + arc.centroid(d) + ")";
                    })
                ;

                var timer = setTimeout(function () {
                    svg.selectAll("circle")
                        .transition().duration(400)
                        .attr("transform", "none")
                        .remove()
                    ;
                }, 1000);
            });
            

        }
    }
}