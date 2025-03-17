from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import Address
from schemas.address import AddressCreate, AddressUpdate

async def create_address(data: AddressCreate, db: AsyncSession) -> Address:
    address = Address(com_id=data.com_id, address=data.address)
    try:
        db.add(address)
        await db.commit()
        await db.refresh(address)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Ошибка при добавлении адреса: {str(e)}")
    
    return address

async def get_all_addresses(db: AsyncSession) -> List[Address]:
    try:
        result = await db.execute(select(Address))
        addresses = result.scalars().all()
        return addresses
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении адресов: {str(e)}")

async def get_address_by_id(address_id: int, db: AsyncSession) -> Address:
    try:
        result = await db.execute(select(Address).filter(Address.id == address_id))
        address = result.scalar_one_or_none()
        if not address:
            raise HTTPException(status_code=404, detail="Адрес не найден")
        return address
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении адреса: {str(e)}")

async def update_address(address_id: int, data: AddressUpdate, db: AsyncSession) -> Address:
    try:
        async with db.begin():
            address = await get_address_by_id(address_id, db)
            if not address:
                raise HTTPException(status_code=404, detail="Адрес не найден")
            if data.address:
                address.address = data.address
            if data.com_id:
                address.com_id = data.com_id
            return address
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при обновлении адреса: {str(e)}")

async def delete_address(address_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            address = await get_address_by_id(address_id, db)
            if not address:
                raise HTTPException(status_code=404, detail="Адрес не найден")
            await db.delete(address)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении адреса: {str(e)}")
