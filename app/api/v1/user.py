from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from crud import user as UserService
from db.session import get_session
from schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()

@router.post('/users', tags=["Пользователи"], summary="Добавление пользователя")
async def create(data: UserCreate, db: AsyncSession = Depends(get_session)):
    try:
        user = await UserService.create_user(data, db)
        return {"msg": "Пользователь добавлен"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/users', tags=["Пользователи"], response_model=list[UserResponse], summary="Получение всех пользователей")
async def get_all_users(db: AsyncSession = Depends(get_session)):
    try:
        users = await UserService.get_all_users(db)
        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/users/{user_id}', tags=["Пользователи"], response_model=UserResponse, summary="Получение пользователя по ID")
async def get_user_by_id(user_id: int, db: AsyncSession = Depends(get_session)):
    try:
        user = await UserService.get_user_by_id(user_id, db)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/users/login/{login}', tags=["Пользователи"], response_model=UserResponse, summary="Получение пользователя по логину")
async def get_user_by_login(login: str, db: AsyncSession = Depends(get_session)):
    try:
        user = await UserService.get_user_by_login(login, db)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get('/users/email/{email}', tags=["Пользователи"], response_model=UserResponse, summary="Получение пользователя по почте")
async def get_user_by_email(email: str, db: AsyncSession = Depends(get_session)):
    try:
        user = await UserService.get_user_by_email(email, db)
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put('/users/{user_id}', tags=["Пользователи"], summary="Обновление пользователя")
async def update_user(user_id: int, data: UserUpdate, db: AsyncSession = Depends(get_session)):
    try:
        updated_user = await UserService.update_user(user_id, data, db)
        if not updated_user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return {"msg": "Пользователь обновлен"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete('/users/{user_id}', tags=["Пользователи"], summary="Удаление пользователя")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_session)):
    try:
        deleted = await UserService.delete_user(user_id, db)
        if not deleted:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        return {"msg": "Пользователь удален"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))