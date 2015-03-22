///<reference path = "../D3ChartObject.ts" />

module ManyLens {

    export module TweetsCurve {

        interface Point {
            value: number;
            trueValue: number;
            isPeak: boolean;
            id: string;
            type: number;
            beg: string;
            end: string;
        }

        interface Section {
            beg: number;
            end: number;
            id: string;
            pathPoints: [{
                index: number;
                value: number;
                trueValue: number;
            }];
        }

        interface StackRect {
            id: string;
            x: number;
            ox: number;
        }

        interface StackDate {
            id: string;
            x: number;
            ox: number;
            type: number;
            index: number;
            date: Date;
            isRemove: boolean;
            fill: string;
            intervals: Array<StackDate>;
        }

        interface StackNode {
            id: string;
            type: string;
            name: string;
            parent: StackNode;
            children: StackNode[];
            x?: number;
            y?: number;
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
            private _y_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _y_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _y_axis: D3.Selection;
            private _fisheye_scale: D3.FishEyeOrdinalScale = d3.fisheye.ordinal();

            private _sub_view_width: number;
            private _sub_view_height: number;
            private _sub_view_x_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _sub_view_y_scale: D3.Scale.LinearScale = d3.scale.linear();

            private _section_num: number = 30;
            private _view_height: number;
            private _view_width: number;
            private _view_top_padding: number = 15;
            private _view_botton_padding: number = 5;
            private _view_left_padding: number = 50;
            private _view_right_padding: number = 50;
            private _coordinate_margin_left: number = 400;

            private _intervals: Array<StackRect>;
            protected _data: Array<Point>;


            private _time_formater: D3.Time.TimeFormat;
            private _stack_time: Array<StackDate>;
            private _stack_time_id_gen: number = 0;
            private _stack_bar_width: number = 15;


            private _root: {};
            private _stack_bar_nodes: StackNode[];
            private _stack_bar_tree: D3.Layout.TreeLayout;
            private _stack_bar_tree_diagonal: D3.Svg.Diagonal;
            private _stack_bar_node: D3.UpdateSelection;
            private _stack_bar_link: D3.UpdateSelection;
            private week_days_name: string[] = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fir.", "Sat."];
            private month_names: string[] = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

            private _stack_content: Map<number, StackRect[]>;

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
                this._intervals = new Array<StackRect>();
                this._stack_time = new Array<StackDate>();
                this._stack_bar_nodes = new Array<StackNode>();

                this._view_height = parseFloat( this._element.style( "height" ) ) - 30;
                this._view_width = parseFloat( this._element.style( "width" ) );

                this._sub_view_height = this._view_height - this._view_botton_padding;
                this._sub_view_width = this._coordinate_margin_left + this._view_left_padding;

                this._x_scale
                    .domain( [0, this._section_num] )
                    .range( [this._view_left_padding + this._coordinate_margin_left, this._view_width - this._view_right_padding] )
                ;
                this._y_scale
                    .domain( [0, 20] )
                    .range( [this._view_height - this._view_botton_padding, this._view_top_padding] )
                ;
                this._x_axis_gen
                    .scale( this._x_scale )
                    .ticks( 0 )
                    .orient( "bottom" )
                ;
                this._y_axis_gen
                    .scale( this._y_scale )
                    .ticks( 2 )
                    .orient( "left" )
                ;

                this._fisheye_scale
                    .rangeRoundBands( [0, this._sub_view_width] )
                    .focus( this._coordinate_margin_left + this._view_left_padding )
                ;

                this._time_formater = d3.time.format( "%Y%m%d%H%M%S" );

                this._root = {
                    id: "root",
                    name:"",
                    type: "null",
                    date: null,
                    parent:null,
                    children: [] 
                }
                
