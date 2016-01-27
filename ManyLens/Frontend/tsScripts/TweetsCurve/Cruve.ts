///<reference path = "../D3ChartObject.ts" />

module ManyLens {

    export module TweetsCurve {

        interface Point {
            value: number;
            isPeak: boolean;
            id: string;
            type: number;
            features: Array<Object>;
            beg: string;
            end: string;
        }

        interface Section {
            beg: number;
            end: number;
            id: string;
            bound: Array<Array<number>>;
            features: Array<Array<Object>>;
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
            private _coordinate_margin_left: number = 400;

            protected _data: Array<Point>;
            private _section_data: Array<Section>;

            private _time_formater: D3.Time.TimeFormat;
            private _stack_time_id_gen: number = 0;

            private _root: {};
            private _stack_bar_nodes: StackNode[];
            private _stack_bar_tree: D3.Layout.TreeLayout;
            private _stack_bar_tree_diagonal: D3.Svg.Diagonal;
            private _stack_bar_node: D3.UpdateSelection;
            private _stack_bar_link: D3.UpdateSelection;
            private week_days_name: string[] = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fir.", "Sat."];
            private month_names: string[] = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

            private _hack_entropy_for_sec = [5.731770623, 5.673758762, 5.708904568, 5.766106615, 5.271328797, 5.50350013, 5.650689424, 5.059556767, 5.150092845, 5.332915993, 5.538583789, 5.56513213, 5.618589058, 5.568604372, 5.601558072, 5.603160895, 5.552198033, 5.563398957, 5.545638613, 5.585914854, 5.541078274, 5.581189853, 5.610692756, 5.561532863, 5.662572096, 5.577863947, 5.697510354, 5.703647393, 5.578761725, 5.604709918, 5.443579203, 5.498566777, 5.692988236, 5.449706032, 5.316306331, 5.69077723, 5.830264994, 5.849802422, 5.764716822, 5.920337608, 5.854107674, 5.914982887, 5.872175529, 5.795052474, 5.590677484, 5.49128005, 5.611246233, 5.861593865, 5.760362888, 5.763031867, 5.715574693, 5.904532304, 6.024492893, 5.971005731, 5.410844221, 5.700768429, 5.788494599];
            private _hack_entropy_for_minute = [5.439728938, 5.329790773, 5.586664525, 5.615747057, 5.639277057, 5.653881221, 5.497658424];
            //Day is for ebola
            private _hack_entropy_for_day = [6.078795108, 5.841434121, 5.939489652, 5.938061597, 5.856967809, 5.831608227, 5.93391885, 5.993377279, 5.830555653, 5.802729553, 6.076953322, 5.894862096, 5.779206615, 5.969579388, 5.710407662];
            private _hack_entropy_for_day_fullyear =
            [5.991439819, 5.851983278, 5.948156068, 5.436286372, 5.291194338, 5.483132322, 5.335564514, 5.890816733, 6.296046929, 5.776935794, 6.178819818, 5.823461866, 6.276945033, 5.383821592, 5.780546756, 5.504823674, 5.459557571, 5.290890409, 5.711883642, 5.941650018, 5.931193478, 5.852722028, 5.823861489, 5.917398009, 5.975238027, 5.842076197, 5.8002751, 6.081009165, 5.892996018, 5.753263639, 5.879791592];

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
                this._section_data = new Array<Section>();
                this._stack_bar_nodes = new Array<StackNode>();

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
                                return 2 / ( ( a.depth + 1 ) * ( a.depth + 1 ) );
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
                if ( !node.children && !node._children ) return this._hack_entropy_for_day_fullyear[node.index];
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

            private UpdateSubviewTree( exitParent: StackNode, mode: boolean = true ) {
                var duration = 500;

                var colorScale = d3.scale.linear().domain( d3.extent( this._hack_entropy_for_day_fullyear ) )
                    .range( ["#C5EFF7", "#34495E"] );

                var arcScale = d3.scale.linear().domain( d3.extent( this._hack_entropy_for_day_fullyear ) )
                .range([0,1]);
                var constR = this._x_scale( 1 ) - this._x_scale( 0 );
                var arc = d3.svg.arc().innerRadius(constR+2).outerRadius(constR + 5).startAngle(0);


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
                        //d.y = d.y * (d.depth+3)/8;
                        if ( d.date && mode )
                            return "translate(" + [this._sub_view_width, d.oy] + ")";
                        return "translate(" + [d.parent.x, d.parent.y] + ")";
                    })
                    ;

