from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: str
    DB_NAME: str
    SALT: str
    SECRET_KEY: str
    APP_HOST: str
    FORGET_PASSWORD_URL: str
    EMAIL_CONFIRMATION_URL: str
    MAIL_FROM: EmailStr
    MAIL_FROM_NAME: str
    MAIL_PASSWORD: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_TLS: bool = True
    MAIL_SSL: bool = False
    MAIL_HOST_PASSWORD: str
    VALID_DOMAIN: str
    @property
    def DATABASE_URL_asyncpg(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def DATABASE_URL_psycopg(self):
        return f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def SALT(self):
        return f"{self.SALT}"
    
    @property
    def SECRET_KEY(self):
        return f"{self.SECRET_KEY}"
    
    model_config = SettingsConfigDict(env_file=".env")
    
settings = Settings()