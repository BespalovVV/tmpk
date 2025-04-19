import re
from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from ..models.user import Abonent
from ..schemas.abonent import AbonCreate, AbonUpdate

phone_regex = r'\d{10}'

async def create_abon(data: AbonCreate, db: AsyncSession) -> Abonent:
    if re.fullmatch(phone_regex, data.phone_number):
        
        abon = Abonent(abon_name=data.abon_name, phone_number=data.phone_number, status=data.status)
        
        try:
            db.add(abon)
            await db.commit()
            await db.refresh(abon)
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=400, detail=f"Ошибка при добавлении абонента: {str(e)}")
        
        return abon
    else:
        raise HTTPException(status_code=400, detail=f"Неверный формат номера")

async def get_all_abons(db: AsyncSession) -> List[Abonent]:
    try:
        result = await db.execute(select(Abonent))
        abons = result.scalars().all()
        return abons
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении абонентов: {str(e)}")

async def get_abon_by_id(abon_id: int, db: AsyncSession) -> Abonent:
    try:
        result = await db.execute(select(Abonent).filter(Abonent.id == abon_id))
        abon = result.scalar_one_or_none()
        if not abon:
            raise Exception("Абонент не найден")
        return abon
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении абонента: {str(e)}")

async def get_abon_by_phone_number(phone_number: str, db: AsyncSession) -> Abonent:
    try:
        result = await db.execute(select(Abonent).filter(Abonent.phone_number == phone_number))
        abon = result.scalar_one_or_none()
        return abon
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении абонента по телефону: {str(e)}")

async def update_abon(abon_id: int, data: AbonUpdate, db: AsyncSession) -> Abonent:
    try:
        async with db.begin():
            result = await db.execute(select(Abonent).filter(Abonent.id == abon_id))
            abon = result.scalar_one_or_none()
            if not abon:
                raise Exception("Абонент не найден")
            if data.abon_name:
                abon.abon_name = data.abon_name
            if data.phone_number:
                abon.phone_number = data.phone_number
            if data.status:
                abon.status = data.status
            return abon
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при обновлении абонента: {str(e)}")

async def delete_abon(abon_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(select(Abonent).filter(Abonent.id == abon_id))
            abon = result.scalar_one_or_none()
            if not abon:
                raise Exception("Абонент не найден")
            await db.delete(abon)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении Абонента: {str(e)}")