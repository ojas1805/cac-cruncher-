# CAC Cruncher 📊

A full-stack AI marketing analytics dashboard that finds which ad campaigns are bleeding money.

## The Problem
Digital ads are expensive and businesses don't know which channels are truly profitable vs wasting cash.

## The Solution
CAC Cruncher calculates Customer Acquisition Cost (CAC) per campaign and compares it against Customer Lifetime Value (CLV). An AI analyst powered by RAG + LLM gives data-grounded recommendations using real industry benchmarks.

## Features
- CSV upload with drag and drop
- Auto-calculates CAC, CLV, ROAS per campaign
- Flags unprofitable campaigns instantly (red = losing money, green = profitable)
- AI analyst powered by Llama 3 via Groq
- RAG pipeline retrieves real industry benchmarks from ChromaDB

## Tech Stack
- Frontend: React, Vite, Recharts
- Backend: FastAPI, Python
- AI: Llama 3 via Groq API (free)
- RAG: ChromaDB + sentence-transformers
- Data processing: Pandas

## CSV Format
Your CSV needs these columns:
channel, spend, new_customers, clv

Example:
Google Ads, 15000, 120, 180
Meta Ads, 22000, 95, 150
LinkedIn Ads, 12000, 30, 90

## Setup

### Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pandas python-multipart groq chromadb sentence-transformers python-dotenv
Create a .env file with: GROQ_API_KEY=your_key
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev

Open http://localhost:5173

## Author
Built by Ojas Singh