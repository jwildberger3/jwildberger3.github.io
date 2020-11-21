# -*- coding: utf-8 -*-
"""
Created on Sun Nov  8 21:39:31 2020

@author: Dan
"""


### merge 20200101_prices with stock data

import pandas as pd

data_dir = "C:/Users/Dan/Documents/GT/CSE6242/project/data2/"
file1 = "stock_data_combined.csv"
file2 = "20200101_prices.csv"

stocks = pd.read_csv(data_dir + file1)
prices = pd.read_csv(data_dir + file2)

df = stocks.merge(prices, on='symbol', how='left')

print(len(df))

df.drop_duplicates(inplace=True)

print(len(df))

df.to_csv("C:/Users/Dan/Documents/GT/CSE6242/project/data2/stocks_with_prices2.csv")



#### calculate ytd return
df['ytdReturn'] = ((df['previousClose'] - df['Open']) / df['Open']) * 100

print(df['ytdReturn'])

df.to_csv("C:/Users/Dan/Documents/GT/CSE6242/project/data2/stock_data_uncleaned2.csv", index=False)