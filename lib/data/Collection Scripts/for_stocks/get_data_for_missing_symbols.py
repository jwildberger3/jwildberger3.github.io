# -*- coding: utf-8 -*-
"""
Created on Tue Nov 10 19:49:10 2020

@author: Dan
"""
import pandas as pd
import yfinance as yf
import time

x = 2450

for n in range(20, 1000):
        
    try:
    
        all_us_stocks = pd.read_excel("C:/Users/Dan/Documents/GT/CSE6242/project/US-Stock-Symbols.xlsx")
        
        symbols = [s.strip().split("^")[0].split("/")[0] for s in list(all_us_stocks['Symbol'])]
        
        df = pd.read_csv('C:/Users/Dan/Documents/GT/CSE6242/project/data/stock_data_uncleaned.csv')
        
        symbols2 = list(df['symbol'])
        
        
        missed = []
        
        for s in symbols:
            if s not in symbols2:
                missed.append(s)
        
        
        # ### Get list of all stock symbols on NYSE
        # nyse = pd.read_csv("nyse_company_list.csv")
        # #nyse = nyse[['Symbol', 'Name', 'Sector', 'industry']]
        # symbols = list(nyse['Symbol'])
        
        ### Initialize master df
        combined_df = pd.DataFrame()
        
        ### Get data for each stock and add to master df as new record
        for i in range(x, len(missed)):
        
            ### get general stock info
            print(i)
            symbol = missed[i].strip()
            symbol = symbol.split("^")[0]
            symbol = symbol.split("/")[0]
            print(symbol)
            try:
                data = yf.Ticker(symbol).info
        
                for key, value in data.items():
                    data[key] = [value]
            except:
                continue
            df = pd.DataFrame(data)
            df.drop('symbol', axis=1, inplace=True)
            df.insert(0, 'symbol', symbol)
            time.sleep(1.5)
            
            ### add sustainability data
            sus_data = yf.Ticker(symbol).sustainability
            try:
                sus_df = sus_data.transpose()
                for c in sus_df.columns:
                    df[c] = sus_df[c][0]
                #df = df.join(sus_df, on='symbol', how='left')
            except:
                pass
            
            ### add record to master df
            if i == 0:
                combined_df = combined_df.append(df)
            else:
                combined_df = pd.concat([combined_df, df])
        
            ### write df to file
            combined_df.to_csv(f"stock_data_{n}.csv", index=False)
            time.sleep(1.5)
            
            x += 1
    except:
        continue