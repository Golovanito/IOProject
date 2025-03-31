import { GoldValueData, CurrencyValueData } from "./chart_data.js";

let weatherData=null;

async function getData() {
  await new Promise(resolve => {
    document.addEventListener("DOMContentLoaded", resolve);
  });
  const element = document.getElementById('Weather_chart_div');
  return element ? element.getAttribute('data') : null;
}

async function parseWeatherData() {
  const rawData = await getData();

  if (!rawData) {
    console.error("Data not found!");
    return null;
  }

  const jsonString = rawData.replace(/'/g, '"');

  const weatherData = JSON.parse(jsonString);
  return weatherData;
}

weatherData=await parseWeatherData();

google.charts.load("current", { packages: ["corechart", "controls"] });
google.charts.setOnLoadCallback(drawEconomyChart);
google.charts.setOnLoadCallback(drawWeatherChart);

var dataSources = {
  gold: {
    title: "Ceny złota",
    data: GoldValueData,
  },
  PLN: {
    title: "Cena PLN-USD",
    data: CurrencyValueData,
  },
};

var currentDataKey = "gold";

async function drawEconomyChart() {
  var selectedData = dataSources[currentDataKey];

  var data = new google.visualization.DataTable();
  data.addColumn("date", "Date");
  data.addColumn("number", "Price");
  data.addRows(selectedData.data.map((row) => [new Date(row[0]), row[1]]));

  var options = {
    fontSize: 10,
    title: selectedData.title.toUpperCase(),
    backgroundColor: { fill: "transparent" },
    tooltip: { textStyle: { fontSize: 15 } },
    chartArea: { height: "70%" },
    legend: { position: "none" },
    colors: ["#224F75"],
    hAxis: {
      textPosition: 'none',
    },
  };

  var dashboard = new google.visualization.Dashboard(
    document.getElementById("dashboard_div")
  );

  var dateRangeFilter = new google.visualization.ControlWrapper({
    controlType: "DateRangeFilter",
    containerId: "date_range_filter_div",
    options: {
      filterColumnIndex: 0, 
      filterColumnIndex: 0, 
      ui: {
        label: "",
        format: { pattern: "dd/MM/yyyy" },
        labelStyle: { fontSize: "6px" },
        cssClass: "narrow-slider",
      },
    },
  });

  var chart = new google.visualization.ChartWrapper({
    chartType: "LineChart",
    containerId: "Economy_chart_div",
    options: options,
  });

  dashboard.bind(dateRangeFilter, chart);
  dashboard.draw(data);
}

window.updateChart = function () {
  currentDataKey = document.getElementById("dataSelector").value;
  drawEconomyChart();
};


// CHART 2

async function drawWeatherChart() {
  let titleW = "";
  const city = document.getElementById('citySelect').value;
  const data = new google.visualization.DataTable();
        data.addColumn('string', 'Day');
        data.addColumn('number', 'Temperature (°C)');

        weatherData[city].forEach((dayData, index) => {
          data.addRow([`Dzień ${index + 1}`, dayData[0]]);
        });

  titleW = `Temperatura z 7 dni ${city} [℃]`;
  var options = {
    title: titleW,
    backgroundColor: { fill: "transparent" },
    chartArea: {
      height: "70%",
    },
    legend: { position: "none" },
    colors: ["#224F75"],
    hAxis: {
      title: '', 
      textPosition: 'none',
    },
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("Weather_chart_div")
  );
  chart.draw(data, options);
}

document.getElementById('citySelect').addEventListener('change', drawWeatherChart);

$(window).resize(function () {
  drawEconomyChart();
  drawWeatherChart();
});

setTimeout(drawEconomyChart, 500);
setTimeout(drawWeatherChart, 500);
