from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from crud import switch as SwitchService  # Здесь предполагается, что у вас есть сервис для работы с коммутаторами
from db.session import get_session
from schemas.switch import SwitchCreate, SwitchUpdate, SwitchResponse

router = APIRouter()

@router.post("/switches", response_model=SwitchResponse, summary="Создание коммутатора", tags=["Коммутаторы"])
async def create_switch_handler(data: SwitchCreate, db: AsyncSession = Depends(get_session)):
    return await SwitchService.create_switch(data, db)

@router.get("/switches", response_model=List[SwitchResponse], summary="Получение всех коммутаторов", tags=["Коммутаторы"])
async def get_all_switches_handler(db: AsyncSession = Depends(get_session)):
    return await SwitchService.get_all_switches(db)

@router.get("/switches/{switch_id}", response_model=SwitchResponse, summary="Получение коммутатора по ID", tags=["Коммутаторы"])
async def get_switch_by_id_handler(switch_id: int, db: AsyncSession = Depends(get_session)):
    return await SwitchService.get_switch_by_id(switch_id, db)

@router.get("/switches/ip/{IP}", response_model=SwitchResponse, summary="Получение коммутатора по IP", tags=["Коммутаторы"])
async def get_switch_by_ip_handler(IP: str, db: AsyncSession = Depends(get_session)):
    return await SwitchService.get_switch_by_ip(IP, db)

@router.put("/switches/{switch_id}", response_model=SwitchResponse, summary="Обновление коммутатора", tags=["Коммутаторы"])
async def update_switch_handler(switch_id: int, data: SwitchUpdate, db: AsyncSession = Depends(get_session)):
    return await SwitchService.update_switch(switch_id, data, db)

@router.delete("/switches/{switch_id}", summary="Удаление коммутатора", tags=["Коммутаторы"])
async def delete_switch_handler(switch_id: int, db: AsyncSession = Depends(get_session)):
    success = await SwitchService.delete_switch(switch_id, db)
    if success:
        return {"msg": "Коммутатор удален"}
    raise HTTPException(status_code=404, detail="Коммутатор не найден", tags=["Коммутаторы"])