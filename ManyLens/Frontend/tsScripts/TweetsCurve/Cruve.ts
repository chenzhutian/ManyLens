///<reference path = "../D3ChartObject.ts" />

module ManyLens {

    export module TweetsCurve {

        interface Feature{ x?: number, y?: number, feature_type: string, feature_value: number; }


        interface Point {
            value: number;
            isPeak: boolean;
            id: string;
            type: number;
            features: Array<Feature>;
            beg: string;
            end: string;
        }


        interface Section {
            beg: number;
            end: number;
            id: string;
            features: Array<Feature>;
            fs: Array<any>;
            pathPoints: [{
                index: number;
                value: number;
            }];
        }

        interface StackNode {
            id: string;
            type: string;
            name: string;
            parent: StackNode;
            oy?: number;
            children: StackNode[];
            x?: number;
            y?: number;
            index?: number;
            size?: number;
            date?: Date;
        }

        export class Curve extends D3ChartObject {

            private _curveSvg: D3.Selection;
            private _mainView: D3.Selection;
            private _subView: D3.Selection;

            private _x_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _x_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _x_axis: D3.Selection;
            private _y_scale: D3.Scale.LogScale = d3.scale.linear();
            private _y_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _y_axis: D3.Selection;
            private _fisheye_scale: D3.FishEyeOrdinalScale = d3.fisheye.ordinal();

            private _sub_view_width: number;
            private _sub_view_height: number;

            private _section_num: number = 50;
            private _view_height: number;
            private _view_width: number;
            private _view_padding: { top: number, bottom: number, left: number, right: number } = { top: 15, bottom: 25, left: 50, right: 50 };
            private _coordinate_margin_left: number = 1000;

            protected _data: Array<Point>;
            private _section_data: Object;

            private _time_formater: D3.Time.TimeFormat;
            private _stack_time_id_gen: number = 0;

            private _root: {};
            private _stack_bar_nodes_data: StackNode[];
            private _stack_bar_tree: D3.Layout.TreeLayout;
            private _stack_bar_tree_diagonal: D3.Svg.Diagonal;
            private _stack_bar_node: D3.UpdateSelection;
            private _stack_bar_link: D3.UpdateSelection;
            private week_days_name: string[] = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fir.", "Sat."];
            private month_names: string[] = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

            private _voronoi_bound: D3.Geom.Polygon = null;
            private _voronoi: D3.Geom.Voronoi<any> = null;
            private _voronoi_color: D3.Scale.OrdinalScale = null;
            private _voronoi_scale: number = null;
            private _voronoi_color_scale:Object = null;


            private _hack_entropy_for_sec = [5.731770623, 5.673758762, 5.708904568, 5.766106615, 5.271328797, 5.50350013, 5.650689424, 5.059556767, 5.150092845, 5.332915993, 5.538583789, 5.56513213, 5.618589058, 5.568604372, 5.601558072, 5.603160895, 5.552198033, 5.563398957, 5.545638613, 5.585914854, 5.541078274, 5.581189853, 5.610692756, 5.561532863, 5.662572096, 5.577863947, 5.697510354, 5.703647393, 5.578761725, 5.604709918, 5.443579203, 5.498566777, 5.692988236, 5.449706032, 5.316306331, 5.69077723, 5.830264994, 5.849802422, 5.764716822, 5.920337608, 5.854107674, 5.914982887, 5.872175529, 5.795052474, 5.590677484, 5.49128005, 5.611246233, 5.861593865, 5.760362888, 5.763031867, 5.715574693, 5.904532304, 6.024492893, 5.971005731, 5.410844221, 5.700768429, 5.788494599];
            private _hack_entropy_for_minute = [5.439728938, 5.329790773, 5.586664525, 5.615747057, 5.639277057, 5.653881221, 5.497658424];
            //Day is for ebola
            private _hack_entropy_for_day = [6.078795108, 5.841434121, 5.939489652, 5.938061597, 5.856967809, 5.831608227, 5.93391885, 5.993377279, 5.830555653, 5.802729553, 6.076953322, 5.894862096, 5.779206615, 5.969579388, 5.710407662];
            private _hack_entropy_for_day_fullyear =
            [5.991439819, 5.851983278, 5.948156068, 5.436286372, 5.291194338, 5.483132322, 5.335564514, 5.890816733, 6.296046929, 5.776935794, 6.178819818, 5.823461866, 6.276945033, 5.383821592, 5.780546756, 5.504823674, 5.459557571, 5.290890409, 5.711883642, 5.941650018, 5.931193478, 5.852722028, 5.823861489, 5.917398009, 5.975238027, 5.842076197, 5.8002751, 6.081009165, 5.892996018, 5.753263639, 5.879791592];
            private _hack_selected_entropy:Array<number>;

