from pydantic import BaseModel
from typing import List

class ParseResult(BaseModel):
    description: str
    category: str
    kg_co2: float
    confidence: str

class BankParseResponse(BaseModel):
    items: List[ParseResult]
    total_kg_co2: float
    source: str = "bank"