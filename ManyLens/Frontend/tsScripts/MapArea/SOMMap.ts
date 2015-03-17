///<reference path = "./HeatmapLayer.ts" />
module ManyLens {
    export module MapArea {

        interface UnitData {
            unitID: number;
            colorIndex: number;
            value: number;
            x: number;
            y: number;
            mapID: string;
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
            //private _colorPalettes: string[] = ["rgb(99,133,255)", "rgb(98,252,250)", "rgb(99,255,127)", "rgb(241,255,99)", "rgb(255,187,99)", "rgb(255,110,99)", "rgb(255,110,99)"];
            private _maps: Array<MapData> = [];
            private _heatMaps: Array<HeatMapLayer> = [];

            private _heatmap_container: HTMLElement;
            private _unit_width: number = 20;
            private _unit_height: number = 20;
            
            private _total_width: number;
            private _left_offset: number = 10;
            private _map_gap: number = 10;
                
            private _colorPalettes: string[] = ["rgb(198,219,239)",
                                                "rgb(158,202,225)",
                                                "rgb(107, 174, 214)",
                                                "rgb(66, 146, 198)",
                                                "rgb(33, 113, 181)",
                                                "rgb(8, 81, 156)",
                                                "rgb(8, 81, 156)"
                                            ];

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);
               // this._lensPane = new Pane.ClassicLensPane(element, manyLens);
                this._element.attr("height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });
                this._total_width = parseFloat( this._element.style( "width" ) );

                this._heatmap_container = document.createElement( 'div' );
                this._heatmap_container.id = "heatmap-container";
                this._heatmap_container.style.left = ( <HTMLElement>this._element.node() ).offsetLeft.toString()+"px";
                this._heatmap_container.style.top = ( <HTMLElement>this._element.node() ).offsetTop.toString()+"px";
                //this._heatmap_container.style.height = ( <HTMLElement>this._element.node() ).offsetHeight.toString()+"px";
                //this._heatmap_container.style.width = ( <HTMLElement>this._element.node() ).offsetWidth.toString()+"px";
                document.getElementById( "mapView" ).insertBefore( this._heatmap_container,this._element.node() );


                this._manyLens.ManyLensHubRegisterClientFunction(this, "showVis", this.ShowVis);
            }

            public Render() {
                //this._lensPane.Render();
            }

            public ShowVis( visData: MapData ): void {
                this._maps.push( visData );
                var top_offset: number = (parseFloat( this._element.style( "height" ) ) - visData.height * this._unit_height)/ 2;

                this._heatMaps.push( new HeatMapLayer( "mapCanvas" + visData.mapID,
                    this._heatmap_container,
                    visData.width,
                    visData.height,
                    this._unit_width,
                    this._unit_height,
                    top_offset,
                    this._left_offset,
                    visData.unitsData )
                );

                var svg = this._element
                    .append("g")
                    .data([{ mapID: visData.mapID, width: visData.width, height: visData.height}])
                    .attr("id", function (d) { return "mapSvg" + d.mapID; })
                ;

                svg.append("g")
                    .attr("class", "units")
                    .selectAll("rect")
                    .data(visData.unitsData)
                    .enter().append("rect")
                    .attr("class","unit")
                    .attr("x",  (d)=> { return this._left_offset +  d.x * this._unit_width; })
                    .attr("y",  (d)=> { return top_offset + d.y * this._unit_height; })
                    .attr({
                        width: this._unit_width,
                        height: this._unit_height
                    })
                    .style( {
                        opacity:1e-6
                    })
                ;

                this._left_offset += this._map_gap + this._unit_width * visData.width;

                if ( this._left_offset > this._total_width ) {
                    var scale = this._total_width /this._left_offset;
                    this._left_offset *= scale;
                    this.ScaleMaps(scale);
                }
                
            }

            private ScaleMaps( scale: number ): void {
                this._element.selectAll( "rect" )
                    .attr( "x", function ( d ) {
                    return scale * parseFloat( d3.select( this ).attr( "x" ) );
                })
                    .attr( "y", function ( d ) {
                    return scale * parseFloat( d3.select( this ).attr( "y" ) );
                })
                ;
                this._heatMaps.forEach(( d ) => {
                    d.ScaleCanvas( scale );
                });
            }
        }
    }

} 