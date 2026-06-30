# CAC Cruncher 📊

> An AI-powered marketing analytics dashboard that instantly finds which ad campaigns are profitable and which ones are bleeding money.

## The Problem

Modern privacy updates (iOS 14+, cookie deprecation) have made digital ads incredibly expensive and hard to track. Businesses are wasting thousands of dollars on campaigns without knowing which channels are truly profitable.

## The Solution

CAC Cruncher calculates **Customer Acquisition Cost (CAC)** for every campaign and compares it against **Customer Lifetime Value (CLV)**. An AI analyst powered by **RAG + LLM** then gives data-grounded recommendations using real industry benchmarks — not just generic advice.

---

## Features

- 📁 **CSV Upload** — drag and drop your campaign data
- ⚡ **Instant CAC Calculation** — Spend ÷ New Customers per channel
- 🚨 **Profitability Flags** — red = losing money, green = profitable
- 💸 **Waste Calculator** — exact dollar amount being lost per campaign
- 📊 **Visual Dashboard** — bar chart comparing CAC vs CLV per channel
- 🤖 **AI Analyst** — ask questions in plain English
- 📚 **RAG Pipeline** — AI retrieves real industry benchmarks before answering
- 💡 **Smart Recommendations** — concrete budget reallocation suggestions

---

## How It Works
1. Upload a CSV with campaign spend, new customers acquired, and CLV
2. Backend calculates `CAC = Spend / New Customers` for each channel
3. Flags every campaign where `CAC > CLV` (losing money on every customer)
4. When you ask the AI a question, RAG retrieves relevant industry benchmarks from ChromaDB
5. LLM receives your campaign data + benchmarks and returns actionable recommendations

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Recharts |
| Backend | FastAPI, Python |
| AI / LLM | Llama 3.3 70B via Groq API |
| RAG | ChromaDB + sentence-transformers |
| Data Processing | Pandas |

---

## CSV Format

Your file needs these 4 columns:

```csv
channel,spend,new_customers,clv
Google Ads,15000,120,180
Meta Ads,22000,95,150
TikTok Ads,8000,40,80
Email,2000,60,300
SEO,5000,200,250
LinkedIn Ads,12000,30,90
```

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/ojas1805/cac-cruncher-.git
cd cac-cruncher-
```

### 2. Backend setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pandas python-multipart groq chromadb sentence-transformers python-dotenv
```

Create a `.env` file in the backend folder:
Start the backend:
```bash
uvicorn main:app --reload
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure
---

## Example AI Insights

After uploading your CSV you can ask:

- *"Which campaign should I cut first?"*
- *"How does my LinkedIn CAC compare to industry benchmarks?"*
- *"Where should I reallocate my budget?"*
- *"Which channels are worth scaling up?"*

The AI references real industry benchmark data to give answers like:
> *"Your LinkedIn CAC of $400 is 2.7-5.3x above the industry average of $75-$150 for B2B SaaS..."*

---

## Author

Built by **Ojas Singh**

[![GitHub](https://img.shields.io/badge/GitHub-ojas1805-black?style=flat&logo=github)](https://github.com/ojas1805)