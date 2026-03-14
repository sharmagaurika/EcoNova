from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import BaseModel
from app.services.receipt_parser import parse_receipt, parse_receipt_image
from app.services.bank_parser import parse_bank
from app.services.flight_parser import parse_flight
from app.utils.auth import get_current_user

router = APIRouter(tags=["parse"])


class TextInput(BaseModel):
    text: str


@router.post("/receipt")
async def receipt(body: TextInput, user=Depends(get_current_user)):
    return await parse_receipt(body.text)


@router.post("/receipt/image")
async def receipt_image(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    image_bytes = await file.read()
    return await parse_receipt_image(image_bytes, file.content_type)


@router.post("/bank")
async def bank(body: TextInput, user=Depends(get_current_user)):
    return await parse_bank(body.text)


@router.post("/flight")
async def flight(body: TextInput, user=Depends(get_current_user)):
    return await parse_flight(body.text)