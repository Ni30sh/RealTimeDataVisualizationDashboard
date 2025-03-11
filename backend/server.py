from fastapi import FastAPI
from fastapi.responses import JSONResponse
import requests
import csv
from io import StringIO
import pandas as pd

app = FastAPI()

# Google Sheets CSV URL (Replace <unique-id> with actual ID)
SHEET_URL = "https://docs.google.com/spreadsheets/d/1L2rmaklLE-NFDdGNbQqkiHnJPCe08qguo2tEOX5oaNY/export?format=csv"

@app.get("/data")
def fetch_data():
    try:
        response = requests.get(SHEET_URL)
        response.raise_for_status()
        
        # Read CSV data into a DataFrame
        df = pd.read_csv(StringIO(response.text))
        
        # Ensure numeric conversion for relevant columns
        numeric_columns = ["Latitude", "Longitude", "Altitude", "PM2.5", "PM10", "Temperature", "Pressure", "Humidity", "Wind Speed"]
        df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors="coerce")

        # Drop NaN values if any column conversion failed
        df = df.dropna()

        # Convert dataframe to JSON format and return last 10 records
        return JSONResponse(content={"data": df.to_dict(orient="records")[-10:]})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)