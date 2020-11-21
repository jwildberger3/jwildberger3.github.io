var slider = document.getElementById("sliderRange");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value + "%"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
var percentageValue;
slider.oninput = function () {
  output.innerHTML = this.value + "%";
  percentageValue = parseInt(this.value);
}

var listOfSelectedStocks = [];
var totalPercentage = 0; //cannot exceed 100
var portfolio = document.getElementById('portfolio');
var color = d3.scale.ordinal()
  .range(["#EDC951", "#CC333F", "#FFFFFF", "#1FD56C", "#BD7AFF"]);
var selectedAxisTracker = [];
var formattedData = 0;
var orderedTickers = []
var radarOptions = {}
var dropdownIndex = document.getElementById("selectIndex");



// Read index data
var listOfIndexes = [];
d3.json("lib/data/Index_data.json", function (stockJSON) {
	listOfIndexes = stockJSON
})

// Creates a stock details grid member and refreshes the radar graph with the new selected stock attributes
var stockNumberArray = ["stock0", "stock1", "stock2", "stock3", "stock4"]
var buttonNumberArray = ["button0", "button1", "button2", "button3", "button4"]
function AddStockDetailsGrid(selectedStock, percentageValue, stockNumber) {
  var stock = document.getElementById(stockNumberArray[stockNumber]);
  stock.style.visibility = "visible";
  stock.innerHTML = "Symbol: " + selectedStock + "<br />Allocation: " + percentageValue + "%" + "<br /><button type='button' id='" + buttonNumberArray[stockNumber]
    + "'>Remove</button>";

  var button = document.getElementById(buttonNumberArray[stockNumber]);
  document.getElementById(buttonNumberArray[stockNumber]).onclick = onClickRemoveFromPortfolioButton;

  for (var i=0; i < stockNumber; i++) {
  	var prevButton = document.getElementById(buttonNumberArray[i]);
  	prevButton.style.visibility = "hidden";
  }
}

// Remove stock from portfolio if button clicked
function onClickRemoveFromPortfolioButton() {
  var stockNumber = parseInt(this.id.charAt(6))
  var stock = document.getElementById(stockNumberArray[stockNumber]);
  stock.style.visibility = "hidden";
  var button = document.getElementById(buttonNumberArray[stockNumber]);
  button.style.visibility = "hidden";
  var prevButtonNumber = stockNumber - 1;
  if (prevButtonNumber >= 0) {
  	var prevButton = document.getElementById(buttonNumberArray[prevButtonNumber]);
  	prevButton.style.visibility = "visible";
  } else {
  	var prevButton = document.getElementById(buttonNumberArray[0])
  	prevButton.style.visibility = "hidden";
  }
  totalPercentage = totalPercentage - listOfSelectedStocks.slice(-1)[0].weight;
  portfolio.innerHTML = "Portfolio " + totalPercentage + "% Allocated";
  listOfSelectedStocks.pop();
  rankedIndices = rankIndices(listOfSelectedStocks, listOfIndexes);
  createIndexDropdown(rankedIndices);
  updateRadar(selectedAxisTracker,formattedData,orderedTickers,radarOptions);
}

function createIndexDropdown(rankedIndices) {
  dropdownIndex.innerHTML = "";
  // Append the index options to the dropdown
  for (var i=0; i < 10; i++) {
  	var rankedIndex = rankedIndices[i][0];
    var option = document.createElement("option");
    for (let index of listOfIndexes) {
  		if (index.ticker == rankedIndex) {
    		option.textContent = (i + 1) + ". " + index.ticker;
    		option.value = index.ticker;
    		dropdownIndex.appendChild(option);
    		break;
    	}
    }
	}
	showIndexDetails(rankedIndices[0][0]);
}

// Event listener for the index dropdown
dropdownIndex.addEventListener("change", onSelectChangeIndex);
function onSelectChangeIndex() {
  var value = this.value;
  showIndexDetails(value);
}

function updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions) {
  var selectedAxi = selectedAxis.slice(Math.max(selectedAxis.length - 5, 0))
  selectedAxisTracker = selectedAxi
  var overallData = []
  var listOfSelectedTickers = listOfSelectedStocks.map(function(d) {
    return d.ticker})
  formattedData = dataformatted
  orderedTickers = tickerNamesOrdered
  radarOptions = radarChartOptions
  dataformatted.map(function (d, i) {
    if (listOfSelectedTickers.includes(tickerNamesOrdered[i])) {
      var specialData = []
      d.forEach(function (ax) {
        if (selectedAxi.indexOf(ax.axis) >= 0) {
          specialData.push(ax)
        }
      })
      overallData.push(specialData)
    }
  })
  RadarChart(".radarchart", overallData, radarChartOptions);
}

