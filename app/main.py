from app.models import FocusSession
from app.database import Base, engine, SessionLocal
import datetime

# 1. Create tables (kalau belum ada)
Base.metadata.create_all(bind=engine)

# 2. Setup session
db = SessionLocal()

# 3. Coba insert data FocusSession (dummy data)
new_session = FocusSession(
    user_id=1,
    start_time=datetime.datetime(2025, 3, 21, 10, 0, 0),
    end_time=datetime.datetime(2025, 3, 21, 11, 0, 0),
    duration_minutes=60.0,
    description="Testing Session"
)
db.add(new_session)
db.commit()

print("Database & Model setup berhasil!")

# 4. Optional: Query & print data
sessions = db.query(FocusSession).all()
for session in sessions:
    print(session)
