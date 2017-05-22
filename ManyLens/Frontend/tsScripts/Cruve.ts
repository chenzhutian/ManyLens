///<reference path = "./D3ChartObject.ts" />

module ManyLens {

    export module TweetsCurve {

        interface Feature { x?: number, y?: number, feature_type: string, feature_value: number, feature_detail: string }

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

            private _section_num: number = 30;
            private _view_height: number;
            private _view_width: number;
            private _view_padding: { top: number, bottom: number, left: number, right: number } = { top: 50, bottom: 25, left: 50, right: 50 };
            private _coordinate_margin_left: number = 1100;

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
            // private _voronoi_color: D3.Scale.OrdinalScale = null;
            private _voronoi_scale: number = null;
            private _voronoi_color_scale: Object = null;
            private _voronoi_linear_feature: Object = null;
            private _voronoi_feature_need_to_be_log: Object = null;


            private _hack_entropy_for_sec = [5.52801983771866, 5.4039073835042, 5.45938781932472, 5.64250743333429, 4.93032087118836, 5.315961448569, 5.39588776065466, 4.65898722238974, 5.13062979174002, 5.33309072510927, 5.35641786696894, 5.60797765267891, 5.64988387523317, 5.59482123218907, 5.46264173515833, 5.48856459015412, 5.44034190298265, 5.45128763318033, 5.44438920405449, 5.48815635174213, 5.45029239874735, 5.48162359658213, 5.51425058455734, 5.46563788562995, 5.57272780600828, 5.46330296730694, 5.60273582067599, 5.62644804054953, 5.48286388833526, 5.52113525835715, 5.25754958192342, 5.34289384247398, 5.59875662298071, 5.26862406827515, 5.14805360492649, 5.54249244750256, 5.67943507560486, 5.71068019153901, 5.75938133509502, 5.76902770549809, 5.6978968138835, 5.91515365891259, 5.72912057307722, 5.65503261937499, 5.62699617989156, 5.48299298221877, 5.31362137362927, 5.51686127735103, 5.75727656236623, 5.65465538965307, 5.64206521599416, 5.61403218348421, 5.80250439167188, 5.91731972764689, 5.86487350971147, 5.38274841815246, 5.62215477204897, 5.70056092633215, 5.60632734047604];
            // private _hack_entropy_for_minute = [5.1308094928495, 4.91187594269681, 5.35133901571066, 5.51111302509791, 5.29629862396475, 5.28875741449833, 5.25065848788969, 4.95496661930616];
            private _hack_entropy_for_minute = [5.68221488096454, 5.711826561094, 5.91529615202471, 5.65829409453094, 5.98817774547564, 5.89934688008607, 5.99892927879102, 5.91592774681512, 6.27689701535894, 6.21979829087528, 6.32314504985306, 6.2671713603367, 6.22508705548198, 6.12525824064568, 6.26886460567652, 6.15772619760975, 7.01362597469215, 5.63665310347031, 5.7886865218747, 6.33567517611749, 6.44716273253146, 6.56808825331556, 6.16652003935825, 6.07010537339105, 6.00330426475011, 6.91793906690622, 6.00619751463509, 6.93130705644921, 6.94563328199474];
            private _hack_entropy_for_hour = [5.34875731246237, 4.63465410801412, 5.0530774786447, 5.73903836676464, 5.76815537684356];

            //Day is for ebola
            private _hack_entropy_for_day_fullyear = [5.69374880264309, 5.54071690329108, 5.21375567493723, 5.7364591001623, 5.67266804090054, 5.44788632513456, 5.56507687813503, 5.30118124849182, 6.38924928692222, 5.49292138443575, 5.66255265557558, 5.68311929804944, 5.50092376414015, 5.26100836113391, 5.66074791315102, 5.80350167185585, 5.19784721560846, 5.43950287241348, 5.75844480001013, 5.96897758889492, 5.96287129509671, 5.86295184921975, 6.01269251274121, 5.68335437493067, 5.82393867456836, 5.7277711426753, 5.83250284442861, 6.10911174676642, 5.89750917427565, 5.74017174495036, 5.52521691479035, 5.99649012948925, 5.9454798874942];

            private _hack_selected_entropy: Array<number>;

            public get Section_Num(): number {
                return this._section_num;
            }
            public set Section_Num(num: number) {
                if (typeof num === 'number') {
                    this._section_num = Math.ceil(num);
                }
            }
            public get StackID(): string {
                return "id" + this._stack_time_id_gen++;
            }

