# -*- coding: utf-8 -*-
"""
Created on Mon Nov  2 21:03:31 2020

@author: rober
"""

import yfinance as yf
import pandas
import os
import json
import time
import numpy as np
import csv

#import pygithub
os.chdir("C:/Users/rober/Documents/Georgia Tech/CSE 6242 - Data & Visual Analytics/Group Project/data")
df = pandas.read_csv('ETF Index List.csv')



#stock_symbols= ["MSFT", "GOOG", "INTC", "WMT", "BAC", "VZ", "XOM", "DIS", \
        #        "ACB", "GE"]
    
#index_symbols = ["VTSAX",  "VIGAX", "VBIAX", "FNILX"]
index_symbols =   list(df["Symbol"])


#test_indexes = yf.Tickers(" ".join(index_symbols))
#test_stocks = yf.Tickers(" ".join(stock_symbols))

#compiled_stocks = {}
#for stock_ in stock_symbols: 
#    compiled_stocks[stock_]={"info": eval("test_stocks" + ".tickers." + stock_ + ".info"),
#                             "history":eval("test_stocks" + ".tickers." + stock_ + ".history(period='15m')"),
#                            "sustainability" : eval("test_stocks" + ".tickers." + stock_ + ".sustainability")
#                            }

#compiled_indexes = {}
#for index_ in index_symbols: 
 #    compiled_indexes[index_]={"info": eval("test_indexes" + ".tickers." + index_ + ".info"),
  #                           "history":eval("test_indexes" + ".tickers." + index_ + ".history(period='12m')"),
   #                         "sustainability" : eval("test_indexes" + ".tickers." + index_ + ".sustainability")
    #                        }   
    
compiled_indexes = {}
compiled_errors={}
for i_, index_ in enumerate(index_symbols):
    print(index_ +" " + str(i_))

    if i_ in range(625,4200,625):
        print("sleeping..")
        time.sleep(60*65) ## sleep for an hour to avoid limit
        

    temp= yf.Ticker(index_)
    
    try:
        compiled_indexes[index_]={"info": temp.info,
                                  "history":temp.history(start="2020-01-01", end="2020-01-05"),
                                  "sustainability" : temp.sustainability
                                  }

    except IndexError:
        compiled_indexes[index_]={"info": None,
                             "history": None,
                            "sustainability" : None
                            }
        
        compiled_errors[index_]={"error":"IndexError",
                                "ticker":index_,
                                "item_number":i_
                                }
        
    except KeyError:
        compiled_indexes[index_]={"info": None,
                             "history": None,
                            "sustainability" : None
                            }    

        compiled_errors[index_]={"error":"KeyError",
                                "ticker":index_,
                                "item_number":i_
                                }
    except:
        compiled_indexes[index_]={"info": None,
                             "history": None,
                            "sustainability" : None
                            }    

        compiled_errors[index_]={"error":"WildCard",
                                "ticker":index_,
                                "item_number":i_
                                }
#time.sleep(2*60*60) #2 hour sleep
            
#tickers.tickers.MSFT.info
#tickers.tickers.AAPL.history(period="1mo")
#tickers.tickers.GOOG.actions

#info, history, sustainability
#print(compiled_stocks["GE"]["info"])
#print(compiled_indexes["VTSAX"]["sustainability"]["Value"]["socialScore"])

#index_symbols = ["VTSAX",  "VIGAX", "VBIAX"]
    
#stock_symbols= ["MSFT", "INTC", "WMT", "BAC", "VZ", "XOM", "DIS", "GE"]

#12
#for i in compiled_indexes:
#    print(compiled_indexes[i]["sustainability"]["Value"]["socialScore"])
## ytd return
# yield
#10
#for s in compiled_stocks:
#    print(compiled_stocks[s]["sustainability"]["Value"]["socialScore"])

#for cols in test.columns:
 #   print(cols)
#quick_stock={}

