///<reference path = "../tsScripts/D3ChartObject.ts" />

module ManyLens {


    export class Curve extends D3ChartObject{

        private _x: D3.Scale.LinearScale = d3.scale.linear();
        private _y: D3.Scale.LinearScale = d3.scale.linear();
        private _x_axis_gen: D3.Svg.Axis = d3.svg.axis();
        private _y_axis_gen: D3.Svg.Axis = d3.svg.axis();
        private _section_num: number = 80;
        private _view_height: number = 150;
        private _view_width: number = screen.width;
        private _view_top_padding: number = 15;
        private _view_botton_padding: number = 20;
        private _view_left_padding: number = 50;
        private _view_right_padding: number = 50;

       
        public get Section_Num(): number {
            return this._section_num;
        }
        public set Section_Num(num: number) {
            if (typeof num === 'number') {
                this._section_num = Math.ceil(num);
            }
        }

        constructor(element:D3.Selection) {
            super(element);

            this._x
                .range([this._view_left_padding, this._view_width - this._view_right_padding])
                .domain([0,this._section_num])
            ;
            this._y
                .range([this._view_height - this._view_botton_padding, this._view_top_padding])
                .domain([0,20])
            ;
            this._x_axis_gen
                .scale(this._x)
                .ticks(this._section_num)
                .orient("bottom")
            ;
            this._y_axis_gen
                .scale(this._y)
                .ticks(2)
                .orient("left")
            ;
        }

        public render<T>(data: Array<T>):void {
            super.render(data);
            var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
            var coordinate_view_height = this._view_height - this._view_top_padding - this._view_botton_padding;

            var svg = this._element.append("svg")
                .attr("width", this._view_width)
                .attr("height", this._view_height)
            ;

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
            .append("rect")
                .attr("width", coordinate_view_width)
                .attr("height", coordinate_view_height)
                .attr("x", this._view_left_padding)
                .attr("y", this._view_top_padding)
            ;

            var xAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (this._view_height - this._view_botton_padding) + ")")
                .call(this._x_axis_gen)
            ;

            var yAxis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + this._view_left_padding + ",0)")
                .call(this._y_axis_gen)
            ;

            svg.append("g")
                .attr("clip-path", "url(#clip)")
            .append("g")
                .attr("id", "mainView")
            .append("path")
                .attr('stroke', 'blue')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr("id", "path")
            ;

        }

    }
}