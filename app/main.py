from fastapi import FastAPI
from app.routes import focus_routes

app = FastAPI()
app.include_router(focus_routes.router)
