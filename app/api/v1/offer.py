from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from crud import offer as OfferService
from db.session import get_session
from schemas.offer import OfferCreate, OfferUpdate, OfferResponse

router = APIRouter()

@router.post("/offers", response_model=OfferResponse, summary="Создание договора", tags=["Договоры"])
async def create_offer_handler(data: OfferCreate, db: AsyncSession = Depends(get_session)):
    return await OfferService.create_offer(data, db)

@router.get("/offers", response_model=List[OfferResponse], summary="Получение всех договоров", tags=["Договоры"])
async def get_all_offers_handler(db: AsyncSession = Depends(get_session)):
    return await OfferService.get_all_offers(db)

@router.get("/offers/{offer_id}", response_model=OfferResponse, summary="Получение договора по ID", tags=["Договоры"])
async def get_offer_by_id_handler(offer_id: int, db: AsyncSession = Depends(get_session)):
    return await OfferService.get_offer_by_id(offer_id, db)

@router.put("/offers/{offer_id}", response_model=OfferResponse, summary="Обновление договора", tags=["Договоры"])
async def update_offer_handler(offer_id: int, data: OfferUpdate, db: AsyncSession = Depends(get_session)):
    return await OfferService.update_offer(offer_id, data, db)

@router.delete("/offers/{offer_id}", summary="Удаление договора", tags=["Договоры"])
async def delete_offer_handler(offer_id: int, db: AsyncSession = Depends(get_session)):
    success = await OfferService.delete_offer(offer_id, db)
    if success:
        return {"msg": "Договор удалён"}
    raise HTTPException(status_code=404, detail="Договор не найден")