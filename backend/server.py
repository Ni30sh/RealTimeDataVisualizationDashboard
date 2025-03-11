from fastapi import FastAPI
from fastapi.responses import JSONResponse
import requests
import csv
from io import StringIO

app = FastAPI()

# Google Sheets CSV URL (Replace <unique-id> with actual ID)
SHEET_URL = "https://docs.google.com/spreadsheets/d/1L2rmaklLE-NFDdGNbQqkiHnJPCe08qguo2tEOX5oaNY/edit?usp=sharing"

@app.get("/data")
def fetch_data():
    try:
        response = requests.get(SHEET_URL)
        response.raise_for_status()
        
        csv_data = StringIO(response.text)
        reader = csv.reader(csv_data)
        next(reader)  # Skip header row
        
        data = []
        for row in reader:
            if len(row) >= 2:
                timestamp, value = row[0], row[1]
                data.append({"timestamp": timestamp, "value": float(value)})
        
        return JSONResponse(content={"data": data[-10:]})  # Return last 10 data points
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
