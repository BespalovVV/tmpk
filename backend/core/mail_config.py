from fastapi_mail import ConnectionConfig
from .config import settings
mail_conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_FROM,
    MAIL_PASSWORD=settings.MAIL_HOST_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    TEMPLATE_FOLDER='backend/core/templates'
)