import re
from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..models.user import Switch
from ..schemas.switch import SwitchCreate, SwitchUpdate

ip_pattern = r'^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.' \
            r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.' \
            r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.' \
            r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'

async def create_switch(data: SwitchCreate, db: AsyncSession) -> Switch:
    if not re.fullmatch(ip_pattern, data.IP):
        raise HTTPException(
            status_code=400,
            detail="Неверный формат IP-адреса"
        )

    switch = Switch(
        IP=data.IP,
        name_com=data.name_com
    )

    try:
        db.add(switch)
        await db.commit()
        await db.refresh(switch)
        return switch
        
    except IntegrityError as e:
        await db.rollback()
        if "switches_ip_key" in (str(e.orig)).lower():
            raise HTTPException(
                status_code=409,
                detail="Коммутатор с таким IP-адресом уже существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при создании коммутатора"
        )
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании коммутатора: {str(e)}"
        )

async def get_all_switches(db: AsyncSession) -> List[Switch]:
    try:
        result = await db.execute(select(Switch))
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении списка коммутаторов: {str(e)}"
        )

async def get_switch_by_id(switch_id: int, db: AsyncSession) -> Switch:
    try:
        result = await db.execute(
            select(Switch).filter(Switch.id == switch_id)
        )
        switch = result.scalar_one_or_none()
        
        if not switch:
            raise HTTPException(
                status_code=404,
                detail="Коммутатор не найден"
            )
        return switch
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении коммутатора: {str(e)}"
        )

async def get_switch_by_ip(IP: str, db: AsyncSession) -> Switch:
    try:
        if not re.fullmatch(ip_pattern, IP):
            raise HTTPException(
                status_code=400,
                detail="Неверный формат IP-адреса"
            )
            
        result = await db.execute(
            select(Switch).filter(Switch.IP == IP)
        )
        switch = result.scalar_one_or_none()
        if switch is not None: 
            return switch
        else:
            raise HTTPException(
            status_code=404,
            detail=f"Коммутатор с IP {IP} не найден"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при поиске коммутатора по IP: {str(e)}"
        )

async def update_switch(switch_id: int, data: SwitchUpdate, db: AsyncSession) -> Switch:
    try:
        result = await db.execute(
            select(Switch).filter(Switch.id == switch_id)
        )
        switch = result.scalar_one_or_none()
        
        if not switch:
            raise HTTPException(
                status_code=404,
                detail="Коммутатор не найден"
            )

        if data.IP and not re.fullmatch(ip_pattern, data.IP):
            raise HTTPException(
                status_code=400,
                detail="Неверный формат IP-адреса"
            )

        if data.name_com:
            switch.name_com = data.name_com
        if data.IP:
            switch.IP = data.IP

        await db.commit()
        await db.refresh(switch)
        return switch
        
    except IntegrityError as e:
        await db.rollback()
        if "switches_ip_key" in str(e.orig).lower():
            raise HTTPException(
                status_code=409,
                detail="Коммутатор с таким IP-адресом уже существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при обновлении коммутатора"
        )
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении коммутатора: {str(e)}"
        )

async def delete_switch(switch_id: int, db: AsyncSession) -> bool:
    try:
        result = await db.execute(
            select(Switch).filter(Switch.id == switch_id)
        )
        switch = result.scalar_one_or_none()
        
        if not switch:
            raise HTTPException(
                status_code=404,
                detail="Коммутатор не найден"
            )
            
        await db.delete(switch)
        await db.commit()
        return True
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при удалении коммутатора: {str(e)}"
        )