                this._stack_bar_tree = d3.layout.tree()
                    .size( [this._sub_view_width-50, this._sub_view_height-0] )
                    //.nodeSize([10,10])
                    .separation(function(a,b){
                        if(a.parent == b.parent){
                            if(a.children && b._children)
                                return 5/(a.depth+1);
                        }
                        return 1/(a.depth+1);
                    })
                ;
                this._stack_bar_tree_diagonal = d3.svg.diagonal();

                this._sub_view_x_scale.range([this._view_left_padding,this._view_left_padding + this._coordinate_margin_left]);
                this._sub_view_y_scale.range( [this._view_height - this._view_botton_padding, this._view_top_padding] );

                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction( this, "addPoint", this.AddPoint );
                this._manyLens.ManyLensHubRegisterClientFunction( this, "clusterInterval", this.ClusterInterval );
                this._manyLens.ManyLensHubRegisterClientFunction( this, "timeInterval", this.TimeInterval );
            }

            public Render(): void {
                super.Render( null );
                var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
                this._element.select( ".progress" ).style( "display", "none" );

                this._curveSvg = this._element.insert( "svg", ":first-child" )
                    .attr( "width", this._view_width )
                    .attr( "height", this._view_height )
                    .style( "margin-bottom", "17px" )
                ;

                this._curveSvg.append( "defs" ).append( "clipPath" )
                    .attr( "id", "stackRectClip" )
                    .append( "rect" )
                    .attr( "width", this._coordinate_margin_left + this._view_left_padding )
                    .attr( "height", this._view_height - this._view_botton_padding )
                    .attr( "x", 0 )
                    .attr( "y", 0 )
                ;

                this._subView = this._curveSvg.append( "g" )
                    .attr( "clip-path", "url(#stackRectClip)" )
                    .append( "g" )
                    .attr( "id", "curve.subView" )
                    .attr("transform","translate(0,-20)")
                    //.on( "mouseenter",() => {
                    //    clearTimeout( timer );
                    //})
                    //.on( "mouseleave",() => {
                    //    timer = setTimeout(() => {
                    //        this.ShrinkStackRect();
                    //    }, 1000 );
                    //})
                ;

                this._curveSvg.append( "defs" ).append( "clipPath" )
                    .attr( "id", "curveClip" )
                    .append( "rect" )
                    .attr( "width", coordinate_view_width )
                    .attr( "height", this._view_height - this._view_botton_padding )
                    .attr( "x", this._view_left_padding + this._coordinate_margin_left )
                    .attr( "y", 0 )
                ;

                this._mainView = this._curveSvg.append( "g" )
                    .attr( "clip-path", "url(#curveClip)" )
                    .append( "g" )
                    .attr( "id", "curve.mainView" )
                ;

                this._x_axis = this._curveSvg.append( "g" )
                    .attr( "class", "curve x axis" )
                    .attr( "transform", "translate(" + [0, ( this._view_height - this._view_botton_padding )] + ")" )
                    .call( this._x_axis_gen )
                ;

                this._y_axis = this._curveSvg.append( "g" )
                    .attr( "class", "curve y axis" )
                    .attr( "transform", "translate(" + ( this._coordinate_margin_left + this._view_left_padding ) + ",0)" )
                    .call( this._y_axis_gen )
                ;

            }

