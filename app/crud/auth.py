import datetime
from typing import List
from fastapi import HTTPException, Response
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.security import verify_password
from models.user import User
from schemas.user import UserLogin
from core.config import settings

secret_key = settings.SECRET_KEY

async def Login(data: UserLogin, db: AsyncSession, response: Response) -> bool:
    try:
        result = await db.execute(select(User).filter((User.email == data.login_or_email) | (User.login == data.login_or_email)))
        user = result.scalar_one_or_none()
        if not user:
            raise Exception("Неверный логин или пароль")
        if verify_password(data.password, user.password):
            payload = {
                'user_id': user.id,
                'user_role': str(user.role.value),
                'exp': datetime.datetime.now() + datetime.timedelta(hours=1)
            }
            access_token = jwt.encode(payload, secret_key, algorithm='HS256')
            refresh_token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.now() + datetime.timedelta(hours=10)}, secret_key, algorithm='HS256')
            response.set_cookie("access", access_token, httponly=True, samesite='Lax', domain='localhost')
            response.set_cookie("refresh", refresh_token, httponly=True, samesite='Lax', domain='localhost')
            return {"access_token": access_token, "refresh_token": refresh_token}
        else:
            raise Exception("Неверный логин или пароль")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка входа: {str(e)}")