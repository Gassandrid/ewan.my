# : python Lab1.py
#   Salt content of bread  Loaf #1  Loaf #2  Loaf #3  Loaf #4
# 0                  Alex      452      480      449      475
# 1                  Jody      438      440      434      445
# 2                 Casey      438      452      459      459
# 3                Morgan      461      444      460      449

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

ExcelDir = "/Users/gassandrid/VAULT/Notes/Biology/Labs/Excel/Lab 1.xlsx"

# Read the data from the specified Excel sheet
data = pd.read_excel(ExcelDir, sheet_name="Sheet1")

print(data)