            public PullInterval( interalID: string, classifierID?:string ): void {
                if ( ManyLens.TestMode )
                    this._manyLens.ManyLensHubServerTestPullInterval( interalID );
                else {
                    this._manyLens.ManyLensHubServerPullInterval( interalID,classifierID )
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
                        name:"",
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

            private Toggle( d ) {
                if ( d == null ) return;
                if ( d.children ) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
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

            private UpdateSubviewTree( exitParent: StackNode ,mode:boolean = true) {
                var duration = 500;
                
                //Nodes
                var nodex = this._stack_bar_tree.nodes( this._root[""] ).filter( function ( d ) { return d.name != "";});
                this._stack_bar_node = this._subView.selectAll( ".stack.node" )
                    .data( nodex, function ( d ) { return d.id; });

                //Enter node
                var enterNode = this._stack_bar_node
                    .enter().append( "g" )
                    .attr( "class", "stack node" )
                    .attr( "transform",( d ) => {
                        //d.y = d.y * (d.depth+3)/8;
                        if ( d.date && mode)
                            return "translate(" + [this._sub_view_width - 10, this._sub_view_height - 120] + ")";
                        return "translate(" + [d.parent.x, d.parent.y] + ")";
                    })
                    ;

                enterNode.filter( function ( d ) { return d.parent;})
                    .transition().duration( duration )
                    .attr( "transform",( d ) => {
                        return "translate(" + [d.x, d.y] + ")";
                    })
                ;

                enterNode.append( "rect" )
                    //.attr( "d", function ( d ) {
                    //    if ( d.date && mode)
                    //        return d3.superformula().type("rectangle").size(1000)( d );
                    //    return d3.superformula().type( "circle" ).size(50)( d );
                    //})
                    //.attr( "transform", function ( d ) {
                    //    if ( d.date && mode)
                    //        return "scale(1,5)";
                    //})
                    .attr("x",function(d){
                        if ( d.date && mode)
                            return -10;
                        return -5;
                    })
                    .attr("width",function(d){
                         if ( d.date && mode)
                             return 20;
                        return 10;
                    })
                    .attr("height",function(d){
                         if ( d.date && mode)
                            return 150;
                        return 10;
                    })
                    .on( "click",( d ) => {
                        if ( d.date ) {
                            this.SelectSegment( d );
                        } else {
                            this.Toggle( d );
                            this.UpdateSubviewTree( d, false );
                        }
                    })
                    .transition().duration( duration )
                    .attr({
                        x:-5,
                        width:10,
                        height:10
                    })
                    //.attr("transform",null)
                    //.attr( "d", d3.superformula().type( "circle" ).size( 50 ) )

                ;

                enterNode.append( "text" )
                    .attr( "x", function ( d ) { return d.children || d._children ? -10 : 10; })
                    .attr( "dy", ".35em" )
                    .attr( "text-anchor", function ( d ) { return d.children || d._children ? "end" : "start"; })
                    .text(( d:StackNode ) => {
                    if ( d.name[0] == "y" ) {
                        return d.name.substring( 4 );
                    }else if ( d.name[0] == "d" ) {
                        return this.week_days_name[parseInt( d.name[d.name.length - 1] )];
                    } else if ( d.name[0] == "m" ) {
                        return this.month_names[parseInt( d.name[d.name.length - 1] )];
                    }

                        return d.name;
                    })
                    .style( "fill-opacity", 1e-6 )
                    .transition().duration( duration )
                    .style( "fill-opacity", 1 );
                ;

                //Update node
                var colorScale = d3.scale.linear().domain( [1, 8] )
                    .range( ["#2574A9", "#2574A9"] );

                function sumLength( d ) {
                    if(!d) return 0;
                    if ( !d.children  && !d._children) return 1;
                    var sum = 0; 
                    if(d.children)
                        d.children.forEach(( d ) => {
                            sum += sumLength( d );
                        });
                    else if(d._children)
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
                var heightScale = d3.scale.linear();
                this._stack_bar_node.selectAll( "rect" )
                    .filter( function ( d ) { return d.children || d._children; })
                    .transition().duration(duration)
                    .attr("height",function( d ){ 
                        if(d._children){
                            //heightScale.range([d.y,d.y - d._children[0].y]).domain([0,sumLength(d.parent)]);

                            return 10 * sumLength(d);
                        }
                        return 10;
                    })
                    .style( "fill", function ( d ) { return colorScale( sumLength(d) ); });

                //Exit node
                var exitNode = this._stack_bar_node.exit()
                    .transition().duration( duration )
                    .attr( "transform", function ( d ) {
                    if ( exitParent ) {
                        d.x = exitParent.x;
                        d.y = exitParent.y;
                    }
                    return "translate(" + [d.x, d.y] + ")";
                })
                    .remove()
                    ;
                exitNode.select( "rect" ).transition().attr( "r", 1e-6 );
                exitNode.select( "text" ).transition().style( "fill-opacity", 1e-6 );

                //Links
                this._stack_bar_link = this._subView.selectAll( ".stack.link" )
                    .data( this._stack_bar_tree.links( nodex ), function ( d ) { return d.source.id + "-" + d.target.id; });
   
                //Enter link
                this._stack_bar_link
                    .enter().insert( "path", ".stack.node" )
                    .attr( "class", "stack link" )
                    .attr( "d",( d ) => {
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
                    .attr( "d",( d ) => {
                    if ( exitParent ) {
                        d.x = exitParent.x;
                        d.y = exitParent.y;
                    }
                    var o = { x: d.x, y: d.y };
                    return this._stack_bar_tree_diagonal( { source: o, target: o });
                })
                    .remove();
            }

            private RefreshGraph( point: Point ) {
                //Refresh the stack rect view
                if ( this._data[0].type == 1 || this._data[0].type == 3 ) {

                    //The stack date
                    var date = this._time_formater.parse( this._data[0].beg );
                    //var stackRect: StackDate = {
                    //    id: this._data[0].beg,
                    //    x: this._stack_time.length * this._stack_bar_width,
                    //    ox: this._stack_time.length * this._stack_bar_width,
                    //    type: 0,
                    //    index: date.getDay(),
                    //    isRemove: false,
                    //    fill: null,
                    //    date:date,
                    //    intervals: null
                    //}
                                         
                    //this._intervals.push( stackRect );

                    var stackNode: StackNode = {
                        id: this._data[0].beg,
                        date: date,
                        size: 1,
                        name:"H"+date.getHours(),
                        parent:null,
                        children: null,
                        type: ""+"-year"+date.getFullYear()+"-mounth"+date.getMonth()+"-week"+this.GetWeek(date)+"-day"+date.getDay()+"-hour"+date.getHours(),
                        index: date.getDay()
                    }
                    this.InserNode( stackNode.type, stackNode );
                    var exitParent:StackNode = this.FindMinCoParent( this._stack_bar_nodes[this._stack_bar_nodes.length - 1] ,stackNode);
                    this.Toggle( exitParent );
                    this._stack_bar_nodes.push( stackNode );

                    this.UpdateSubviewTree( exitParent );
                    //console.log( printTree( this._root["year"] ));
                    //function printTree( node:StackNode ) {
                    //    var s = '{"id":"' + node.id+'","type":"'+node.type;
                    //    if ( node.children ) {
                    //        s += '","children":[';
                    //        node.children.forEach(( d: StackNode ) => {
                    //            s += printTree( d ) + ",";
                    //        });
                    //        s = s.substring( 0, s.length - 1 );
                    //    } else {
                    //        s += '","size":' + 1 + ',"children":[';
                    //    }
                    //    s += "]}";
                    //    return s;
                    //}

                    
                       
                    //this.StackBarByTime( date, 0, [stackRect] );
                }

                //Refresh the curve view
                this._y_scale.domain( [0, d3.max( [
                    d3.max( this._data, function ( d ) { return d.trueValue; }),
                    d3.max( this._data, function ( d ) { return d.value; })
                ] )
                ] );
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
                            pathPoints: [
                                { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue }
                            ]
                        };
                        nodesData.push( { id: this._data[i].beg, value: this._data[i].value, index: i });

                        while ( this._data[++i] && this._data[i].beg == section.id ) {
                            section.pathPoints.push( { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                            nodesData.push( { id: this._data[i].beg, value: this._data[i].value, index: i });
                        }

                        if ( this._data[i] && this._data[i].type == 3 ) {
                            section.end = i;
                            section.pathPoints.push( { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                        } else if ( this._data[i] && this._data[i].type == 1 ) {
                            section.end = i - 1;
                            var sectionRestPath = [];
                            sectionRestPath.push( { index: i - 1, value: this._data[i - 1].value, trueValue: this._data[i - 1].trueValue });
                            sectionRestPath.push( { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                            restPathData.push( sectionRestPath );
                        } else {
                            section.end = i - 1;
                        }
                        sectionData.push( section );
                    } else {
                        var sectionRestPath = [];
                        if ( this._data[i - 1] )
                            sectionRestPath.push( { index: i - 1, value: this._data[i - 1].value, trueValue: this._data[i - 1].trueValue });
                        sectionRestPath.push( { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });

                        while ( this._data[++i] && !this._data[i].beg ) {
                            sectionRestPath.push( { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });
                        }

                        if ( this._data[i] )
                            sectionRestPath.push( { index: i, value: this._data[i].value, trueValue: this._data[i].trueValue });

                        restPathData.push( sectionRestPath );
                    }
                }

                //handle the seg rect
                var rects = this._mainView.selectAll( ".curve.seg" ).data( sectionData );
                rects.attr( "x",( d, i ) => {
                    return this._x_scale( d.beg );
                })
                    .attr( "width",( d, i ) => {
                    return this._x_scale( d.end ) - this._x_scale( d.beg );
                })
                ;
                rects.enter().append( "rect" )
                    .attr( "x",( d, i ) => {
                    return this._x_scale( d.beg );
                })
                    .attr( "y", 0 )
                    .attr( "width",( d, i ) => {
                    return this._x_scale( d.end ) - this._x_scale( d.beg );
                })
                    .attr( "height", this._view_height + this._view_top_padding )
                    .attr( "class", "curve seg" )
                    .on( "click",( d: Section ) => {
                    this.SelectSegment( d );
                })
                ;
                rects.exit().remove();

                //var lineFunc = d3.svg.line()
                //    .x(( d, i ) => {
                //    return this._x_scale( d.index );
                //})
                //    .y(( d, i ) => {
                //    return this._y_scale( d.value );
                //})
                //    .interpolate( "linear" )
                //    ;
                var truelineFunc = d3.svg.line()
                    .x(( d, i ) => {
                    return this._x_scale( d.index );
                })
                    .y(( d, i ) => {
                    return this._y_scale( d.trueValue );
                })
                    .interpolate( "basis" )
                    ;


                //var path = this._mainView.selectAll( ".curve.section.path" ).data( sectionData, function ( d ) { return d.id; });
                //path.attr( "d", function ( d ) {
                //    return lineFunc( d.pathPoints );
                //});
                //path
                //    .enter().append( "path" )
                //    .style( {
                //    'stroke': '#F6BB42',
                //    'stroke-width': 3,
                //    'fill': 'none'
                //})
                //    .attr( "d", function ( d ) { return lineFunc( d.pathPoints ); })
                //    .attr( "class", "curve section path" )
                //;
                //path.exit().remove();

                var truepath = this._mainView.selectAll( ".curve.section.true.path" ).data( sectionData, function ( d ) { return d.id; });
                truepath.attr( "d", function ( d ) {
                    return truelineFunc( d.pathPoints );
                });
                truepath
                    .enter().append( "path" )
                    .attr( "d", function ( d ) { return truelineFunc( d.pathPoints ); })
                    //    .attr( "stroke-dasharray", function ( d ) {
                    //    var totalLen = ( <SVGPathElement>d3.select( this ).node() ).getTotalLength();
                    //    return totalLen + "," + totalLen;
                    //})
                    //    .attr( "stroke-dashoffset", function ( d ) {
                    //    var totalLen = ( <SVGPathElement>d3.select( this ).node() ).getTotalLength();
                    //    return totalLen;
                    //})
                    .attr( "class", "curve section true path" )
                    .transition()
                    //.attr( "stroke-dashoffset", 0 );
                ;
                truepath.exit().remove();

                //var restPath = this._mainView.selectAll( ".curve.rest.path" ).data( restPathData );
                //restPath.attr( "d", function ( d ) {
                //    return lineFunc( d );
                //})
                //restPath
                //    .enter().append( "path" )
                //    .style( {
                //    'stroke': 'rgb(31, 145, 189)',
                //    'stroke-width': 3,
                //    'fill': 'none'
                //})
                //    .attr( "d", function ( d ) { return lineFunc( d ); })
                //    .attr( "class", "curve rest path" )
                //;
                //restPath.exit().remove();

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
                    .attr( "cx",( d, i ) => {
                    return this._x_scale( d.index );
                })
                    .attr( "cy",( d ) => {
                    return this._y_scale( d.value );
                })
                ;
                nodes.enter().append( "circle" )
                    .attr( "class", "curve node" )
                    .attr( "cx",( d, i ) => {
                    return this._x_scale( d.index );
                })
                    .attr( "cy",( d ) => {
                    return this._y_scale( d.value );
                })
                    .attr( "r",( d ) => {
                    return 3;
                });
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
                }

            }

            private SelectSegment( d: Section|StackNode ) {
                if ( d['end'] == -1 ) {
                    console.log( "Segmentation hasn't finished yet!" );
                } else if ( d['end'] == null || d['end'] != -1 ) {
                    this._curveSvg.style( "margin-bottom", "0px" )
                    this._element.select( ".progress" ).style( "display", "block" );
                    this.PullInterval( d.id, this._manyLens.CurrentClassifierMapID );
                } 
                //else if ( d['end'] == null ) {
                //    this._curveSvg.style( "margin-bottom", "0px" )
                //    this._element.select( ".progress" ).style( "display", "block" );
                //    this.PullInterval( d.id );
                //}
            }

            private GetWeek( date: Date ): number {
                var d = new Date( +date );
                d.setHours( 0, 0, 0 );
                d.setDate( d.getDate() + 4 - ( d.getDay() || 7 ) );
                return Math.ceil(( ( ( d.getTime() - new Date( d.getFullYear(), 0, 1 ).getTime() ) / 8.64e7 ) + 1 ) / 7 );
            }


            private ShrinkStackRect( filterX: number = -1 ) {
                if ( this._subView ) {
                    this._subView
                        .selectAll( "rect.stack.rect" )
                        .transition()
                        .attr( "x",( d ) => {
                        return d.ox;
                    })
                        .remove()
                    ;
                    this._subView
                        .select( "g.stack.rect.group" )
                        .remove()
                    ;

                    this._subView
                        .selectAll( "rect.stack.organize" )
                        .style( "visibility", function ( d ) {
                        if ( d.x != filterX )
                            return "visible";
                        return "hidden";
                    })
                        .transition()
                        .attr( "x",( d ) => { return d.x = d.ox; })
                        .attr( "width", this._stack_bar_width )
                    ;

                    this._subView.on( "mousemove", null );
                }
            }

            private StackBarByTime( date: Date, depth: number, intervals: Array<StackDate>, stack_time_right: Array<StackDate> = null ) {
                var num;
                var newDate: StackDate;
                switch ( depth ) {
                    case 0: {
                        stack_time_right = new Array<StackDate>();
                        newDate = intervals[0];
                    }
                        break;
                    case 1: num = this.GetWeek( date ); break;
                    case 2: num = date.getMonth(); break;
                    default: num = -1;
                }

                if ( depth != 0 ) {
                    newDate = {
                        id: this.StackID,
                        type: depth,
                        index: num,
                        isRemove: false,
                        x: this._stack_time.length * this._stack_bar_width,
                        ox: this._stack_time.length * this._stack_bar_width,
                        fill: null,
                        date: date,
                        intervals: intervals
                    }
                }


                var colorScale = d3.scale.ordinal().domain( [0, 1, 2] )
                    .range( ["#2A9CC8", "#2574A9", "#34495E"] );

                stack_time_right.push( newDate );
                var tempStackDate: StackDate[] = [].concat( this._stack_time, stack_time_right.reverse() ).sort( function ( a, b ) { return ( a.x > b.x ) ? 1 : -1; });
                var stack_time_bar = this._subView.selectAll( "rect.stack.organize.time" ).data( tempStackDate, function ( d ) { return d.id; });

                var self = this;
                stack_time_bar
                    .transition()
                    .attr( "x",( d, i ) => {
                    d.x = d.ox = i * this._stack_bar_width
                    return d.x;
                })
                    .style( "fill",( d ) => {
                    return d.fill;
                })
                ;

                stack_time_bar.enter().append( "rect" )
                    .attr( "x",( d ) => {
                    if ( depth == 0 )
                        return this._coordinate_margin_left + this._view_left_padding;
                    return d.x;
                })
                    .attr( {
                    "class": "stack organize time",
                    width: this._stack_bar_width,
                    height: 50,
                    y: this._view_height + this._view_top_padding - 50
                })
                    .style( {
                    stroke: "#fff",
                    "stroke-width": 0.5
                })
                    .style( "fill",( d ) => {
                    if ( d.type == 0 ) {
                        return colorScale( d.type );
                    }
                    return colorScale( d.type - 1 );
                })
                    .on( "dblclick", function ( d, i ) {
                    d3.select( this ).style( "visibility", "hidden" );
                    self.ExpandStackDate( d );
                })
                    .transition()
                    .style( "fill",( d ) => {
                    return d.fill = colorScale( d.type );
                })
                    .attr( "x", function ( d ) {
                    return d.x;
                })
                ;

                stack_time_bar.exit().filter( function ( d ) { return !d.isRemove; })
                    .transition()
                    .attr( "x", function ( d ) {
                    d.isRemove = true;
                    return d.x;
                })
                    .remove()
                ;

                var last_time_bar:StackDate = this._stack_time.pop();
                if ( last_time_bar ) {
                    if ( last_time_bar.type == newDate.type && last_time_bar.index != newDate.index ) {
                        var newStack:StackDate[] = [];
                        newStack.push( last_time_bar );
                        while ( this._stack_time.length > 0 ) {
                            var tempDate = this._stack_time.pop();
                            if ( tempDate.type == last_time_bar.type && tempDate.index == last_time_bar.index ) {
                                newStack.push( tempDate );
                            } else {
                                this._stack_time.push( tempDate );
                                break;
                            }
                        }

                        newStack.forEach(( d: StackDate ) => {
                            d.x = newStack[newStack.length - 1].x;
                        });

                        this.StackBarByTime( last_time_bar.date, ++depth, newStack, stack_time_right );
                    } else {
                        this._stack_time.push( last_time_bar );
                    }
                }

                this._stack_time.push( newDate );


            }
            private TimeInterval(): void {
                this.ShrinkStackRect();
                this._subView
                    .selectAll( "rect.stack.organize.content" )
                    .transition()
                    .style( "opacity",( d ) => {
                    return 0;
                })
                    .remove()
                ;

                var self = this;
                this._subView.selectAll( "rect.stack.organize.time" )
                    .data( this._stack_time )
                    .enter().append( "rect" )
                    .attr(
                    {
                        width: this._stack_bar_width,
                        "class": "stack organize time",
                        height: 50,
                        y: this._view_height + this._view_top_padding - 50
                    })
                    .style(
                    {
                        stroke: "#fff",
                        "stroke-width": 0.5
                    })
                    .attr( "x",( d ) => {
                    return d.x;
                })
                    .style( "fill",( d ) => {
                    return d.fill;
                })
                    .on( "dblclick", function ( d ) {
                    d3.select( this ).style( "visibility", "hidden" );
                    self.ExpandStackDate( d );
                })
                ;

            }

            private ClusterInterval( intervalsInGroups: any[] ): void {
                this.ShrinkStackRect();
                this._subView
                    .selectAll( "rect.stack.organize.time" )
                    .transition()
                    .style( "opacity",( d ) => {
                    return 0;
                })
                    .remove()
                ;

                this._stack_content = new Map<number, StackRect[]>();
                intervalsInGroups.forEach(( d, i ) => {
                    if ( !this._stack_content.has( d ) ) {
                        this._stack_content.set( d, [] );
                    }
                    if ( this._intervals[i] )
                        this._stack_content.get( d ).push( this._intervals[i] );
                });

                var data = [];
                var color = d3.scale.category10();
                this._stack_content.forEach(( d ) => {
                    data.push( d );
                });

                var self = this;
                this._subView
                    .selectAll( "rect.stack.organize.content" )
                    .data( data )
                    .enter().append( "rect" )
                    .attr( {
                    width: this._stack_bar_width,
                    "class": "stack organize content",
                    height: this._view_height + this._view_top_padding,
                    y: 0
                })
                    .style( {
                    stroke: "#fff",
                    "stroke-width": 0.5
                })
                    .attr( "x",( d, i ) => {
                    return d.x = d.ox = i * this._stack_bar_width
                })
                    .style( "fill",( d, i ) => {
                    return d.fill = color( i );
                })
                    .on( "dblclick", function ( d, i ) {
                    d3.select( this ).style( "visibility", "hidden" );
                    self.ExpandStackDate( d );
                })

                ;

            }

            private ExpandStackDate( d: any ): void {
                this.ShrinkStackRect( d.x );
                var data: Array<StackRect> = d.intervals || d;

                this._subView.append( "g" )
                    .attr( "class", "stack rect group" )
                    .selectAll( "rect.stack.rect" )
                    .data( data )
                    .enter()
                    .append( "rect" )
                    .attr( {
                    width: this._stack_bar_width,
                    "class": "stack rect",
                    height: this._view_height + this._view_top_padding,
                    y: 0
                })
                    .style( {
                    stroke: "#fff",
                    "stroke-width": 0.5,
                    opacity: 1e-6
                })
                    .attr( "x",( p, j ) => {
                    p.ox = d.x;
                    return p.x = d.x + j * this._stack_bar_width
                })
                    .on( "click",( d ) => {
                    this.SelectSegment( d );
                })
                    .transition()
                    .style( "opacity", 1 )
                ;
                //  .style("fill", color)


                var maxI: number = -1;
                var temp_stack_bar = this._subView.selectAll( "rect.stack.organize" ).filter(( p, i ) => { maxI = i > maxI ? i : maxI; return p.x > d.x; })
                var offsetX = ( data.length - 1 ) * this._stack_bar_width;
                if ( ( maxI + data.length - 1 ) * this._stack_bar_width > this._sub_view_width ) {

                    temp_stack_bar
                        .attr( "x",( p ) => {
                        return p.x = p.x + offsetX;
                    })
                    ;

                    this._subView.on( "mousemove",() => {

                        var mouse = d3.mouse( this._subView.node() );
                        var data = [];
                        d3.selectAll( "rect.stack" ).attr( "x", function ( d, i ) {
                            if ( d3.select( this ).style( "visibility" ) != "hidden" ) {
                                data.push( d.x );
                            }
                        });
                        data.sort( function ( a, b ) { return a > b ? 1 : -1; })
                        this._fisheye_scale
                            .domain( data )
                            .focus( mouse[0] )
                        ;

                        this._subView
                            .selectAll( "rect.stack" ).filter( function () { return d3.select( this ).style( "visibility" ) != "hidden"; })
                            .attr( "x",( d ) => {
                            //if (this._fisheye_scale(d.x))
                            return this._fisheye_scale( d.x );
                        })
                            .attr( "width",( d ) => {
                            //if (this._fisheye_scale.rangeBand(d.x))
                            return this._fisheye_scale.rangeBand( d.x );
                        })
                        ;
                    })
                    ;

                } else {
                    temp_stack_bar.transition()
                        .attr( "x",( p ) => {
                        return p.x = p.x + offsetX;
                    })
                        .attr( "width", this._stack_bar_width )
                    ;
                }
            }

        }
    }
}