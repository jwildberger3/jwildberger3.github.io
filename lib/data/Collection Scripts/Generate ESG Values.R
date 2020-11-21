library(readxl)
library(purrr)
setwd("C:/Users/rober/Documents/Georgia Tech/CSE 6242 - Data & Visual Analytics/Group Project/data/Stock Index Data")

index_reference <-read.csv("Generate Ticker.xlsx", stringsAsFactors=FALSE)
colnames(index_reference)[c(1,3)] <- c("INDEX", "STOCK")
stock_ref <- read.csv("Stock Reference for ETF.csv", stringsAsFactors = FALSE)
stock_ref <- stock_ref[,c("ticker","socialScore", "environmentScore","governanceScore",  "yield", "beta3Year", "forwardPE", "trailingPE", "averageDailyVolume10Day", "ytdReturn", "beta", "dividendYield")]


## Merge list of component stocks with stock data
combo_data <- merge(index_reference, stock_ref, by.x="STOCK", by.y="ticker" )

## split data into list of dataframes for easier calculation based on components
combo.lst <- split(combo_data, combo_data$INDEX)

## map over each listed dataframe component to calculate AVG stats for dataframe
generate_stats <- map_df(combo.lst, function(x) {
  interest_columns <- c("socialScore", "environmentScore", "governanceScore", "trailingPE", "forwardPE")
  o_ <- data.frame("INDEX"= x$INDEX[1], stringsAsFactors = FALSE)
  o_[,interest_columns] <- colSums(x[,interest_columns] * x$Percentage, na.rm=TRUE)
  o_[,paste(interest_columns,"PERC", sep=".")] <- map_dbl(x[,interest_columns], function(y){sum(x$Percentage[!is.na(y)], na.rm=TRUE)})
  o_[,paste(interest_columns,"AVG", sep=".")] <- round(o_[,interest_columns]/o_[,paste(interest_columns,"PERC", sep=".")],3)
  return(o_)
})

write.csv(generate_stats, "Generated Index Values.csv", row.names=FALSE)




stop()
###########
#### Replace Missing Values with generated values
etf_data <- read.csv("All ETF Data2.csv", stringsAsFactors = FALSE)
head(etf_data)
keep_columns <- c("ticker","averageVolume10days","beta","beta3Year", "yield", "socialScore", "environmentScore", "governanceScore", "trailingPE", "forwardPE","ytdReturn", "X2020.01.02","previousClose", "logo_url")
#c("ticker","averageVolume10days","beta","beta3Year", "yield", "socialScore", "environmentScore", "governanceScore", "trailingPE", "forwardPE","ytdReturn", "X2020.01.02","previousClose", "logo_url")
etf_data <- etf_data[,keep_columns]
etf_data[is.na(etf_data$ytdReturn), "ytdReturn"] <- (etf_data[is.na(etf_data$ytdReturn), "previousClose"] -etf_data[is.na(etf_data$ytdReturn), "X2020.01.02"]) / etf_data[is.na(etf_data$ytdReturn), "X2020.01.02"] * 100
#unique(etf_data$ytdReturn)

## name rows by ticker for easier selection
row.names(etf_data) <- etf_data$ticker

for(l in 1:nrow(generate_stats)) {
  index_ <- generate_stats$INDEX[l]
  
  if(is.na(etf_data[index_, "socialScore"])){
    etf_data[index_, "socialScore"] <- generate_stats[l, "socialScore"]
  }
  if(is.na(etf_data[index_, "socialScore"])){
    etf_data[index_, "environmentScore"] <- generate_stats[l, "environmentScore"]
  }
  
}
write.csv(etf_data, "All ETF Data2.csv", row.names = FALSE)



