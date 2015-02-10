module ManyLens {
    export module MapArea {
        export class SOMMap extends D3ChartObject{

            private _lensPane: Pane.ClassicLensPane;

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);
                this._lensPane = new Pane.ClassicLensPane(element, manyLens);
                

                this._manyLens.CurveHubRegisterClientFunction(this, "showVis", this.ShowVis);
            }

            public Render() {
                this._lensPane.Render();
            }

            public ShowVis(obj: any): void {
                console.log(obj);
            }
        }
    }

} 