///<reference path = "./HeatmapLayer.ts" />
module ManyLens {
    export module MapArea {

        interface UnitData {
            unitID: number;
            colorIndex: number;
            value: number;
            x: number;
            y: number;
            isSpam:boolean;
            mapID: string;
        }

        interface Label{
            label:string;
            x:number;
            y:number;
            value:number;
        }

        interface MapData {
            mapID: string;
            width: number;
            height: number;
            max: number;
            min: number;
            labels:Array<Label>;
            unitsData: Array<UnitData>;
        }

        export class SOMMap extends D3ChartObject {

            // private _lensPane: Pane.ClassicLensPane;
            //private _colorPalettes: string[] = ["rgb(99,133,255)", "rgb(98,252,250)", "rgb(99,255,127)", "rgb(241,255,99)", "rgb(255,187,99)", "rgb(255,110,99)", "rgb(255,110,99)"];
            private _state:boolean = true;

            private _maps: Array<MapData> = [];
            private _heatMaps: Array<HeatMapLayer> = [];
            private _mapIDs: Array<string> = [];

            private _center_x: number;
            private _center_y: number;
            private _scale: number = 1;
            private _left_offset: number = 0;
            private _top_offset: number = null;
            private _translate_x: number = 0;
            private _translate_y: number = 0;
            private _total_width: number;
            private _total_height:number;
            private _map_gap: number = 50;

            private _heatmap_container: HTMLElement;
            private _unit_width: number = 20;
            private _unit_height: number = 20;

            private _zoom: D3.Behavior.Zoom;
            private _move_view_timer: number;

            private _brush_svg:D3.Selection;
            private _brush:D3.Svg.Brush;
            private _fromUnitsID:number[];
            private _toUnitsID:number[];

            private _classifier_context_menu: D3.Selection = null;
            private _hightlight_classifier_arrow:D3.Selection = null;

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
                this._total_height = parseFloat(this._element.style("height"));

                this._heatmap_container = document.createElement( 'div' );
                this._heatmap_container.id = "heatmap-container";
                this._heatmap_container.style.left = ( <HTMLElement>this._element.node() ).offsetLeft.toString() + "px";
                this._heatmap_container.style.top = ( <HTMLElement>this._element.node() ).offsetTop.toString() + "px";
                this._heatmap_container.style.height = ( <HTMLElement>this._element.node() ).offsetHeight.toString() + "px";
                this._heatmap_container.style.width = ( <HTMLElement>this._element.node() ).offsetWidth.toString() + "px";
                document.getElementById( "mapView" ).insertBefore( this._heatmap_container, this._element.node() );

