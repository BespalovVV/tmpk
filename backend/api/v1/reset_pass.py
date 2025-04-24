from fastapi import APIRouter, Depends
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from ...schemas.user import UserNotif
from ...core import email_notification as NotificationService
from ...schemas.pass_reset import ForgetPasswordRequest, ResetForegetPassword, SuccessMessage
from ...db.session import get_session

router = APIRouter()

@router.post("/forget-password", response_model=SuccessMessage)
async def forgetPassword(data: ForgetPasswordRequest, db: AsyncSession = Depends(get_session)):
    return await NotificationService.forget_password(data, db)

@router.post("/reset-password", response_model=SuccessMessage)
async def resetPassword(data: ResetForegetPassword, db: AsyncSession = Depends(get_session)):
    return await NotificationService.reset_password(data, db)

@router.post("/send-confirmation-email", response_model=SuccessMessage)
async def send_confirmation_email_route(
    data: UserNotif,
    db: AsyncSession = Depends(get_session)
):
    return await NotificationService.send_confirmation_email(email=data.email, db=db)

@router.get("/confirm-email/{token}", response_model=SuccessMessage)
async def confirm_email_route(
    token: str,
    db: AsyncSession = Depends(get_session)
):
    return await NotificationService.confirm_email(token=token, db=db)
