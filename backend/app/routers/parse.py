from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.bank_parser import parse_bank
from app.models.parse_result import BankParseResponse

router = APIRouter(prefix="/parse", tags=["parsing"])

class BankStatementRequest(BaseModel):
    data: str

@router.post("/bank", response_model=BankParseResponse)
async def parse_bank_statement(request: BankStatementRequest):
    try:
        results = await parse_bank(request.data)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse statement: {str(e)}")