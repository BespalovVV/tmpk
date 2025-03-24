import enum
from typing import Optional
from pydantic import BaseModel, Field

class AbonStatus(str, enum.Enum):
    Connection = 'Подключение',
    Active = 'Активен',
    Blocking = 'Блокировка',
    Debtor = 'Должник',
    On_termination = 'На расторжение',
    Terminated = 'Расторгнут',

class AbonCreate(BaseModel):
    abon_name: str = Field(..., max_length=128)
    phone_number: str = Field(..., max_length=10, min_length=10)
    status: AbonStatus
    
    class Config:
        from_attributes = True
    
class AbonUpdate(BaseModel):
    abon_name: Optional[str] = Field(None, max_length=128)
    phone_number: Optional[str] = Field(None, max_length=10, min_length=10)
    status: Optional[AbonStatus] = Field(None)
    
    class Config:
        from_attributes = True
    
class AbonResponse(BaseModel):
    id: int
    abon_name: str
    phone_number: str
    status: AbonStatus

    class Config:
        from_attributes = True