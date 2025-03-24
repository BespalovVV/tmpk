from pydantic import BaseModel, Field
from typing import Optional

class SwitchCreate(BaseModel):
    IP: str = Field(..., max_length=15)
    name_com: str = Field(..., max_length=128)

    class Config:
        from_attributes = True

class SwitchUpdate(BaseModel):
    IP: Optional[str] = Field(None, max_length=15)
    name_com: Optional[str] = Field(None, max_length=128)

    class Config:
        from_attributes = True

class SwitchResponse(BaseModel):
    id: int
    IP: str
    name_com: str

    class Config:
        from_attributes = True