            public get Section_Num(): number {
                return this._section_num;
            }
            public set Section_Num( num: number ) {
                if ( typeof num === 'number' ) {
                    this._section_num = Math.ceil( num );
                }
            }
            public get StackID(): string {
                return "id" + this._stack_time_id_gen++;
            }

            constructor( element: D3.Selection, manyLens: ManyLens ) {
                super( element, manyLens );

                this._data = new Array<Point>();
                this._section_data = {};
                this._stack_bar_nodes_data = new Array<StackNode>();

                this._view_height = parseFloat( this._element.style( "height" ) ) - 30;
                this._view_width = parseFloat( this._element.style( "width" ) );

                this._sub_view_height = this._view_height - this._view_padding.bottom;
                this._sub_view_width = this._coordinate_margin_left + this._view_padding.left;

                this._x_scale
                    .domain( [0, this._section_num] )
                    .range( [this._view_padding.left + this._coordinate_margin_left, this._view_width - this._view_padding.right] )
                    ;
                this._y_scale
                    .domain( [0, 10000] )
                    .range( [this._view_height - this._view_padding.bottom, this._view_padding.top] )
                    ;
                this._x_axis_gen
                    .scale( d3.time.scale()
                        .domain( [0, this._section_num] )
                        .range( [this._view_padding.left + this._coordinate_margin_left, this._view_width - this._view_padding.right] )
                    )
                    .ticks( 0 )
                    .orient( "bottom" )
                    ;
                this._y_axis_gen
                    .scale( this._y_scale )
                    .ticks( 5 )
                    .orient( "left" )
                    ;

                this._fisheye_scale
                    .rangeRoundBands( [0, this._sub_view_width] )
                    .focus( this._coordinate_margin_left + this._view_padding.left )
                    ;

                this._voronoi = d3.geom.voronoi()
                    .x( function ( d ) { return d['x']; })
                    .y( function ( d ) { return d['y']; });
                this._voronoi_color = d3.scale.category10();
                    
                //    d3.scale.ordinal()
                //    .range(['#c5b0d5','#ffbb78','#98df8a','#ff9896'])
                //    .domain(['follower','following','tweetLength','hastagCount'])
                //;

                this._voronoi_scale = this._coordinate_margin_left / 1500;
                this._voronoi_color_scale = {};


                this._time_formater = d3.time.format( "%Y%m%d%H%M%S" );

                this._root = {
                    id: "root",
                    name: "",
                    type: "null",
                    date: null,
                    parent: null,
                    children: []
                }

                this._stack_bar_tree = d3.layout.tree()
                    .size( [this._sub_view_width - 50, this._sub_view_height - 0] )
                    //.nodeSize([10,10])
                    .separation( function ( a, b ) {
                        if ( a.parent == b.parent ) {
                            if ( a.children && b._children )
                                return 2.5 / ( ( a.depth + 1 ) * ( a.depth + 1 ) );
                        }
                        return 1 / ( ( a.depth + 1 ) * ( a.depth + 1 ) );
                    })
                    ;
                this._stack_bar_tree_diagonal = d3.svg.diagonal();

                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction( this, "addPoint", this.AddPoint );
                this._manyLens.ManyLensHubRegisterClientFunction( this, "print", ( msg ) => {
                    console.log( msg );
                });
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "clusterInterval", this.ClusterInterval );
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "timeInterval", this.TimeInterval );
            }

            public Render(): void {
                super.Render( null );
                var coordinate_view_width = this._view_width - this._view_padding.left - this._view_padding.right;
                this._element.select( ".progress" ).style( "display", "none" );

                this._curveSvg = this._element.insert( "svg", ".progress" )
                    .attr( "width", this._view_width )
                    .attr( "height", this._view_height )
                    .style( "margin-bottom", "17px" )
                    ;

                this._subView = this._curveSvg.append( "g" )
                    .attr( "clip-path", "url(#stackRectClip)" )
                    .append( "g" )
                    .attr( "id", "curve-subView" )
                    .attr( "transform", "translate(0,-30)" )
                    ;

                this._curveSvg.append( "defs" ).append( "clipPath" )
                    .attr( "id", "curveClip" )
                    .append( "rect" )
                    .attr( "width", coordinate_view_width )
                    .attr( "height", this._view_height + this._view_padding.bottom + this._view_padding.top )
                    .attr( "x", this._view_padding.left + this._coordinate_margin_left )
                    .attr( "y", 0 )
                    ;

                this._mainView = this._curveSvg.append( "g" )
                    .attr( "clip-path", "url(#curveClip)" )
                    .append( "g" )
                    .attr( "id", "curve-mainView" )
                    ;

                this._x_axis = this._curveSvg.append( "g" )
                    .attr( "class", "curve x axis" )
                    .attr( "transform", "translate(" + [0, ( this._view_height - this._view_padding.bottom )] + ")" )
                    .call( this._x_axis_gen )
                    ;

                this._y_axis = this._curveSvg.append( "g" )
                    .attr( "class", "curve y axis" )
                    .attr( "transform", "translate(" + ( this._coordinate_margin_left + this._view_padding.left ) + ",0)" )
                    .call( this._y_axis_gen )
                    ;

            }

