$(function () {
    // just test the web api
    //$.get("api/companies").then(function (data) {
    //    $.each(data, function () {
    //        $('<li>', { text: formatItem(this) }).appendTo($('#products'));
    //    });
    //});

    ///******************************
    // Build the curve
    //
    //******************************
    var n = 150; //the number of section
    var data = [];
    var amountFn = function (d, i) { return d; }
    var dateFn = function (d,i) { return i; }
    var height = 200,
        width = $("#curve").width(),
        xpadding = 50,
        ypadding = 20
    ;

    var x = d3.scale.linear()
      .range([xpadding, width-xpadding])
      .domain([0,n]);

    var y = d3.scale.linear()
      .range([height + ypadding, ypadding])
      .domain([0,20]);

    var xAxisGen = d3.svg.axis()
        .scale(x)
        .ticks(n)
        .orient("bottom");

    var yAxisGen = d3.svg.axis()
        .scale(y)
        .ticks(10)
        .orient("left");

    var curveSvg = d3.select("#curve").append("svg")
        .attr("width", width)
        .attr("height", height + ypadding * 2)
    ;

    curveSvg.append("defs").append("clipPath")
            .attr("id", "clip")
        .append("rect")
            .attr("width", width-2*xpadding )
            .attr("height", height)
            .attr("x", xpadding)
            .attr("y", ypadding)
    ;

    var xAxis = curveSvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (ypadding + height) + ")")
        .call(xAxisGen)
    ;

    var yAxis = curveSvg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + xpadding + ",0)")
        .call(yAxisGen)
    ;

    curveSvg.append("g")
           .attr("clip-path", "url(#clip)")
           .append("g")
           .attr("id", "mainView")
       .append("path")
           .attr('stroke', 'blue')
           .attr('stroke-width', 2)
           .attr('fill', 'none')
           .attr("id", "path")
    ;
    var mainView = curveSvg.select("#mainView");


    ///******************************
    // Build the map region
    //
    //******************************

    //build the brush for all som maps
    var somMaps = d3.select("#somMaps");

    var brushX = d3.scale.linear();
    var brushY = d3.scale.linear();
    var brush = d3.svg.brush()
          .x(brushX)
          .y(brushY)
          .on("brushstart",brushstart)
          .on("brush", brushmove)
          .on("brushend",brushend)
    ;

    var brushMap;
    //Clear the previously-active brush, if any
    function brushstart(p) {
        if (brushMap != this) {
            if (brushMap) {
                var svg = d3.select(d3.select(brushMap)[0][0].parentNode);
                svg.select("g.units").selectAll("circle").classed("selected", false);
            }
            d3.select(brushMap).call(brush.clear());
            brushMap = this;
        }
    }

    // Highlight the selected circles.
    function brushmove() {
        var extent = brush.extent();
        var event = d3.event;
        var svg = d3.select(d3.select(this)[0][0].parentNode);
        var xPadding = svg.data()[0].xPadding;
        var yPadding = svg.data()[0].yPadding;
        svg.select("g.units").selectAll("circle").classed("selected", function (d) {
            var x = (d.x + 0.5) * xPadding;
            var y = (d.y + 0.5) * yPadding;
            return x >= extent[0][0] && x < extent[1][0] && y >= extent[0][1] && y < extent[1][1];

        });

        if (event.sourceEvent.ctrlKey)
            console.log(event);
    }

    function brushend(p) {

    }

    d3.select("#reOrganizeMode")
        .on("click", radioChange);
    d3.select("#moveMode")
        .on("click", radioChange);

    function radioChange() {
        var radioValue = d3.select(this)[0][0].value;
        if (radioValue == "Re-Organize") {
            d3.select("#buttons").style("display", "block");

            d3.selectAll(".somMap").select("svg").append("g").attr("class", "brush").call(brush.clear());
            d3.selectAll(".somMap").select("svg")
                .on("mousedown", null)
                .on("mousemove", null)
                .on("mouseup", null)
            ;

        } else if (radioValue == "Move") {
            d3.select("#buttons").style("display", "none");

            if (brushMap) {
                var svg = d3.select(d3.select(brushMap)[0][0].parentNode);
                svg.select("g.units").selectAll("circle").classed("selected", false);
            }
            d3.selectAll(".somMap").select(".brush").remove();

            var timer;
            var selectedUnits = [];
            d3.selectAll(".somMap").select("svg")
                .on("mousedown", function () {
                    smartSelectDown(this,timer,selectedUnits);
                })
                .on("mousemove", function () {
                    smartSelectMove(this);
                })
                .on("mouseup", function () {
                    smartSelectUp(this,timer, selectedUnits);
                });
        }
    }

    function smartSelectDown(container,timer,selectedUnits) {
        var p = d3.mouse(container);
        d3.select(container).append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("id", "moveCircle")
            .attr("r", 100)
            .attr("fill-opacity", 0.2)
            .property("finishLong", false)
            .property("fadeouting", false)
        ;
        timer = setTimeout(function () {
            d3.select("#moveCircle")
                 .property("finishLong", true)
            ;
        }, 1000);

        var finalR = 20.1;
        d3.select("#moveCircle")
            .transition()
            .duration(1000)
            .attr("r", finalR)
            .each("end", function () {
                d3.select(this)
                    .style("stroke", "red")
                ;

                d3.select(container).select(".units").selectAll("circle").each(function (d) {
                    var cx = d3.select(this).attr("cx");
                    var cy = d3.select(this).attr("cy");
                    if (cx > (p[0] - finalR) && cx < (p[0] + finalR) && cy > (p[1] - finalR) && cy < (p[1] + finalR)) {
                        var dx = cx - p[0];
                        var dy = cy - p[1];
                        dx = dx * dx;
                        dy = dy * dy;
                        if ((dx + dy) < finalR * finalR) {
                            selectedUnits.push(d.unitID);
                        }
                    }
                });
                selectedUnits.push(finalR);
            })
        ;
        
        
    }
    function smartSelectMove(container) {
        var moveCircle = d3.select("#moveCircle");
        if (moveCircle.empty() || moveCircle.property("fadeouting"))
            return false;

        if (moveCircle.property("finishLong")) {
            var p = d3.mouse(container);
            moveCircle
                .attr("cx", p[0])
                .attr("cy", p[1])
            ;
        } else {
            moveCircle
                .property("fadeouting", true)
            .transition()
            .duration(200)
                .style("opacity", 1e-6)
                .remove();
        }
    }

    function smartSelectUp(container,timer, selectedUnits) {
        clearTimeout(timer);
        var moveCircle = d3.select("#moveCircle");
        if (moveCircle.empty())
            return false;

        moveCircle
            .transition()
            .duration(100)
            .style("opacity", 1e-6)
            .remove();

        var finalR = selectedUnits.pop();
        if (selectedUnits.length > 0) {
            var p = d3.mouse(container);
            var toUnits = [];
            d3.select(container).select(".units").selectAll("circle").each(function (d) {
                var cx = d3.select(this).attr("cx");
                var cy = d3.select(this).attr("cy");
                if (cx > (p[0] - finalR) && cx < (p[0] + finalR) && cy > (p[1] - finalR) && cy < (p[1] + finalR)) {
                    var dx = cx - p[0];
                    var dy = cy - p[1];
                    dx = dx * dx;
                    dy = dy * dy;
                    if ((dx + dy) < finalR * finalR) {
                        toUnits.push(d.unitID);
                    }
                }
            });

            console.log(selectedUnits);
            console.log(toUnits);
            hub.server.moveTweets(d3.select(container).data()[0].mapID, selectedUnits, toUnits);
        }
        
        while (selectedUnits.length) {
            selectedUnits.pop();
        }
    }

    //set click function for the three buttons
    //Click to reOrganize the map
    d3.select("#reOrganize")
        .on("click", function reOrganize() {
            if (brushMap) {
                var selectedUnits = [];
                var svg = d3.select(d3.select(brushMap)[0][0].parentNode);
                svg.select("g.units").selectAll("circle.selected").each(function (d) {
                    selectedUnits.push(d.unitID);
                });
                hub.server.reOrganize(svg.data()[0].mapID, selectedUnits);
            }
        })
    ;

    //Select the tweets to be moved
    d3.select("#fromUnits")
        .on("click", function fromUnits() {
            if (brushMap) {
                var selectedUnits = [];
                var svg = d3.select(d3.select(brushMap)[0][0].parentNode);
                svg.select("g.units").selectAll("circle.selected").each(function (d) {
                    selectedUnits.push(d.unitID);
                });
                console.log(selectedUnits);
            }
        })
    ;

    //Define the destination for the tweets to be moved
    d3.select("#toUnits")
        .on("click", function toUnits() {
            if (brushMap) {
                var selectedUnits = [];
                var svg = d3.select(d3.select(brushMap)[0][0].parentNode);
                svg.select("g.units").selectAll("circle.selected").each(function (d) {
                    selectedUnits.push(d.unitID);
                });
                console.log(selectedUnits);
            }
        })
    ;
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var markData = [];
    var lastMark = {id:null, type:2};
    var refreshGaph = function (mark) {
        y.domain([0, d3.max(data)]);
        yAxisGen.scale(y);
        curveSvg.select(".y.axis").call(yAxisGen);
    
        if (mark.type == 2 || mark.type == 3) {
            var eid = mark.id;
            var iter = markData.length - 1;
            while (iter >= 0 && (markData[iter].type == 4 || markData[iter].type == 1)) {
                markData[iter].end = eid;
                --iter;
            }
            if (markData[iter].type == 3) {
                markData[iter].end = eid;
            }

            mark.beg = mark.id;
            markData.push(mark);

            lastMark = mark;
        } else {
            if (mark.type == 4) {
                mark.beg = lastMark.id;
            }
            markData.push(mark);
            if(mark.type == 1)
                lastMark = mark;
        }

        //handle the seg line
        mainView.selectAll(".mark").remove();
        var lines = mainView.selectAll(".mark").data(markData);
        lines.enter().append("line")
            .attr("x1", function (d, i) {
                return x(dateFn(d, i));
            })
            .attr("x2", function (d, i) {
                return x(dateFn(d, i));
            })
            .attr("y1", function (d) {
                return ypadding;
            })
            .attr("y2", function (d) {
                if(d.type == 1 || d.type == 2 || d.type == 3)
                    return height + ypadding;
                return ypadding;
            })
            .attr('stroke', function (d) { return d.type == 1 ? 'red' : d.type == 2? 'green':'navy'; })
            .attr('stroke-width', 2)
            .attr("class","mark")
        ;

        //handle the seg rect
        mainView.selectAll(".seg").remove();
        var rects = mainView.selectAll(".seg").data(markData);
        rects.enter().append("rect")
            .attr("x", function (d, i) {
                return x(dateFn(d, i));
            })
            .attr("y", function (d, i) {
                return ypadding;
            })
            .attr("width", function (d) {
                if (d.type == 1 || d.type == 4 || d.type == 3)
                    return (x(dateFn(0,1)) - x(dateFn(0,0)));
                return 0;
            })
            .attr("height", height)
            .attr("class", "seg")
            .on("click",selectSegment)
        ;

        var lineFunc = d3.svg.line()
                .x(function (d, i) {
                    return x(dateFn(d, i));
                })
                .y(function (d, i) {
                    return y(amountFn(d, i));
                })
                .interpolate("linear")
        ;

        //handle the line path
        mainView.selectAll("#path")
            //.transition(1)
            .attr("d", lineFunc(data))
        ;

        // move the main view
        if (data.length > (n + 1))
            mainView
                .attr("transform", null)
            .transition()
                .duration(0)
                .ease("linear")
                .attr("transform", "translate(" + (x(dateFn(0,0))-x(dateFn(0,1))) + ",0)")
            ;
        if(markData.length > (n+1))
            markData.shift();
    }
    var selectSegment = function () {
        var obj = d3.select(this).data()[0];
        $("#curve").append($("<progress>", { id: "progressBar", max: "1" }));
        $("#curve").append($("<span>", { id: "progressValue" }));
        if (obj.end != null)
            hub.server.pullInteral(obj.beg)
                .progress(function (percent) {
                    $("#progressBar").attr("value", percent);
                    $("#progressValue").html(+(percent).toFixed(2)*100 + " %");
                })
                .done(function () {
                    $("#progressBar").remove();
                    $("#progressValue").remove();
                });
        else
            console.log("Segmentation hasn't finished yet!");
    };

    var hub = $.connection.myHub;
    hub.client.showMSG = function (string) {
        console.log(string);
    }

    hub.client.addPoint = function (obj) {
        data.push(obj.value);
        refreshGaph(obj.mark);
        if(data.length > (n+1))
            data.shift();
    }

    //var mapNum = 0;
    var somMapWidth = 300.0;
    var somMapHeight = 300.0;
    brushX.range([0, somMapWidth]).domain([0, somMapWidth]);
    brushY.range([0, somMapHeight]).domain([0, somMapHeight]);
    hub.client.showVIS = function (visData) {
        if (!d3.select("#mapDiv" + visData.mapID).empty())
            return;
        //mapNum = mapNum + 1;
        
        var xPadding = somMapWidth / (visData.width + 1);
        var yPadding = somMapHeight/ (visData.height + 1);

        var svg = somMaps.append("div")
                    .attr("id", "mapDiv" + visData.mapID)
                    .attr("class", "somMap")
                .append("svg")
                    .data([{mapID:visData.mapID,width:visData.width,height:visData.height,xPadding:xPadding,yPadding:yPadding}])
                    .attr("id", function (d) { return "mapSvg"+d.mapID;})
                    .attr("width", somMapWidth)
                    .attr("height", somMapHeight)
        ;

        var xx = h337.create({ 
            "element": document.getElementById("mapDiv"+visData.mapID), 
            "radius": Math.max(xPadding,yPadding), 
            "visible": true, 
            "width": somMapWidth, 
            "height": somMapHeight
        });

        xx.store.setDataSet(visData,xPadding,yPadding);
        
        svg.append("g")
            .attr("class", "units")
        .selectAll("circle")
            .data(visData.unitsData)
        .enter().append("circle")
            .attr("r", 4)
            .attr("cx", function (d) { return (d.x + 0.5) * xPadding; })
            .attr("cy", function (d) { return (d.y + 0.5) * yPadding; })
        ;

        if (d3.select("#moveMode").property("checked")) {
            var timer;
            var selectedUnits = [];
            svg
                .on("mousedown", function () {
                    smartSelectDown(this, timer, selectedUnits);
                })
                .on("mousemove", function () {
                    smartSelectMove(this);
                })
                .on("mouseup", function () {
                    smartSelectUp(this,timer, selectedUnits);
                });
        }else {
            svg.append("g")
                .attr("class", "brush")
                .call(brush.clear());
        }
    }
    hub.client.reDrawSOMMap = function (data) {
        var visData = data;
        var svg = d3.select("#mapSvg" + visData.mapID);
        var xPadding = svg.data()[0].xPadding;
        var yPadding = svg.data()[0].yPadding;

        d3.select("#mapDiv" + visData.mapID).select("canvas").remove();
        var xx = h337.create({
            "element": document.getElementById("mapDiv" + visData.mapID),
            "radius": Math.max(xPadding, yPadding),
            "visible": true,
            "width": somMapWidth,
            "height": somMapHeight
        });
        xx.store.setDataSet(visData, xPadding, yPadding);

        var units = svg.select("g")
                        .selectAll("circle")
                            .data(visData.unitsData)
        ;

        units.enter().append("circle")
            .attr("r", 4)
            .attr("cx", function (d) { return (d.x + 0.5) * xPadding; })
            .attr("cy", function (d) { return (d.y + 0.5) * yPadding; })

        units.exit()
        .remove();
    }

    $.connection.hub.start().done(function () {
        $('#push').click(function () {
            hub.server.pullPoint(2);
        });

        $('#add').click(function () {
            hub.server.pullPoint(1);

        });
    });

});
