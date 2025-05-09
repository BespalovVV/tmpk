from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..models.user import Address
from ..schemas.address import AddressCreate, AddressUpdate

async def create_address(data: AddressCreate, db: AsyncSession) -> Address:
    address = Address(
        com_id=data.com_id,
        address=data.address
    )

    try:
        async with db.begin():
            db.add(address)
            await db.flush()
            await db.refresh(address)
        return address
        
    except IntegrityError as e:
        raise HTTPException(
            status_code=409,
            detail=f"Коммутатор с ID {data.com_id} не найден"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании адреса: {str(e)}"
        )

async def get_all_addresses(db: AsyncSession) -> List[Address]:
    try:
        async with db.begin():
            result = await db.execute(select(Address))
            return result.scalars().all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении списка адресов: {str(e)}"
        )

async def get_address_by_id(address_id: int, db: AsyncSession) -> Address:
    try:
        async with db.begin():
            result = await db.execute(
                select(Address).where(Address.id == address_id)
            )
            address = result.scalar_one_or_none()
            
            if address is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Адрес с ID {address_id} не найден"
                )
            return Address(**{k: v for k, v in address.__dict__.items() if not k.startswith('_')})
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении адреса: {str(e)}"
        )

async def update_address(address_id: int, data: AddressUpdate, db: AsyncSession) -> Address:
    try:
        async with db.begin():
            result = await db.execute(
                select(Address).where(Address.id == address_id)
            )
            address = result.scalar_one_or_none()
            
            if address is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Адрес с ID {address_id} не найден"
                )

            if data.address:
                address.address = data.address
            if data.com_id is not None:
                address.com_id = data.com_id

            await db.flush()
            await db.refresh(address)
            return address
            
    except IntegrityError as e:
        raise HTTPException(
            status_code=409,
            detail="Адрес для этого коммутатора уже существует"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении адреса: {str(e)}"
        )

async def delete_address(address_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(
                select(Address).where(Address.id == address_id)
            )
            address = result.scalar_one_or_none()
            
            if address is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Адрес с ID {address_id} не найден"
                )
                
            await db.delete(address)
            return True
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при удалении адреса: {str(e)}"
        )