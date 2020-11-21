# -*- coding: utf-8 -*-
"""
Created on Wed Nov 18 06:36:18 2020

@author: rober
"""

import yfinance as yf
import pandas
import os
import json
import time
import numpy as np

## Use a list of ETF component stocks to download component values
component_stocks = pandas.read_csv('Generate Ticker.csv')
stock_check = set(component_stocks["Ticker"])
#stock_check = ["BRK.B", "AEM.TO", "DD", "ABX.TO", "L", "ENB.TO", "CTVA", "PFE", "INGR", "CERN", "AAPL", "MSFT", "AMZN", "WMT", "FB", "GOOGL", "NVDA", "HD", "BMY", "JNJ", "TSLA", "NVTA", "SQ", "ROKU", "CRSP", "PRLB", "Z", "TWOU", "TREE", "TDOC", "TWLO", "SNAP", "QTS", "TTD", "FDX", "W", "ZS", "HUBS", "VZ", "GIS", "AEP", "SJM", "KO", "K", "MRK", "DUK", "PEG", "PYPL", "CTAS", "NOW", "TWTR", "SNPS", "TMO", "CDNS", "TGT", "CTSH", "BBY", "LOW", "NRZ", "MCK", "LEN", "ALXN", "DOW", "TREX", "DHR", "CHD", "SHW", "ANSS", "SCL", "FDS", "BR", "RPM", "SLGN", "GVIXX", "BAC", "CMCSA", "JPM", "HON", "MDLZ", "PM", "SNY.PA", "STWD", "RF", "STOR", "LYB", "ARES", "VTR", "LEG", "AVGO", "VIAC", "BX", "PGR", "CAH", "HUM", "BIO", "CMI", "NLOK", "ABC", "CVX", "PG", "UNH", "CRM", "AMGN", "MCD", "GS", "V", "MMM", "BGS", "KHC", "BPYU", "DKL", "D", "MO", "IBM", "WBA", "TRV", "CSCO", "T", "CNP", "WRK", "CPB", "WHR", "BEN", "AES", "TRGP", "EMN", "LNT", "XOM", "GM", "LKQ", "HCA", "PWR", "AN", "NXST", "ALLY", "LB", "NKE", "CAT", "SCHW", "TFC", "CFG", "AMP", "PNC", "MS", "STT", "C", "F", "GE", "IVZ", "ZBRA", "GPS", "AIG", "EXC", "PNW", "TYL", "CBRE", "EVRG", "MTB", "ADM", "MU", "SRE", "HIG", "ALGN", "TT", "IDXX", "XLNX", "MTD", "POOL"]


compiled_stocks = {}
compiled_errors={}
for i_, index_ in enumerate(stock_check):
    print(index_ +" " + str(i_))

    if i_ in range(625,4200,625):
        print("sleeping..")
        time.sleep(60*65) ## one hour sleep
        

    temp= yf.Ticker(index_)
    
    try:
        compiled_stocks[index_]={"info": temp.info,
                                  "history":temp.history(start="2020-01-01", end="2020-01-05"),
                                  "sustainability" : temp.sustainability
                                  }


    except IndexError:
        compiled_stocks[index_]={"info": None,
                             "history": None,
                            "sustainability" : None
                            }
        
        compiled_errors[index_]={"error":"IndexError",
                                "ticker":index_,
                                "item_number":i_
                                }
        
    except KeyError:
        compiled_stocks[index_]={"info": None,
                             "history": None,
                            "sustainability" : None
                            }    

        compiled_errors[index_]={"error":"KeyError",
                                "ticker":index_,
                                "item_number":i_
                                }
    except:
        compiled_stocks[index_]={"info": None,
                             "history": None,
                            "sustainability" : None
                            }    

        compiled_errors[index_]={"error":"WildCard",
                                "ticker":index_,
                                "item_number":i_
                                }
        
        
info_columns = list(compiled_stocks["MSFT"]["info"].keys())
check_add = ["regularMarketVolume", "averageVolume", "fiftyDayAverage", "ytdReturn", "averageDailyVolume10Day", "logo_url", "forwardPE", "beta", "trailingPE", "dividendYield", "yield", "beta3Year"]
print([a for a in check_add if a not in info_columns ])
info_columns.append("trailingPE")

sustain_columns = list(compiled_stocks["MSFT"]["sustainability"]["Value"].keys())

ticker_string = [str(s) if compiled_stocks[s].get("sustainability", None) is not None else None for s in compiled_stocks.keys()  ]

ticker_string = [s for s in ticker_string if s is not None]
#info_columns = [ic for ic in info_columns if ic not in remove_columns]
stock_data={"ticker": ticker_string }
#previousClose
for col_ in info_columns:
    stock_data[col_] =[compiled_stocks[t]["info"].get(col_, None) for t in ticker_string  ]
    
#previousClose
for col_ in sustain_columns:
    stock_data[col_] =[compiled_stocks[t]["sustainability"]["Value"].get(col_, None)  if compiled_stocks[t].get("sustainability", None) is not None  else None for t in ticker_string]

os.chdir("C:/Users/rober/Documents/Georgia Tech/CSE 6242 - Data & Visual Analytics/Group Project/data")

info_data_df= pandas.DataFrame(stock_data)
info_data_df.to_csv("Stock Reference for ETF.csv", index=False)

       