            public PullInterval( interalID: string, classifierID?: string ): void {
                if ( ManyLens.TestMode )
                    this._manyLens.ManyLensHubServerTestPullInterval( interalID );
                else {
                    this._manyLens.ManyLensHubServerPullInterval( interalID, classifierID )
                        .progress(( percent ) => {
                            this._element.select( ".progress-bar" )
                                .style( "width", percent * 100 + "%" )
                                ;
                        })
                        .done(() => {
                            this._element.select( ".progress-bar" )
                                .style( "width", 0 )
                                ;
                            this._element.select( ".progress" ).style( "display", "none" );
                            this._curveSvg.style( "margin-bottom", "17px" )
                        });
                }
            }

            public AddPoint( point: Point ): void {
                this._data.push( point );
                this.RefreshGraph( point );
                if ( this._data.length > this._section_num + 1 ) {
                    this._data.shift();
                }
            }

            private InserNode( name: string, data?: StackNode ): StackNode {
                var node: StackNode = this._root[name], i;
                if ( !node ) {
                    node = this._root[name] = data || {
                        id: this.StackID,
                        date: null,
                        name: "",
                        parent: null,
                        children: [],
                        type: name
                    }
                    if ( name.length ) {
                        node.parent = this.InserNode( name.substring( 0, i = name.lastIndexOf( "-" ) ) );
                        node.parent.children.push( node );
                        node.name = name.substring( i + 1 );
                    }
                }
                return node;
            }

            private Toggle( node ) {
                if ( node == null ) return;
                if ( node.children ) {
                    node._children = node.children;
                    node.children = null;
                } else {
                    node.children = node._children;
                    node._children = null;
                }
            }

            private FindMinCoParent( a: StackNode, b: StackNode ) {
                if ( !a || !b ) return null;
                if ( !a.parent || !b.parent ) return null;
                if ( a.parent.id == b.parent.id ) {
                    if ( !a.date ) return a;
                    else return null;
                }
                return this.FindMinCoParent( a.parent, b.parent );
            }

            private SumEntropy( node ) {
                if ( !node ) return 0;
                if ( !node.children && !node._children ) return this._hack_selected_entropy[node.index];
                var sum = 0;
                if ( node.children )
                    node.children.forEach(( d ) => {
                        sum += this.SumEntropy( d );
                    });
                else if ( node._children )
                    node._children.forEach(( d ) => {
                        sum += this.SumEntropy( d );
                    });
                return sum;
            }

            private CalVoronoi( fs: Array<Feature>, constR ) {
                var self = this;
                var _fs:Object = {};
                if(!fs[0].x){
                    //init seed position
                    var step = 2 * Math.PI / fs.length;
                    for ( var i = 0; i < fs.length; ++i ) {
                        var angle = step * i;
                        var r = Math.random() * constR * 0.8;
                        fs[i].x = r * Math.cos( angle );
                        fs[i].y = r * Math.sin( angle );
                        var t = fs[i].feature_type;
                        if ( !_fs[t] ) {
                            _fs[t] = -Infinity;
                        }
                        _fs[t] = d3.max( [_fs[t], fs[i].feature_value] );
                    }
                }else{
                    for(var i = 0; i < fs.length; ++i){
                        var t = fs[i].feature_type;
                        if ( !_fs[t] ) {
                            _fs[t] = -Infinity;
                        }
                        _fs[t] = d3.max( [_fs[t], fs[i].feature_value] );
                    }
                }

                //extend the scale or not
                for(var p in _fs){
                    if(_fs.hasOwnProperty(p)){
                        if(this._voronoi_color_scale[p]){
                            if(_fs[p] > this._voronoi_color_scale[p]){
                                console.log("extend the scale");
                                console.log("_fs["+p+"]:"+_fs[p]+","+"color_scale["+p+"]:"+this._voronoi_color_scale[p]);
                                this._voronoi_color_scale[p] = _fs[p];    
                                this._subView.selectAll('g.cell path')
                                    .style( "fill-opacity", function ( d:Feature ) {
                                        return  Math.sqrt( d.feature_value)/Math.sqrt(self._voronoi_color_scale[d.feature_type]);
                                    })
                                ;
                            }
                        }else{
                            console.log("init the scale");
                            this._voronoi_color_scale[p] = _fs[p];    
                        }
                    }
                }

                //for(var i = 0; i < fs.length; ++i){
                //    fs[i].feature_value_scale = fs[i].feature_value/this._voronoi_color_scale[fs[i].feature_type];
                //}

                var iteration = 0;
                var cnt = 0;
                while ( cnt < 5 ) {
                    var polygon:D3.Geom.Polygon[] = this._voronoi( fs );
                    var dist = 0;
                    for ( var i = 0; i < polygon.length; ++i ) {
                        //for each voronoi polygon, clip their boundary
                        var tempPolygon = this._voronoi_bound.clip( polygon[i] );
                        var centroid = d3.geom.polygon( tempPolygon ).centroid();
                        if ( !isNaN( centroid[0] ) && !isNaN( centroid[1] ) ) {
                            fs[i]['p'] = tempPolygon;
                            dist += ( fs[i]['x'] - centroid[0] ) * ( fs[i]['x'] - centroid[0] )
                                + ( fs[i]['y'] - centroid[1] ) * ( fs[i]['y'] - centroid[1] );
                            fs[i]['x'] = centroid[0];
                            fs[i]['y'] = centroid[1];
                        } else {
                            dist += 1000000;
                        }
                    }
                    dist /= polygon.length;
                    if ( dist <= constR * 0.05 ) {
                        cnt++;
                    } else {
                        cnt = 0;
                    }
                    iteration++;
                    if ( iteration > 10000 ) break;
                }

            }

