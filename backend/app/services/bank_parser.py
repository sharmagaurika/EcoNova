from .gemini import ask_gemini_json
 
PROMPT = """
You are a carbon footprint calculator.
Given these bank transactions (merchant name and amount), classify each
into a carbon category and estimate kg CO2e.
Use spend amounts to infer quantity where possible
(e.g. Shell $60 CAD ≈ 40L petrol ≈ 91 kg CO2).
Return ONLY valid JSON:
{
  "items": [
    {"description": "Shell - fuel", "category": "transport",
         "kg_co2": 91.0, "confidence": "medium"}
  ],
  "total_kg_co2": 0.0
}
Transactions:
"""
 
async def parse_bank(text: str) -> dict:
    result = await ask_gemini_json(PROMPT + text)
    result["source"] = "bank"
    return result