                enterNode.filter( function ( d ) { return d.parent; })
                    .transition().duration( duration )
                    .attr( "transform", ( d ) => {
                        return "translate(" + [d.x, d.y] + ")";
                    })
                ;

                enterNode.filter( function ( d ) { return d.date })
                    .each( function ( d ) {
                        this.appendChild( document.getElementById( "cells_group" + d.id ) );
                        d3.select( "#cells_group" + d.id )
                            .classed("curve",false)
                            .style("opacity",null)
                            .attr( "transform", null )                    
                            .transition().duration( duration )
                            .attr( "transform", "scale(0.4)" )
                        ;
                    })
                    .on( "click", ( d ) => {
                        this.SelectSegment( d );
                    })
                    .select("g.cells")
                    .append('path')
                    .attr('d',(d)=>{
                            arc.endAngle(2*Math.PI * arcScale( this.SumEntropy( d ) / sumLength( d ) ));
                        return arc([0]);
                    })
                    .style( "fill", "#1abc9c")
                ;

                enterNode.filter( function ( d ) { return !d.date; })
                    .append( 'circle' )
                    .attr( 'r', 7 )
                    .style( "fill", ( d ) => {
                        return colorScale( this.SumEntropy( d ) / sumLength( d ) );
                    })
                    .on( "click", ( d ) => {
                        this.Toggle( d );
                        this.UpdateSubviewTree( d, false );
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

                this._stack_bar_node
                    .transition().duration( duration )
                    .attr( "transform", function ( d ) { 
                        //d.y = d.y * (d.depth+3)/8;
                        return "translate(" + [d.x, d.y] + ")";
                    })
                    ;

                this._stack_bar_node.selectAll( "circle" )
                    .filter( function ( d ) { return d.children || d._children; })
                    .transition().duration( duration )
                    .attr( "height", function ( d ) {
                        if ( d._children ) {
                            return 10 * sumLength( d );
                        }
                        return 10;
                    })
                    .style( "fill", ( d ): any=> {
                        if ( d._children )
                            return colorScale( this.SumEntropy( d ) / sumLength( d ) );
                        return "#E87E04";
                    });
                this._stack_bar_node.selectAll( "text" )
                    .filter( function ( d ) { return d.children || d._children })
                    .transition()
                    .attr( "x", function ( d ): any {
                        if ( d._children ) {
                            return -15;
                        }
                        return 5;
                    })
                    .attr( "dy", function ( d ): any {
                        if ( d._children ) {
                            return 20 ;//* ( 1.5 + sumLength( d ) );
                        }
                        return ".35em";
                    })
                    .style( "fill-opacity", 1 );
                ;

                //Exit node
                var exitNode = this._stack_bar_node.exit();
                exitNode.select("g.cell").style('opacity',1e-6).each(function(d){
                    d3.select("#curve-subView").each(function(){
                         this.appendChild( document.getElementById( "cells_group" + d.id ) );
                    });
                });
                exitNode
                    .transition().delay( duration).duration( duration )
                    .attr( "transform", function ( d ) {
                        if ( exitParent ) {
                            d.x = exitParent.x;
                            d.y = exitParent.y;
                        }
                        return "translate(" + [d.x, d.y] + ")";
                    })
                    .remove()
                    ;
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
                return "" + "-year"+date.getFullYear()+"-mounth" + date.getMonth() + stackType;
            }

            private RefreshGraph( point: Point ) {
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
                        index: this._stack_bar_nodes.length
                    }
                    this.InserNode( stackNode.type, stackNode );
                    var exitParent: StackNode = this.FindMinCoParent( this._stack_bar_nodes[this._stack_bar_nodes.length - 1], stackNode );
                    this.Toggle( exitParent );
                    this._stack_bar_nodes.push( stackNode );

                    this.UpdateSubviewTree( exitParent );
                }

                //Refresh the curve view
                //this._y_scale.domain( [0, d3.max( this._data, function ( d ) { return d.value; })] );
                //this._y_axis_gen.scale( this._y_scale );
                //this._y_axis.call( this._y_axis_gen );

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
                            bound: null,
                            features: [
                                this._data[i].features
                            ],
                            pathPoints: [
                                { index: i, value: this._data[i].value }
                            ]
                        };
                        nodesData.push( { id: this._data[i].beg, value: this._data[i].value, index: i });

