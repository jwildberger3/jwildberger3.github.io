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
d3.json("lib/data/Stocks_data.json", function (stockJSON) {
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

  // Append the stock options to the dropdown
  var dropdown = document.getElementById("stockInput");
  var selectedStock;

  // Event listener for the stock dropdown
  dropdown.addEventListener("input", onInput);
  function onInput() {
    selectedStock = this.value.toUpperCase();
    tickerNamesOrdered.forEach(function (stock, index) {
      if (selectedStock == stock) {
        showStockDetails(selectedStock);
      }
    });
  }

  // Show the stock details when selected in the dropdown
  function showStockDetails(selectedStock) {
    data.forEach(function (stock) {
      if (stock.ticker == selectedStock) {
        document.getElementById('symbol').innerHTML = "Symbol: " + stock.ticker;
        document.getElementById('previousClose').innerHTML = "Previous Close: $" + parseFloat(stock.previous_close).toFixed(2);
        document.getElementById('beta').innerHTML = "Beta: " + parseFloat(stock.beta).toFixed(2);
        document.getElementById('environmentScore').innerHTML = "Environment Score: " + parseFloat(stock.environmentScore).toFixed(2);
        document.getElementById('governanceScore').innerHTML = "Governance Score: " + parseFloat(stock.governanceScore).toFixed(2);
        document.getElementById('socialScore').innerHTML = "Social Score: " + parseFloat(stock.socialScore).toFixed(2);
        document.getElementById('yield').innerHTML = "Yield: " + (parseFloat(stock.yield) * 100).toFixed(2) + "%";
        document.getElementById('ytdReturn').innerHTML = "YTD Return: " + (parseFloat(stock.ytdReturn) * 100).toFixed(2) + "%";
      }}) 
  }

  function onClickAddToPortfolioButton() {
    data.forEach(function (stock) {
      if (stock.ticker == selectedStock) {
        var stockAlreadyInPortfolio = false;
        var newStockJSON = stock;
        if (typeof percentageValue == 'undefined') {
          percentageValue = parseInt(slider.value);
        }
        newStockJSON.weight = parseInt(percentageValue);
        listOfSelectedStocks.forEach(function (stock, index) {
          if (stock.ticker == selectedStock) {
            alert("This stock has already been added to the portfolio.");
            stockAlreadyInPortfolio = true;
          }
        });

          listOfSelectedStocks.forEach(function (stock, index) {
            var elementSelected = d3.selectAll('.stock').filter(function(d, i) {
              return index == i
            })
              elementSelected.style('color', color(index-1)).select('text').text(stock.ticker);
            })

        if (stockAlreadyInPortfolio) {
          return;
        }

        if ((totalPercentage + percentageValue) > 100) {
          alert("The total percentage of the stocks in your portfolio cannot exceed 100%.");
        } else {
          totalPercentage = totalPercentage + percentageValue;
          listOfSelectedStocks.push(newStockJSON);

          portfolio.innerHTML = "Portfolio " + totalPercentage + "% Allocated";
          var stockNumber = listOfSelectedStocks.length - 1
          AddStockDetailsGrid(selectedStock, percentageValue, stockNumber);
          console.log(listOfSelectedStocks)
          rankedIndices = rankIndices(listOfSelectedStocks, listOfIndexes);
          console.log(rankedIndices)
          createIndexDropdown(rankedIndices);
          updateRadar(selectedAxisTracker,formattedData,orderedTickers,radarOptions);
        }
      }
    })
  }

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

  // var selectAxis = d3.select('body')
  //   .select("#selectFactors")
  //   .attr('class', 'select')
    // .on('change', onAxischange)

  // var optionsAxis = selectAxis
  //   .selectAll('option')
  //   .data(allAxis).enter()
  //   .append('option')
  //   .text(function (d) { return d; });

  var selectedAxis = ["environmentScore", "governanceScore", "socialScore", "beta", "yield"]
  updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)

  // function onAxischange() {
  //   var selectAxisValue = d3.select('body').select('#selectFactors').property('value');
  //   console.log(selectAxisValue)
  //   selectedAxis.push(selectAxisValue)
  //   updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)
  // };

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
})