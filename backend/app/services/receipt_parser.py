import base64
import json
import google.generativeai as genai
from .gemini import ask_gemini_json

_PROMPT = """\
You are a carbon footprint calculator.
Given receipt text, identify each line item and estimate its kg CO2e.
Classify each item into: food, transport, energy, shopping, digital, or other.
Use IPCC/DEFRA 2024 emission factors.

Return ONLY valid JSON in this exact shape — no extra text, no markdown:
{
  "items": [
    {
      "description": "Beef mince 500g",
      "category": "food",
      "kg_co2": 13.5,
      "confidence": "high"
    }
  ],
  "total_kg_co2": 13.5
}

confidence must be: high | medium | low

Receipt text:
"""

_IMAGE_PROMPT = """\
You are a carbon footprint calculator.
This is a photo of a receipt. Read every line item visible in the image.
For each item estimate its kg CO2e using IPCC/DEFRA 2024 emission factors.
Classify each into: food, transport, energy, shopping, digital, or other.
If a quantity or weight is visible, use it. Otherwise estimate from price.

Return ONLY valid JSON — no extra text, no markdown:
{
  "items": [
    {
      "description": "item name and quantity",
      "category": "food",
      "kg_co2": 0.0,
      "confidence": "high"
    }
  ],
  "total_kg_co2": 0.0
}

confidence must be: high | medium | low
"""

async def parse_receipt(text: str) -> dict:
    result = await ask_gemini_json(_PROMPT + text)
    result["source"] = "receipt"
    if "items" in result:
        result["total_kg_co2"] = round(
            sum(i.get("kg_co2", 0) for i in result["items"]), 3
        )
    return result


async def parse_receipt_image(image_bytes: bytes, content_type: str = "image/jpeg") -> dict:
    model = genai.GenerativeModel("gemini-3.1-flash-lite-preview")
    
    image_part = {
        "mime_type": content_type,
        "data": image_bytes
    }

    response = model.generate_content(
        contents=[_IMAGE_PROMPT, image_part],
        generation_config={"response_mime_type": "application/json"},
    )

    result = json.loads(response.text)
    result["source"] = "receipt_image"
    if "items" in result:
        result["total_kg_co2"] = round(
            sum(i.get("kg_co2", 0) for i in result["items"]), 3
        )
    return result