// Append the stock options to the dropdown
var dropdown = document.getElementById("selectStock");
for (var stock in stockJSON) {
  var option = document.createElement("option");
  option.textContent = stock;
  option.value = stock;
  dropdown.appendChild(option);
}

// Event listener for the dropdown
dropdown.addEventListener("change", onSelectChange);
function onSelectChange(){
  var value = this.value;
  showStockDetails(value);
}

// Show the stock details when selected in the dropdown
function showStockDetails(selectedStock){
  document.getElementById('symbol').innerHTML = "Symbol: " + selectedStock;
  document.getElementById('previousClose').innerHTML = "Previous Close: $" + stockJSON[selectedStock].previous_close.toFixed(2);
  document.getElementById('beta').innerHTML = "Beta: " + stockJSON[selectedStock].beta.toFixed(2);
  document.getElementById('environmentScore').innerHTML = "Environmental Score: " + stockJSON[selectedStock].environmentScore.toFixed(2);
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
slider.oninput = function() {
  output.innerHTML = this.value + "%";
  percentageValue = this.value;
} 

// Add stock to radar graph and to bottom row of grid when button is clicked
document.getElementById("AddToPortfolioButton").onclick = onClickAddToPortfolioButton;
var stockNumber = 0;
var listOfSelectedStocks = [];
function onClickAddToPortfolioButton(){
  var selectedStock = dropdown.value;
  var newStockJSON = stockJSON[selectedStock];
  if (typeof percentageValue == 'undefined') {
    percentageValue = slider.value;
  }
  newStockJSON.weight = parseInt(percentageValue);
  listOfSelectedStocks.push(stockJSON[selectedStock]);
  console.log(listOfSelectedStocks);
  AddStockDetailsGrid(selectedStock, percentageValue, stockNumber++);
  // TODO: createRadarGraph()
  // TODO: findSimilarIndexes()
}

// Creates a stock details grid member and refreshes the radar graph with the new selected stock attributes
const stockNumberArray = ["stock0", "stock1", "stock2", "stock3", "stock4"]
function AddStockDetailsGrid(selectedStock, percentageValue, stockNumber){
  var stock = document.getElementById(stockNumberArray[stockNumber]);
  stock.style.visibility = "visible";
  stock.innerHTML = "Symbol: " + selectedStock + "<br />" + "Percentage of Portfolio: " + percentageValue + "%";
}