from datetime import datetime
import enum
from sqlalchemy import String, UniqueConstraint, text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Annotated
from ..db.session import Base, str_128, str_256, str_64


intpk = Annotated[int, mapped_column(primary_key=True)]

class LinkStatus(str, enum.Enum):
    Connected = "Подключен",
    Disconnected = "Отключен",

class AbonStatus(str, enum.Enum):
    Connection = 'Подключение',
    Active = 'Активен',
    Blocking = 'Блокировка',
    Debtor = 'Должник',
    On_termination = 'На расторжение',
    Terminated = 'Расторгнут',

class Role(enum.Enum):
    admin = "admin"
    appruved_user = "appruved_user"
    unknown_user = "unknown_user"

class User(Base):
    __tablename__ = 'users'
    
    id:Mapped[intpk]
    name:Mapped[str_128] = mapped_column(nullable=False)
    login: Mapped[str_64] = mapped_column(nullable=False, unique=True)
    password: Mapped[str_256] = mapped_column(nullable=False)
    email: Mapped[str_128] = mapped_column(nullable=False, unique=True)
    role: Mapped[Role] = mapped_column(default=Role.appruved_user)
    
class Abonent(Base):
    __tablename__ = 'abonents'
    
    id:Mapped[intpk]
    abon_name:Mapped[str_128] = mapped_column(nullable=False)
    phone_number:Mapped[str] = mapped_column(String(10), nullable=False, unique=True)
    status:Mapped[AbonStatus] = mapped_column(default=AbonStatus.Connection)
    
class Port(Base):
    __tablename__ = 'ports'
    
    id:Mapped[intpk]
    number:Mapped[int] = mapped_column(nullable=False)
    name_port:Mapped[str_256] = mapped_column(nullable=False)
    status_link:Mapped[LinkStatus] = mapped_column(nullable=False, default=LinkStatus.Disconnected) #ADDD ENUMM
    switch_id:Mapped[int] = mapped_column(ForeignKey("switches.id", ondelete="CASCADE"), nullable=False)
    
    __table_args__ = (
        UniqueConstraint('number', 'switch_id', name='port_number_switch_id_key'),
    )
    
class Task(Base):
    __tablename__ = 'tasks'
    
    id:Mapped[intpk]
    description:Mapped[str]
    topic:Mapped[str_128] = mapped_column(nullable=False)
    date_creation:Mapped[datetime] = mapped_column(nullable=True, server_default=text("TIMEZONE('utc', now())"))
    date_from:Mapped[datetime] = mapped_column(nullable=True, server_default=text("TIMEZONE('utc', now())"))
    date_to:Mapped[datetime] = mapped_column(nullable=True, server_default=text("TIMEZONE('utc', now())"))
    offer_id:Mapped[int] = mapped_column(ForeignKey("offers.id", ondelete="CASCADE"), nullable=False)
    assign_to:Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
class Service(Base):
    __tablename__ = 'services'
    
    id:Mapped[intpk]
    name_service:Mapped[str_256] = mapped_column(nullable=False, unique=True)
    
class Switch(Base):
    __tablename__ = 'switches'
    
    id:Mapped[intpk]
    name_com:Mapped[str_256] = mapped_column(nullable=False)
    IP:Mapped[str_64] = mapped_column(nullable=False, unique=True)
    
class Address(Base):
    __tablename__ = 'addresses'
    
    id:Mapped[intpk]
    address:Mapped[str_256] = mapped_column(nullable=False)
    com_id:Mapped[int] = mapped_column(ForeignKey("switches.id", ondelete="CASCADE"), nullable=False)
    
    
class Offer(Base):
    __tablename__ = 'offers'
    
    id:Mapped[intpk]
    phone:Mapped[str] = mapped_column(String(10), nullable=False)
    osmp:Mapped[int] = mapped_column(nullable=False, unique=True)
    date_d:Mapped[datetime] = mapped_column(nullable=False, server_default=text("TIMEZONE('utc', now())"))
    address_id: Mapped[int] = mapped_column(ForeignKey("addresses.id", ondelete="CASCADE"), nullable=False)
    abon_id: Mapped[int] = mapped_column(ForeignKey("abonents.id", ondelete="CASCADE"), nullable=False)
    
class Offer_Service(Base):
    __tablename__ = 'offer_services'
    
    id:Mapped[intpk]
    offer_id:Mapped[int] = mapped_column(ForeignKey("offers.id", ondelete="CASCADE"), nullable=False)
    service_id:Mapped[int] = mapped_column(ForeignKey("services.id", ondelete="CASCADE"), nullable=False)