from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from ..models.user import Task
from ..schemas.task import TaskCreate, TaskUpdate

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
        async with db.begin():
            db.add(task)
            await db.flush()
            await db.refresh(task)
        return task
        
    except IntegrityError as e:
        if "tasks_offer_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный договор не существует"
            )
        elif "tasks_assign_to_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный исполнитель не существует"
            )
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка целостности данных при создании задачи {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при создании задачи: {str(e)}"
        )

async def get_all_tasks(db: AsyncSession) -> list[Task]:
    try:
        async with db.begin():
            result = await db.execute(select(Task))
            return result.scalars().all()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении списка задач: {str(e)}"
        )

async def get_task_by_id(task_id: int, db: AsyncSession) -> Task:
    try:
        async with db.begin():
            task = (await db.execute(
                select(Task).where(Task.id == task_id)
            )).scalar_one_or_none()
            
            if task is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Задача с ID {task_id} не найдена"
                )
            return task
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении задачи: {str(e)}"
        )

async def update_task(task_id: int, data: TaskUpdate, db: AsyncSession) -> Task:
    try:
        async with db.begin():
            task = (await db.execute(
                select(Task).where(Task.id == task_id)
            )).scalar_one_or_none()
            
            if task is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Задача с ID {task_id} не найдена"
                )

            if data.description is not None:
                task.description = data.description
            if data.topic is not None:
                task.topic = data.topic
            if data.date_from is not None:
                task.date_from = data.date_from
            if data.date_to is not None:
                task.date_to = data.date_to
            if data.offer_id is not None:
                task.offer_id = data.offer_id
            if data.assign_to is not None:
                task.assign_to = data.assign_to

            await db.flush()
            await db.refresh(task)
            return task
            
    except IntegrityError as e:
        if "tasks_offer_id_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный договор не существует"
            )
        elif "tasks_assign_to_fkey" in str(e.orig):
            raise HTTPException(
                status_code=400,
                detail="Указанный исполнитель не существует"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при обновлении задачи"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при обновлении задачи: {str(e)}"
        )

async def delete_task(task_id: int, db: AsyncSession) -> bool:
    try:
        async with db.begin():
            task = (await db.execute(
                select(Task).where(Task.id == task_id)
            )).scalar_one_or_none()
            
            if task is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Задача с ID {task_id} не найдена"
                )
                
            await db.delete(task)
            return True
            
    except IntegrityError as e:
        if "foreign key constraint" in str(e.orig).lower():
            raise HTTPException(
                status_code=400,
                detail="Невозможно удалить задачу, так как она связана с другими данными"
            )
        raise HTTPException(
            status_code=400,
            detail="Ошибка целостности данных при удалении задачи"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Неизвестная ошибка при удалении задачи: {str(e)}"
        )