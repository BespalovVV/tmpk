from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from ..core.security import get_hashed_password
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate

async def create_user(data: UserCreate, db: AsyncSession) -> User:
    hashed_password = get_hashed_password(data.password)
    user = User(name=data.name, login=data.login, password=hashed_password, email=data.email)
    try:
        db.add(user)
        await db.commit()
        await db.refresh(user)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Ошибка при добавлении пользователя: {str(e)}")
    return user

async def get_all_users(db: AsyncSession) -> List[User]:
    try:
        result = await db.execute(select(User))
        users = result.scalars().all()
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении пользователей: {str(e)}")

async def get_user_by_id(user_id: int, db: AsyncSession) -> User:
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

async def get_user_by_name(username: str, db: AsyncSession) -> User:
    try:
        result = await db.execute(select(User).filter(User.name == username))
        user = result.scalar_one_or_none()
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении пользователя по имени: {str(e)}")

async def get_user_by_login(login: str, db: AsyncSession) -> User:
    try:
        result = await db.execute(select(User).filter(User.login == login))
        user = result.scalar_one_or_none()
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении пользователя по логину: {str(e)}")

async def get_user_by_email(email: str, db: AsyncSession) -> User:
    try:
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalar_one_or_none()
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении пользователя по почте: {str(e)}")

async def update_user(user_id: int, data: UserUpdate, db: AsyncSession) -> User:
    try:
        async with db.begin():
            result = await db.execute(select(User).filter(User.id == user_id))
            user = result.scalar_one_or_none()
            if not user:
                raise Exception("Пользователь не найден")
            if data.name:
                user.name = data.name
            if data.login:
                user.login = data.login
            if data.password:
                user.password = data.password
            if data.email:
                user.email = data.email
            return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при обновлении пользователя: {str(e)}")

async def delete_user(user_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(select(User).filter(User.id == user_id))
            user = result.scalar_one_or_none()
            if not user:
                raise Exception("Пользователь не найден")
            await db.delete(user)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении пользователя: {str(e)}")
