from fastapi import FastAPI
from app.routes import focus_routes, focus_quest, focus_tracker

app = FastAPI()
app.include_router(focus_routes.router)
app.include_router(focus_quest.router)
app.include_router(focus_tracker.router)
