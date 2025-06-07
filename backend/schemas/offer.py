from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class OfferCreate(BaseModel):
    phone: str = Field(..., max_length=10)
    osmp: int
    date_d: datetime
    address_id: int
    abon_id: int
    
    class Config:
        from_attributes = True

class OfferServiceCreate(BaseModel):
    offer_id: int
    service_id: int
    
    class Config:
        from_attributes = True
        
class OfferUpdate(BaseModel):
    phone: Optional[str] = Field(None, max_length=10)
    osmp: Optional[int] = None
    date_d: Optional[datetime] = None
    address_id: Optional[int] = None
    abon_id: Optional[int] = None
    
    class Config:
        from_attributes = True
    
class OfferResponse(BaseModel):
    id: int
    phone: str = Field(..., max_length=10)
    osmp: int
    date_d: datetime
    address_id: int
    abon_id: int
    
    class Config:
        from_attributes = True