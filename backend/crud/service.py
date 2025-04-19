from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from ..models.user import Service
from ..schemas.service import ServiceCreate, ServiceUpdate

async def create_service(data: ServiceCreate, db: AsyncSession) -> Service:
    service = Service(name_service=data.name_service)
    try:
        db.add(service)
        await db.commit()
        await db.refresh(service)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Ошибка при добавлении сервиса: {str(e)}")
    return service

async def get_all_services(db: AsyncSession) -> list[Service]:
    try:
        result = await db.execute(select(Service))
        services = result.scalars().all()
        return services
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении сервисов: {str(e)}")

async def get_service_by_id(service_id: int, db: AsyncSession) -> Service:
    try:
        result = await db.execute(select(Service).filter(Service.id == service_id))
        service = result.scalar_one_or_none()
        if not service:
            raise Exception("Сервис не найден")
        return service
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении сервиса: {str(e)}")

async def update_service(service_id: int, data: ServiceUpdate, db: AsyncSession) -> Service:
    try:
        async with db.begin():
            result = await db.execute(select(Service).filter(Service.id == service_id))
            service = result.scalar_one_or_none()
            if not service:
                raise Exception("Сервис не найден")
            if data.name_service:
                service.name_service = data.name_service
            return service
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при обновлении сервиса: {str(e)}")

async def delete_service(service_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(select(Service).filter(Service.id == service_id))
            service = result.scalar_one_or_none()
            if not service:
                raise Exception("Сервис не найден")
            await db.delete(service)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении сервиса: {str(e)}")