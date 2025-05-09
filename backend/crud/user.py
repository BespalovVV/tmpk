from typing import List
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from ..schemas.pass_reset import SuccessMessage
from ..core.security import get_hashed_password
from ..models.user import User
from ..schemas.user import UserCreate, UserEmailUpdate, UserUpdate

async def create_user(data: UserCreate, db: AsyncSession) -> User:
    hashed_password = await get_hashed_password(data.password)
    user = User(
        name=data.name,
        login=data.login,
        password=hashed_password,
        email=data.email
    )
    try:
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    except IntegrityError as e:
        await db.rollback()
        if "users_login_key"  in str(e.orig) or "users_email_key" in str(e.orig):
            error_detail = str(e.orig)
            if "users_email_key" in error_detail:
                raise HTTPException(
                    status_code=409,
                    detail="Пользователь с таким email уже существует"
                )
            elif 'users_login_key' in error_detail:
                raise HTTPException(
                    status_code=409,
                    detail="Пользователь с таким логином уже существует"
                )
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка при создании пользователя (нарушение ограничений базы данных)"
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании пользователя: {str(e)}"
        )

async def get_all_users(db: AsyncSession) -> List[User]:
    try:
        result = await db.execute(select(User))
        users = result.scalars().all()
        return users
    except HTTPException:
        raise
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении пользователя по имени: {str(e)}")

async def get_user_by_login(login: str, db: AsyncSession) -> User:
    try:
        result = await db.execute(select(User).filter(User.login == login))
        user = result.scalar_one_or_none()
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении пользователя по логину: {str(e)}")

async def get_user_by_email(email: str, db: AsyncSession) -> User:
    try:
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalar_one_or_none()
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении пользователя по почте: {str(e)}")

async def update_user(user_id: int, data: UserUpdate, db: AsyncSession) -> User:
    try:
        result = await db.execute(select(User).filter(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        if data.name:
            user.name = data.name
        if data.login:
            user.login = data.login
        if data.password:
            user.password = await get_hashed_password(data.password)
        if data.email:
            user.email = data.email
        
        await db.commit()
        await db.refresh(user)
        return user
        
    except IntegrityError as e:
        await db.rollback()
        if "users_login_key" in str(e.orig) or "users_email_key" in str(e.orig):
            error_detail = str(e.orig)
            if "users_email_key" in error_detail:
                raise HTTPException(
                    status_code=409,
                    detail="Пользователь с таким email уже существует"
                )
            elif 'users_login_key' in error_detail:
                raise HTTPException(
                    status_code=409,
                    detail="Пользователь с таким логином уже существует"
                )
        raise HTTPException(
            status_code=400,
            detail="Ошибка при обновлении пользователя (нарушение ограничений базы данных)"
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении пользователя: {str(e)}"
        )


async def update_email(data: UserEmailUpdate, db: AsyncSession) -> User:
    try:
        result = await db.execute(select(User).filter(User.email == data.old_email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        if not data.new_email:
            raise HTTPException(status_code=400, detail="Новый email не указан")
        
        user.email = data.new_email
        await db.commit()
        await db.refresh(user)
        
        return SuccessMessage(
            success=True,
            status_code=200,
            message="Email успешно обновлен"
        )
        
    except IntegrityError as e:
        await db.rollback()
        if "users_email_key" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail="Пользователь с таким email уже существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка при обновлении email (нарушение ограничений базы данных)"
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении email: {str(e)}"
        )

async def update_user_password(email: str, new_password: str, db: AsyncSession) -> SuccessMessage:
    try:
        if db.in_transaction():
            await db.rollback()
        async with db.begin():
            stmt = select(User).where(User.email == email)
            result = await db.execute(stmt)
            user = result.scalar_one_or_none()
            
            if not user:
                raise HTTPException(
                    status_code=404,
                    detail="Пользователь с указанным email не найден"
                )
            
            user.password = new_password
            await db.commit()
            
            return SuccessMessage(
                success=True,
                status_code=200,
                message="Пароль успешно обновлен"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при обновлении пароля: {str(e)}"
        )
async def update_email_verification_status(email: str, db: AsyncSession) -> User:
    try:
        if db.in_transaction():
            await db.rollback()
        async with db.begin():
            result = await db.execute(select(User).filter(User.email == email))
            user = result.scalar_one_or_none()
            if not user:
                raise Exception("Пользователь не найден")
            user.role = "appruved_user"
            return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при подтверждении Email пользователя: {str(e)}")

async def delete_user(user_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(select(User).filter(User.id == user_id))
            user = result.scalar_one_or_none()
            if not user:
                raise Exception("Пользователь не найден")
            await db.delete(user)
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении пользователя: {str(e)}")
