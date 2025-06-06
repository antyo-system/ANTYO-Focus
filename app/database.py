from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1️⃣ Connection URL PostgreSQL
DATABASE_URL = "postgresql+psycopg2://postgres:LvUp_ANTYO%2156@localhost:5432/antyo_focus_db"




# 2️⃣ Setup Engine & Session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3️⃣ Base untuk ORM Models
Base = declarative_base()
