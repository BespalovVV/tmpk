from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    name: str = Field(..., max_length=128)
    login: str = Field(..., min_length=8, max_length=64)
    password: str = Field(..., min_length=8, max_length=64)
    email: EmailStr

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=128)
    login: Optional[str] = Field(None, min_length=8, max_length=64)
    password: Optional[str] = Field(None, min_length=8, max_length=64)
    email: Optional[EmailStr] = None

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    name: str
    login: str
    email: EmailStr

    class Config:
        orm_mode = True