// Show details for the index
function showIndexDetails(selectedIndex) {
	for (let index of listOfIndexes) {
	  if (index.ticker == selectedIndex) {
			  document.getElementById('symbolIndex').innerHTML = "Symbol: " + index.ticker;
			  document.getElementById('previousCloseIndex').innerHTML = "Previous Close: $" + parseFloat(index.previous_close).toFixed(2);
			  document.getElementById('betaIndex').innerHTML = "Beta: " + parseFloat(index.beta).toFixed(2);
			  document.getElementById('environmentScoreIndex').innerHTML = "Environment Score: " + parseFloat(index.environmentScore).toFixed(2);
			  document.getElementById('governanceScoreIndex').innerHTML = "Governance Score: " + parseFloat(index.governanceScore).toFixed(2);
			  document.getElementById('socialScoreIndex').innerHTML = "Social Score: " + parseFloat(index.socialScore).toFixed(2);
			  document.getElementById('yieldIndex').innerHTML = "Yield: " + (parseFloat(index.yield) * 100).toFixed(2) + "%";
			  document.getElementById('ytdReturnIndex').innerHTML = "YTD Return: " + parseFloat(index.ytdReturn).toFixed(2) + "%";
			  break;
		}
	}
}

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
    for (let stock of tickerNamesOrdered) {
      if (selectedStock == stock) {
        showStockDetails(selectedStock);
        break;
      }
    };
  }

  // Show the stock details when selected in the dropdown
  function showStockDetails(selectedStock) {
  	for (let stock of data) {
      if (stock.ticker == selectedStock) {
        document.getElementById('symbol').innerHTML = "Symbol: " + stock.ticker;
        document.getElementById('logoUrl').innerHTML = "<img src="+stock.logo_url+">";
        document.getElementById('previousClose').innerHTML = "Previous Close: $" + parseFloat(stock.previous_close).toFixed(2);
        document.getElementById('beta').innerHTML = "Beta: " + parseFloat(stock.beta).toFixed(2);
        document.getElementById('environmentScore').innerHTML = "Environment Score: " + parseFloat(stock.environmentScore).toFixed(2);
        document.getElementById('governanceScore').innerHTML = "Governance Score: " + parseFloat(stock.governanceScore).toFixed(2);
        document.getElementById('socialScore').innerHTML = "Social Score: " + parseFloat(stock.socialScore).toFixed(2);
        document.getElementById('yield').innerHTML = "Yield: " + (parseFloat(stock.yield) * 100).toFixed(2) + "%";
        document.getElementById('ytdReturn').innerHTML = "YTD Return: " + parseFloat(stock.ytdReturn).toFixed(2) + "%";
        break;
      }
    }
  }

	// Add stock to radar graph and to bottom row of grid when button is clicked
  function onClickAddToPortfolioButton() {
  	for (let stock of data) {
      if (stock.ticker == selectedStock) {
        var stockAlreadyInPortfolio = false;
        var newStockJSON = stock;
        if (typeof percentageValue == 'undefined') {
          percentageValue = parseInt(slider.value);
        }
        newStockJSON.weight = parseInt(percentageValue);
        for (let stock of listOfSelectedStocks) {
          if (stock.ticker == selectedStock) {
            alert("This stock has already been added to the portfolio.");
            stockAlreadyInPortfolio = true;
            break;
          }
        };

        if (stockAlreadyInPortfolio) {
          return;
        }

        if ((totalPercentage + percentageValue) > 100) {
          alert("The total percentage of the stocks in your portfolio cannot exceed 100%.");
        } else {
          totalPercentage = totalPercentage + percentageValue;
          listOfSelectedStocks.push(newStockJSON);
          listOfSelectedStocks.forEach(function (stock, index) {
            var elementSelected = d3.selectAll('.stock').filter(function(d, i) {
              return index == i
            })
              elementSelected.style('color', color(index)).select('text').text(stock.ticker);
            })
          portfolio.innerHTML = "Portfolio " + totalPercentage + "% Allocated";
          var stockNumber = listOfSelectedStocks.length - 1
          AddStockDetailsGrid(selectedStock, percentageValue, stockNumber);
          rankedIndices = rankIndices(listOfSelectedStocks, listOfIndexes);
          createIndexDropdown(rankedIndices);
          updateRadar(selectedAxisTracker,formattedData,orderedTickers,radarOptions);
        }
        break;
      }
    }
  }

  var select = d3.select('body')
    .select('#selectStock')
    .attr('class', 'select')

  var options = select
    .selectAll('option')
    .data(tickerNamesOrdered).enter()
    .append('option')
    .text(function (d) { return d; });

  var selected = []
  var stockNumber = 0;

  var allAxis = (dataformatted[0].map(function (i, j) { return i.axis }))



  d3.select('body').select("#AddToPortfolioButton").on('click', onClickAddToPortfolioButton);
  function toggles(b) {
    if (b.text().includes("On")) {
      b.text(b.text().split(" ")[0].concat(" Off"))
      b.style("color","red")
    } else {
      b.text(b.text().split(" ")[0].concat(" On"))
      b.style("color","blue")
    }
  }
  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
  };

  function tog1() {
    toggles(d3.select('body').select("#b1"))
    updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)
  }
  function tog2() {
    toggles(d3.select('body').select("#b2"))
    updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)
  }
  function tog3() {
    toggles(d3.select('body').select("#b3"))
    updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)
  }
  function tog4() {
    toggles(d3.select('body').select("#b4"))
    updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)
  }
  function tog5() {
    toggles(d3.select('body').select("#b5"))
    updateRadar(selectedAxis,dataformatted,tickerNamesOrdered,radarChartOptions)
  }
  d3.select('body').select("#b1").on("click", tog1);
  d3.select('body').select("#b2").on("click", tog2);
  d3.select('body').select("#b3").on("click", tog3);
  d3.select('body').select("#b4").on("click", tog4);
  d3.select('body').select("#b5").on("click", tog5);
  var color = d3.scale.ordinal()
  .range(["#EDC951", "#CC333F", "#FFFFFF", "#1FD56C", "#BD7AFF"]);
  // debugger;

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

  //Call function to draw the Radar chart
  RadarChart(".radarchart", dataformatted, radarChartOptions);

})