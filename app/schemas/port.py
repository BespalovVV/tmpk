import enum
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional

# Перечисление для статуса соединения
class LinkStatus(str, enum.Enum):
    Connected = "Подключен",
    Disconnected = "Отключен",

# Схема для создания порта
class PortCreate(BaseModel):
    number: int
    name_port: str = Field(..., max_length=128)
    status_link: LinkStatus = LinkStatus.Disconnected
    switch_id: int

    class Config:
        orm_mode = True

# Схема для обновления порта
class PortUpdate(BaseModel):
    number: Optional[int] = None
    name_port: Optional[str] = Field(None, max_length=128)
    status_link: Optional[LinkStatus] = None

    class Config:
        orm_mode = True

# Схема для ответа с информацией о порте
class PortResponse(BaseModel):
    id: int
    number: int
    name_port: str
    status_link: LinkStatus
    switch_id: int

    class Config:
        orm_mode = True