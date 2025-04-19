from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ...crud import address as AddressService
from ...db.session import get_session
from ...schemas.address import AddressCreate, AddressUpdate, AddressResponse 

router = APIRouter()

@router.post("/addresses", response_model=AddressResponse, summary="Создание адреса", tags=["Адреса"])
async def create_address_handler(data: AddressCreate, db: AsyncSession = Depends(get_session)):
    return await AddressService.create_address(data, db)

@router.get("/addresses", response_model=List[AddressResponse], summary="Получение всех адресов", tags=["Адреса"])
async def get_all_addresses_handler(db: AsyncSession = Depends(get_session)):
    return await AddressService.get_all_addresses(db)

@router.get("/addresses/{address_id}", response_model=AddressResponse, summary="Получение адреса по ID", tags=["Адреса"])
async def get_address_by_id_handler(address_id: int, db: AsyncSession = Depends(get_session)):
    return await AddressService.get_address_by_id(address_id, db)

@router.put("/addresses/{address_id}", response_model=AddressResponse, summary="Обновление адреса", tags=["Адреса"])
async def update_address_handler(address_id: int, data: AddressUpdate, db: AsyncSession = Depends(get_session)):
    return await AddressService.update_address(address_id, data, db)

@router.delete("/addresses/{address_id}", summary="Удаление адреса", tags=["Адреса"])
async def delete_address_handler(address_id: int, db: AsyncSession = Depends(get_session)):
    success = await AddressService.delete_address(address_id, db)
    if success:
        return {"msg": "Адрес удален"}
    raise HTTPException(status_code=404, detail="Адрес не найден")