// Get the current price of the selected stock from API. Can also return other current details if needed.
var getQuote = function(selectedStock){
	var url = "https://rapidapi.p.rapidapi.com/v6/finance/quote?symbols=" + selectedStock + "&region=US&lang=en"
	const settings = {
		"async": false,
		"crossDomain": true,
		"url": url,
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "yahoo-finance-low-latency.p.rapidapi.com",
			"x-rapidapi-key": "8198243011msh1a3d727568558c2p143dbajsnc14d99ca25fc"
		}
	};
	var response = $.ajax(settings).done(function (r) {});
	var quote = response['responseJSON']['quoteResponse']["result"][0]["regularMarketPrice"];
	return quote;
};