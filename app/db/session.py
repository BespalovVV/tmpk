from typing import Annotated
from sqlalchemy import String
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from core.config import settings
from sqlalchemy.orm import DeclarativeBase


str_256 = Annotated[str, 256]
str_128 = Annotated[str, 128]
str_64 = Annotated[str, 64]

class Base(DeclarativeBase):
    type_annotation_map = {
        str_256: String(256),
        str_128: String(128),
        str_64: String(64),
    }

async_engine = create_async_engine(
    url=settings.DATABASE_URL_asyncpg,
    echo=True,
)

async_session = async_sessionmaker(async_engine, expire_on_commit=False)

async def get_session():
    async with async_session() as session:
        yield session