            constructor(element: D3.Selection, manyLens: ManyLens) {
                super(element, manyLens);

                this._data = new Array<Point>();
                this._section_data = {};
                this._stack_bar_nodes_data = new Array<StackNode>();

                this._view_height = parseFloat(this._element.style("height")) - 30;
                this._view_width = parseFloat(this._element.style("width"));

                this._sub_view_height = this._view_height - this._view_padding.bottom;
                this._sub_view_width = this._coordinate_margin_left + this._view_padding.left;

                this._x_scale
                    .domain([0, this._section_num])
                    .range([this._view_padding.left + this._coordinate_margin_left, this._view_width - this._view_padding.right]);

                this._y_scale
                    .domain([0, 10000])
                    .range([this._view_height - this._view_padding.bottom, this._view_padding.top]);

                this._x_axis_gen
                    .scale(d3.time.scale()
                        .domain([0, this._section_num])
                        .range([this._view_padding.left + this._coordinate_margin_left, this._view_width - this._view_padding.right])
                    )
                    .ticks(0)
                    .orient("bottom");

                this._y_axis_gen
                    .scale(this._y_scale)
                    .ticks(5)
                    .orient("left");

                this._fisheye_scale
                    .rangeRoundBands([0, this._sub_view_width])
                    .focus(this._coordinate_margin_left + this._view_padding.left);

                this._voronoi = d3.geom.voronoi()
                    .x(function (d) { return d['x']; })
                    .y(function (d) { return d['y']; });
                //this._voronoi_color = d3.scale.category20()
                //    .domain(['tweetLength', 'follower', 'isV', 'hastagCount']);

                this._voronoi_scale = this._coordinate_margin_left / 1100;
                this._voronoi_color_scale = {
                    'follower': d3.scale.quantize().range(['#FFFDE7', '#FFF59D', '#FFEE58', '#FBC02D']),
                    'isV': d3.scale.ordinal().domain([0, 1]).range(['#E0F7FA', '#00BCD4']),
                    'sentiment': d3.scale.quantize().domain([0, 1, 2, 3, 4]).range(['#C62828', '#F44336', '#FAFAFA', '#A5D6A7', '#4CAF50']),
                    'kloutScore': d3.scale.quantize().range(['#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B', '#00695C', '#004D40']),
                };
                this._voronoi_linear_feature = {
                    'follower': true,
                    'kloutScore': true,
                    'tweetsCount': true,
                };
                this._voronoi_feature_need_to_be_log = {
                    'follower': true,
                    'tweetsCount': true,
                };

                this._time_formater = d3.time.format("%Y%m%d%H%M%S");

                this._root = {
                    id: "root",
                    name: "",
                    type: "null",
                    date: null,
                    parent: null,
                    children: []
                }

                this._stack_bar_tree = d3.layout.tree()
                    .size([this._sub_view_width - 50, this._sub_view_height - 0])
                    //.nodeSize([10,10])
                    .separation(function (a, b) {
                        if (a.parent == b.parent) {
                            if (a.children && b._children)
                                return 2 / ((a.depth + 1) * (a.depth + 1));
                        }
                        return 1 / ((a.depth + 1) * (a.depth + 1));
                    })

                this._stack_bar_tree_diagonal = d3.svg.diagonal();

                /*---Please register all the client function here---*/
                this._manyLens.ManyLensHubRegisterClientFunction(this, "addPoint", this.AddPoint);
                this._manyLens.ManyLensHubRegisterClientFunction(this, "print", (msg) => {
                    console.log(msg);
                });
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "clusterInterval", this.ClusterInterval );
                //this._manyLens.ManyLensHubRegisterClientFunction( this, "timeInterval", this.TimeInterval );
            }

            public Render(): void {
                super.Render(null);
                var coordinate_view_width = this._view_width - this._view_padding.left - this._view_padding.right;
                this._element.select(".progress").style("display", "none");

                this._curveSvg = this._element.insert("svg", ".progress")
                    .attr("width", this._view_width)
                    .attr("height", this._view_height)
                    .style("margin-bottom", "17px");

                this._subView = this._curveSvg.append("g")
                    .attr("clip-path", "url(#stackRectClip)")
                    .append("g")
                    .attr("id", "curve-subView")
                    .attr("transform", "translate(0,-30)");

                this._curveSvg.append("defs").append("clipPath")
                    .attr("id", "curveClip")
                    .append("rect")
                    .attr("width", coordinate_view_width)
                    .attr("height", this._view_height + this._view_padding.bottom + this._view_padding.top)
                    .attr("x", this._view_padding.left + this._coordinate_margin_left)
                    .attr("y", 0);

                this._mainView = this._curveSvg.append("g")
                    .attr("clip-path", "url(#curveClip)")
                    .append("g")
                    .attr("id", "curve-mainView");

                this._x_axis = this._curveSvg.append("g")
                    .attr("class", "curve x axis")
                    .attr("transform", "translate(" + [0, (this._view_height - this._view_padding.bottom)] + ")")
                    .call(this._x_axis_gen);

                this._y_axis = this._curveSvg.append("g")
                    .attr("class", "curve y axis")
                    .attr("transform", "translate(" + (this._coordinate_margin_left + this._view_padding.left) + ",0)")
                    .call(this._y_axis_gen);
            }

