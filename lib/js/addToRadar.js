/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin = { top: 100, right: 150, bottom: 100, left: 150 },
  width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

////////////////////////////////////////////////////////////// 
////////////////////////// Data ////////////////////////////// 
////////////////////////////////////////////////////////////// 
d3.json("lib/data/Index_Simple.json", function(indexJSON) {
d3.json("lib/data/Stocks_Simple.json", function (stockJSON) {
  var data = stockJSON

  function formatEntries(data) {
    var formattedEntries = []
    var tickerNamesOrdered = []
    data.forEach(function (d) {
      var numericalAttributes = []
      var tickerName = ""
      var dataArray = Object.keys(d).map(function (key, i) {
        if (i > 0) {
          numericalAttributes.push([key, d[key]])
        } else {
          tickerName = d[key]
          tickerNamesOrdered.push(d[key])
        }
      });
      var dataMap = numericalAttributes.map((key) => Object({ 'axis': key[0], 'value': key[1] }));
      formattedEntries.push(dataMap)
    });

    return [formattedEntries, tickerNamesOrdered];
  }
  var response = formatEntries(data);
  var dataformatted = response[0];
  var tickerNamesOrdered = response[1];

  var select = d3.select('body')
    .select('#selectStock')
    .attr('class', 'select')
  var color = d3.scale.ordinal()
    .range(["#EDC951", "#CC333F", "#FFFFFF", "#1FD56C", "#BD7AFF"]);

  var options = select
    .selectAll('option')
    .data(tickerNamesOrdered).enter()
    .append('option')
    .text(function (d) { return d; });

  var selected = []
  var stockNumber = 0;

  var allAxis = (dataformatted[0].map(function (i, j) { return i.axis }))

  d3.select('body').select("#AddToPortfolioButton").on('click', onClickAddToPortfolioButton);

  var selectAxis = d3.select('body')
    .select("#selectFactors")
    .attr('class', 'select')
    .on('change', onAxischange)

  var optionsAxis = selectAxis
    .selectAll('option')
    .data(allAxis).enter()
    .append('option')
    .text(function (d) { return d; });

  var selectedAxis = []

  function onAxischange() {
    var selectAxisValue = d3.select('body').select('#selectFactors').property('value');
    selectedAxis.push(selectAxisValue)
    updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)
  };


  ////////////////////////////////////////////////////////////// 
  //////////////////// Draw the Chart ////////////////////////// 
  ////////////////////////////////////////////////////////////// 


  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
  };
  //Call function to draw the Radar chart
  RadarChart(".radarchart", dataformatted, radarChartOptions);
})})