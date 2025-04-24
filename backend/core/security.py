from typing import Optional
from jose import JWTError
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request, HTTPException, Depends, Response
from datetime import datetime, timedelta
from ..models.user import User
from ..core.config import settings
from passlib.context import CryptContext

secret_key = settings.SECRET_KEY
salt = settings.SALT

async def verify_access_token(request: Request):
    access_token = request.cookies.get("access")

    if not access_token:
        raise HTTPException(status_code=401, detail="Access token missing")

    try:
        payload = jwt.decode(access_token, secret_key, algorithms=['HS256'])
        if datetime.fromtimestamp(payload['exp']) < datetime.now():
            raise HTTPException(status_code=401, detail="Access token expired")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Access token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid access token")
    
    
async def verify_refresh_token(request: Request):
    refresh_token = request.cookies.get("refresh")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    try:
        payload = jwt.decode(refresh_token, secret_key, algorithms=['HS256'])
        if datetime.fromtimestamp(payload['exp']) < datetime.now():
            raise HTTPException(status_code=401, detail="Refresh token expired")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    

async def generate_access_token(user_id: int, user_role: str) -> str:
    
    payload = {
        'user_id': user_id,
        'user_role': user_role,
        'exp': datetime.now() + timedelta(hours=1)
    }
    new_access_token = jwt.encode(payload, secret_key, algorithm='HS256')
    return new_access_token
    
async def get_refresh(payload: dict = Depends(verify_refresh_token)):
    return payload
    
async def get_current_user(payload: dict = Depends(verify_access_token)):
    return payload

async def update_tokens(response: Response, db: AsyncSession, current_user: dict = Depends(get_refresh)):
    try:
        result = await db.execute(select(User).filter((User.id == current_user['user_id'])))
        user = result.scalar_one_or_none()
        if not user:
            raise Exception("Invalid refresh token")
        new_access_token = await generate_access_token(user.id, user.role.value)
        refresh_token = jwt.encode({'user_id': user.id, 'exp': datetime.now() + timedelta(hours=3)}, secret_key, algorithm='HS256')
        response.set_cookie("access", new_access_token, httponly=True, samesite='strict')
        response.set_cookie("refresh", refresh_token, httponly=True, samesite='strict')
        return {"access_token": new_access_token}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    



password_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")


async def get_hashed_password(password: str) -> str:
    salt_password = str(password + salt)
    return password_context.hash(salt_password)


def verify_password(password: str, hashed_pass: str) -> bool:
    salt_password = str(password + salt)
    return password_context.verify(salt_password, hashed_pass)

async def create_reset_password_token(email: str):
    data = {
        "sub": email,
        "exp": datetime.now() + timedelta(minutes=10)
    }
    token = jwt.encode(data, secret_key, algorithm='HS256')
    return token

def decode_reset_password_token(token: str):
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=["HS256"]
        )
        email: str = payload.get("sub")
        return email
    except JWTError:
        return None
    
async def create_confirmation_token(email: str) -> str:
    data = {
        "sub": email,
        "exp": datetime.now() + timedelta(minutes=10)
    }
    token = jwt.encode(data, secret_key, algorithm='HS256')
    return token

async def verify_confirmation_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=["HS256"]
        )
        email: str = payload.get("sub")
        return email
    except JWTError:
        return None
    