import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, Response
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from core.security import get_current_user, get_refresh, update_tokens
from crud import auth as AuthService
from db.session import get_session
from schemas.user import UserLogin
from core.config import settings

router = APIRouter()

@router.post("/auth", summary="Вход", tags=["Авторизация"])
async def Login_handler(data: UserLogin, db: AsyncSession = Depends(get_session), response: Response = Depends):
    return await AuthService.Login(data, db, response)

@router.get("/protected", summary="protected", tags=["протеkтед"])
async def Protect_route(current_user: dict = Depends(get_current_user)):
    if current_user['user_role'] == 'admin':
        return {"data": "okkk"}
    else: 
        raise HTTPException(status_code=401, detail="Недостаточно прав")


@router.post("/refresh_token")
async def refresh_access_token(db: AsyncSession = Depends(get_session), current_user: dict = Depends(get_refresh), response: Response = Depends):
    return await update_tokens(response=response, current_user=current_user, db=db)
