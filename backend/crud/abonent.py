import re
from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..models.user import Abonent
from ..schemas.abonent import AbonCreate, AbonUpdate

phone_regex = r'^\d{10}$'

async def create_abon(data: AbonCreate, db: AsyncSession) -> Abonent:
    if not re.fullmatch(phone_regex, data.phone_number):
        raise HTTPException(
            status_code=400,
            detail="Номер телефона должен содержать ровно 10 цифр"
        )

    abon = Abonent(
        abon_name=data.abon_name,
        phone_number=data.phone_number,
        status=data.status
    )

    try:
        db.add(abon)
        await db.commit()
        await db.refresh(abon)
        return abon
        
    except IntegrityError as e:
        await db.rollback()
        if "abonents_phone_number_key" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail="Абонент с таким номером телефона уже существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при создании абонента"
        )
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании абонента: {str(e)}"
        )

async def get_all_abons(db: AsyncSession) -> List[Abonent]:
    try:
        result = await db.execute(select(Abonent))
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении списка абонентов: {str(e)}"
        )

async def get_abon_by_id(abon_id: int, db: AsyncSession) -> Abonent:
    try:
        result = await db.execute(
            select(Abonent).filter(Abonent.id == abon_id)
        )
        abon = result.scalar_one_or_none()
        
        if not abon:
            raise HTTPException(
                status_code=404,
                detail="Абонент не найден"
            )
        return abon
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении абонента: {str(e)}"
        )

async def get_abon_by_phone_number(phone_number: str, db: AsyncSession) -> Abonent|None:
    try:
        if not re.fullmatch(phone_regex, phone_number):
            raise HTTPException(
                status_code=400,
                detail="Неверный формат номера телефона"
            )
            
        result = await db.execute(
            select(Abonent).filter(Abonent.phone_number == phone_number)
        )
        if result.scalar_one_or_none() is not None: 
            return result.scalar_one_or_none()
        else:
            raise HTTPException(
            status_code=404,
            detail=f"Абонент с таким номером не найден"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при поиске абонента по номеру: {str(e)}"
        )

async def update_abon(abon_id: int, data: AbonUpdate, db: AsyncSession) -> Abonent:
    try:
        result = await db.execute(
            select(Abonent).filter(Abonent.id == abon_id)
        )
        abon = result.scalar_one_or_none()
        
        if not abon:
            raise HTTPException(
                status_code=404,
                detail="Абонент не найден"
            )

        if data.phone_number and not re.fullmatch(phone_regex, data.phone_number):
            raise HTTPException(
                status_code=400,
                detail="Номер телефона должен содержать ровно 10 цифр"
            )

        if data.abon_name:
            abon.abon_name = data.abon_name
        if data.phone_number:
            abon.phone_number = data.phone_number
        if data.status is not None:
            abon.status = data.status

        await db.commit()
        await db.refresh(abon)
        return abon
        
    except IntegrityError as e:
        await db.rollback()
        if "abonent_phone_number_key" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail="Абонент с таким номером телефона уже существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при обновлении абонента"
        )
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении абонента: {str(e)}"
        )

async def delete_abon(abon_id: int, db: AsyncSession) -> bool:
    try:
        result = await db.execute(
            select(Abonent).filter(Abonent.id == abon_id)
        )
        abon = result.scalar_one_or_none()
        
        if not abon:
            raise HTTPException(
                status_code=404,
                detail="Абонент не найден"
            )
            
        await db.delete(abon)
        await db.commit()
        return True
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при удалении абонента: {str(e)}"
        )