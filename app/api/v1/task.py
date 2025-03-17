from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from crud import task as TaskService
from db.session import get_session
from schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter()

@router.post("/tasks", response_model=TaskResponse, summary="Создание задачи", tags=["Задачи"])
async def create_task_handler(data: TaskCreate, db: AsyncSession = Depends(get_session)):
    return await TaskService.create_task(data, db)

@router.get("/tasks", response_model=List[TaskResponse], summary="Получение всех задач", tags=["Задачи"])
async def get_all_tasks_handler(db: AsyncSession = Depends(get_session)):
    return await TaskService.get_all_tasks(db)

@router.get("/tasks/{task_id}", response_model=TaskResponse, summary="Получение задачи по ID", tags=["Задачи"])
async def get_task_by_id_handler(task_id: int, db: AsyncSession = Depends(get_session)):
    return await TaskService.get_task_by_id(task_id, db)

@router.put("/tasks/{task_id}", response_model=TaskResponse, summary="Обновление задачи", tags=["Задачи"])
async def update_task_handler(task_id: int, data: TaskUpdate, db: AsyncSession = Depends(get_session)):
    return await TaskService.update_task(task_id, data, db)

@router.delete("/tasks/{task_id}", summary="Удаление задачи", tags=["Задачи"])
async def delete_task_handler(task_id: int, db: AsyncSession = Depends(get_session)):
    success = await TaskService.delete_task(task_id, db)
    if success:
        return {"msg": "Задача удалена"}
    raise HTTPException(status_code=404, detail="Задача не найдена")