            public PullInterval(interalID: string, classifierID?: string): void {
                if (ManyLens.TestMode)
                    this._manyLens.ManyLensHubServerTestPullInterval(interalID);
                else {
                    this._manyLens.ManyLensHubServerPullInterval(interalID, classifierID)
                        .progress((percent) => {
                            this._element.select(".progress-bar")
                                .style("width", percent * 100 + "%");
                        })
                        .done(() => {
                            this._element.select(".progress-bar").style("width", 0);
                            this._element.select(".progress").style("display", "none");
                            this._curveSvg.style("margin-bottom", "17px");
                        });
                }
            }

            public AddPoint(point: Point): void {
                this._data.push(point);

                this.RefreshGraph(point);
                if (this._data.length > this._section_num + 1) {
                    this._data.shift();
                }
            }

            private InserNode(name: string, data?: StackNode): StackNode {
                var node: StackNode = this._root[name], i;
                if (!node) {
                    node = this._root[name] = data || {
                        id: this.StackID,
                        date: null,
                        name: "",
                        parent: null,
                        children: [],
                        type: name
                    }
                    if (name.length) {
                        node.parent = this.InserNode(name.substring(0, i = name.lastIndexOf("-")));
                        node.parent.children.push(node);
                        node.name = name.substring(i + 1);
                    }
                }
                return node;
            }

            private Toggle(node) {
                if (node == null) return;
                if (node.children) {
                    node._children = node.children;
                    node.children = null;
                } else {
                    node.children = node._children;
                    node._children = null;
                }
            }

            private FindMinCoParent(a: StackNode, b: StackNode) {
                if (!a || !b) return null;
                if (!a.parent || !b.parent) return null;
                if (a.parent.id == b.parent.id) {
                    if (!a.date) return a;
                    else return null;
                }
                return this.FindMinCoParent(a.parent, b.parent);
            }

            private SumEntropy(node) {
                if (!node) return 0;
                if (!node.children && !node._children) return this._hack_selected_entropy[node.index];
                var sum = 0;
                if (node.children)
                    node.children.forEach((d) => {
                        sum += this.SumEntropy(d);
                    });
                else if (node._children)
                    node._children.forEach((d) => {
                        sum += this.SumEntropy(d);
                    });
                return sum;
            }

            private CalVoronoi(fs: Array<Feature>, constR) {
                var self = this;
                const _fs: Object = {};
                // const _type_follower = 'follower';
                // var _follower_range = { max: -Infinity, min: Infinity };

                if (!fs || !fs[0] || !fs[0].x) {
                    //init seed position
                    const step = 2 * Math.PI / fs.length;
                    for (let i = 0, len = fs.length; i < len; ++i) {
                        const angle = step * i;
                        const r = Math.random() * constR * 0.8;
                        fs[i].x = r * Math.cos(angle);
                        fs[i].y = r * Math.sin(angle)

                    }
                }

                for (var i = 0, len = fs.length; i < len; ++i) {
                    const feature_type = fs[i].feature_type;
                    if (feature_type in this._voronoi_linear_feature) {
                        let feature_value = fs[i].feature_value;
                        if (!(feature_type in _fs)) {
                            _fs[feature_type] = { max: -Infinity, min: Infinity };
                        }

                        if (fs[i].feature_type in this._voronoi_feature_need_to_be_log) {
                            feature_value = Math.log(feature_value);
                        }

                        _fs[feature_type].max = d3.max([_fs[feature_type].max, feature_value]);
                        _fs[feature_type].min = d3.min([_fs[feature_type].min, feature_value]);

                    }
                }

                for (let feature_type in _fs) {
                    const scaleDomain = this._voronoi_color_scale[feature_type].domain();
                    if (_fs[feature_type].max > scaleDomain[1]) {
                        this._voronoi_color_scale[feature_type].domain([scaleDomain[0], _fs[feature_type].max]);
                        this._subView.selectAll('g.cell path')
                            .style('fill', (d: Feature) => {
                                let _feature_vlaue = d.feature_value;
                                if (d.feature_type in this._voronoi_feature_need_to_be_log) {
                                    _feature_vlaue = Math.log(_feature_vlaue);
                                }
                                return this._voronoi_color_scale[d.feature_type](_feature_vlaue);
                            });
                    }
                }

                var iteration = 0;
                var cnt = 0;
                while (cnt < 5) {
                    var polygon: D3.Geom.Polygon[] = this._voronoi(fs);
                    var dist = 0;
                    for (var i = 0; i < polygon.length; ++i) {
                        //for each voronoi polygon, clip their boundary
                        var tempPolygon = this._voronoi_bound.clip(polygon[i]);
                        var centroid = d3.geom.polygon(tempPolygon).centroid();
                        if (!isNaN(centroid[0]) && !isNaN(centroid[1])) {
                            fs[i]['p'] = tempPolygon;
                            dist += (fs[i]['x'] - centroid[0]) * (fs[i]['x'] - centroid[0])
                                + (fs[i]['y'] - centroid[1]) * (fs[i]['y'] - centroid[1]);
                            fs[i]['x'] = centroid[0];
                            fs[i]['y'] = centroid[1];
                        } else {
                            dist += 1000000;
                        }
                    }
                    dist /= polygon.length;
                    if (dist <= constR * 0.05) {
                        cnt++;
                    } else {
                        cnt = 0;
                    }
                    iteration++;
                    if (iteration > 10000) break;
                }
            }

