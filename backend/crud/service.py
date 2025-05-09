from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..crud.offer import get_offer_by_id
from ..models.user import Offer_Service, Service
from ..schemas.service import ServiceCreate, ServiceUpdate

async def create_service(data: ServiceCreate, db: AsyncSession) -> Service:
    service = Service(name_service=data.name_service)
    
    try:
        async with db.begin():
            db.add(service)
            await db.flush()
            await db.refresh(service)
        return service
        
    except IntegrityError as e:
        if "services_name_service_key" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail="Сервис с таким названием уже существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при создании сервиса"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании сервиса: {str(e)}"
        )

async def get_all_services(db: AsyncSession) -> List[Service]:
    try:
        async with db.begin():
            result = await db.execute(select(Service))
            return result.scalars().all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении списка сервисов: {str(e)}"
        )

async def get_service_by_id(service_id: int, db: AsyncSession) -> Service:
    try:
        async with db.begin():
            service = (await db.execute(
                select(Service).where(Service.id == service_id)
            )).scalar_one_or_none()
            
            if service is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Сервис с ID {service_id} не найден"
                )
            return service
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении сервиса: {str(e)}"
        )

async def get_services_by_offer_id(offer_id: int, db: AsyncSession) -> List[int]:
    try:
        # Проверяем существование договора
        offer = await get_offer_by_id(offer_id, db)
        if offer is None:
            raise HTTPException(
                status_code=404,
                detail=f"Договор с ID {offer_id} не найден"
            )
            
        async with db.begin():
            result = await db.execute(
                select(Offer_Service.service_id)
                .where(Offer_Service.offer_id == offer_id)
            )
            services = result.scalars().all()
            
            if not services:
                raise HTTPException(
                    status_code=404,
                    detail=f"Для договора {offer_id} не найдено услуг"
                )
            return services
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении услуг договора: {str(e)}"
        )

async def update_service(service_id: int, data: ServiceUpdate, db: AsyncSession) -> Service:
    try:
        async with db.begin():
            service = (await db.execute(
                select(Service).where(Service.id == service_id)
            )).scalar_one_or_none()
            
            if service is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Сервис с ID {service_id} не найден"
                )

            if data.name_service:
                service.name_service = data.name_service

            await db.flush()
            await db.refresh(service)
            return service
            
    except IntegrityError as e:
        if "service_name_service_key" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail="Сервис с таким названием уже существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при обновлении сервиса"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении сервиса: {str(e)}"
        )

async def delete_service(service_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            service = (await db.execute(
                select(Service).where(Service.id == service_id)
            )).scalar_one_or_none()
            
            if service is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Сервис с ID {service_id} не найден"
                )
                
            await db.delete(service)
            return True
            
    except IntegrityError as e:
        if "offer_service_service_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Невозможно удалить сервис, так как он привязан к договорам"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при удалении сервиса"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при удалении сервиса: {str(e)}"
        )