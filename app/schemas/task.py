from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Схема для создания задачи
class TaskCreate(BaseModel):
    description: str = Field(..., max_length=256)
    topic: str = Field(..., max_length=128)
    date_from: datetime
    date_to: datetime
    offer_id: int
    assign_to: int

    class Config:
        from_attributes = True

# Схема для обновления задачи
class TaskUpdate(BaseModel):
    description: Optional[str] = Field(None, max_length=256)
    topic: Optional[str] = Field(None, max_length=128)
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    offer_id: Optional[int] = None
    assign_to: Optional[int] = None

    class Config:
        from_attributes = True

# Схема для ответа с информацией о задаче
class TaskResponse(BaseModel):
    id: int
    description: str
    topic: str
    date_creation: datetime
    date_from: datetime
    date_to: datetime
    offer_id: int
    assign_to: int

    class Config:
        from_attributes = True