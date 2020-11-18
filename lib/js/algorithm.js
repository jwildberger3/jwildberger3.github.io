function relativeDifference(s1, s2){
	/* Computes the relative difference (a number between 0 and 1) of two numbers */
	
	var s_max = Math.max(s1, s2);
	var s_min = Math.min(s1, s2);
	return (s_max - s_min) / (Math.abs(s_max) + Math.abs(s_min));
};


function similarity(portfolioScores, indexScores){
	/* 
	Takes two dictionaries of where radar chart attributes are keys and the associated values are the values.
	Returns the similarity score between the two dictionaries' values.
	*/
	
	indexValues = Object.values(indexScores);
	portfolioValues = Object.values(portfolioScores);
	n_properties = portfolioValues.length
	
	var diffs = [];
	for (var i=0; i < n_properties; i++) {
		diffs.push(relativeDifference(portfolioValues[i], indexValues[i])**2)
	};
	var totalScore = 0;
	for (var i=0; i < diffs.length; i++){
		totalScore += diffs[i];
	};
	var similarityScore = (n_properties - totalScore) / n_properties;
	
	return similarityScore;
};

function calculatePortfolioAverages(portfolio){
	/*
	Calculates the weighted average value of each selected attribute for a portfolio of selected stocks.
	
	Inputs:
		- portfolio (list of dictionaries): a list containing a dictionary for each stock in the user's selected portfolio with the structure:
			portfolio = [
				{"ticker", "stockA,
				"weight": .33,
				"attr1": 324,
				"attr2": 32.4,
				"attr3": 2245326.34,
				"attr4": 595,
				"attr5": 0.94
				},
				"ticker", "stockB,
				"weight": .67,
				"attr1": 354,
				"attr2": 21.2,
				"attr3": 845326.10,
				"attr4": 429,
				"attr5": 0.87
				},
				...
				]
				
	Outputs:
		- portfolioAverages (dictionary): contains selected attributes as keys with weighted average values
	*/
	
	// Get attribute names
	attributes = Object.keys(portfolio[0]);  // skips ticker and weight to get to attributes
	
	// for each attribute in attribute names, get the average from portfolio, and add attribute-value to portfolioAverages dictionary
	portfolioAverages = {};
	for (var i=0; i < attributes.length; i++){
		attribute = attributes[i];
		if (attribute != "ticker" && attribute != "weight" && attribute != "trailingPE") {
			attributeWeightedAverage = 0;
			for (var j=0; j < portfolio.length; j++){
				weighting = portfolio[j]["weight"]
				attributeWeightedAverage += parseFloat(portfolio[j][attribute]) * weighting
			};
			portfolioAverages[attribute] = attributeWeightedAverage;
		}
	}
	return portfolioAverages;
};


/* function getIndexList(){
	indexList = require('\data\Index_Simple.json');
	return indexList;
};

var indexList = getIndexList(); */
	

function rankIndices(portfolio, indexList){
	/*
	Ranks indices by similarity to portfolio.
	
	Inputs:
		- portfolio (dictionary): contains selected attribute names as keys with weighted average values of each attribute.
		- index_list (list of dictionaries): similar to portfolio except stocks are replaced with indices and no 'weight' attribute exists.
		
	Outputs:
		- rankedIndices (list of lists): list containing [indexName, similarityScore] for each index, sorted by similarity score (highest first)
	*/
	// Initiate holder for indices which will be placed in order of highest similarity score
	unrankedIndices = [];
	var portfolioAverages;
	
	// calculate the weighted average for each attribute in portfolio and save to dictionary where each attribute is a key
	portfolioAverages = calculatePortfolioAverages(portfolio);
	// Compare similarity of each index with the portfolio and add index with score to list of unranked indices
	portfolioAttributes = Object.keys(portfolioAverages);
	for (var i=0; i < indexList.length; i++){
		indexName = indexList[i]["ticker"]
		indexSubset = {};
		for (var j=0; j < portfolioAttributes.length; j++){
			attribute = portfolioAttributes[j];
			indexSubset[attribute] = indexList[i][attribute];
		};
		similarityScore = similarity(portfolioAverages, indexSubset);
		unrankedIndices.push([indexName, similarityScore]);
	};
	// Sort indices with largest similarity score first
    rankedIndices = unrankedIndices.sort(function(a, b){return b[1]-a[1];});

	return rankedIndices;
};