from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ...crud import service as ServiceService
from ...db.session import get_session
from ...schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse

router = APIRouter()

@router.post("/services", response_model=ServiceResponse, summary="Создание услуги", tags=["Услуги"])
async def create_service_handler(data: ServiceCreate, db: AsyncSession = Depends(get_session)):
    return await ServiceService.create_service(data, db)

@router.get("/services", response_model=List[ServiceResponse], summary="Получение всех услуг", tags=["Услуги"])
async def get_all_services_handler(db: AsyncSession = Depends(get_session)):
    return await ServiceService.get_all_services(db)

@router.get("/services/{service_id}", response_model=ServiceResponse, summary="Получение услуги по ID", tags=["Услуги"])
async def get_service_by_id_handler(service_id: int, db: AsyncSession = Depends(get_session)):
    return await ServiceService.get_service_by_id(service_id, db)

@router.get("/services-for-offer/{offer_id}", response_model=List[Any], summary="Получение ID услуг по договору", tags=["Услуги"])
async def get_service_by_id_handler(offer_id: int, db: AsyncSession = Depends(get_session)):
    return await ServiceService.get_services_by_offer_id(offer_id, db)

@router.put("/services/{service_id}", response_model=ServiceResponse, summary="Обновление услуги", tags=["Услуги"])
async def update_service_handler(service_id: int, data: ServiceUpdate, db: AsyncSession = Depends(get_session)):
    return await ServiceService.update_service(service_id, data, db)

@router.delete("/services/{service_id}", summary="Удаление услуги", tags=["Услуги"])
async def delete_service_handler(service_id: int, db: AsyncSession = Depends(get_session)):
    success = await ServiceService.delete_service(service_id, db)
    if success:
        return {"msg": "Услуга удалена"}
    raise HTTPException(status_code=404, detail="Услуга не найдена")