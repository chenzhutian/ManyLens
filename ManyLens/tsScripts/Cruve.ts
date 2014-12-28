///<reference path = "../tsScripts/D3ChartObject.ts" />

module ManyLens {


    export class Curve extends D3ChartObject{

        private _x: D3.Scale.LinearScale = d3.scale.linear();
        private _y: D3.Scale.LinearScale = d3.scale.linear();
        private _x_axis_gen: D3.Svg.Axis;
        private _y_axis_gen: D3.Svg.Axis;
        private _section_num: number = 150;
        private _view_height: number = 50;
        private _view_width: number = screen.width;
        private _view_x_padding: number;
        private _view_y_padding: number;
        
        public get X(): D3.Scale.LinearScale {
            return this._x;
        }
        public set X(scale: D3.Scale.LinearScale) {
            this._x = scale;
        }
        public get Y(): D3.Scale.LinearScale {
            return this._y;
        }
        public set Y(scale: D3.Scale.LinearScale) {
            this._y = scale;
        }

        constructor(element:D3.Selection,xPadding:number = 50,yPadding:number = 50) {
            super(element);
            this._view_x_padding = xPadding;
            this._view_y_padding = yPadding;
            this.X
                .range([this._view_x_padding, this._view_width - this._view_x_padding])
                .domain([0,this._section_num])
            ;
            this.Y
                .range([this._view_height + this._view_y_padding, this._view_y_padding])
                .domain([0,20])
            ;
        }

        public render<T>(data: Array<T>):void {
            super.render(data);

            var svg = this._element.append("svg")
                .attr("width", this._view_width)
                .attr("height", this._view_height)
            ;

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", this._view_width - 2 * this._view_x_padding)
                .attr("height", this._view_height)
                .attr("x", this._view_x_padding)
                .attr("y", this._view_y_padding)
            ;

            var xAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (this._view_y_padding + this._view_height) + ")")
                .call(this._x_axis_gen)
            ;

            var yAxis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "tanslate(" + this._view_x_padding + ",0)")
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
            console.log("f");
        }

    }
}