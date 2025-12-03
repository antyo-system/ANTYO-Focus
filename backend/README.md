# ANTYO Focus Backend

Backend data layer powered by [Prisma](https://www.prisma.io/) with a SQLite database for local development. The schema includes `User`, `Task`, and `FocusSession` models plus relationships to support task tracking and focus sessions.

## Environment variables
Create a `.env` file in the `backend` directory with the database connection string:

```bash
DATABASE_URL="file:./prisma/dev.db"
```

## Database setup
1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Generate the Prisma Client and apply migrations:
   ```bash
   npm run prisma:migrate
   ```
3. (Optional) Regenerate the client without running migrations:
   ```bash
   npm run prisma:generate
   ```
4. Seed the database with demo data:
   ```bash
   npm run prisma:seed
   ```

## Schema overview
- **User**: base account entity that owns tasks.
- **Task**: contains title, description, status, due date, and belongs to a user.
- **FocusSession**: captures start/end times, duration, and status for a task session.

Migrations and seed scripts live in `prisma/` and the Prisma client is configured in `src/config/db.js`.
