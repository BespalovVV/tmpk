import enum
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Union


class Role(str, enum.Enum):
    admin = "admin"
    appruved_user = "appruved_user"
    unknown_user = "unknown_user"

class UserLogin(BaseModel):
    login_or_email: Union[str, EmailStr] = Field(..., description="Логин или Email")
    password: str = Field(..., min_length=8, description="Пароль")
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str = Field(..., max_length=128)
    login: str = Field(..., min_length=8, max_length=64)
    password: str = Field(..., min_length=8, max_length=64)
    email: EmailStr

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=128)
    login: Optional[str] = Field(None, min_length=8, max_length=64)
    password: Optional[str] = Field(None, min_length=8, max_length=64)
    email: Optional[EmailStr] = None
    role: Optional[Role] = None

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    name: str
    login: str
    email: EmailStr
    role: Role

    class Config:
        from_attributes = True

class UserNotif(BaseModel):
    email: EmailStr
    class Config:
        from_attributes = True
        
class UserEmailUpdate(BaseModel):
    new_email: EmailStr
    old_email: EmailStr
    class Config:
        from_attributes = True