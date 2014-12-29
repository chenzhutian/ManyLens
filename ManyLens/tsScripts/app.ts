///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../tsScripts/Cruve.ts" />
"use strict";

document.addEventListener('DOMContentLoaded', function () {
    var curveView = new ManyLens.Curve(d3.select("#cruveView"));
    curveView.render([10, 10]);

    //var pieChartLens = new ManyLens.PieChartLens(d3.select("#mapView").select("svg"));
    //pieChartLens.render();
    //var wordCloudLens = new ManyLens.WordCloudLens(d3.select("#mapView").select("svg"));
    //wordCloudLens.render();
    var networkLens = new ManyLens.NetworkTreeLens(d3.select("#mapView").select("svg"));
    networkLens.render();
});