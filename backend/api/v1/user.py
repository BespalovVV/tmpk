from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ...core.security import get_current_user
from ...crud import user as UserService
from ...db.session import get_session
from ...schemas.user import UserCreate, UserEmailUpdate, UserUpdate, UserResponse, UserNotif
from ...core.email_notification import confirm_email

router = APIRouter()

@router.post('/users', tags=["Пользователи"], summary="Добавление пользователя")
async def create(data: UserCreate, db: AsyncSession = Depends(get_session)):
    return await UserService.create_user(data, db)

@router.get('/users', tags=["Пользователи"], response_model=list[UserResponse], summary="Получение всех пользователей")
async def get_all_users(db: AsyncSession = Depends(get_session)):
    return await UserService.get_all_users(db)

@router.get('/users/{user_id}', tags=["Пользователи"], response_model=UserResponse, summary="Получение пользователя по ID")
async def get_user_by_id(user_id: int, db: AsyncSession = Depends(get_session)):
    return await UserService.get_user_by_id(user_id, db)

@router.get('/users/login/{login}', tags=["Пользователи"], response_model=UserResponse, summary="Получение пользователя по логину")
async def get_user_by_login(login: str, db: AsyncSession = Depends(get_session)):
    return await UserService.get_user_by_login(login, db)

@router.get('/users/email/{email}', tags=["Пользователи"], response_model=UserResponse, summary="Получение пользователя по почте")
async def get_user_by_email(email: str, db: AsyncSession = Depends(get_session)):
    return await UserService.get_user_by_email(email, db)

@router.put('/users/{user_id}', tags=["Пользователи"], summary="Обновление пользователя")
async def update_user(user_id: int, data: UserUpdate, db: AsyncSession = Depends(get_session), current_user: dict = Depends(get_current_user)):
    if current_user['user_role'] == "admin" or int(current_user['user_id']) == int(user_id):
        return await UserService.update_user(user_id, data, db)
    else:
        raise HTTPException(status_code=401, detail="Недостаточно прав")
    
@router.put('/update-email', tags=["Пользователи"], summary="Обновление email")
async def update_user(data: UserEmailUpdate, db: AsyncSession = Depends(get_session)):
    return await UserService.update_email(data, db)

@router.delete('/users/{user_id}', tags=["Пользователи"], summary="Удаление пользователя")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_session), current_user: dict = Depends(get_current_user)):
    if current_user['user_role'] == "admin":
        return await UserService.delete_user(user_id, db)
    else:
        raise HTTPException(status_code=401, detail="Недостаточно прав")
    