            private UpdateSubviewTree( exitParent: StackNode, mode: boolean = true ) {
                var duration = 500;

                var self = this;
                
                switch ( this._manyLens.TimeSpan ) {
                    case 3: this._hack_selected_entropy = this._hack_entropy_for_sec; break;
                    case 2: this._hack_selected_entropy = this._hack_entropy_for_minute; break;
                    case 1: this._hack_selected_entropy = this._hack_entropy_for_day;break;
                    case 0: this._hack_selected_entropy = this._hack_entropy_for_day_fullyear;break;
                }
                var colorScale = d3.scale.linear().domain( d3.extent( this._hack_selected_entropy ) )
                    .range( ["#C5EFF7", "#34495E"] );

                var arcScale = d3.scale.linear().domain( d3.extent( this._hack_selected_entropy ) )
                    .range( [0, 1] );
                var constR = this._x_scale( 1 ) - this._x_scale( 0 );
                var arc = d3.svg.arc().innerRadius( constR + 2 ).outerRadius( constR + 4 ).startAngle( 0 );

                //Nodes
                var nodex = this._stack_bar_tree.nodes( this._root[""] ).filter( function ( d ) {
                    return d.name != "";//&& d.name != "day2";
                });

                this._stack_bar_node = this._subView.selectAll( ".stack.node" )
                    .data( nodex, function ( d ) { return d.id; });

                //Enter node
                var enterNode = this._stack_bar_node
                    .enter().append( "g" )
                    .attr( "class", "stack node" )
                    .attr( "transform", ( d ) => {
                        if ( d.date && mode )
                            return "translate(" + [this._sub_view_width, d.oy] + ")";
                        return "translate(" + [d.parent.x, d.parent.y] + ")";
                    })
                    ;

                enterNode.filter( function ( d ) { return d.parent; })
                    .on( "click", ( d ) => {
                        this.Toggle( d );
                        this.UpdateSubviewTree( d, false );
                    })
                    .transition().duration( duration )
                    .attr( "transform", ( d ) => {
                        return "translate(" + [d.x, d.y] + ")";
                    })
                    ;

                enterNode.filter( function ( d ) { return d.date; })
                    .each( function ( d ) {
                        this.appendChild( document.getElementById( "cells_group" + d.id ) );
                        var cellsGroup = d3.select( "#cells_group" + d.id )
                            .classed( "curve", false )
                            .style( "opacity", null )
                            .attr( "transform", null )
                            ;
                        cellsGroup.transition().duration( duration )
                            .attr( "transform", "scale(" + self._voronoi_scale + ")" )
                            ;
                        if(cellsGroup.select('.entropy-ring').empty()){
                            cellsGroup.append( 'path' )
                                .attr( 'class', 'entropy-ring' )
                                .attr( 'd', function () {
                                    arc.endAngle( 2 * Math.PI * arcScale( self.SumEntropy( d ) / sumLength( d ) ) );
                                    return arc( [0] );
                                })
                            ;
                        }

                    })
                    .on( "click", ( d ) => {
                        this.SelectSegment( d );
                    })
                ;

                enterNode.filter( function ( d ) { return !d.date; })
                    .append( 'circle' )
                    .attr( 'r', 7 )
                    .style( "fill", ( d ) => {
                        return colorScale( this.SumEntropy( d ) / sumLength( d ) );
                    })
                    ;

                enterNode.append( "text" )
                    .attr( "x", function ( d ) {
                        if ( d.date || ( d.name[0] == "d" && d._children ) )
                            return -15;
                        return 5;
                    })
                    .attr( "dy", function ( d ) {
                        if ( d.date || ( d.name[0] == "d" && d._children ) )
                            return "30";
                        return ".35em";
                    })
                    .attr( "text-anchor", function ( d ) { return "start"; })
                    .text(( d: StackNode ) => {
                        if ( d.name[0] == "y" ) {
                            return d.name.substring( 4 );
                        } else if ( d.name[0] == "m" ) {
                            return this.month_names[parseInt( d.name.substring( d.name.indexOf( "h" ) + 1 ) )];
                        } else if ( d.name[0] == "d" ) {
                            return d.name.substring( d.name.indexOf( "y" ) + 1 );//this.week_days_name[parseInt( d.name[d.name.length - 1] )];
                        } else if ( d.name[0] == "h" ) {
                            return d.name.substring( 4 ) + ":00";
                        } else if ( d.name[0] == "M" ) {
                            return d.name.substring( 3 );
                        }
                        return "Sub event";
                    })
                    .style( "fill-opacity", 1e-6 )
                    .transition().duration( duration )
                    .style( "fill-opacity", 1 );
                ;

                //Update node
                function sumLength( d ) {
                    if ( !d ) return 0;
                    if ( !d.children && !d._children ) return 1;
                    var sum = 0;
                    if ( d.children )
                        d.children.forEach(( d ) => {
                            sum += sumLength( d );
                        });
                    else if ( d._children )
                        d._children.forEach(( d ) => {
                            sum += sumLength( d );
                        });
                    return sum;
                }
                function getFeatures( d ) {
                    if ( !d ) return null;
                    if ( !d.children && !d._children ) {
                        return self._section_data[d.id].features;
                    }
                    var fs = [];
                    if ( d.children ) {
                        d.children.forEach(( d ) => {
                            fs.concat( getFeatures( d ) );
                        });
                    } else if ( d._children ) {
                        d._children.forEach(( d ) => {
                            fs = fs.concat( getFeatures( d ) );
                        });
                    }
                    return fs;
                }

                this._stack_bar_node
                    .transition().duration( duration )
                    .attr( "transform", function ( d ) {
                        return "translate(" + [d.x, d.y] + ")";
                    })
                ;

                this._stack_bar_node.selectAll( "circle" )
                    .filter( function ( d ) { return d.children || d._children; })
                    .transition().duration( duration )
                    .style( "fill", ( d ): any=> {
                        return d._children ? "#fff" : "#E87E04";
                    });

                this._stack_bar_node
                    .filter( function ( d ) { return d._children; })
                    .each( function ( d ) {
                        var voronoi = document.getElementById( 'cells_group' + d.id );
                        if ( !voronoi ) {
                            var fs = getFeatures( d );
                            self.CalVoronoi( fs, constR );
                            var tempVoronoi = self._subView.append( 'g' )
                                .attr( 'class', 'cells' )
                                .attr( 'id', 'cells_group' + d.id )
                                .style( 'opacity', 1e-6 )
                                .attr( "transform", function () {
                                    var scale = sumLength( d );
                                    return "scale(" + ( self._voronoi_scale * Math.sqrt( scale ) ) + ")";
                                })
                            ;

                            tempVoronoi.append( 'path' )
                                .attr( 'class', 'entropy-ring' )
                                .attr( 'd', function () {
                                    arc.endAngle( 2 * Math.PI * arcScale( self.SumEntropy( d ) / sumLength( d ) ) );
                                    return arc( [0] );
                                })
                            ;
                            tempVoronoi.selectAll( ".cell" )
                                .data( fs )
                                .enter().append( "g" )
                                .attr( "class", "cell" )
                                .append( "path" )
                                .attr( "d", ( d ) => {
                                    return "M" + d.p.join( "L" ) + "Z";
                                })
                                .style( "fill", function ( d, i ) {
                                    return self._voronoi_color( d.feature_type );
                                })
                                .style( "fill-opacity", function ( d:Feature ) {
                                    return Math.sqrt( d.feature_value)/Math.sqrt( self._voronoi_color_scale[d.feature_type]);
                                })
                                .style( "stroke", 'lightgrey' )
                                .style( "stroke-width", .3 )
                                .on( 'mouseout', function ( d ) {
                                    d3.select( this.parentNode.parentNode.parentNode  ).select( "#cell-tip" ).remove();
                                })
                                .on( 'mouseover', function ( d ) {
                                    var mouse = d3.mouse( this );
                                    d3.select( this.parentNode.parentNode.parentNode  )
                                        .append( 'text' )
                                        .attr( 'x', mouse[0] )
                                        .attr( 'y', mouse[1] )
                                        .attr( 'id', 'cell-tip' )
                                        .text( d.feature_type + ":" + d.feature_value )
                                        ;
                                })
                            ;
                            voronoi = <HTMLElement>tempVoronoi.node();
                        }
                        d3.select( voronoi ).transition().duration( 100 ).style( 'opacity', 1 );
                        this.appendChild( voronoi );
                    });

                this._stack_bar_node.filter( function ( d ) { return d.children; })
                    .each( function ( d ) {
                        var voronoi = document.getElementById( 'cells_group' + d.id );
                        if ( voronoi ) {
                            d3.select( voronoi )
                                .transition().duration( 100 )
                                .style( 'opacity', 1e-6 ).each( 'end', function ( d ) {
                                    self._subView.each( function () {
                                        this.appendChild( voronoi );
                                    });
                                });
                        }
                    })
                    ;

                this._stack_bar_node.selectAll( "text" )
                    .filter( function ( d ) { return d && (d.children || d._children); })
                    .transition()
                    .attr( "x", function ( d ): any {
                        return d._children ? -15 : 5;
                    })
                    .attr( "dy", function ( d ): any {
                        return d._children ? 20 : ".35em";
                    })
                    .style( "fill-opacity", 1 );
                ;

                //Exit node
                var exitNode = this._stack_bar_node.exit();
                exitNode
                    .transition().duration( duration )
                    .each( 'end', function ( d ) {
                        d3.select( "#curve-subView" ).each( function () {
                            this.appendChild( document.getElementById( "cells_group" + d.id ) );
                        });
                    })
                    .attr( "transform", function ( d ) {
                        if ( exitParent ) {
                            d.x = exitParent.x;
                            d.y = exitParent.y;
                        }
                        return "translate(" + [d.x, d.y] + ")";
                    })
                    .remove()
                    ;
                exitNode.selectAll( "g.cells" ).transition().style( 'opacity', 1e-6 );
                exitNode.select( "circle" ).transition().attr( "r", 1e-6 );
                exitNode.select( "text" ).transition().style( "fill-opacity", 1e-6 );

                //Links
                this._stack_bar_link = this._subView.selectAll( ".stack.link" )
                    .data( this._stack_bar_tree.links( nodex ), function ( d ) { return d.source.id + "-" + d.target.id; });
                //Enter link
                this._stack_bar_link
                    .enter().insert( "path", ".stack.node" )
                    .attr( "class", "stack link" )
                    .attr( "d", ( d ) => {
                        var o = { x: d.source.x, y: d.source.y };
                        var result = this._stack_bar_tree_diagonal( { source: o, target: o });
                        return result;
                    })
                    .transition().duration( duration )
                    .attr( "d", this._stack_bar_tree_diagonal );
                //Update link
                this._stack_bar_link
                    .transition().duration( duration )
                    .attr( "d", this._stack_bar_tree_diagonal );
                //Exit link
                this._stack_bar_link.exit()
                    .transition().duration( duration )
                    .attr( "d", ( d ) => {
                        if ( exitParent ) {
                            d.x = exitParent.x;
                            d.y = exitParent.y;
                        }
                        var o = { x: d.x, y: d.y };
                        return this._stack_bar_tree_diagonal( { source: o, target: o });
                    })
                    .remove();
            }

