import re
from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..models.user import Offer, Offer_Service, Service
from ..schemas.offer import OfferCreate, OfferUpdate

phone_regex = r'^\d{10}$'

async def create_offer(data: OfferCreate, db: AsyncSession) -> Offer:
    if not re.fullmatch(phone_regex, data.phone):
        raise HTTPException(
            status_code=400,
            detail="Номер телефона должен содержать ровно 10 цифр"
        )

    offer = Offer(
        phone=data.phone,
        osmp=data.osmp,
        date_d=data.date_d,
        abon_name=data.abon_name,
        address_id=data.address_id,
        abon_id=data.abon_id
    )

    try:
        async with db.begin():
            db.add(offer)
            await db.flush()
            await db.refresh(offer)
        return offer
        
    except IntegrityError as e:
        if "offers_address_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный адрес не существует"
            )
        if "offers_abon_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный абонент не найден"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при создании договора"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании договора: {str(e)}"
        )

async def get_all_offers(db: AsyncSession) -> List[Offer]:
    try:
        async with db.begin():
            result = await db.execute(select(Offer))
            return result.scalars().all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении списка договоров: {str(e)}"
        )

async def get_offer_by_id(offer_id: int, db: AsyncSession) -> Offer:
    try:
        async with db.begin():
            offer = (await db.execute(
                select(Offer).where(Offer.id == offer_id)
            )).scalar_one_or_none()
            
            if offer is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Договор с ID {offer_id} не найден"
                )
            return offer
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении договора: {str(e)}"
        )

async def update_offer(offer_id: int, data: OfferUpdate, db: AsyncSession) -> Offer:
    try:
        if data.phone and not re.fullmatch(phone_regex, data.phone):
            raise HTTPException(
                status_code=400,
                detail="Номер телефона должен содержать ровно 10 цифр"
            )

        async with db.begin():
            offer = (await db.execute(
                select(Offer).where(Offer.id == offer_id)
            )).scalar_one_or_none()
            
            if offer is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Договор с ID {offer_id} не найден"
                )

            if data.phone:
                offer.phone = data.phone
            if data.osmp is not None:
                offer.osmp = data.osmp
            if data.date_d:
                offer.date_d = data.date_d
            if data.abon_name:
                offer.abon_name = data.abon_name
            if data.address_id:
                offer.address_id = data.address_id
            if data.abon_id:
                offer.abon_id = data.abon_id

            await db.flush()
            await db.refresh(offer)
            return offer
            
    except IntegrityError as e:
        if "offers_address_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный адрес не существует"
            )
        if "offers_abon_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный абонент не найден"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при обновлении договора"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении договора: {str(e)}"
        )
async def add_service(o_id: int, s_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            offer = (await db.execute(
                select(Offer).where(Offer.id == o_id)
            )).scalar_one_or_none()
            
            service = (await db.execute(
                select(Service).where(Service.id == s_id)
            )).scalar_one_or_none()

            if offer is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Договор с ID {o_id} не найден"
                )
            if service is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Сервис с ID {s_id} не найден"
                )

            offer_service = Offer_Service(
                offer_id=o_id,
                service_id=s_id
            )
            db.add(offer_service)
            await db.flush()
            
        return True

    except IntegrityError as e:
        if "offer_service_pkey" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail="Эта связь уже существует"
            )
        elif "offer_service_offer_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный договор не существует"
            )
        elif "offer_service_service_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный сервис не существует"
            )
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка целостности данных: {str(e)}"
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании связи: {str(e)}"
        )
async def delete_offer(offer_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            offer = (await db.execute(
                select(Offer).where(Offer.id == offer_id)
            )).scalar_one_or_none()
            
            if offer is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Договор с ID {offer_id} не найден"
                )
                
            await db.delete(offer)
            return True
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при удалении договора: {str(e)}"
        )