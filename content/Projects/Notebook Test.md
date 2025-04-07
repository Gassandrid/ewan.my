---
date: 2025-04-07
updated: 2025-04-07
---

We will be examining the well known **California Housing dataset**

The columns are:

- `longitude`
- `latitude`
- `housing_median_age`
- `total_rooms`
- `total_bedrooms`
- `population`
- `households`
- `median_income`
- `ocean_proximity` *(categorical string data)*
- `median_house_value`

Importing:

```python-r
import pandas as pd
from pyodide.http import open_url

url = "https://gassandrid.xyz/datasets/housing.csv"

try:
    data = pd.read_csv(open_url(url))
    print(data.head())  # Print the first few rows to verify
except Exception as e:
    print(f"An error occurred: {e}")
```

---

Let's take a quick look at the first few rows and summary statistics of the dataset.

```python-r
# Display the first few rows of the dataset
print(df.head())

# Display summary statistics for numerical columns
print(df.describe())

# Display information about the DataFrame, including non-numeric columns
print(df.info())
````

---

## 2. Data Cleaning and Processing

### 2.1 Checking for Missing Values

We'll check if there are any missing values in the dataset, especially in columns like `total_bedrooms`.

```python-r
# Count the missing values in each column
missing_values = df.isna().sum()
print("Missing values in each column:")
print(missing_values)
```

### 2.2 Handling Missing Values

For columns with missing values (for example, `total_bedrooms`), you might decide to fill them with the median value, drop those rows, or apply another strategy.

```python-r
# Example: Fill missing total_bedrooms with the median value
if missing_values['total_bedrooms'] > 0:
    median_bedrooms = df['total_bedrooms'].median()
    df['total_bedrooms'] = df['total_bedrooms'].fillna(median_bedrooms)
    print("Filled missing values in 'total_bedrooms' with median:", median_bedrooms)
```

### 2.3 Converting Categorical Data

Since `ocean_proximity` is a string, you might want to encode it before running numerical analyses or machine learning algorithms. One common method is one-hot encoding.

```python-r
# One-hot encode the 'ocean_proximity' column
df_encoded = df.copy()
df_encoded = pd.get_dummies(df_encoded, columns=['ocean_proximity'], prefix='ocean')
print("Columns after encoding:")
print(df_encoded.columns)
```

---

## 3. Data Visualization with Matplotlib

Before plotting, ensure that you have imported matplotlib and set the inline backend if you are using a Jupyter environment.

```python-r
import matplotlib.pyplot as plt

# Use the inline backend (if using a notebook)
# %matplotlib inline  # Uncomment this line if running in a Jupyter Notebook
```

### 3.1 Histogram of Housing Median Age

Let's start with a histogram to understand the distribution of the `housing_median_age`.

```python-r
plt.figure(figsize=(8, 6))
plt.hist(df['housing_median_age'], bins=20, edgecolor='black')
plt.title('Distribution of Housing Median Age')
plt.xlabel('Housing Median Age')
plt.ylabel('Frequency')
plt.show()
```

### 3.2 Scatter Plot: Median Income vs. Median House Value

A scatter plot can be useful to observe potential relationships between `median_income` and `median_house_value`.

```python-r
plt.figure(figsize=(8, 6))
plt.scatter(df['median_income'], df['median_house_value'], alpha=0.5)
plt.title('Median Income vs. Median House Value')
plt.xlabel('Median Income')
plt.ylabel('Median House Value')
plt.show()
```

### 3.3 Geographical Plot: Locations by House Value

For a more geographic perspective, you can create a scatter plot of the properties using `longitude` and `latitude`. You might color the points by `median_house_value`.

```python-r
plt.figure(figsize=(10, 8))
scatter = plt.scatter(df['longitude'], df['latitude'], c=df['median_house_value'], cmap='viridis', alpha=0.6)
plt.title('Geographical Distribution of House Values')
plt.xlabel('Longitude')
plt.ylabel('Latitude')
plt.colorbar(scatter, label='Median House Value')
plt.show()
```

---

## 4. Additional Analysis Ideas

- **Relationship Analysis:** Consider plotting total rooms vs. population, or households vs. population.
    
- **Box Plots:** To understand the distribution within groups, use box plots for variables segmented by `ocean_proximity`.
    
- **Correlation Matrix:** Generate a heatmap to visualize the correlation between different numerical variables.
    

```python-r
# Correlation matrix
corr_matrix = df.corr()
print("Correlation matrix:")
print(corr_matrix)
```


