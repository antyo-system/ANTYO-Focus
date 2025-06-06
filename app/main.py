from fastapi import FastAPI
from app.routes import focus_routes, focus_quest

app = FastAPI()
app.include_router(focus_routes.router)
app.include_router(focus_quest.router)
