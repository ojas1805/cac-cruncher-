from groq import Groq
from dotenv import load_dotenv
from rag import retrieve_context
import os

load_dotenv()

SYSTEM_PROMPT = """You are a performance marketing analyst AI called CAC Cruncher.
You analyze marketing campaign data including spend, CAC (Customer Acquisition Cost), 
CLV (Customer Lifetime Value), and ROAS (Return on Ad Spend).

You have access to industry benchmark data to compare against.

Your job:
1. Compare the company's CAC against industry benchmarks
2. Identify which channels are profitable (CAC < CLV) vs losing money (CAC > CLV)
3. Give concrete budget reallocation recommendations with expected impact
4. Always cite specific numbers from both the data and benchmarks

Keep responses concise and actionable."""

def analyze_with_ai(campaigns: list, question: str) -> str:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    context = retrieve_context(question)
    
    campaign_summary = "\n".join([
        f"- {c['channel']}: Spend=${c['spend']}, CAC=${c['cac']}, CLV=${c['clv']}, ROAS={c['roas']}x, Status={'UNPROFITABLE' if c['is_unprofitable'] else 'profitable'}, Money wasted=${c['waste']}"
        for c in campaigns
    ])
    
    prompt = f"""Campaign data:
{campaign_summary}

Industry benchmarks (retrieved):
{context}

Question: {question}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000
    )
    
    return response.choices[0].message.content
