from typing import Optional
from pydantic import BaseModel, Field

class ServiceCreate(BaseModel):
    name_service: str = Field(..., max_length=255)
    
    class Config:
        from_attributes = True
    
class ServiceUpdate(BaseModel):
    name_service: Optional[str] = Field(..., max_length=255)
    
    class Config:
        from_attributes = True
        
class ServiceResponse(BaseModel):
    id: int
    name_service: str

    class Config:
        from_attributes = True