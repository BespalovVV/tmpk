import re
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from models.user import Offer
from schemas.offer import OfferCreate, OfferUpdate


phone_regex = r'\d{10}'

async def create_offer(data: OfferCreate, db: AsyncSession) -> Offer:
    if re.fullmatch(phone_regex, data.phone):
        offer = Offer(
            phone=data.phone,
            osmp=data.osmp,
            date_d=data.date_d,
            abon_name=data.abon_name,
            address_id=data.address_id,
            abon_id=data.abon_id
        )
        try:
            db.add(offer)
            await db.commit()
            await db.refresh(offer)
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=400, detail=f"Ошибка при добавлении договора: {str(e)}")
        return offer
    else:
        raise HTTPException(status_code=400, detail=f"Неверный формат номера")


async def get_all_offers(db: AsyncSession) -> List[Offer]:
    try:
        result = await db.execute(select(Offer))
        offers = result.scalars().all()
        return offers
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении договора: {str(e)}")


async def get_offer_by_id(offer_id: int, db: AsyncSession) -> Offer:
    try:
        result = await db.execute(select(Offer).filter(Offer.id == offer_id))
        offer = result.scalar_one_or_none()
        if not offer:
            raise Exception("Договор не найден")
        return offer
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении договора: {str(e)}")


async def update_offer(offer_id: int, data: OfferUpdate, db: AsyncSession) -> Offer:
    if re.fullmatch(phone_regex, data.phone):
        try:
            async with db.begin():
                result = await db.execute(select(Offer).filter(Offer.id == offer_id))
                offer = result.scalar_one_or_none()
                if not offer:
                    raise Exception("Договор не найден")
                if data.phone:
                    offer.phone = data.phone
                if data.osmp:
                    offer.osmp = data.osmp
                if data.date_d:
                    offer.date_d = data.date_d
                if data.abon_name:
                    offer.abon_name = data.abon_name
                if data.address_id:
                    offer.address_id = data.address_id
                if data.abon_id:
                    offer.abon_id = data.abon_id
                return offer
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Ошибка при обновлении договора: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail=f"Неверный формат номера")


async def delete_offer(offer_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(select(Offer).filter(Offer.id == offer_id))
            offer = result.scalar_one_or_none()
            if not offer:
                raise Exception("Договор не найден")
            await db.delete(offer)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении договора: {str(e)}")