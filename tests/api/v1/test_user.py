import pytest
from fastapi import status
from httpx import AsyncClient
from sqlalchemy import select
from backend.main import app
from backend.models.user import User
from backend.schemas.user import UserCreate, UserResponse, UserLogin
from backend.core.security import get_hashed_password
from backend.db import session

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient, db_session):
    user_data = {
        "name": "TestUser",        
        "login": "testuser123",     
        "password": "password123",  
        "email": "test123@example.com" 
    }
    
    response = await client.post("/api/v1/users", json=user_data)
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["name"] == user_data["name"]
    assert "id" in data

@pytest.mark.asyncio
async def test_create_duplicate_user(client: AsyncClient, db_session):
    user_data = {
        "name": "DuplicateUser",
        "login": "duplicateuser123",
        "password": "password123",
        "email": "duplicate@example.com"
    }
    
    response1 = await client.post("/api/v1/users", json=user_data)
    assert response1.status_code == status.HTTP_200_OK
    
    response2 = await client.post("/api/v1/users", json=user_data)
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
    assert "Ошибка при добавлении пользователя" in response2.json()["detail"]

@pytest.mark.asyncio
async def test_create_user_invalid_data(client: AsyncClient):
    invalid_data = {
        "name": "A",               
        "login": "sh",            
        "password": "short",       
        "email": "invalid-email"  
    }
    
    response = await client.post("/api/v1/users", json=invalid_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    errors = response.json()["detail"]
    assert any("email" in error["loc"] for error in errors)
    assert any("password" in error["loc"] for error in errors)


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, db_session):
    user_data = {
        "name": "TestUser",
        "login": "testuser1234",
        "password": "password1234",
        "email": "test1234@example.com"
    }
    create_response = await client.post("/api/v1/users", json=user_data)
    print("CREATE USER RESPONSE:", create_response.json())
    assert create_response.status_code == 200
    
    login_data = {"login_or_email": "testuser1234", "password": "password1234"}
    login_response = await client.post("/api/v1/auth", json=login_data)
    print("LOGIN RESPONSE:", login_response.status_code, login_response.json())
    
    if login_response.status_code == 400:

        
        result = await db_session.execute(select(User).where(User.login == "testuser1234"))
        db_user = result.scalar_one_or_none()
        print("USER FROM DB:", db_user)
        
        if db_user:
            print("USER PASSWORD IN DB:", db_user.password)
            from backend.core.security import verify_password
            print("PASSWORD MATCH:", verify_password("password1234", db_user.password))
    
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

@pytest.mark.asyncio
async def test_login_fail(client: AsyncClient):
    login_data = {
        "login_or_email": "wronguser",
        "password": "wrongpassword"
    }

    response = await client.post("/api/v1/auth", json=login_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "detail" in response.json()