            private GetStackNodeType( date: Date ): string {
                var stackType: string = "";
                switch ( this._manyLens.TimeSpan ) {

                    case 3: stackType = "-s" + date.getSeconds();
                    case 2: stackType = "-Min" + date.getMinutes() + stackType;
                    case 1: stackType = "-hour" + date.getHours() + stackType;
                    case 0: stackType = "-day" + date.getDate() + stackType;
                }
                return "" + "-year" + date.getFullYear() + "-mounth" + date.getMonth() + stackType;
            }

            private RefreshGraph( point: Point ) {


                //Refresh the curve view
                this._y_scale.domain( [0, d3.max( this._data, function ( d ) { return d.value; })] );
                this._y_axis_gen.scale( this._y_scale );
                this._y_axis.call( this._y_axis_gen );

                var restPathData = [];
                var nodesData = [];
                var sectionData = new Array<Section>();

                var i = 0, len = this._data.length;
                while ( i < len ) {
                    if ( this._data[i].beg ) {
                        var section: Section = {
                            id: this._data[i].beg,
                            beg: i,
                            end: 0,
                            features: this._data[i].features,
                            fs: null,
                            pathPoints: [
                                { index: i, value: this._data[i].value }
                            ]
                        };
                        nodesData.push( { id: this._data[i].beg, value: this._data[i].value, index: i });

                        while ( this._data[++i] && this._data[i].beg == section.id ) {
                            section.features = section.features.concat( this._data[i].features );
                            section.pathPoints.push( { index: i, value: this._data[i].value });
                            nodesData.push( { id: this._data[i].beg, value: this._data[i].value, index: i });
                        }

                        if ( this._data[i] && this._data[i].type == 3 ) {
                            section.end = i;
                            section.pathPoints.push( { index: i, value: this._data[i].value });
                        } else if ( this._data[i] && this._data[i].type == 1 ) {
                            section.end = i - 1;
                            var sectionRestPath = [];
                            sectionRestPath.push( { index: i - 1, value: this._data[i - 1].value });
                            sectionRestPath.push( { index: i, value: this._data[i].value });
                            restPathData.push( sectionRestPath );
                        } else {
                            section.end = i - 1;
                        }

                        sectionData.push( section );
                        if ( !this._section_data[section.id] && section.pathPoints.length == 3 ) {
                            this._section_data[section.id] = section;
                        }

                    } else {
                        var sectionRestPath = [];
                        if ( this._data[i - 1] )
                            sectionRestPath.push( { index: i - 1, value: this._data[i - 1].value });
                        sectionRestPath.push( { index: i, value: this._data[i].value });

                        while ( this._data[++i] && !this._data[i].beg ) {
                            sectionRestPath.push( { index: i, value: this._data[i].value });
                        }

                        if ( this._data[i] )
                            sectionRestPath.push( { index: i, value: this._data[i].value });

                        restPathData.push( sectionRestPath );
                    }
                }

                var self = this;
                var cells = this._subView.selectAll( "g.curve.cells" ).data( sectionData.filter(( d ) => { return d.pathPoints.length === 3; }), function ( d ) { return d.id; });

                //Voronoi here
                var sectionIds = Object.keys( this._section_data );
                var constR = this._x_scale( 1 ) - this._x_scale( 0 );
                if ( sectionIds.length > 0 ) {

                    //Calculate the bound
                    if ( !this._voronoi_bound ) {
                        var step = 2 * Math.PI * 0.01;
                        var bound = [];
                        for ( var i = 99; i >= 0; --i ) {
                            var x = constR * Math.cos( i * step );
                            var y = constR * Math.sin( i * step );
                            bound.push( [x, y] );
                        }
                        this._voronoi_bound = d3.geom.polygon( bound );
                    }

                    for ( var i = 1; i < 3; ++i ) {
                        var section: Section = this._section_data[sectionIds[sectionIds.length - i]];

                        if ( section && !section.fs && section.pathPoints.length == 3 ) {

                            var fs = section.features;
                            fs.sort( function ( a, b ) {
                                if ( a.feature_type > b.feature_type ) return -1;
                                else return 1;
                            });

                            //circle type
                            this.CalVoronoi( fs, constR );

                            var cellsGroup = cells.enter().insert( 'g', 'path.curve.section.path' )
                                .attr( 'class', 'curve cells' )
                                .attr( 'id', function ( d ) { return "cells_group" + d.id; })
                                .attr( "transform", function ( d: Section ) {
                                    if ( d.pathPoints[1] ) {
                                        var tY = self._y_scale( d.pathPoints[1].value ) + 30;
                                        d3.select( this ).attr( 'tY', tY );
                                        return "translate(" + self._x_scale( d.end - 1 ) + "," + tY + ")";
                                    }
                                })
                                ;
                            section['fs'] = fs;
                            cellsGroup.selectAll( ".cell" )
                                .data( fs )
                                .enter().append( "g" )
                                .attr( "class", "cell" )
                                .append( "path" )
                                .attr( "d", ( d ) => {
                                    return "M" + d.p.join( "L" ) + "Z";
                                })
                                .style( "fill", ( d, i ) => {
                                    return this._voronoi_color( d.feature_type );
                                })
                                .style( "fill-opacity", function ( d:Feature ) {
                                    return  Math.sqrt( d.feature_value)/Math.sqrt(self._voronoi_color_scale[d.feature_type]);
                                })
                                .style( "stroke", 'lightgrey' )
                                .style( "stroke-width", .3 )
                                .on( 'mouseout', function ( d ) {
                                    d3.select( this.parentNode.parentNode  ).select( "#cell-tip" ).remove();
                                })
                                .on( 'mouseover', function ( d ) {
                                    var mouse = d3.mouse( this );
                                    d3.select( this.parentNode.parentNode )
                                        .append( 'text' )
                                        .attr( 'x', mouse[0] )
                                        .attr( 'y', mouse[1] )
                                        .attr( 'id', 'cell-tip' )
                                        .text( d.feature_type + ":" + d.feature_value )
                                        ;
                                });
                        }
                    }

                }

                var xTime = this._mainView.selectAll( ".curve.seg.time-tick" ).data( sectionData );
                xTime.attr( "x", ( d, i ) => {
                    return this._x_scale( d.beg );
                })
                    ;
                xTime.enter().append( "text" )
                    .attr( "x", ( d, i ) => {
                        return this._x_scale( d.beg );
                    })
                    .attr( "y", this._view_height )
                    .attr( "class", "curve seg time-tick" )
                    .text(( d ) => {
                        var date = this._time_formater.parse( d.id );
                        var mon = this.month_names[date.getMonth()];
                        var day = date.getDate();
                        return mon + " " + day;
                    })
                    ;
                xTime.exit().remove();

                var truelineFunc = d3.svg.line()
                    .x(( d, i ) => {
                        return this._x_scale( d.index );
                    })
                    .y(( d, i ) => {
                        return this._y_scale( d.value );
                    })
                    .interpolate( "linear" )
                    ;

                var truepath = this._mainView.selectAll( ".curve.section.path" ).data( sectionData, function ( d ) { return d.id; });
                truepath.attr( "d", function ( d ) {
                    return truelineFunc( d.pathPoints );
                });
                truepath
                    .enter().append( "path" )
                    .attr( "d", function ( d ) { return truelineFunc( d.pathPoints ); })
                    .attr( "class", "curve section path" )
                    ;
                truepath.exit().remove();

                var trueRestPath = this._mainView.selectAll( ".curve.rest.true.path" ).data( restPathData );
                trueRestPath.attr( "d", function ( d ) {
                    return truelineFunc( d );
                })
                trueRestPath
                    .enter().append( "path" )
                    .attr( "d", truelineFunc )
                    .attr( "class", "curve rest true path" )
                    ;
                trueRestPath.exit().remove();

                //handle the seg node
                var nodes = this._mainView.selectAll( ".curve.node" ).data( nodesData, function ( d ) { return d.index; });
                nodes
                    .attr( "cx", ( d, i ) => {
                        return this._x_scale( d.index );
                    })
                    .attr( "cy", ( d ) => {
                        return this._y_scale( d.value );
                    })
                    ;
                nodes.enter().append( "circle" )
                    .attr( "class", "curve node" )
                    .attr( "cx", ( d, i ) => {
                        return this._x_scale( d.index );
                    })
                    .attr( "cy", ( d ) => {
                        return this._y_scale( d.value );
                    })
                    .attr( "r", 3 );
                nodes.exit().remove();

                // move the main view
                if ( this._data.length > ( this._section_num + 1 ) ) {
                    this._mainView
                        .attr( "transform", null )
                        .transition()
                        .duration( 80 )  //this time-step should be equale to the time step of AddPoint() in server.hub
                        .ease( "linear" )
                        .attr( "transform", "translate(" + ( this._x_scale( 0 ) - this._x_scale( 1 ) ) + ",0)" )
                        ;

                    cells
                        .transition()
                        .duration( 80 )
                        .ease( "linear" )
                        .attr( "transform", function ( d ) {
                            var ty = self._y_scale( d.pathPoints[1].value ) + 30;//d3.select( this ).attr( 'tY' );
                            return "translate(" + self._x_scale( d.end - 2 ) + "," + ty + ")";
                        })
                        ;
                }


                //Refresh the stack rect view
                if ( this._data[0].type == 1 || this._data[0].type == 3 ) {

                    //The stack date
                    var date = this._time_formater.parse( this._data[0].beg );
                    var stackNode: StackNode = {
                        id: this._data[0].beg,
                        date: date,
                        size: 1,
                        oy: this._y_scale( this._data[1].value ),
                        name: "d" + date.getDay(),
                        parent: null,
                        children: null,
                        type: this.GetStackNodeType( date ),
                        index: this._stack_bar_nodes_data.length
                    }
                    this.InserNode( stackNode.type, stackNode );
                    var exitParent: StackNode = this.FindMinCoParent( this._stack_bar_nodes_data[this._stack_bar_nodes_data.length - 1], stackNode );
                    this.Toggle( exitParent );
                    this._stack_bar_nodes_data.push( stackNode );

                    this.UpdateSubviewTree( exitParent );
                }


            }

            private SelectSegment( d: Section | StackNode ) {
                if ( d['end'] == -1 ) {
                    console.log( "Segmentation hasn't finished yet!" );
                } else if ( d['end'] == null || d['end'] != -1 ) {
                    if ( this._element.select( ".progress" ).style( "display" ) !== "block" ) {
                        this._curveSvg.style( "margin-bottom", "0px" )
                        this._element.select( ".progress" ).style( "display", "block" );
                        this.PullInterval( d.id, this._manyLens.CurrentClassifierMapID );
                    } else {
                        console.log( "There's pulling a interval now" );
                    }
                }
            }

            private GetWeek( date: Date ): number {
                var d = new Date( +date );
                d.setHours( 0, 0, 0 );
                d.setDate( d.getDate() + 4 - ( d.getDay() || 7 ) );
                return Math.ceil(( ( ( d.getTime() - new Date( d.getFullYear(), 0, 1 ).getTime() ) / 8.64e7 ) + 1 ) / 7 );
            }

        }

    }
}