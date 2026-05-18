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
    se = (summary["conversion_rate"] * (1 - summary["conversion_rate"]) / summary["count"]) ** 0.5

    ci_low = summary["conversion_rate"] - 1.96 * se
    ci_high = summary["conversion_rate"]+ 1.96 * se
    result={
        "z_stat":z_stat,
        "p_value":p_value,
        "conversion_rate":summary["conversion_rate"].to_dict(),
        "sum":summary["sum"].to_dict(),
        "count":summary["count"].to_dict(),
        "Confidence_intervals_high":ci_high.to_dict(),
        "Confidence_intervals_low":ci_low.to_dict(),

    }

    return result

@app.get("/")
async def home():
    return {"message": "API is running"}
