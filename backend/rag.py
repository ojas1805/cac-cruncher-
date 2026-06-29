import chromadb
from sentence_transformers import SentenceTransformer
import os

BENCHMARKS = [
    "Google Ads average CAC for SaaS companies is $120-$150. ROAS above 2x is considered good.",
    "Meta Ads average CAC for ecommerce is $30-$50. ROAS above 3x is considered good.",
    "Meta Ads average CAC for SaaS is $100-$150. Anything above $200 is poor performance.",
    "TikTok Ads average CAC is $20-$80 depending on industry. ROAS below 1x means losing money.",
    "LinkedIn Ads average CAC is $75-$150 for B2B SaaS. LinkedIn is expensive but targets professionals.",
    "Email marketing average CAC is $5-$15. It is consistently the highest ROAS channel at 8-12x.",
    "SEO average CAC is $10-$30 when accounting for content costs. ROAS is typically 8-15x long term.",
    "If CAC is greater than CLV the campaign is unprofitable and losing money on every customer.",
    "A healthy CAC to CLV ratio is 1:3 or better. Meaning CLV should be at least 3x the CAC.",
    "Budget reallocation from unprofitable to profitable channels can improve overall ROAS by 40-60%.",
    "LinkedIn Ads have the highest average CAC of all digital channels due to premium audience targeting.",
    "Google Search Ads typically outperform display ads with 2-3x better CAC efficiency.",
    "Cutting underperforming campaigns and doubling down on top performers is a proven growth strategy.",
    "Email marketing and SEO are the most cost efficient acquisition channels for most businesses.",
]

model = None
collection = None

def init_rag():
    global model, collection
    print("Initializing RAG pipeline...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    client = chromadb.Client()
    collection = client.get_or_create_collection("benchmarks")
    embeddings = model.encode(BENCHMARKS).tolist()
    collection.add(
        documents=BENCHMARKS,
        embeddings=embeddings,
        ids=[f"bench_{i}" for i in range(len(BENCHMARKS))]
    )
    print("RAG pipeline ready.")

def retrieve_context(query: str, n: int = 3) -> str:
    if model is None or collection is None:
        return ""
    query_embedding = model.encode([query]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=n)
    docs = results["documents"][0]
    return "\n".join([f"- {doc}" for doc in docs])
