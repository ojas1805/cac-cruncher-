def calculate_cac(spend: float, new_customers: int) -> float:
    if new_customers == 0:
        return 0.0
    return round(spend / new_customers, 2)

def calculate_roas(clv: float, new_customers: int, spend: float) -> float:
    if spend == 0:
        return 0.0
    return round((clv * new_customers) / spend, 2)

def analyze_campaigns(campaigns: list) -> list:
    results = []
    for c in campaigns:
        cac = calculate_cac(c["spend"], c["new_customers"])
        roas = calculate_roas(c["clv"], c["new_customers"], c["spend"])
        results.append({
            "channel": c["channel"],
            "spend": c["spend"],
            "new_customers": c["new_customers"],
            "clv": c["clv"],
            "cac": cac,
            "roas": roas,
            "is_unprofitable": cac > c["clv"],
            "waste": round(max(0, (cac - c["clv"]) * c["new_customers"]), 2)
        })
    return sorted(results, key=lambda x: x["is_unprofitable"], reverse=True)