            private UpdateSubviewTree(exitParent: StackNode, mode: boolean = true) {
                var duration = 500;

                var self = this;
                switch (this._manyLens.TimeSpan) {
                    case 3: this._hack_selected_entropy = this._hack_entropy_for_sec; break;
                    case 2: this._hack_selected_entropy = this._hack_entropy_for_minute; break;
                    case 1: this._hack_selected_entropy = this._hack_entropy_for_hour; break;
                    case 0: this._hack_selected_entropy = this._hack_entropy_for_day_fullyear; break;
                }
                var colorScale = d3.scale.linear()
                    .domain(d3.extent(this._hack_selected_entropy))
                    .range(["#C5EFF7", "#34495E"]);

                var arcScale = d3.scale.linear()
                    .domain(d3.extent(this._hack_selected_entropy))
                    .range([0, 1]);
                var constR = this._x_scale(1) - this._x_scale(0);
                var arc = d3.svg.arc()
                    .innerRadius(constR * this._voronoi_scale + 1)
                    .outerRadius(constR * this._voronoi_scale + 2.5)
                    .startAngle(0); // 16 18
                // constR *= 0.9;

                //Nodes
                var nodex = this._stack_bar_tree
                    .nodes(this._root[""])
                    .filter((d) => {
                        return d.name != "";//&& d.name != "day2";
                    });

                this._stack_bar_node = this._subView
                    .selectAll(".stack.node")
                    .data(nodex, d => d.id);

                //Enter node
                var enterNode = this._stack_bar_node
                    .enter().append("g")
                    .attr("class", "stack node")
                    .attr("transform", (d) => {
                        if (d.date && mode)
                            return "translate(" + [this._sub_view_width, d.oy] + ")";
                        return "translate(" + [d.parent.x, d.parent.y] + ")";
                    });

                enterNode.filter(d => d.parent)
                    .on("click", (d) => {
                        this.Toggle(d);
                        this.UpdateSubviewTree(d, false);
                    })
                    .transition().duration(duration)
                    .attr("transform", d => "translate(" + [d.x, d.y] + ")");

                enterNode.filter(d => d.date)
                    .each(function (d) {
                        this.appendChild(document.getElementById("cells_group" + d.id));
                        var cellsGroup = d3.select("#cells_group" + d.id)
                            .classed("curve", false)
                            .style("opacity", null)
                            .attr("transform", null);
                        cellsGroup.transition().duration(duration)
                            .attr("transform", "scale(" + self._voronoi_scale + ")");
                        if (cellsGroup.select('.entropy-ring').empty()) {
                            cellsGroup.append('path')
                                .attr('class', 'entropy-ring')
                                .attr('d', function () {
                                    arc.endAngle(2 * Math.PI * arcScale(self.SumEntropy(d) / sumLength(d)));
                                    return arc([0]);
                                })
                        }

                    })
                    .on("click", (d) => {
                        this.SelectSegment(d);
                    });

                enterNode.filter(d => !d.date)
                    .append('circle')
                    .attr('r', 7)
                    .attr('class', 'just_a_node')
                    .style("fill", d => colorScale(this.SumEntropy(d) / sumLength(d)));

                enterNode.append("text")
                    //.attr("x", function (d) {
                    //    if (d.date || (d.name[0] == "d" && d._children))
                    //        return -10;
                    //    return 5;
                    //})
                    .attr("dy", function (d) {
                        if (d.date || (d.name[0] == "d" && d._children))
                            return "50";
                        return ".35em";
                    })
                    .attr("text-anchor", (d) => {
                        if (d.date || (d.name.startsWith('d') && d._children)) {
                            return 'middle';
                        }
                        return 'start';
                    })
                    .text((d: StackNode) => {
                        if (d.name[0] == "y") {
                            return d.name.substring(4);
                        } else if (d.name[0] == "m") {
                            return this.month_names[parseInt(d.name.substring(d.name.indexOf("h") + 1))];
                        } else if (d.name[0] == "d") {
                            return d.name.substring(d.name.indexOf("y") + 1);//this.week_days_name[parseInt( d.name[d.name.length - 1] )];
                        } else if (d.name[0] == "h") {
                            return d.name.substring(4) + ':' + (d.date ? d.date.getMinutes() : '00');
                        } else if (d.name[0] == "M") {
                            return d.name.substring(3);
                        }
                        return "Sub event";
                    })
                    .style("fill-opacity", 1e-6)
                    .transition().duration(duration)
                    .style("fill-opacity", 1);

                //Update node
                function sumLength(d) {
                    if (!d) return 0;
                    if (!d.children && !d._children) return 1;
                    var sum = 0;
                    if (d.children)
                        d.children.forEach((d) => {
                            sum += sumLength(d);
                        });
                    else if (d._children)
                        d._children.forEach((d) => {
                            sum += sumLength(d);
                        });
                    return sum;
                }
                function getFeatures(d) {
                    if (!d) return null;
                    if (!d.children && !d._children) {
                        return self._section_data[d.id].features;
                    }
                    var fs = [];
                    if (d.children) {
                        d.children.forEach((d) => {
                            fs = fs.concat(getFeatures(d));
                        });
                    } else if (d._children) {
                        d._children.forEach((d) => {
                            fs = fs.concat(getFeatures(d));
                        });
                    }
                    return fs;
                }

                this._stack_bar_node
                    .transition().duration(duration)
                    .attr("transform", d => "translate(" + [d.x, d.y] + ")");

                this._stack_bar_node.selectAll("circle.just_a_node")
                    .filter(d => d.children || d._children)
                    .transition().duration(duration)
                    .style("fill", d => d._children ? "#fff" : "#E87E04");

                this._stack_bar_node
                    .filter(d => d._children)
                    .each(function (d) {
                        var voronoi = document.getElementById('cells_group' + d.id);

                        if (!voronoi) {
                            var fs = getFeatures(d);
                            self.CalVoronoi(fs, constR);
                            var tempVoronoi = self._subView.append('g')
                                .attr('class', 'cells')
                                .attr('id', 'cells_group' + d.id)
                                .style('opacity', 1e-6)
                                .attr("transform", function () {
                                    var scale = sumLength(d);
                                    return "scale(" + (self._voronoi_scale * Math.sqrt(scale) * 0.9) + ")";
                                });

                            //tempVoronoi.append('circle')
                            //    .attr('class', 'background-circle')
                            //    .attr('r', constR)

                            tempVoronoi.append('path')
                                .attr('class', 'entropy-ring')
                                .attr('d', function () {
                                    arc.endAngle(2 * Math.PI * arcScale(self.SumEntropy(d) / sumLength(d)));
                                    return arc([0]);
                                })
                            // .attr( 'transform', "scale(" + ( 1 / self._voronoi_scale ) + ")" );
                            tempVoronoi.selectAll(".cell")
                                .data(fs, d => d.id)
                                .enter().append("g")
                                .attr("class", "cell")
                                .append("path")
                                .attr("d", d => "M" + d.p.join("L") + "Z")
                                .style("fill", d => {
                                    let _feature_vlaue = d.feature_value;
                                    if (d.feature_type in self._voronoi_feature_need_to_be_log) {
                                        _feature_vlaue = Math.log(_feature_vlaue);
                                    }
                                    return self._voronoi_color_scale[d.feature_type](_feature_vlaue);
                                    // self._voronoi_color_scale[d.feature_type]( d.feature_type === 'follower' ? Math.log( d.feature_value ) : d.feature_value )
                                })
                                .style("stroke", 'lightgrey')
                                .style("stroke-width", 0)
                                .on('mouseout', function (d) {
                                    d3.select(this.parentNode.parentNode.parentNode).select("#cell-tip").remove();
                                })
                                .on('mouseover', function (d) {
                                    var mouse = d3.mouse(this);
                                    d3.select(this.parentNode.parentNode.parentNode)
                                        .append('text')
                                        .attr('x', mouse[0])
                                        .attr('y', mouse[1])
                                        .attr('id', 'cell-tip')
                                        .text(d.feature_type + ":" + d.feature_value)
                                        ;
                                });

                            voronoi = <HTMLElement>tempVoronoi.node();
                        }
                        d3.select(voronoi).transition().duration(100).style('opacity', 1);
                        this.appendChild(voronoi);
                    });

                this._stack_bar_node.filter(d => d.children)
                    .each(function (d) {
                        var voronoi = document.getElementById('cells_group' + d.id);
                        if (voronoi) {
                            d3.select(voronoi)
                                .transition().duration(100)
                                .style('opacity', 1e-6).each('end', function (d) {
                                    self._subView.each(function () {
                                        this.appendChild(voronoi);
                                    });
                                });
                        }
                    });

                this._stack_bar_node.selectAll("text")
                    .filter((d) => d && (d.children || d._children))
                    .transition()
                    .attr("x", d => d._children ? -15 : 5)
                    .attr("dy", d => d._children ? 50 : ".35em")
                    .style("fill-opacity", 1);

                //Exit node
                var exitNode = this._stack_bar_node.exit();
                exitNode
                    .transition().duration(duration)
                    .each('end', function (d) {
                        console.log("==========exit end");
                        console.log(d);
                        if (d.date) {
                            d3.select("#curve-subView").each(function () {
                                this.appendChild(document.getElementById("cells_group" + d.id));
                            });
                        }

                    })
                    .attr("transform", function (d) {
                        if (exitParent) {
                            d.x = exitParent.x;
                            d.y = exitParent.y;
                        }
                        return "translate(" + [d.x, d.y] + ")";
                    })
                    .remove();
                exitNode.selectAll("g.cells").transition().style('opacity', 1e-6);
                exitNode.select("circle.just_a_node").transition().attr("r", 1e-6);
                exitNode.select("text").transition().style("fill-opacity", 1e-6);

                //Links
                this._stack_bar_link = this._subView.selectAll(".stack.link")
                    .data(this._stack_bar_tree.links(nodex), (d) => d.source.id + "-" + d.target.id);
                //Enter link
                this._stack_bar_link
                    .enter().insert("path", ".stack.node")
                    .attr("class", "stack link")
                    .attr("d", (d) => {
                        var o = { x: d.source.x, y: d.source.y };
                        var result = this._stack_bar_tree_diagonal({ source: o, target: o });
                        return result;
                    })
                    .transition().duration(duration)
                    .attr("d", this._stack_bar_tree_diagonal);
                //Update link
                this._stack_bar_link
                    .transition().duration(duration)
                    .attr("d", this._stack_bar_tree_diagonal);
                //Exit link
                this._stack_bar_link.exit()
                    .transition().duration(duration)
                    .attr("d", (d) => {
                        if (exitParent) {
                            d.x = exitParent.x;
                            d.y = exitParent.y;
                        }
                        var o = { x: d.x, y: d.y };
                        return this._stack_bar_tree_diagonal({ source: o, target: o });
                    })
                    .remove();
            }