                this._center_x = 0.5 * parseFloat( this._element.style( "width" ) );
                this._center_y = 0.5 * parseFloat( this._element.style( "height" ) );
                this._brush = d3.svg.brush()
                    .on("brushstart",()=>{
                        if(d3.event.sourceEvent.altKey){
                            var extent = (<any>d3.event.target).extent();
                            var rect:SVGRect = ( <SVGSVGElement>this._element.node() ).createSVGRect();
                            rect.x = extent[0][0] * this._scale + this._translate_x;
                            rect.y = extent[0][1] * this._scale + this._translate_y;
                            rect.width = (extent[1][0] - extent[0][0]) * this._scale;
                            rect.height = (extent[1][1] - extent[0][1]) * this._scale;

                            //this._element.select( "#rectForTest" ).remove();
                            //this._element.append( "rect" ).attr( {
                            //    id:"rectForTest",
                            //    x: rect.x,
                            //    y: rect.y,
                            //    width: rect.width,
                            //    height:rect.height
                            //})
                            //.style("pointer-events","none");

                            var ele = ( <SVGSVGElement>this._element.node() ).getIntersectionList( rect, null );
                            var res = []
                            for(var i = 0, len = ele.length; i < len; ++i){
                                var node = d3.select(ele.item(i));
                                if(node.classed("unit")){
                                   res.push(node.data()[0]['unitID']);
                                }
                            }
                            this._fromUnitsID = res;
                        }
                        d3.event.sourceEvent.stopPropagation();
                    })
                    .on("brush",()=>{
                        d3.event.sourceEvent.stopImmediatePropagation();
                    })
                    .on("brushend",()=>{
                        if(d3.event.sourceEvent.altKey){
                            var extent = (<any>d3.event.target).extent();
                            var rect:SVGRect = ( <SVGSVGElement>this._element.node() ).createSVGRect();
                            rect.x = extent[0][0] * this._scale + this._translate_x;
                            rect.y = extent[0][1] * this._scale + this._translate_y;
                            rect.width = (extent[1][0] - extent[0][0]) * this._scale;
                            rect.height = (extent[1][1] - extent[0][1]) * this._scale;

                            //this._element.select( "#rectForTest" ).remove();
                            //this._element.append( "rect" ).attr( {
                            //    id:"rectForTest",
                            //    x: rect.x,
                            //    y: rect.y,
                            //    width: rect.width,
                            //    height:rect.height
                            //})
                            //.style("pointer-events","none");


                            var ele = ( <SVGSVGElement>this._element.node() ).getIntersectionList( rect, null );
                            var res = [];
                            var mapID:string;
                            for(var i = 0, len = ele.length; i < len; ++i){
                                var node = d3.select(ele.item(i));
                                if(node.classed("unit")){
                                   res.push(node.data()[0]['unitID']);
                                    mapID = node.data()[0]['mapID'];
                                    console.log(node);
                                }
                            }
                            this._toUnitsID = res;
                            if(this._fromUnitsID && this._toUnitsID){
                                console.log(this._fromUnitsID,this._toUnitsID);
                                this._manyLens.ManyLensHubServerRefineMap(mapID,
                                    this._mapIDs.indexOf(mapID),
                                    this._fromUnitsID,
                                    this._toUnitsID);
                            }
                        }
                        d3.event.sourceEvent.stopPropagation();    
                    })
                ;

                this._zoom = d3.behavior.zoom() 
                    .scaleExtent( [0.2, 1.5] )
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
                        this._element.selectAll( ".som-map" )
                            .attr( "transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")" );

                        this._element.selectAll( ".lens" )
                            .attr( "transform", function ( d ) {
                                if ( d.cx == 0 ) {
                                    d.cx = d3.event.translate[0];
                                    d.cy = d3.event.translate[1];
                                }
                                d.scale = currentLevel;
                                d.tx = d3.event.translate[0] - d.cx * d.scale;
                                d.ty = d3.event.translate[1] - d.cy * d.scale;
                            
                                return "translate(" + [d.tx,d.ty] + ")scale(" + currentLevel + ")"
                            });
                        
                        d3.select("#mapView")
                            .selectAll(".list-group")
                            .style("left",function(d){  var x = d.ox  + d3.event.translate[0]; return x+"px";})
                            .style("top",function(d){  var y = d.oy  + d3.event.translate[1]; return y+"px";})
                            .style("width",function(d){
                                var w = d.oWidth * currentLevel;
                                w = w  < 260 ? 260 : w;
                                return w+"px";
                            })
                            .selectAll("p")
                            .style("font-size",function(d){
                                var fontSize:any = d3.select(this).style("font-size");
                                fontSize = parseFloat(fontSize.substring(0,fontSize.length-2));
                                fontSize = fontSize * currentLevel > 18 ? 18: fontSize *currentLevel;
                                return fontSize + "px";
                            })
                        ;

                        this._translate_x = d3.event.translate[0];
                        this._translate_y = d3.event.translate[1];
                        this._scale = currentLevel;

                    })
                ;
                
                this.init();

                var defs = this._element.append('svg:defs');
                 // define arrow markers for leading arrow
                defs.append('svg:marker')
                    .attr({
                        'id': 'mark-end-arrow',
                        'viewBox': '0 -5 10 10',
                        'refX': 7,
                        'markerWidth': 3.5,
                        'markerHeight': 3.5,
                        'orient': 'auto'
                    })
                    .append('path')
                    .attr({
                        "class":"highlight-arrow",    
                        'd':'M0,-5L10,0L0,5z'
                    })
            ;

