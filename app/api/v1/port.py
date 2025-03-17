from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from crud import port as PortService
from db.session import get_session
from schemas.port import PortCreate, PortUpdate, PortResponse

router = APIRouter()

@router.post("/ports", response_model=PortResponse, summary="Создание порта", tags=["Порты"])
async def create_port_handler(data: PortCreate, db: AsyncSession = Depends(get_session)):
    return await PortService.create_port(data, db)

@router.get("/ports", response_model=List[PortResponse], summary="Получение всех портов", tags=["Порты"])
async def get_all_ports_handler(db: AsyncSession = Depends(get_session)):
    return await PortService.get_all_ports(db)

@router.get("/ports/{port_id}", response_model=PortResponse, summary="Получение порта по ID", tags=["Порты"])
async def get_port_by_id_handler(port_id: int, db: AsyncSession = Depends(get_session)):
    return await PortService.get_port_by_id(port_id, db)

@router.put("/ports/{port_id}", response_model=PortResponse, summary="Обновление порта", tags=["Порты"])
async def update_port_handler(port_id: int, data: PortUpdate, db: AsyncSession = Depends(get_session)):
    return await PortService.update_port(port_id, data, db)

@router.delete("/ports/{port_id}", summary="Удаление порта", tags=["Порты"])
async def delete_port_handler(port_id: int, db: AsyncSession = Depends(get_session)):
    success = await PortService.delete_port(port_id, db)
    if success:
        return {"msg": "Порт удален"}
    raise HTTPException(status_code=404, detail="Порт не найден")