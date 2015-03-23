﻿///<reference path = "../../Scripts/typings/topojson/topojson.d.ts" />s 
module ManyLens{
    export module MapArea{

        interface Country{
            type:string;
            id:string;
            properties?:{};
        }

        export class WorldMap extends D3ChartObject{
            private _map:D3.Selection;

            private _total_width:number;
            private _total_height:number;
            private _center_xy:number[];

            private _projection:D3.Geo.Projection = d3.geo.equirectangular();
            private _path:D3.Geo.Path = d3.geo.path();

            private _world_topojson_path:string = "./testData/countriesAlpha2.topo.json";
            private _world_topojson_data;

            private _target_country:Country;

            private _zoom:D3.Behavior.Zoom = d3.behavior.zoom();
            private _scale:number;

            constructor(element:D3.Selection,manyLens:ManyLens){
                super(element,manyLens);
                this._element.attr( "height", function () {
                    return this.parentNode.clientHeight - this.offsetTop + 20;
                });
                this._total_width = parseFloat( this._element.style( "width" ));
                this._total_height = parseFloat(this._element.style("height"));

                this._projection
                    .scale(1)
                    .rotate([80,0])
                    .translate([0,0])
                ;
                this._path
                    .projection(this._projection)
                ;

                this._zoom
                    .scaleExtent([1,3])

                    .on("zoomstart",()=>{
                        //d3.event.sourceEvent.stopPropagation();
                    })
                    .on("zoom",()=>{
                        this.Zoom(d3.event.translate,d3.event.scale);
                    })
                    .on("zoomend",()=>{
                        //d3.event.sourceEvent.stopPropagation();
                    })
                ;
                
                this._element
                    .on("dblclick",(d:Country)=>{
                        this.Country_Clicked(d);
                    })
                    .call(this._zoom)
                    .on("dblclick.zoom", null);
            }


            public Render(){
                if(this._world_topojson_data){
                        // Compute the bounds of a feature of interest, then derive scale & translate.
                        var bounds = this._path.bounds(this._world_topojson_data);
                        var s = 0.99 / Math.max((bounds[1][0] - bounds[0][0]) / this._total_width, (bounds[1][1] - bounds[0][1]) / (this._total_height));
                        this._center_xy = [(this._total_width - s * (bounds[1][0] + bounds[0][0])) / 2, (this._total_height - s * (bounds[1][1] + bounds[0][1])) / 2];

                        this._projection
                            .scale(s)
                            .translate(this._center_xy);
 
                        
                        this._map =  this._element.append("g")
                            .attr("id","world-countries")
                            .selectAll("path")
                            .data(this._world_topojson_data.features,function(d){return d.id;})
                            .enter()
                            .append("path")
                            .attr("id",function(d:Country){return d.id;})
                            .attr("d",this._path)
                            .on("dblclick",(d:Country)=>{
                                d3.event.stopPropagation();
                                this.Country_Clicked(d);
                            })
                           ;
                }else{
                    d3.json(this._world_topojson_path, (error,world)=>{
                        this._world_topojson_data = topojson.feature(world,world.objects.countries);

                        // Compute the bounds of a feature of interest, then derive scale & translate.
                        var bounds = this._path.bounds(this._world_topojson_data);
                        var s = 0.96 / Math.max((bounds[1][0] - bounds[0][0]) / this._total_width, (bounds[1][1] - bounds[0][1]) / (this._total_height));
                        this._center_xy = [(this._total_width - s * (bounds[1][0] + bounds[0][0])) / 2, (this._total_height - s * (bounds[1][1] + bounds[0][1])) / 2];

                        this._projection
                            .scale(s)
                            .translate(this._center_xy);

                        this._map =  this._element.append("g")
                            .attr("id","world-countries");

                        this._map.selectAll("path")
                            .data(this._world_topojson_data.features,function(d){return d.id;})
                            .enter()
                            .append("path")
                            .attr("id",function(d:Country){return d.id;})
                            .attr("d",this._path)
                            .on("dblclick",(d:Country)=>{
                                d3.event.stopPropagation();
                                this.Country_Clicked(d);
                            })
                        ;
                    
                        //this._element.append("path")
                        //    .datum(topojson.mesh(world,world.objects.countries,function(a,b){
                        //        return a!== b;
                        //    }))
                        //    .attr("id","countries-borders")
                        //    .attr("d",this._path)
                        //;
                    });
                }
            }

            private Country_Clicked(d:Country){
                //if(this._target_country){
                //    this._map.selectAll("#"+this._target_country.id).style("display",null);
                //}

                if(d && this._target_country !== d){
                    var xyz = this.Get_XYZ(d);
                    this._target_country = d;
                    
                    console.log("d and different country");
                    this.Click_Zoom(xyz);
                }else{
                    this._target_country = null;
                    this.Click_Zoom([this._center_xy[0],this._center_xy[1],1]);
                }
            
            }

            private Get_XYZ(d):number[]{
                  var bounds = this._path.bounds(d);
                  var w_scale = (bounds[1][0] - bounds[0][0]) / this._total_width;
                  var h_scale = (bounds[1][1] - bounds[0][1]) / this._total_height;
                  var z = .96 / Math.max(w_scale, h_scale);
                  var x = (bounds[1][0] + bounds[0][0]) / 2;
                  var y = (bounds[1][1] + bounds[0][1]) / 2 + (this._total_height / z / 6);
                  return [x, y, z];
            }

            private Click_Zoom(xyz:number[]){
                this._map.transition().duration(500)
                    .attr("transform","translate("+this._projection.translate()+")scale(" +xyz[2] + ")translate(-" + xyz[0]+",-"+xyz[1]+")")
                    .style("stroke-width",1.0/xyz[2] + "px")
                ;

                this._zoom
                    .translate([
                        -xyz[0] * xyz[2]+this._projection.translate()[0],
                        -xyz[1] * xyz[2]+this._projection.translate()[1]
                        ])
                    .scale(xyz[2]);

                this._element
                    .call(this._zoom)
                    .on("dblclick.zoom", null);
                ;
                this._scale = xyz[2];
            }

            private Zoom(translate:number[],scale:number){
                if(d3.event.sourceEvent.type == "wheel"){
                    //if(d3.event.scale > this._scale){
                    //    this._zoom
                    //        .center(null);
                    //}else{
                    //    this._zoom
                    //        .center(this._center_xy);
                    //}

                    //this._element
                    //    .call(this._zoom)
                    //    .on("dblclick.zoom", null);
                    //;

                    this._map
                        .attr("transform","translate("+translate+")scale("+scale+")")
                        .style("stroke-width",1.0/scale + "px")
                    ;

                    this._scale = scale;
                }else if(d3.event.sourceEvent.type == "mousemove"){
                    this._projection.rotate([translate[0]+80]);

                     this._map.selectAll("path")
                         .data(this._world_topojson_data.features,function(d){return d.id;})
                            .attr("d",this._path)
                    ;
                    
                //    this._zoom.translate([
                //            0,0
                //        ]);
                //     this._element
                //    .call(this._zoom)
                //    .on("dblclick.zoom", null);
                //;
                }


            }

        }
    }
 
 }