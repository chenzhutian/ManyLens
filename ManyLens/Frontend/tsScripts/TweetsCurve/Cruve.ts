///<reference path = "../D3ChartObject.ts" />

module ManyLens {

    export module TweetsCurve {

        interface Point {
            value: number;
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
            }];
        }

        interface StackNode {
            id: string;
            type: string;
            name: string;
            parent: StackNode;
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
            private _y_scale: D3.Scale.LinearScale = d3.scale.linear();
            private _y_axis_gen: D3.Svg.Axis = d3.svg.axis();
            private _y_axis: D3.Selection;
            private _fisheye_scale: D3.FishEyeOrdinalScale = d3.fisheye.ordinal();

            private _sub_view_width: number;
            private _sub_view_height: number;
            //private _sub_view_x_scale: D3.Scale.LinearScale = d3.scale.linear();
            //private _sub_view_y_scale: D3.Scale.LinearScale = d3.scale.linear();

            private _section_num: number = 30;
            private _view_height: number;
            private _view_width: number;
            private _view_top_padding: number = 15;
            private _view_botton_padding: number = 25;
            private _view_left_padding: number = 50;
            private _view_right_padding: number = 50;
            private _coordinate_margin_left: number = 500;

            //private _intervals: Array<StackRect>;
            protected _data: Array<Point>;

            private _time_formater: D3.Time.TimeFormat;
            //private _stack_time: Array<StackDate>;
            private _stack_time_id_gen: number = 0;
            //private _stack_bar_width: number = 15;

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
            //[5.69006417,5.208299791,5.666119203,5.451243315,5.561025622,5.299182567,6.378748659,5.488922591,5.660975464,5.685864813,5.496838343,6.075239291,5.257863781,5.661006656,5.805892933,5.192742299,5.435717991,5.759506259,5.968754008,5.96309651,5.864660305,6.013041989,5.682746574,5.828293917,5.727380295,5.832011808,6.112499574,5.897171922,5.739194486,5.534174323,5.99537984,5.955962256];
            //private _stack_content: Map<number, StackRect[]>;

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
                //this._intervals = new Array<StackRect>();
                //this._stack_time = new Array<StackDate>();
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
                    .scale( d3.time.scale()
                        .domain( [0, this._section_num] )
                        .range( [this._view_left_padding + this._coordinate_margin_left, this._view_width - this._view_right_padding] )
                    )
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
                                return 3 / ( ( a.depth + 1 ) * ( a.depth + 1 ) );
                        }
                        return 1 / ( ( a.depth + 1 ) * ( a.depth + 1 ) );
                    })
                ;
                this._stack_bar_tree_diagonal = d3.svg.diagonal();

                //this._sub_view_x_scale.range([this._view_left_padding,this._view_left_padding + this._coordinate_margin_left]);
                //this._sub_view_y_scale.range( [this._view_height - this._view_botton_padding, this._view_top_padding] );

                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction( this, "addPoint", this.AddPoint );
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "clusterInterval", this.ClusterInterval );
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "timeInterval", this.TimeInterval );
            }

            public Render(): void {
                super.Render( null );
                var coordinate_view_width = this._view_width - this._view_left_padding - this._view_right_padding;
                this._element.select( ".progress" ).style( "display", "none" );

                this._curveSvg = this._element.insert( "svg", ".progress" )
                    .attr( "width", this._view_width )
                    .attr( "height", this._view_height )
                    .style( "margin-bottom", "17px" )
                ;

                this._curveSvg.append( "defs" ).append( "clipPath" )
                    .attr( "id", "stackRectClip" )
                    .append( "rect" )
                    .attr( "width", this._coordinate_margin_left + this._view_left_padding )
                    .attr( "height", this._view_height )
                    .attr( "x", 0 )
                    .attr( "y", 0 )
                ;

                this._subView = this._curveSvg.append( "g" )
                    .attr( "clip-path", "url(#stackRectClip)" )
                    .append( "g" )
                    .attr( "id", "curve.subView" )
                    .attr( "transform", "translate(0,-20)" )
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
                    .attr( "height", this._view_height + this._view_botton_padding + this._view_top_padding )
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

            private SumEntropy( d ) {
                if ( !d ) return 0;
                if ( !d.children && !d._children ) return this._hack_entropy_for_day_fullyear[d.index];
                var sum = 0;
                if ( d.children )
                    d.children.forEach(( d ) => {
                        sum += this.SumEntropy( d );
                    });
                else if ( d._children )
                    d._children.forEach(( d ) => {
                        sum += this.SumEntropy( d );
                    });
                return sum;
            }

            private UpdateSubviewTree( exitParent: StackNode, mode: boolean = true ) {
                var duration = 500;

                var colorScale = d3.scale.linear().domain( d3.extent( this._hack_entropy_for_day_fullyear ) )
                    .range( ["#C5EFF7", "#34495E"] );

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
                            return "translate(" + [this._sub_view_width - 10, this._sub_view_height - 120] + ")";
                        return "translate(" + [d.parent.x, d.parent.y] + ")";
                    })
                    ;

                enterNode.filter( function ( d ) { return d.parent; })
                    .transition().duration( duration )
                    .attr( "transform", ( d ) => {
                        return "translate(" + [d.x, d.y] + ")";
                    })
                ;

                enterNode.append( "rect" )
                    .attr( "x", function ( d ) {
                        if ( d.date && mode )
                            return -10;
                        return -5;
                    })
                    .attr( "width", function ( d ) {
                        if ( d.date && mode )
                            return 20;
                        return 10;
                    })
                    .attr( "height", function ( d ) {
                        if ( d.date && mode )
                            return 150;
                        return 10;
                    })
                    .style( "fill", ( d ) => {
                        return colorScale( this.SumEntropy( d ) / sumLength( d ) );
                    })
                    .on( "click", ( d ) => {
                        if ( d.date ) {
                            this.SelectSegment( d );
                        } else {
                            this.Toggle( d );
                            this.UpdateSubviewTree( d, false );
                        }
                    })
                    .transition().duration( duration )
                    .attr( {
                        x: -5,
                        width: 10,
                        height: 10
                    })
                //.attr("transform",null)
                //.attr( "d", d3.superformula().type( "circle" ).size( 50 ) )

                ;

                enterNode.append( "text" )
                    .attr( "x", function ( d ) {
                        if ( d.date || ( d.name[0] == "d" && d._children ) )
                            return -15;
                        return 5;
                    })
                    .attr( "dy", function ( d ) {
                        if ( d.date || ( d.name[0] == "d" && d._children ) )
                            return "25";
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

                this._stack_bar_node.selectAll( "rect" )
                    .filter( function ( d ) { return d.children || d._children; })
                    .transition().duration( duration )
                    .attr( "height", function ( d ) {
                        if ( d._children ) {
                            return 10 * sumLength( d );
                        }
                        return 10;
                    })
                    .style( "fill", ( d ): any=> {
                        console.log( this.SumEntropy( d ) / sumLength( d ) );
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
                            return 10 * ( 1.5 + sumLength( d ) );
                        }
                        return ".35em";
                    })
                    .style( "fill-opacity", 1 );
                ;

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

            private RefreshGraph( point: Point ) {
                //Refresh the stack rect view
                if ( this._data[0].type == 1 || this._data[0].type == 3 ) {

                    //The stack date
                    var date = this._time_formater.parse( this._data[0].beg );

                    var stackNode: StackNode = {
                        id: this._data[0].beg,
                        date: date,
                        size: 1,
                        name: "d" + date.getDay(),
                        parent: null,
                        children: null,
                        type: "" + "-year" + date.getFullYear() + "-mounth" + date.getMonth() + "-day" + date.getDate(),//"-day"+date.getDate()+"-hour"+date.getHours()+"-Min"+date.getMinutes()+"-s"+date.getSeconds(),
                        index: this._stack_bar_nodes.length
                    }
                    this.InserNode( stackNode.type, stackNode );
                    var exitParent: StackNode = this.FindMinCoParent( this._stack_bar_nodes[this._stack_bar_nodes.length - 1], stackNode );
                    this.Toggle( exitParent );
                    this._stack_bar_nodes.push( stackNode );

                    this.UpdateSubviewTree( exitParent );
                }

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
                            pathPoints: [
                                { index: i, value: this._data[i].value }
                            ]
                        };
                        nodesData.push( { id: this._data[i].beg, value: this._data[i].value, index: i });

                        while ( this._data[++i] && this._data[i].beg == section.id ) {
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
                var rects = this._mainView.selectAll( ".curve.seg" ).data( sectionData, function ( d ) { return d.id; });
                rects.attr( "x", ( d, i ) => {
                    return this._x_scale( d.beg );
                })
                    .attr( "width", ( d, i ) => {
                        return this._x_scale( d.end ) - this._x_scale( d.beg );
                    })
                ;
                rects.enter().append( "rect" )
                    .attr( "x", ( d, i ) => {
                        return this._x_scale( d.beg );
                    })
                    .attr( "y", 0 )
                    .attr( "width", ( d, i ) => {
                        return this._x_scale( d.end ) - this._x_scale( d.beg );
                    })
                    .attr( "height", this._view_height - this._view_botton_padding )
                    .attr( "class", "curve seg" )
                    .on( "click", ( d: Section ) => {
                        this.SelectSegment( d );
                    })
                ;
                rects.exit().remove();

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
                        //var hours:any   = date.getHours();
                        //var minutes:any = date.getMinutes();
                        //var seconds:any = date.getSeconds();

                        //if (hours   < 10) {hours   = "0"+hours;}
                        //if (minutes < 10) {minutes = "0"+minutes;}
                        //if (seconds < 10) {seconds = "0"+seconds;}
                        //return hours+':'+minutes+':'+seconds;
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

                var truepath = this._mainView.selectAll( ".curve.section.true.path" ).data( sectionData, function ( d ) { return d.id; });
                truepath.attr( "d", function ( d ) {
                    return truelineFunc( d.pathPoints );
                });
                truepath
                    .enter().append( "path" )
                    .attr( "d", function ( d ) { return truelineFunc( d.pathPoints ); })
                    .attr( "class", "curve section true path" )
                    .transition()
                //.attr( "stroke-dashoffset", 0 );
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
                    .attr( "r", ( d ) => {
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

            private SelectSegment( d: Section | StackNode ) {
                if ( d['end'] == -1 ) {
                    console.log( "Segmentation hasn't finished yet!" );
                } else if ( d['end'] == null || d['end'] != -1 ) {
                    if ( this._element.select( ".progress" ).style( "display" ) !== "block" ) {
                        this._curveSvg.style( "margin-bottom", "0px" )
                        this._element.select( ".progress" ).style( "display", "block" );
                        this.PullInterval( d.id, this._manyLens.CurrentClassifierMapID );
                    }else{
                        console.log("There's pulling a interval now");    
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