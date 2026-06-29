from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from calculator import analyze_campaigns
from ai_analyst import analyze_with_ai
from rag import init_rag
from pydantic import BaseModel
from typing import List
import pandas as pd
import io

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_rag()
    yield

app = FastAPI(title="CAC Cruncher API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CampaignResult(BaseModel):
    channel: str
    spend: float
    new_customers: int
    clv: float
    cac: float
    roas: float
    is_unprofitable: bool
    waste: float

class AskRequest(BaseModel):
    campaigns: List[CampaignResult]
    question: str

@app.get("/")
def root():
    return {"status": "CAC Cruncher API is running"}

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    campaigns = df.to_dict(orient="records")
    results = analyze_campaigns(campaigns)
    total_spend = round(sum(r["spend"] for r in results), 2)
    unprofitable = sum(1 for r in results if r["is_unprofitable"])
    return {
        "total_campaigns": len(results),
        "total_spend": total_spend,
        "unprofitable_count": unprofitable,
        "results": results
    }

@app.post("/api/ask")
def ask_ai(req: AskRequest):
    campaigns = [c.dict() for c in req.campaigns]
    answer = analyze_with_ai(campaigns, req.question)
    return {"answer": answer}
