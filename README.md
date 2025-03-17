создать виртуальное окружение и подтянуть зависимости
включить .venv (.venv\Scripts\activate)
создать файл .env в папке app

DB_HOST=хост(localhost)
DB_PORT=порт(5432 - стандартный)
DB_USER=имя_пользователя_бд
DB_PASS=пароль_от_бд
DB_NAME=имя_бд

создать директорию versions в app/alembic

переместиться в терминале в директорию app и создать миграцию(alembic revision --autogenerate) а после зафиксировать её(alembic upgrade head)

после всего в директории app (uvicorn main:app --reload) и перейти (http://127.0.0.1:8000/docs) можно через ctrl в терминале но тогда лучше добавить /docs чтобы заглянуть в свагер