#for s in compiled_stocks: 
#    quick_stock[s] = {"ticker":s,
#                      "previous_close":compiled_stocks[s]["info"]["regularMarketPreviousClose"],
#                  #    "trailingPE":compiled_stocks[i]["info"]["trailingPE"],
#                      "beta":compiled_stocks[s]["info"]["beta"], 
#                      "ytdReturn": compiled_stocks[s]["info"]["52WeekChange"], 
#                      "yield": compiled_stocks[s]["info"]["dividendYield"], 
#                      "socialScore":compiled_stocks[s]["sustainability"]["Value"]["socialScore"], 
#                      "governanceScore":compiled_stocks[s]["sustainability"]["Value"]["governanceScore"],
#                      "environmentScore":compiled_stocks[s]["sustainability"]["Value"]["environmentScore"]
#                      }
    
#quick_index={}
#for i in compiled_indexes:
 #   quick_index[i]={"ticker":i,
  #                  "previous_close":compiled_indexes[i]["info"]["regularMarketPreviousClose"],
   #             #    "trailingPE":compiled_indexes[i]["info"]["trailingPE"],
    #                "beta":compiled_indexes[i]["info"]["beta3Year"], 
     #              "ytdReturn":compiled_indexes[i]["info"]["ytdReturn"], 
      #             "yield":compiled_indexes[i]["info"]["yield"], 
       #            "socialScore":compiled_indexes[i]["sustainability"]["Value"]["socialScore"], 
        #           "governanceScore":compiled_indexes[i]["sustainability"]["Value"]["governanceScore"],
         #          "environmentScore":compiled_indexes[i]["sustainability"]["Value"]["environmentScore"]
          #         }
    
    
    
    

#with open('Index_Raw.json', 'w') as write_file:
     #  json.dump(compiled_indexes.to_json(), write_file)

#with open('Stocks_Raw.json', 'w') as write_file:
    #   json.dump(compiled_indexes, write_file)
       
#with open('Index_Simple.json', 'w') as write_file:
#       json.dump(quick_stock, write_file)

#with open('Stocks_Simple.json', 'w') as write_file:
#       json.dump(quick_index, write_file)

errors_dataframe= pandas.DataFrame.from_dict(compiled_errors, orient="index")
errors_dataframe.to_csv("errors_dataframe2.csv")

####### Compile all data to dataframe/csv for column comparison & review #####

ticker_string = [str(s) for s in compiled_indexes.keys()]

# info chart key list for column order reference
info_columns = list(compiled_indexes["ICELX"]["info"].keys())
# check for additional key column values
check_add = ["regularMarketVolume", "averageVolume", "fiftyDayAverage", "ytdReturn", "averageDailyVolume10Day", "logo_url", "forwardPE", "beta", "trailingPE", "dividendYield", "yield", "beta3Year"]
print([a for a in check_add if a not in info_columns ])
info_columns.append("trailingPE")

# sustainability key list for column order reference
sustain_columns = list(compiled_indexes["ICELX"]["sustainability"]["Value"].keys())



ticker_string = [str(s) for s in compiled_indexes.keys() if s not in errors_dataframe["ticker"]]
#ticker_string = [str(s) for s in compiled_indexes.keys() ]

#info_columns = [ic for ic in info_columns if ic not in remove_columns]
info_data={"ticker": ticker_string }
# map info 
for col_ in info_columns:
    info_data[col_] =[compiled_indexes[t]["info"].get(col_, None) for t in ticker_string  ]
    
# map sustainability
for col_ in sustain_columns:
    info_data[col_] =[compiled_indexes[t]["sustainability"]["Value"].get(col_, None)  if compiled_indexes[t].get("sustainability", None) is not None  else None for t in ticker_string]

# map history first day of year
# required for YTDreturn calculation
info_data["2020-01-02"]= [compiled_indexes[t]["history"]["Close"]["2020-01-02"] if compiled_indexes[t]["history"]["Close"].get("2020-01-02", None) is not None else None for t in ticker_string]

#    info_data[col_] =[compiled_indexes[t]["info"][col_] if compiled_indexes[t]["info"][col_] is not None else None for t in info_data["ticker"]  ]
info_data_df= pandas.DataFrame(info_data)
info_data_df.to_csv("All ETF Data2.csv", index=False)




