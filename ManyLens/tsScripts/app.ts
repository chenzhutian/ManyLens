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
    //var networkLens = new ManyLens.NetworkTreeLens(d3.select("#mapView").select("svg"));
    //networkLens.render();
    //var barChartLens = new ManyLens.BarChartLens(d3.select("#mapView").select("svg"));
    //barChartLens.render();
    //var locationMap = new ManyLens.LocationLens(d3.select("#mapView").select("svg"));
    //locationMap.render();

    //var historyTrees = new ManyLens.HistoryTrees(d3.select("#historyView").select("svg"));
    //var lensPane = new ManyLens.LensPane(d3.select("#mapView").select("svg"));
    //lensPane.bindHistoryTrees(historyTrees);
    //lensPane.render();

    var historyTrees = new ManyLens.HistoryTrees(d3.select("#historyView").select("svg"));
    var lensPane = new ManyLens.ClassicLensPane(d3.select("#mapView").select("svg"));
    lensPane.bindHistoryTrees(historyTrees);
    lensPane.render();
});