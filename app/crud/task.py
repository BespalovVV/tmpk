from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from models.user import Task
from schemas.task import TaskCreate, TaskUpdate

async def create_task(data: TaskCreate, db: AsyncSession) -> Task:
    task = Task(
        description=data.description,
        topic=data.topic,
        date_from=data.date_from,
        date_to=data.date_to,
        offer_id=data.offer_id,
        assign_to=data.assign_to
    )
    try:
        db.add(task)
        await db.commit()
        await db.refresh(task)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Ошибка при добавлении задачи: {str(e)}")
    return task

async def get_all_tasks(db: AsyncSession) -> list[Task]:
    try:
        result = await db.execute(select(Task))
        tasks = result.scalars().all()
        return tasks
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении задач: {str(e)}")

async def get_task_by_id(task_id: int, db: AsyncSession) -> Task:
    try:
        result = await db.execute(select(Task).filter(Task.id == task_id))
        task = result.scalar_one_or_none()
        if not task:
            raise Exception("Задача не найдена")
        return task
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при получении задачи: {str(e)}")

async def update_task(task_id: int, data: TaskUpdate, db: AsyncSession) -> Task:
    try:
        async with db.begin():
            result = await db.execute(select(Task).filter(Task.id == task_id))
            task = result.scalar_one_or_none()
            if not task:
                raise Exception("Задача не найдена")
            if data.description:
                task.description = data.description
            if data.topic:
                task.topic = data.topic
            if data.date_from:
                task.date_from = data.date_from
            if data.date_to:
                task.date_to = data.date_to
            if data.offer_id:
                task.offer_id = data.offer_id
            if data.assign_to:
                task.assign_to = data.assign_to
            return task
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при обновлении задачи: {str(e)}")

async def delete_task(task_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            result = await db.execute(select(Task).filter(Task.id == task_id))
            task = result.scalar_one_or_none()
            if not task:
                raise Exception("Задача не найдена")
            await db.delete(task)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка при удалении задачи: {str(e)}")