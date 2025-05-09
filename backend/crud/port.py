from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from ..models.user import Port
from ..schemas.port import PortCreate, PortUpdate

async def create_port(data: PortCreate, db: AsyncSession) -> Port:
    port = Port(
        number=data.number,
        name_port=data.name_port,
        status_link=data.status_link,
        switch_id=data.switch_id
    )
    
    try:
        async with db.begin():
            db.add(port)
            await db.flush()
            await db.refresh(port)
        return port
        
    except IntegrityError as e:
        if "ports_switch_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный коммутатор не существует"
            )
        elif "port_number_switch_id_key" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail=f"Порт с таким номером уже существует на этом коммутаторе"
            )
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка целостности данных при создании порта"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании порта: {str(e)}"
        )

async def get_all_ports(db: AsyncSession) -> list[Port]:
    try:
        async with db.begin():
            result = await db.execute(select(Port))
            return result.scalars().all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении списка портов: {str(e)}"
        )

async def get_port_by_id(port_id: int, db: AsyncSession) -> Port:
    try:
        async with db.begin():
            port = (await db.execute(
                select(Port).where(Port.id == port_id)
            )).scalar_one_or_none()
            
            if port is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Порт с ID {port_id} не найден"
                )
            return port
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении порта: {str(e)}"
        )

async def update_port(port_id: int, data: PortUpdate, db: AsyncSession) -> Port:
    try:
        async with db.begin():
            port = (await db.execute(
                select(Port).where(Port.id == port_id)
            )).scalar_one_or_none()
            
            if port is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Порт с ID {port_id} не найден"
                )

            if data.number is not None:
                port.number = data.number
            if data.name_port is not None:
                port.name_port = data.name_port
            if data.status_link is not None:
                port.status_link = data.status_link

            await db.flush()
            await db.refresh(port)
            return port
            
    except IntegrityError as e:
        if "port_number_switch_id_key" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail="Порт с таким номером уже существует на этом коммутаторе"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при обновлении порта"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении порта: {str(e)}"
        )

async def delete_port(port_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            port = (await db.execute(
                select(Port).where(Port.id == port_id)
            )).scalar_one_or_none()
            
            if port is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Порт с ID {port_id} не найден"
                )
                
            await db.delete(port)
            return True
            
    except IntegrityError as e:
        if "foreign key constraint" in str(e.orig).lower():
            raise HTTPException(
                status_code=400,
                detail="Невозможно удалить порт, так как он используется в других таблицах"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при удалении порта"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при удалении порта: {str(e)}"
        )