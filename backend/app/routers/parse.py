from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.receipt_parser import parse_receipt, parse_receipt_image
from app.services.bank_parser import parse_bank
from app.models.parse_result import BankParseResponse
from app.models.parse_result import ReceiptParseResponse

router = APIRouter(prefix="/parse", tags=["parse"])

class BankStatementRequest(BaseModel):
    data: str

class ReceiptRequest(BaseModel):
    data: str

@router.post("/receipt", response_model=ReceiptParseResponse)
async def parse_receipt_text(request: ReceiptRequest):
    try:
        results = await parse_receipt(request.data)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse statement: {str(e)}")
    
@router.post("/bank", response_model=BankParseResponse)
async def parse_bank_statement(request: BankStatementRequest):
    try:
        results = await parse_bank(request.data)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse statement: {str(e)}")
class TextInput(BaseModel):
    text: str

@router.post("/receipt/image")
async def receipt_image(
    file: UploadFile = File(...),
):
    try:
        image_bytes = await file.read()
        return await parse_receipt_image(image_bytes, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse receipt image: {str(e)}")
