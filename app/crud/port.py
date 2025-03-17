from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models.user import Port
from schemas.port import PortCreate, PortUpdate


async def create_port(data: PortCreate, db: AsyncSession) -> Port:
    port = Port(
        number=data.number,
        name_port=data.name_port,
        status_link=data.status_link,
        switch_id=data.switch_id
    )
    try:
        db.add(port)
        await db.commit()
        await db.refresh(port)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Ошибка при добавлении порта: {str(e)}")
    return port

async def get_all_ports(db: AsyncSession) -> list[Port]:
    try:
        result = await db.execute(select(Port))
        ports = result.scalars().all()
        return ports
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении портов: {str(e)}")

async def get_port_by_id(port_id: int, db: AsyncSession) -> Port:
    try:
        result = await db.execute(select(Port).filter(Port.id == port_id))
        port = result.scalar_one_or_none()
        if not port:
            raise HTTPException(status_code=404, detail="Порт не найден")
        return port
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении порта: {str(e)}")

async def update_port(port_id: int, data: PortUpdate, db: AsyncSession) -> Port:
    try:
        async with db.begin():
            port = await get_port_by_id(port_id, db)
            if not port:
                raise HTTPException(status_code=404, detail="Порт не найден")
            if data.number is not None:
                port.number = data.number
            if data.name_port:
                port.name_port = data.name_port
            if data.status_link:
                port.status_link = data.status_link
            return port
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при обновлении порта: {str(e)}")

async def delete_port(port_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            port = await get_port_by_id(port_id, db)
            if not port:
                raise HTTPException(status_code=404, detail="Порт не найден")
            
            await db.delete(port)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении порта: {str(e)}")