                this._manyLens.ManyLensHubRegisterClientFunction( this, "showVisMap", this.ShowVisMap );
                this._manyLens.ManyLensHubRegisterClientFunction(this,"updateVisMap",this.UpdateVisMap);
            }

            private init(){
                this._element.on("dblclick",null);


                this._element
                    .on( "mousedown",() => {
                        if(d3.event.button) d3.event.stopImmediatePropagation();
                        if ( this._classifier_context_menu ) {
                            this._classifier_context_menu.remove();
                            this._classifier_context_menu = null;
                        }
                    })
                ;

                //this._element
                //      .call( this._zoom )
                //      .on("dblclick.zoom", null);
            
            }

            public Toggle(){
                if(this._state){
                    this.RemoveMap();
                }else{
                    this.init();
                    this.Render();
                }
                this._state = !this._state;
            }

            public RemoveMap(){
                this._element.selectAll("*").remove();
                this._heatmap_container.innerHTML = "";
                this._left_offset = 0;
                this._heatMaps = [];
                this._maps = [];
            }

            public Render() {
                //this._lensPane.Render();
            }

            public AddBrush(){

                this._element
                    .style("cursor","pointer")
                    .on("click",()=>{
                        var p = d3.mouse(document.body);
                        console.log(p[0],p[1]);
                        var data = d3.select(document.elementFromPoint(p[0],p[1])).data();
                        if(data && data.length > 0 && data[0]){
                            var mapID = data[0].mapID;
                            var map = d3.select("#mapSvg"+mapID);

   
                            if(map){

                                var mapData:{mapID:string;width:number;height:number;leftOffset:number;topOffset:number} = map.data()[0];

                                if(this._brush_svg){
                                    this._brush.clear();
                                    this._brush_svg.remove();
                                }
                                this._brush.x(d3.scale.identity().domain([mapData.leftOffset, mapData.width * this._unit_width + mapData.leftOffset]))
                                           .y(d3.scale.identity().domain([mapData.topOffset,mapData.height * this._unit_height + mapData.topOffset]));

                                this._brush_svg =  map.append("g")
                                    .attr("class","brush")
                                    .on("contextmenu",()=>{
                                        this._brush.clear();
                                        this._brush_svg.remove();
                                        d3.event.preventDefault();
                                    })
                                    .call(this._brush);
                            }
                        }
                        this._element.style("cursor","default")
                            .on("click",null);
                    })
                ;

            }

            private ContextMenu(preMapID) {
                var p = d3.mouse( this._element.node() );
                if ( !this._classifier_context_menu ) {

                    var contextWidth: number = 200;

                    this._classifier_context_menu = this._element.append( "g" )
                        .attr( "id", "som-map-context-menu" )
                        .attr( "transform", "translate(" + [p[0], p[1]] + ")" )
                    ;

                    this._classifier_context_menu.append( "rect" )
                        .attr( {
                            id:"context-menu-base",
                            width: contextWidth
                        })
                        .attr("height",()=>{
                            if(this._manyLens.CurrentClassifierMapID)
                                return 150;
                            return 50;
                        })
                    ;

                    // filters go in defs element
                    var defs = this._classifier_context_menu.append( "defs" );
                    // create filter with id #drop-shadow
                    // height=130% so that the shadow is not clipped
                    var filter = defs.append( "filter" )
                        .attr( {
                            "id": "drop-shadow" ,
                            "height": "130%" 
                        });

                    // SourceAlpha refers to opacity of graphic that this filter will be applied to
                    // convolve that with a Gaussian with standard deviation 3 and store result
                    // in blur
                    filter.append( "feGaussianBlur" )
                        .attr( {
                            "in":"SourceAlpha", 
                            "stdDeviation":2 ,
                            "result": "blur" 
                        });

                    // translate output of Gaussian blur to the right and downwards with 2px
                    // store result in offsetBlur
                    filter.append( "feOffset" )
                        .attr( {"in": "blur" ,
                                 "dx": 1 ,
                                 "dy": 1 ,
                                "result": "offsetBlur"
                        });

                    // overlay original SourceGraphic over translated blurred opacity by using
                    // feMerge filter. Order of specifying inputs is important!
                    var feMerge = filter.append( "feMerge" );

                    feMerge.append( "feMergeNode" )
                        .attr( "in", "offsetBlur" )
                    feMerge.append( "feMergeNode" )
                        .attr( "in", "SourceGraphic" );

                    var option = [
                                    {mapID:preMapID,text:"Set this map as classifier"},
                                    {mapID:this._manyLens.CurrentClassifierMapID,text:"Current classifier: "},
                                    {mapID:this._manyLens.CurrentClassifierMapID,text:"Remove classifier"}
                                ];

                    var optionG = this._classifier_context_menu.selectAll(".context-menu-option")
                        .data(option.filter(function(d){ return d.mapID != null;}))
                        .enter().append("g")
                        .attr("class","context-menu-option")
                        .attr("transform",function(d,i){
                            if(i == 2)
                                return "translate(10,"+(i*50+10)+")";
                            return "translate(10,"+(i*40+10)+")";
                        })
                    ;

                    var textHeight;
                    this._classifier_context_menu.append("text").text("text")
                        .attr("x",function(d){
                            var box = this.getBBox();
                            textHeight = box.height;
                        })
                        .remove();

                    optionG.append( "text" )
                        .html(function(d){
                            if(d.text[0] == "C"){
                                return   '<tspan>Current classifier:</tspan><tspan x="40" dy='+textHeight+'>'+d.mapID+'</tspan>';
                            }
                            return d.text;
                        })
                        .attr( "y", textHeight);

                    optionG.insert("rect",".context-menu-option text")
                        .attr("width",contextWidth - 20)
                        .attr("height",function(d,i) {
                            if(i == 1)
                                return 2*(textHeight + 6);
                            return textHeight+6;
                        })
                        .on("mousedown",function(){ d3.event.stopPropagation();})
                        .on("click",(d,i)=>{
                            
                            switch(i){
                                case 0: {
                                    this._manyLens.CurrentClassifierMapID = d.mapID;
                                    if(this._hightlight_classifier_arrow) this._hightlight_classifier_arrow.remove();

                              
                                    this._hightlight_classifier_arrow = d3.select("#mapSvg"+d.mapID)
                                        .append("path")
                                        .attr({
                                            id:"hightlight-arrow-line",
                                            "class":"highlight-arrow"
                                        })
                                        .attr("d",(d)=>{
                                            return 'M'+(-50+d.leftOffset+d.width * this._unit_width*0.5)+',-10L'+(d.leftOffset+d.width*this._unit_width*0.5)+',70';
                                        })
                                    ;
                                }
                                    break;
                                case 1:{
                                
                                }
                                    break;
                                case 2:{
                                    this._manyLens.CurrentClassifierMapID = null;
                                    if(this._hightlight_classifier_arrow) this._hightlight_classifier_arrow.remove();
                                }
                                    break;
                            }
                            
                            
                            this._classifier_context_menu.remove();
                            this._classifier_context_menu = null;
                        })
                    ;

                    this._classifier_context_menu.append( "line" )
                        .attr( {
                            x1: 10,
                            x2: 180,
                            y1: 40,
                            y2:40
                        })
                    ;
                }

                this._classifier_context_menu.attr( "transform", "translate(" + [p[0], p[1]] + ")" );
            }

            public UpdateVisMap(index:number,visData:MapData):void{
                this._brush.clear();
                this._brush_svg.remove();
                this._maps[index] = visData;
                this._heatMaps[index].UpdateNodeArray(this._unit_width,this._unit_height,visData.unitsData);
                this._heatMaps[index].transform( this._scale, 0, 0 );
                this._heatMaps[index].transformPan( this._translate_x, this._translate_y, this._scale );

                var mapData = d3.select("#mapSvg"+visData.mapID).data()[0];
                var units = d3.select("#mapSvg"+visData.mapID).selectAll("rect.unit")
                .data(visData.unitsData,function(d){return d.unitID;});
                
                units.exit().remove();
                units.enter().append("rect")
                    .attr( "x",( d ) => { return mapData.leftOffset + d.x * this._unit_width; })
                    .attr( "y",( d ) => { return mapData.topOffset + d.y * this._unit_height; })
                    .attr( {
                        "class":"unit",
                        width: this._unit_width,
                        height: this._unit_height
                    })
                ;

                var labels = d3.selectAll("#mapSvg"+visData.mapID).selectAll("text.map.label").remove();
                var fontSizeScale = d3.scale.pow().domain(d3.extent(visData.labels,function(d){return d.value;})).range([10,30]);
                d3.selectAll("#mapSvg"+visData.mapID).selectAll("text.map.label")
                    .data(visData.labels,function(d){return d.x + "-"+d.y;})
                    .enter().append("text")
                    .attr("x",(d)=>{return mapData.leftOffset+  d.x * this._unit_width;})
                    .attr("y",(d)=>{return mapData.topOffset  + d.y * this._unit_height;})
                    .attr("dy",(d)=>{return this._unit_width})
                    .attr({
                        "class":"map label"
                    })
                    .style("font-size",(d)=>{
                        return fontSizeScale(d.value)+"px";
                    })
                    .text(function(d){return d.label;})
                ;
            }

            public ShowVisMap( visData: MapData, classifierID:string ): void {
                this._maps.push( visData );
                this._mapIDs.push(visData.mapID);
                this._top_offset = this._top_offset || ( parseFloat( this._element.style( "height" ) ) - visData.height * this._unit_height ) / 2;

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
                    .data( [{ mapID: visData.mapID, width: visData.width, height: visData.height,leftOffset:this._left_offset,topOffset:this._top_offset }] )
                    .attr( "id", function ( d ) { return "mapSvg" + d.mapID; })
                    .attr( "class", "som-map" )
                    .attr( "transform", "translate(" + [this._translate_x, this._translate_y] + ")scale(" + this._scale + ")" )
                    ;

                svg.selectAll( "rect.unit" )
                    .data( visData.unitsData, function(d){return d.unitID;})
                    .enter().append( "rect" )
                    .attr( "x",( d ) => { return this._left_offset + d.x * this._unit_width; })
                    .attr( "y",( d ) => { return this._top_offset + d.y * this._unit_height; })
                    .attr( {
                        "class":"unit",
                        width: this._unit_width,
                        height: this._unit_height
                    })
                    ;

                var fontSizeScale = d3.scale.sqrt()
                    .domain(d3.extent(visData.labels,function(d){return d.value;}))
                    .range([10,30]);

                //THIS IS the Spam mark
                //console.log(visData.unitsData.filter(function(d:UnitData){ return d.isSpam;}));
                //svg.selectAll("text.map.spam")
                //    .data(visData.unitsData.filter(function(d:UnitData){ return d.isSpam;}), function(d){return d.unitID;})
                //    .enter().append("text")
                //    .attr("x",(d)=>{return this._left_offset + d.x * this._unit_width;})
                //    .attr("y",(d)=>{return this._top_offset + d.y*this._unit_height;})
                //    .attr("dy",(d)=>{return this._unit_width})
                //    .attr({
                //        "class":"map spam"
                //    })
                //    .style("font-size",(d)=>{
                //        return fontSizeScale(d.value)+"px";
                //    })
                //    .text(function(d){return "spam";})
                //;

                svg.selectAll("text.map.label")
                    .data(visData.labels,function(d){return d.x + "-"+d.y;})
                    .enter().append("text")
                    .attr("x",(d)=>{return this._left_offset + d.x * this._unit_width;})
                    .attr("y",(d)=>{return this._top_offset + d.y * this._unit_height;})
                    .attr("dy",(d)=>{return this._unit_width})
                    .attr("class","map label")
                    .style("font-size",(d)=>{
                        return fontSizeScale(d.value)+"px";
                    })
                    .text(function(d){return d.label;})
                ;
                console.log(visData);

                //Add the hightlight and contextmenu layout
                var line = d3.svg.line()
                    .x( function ( d ) { return d.x ; })
                    .y( function ( d ) { return d.y; }) 
                    .interpolate("linear-closed")
                ;
                svg.append( "path" )
                    .data(
                        [{
                            mapID:visData.mapID,
                            path: [
                                { x: this._left_offset, y: this._top_offset },
                                { x: this._left_offset, y: this._top_offset + this._unit_height * visData.height },
                                { x: this._left_offset + this._unit_width * visData.width, y: this._top_offset + this._unit_height * visData.height },
                                { x: this._left_offset + this._unit_width * visData.width, y: this._top_offset }
                            ]
                        }]
                    )
                    .attr( "d", function(d){ return line(d.path);} )
                    .attr("class","control-layout")
                    .on( "contextmenu",(d) => {
                        this.ContextMenu(d.mapID);
                        d3.event.preventDefault();
                    })
                ;

                //Whether to add the connection link
                if(classifierID){
                    console.log(classifierID);
                    var classifierMap:{mapID:string;width:number;height:number;leftOffset:number;topOffset:number} = d3.select("#mapSvg"+classifierID).data()[0];

                    //var linkArrow = svg.append("g").attr("class","classifier-link");
                    //var defs = linkArrow.append('svg:defs');
                    //                // define arrow markers for leading arrow
                    //                defs.append('svg:marker')
                    //                    .attr({
                    //                        'id': 'classifier-mark-end-arrow',
                    //                        'viewBox': '0 -5 10 10',
                    //                        'refX': 7,
                    //                        'markerWidth': 3.5,
                    //                        'markerHeight': 3.5,
                    //                        'orient': 'auto'
                    //                    })
                    //                    .append('path')
                    //                    .attr({
                    //                        'd':'M0,-5L10,0L0,5z'
                    //                    })
                    //                ;

                    var scale = d3.scale.linear().domain([classifierMap.width * this._unit_width, classifierMap.width * this._unit_width * 7]).range([0, - classifierMap.topOffset*6]);
                    var gapWidth = 0.5*(this._left_offset + classifierMap.leftOffset + (visData.width+classifierMap.width)*this._unit_width * 0.5);
                    svg.append("path") 
                        .attr("class","classifier-link")
                        .datum([
                            [classifierMap.leftOffset + classifierMap.width * this._unit_width * 0.5, classifierMap.topOffset],
                            [gapWidth,scale(gapWidth)],
                            [this._left_offset + visData.width * this._unit_width * 0.5, classifierMap.topOffset - 10]
                        ])
                        .attr("d",d3.svg.line().interpolate("basis"))
                        //.attr("id","testLink")
                    ;
                }

                //whether to move or not
                this._left_offset += this._unit_width * visData.width + this._map_gap;
                var leftMost = this._left_offset * this._scale + this._translate_x;
                if ( leftMost > this._total_width ) {
                    var t = d3.interpolate( 0, leftMost - this._total_width + this._map_gap );
                    var i = 0;
                    var sTx = this._translate_x;
                    clearInterval( this._move_view_timer );
                    this._move_view_timer = setInterval(() => {
                        this._translate_x = sTx - t( i / 100 )
                        this._heatMaps.forEach(( d ) => {
                            d.transformPan( this._translate_x, this._translate_y, this._scale );
                        });
                        this._element.selectAll( ".som-map" )
                            .attr( "transform", "translate(" + [this._translate_x, this._translate_y] + ")scale(" + this._scale + ")" );
                        this._element.selectAll( ".lens" )
                            .attr( "transform",  ( d )=> {
                                if ( d.cx == 0 ) {
                                    d.cx = this._translate_x;
                                    d.cy = this._translate_y;
                                }
                                d.scale = this._scale;
                                d.tx = this._translate_x - d.cx * d.scale;
                                d.ty = this._translate_y - d.cy * d.scale;
                                
                                return "translate(" + [d.tx, d.ty] + ")scale(" + this._scale + ")"
                            });

                        this._zoom
                            .scale( this._scale )
                            .translate( [this._translate_x, this._translate_y] );
                        this._element.call( this._zoom );
                        ++i;
                        if ( i >= 100 ) {
                            clearInterval( this._move_view_timer );
                            this._move_view_timer = -1;
                        }
                    }, 2 );
                    
                }
            }

        }
    }

} 