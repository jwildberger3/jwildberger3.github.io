function normalizeVector(v){
	/* takes an array of numbers and normalizes them to values between 0 and 1 */
	
	var v_max = Math.max(...v);
	var v_min = Math.min(...v);
	var v_normalized = [];
	for (var i = 0; i < v.length; i++){
		var v_norm = (v[i] - v_min) / (v_max - v_min);
		v_normalized.push(v_norm);
	};
	return v_normalized;
};


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
	for (var i=1; i < n_properties; i++) {
		diffs.push(relativeDifference(portfolioValues[i], indexValues[i]))
	};
	var totalScore = 0;
	for (var i=0; i < diffs.length; i++){
		totalScore += diffs[i];
	};
	var similarityScore = (n_properties - totalScore) / n_properties;
	
	return similarityScore;
};