                        while ( this._data[++i] && this._data[i].beg == section.id ) {
                            section.features.push( this._data[i].features );
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
                        var disting = true;
                        this._section_data.forEach( function ( d ) {
                            if ( d.id === section.id ) disting = false;
                        });
                        if ( disting && section.pathPoints.length == 3 ) this._section_data.push( section );

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

                //handle the seg rect
                //var rects = this._mainView.selectAll( ".curve.seg" ).data( sectionData, function ( d ) { return d.id; });
                //rects
                //    .attr( "transform", ( d ) => {
                //        return "translate(" + this._x_scale( d.beg ) + ")";
                //    })
                //    .select( 'rect' )
                //    .attr( "width", ( d, i ) => {
                //        return this._x_scale( d.end ) - this._x_scale( d.beg );
                //    })
                //    ;
                //rects.enter().append( 'g' )
                //    .attr( "class", "curve seg" )
                //    .attr( "transform", ( d ) => {
                //        return "translate(" + this._x_scale( d.beg ) + ")";
                //    })
                //    .append( "rect" )
                //    .attr( "width", ( d, i ) => {
                //        return this._x_scale( d.end ) - this._x_scale( d.beg );
                //    })
                //    .attr( "height", this._view_height - this._view_padding.bottom )
                //    .on( "click", ( d: Section ) => {
                //        this.SelectSegment( d );
                //    })
                //    ;
                //rects.exit().remove();

                var self = this;
                var cells = this._subView.selectAll( "g.curve.cells" ).data( sectionData, function ( d ) { return d.id; });

                //Voronoi here
                if ( this._section_data.length > 0 ) {

                    var section = this._section_data[this._section_data.length - 1];
                    if ( !section.bound && section.pathPoints.length == 3 ) {

                        var constR = this._x_scale( 1 ) - this._x_scale( 0 );
                        var fs = [].concat( section.features[0], section.features[1], section.features[2] );
                        fs.sort( function ( a, b ) {
                            if ( a.feature_type > b.feature_type ) return -1;
                            else return 1;
                        });

                        //Calculate the bound
                        //rectangle type
                        section.bound = [];
                        //var offset = this._x_scale( section.pathPoints[0].index );
                        //section.bound.push( [this._x_scale( section.pathPoints[2].index ) - offset, this._view_height - this._view_padding.bottom] );
                        //section.bound.push( [this._x_scale( section.pathPoints[2].index ) - offset, this._y_scale( section.pathPoints[2].value )] );
                        //section.bound.push( [this._x_scale( section.pathPoints[1].index ) - offset, this._y_scale( section.pathPoints[1].value )] );
                        //section.bound.push( [0, this._y_scale( section.pathPoints[0].value )] );
                        //section.bound.push( [0, this._view_height - this._view_padding.bottom] );

                        //circle type
                        var step = 2 * Math.PI * 0.01;
                        for ( var i = 99; i >= 0; --i ) {
                            var x = constR * Math.cos( i * step );
                            var y = constR * Math.sin( i * step );
                            section.bound.push( [x, y] );
                        }

                        //Calculate the seed
                        //rectangle type
                        //var seeds = [
                        //    [constR * 0.5, this._y_scale( section.pathPoints[0].value ) + ( this._view_height - this._view_padding.bottom - this._y_scale( section.pathPoints[0].value ) ) * 0.25],
                        //    [constR * 0.5, this._y_scale( section.pathPoints[0].value ) + ( this._view_height - this._view_padding.bottom - this._y_scale( section.pathPoints[0].value ) ) * 0.75],
                        //    [constR * 1.5, this._y_scale( section.pathPoints[2].value ) + ( this._view_height - this._view_padding.bottom - this._y_scale( section.pathPoints[2].value ) ) * 0.25],
                        //    [constR * 1.5, this._y_scale( section.pathPoints[2].value ) + ( this._view_height - this._view_padding.bottom - this._y_scale( section.pathPoints[2].value ) ) * 0.75]
                        //];

                        //var _fs = {};
                        //for ( var i = 0; i < fs.length; ++i ) {
                        //    var t = fs[i].feature_type;
                        //    if ( !_fs[t] ) {
                        //        _fs[t] = [];
                        //    }
                        //    _fs[t].push( fs[i] );
                        //}

                        //fs = [];
                        //var seedsCount = -1;
                        //for ( var fsType in _fs ) {
                        //    if ( _fs.hasOwnProperty( fsType ) ) {
                        //        ++seedsCount;
                        //        var tempFs = _fs[fsType];
                        //        var step = 2.0 * Math.PI / tempFs.length;
                        //        for ( var i = 0; i < tempFs.length; ++i ) {
                        //            var angle = step * i;
                        //            var r = Math.random() * constR * 0.4;
                        //            tempFs[i]['x'] = seeds[seedsCount][0] + r * Math.cos( angle ) * 0.4;
                        //            tempFs[i]['y'] = seeds[seedsCount][1] + r * Math.sin( angle ) * 0.4;
                        //        }
                        //        fs = fs.concat( tempFs );
                        //        _fs[fsType] = d3.max(tempFs,function(d){ return d['feature_value']});
                        //    }
                        //}


                        //circle type
                        var _fs = {};
                        step = 2 * Math.PI / fs.length;
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


                        var voronoi = d3.geom.voronoi();
                        voronoi.x( function ( d ) { return d['x']; });
                        voronoi.y( function ( d ) { return d['y']; });

                        var color = d3.scale.category20();
                        var bound = d3.geom.polygon( section.bound );
                        var iteration = 0;
                        var cnt = 0;
                        while ( cnt < 10 ) {
                            var p = voronoi( fs );
                            var dist = 0;
                            //var ccnt = 0;
                            for ( var i = 0; i < p.length; ++i ) {
                                //for each voronoi polygon, clip their boundary
                                var tempPoly = bound.clip( p[i] );
                                var centroid = d3.geom.polygon( tempPoly ).centroid();
                                if ( !isNaN( centroid[0] ) && !isNaN( centroid[1] ) ) {
                                    fs[i]['p'] = p[i];
                                    dist += Math.sqrt(( fs[i]['x'] - centroid[0] ) * ( fs[i]['x'] - centroid[0] )
                                        + ( fs[i]['y'] - centroid[1] ) * ( fs[i]['y'] - centroid[1] ) );
                                    fs[i]['x'] = centroid[0];
                                    fs[i]['y'] = centroid[1];
                                    //ccnt ++;
                                } else {
                                    dist += 100000
                                }
                            }
                            dist /= p.length;
                            if ( dist <= constR * 0.002 ) {
                                cnt++;
                            } else {
                                cnt = 0;
                            }
                            iteration++;
                            if ( iteration > 1000 ) break;
                        }


                        //var cells = this._mainView.selectAll( "g.curve.cells" ).data( sectionData, function ( d ) { return d.id; });

                        cells.enter().insert( 'g', 'path.curve.section.path' )
                            .attr( 'class', 'curve cells' )
                            .attr( 'id', function ( d ) { return "cells_group" + d.id; })
                            .attr( "transform", function ( d: Section ) {
                                if ( d.pathPoints[1] ) {
                                    d3.select( this ).attr( 'tY', (self._y_scale( d.pathPoints[1].value ) +30) );
                                    return "translate(" + self._x_scale( d.end - 1 ) + "," + (self._y_scale( d.pathPoints[1].value ) +30 )+ ")";
                                }
                            })
                            ;

                        d3.select( 'g#cells_group' + section.id ).selectAll( ".cell" )
                            .data( fs )
                            .enter().append( "g" )
                            .attr( "class", "cell" )
                            .append( "path" )
                            .attr( "d", function ( d ) {
                                var path = "M" + bound.clip( d.p ).join( "L" ) + "Z";
                                return path;
                            })
                            .style( "fill", function ( d, i ) {
                                return color( d.feature_type );
                            })
                            .style( "fill-opacity", function ( d ) {
                                return d.feature_value / _fs[d.feature_type];
                            })
                            .style( "stroke", 'lightgrey' )
                            .style( "stroke-width", .3 )
                            .on( 'mouseout', function ( d ) {
                                d3.select( this.parentNode ).select( "#cell-tip" ).remove();
                            })
                            .on( 'mouseover', function ( d ) {
                                var mouse = d3.mouse( this );
                                d3.select( this.parentNode )
                                    .append( 'text' )
                                    .attr( 'x', mouse[0] )
                                    .attr( 'y', mouse[1] )
                                    .attr( 'id', 'cell-tip' )
                                    .text( d.feature_type + ":" + d.feature_value )
                                    ;
                            });
                        ;
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
                    .attr( "d", function ( d ) { return truelineFunc( d ); })
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
                        .attr( "transform", function ( d ) {
                            var ty = d3.select( this ).attr( 'tY' );
                            return "translate(" + self._x_scale( d.end - 2 ) + "," + ty + ")";
                        })
                        ;
                    //cells.exit().remove();
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