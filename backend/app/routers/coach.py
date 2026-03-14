from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.coach_service import get_tips, get_report
from app.utils.auth import get_current_user

router = APIRouter(tags=["coach"])


class ProfileInput(BaseModel):
    breakdown: dict          # {"food": 12.3, "transport": 8.1, ...}
    weekly_total: float
    prev_weekly_total: float = 0.0
    country: str = "CA"
    rank: int = 1
    total_users: int = 1


@router.post("/tips")
async def tips(body: ProfileInput, user=Depends(get_current_user)):
    return await get_tips(
        breakdown=body.breakdown,
        weekly_total=body.weekly_total,
        prev_weekly=body.prev_weekly_total,
        country=body.country,
    )


@router.post("/report")
async def report(body: ProfileInput, user=Depends(get_current_user)):
    return await get_report(
        breakdown=body.breakdown,
        weekly_total=body.weekly_total,
        prev_weekly=body.prev_weekly_total,
        rank=body.rank,
        total_users=body.total_users,
        country=body.country,
    )
