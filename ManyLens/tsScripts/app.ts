///<reference path = "../Scripts/typings/d3/d3.d.ts" />
///<reference path = "../tsScripts/Cruve.ts" />
"use strict";

document.addEventListener('DOMContentLoaded', function () {
    var curveView = new ManyLens.Curve(d3.select("#cruveView"));
    curveView.render([10, 10]);

    var pieChartLens = new ManyLens.PieChartLens(d3.select("#mapView").select("svg"));
    pieChartLens.render([1]);
});