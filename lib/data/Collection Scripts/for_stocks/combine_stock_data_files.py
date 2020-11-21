# -*- coding: utf-8 -*-
"""
Created on Sun Nov  8 12:57:36 2020

@author: Dan
"""

#### Combine stock_data files

import pandas as pd
import os

df = pd.DataFrame()

data_dir = 'C:/Users/Dan/Documents/GT/CSE6242/project/data_finished/'

for f in os.listdir(data_dir):
    print(f)
    data = pd.read_csv(data_dir + f)
    print(len(data))
    df = pd.concat([df,data])
    
print(len(df))

print(df.columns)

df = df.drop_duplicates()

print(len(df))

df.to_csv(data_dir + "stock_data_combined.csv", index=False)