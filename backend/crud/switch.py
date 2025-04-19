import re
from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..models.user import Switch
from ..schemas.switch import SwitchCreate, SwitchUpdate


ip_pattern = r'^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.' \
            r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.' \
            r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.' \
            r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'

async def create_switch(data: SwitchCreate, db: AsyncSession) -> Switch:
    if re.fullmatch(ip_pattern, data.IP):
        switch = Switch(IP=data.IP, name_com=data.name_com)
        try:
            db.add(switch)
            await db.commit()
            await db.refresh(switch)
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=400, detail=f"Ошибка при добавлении коммутатора: {str(e)}")
        
        return switch
    else:
        raise HTTPException(status_code=400, detail=f"Неверный формат IP")

async def get_all_switches(db: AsyncSession) -> List[Switch]:
    try:
        result = await db.execute(select(Switch))
        switches = result.scalars().all()
        return switches
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении коммутаторов: {str(e)}")

async def get_switch_by_id(switch_id: int, db: AsyncSession) -> Switch:
    try:
        result = await db.execute(select(Switch).filter(Switch.id == switch_id))
        switch = result.scalar_one_or_none()
        if not switch:
            raise Exception("Коммутатор не найден")
        return switch
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении коммутатора: {str(e)}")

async def get_switch_by_ip(IP: str, db: AsyncSession) -> Switch:
    try:
        result = await db.execute(select(Switch).filter(Switch.IP == IP))
        switch = result.scalar_one_or_none()
        return switch
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении коммутатора по IP: {str(e)}")

async def update_switch(switch_id: int, data: SwitchUpdate, db: AsyncSession) -> Switch:
    if data.IP == None or re.fullmatch(ip_pattern, data.IP):
        try:
            async with db.begin():
                result = await db.execute(select(Switch).filter(Switch.id == switch_id))
                switch = result.scalar_one_or_none()
                if not switch:
                    raise Exception("Коммутатор не найден")
                if data.name_com:
                    switch.name_com = data.name_com
                if data.IP:
                    switch.IP = data.IP
                return switch
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Ошибка при обновлении коммутатора: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail=f"Неверный формат IP")

async def delete_switch(switch_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(select(Switch).filter(Switch.id == switch_id))
            switch = result.scalar_one_or_none()
            if not switch:
                raise Exception("Коммутатор не найден")
            await db.delete(switch)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении коммутатора: {str(e)}")