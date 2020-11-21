# -*- coding: utf-8 -*-
"""
Created on Wed Nov 18 18:41:35 2020

@author: rober
"""
import os
import json
import pandas, csv
os.chdir("C:/Users/rober/Documents/Georgia Tech/CSE 6242 - Data & Visual Analytics/Group Project/data/Stock Index Data")

csvFilePath= 'Index fulldata only.csv'
jsonFilePath="Indexi Data.json"

data={}

with open(csvFilePath, encoding='utf-8') as csvf: 
        csvReader = csv.DictReader(csvf) 
          
        # Convert each row into a dictionary  
        # and add it to data 
        for rows in csvReader: 
              
            # Assuming a column named 'No' to 
            # be the primary key 
            key = rows['ticker'] 
            data[key] = rows 

new_dict = []
for l in data.values():
    new_dict.append(l)

with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
    jsonf.write(json.dumps(data, indent=4)) 
