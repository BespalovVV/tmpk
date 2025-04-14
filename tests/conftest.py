import pytest
import sys
import pytest_asyncio
import psycopg2
from sqlalchemy.exc import ProgrammingError
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.append(str(project_root / "app"))

from dotenv import load_dotenv
import os

load_dotenv("app/.env")

from app.main import app
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.session import Base
from app.db.session import async_session as async_session_maker, get_session
from app.core.config import settings
from app.models.user import User
from app.core.security import get_hashed_password
from sqlalchemy.ext.declarative import declarative_base
from app.db.session import async_engine
from sqlalchemy import MetaData

@pytest.fixture(scope="function", autouse=True)
def reset_table_metadata():
    """Сбрасывает метаданные таблицы перед каждым тестом."""
    # Переопределяем метаданные с extend_existing=True
    Base.metadata = MetaData()
    
    # Перезагружаем метаданные таблицы
    if hasattr(User, '__table__'):
        User.__table__.metadata = Base.metadata
        User.__table__.extend_existing = True

    yield  # Все тесты выполняются после этого шага

    # В конце можно вернуть метаданные в исходное состояние
    Base.metadata = MetaData()



# Тестовая БД (используем ту же учётку, но другую базу)
TEST_DB_URL = "postgresql+asyncpg://postgres:root@localhost:5432/test_db"

@pytest.fixture(scope="session", autouse=True)
def prepare_database():
    """Создаёт и удаляет тестовую БД при запуске тестов"""

    db_name = "test_db"
    admin_conn = None
    try:
        # Подключаемся к postgres, чтобы создать тестовую базу
        admin_conn = psycopg2.connect(
            dbname="postgres", user="postgres", password="root", host="localhost", port=5432
        )
        admin_conn.autocommit = True
        cur = admin_conn.cursor()
        try:
            cur.execute(f"CREATE DATABASE {db_name}")
            print(f"База данных {db_name} успешно создана")
        except ProgrammingError as e:
            print(f"Ошибка при создании базы данных: {e}")
        except psycopg2.errors.DuplicateDatabase:
            print("Тестовая БД уже существует")
        cur.close()
    finally:
        if admin_conn:
            admin_conn.close()

    # Создаём таблицы в асинхронной test_db
    async def init_async_tables():
        engine = create_async_engine(TEST_DB_URL)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        await engine.dispose()

    import asyncio
    asyncio.run(init_async_tables())

    yield  # Здесь выполняются все тесты

    # Удаляем тестовую БД (опционально)
    # async with admin_engine.connect() as conn:
    #     await conn.execute("COMMIT")
    #     await conn.execute("DROP DATABASE test_db")
    #     await conn.close()


@pytest.fixture
async def engine():
    engine = create_async_engine(TEST_DB_URL)
    yield engine
    await engine.dispose()

@pytest.fixture
async def db_session(engine):
    # Убираем manual begin() для транзакции
    async with engine.begin() as conn:  # Создаем контекст для транзакции
        session_maker = sessionmaker(
            conn, expire_on_commit=False, class_=AsyncSession
        )
        session = session_maker()

        yield session  # Возвращаем сессию

        await session.close()  # Закрываем сессию после использования


@pytest_asyncio.fixture
async def client(db_session):
    # Мокаем зависимость get_session
    app.dependency_overrides[get_session] = lambda: db_session

    # Инициализация клиента без аргумента 'app'
    async with AsyncClient(base_url="http://127.0.0.1:8000") as client:
        client.app = app  # Присваиваем FastAPI app вручную, если нужно
        yield client  # Возвращаем клиент для использования в тестах



@pytest.fixture
async def test_user(db_session):
    """Фикстура с тестовым пользователем"""
    user = User(
        email="test@example.com",
        hashed_password=get_hashed_password("testpass"),
        full_name="Test User"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user