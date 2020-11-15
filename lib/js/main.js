// Append the stock options to the dropdown
var dropdown = document.getElementById("selectStock");

// Event listener for the stock dropdown
dropdown.addEventListener("change", onSelectChange);
function onSelectChange() {
  var value = this.value;
  showStockDetails(value);
}

// Show the stock details when selected in the dropdown
function showStockDetails(selectedStock) {
  document.getElementById('symbol').innerHTML = "Symbol: " + selectedStock;
  document.getElementById('previousClose').innerHTML = "Previous Close: $" + stockJSON[selectedStock].previous_close.toFixed(2);
  document.getElementById('beta').innerHTML = "Beta: " + stockJSON[selectedStock].beta.toFixed(2);
  document.getElementById('environmentScore').innerHTML = "Environment Score: " + stockJSON[selectedStock].environmentScore.toFixed(2);
  document.getElementById('governanceScore').innerHTML = "Governance Score: " + stockJSON[selectedStock].governanceScore.toFixed(2);
  document.getElementById('socialScore').innerHTML = "Social Score: " + stockJSON[selectedStock].socialScore.toFixed(2);
  document.getElementById('yield').innerHTML = "Yield: " + (stockJSON[selectedStock].yield * 100).toFixed(2) + "%";
  document.getElementById('ytdReturn').innerHTML = "YTD Return: " + (stockJSON[selectedStock].ytdReturn * 100).toFixed(2) + "%";
}

var slider = document.getElementById("sliderRange");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value + "%"; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
var percentageValue;
slider.oninput = function () {
  output.innerHTML = this.value + "%";
  percentageValue = parseInt(this.value);
}

// Add stock to radar graph and to bottom row of grid when button is clicked
// document.getElementById("AddToPortfolioButton").onclick = onClickAddToPortfolioButton;
// var stockNumber = 0;
var listOfSelectedStocks = [];
var totalPercentage = 0; //cannot exceed 100
var portfolio = document.getElementById('portfolio');
var color = d3.scale.ordinal()
  .range(["#EDC951", "#CC333F", "#FFFFFF", "#1FD56C", "#BD7AFF"]);
var selectedAxisTracker = [];
var formattedData = 0;
var orderedTickers = []
var radarOptions = {}

function onClickAddToPortfolioButton() {

  var stockAlreadyInPortfolio = false;
  var selectedStock = dropdown.value;
  var newStockJSON = stockJSON[selectedStock];
  // debugger;
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
    listOfSelectedStocks.push(stockJSON[selectedStock]);

    portfolio.innerHTML = "Portfolio " + totalPercentage + "% Allocated";
    var stockNumber = listOfSelectedStocks.length - 1
    AddStockDetailsGrid(selectedStock, percentageValue, stockNumber);
    updateRadar(selectedAxisTracker,formattedData,orderedTickers,radarOptions)
    // TODO: findSimilarIndexes()
  }
}

// Creates a stock details grid member and refreshes the radar graph with the new selected stock attributes
var stockNumberArray = ["stock0", "stock1", "stock2", "stock3", "stock4"]
var buttonNumberArray = ["button0", "button1", "button2", "button3", "button4"]
function AddStockDetailsGrid(selectedStock, percentageValue, stockNumber) {
  var stock = document.getElementById(stockNumberArray[stockNumber]);
  stock.style.visibility = "visible";
  stock.innerHTML = "Symbol: " + selectedStock + "<br />Allocation: " + percentageValue + "%" + "<br /><button type='button' id='" + buttonNumberArray[stockNumber]
    + "'>Remove</button>";

  var button = document.getElementById(buttonNumberArray[stockNumber]);
  stock.style.visibility = "visible";
  document.getElementById(buttonNumberArray[stockNumber]).onclick = onClickRemoveFromPortfolioButton;
}

// Remove stock from portfolio if button clicked
function onClickRemoveFromPortfolioButton() {
  var stockNumber = parseInt(this.id.charAt(6))
  var stock = document.getElementById(stockNumberArray[stockNumber]);
  stock.style.visibility = "hidden";
  totalPercentage = totalPercentage - listOfSelectedStocks.slice(-1)[0].weight;
  portfolio.innerHTML = "Portfolio " + totalPercentage + "% Allocated";
  listOfSelectedStocks.pop();
  updateRadar(selectedAxisTracker,formattedData,orderedTickers,radarOptions)
}

// TODO: this will be replaced by the aarray returned by the algorithm
// Append the index options to the dropdown
var dropdownIndex = document.getElementById("selectIndex");
for (var index in indexJSON) {
  var option = document.createElement("option");
  option.textContent = index;
  option.value = index;
  dropdownIndex.appendChild(option);
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
// showIndexDetails("VTSAX");
function showIndexDetails(selectedIndex) {
  document.getElementById('symbolIndex').innerHTML = "Symbol: " + selectedIndex;
  document.getElementById('previousCloseIndex').innerHTML = "Previous Close: $" + indexJSON[selectedIndex].previous_close.toFixed(2);
  document.getElementById('betaIndex').innerHTML = "Beta: " + indexJSON[selectedIndex].beta.toFixed(2);
  document.getElementById('environmentScoreIndex').innerHTML = "Environment Score: " + indexJSON[selectedIndex].environmentScore.toFixed(2);
  document.getElementById('governanceScoreIndex').innerHTML = "Governance Score: " + indexJSON[selectedIndex].governanceScore.toFixed(2);
  document.getElementById('socialScoreIndex').innerHTML = "Social Score: " + indexJSON[selectedIndex].socialScore.toFixed(2);
  document.getElementById('yieldIndex').innerHTML = "Yield: " + (indexJSON[selectedIndex].yield * 100).toFixed(2) + "%";
  document.getElementById('ytdReturnIndex').innerHTML = "YTD Return: " + (indexJSON[selectedIndex].ytdReturn * 100).toFixed(2) + "%";
}