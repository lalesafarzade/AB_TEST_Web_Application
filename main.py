from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from stats import run_ztest

app = FastAPI()

# Allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    )

@app.post("/analyze")
async def analyze(file: UploadFile):
    df = pd.read_csv(file.file)

    summary, z_stat, p_value = run_ztest(df)
    summary["conversion_rate"] = summary["sum"] / summary["count"]
    result={
        "z_stat":z_stat,
        "p_value":p_value,
        "conversion_rate":summary["conversion_rate"]
    }

    return result

@app.get("/")
async def home():
    return {"message": "API is running"}
