import { GoldValueData, CurrencyValueData, fetchCurrencyChartData } from "./chart_data.js";

google.charts.load("current", { packages: ["corechart", "controls"] });
google.charts.setOnLoadCallback(drawGoldChartWeek);
google.charts.setOnLoadCallback(drawGoldChartMonth);
google.charts.setOnLoadCallback(drawGoldChartHalfYear);


export async function drawGoldChartWeek(datas) {
  const weekData = datas.slice(-7);
  var data = new google.visualization.DataTable();
  data.addColumn("date", "Date");
  data.addColumn("number", "Price");
  data.addRows(weekData.map((row) => [new Date(row[0]), row[1]]));

  // Define chart options
  var options = {
    backgroundColor: { fill: "transparent" },
    hAxis: { textStyle: { color: "#FFFFFF" }, title: "Date", titleTextStyle: { color: "#FFFFFF" } },
    vAxis: { textStyle: { color: "#FFFFFF" } },
    tooltip: { textStyle: { fontSize: 12 } },
    chartArea: { height: "70%" },
    legend: { position: "none" },
    colors: ["#FFFF00"],
  };

  // Create and draw the chart
  var chart = new google.visualization.LineChart(document.getElementById("chartWeek_div"));
  chart.draw(data, options);
}

export async function drawGoldChartMonth(datas) {
  const weekData = datas.slice(-30);
  var data = new google.visualization.DataTable();
  data.addColumn("date", "Date");
  data.addColumn("number", "Price");
  data.addRows(weekData.map((row) => [new Date(row[0]), row[1]]));

  // Define chart options
  var options = {
    backgroundColor: { fill: "transparent" },
    hAxis: { textStyle: { color: "#FFFFFF" }, title: "Date", titleTextStyle: { color: "#FFFFFF" } },
    vAxis: { textStyle: { color: "#FFFFFF" } },
    tooltip: { textStyle: { fontSize: 12 } },
    chartArea: { height: "70%" },
    legend: { position: "none" },
    colors: ["#FFFF00"],
  };

  // Create and draw the chart
  var chart = new google.visualization.LineChart(document.getElementById("chartMonth_div"));
  chart.draw(data, options);
}

export async function drawGoldChartHalfYear(datas) {
  const halfYearData = datas.slice(-183);
  var data = new google.visualization.DataTable();
  data.addColumn("date", "Date");
  data.addColumn("number", "Price");
  data.addRows(halfYearData.map((row) => [new Date(row[0]), row[1]]));

  // Define chart options
  var options = {
    backgroundColor: { fill: "transparent" },
    hAxis: { textStyle: { color: "#FFFFFF" }, title: "Date", titleTextStyle: { color: "#FFFFFF" } },
    vAxis: { textStyle: { color: "#FFFFFF" } },
    tooltip: { textStyle: { fontSize: 12 } },
    chartArea: { height: "70%" },
    legend: { position: "none" },
    colors: ["#FFFF00"],
  };

  // Create and draw the chart
  var chart = new google.visualization.LineChart(document.getElementById("chartHalfYear_div"));
  chart.draw(data, options);
}

$(window).resize(function () {

});


