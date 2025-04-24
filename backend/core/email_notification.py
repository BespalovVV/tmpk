import asyncio
from datetime import datetime
import json
import re
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi_mail import FastMail, MessageSchema, MessageType
from jose import JWTError
from pydantic import EmailStr
from ..schemas.user import UserNotif
from ..core.config import settings
from ..core.security import create_confirmation_token, create_reset_password_token, decode_reset_password_token, get_hashed_password, verify_access_token, verify_confirmation_token, verify_password
from .mail_config import mail_conf as conf
from ..schemas.pass_reset import ForgetPasswordRequest, ResetForegetPassword, ResetPassword, SuccessMessage
from ..crud import user as UserService
from sqlalchemy.ext.asyncio import AsyncSession

async def forget_password(data: ForgetPasswordRequest, db: AsyncSession) -> SuccessMessage:
    try:
        user1 = await UserService.get_user_by_email(email=data.email, db=db)
        if user1 is None:
            raise HTTPException(
                status_code=404,
                detail="Email not found"
            )
        
        secret_token = await create_reset_password_token(email=user1.email)
        forget_url_link = f"{settings.APP_HOST}{settings.FORGET_PASSWORD_URL}/{secret_token}"
        
        email_body = {
            "company_name": settings.MAIL_FROM_NAME,
            "link_expiry_min": 5,
            "reset_link": forget_url_link,
            "user": user1
        }
        
        message = MessageSchema(
            subject="Password Reset Instructions",
            recipients=[user1.email],
            template_body=email_body,
            subtype="html"
        )
        
        template_name = "password_reset.html"
        fm = FastMail(conf)
        await fm.send_message(message=message, template_name=template_name)
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "Email has been sent",
                "success": True,
                "status_code": 200
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server error: {str(e)}"
        )

async def reset_forget_password(data: ResetForegetPassword, db: AsyncSession) -> SuccessMessage:
    try:
        info = decode_reset_password_token(token=data.secret_token)
        if info is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired token"
            )
        
        if data.new_password != data.confirm_password:
            raise HTTPException(
                status_code=400,
                detail="Passwords do not match"
            )
            
        hashed_password = await get_hashed_password(data.new_password)
        
        await UserService.update_user_password(email=info, new_password=hashed_password, db=db)
        
        return SuccessMessage(
            success=True,
            status_code=200,
            message="Password successfully updated"
        )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server error {str(e)}"
        )
async def reset_password(
    data: ResetPassword,
    db: AsyncSession,
    request: Request
) -> SuccessMessage:
    start_time = datetime.now()
    try:
        info = await verify_access_token(request)
        if not info:
            raise HTTPException(400, "Недействительный токен")
        
        user = await UserService.get_user_by_id(user_id=int(info['user_id']), db=db)
        
        if data.new_password != data.confirm_password:
            raise HTTPException(400, "Passwords do not match")
        
        if not verify_password(data.old_password, user.password):
            raise HTTPException(400, "Неверный старый пароль")
        
        hashed_password = await get_hashed_password(data.new_password)
        await UserService.update_user_password(email=user.email, new_password=hashed_password, db=db)
        
        print(f"Total time: {datetime.now() - start_time}s")
        return SuccessMessage(
            success=True,
            status_code=200,
            message="Password successfully updated"
        )
        
    except JWTError:
        raise HTTPException(401, "Invalid token")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
        
async def send_confirmation_email(email: EmailStr, db: AsyncSession) -> SuccessMessage:
    try:
        user = await UserService.get_user_by_email(email=str(email), db=db)
        if user is None:
            raise HTTPException(
                status_code=404,
                detail="Email not found"
            )
        
        secret_token = await create_confirmation_token(email=user.email)
        confirmation_link = f"{settings.APP_HOST}{settings.EMAIL_CONFIRMATION_URL}/{secret_token}"
        
        email_body = {
            "company_name": settings.MAIL_FROM_NAME,
            "login": user.email,
            "confirmation_link": confirmation_link,
            "user": user
        }
        
        message = MessageSchema(
            subject="Email Confirmation",
            recipients=[user.email],
            template_body=email_body,
            subtype="html"
        )
        
        template_name = "registration_notification.html"
        fm = FastMail(conf)
        await fm.send_message(message=message, template_name=template_name)
        
        return SuccessMessage(
            success=True,
            status_code=200,
            message="Confirmation email has been sent"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server error: {str(e)}"
        )

def is_email_from_domain(email, domain):
    pattern = fr"^[a-zA-Z0-9._%+-]+@{re.escape(domain)}$"
    return bool(re.fullmatch(pattern, email))

async def confirm_email(token: str, db: AsyncSession) -> SuccessMessage:
    try:
        email = await verify_confirmation_token(token)
        if not email:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired token"
            )
        
        user = await UserService.get_user_by_email(email=email, db=db)
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        if is_email_from_domain(user.email, 'gmail.com'):
            await UserService.update_email_verification_status(email=email, db=db)
        
        return SuccessMessage(
            success=True,
            status_code=200,
            message="Email successfully verified"
        )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server error {str(e)}"
        )