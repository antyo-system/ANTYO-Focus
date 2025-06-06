import os
import pytest
from httpx import AsyncClient

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("SECRET_KEY", "test_secret")
os.environ.setdefault("JWT_ALGORITHM", "HS256")

from app.database import Base, engine
from app.main import app

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
def event_loop(anyio_backend):
    import asyncio
    loop = asyncio.get_event_loop()
    yield loop

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

def create_user_data():
    return {"email": "user@example.com", "username": "user", "password": "pass"}

@pytest.fixture
async def auth_token(client):
    await client.post("/auth/register", json=create_user_data())
    res = await client.post("/auth/login", data={"username": "user@example.com", "password": "pass"})
    return res.json()["access_token"]

@pytest.mark.anyio
async def test_login_success(client):
    await client.post("/auth/register", json=create_user_data())
    res = await client.post("/auth/login", data={"username": "user@example.com", "password": "pass"})
    assert res.status_code == 200
    assert "access_token" in res.json()

@pytest.mark.anyio
async def test_login_failure(client):
    await client.post("/auth/register", json=create_user_data())
    res = await client.post("/auth/login", data={"username": "user@example.com", "password": "wrong"})
    assert res.status_code == 400

@pytest.mark.anyio
async def test_protected_endpoint(client, auth_token):
    res = await client.get("/users/user_id", headers={"Authorization": f"Bearer {auth_token}"})
    assert res.status_code in (200, 404)
