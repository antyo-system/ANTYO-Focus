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

async def register_and_login(client):
    await client.post("/auth/register", json={"email": "focus@example.com", "username": "focus", "password": "pass"})
    res = await client.post("/auth/login", data={"username": "focus@example.com", "password": "pass"})
    return res.json()["access_token"]

@pytest.mark.anyio
async def test_add_focus_session(client):
    token = await register_and_login(client)
    payload = {
        "user_id": 1,
        "start_time": "2021-01-01T00:00:00Z",
        "duration_minutes": 25
    }
    res = await client.post("/focus/sessions", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200

@pytest.mark.anyio
async def test_get_focus_sessions(client):
    token = await register_and_login(client)
    payload = {
        "user_id": 1,
        "start_time": "2021-01-01T00:00:00Z",
        "duration_minutes": 25
    }
    await client.post("/focus/sessions", json=payload, headers={"Authorization": f"Bearer {token}"})
    res = await client.get("/focus/sessions", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200

@pytest.mark.anyio
async def test_invalid_token(client):
    res = await client.get("/focus/sessions", headers={"Authorization": "Bearer invalid"})
    assert res.status_code == 401
