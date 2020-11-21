# -*- coding: utf-8 -*-
"""
Created on Sun Oct 25 21:19:13 2020

@author: Dan
"""

import seaborn as sb
import pandas as pd

json = pd.read_json("data/stocks_history_daily_5yr.json")

#df = pd.DataFrame({'timestamp': json[json.columns[0]]['timestamp']})
df = pd.DataFrame()
    
for stock in json.columns:
    # new = pd.DataFrame({'timestamp': json[stock]['timestamp'], stock: json[stock]['close']})
    # df = df.merge(new, on='timestamp', how="outer")
    df = df.append(pd.DataFrame({'timestamp': json[stock]['timestamp'], 'stock': stock, 'close': json[stock]['close']}))
    
print(len(df))
print(df)

sb.lineplot(data=df, x="timestamp", y="close", hue="stock")

df.to_csv('data/stocks_history_daily_5yr.csv', index=False)