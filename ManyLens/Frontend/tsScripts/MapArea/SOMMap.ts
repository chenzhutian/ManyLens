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

            private _center_x: number;
            private _center_y: number;
            private _scale: number = 1;
            private _left_offset: number = 0;
            private _top_offset: number = null;
            private _translate_x: number = 0;
            private _translate_y: number = 0;
            private _total_width: number;
            private _map_gap: number = 10;

            private _heatmap_container: HTMLElement;
            private _unit_width: number = 20;
            private _unit_height: number = 20;

            private _zoom: D3.Behavior.Zoom;
            private _move_view_timer: number;

            private _colorPalettes: string[] = ["rgb(198,219,239)",
                "rgb(158,202,225)",
                "rgb(107, 174, 214)",
                "rgb(66, 146, 198)",
                "rgb(33, 113, 181)",
                "rgb(8, 81, 156)",
                "rgb(8, 81, 156)"
            ];

            constructor( element: D3.Selection, manyLens: ManyLens ) {
                super( element, manyLens );
                // this._lensPane = new Pane.ClassicLensPane(element, manyLens);
                this._element.attr( "height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });
                this._total_width = parseFloat( this._element.style( "width" ));

                this._heatmap_container = document.createElement( 'div' );
                this._heatmap_container.id = "heatmap-container";
                this._heatmap_container.style.left = ( <HTMLElement>this._element.node() ).offsetLeft.toString() + "px";
                this._heatmap_container.style.top = ( <HTMLElement>this._element.node() ).offsetTop.toString() + "px";
                this._heatmap_container.style.height = ( <HTMLElement>this._element.node() ).offsetHeight.toString() + "px";
                this._heatmap_container.style.width = ( <HTMLElement>this._element.node() ).offsetWidth.toString() + "px";
                document.getElementById( "mapView" ).insertBefore( this._heatmap_container, this._element.node() );

                this._center_x = 0.5 * parseFloat( this._element.style( "width" ) );
                this._center_y = 0.5 * parseFloat( this._element.style( "height" ) );
                this._zoom = d3.behavior.zoom()  
                    .scaleExtent( [0.5, 1.5] )
                    .on( "zoomstart",() => {
                        var p = d3.mouse( this._element.node() );
                        this._zoom
                            .center( [p[0], this._center_y] )
                        ;
                    })
                    .on( "zoom",() => {
                        clearInterval( this._move_view_timer );
                        var currentLevel = d3.event.scale;
                        this._heatMaps.forEach(( d, i ) => {
                            if ( this._scale != currentLevel ) {
                                d.transform( currentLevel, 0, 0 );
                            }
                            d.transformPan( d3.event.translate[0], d3.event.translate[1], currentLevel );
                        });
                        this._element.selectAll( ".units" )
                            .attr( "transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")" );

                        this._element.selectAll( ".lens" )
                            .attr( "transform", function ( d ) {
                            d.tx = d3.event.translate[0];
                            d.ty = d3.event.translate[1];
                            d.scale = d3.event.scale;
                            return "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
                        });

                        this._translate_x = d3.event.translate[0];
                        this._translate_y = d3.event.translate[1];
                        this._scale = currentLevel;

                    })
                    ;
                this._element
                    .call( this._zoom );

                this._manyLens.ManyLensHubRegisterClientFunction( this, "showVis", this.ShowVis );
            }

            public Render() {
                //this._lensPane.Render();
            }

            public ShowVis( visData: MapData ): void {
                this._maps.push( visData );
                if ( this._top_offset == null ) {
                    this._top_offset = ( parseFloat( this._element.style( "height" ) ) - visData.height * this._unit_height ) / 2;
                }

                var newHeatMap = new HeatMapLayer( "mapCanvas" + visData.mapID,
                    this._heatmap_container,
                    visData.width,
                    visData.height,
                    this._unit_width,
                    this._unit_height,
                    this._top_offset,
                    this._left_offset,
                    visData.unitsData );

                newHeatMap.transform( this._scale, 0, 0 );
                newHeatMap.transformPan( this._translate_x, this._translate_y, this._scale );
                this._heatMaps.push( newHeatMap );

                var svg = this._element
                    .append( "g" )
                    .data( [{ mapID: visData.mapID, width: visData.width, height: visData.height }] )
                    .attr( "id", function ( d ) { return "mapSvg" + d.mapID; })
                    .attr( "class", "units" )
                    .attr( "transform", "translate(" + [this._translate_x, this._translate_y] + ")scale(" + this._scale + ")" )
                    .selectAll( "rect" )
                    .data( visData.unitsData )
                    .enter().append( "rect" )
                    .attr( "class", "unit" )
                    .attr( "x",( d ) => { return this._left_offset + d.x * this._unit_width; })
                    .attr( "y",( d ) => { return this._top_offset + d.y * this._unit_height; })

                    .attr( {
                        width: this._unit_width,
                        height: this._unit_height
                    })
                    .style( {
                        opacity: 0.5
                    })
                    ;

                this._left_offset += this._unit_width * visData.width + this._map_gap;
                var leftMost = this._left_offset * this._scale + this._translate_x;
                if ( leftMost > this._total_width ) {
                    var t = d3.interpolate( 0, leftMost - this._total_width - this._map_gap );
                    var i = 0;
                    var sTx = this._translate_x;
                    clearInterval( this._move_view_timer );
                    this._move_view_timer = setInterval(() => {
                        this._translate_x = sTx - t( i / 100 )
                        this._heatMaps.forEach(( d ) => {
                            d.transformPan( this._translate_x, this._translate_y, this._scale );
                        });
                        this._element.selectAll( ".units" )
                            .attr( "transform", "translate(" + [this._translate_x, this._translate_y] + ")scale(" + this._scale + ")" );

                        this._zoom
                            .scale( this._scale )
                            .translate( [this._translate_x, this._translate_y] );
                        this._element.call( this._zoom );
                        ++i;
                        if ( i >= 100 ) {
                            clearInterval( this._move_view_timer );
                            this._move_view_timer = -1;
                        }
                    }, 10 );
                    
                }
            }


        }
    }

} 