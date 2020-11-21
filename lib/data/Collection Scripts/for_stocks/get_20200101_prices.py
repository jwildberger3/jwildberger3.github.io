# -*- coding: utf-8 -*-
"""
Created on Sun Nov  8 20:03:00 2020

@author: Dan
"""


import pandas as pd
import yfinance as yf

data_dir = "C:/Users/Dan/Documents/GT/CSE6242/project/data2/"
file = "stock_data_combined.csv"

stocks = pd.read_csv(data_dir + file)

symbols = [s for s in list(stocks['symbol'])]

df = pd.DataFrame()

missed = []

for symbol in symbols:
    try:
        print(symbol)
        data = yf.download(tickers=symbol, start="2020-01-01", end="2020-01-03")
        data = pd.DataFrame(data)
        data.insert(0, 'symbol', symbol)
        try:
            if data.empty:
                continue
        except:
            continue
        df = pd.concat([df, data])
    except:
        missed.append(symbol)
        
for symbol in missed:
    print(symbol)
    data = yf.download(tickers=symbol, start="2020-01-01", end="2020-01-03")
    data = pd.DataFrame(data)
    data.insert(0, 'symbol', symbol)
    try:
        if data.empty:
            continue
    except:
        continue
    df = pd.concat([df, data])


df.to_csv("20200101_prices.csv", index=False)