##создать виртуальное окружение и подтянуть зависимости
##включить .venv (.venv\Scripts\activate)
##создать файл .env в папке app
#
DB_HOST=хост(localhost)
DB_PORT=порт(5432 - стандартный)
DB_USER=имя_пользователя_бд
DB_PASS=пароль_от_бд
DB_NAME=имя_бд
#
создать директорию versions в app/alembic
##
переместиться в терминале в директорию app и создать миграцию(alembic revision --autogenerate) а после зафиксировать её(alembic upgrade head)
##
после всего в директории app (uvicorn main:app --reload) и перейти (http://127.0.0.1:8000/docs) можно через ctrl в терминале но тогда лучше добавить /docs чтобы заглянуть в свагер


#
DOCKER
#

#
Создать файл .env в корневой папке в него поместить следующее:
__________________________________________________________________________
DB_HOST=если докер(db), иначе (localhost)
DB_PORT=порт бд
DB_USER=пользователь бд
DB_PASS=пароль бд
DB_NAME=название бд
SALT=соль для хэша
SECRET_KEY=ключ для JWT
APP_HOST=http://localhost:3000
FORGET_PASSWORD_URL=/reset-password
MAIL_FROM=email с которого производится рассылка
MAIL_PASSWORD=пароль от email с которого производится рассылка
MAIL_PORT= 587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=имя от которого будут отправляться сообщения
MAIL_HOST_PASSWORD=ключ приложения
EMAIL_CONFIRMATION_URL = /confirm-email
VALID_DOMAIN=если нужна валидация email относительно домена то домен

__________________________________________________________________________

запустить команду docker-compose up --build в корневой папке.
#