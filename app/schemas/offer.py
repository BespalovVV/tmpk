from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class OfferCreate(BaseModel):
    phone: str = Field(..., max_length=10)
    osmp: int
    date_d: datetime
    abon_name: str = Field(..., max_length=128)
    address_id: int
    abon_id: int
    
class OfferUpdate(BaseModel):
    phone: Optional[str] = Field(None, max_length=10)
    osmp: Optional[int] = None
    date_d: Optional[datetime] = None
    abon_name: Optional[str] = Field(None, max_length=128)
    address_id: Optional[int] = None
    abon_id: Optional[int] = None
    
class OfferResponse(BaseModel):
    id: int
    phone: str = Field(..., max_length=10)
    osmp: int
    date_d: datetime
    abon_name: str = Field(..., max_length=128)
    address_id: int
    abon_id: int

    class Config:
        orm_mode = True