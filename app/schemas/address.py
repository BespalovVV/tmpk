from typing import Optional
from pydantic import BaseModel, Field

class AddressCreate(BaseModel):
    address: str = Field(..., max_length=255)
    com_id: int
    
    class Config:
        from_attributes = True
    
class AddressUpdate(BaseModel):
    address: Optional[str] = Field(..., max_length=255)
    com_id: Optional[int] = Field(None)
    
    class Config:
        from_attributes = True
    
class AddressResponse(BaseModel):
    id: int
    address: str
    com_id: int

    class Config:
        from_attributes = True