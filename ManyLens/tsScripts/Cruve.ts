

module ManyLens {
    export class Curve {
        private _x_axis_gen: D3.Svg.Axis;
        private _x: D3.Scale.LinearScale = d3.scale.linear();
        private _y_axis_gen: D3.Svg.Axis;
        private _y: D3.Scale.LinearScale = d3.scale.linear();
        private _section_num: number = 150;
        private _view_height: number;
        private _view_width: number;
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

        constructor() { }


    }
}