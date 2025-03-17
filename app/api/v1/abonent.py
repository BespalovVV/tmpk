from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from crud import abonent as AbonentService
from db.session import get_session
from schemas.abonent import AbonCreate, AbonUpdate, AbonResponse

router = APIRouter()

@router.post("/abons", response_model=AbonCreate, summary="Создание абонента", tags=["Абоненты"])
async def create_abon_handler(data: AbonCreate, db: AsyncSession = Depends(get_session)):
    return await AbonentService.create_abon(data, db)

@router.get("/abons", response_model=List[AbonCreate], summary="Получение всех абонентов", tags=["Абоненты"])
async def get_all_abons_handler(db: AsyncSession = Depends(get_session)):
    return await AbonentService.get_all_abons(db)

@router.get("/abons/{abon_id}", response_model=AbonCreate, summary="Получение абонента по ID", tags=["Абоненты"])
async def get_abon_by_id_handler(abon_id: int, db: AsyncSession = Depends(get_session)):
    return await AbonentService.get_abon_by_id(abon_id, db)

@router.get("/abons/phone/{phone_number}", response_model=AbonCreate, summary="Получение абонента по телефону", tags=["Абоненты"])
async def get_abon_by_phone_handler(phone_number: str, db: AsyncSession = Depends(get_session)):
    return await AbonentService.get_abon_by_phone_number(phone_number, db)

@router.put("/abons/{abon_id}", response_model=AbonUpdate, summary="Обновление абонента", tags=["Абоненты"])
async def update_abon_handler(abon_id: int, data: AbonUpdate, db: AsyncSession = Depends(get_session)):
    return await AbonentService.update_abon(abon_id, data, db)

@router.delete("/abons/{abon_id}", summary="Удаление абонента", tags=["Абоненты"])
async def delete_abon_handler(abon_id: int, db: AsyncSession = Depends(get_session)):
    success = await AbonentService.delete_abon(abon_id, db)
    if success:
        return {"msg": "Абонент удален"}
    raise HTTPException(status_code=404, detail="Абонент не найден", tags=["Абоненты"])