            private GetStackNodeType(date: Date): string {
                var stackType: string = "";
                switch (this._manyLens.TimeSpan) {

                    case 3: stackType = "-s" + date.getSeconds();
                    case 2: stackType = "-Min" + date.getMinutes() + stackType;
                    case 1: stackType = "-hour" + date.getHours() + stackType;
                    case 0: stackType = "-day" + date.getDate() + stackType;
                }
                return "" + (this._manyLens.TimeSpan === 0 ?
                    "-year" + date.getFullYear() + "-mounth" + date.getMonth() + stackType :
                    (this._manyLens.TimeSpan === 1 || this._manyLens.TimeSpan === 2) ? "-mounth" + date.getMonth() + stackType : stackType);
                // return "" + ;
            }

            private RefreshGraph(point: Point) {

                //Refresh the curve view
                this._y_scale.domain([0, d3.max(this._data, function (d) { return d.value; })]);
                this._y_axis_gen.scale(this._y_scale);
                this._y_axis.call(this._y_axis_gen);

                var restPathData = [];
                var nodesData = [];
                var sectionData = new Array<Section>();

                var i = 0, len = this._data.length;
                while (i < len) {
                    if (this._data[i].beg) {
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
                        nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });

                        while (this._data[++i] && this._data[i].beg == section.id) {
                            section.features = section.features.concat(this._data[i].features);
                            section.pathPoints.push({ index: i, value: this._data[i].value });
                            nodesData.push({ id: this._data[i].beg, value: this._data[i].value, index: i });
                        }

                        if (this._data[i] && this._data[i].type == 3) {
                            section.end = i;
                            section.pathPoints.push({ index: i, value: this._data[i].value });
                        } else if (this._data[i] && this._data[i].type == 1) {
                            section.end = i - 1;
                            var sectionRestPath = [];
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value });
                            sectionRestPath.push({ index: i, value: this._data[i].value });
                            restPathData.push(sectionRestPath);
                        } else {
                            section.end = i - 1;
                        }

                        sectionData.push(section);
                        if (!this._section_data[section.id] && section.pathPoints.length == 3) {
                            this._section_data[section.id] = section;
                        }

                    } else {
                        var sectionRestPath = [];
                        if (this._data[i - 1])
                            sectionRestPath.push({ index: i - 1, value: this._data[i - 1].value });
                        sectionRestPath.push({ index: i, value: this._data[i].value });

                        while (this._data[++i] && !this._data[i].beg) {
                            sectionRestPath.push({ index: i, value: this._data[i].value });
                        }

                        if (this._data[i])
                            sectionRestPath.push({ index: i, value: this._data[i].value });
                        restPathData.push(sectionRestPath);
                    }
                }

                var self = this;
                var cells = this._subView.selectAll("g.curve.cells")
                    .data(sectionData.filter(d => d.pathPoints.length === 3), d => d.id);

                //Voronoi here
                var sectionIds = Object.keys(this._section_data);
                var constR = this._x_scale(1) - this._x_scale(0);
                if (sectionIds.length > 0) {

                    //Calculate the bound
                    if (!this._voronoi_bound) {
                        var step = 2 * Math.PI * 0.01;
                        var bound = [];
                        for (var i = 99; i >= 0; --i) {
                            var x = constR * Math.cos(i * step);
                            var y = constR * Math.sin(i * step);
                            bound.push([x, y]);
                        }
                        this._voronoi_bound = d3.geom.polygon(bound);
                    }

                    for (let i = 1; i < 3; ++i) {
                        var section: Section = this._section_data[sectionIds[sectionIds.length - i]];
                        if (section && !section.fs && section.pathPoints.length == 3) {
                            var fs = section.features;
                            fs.sort((a, b) => {
                                if (a.feature_type > b.feature_type) return -1;
                                return 1;
                            });

                            //circle type
                            this.CalVoronoi(fs, constR);
                            // LOG
                            // console.log( fs.filter( f => f.feature_type === 'sentiment' ).map( f => Math.log(f.feature_value) ).join( ',' ) );
                            //console.log( fs.filter( f => f.feature_type === 'sentiment' ).map( f => `${f.feature_value}:${f.feature_detail}` ).join( ',' ) );

                            var cellsGroup = cells.enter().insert('g', 'path.curve.section.path')
                                .attr('class', 'curve cells')
                                .attr('id', d => "cells_group" + d.id)
                                .attr("transform", function (d: Section) {
                                    if (d.pathPoints[1]) {
                                        var tY = self._y_scale(d.pathPoints[1].value) + 30;
                                        d3.select(this).attr('tY', tY);
                                        return "translate(" + self._x_scale(d.end - 1) + "," + tY + ")";
                                    }
                                })
                                .on("click", (d) => {
                                    this.SelectSegment(d);
                                });
                            section['fs'] = fs;
                            cellsGroup.append('circle')
                                .attr('class', 'background-circle')
                                .attr('r', constR)
                            cellsGroup.selectAll(".cell")
                                .data(fs)
                                .enter().append("g")
                                .attr("class", "cell")
                                .append("path")
                                .attr("d", d => "M" + d.p.join("L") + "Z")
                                .style("fill", (d: Feature, i) => {
                                    let _feature_vlaue = d.feature_value;
                                    if (d.feature_type in this._voronoi_feature_need_to_be_log) {
                                        _feature_vlaue = Math.log(_feature_vlaue);
                                    }
                                    return this._voronoi_color_scale[d.feature_type](_feature_vlaue);
                                })
                                .style("stroke", 'lightgrey')
                                .style("stroke-width", .0)
                                .on('mouseout', function (d) {
                                    d3.select(this.parentNode.parentNode).select("#cell-tip").remove();
                                    d3.select(this.parentNode.parentNode)
                                        .select('.background-circle')
                                        .style({
                                            'stroke': '#039BE5',
                                            'stroke-width': '4px',
                                            'opacity': '1e-6'
                                        });
                                    d3.select(this.parentNode.parentNode)
                                        .select('.entropy-ring')
                                        .style({ 'fill': '#546E7A'});
                                })
                                .on('mouseover', function (d) {
                                    var mouse = d3.mouse(this);
                                    d3.select(this.parentNode.parentNode)
                                        .append('text')
                                        .attr('x', mouse[0])
                                        .attr('y', mouse[1])
                                        .attr('id', 'cell-tip')
                                        .text(d.feature_type + ":" + d.feature_value);
                                    d3.select(this.parentNode.parentNode)
                                        .select('.background-circle')
                                        .style({
                                            'stroke': '#039BE5',
                                            'stroke-width': '4px',
                                            'opacity': '1'
                                        });
                                    d3.select(this.parentNode.parentNode)
                                        .select('.entropy-ring')
                                        .style({ 'fill': '#fff' });
                                });

                            
                        }
                    }
                }

                var xTime = this._mainView.selectAll(".curve.seg.time-tick").data(sectionData, d => d.id);
                xTime.attr("x", d => this._x_scale(d.beg));
                xTime.enter().append("text")
                    .attr("x", d => this._x_scale(d.beg))
                    .attr("y", this._view_height)
                    .attr("class", "curve seg time-tick")
                    .text((d) => {
                        var date = this._time_formater.parse(d.id);
                        var mon = this.month_names[date.getMonth()];
                        var day = date.getDate();
                        return mon + " " + day;
                    });
                xTime.exit().remove();

                var truelineFunc = d3.svg.line()
                    .x(d => this._x_scale(d.index))
                    .y(d => this._y_scale(d.value))
                    .interpolate("linear");

                var truepath = this._mainView.selectAll(".curve.section.path").data(sectionData, d => d.id);
                truepath.attr("d", d => truelineFunc(d.pathPoints));
                truepath
                    .enter().append("path")
                    .attr("d", d => truelineFunc(d.pathPoints))
                    .attr("class", "curve section path");
                truepath.exit().remove();

                var trueRestPath = this._mainView.selectAll(".curve.rest.true.path").data(restPathData);
                trueRestPath.attr("d", truelineFunc)
                trueRestPath
                    .enter().append("path")
                    .attr("d", truelineFunc)
                    .attr("class", "curve rest true path");
                trueRestPath.exit().remove();

                //handle the seg node
                var nodes = this._mainView.selectAll(".curve.node").data(nodesData, d => d.index);
                nodes
                    .attr("cx", d => self._x_scale(d.index))
                    .attr("cy", d => self._y_scale(d.value));
                nodes.enter().append("circle")
                    .attr("class", "curve node")
                    .attr("cx", d => self._x_scale(d.index))
                    .attr("cy", d => self._y_scale(d.value))
                    .attr("r", 3);
                nodes.exit().remove();

                // move the main view
                if (this._data.length > (this._section_num + 2)) {
                    cells.attr("transform", function (d) {
                        var ty = self._y_scale(d.pathPoints[1].value) + 30;//d3.select( this ).attr( 'tY' );
                        return "translate(" + self._x_scale(d.end - 1) + "," + ty + ")";
                    });

                    d3.transition().duration(200)//this time-step should be equale to the time step of AddPoint() in server.hub
                        .each(() => {
                            this._mainView
                                .attr("transform", null)
                                .transition()
                                .ease("linear")
                                .attr("transform", "translate(" + (this._x_scale(0) - this._x_scale(1)) + ",0)");

                            cells.transition()
                                .ease("linear")
                                .attr("transform", function (d) {
                                    var ty = self._y_scale(d.pathPoints[1].value) + 30;//d3.select( this ).attr( 'tY' );
                                    return "translate(" + self._x_scale(d.end - 2) + "," + ty + ")";
                                });
                        });
                } else {
                    cells.attr("transform", function (d) {
                        var ty = self._y_scale(d.pathPoints[1].value) + 30;//d3.select( this ).attr( 'tY' );
                        return "translate(" + self._x_scale(d.end - 1) + "," + ty + ")";
                    });
                }

                //Refresh the stack rect view
                if (this._data[0].type == 1 || this._data[0].type == 3) {

                    //The stack date
                    var date = this._time_formater.parse(this._data[0].beg);
                    var stackNode: StackNode = {
                        id: this._data[0].beg,
                        date: date,
                        size: 1,
                        oy: this._y_scale(this._data[1].value),
                        name: "d" + date.getDay(),
                        parent: null,
                        children: null,
                        type: this.GetStackNodeType(date),
                        index: this._stack_bar_nodes_data.length
                    }
                    this.InserNode(stackNode.type, stackNode);
                    var exitParent: StackNode = this.FindMinCoParent(this._stack_bar_nodes_data[this._stack_bar_nodes_data.length - 1], stackNode);
                    this.Toggle(exitParent);
                    this._stack_bar_nodes_data.push(stackNode);
                    this.UpdateSubviewTree(exitParent);
                }
            }

            private SelectSegment(d: Section | StackNode) {
                if (d['end'] == -1) {
                    console.log("Segmentation hasn't finished yet!");
                } else if (d['end'] == null || d['end'] != -1) {
                    if (this._element.select(".progress").style("display") !== "block") {
                        this._curveSvg.style("margin-bottom", "0px")
                        this._element.select(".progress").style("display", "block");
                        this.PullInterval(d.id, this._manyLens.CurrentClassifierMapID);
                    } else {
                        console.log("There's pulling a interval now");
                    }
                }
            }

            private GetWeek(date: Date): number {
                var d = new Date(+date);
                d.setHours(0, 0, 0);
                d.setDate(d.getDate() + 4 - (d.getDay() || 7));
                return Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 8.64e7) + 1) / 7);
            }
        }
    }
}