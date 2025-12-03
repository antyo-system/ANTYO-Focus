# ANTYO Focus Backend

Backend Express server for ANTYO-Focus powered by [Prisma](https://www.prisma.io/) and SQLite for local development. The schema includes `User`, `Task`, and `FocusSession` models plus relationships to support task tracking and focus sessions.

## Environment variables
Create a `.env` file in the `backend` directory with the database connection string and JWT settings:

```bash
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="replace-with-strong-secret"
JWT_EXPIRES_IN="1d"
PORT=3001
```

## Setup
1. Install dependencies:
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
4. Seed the database with demo data (uses the password `password123` for the demo user):
   ```bash
   npm run prisma:seed
   ```
5. Start the server:
   ```bash
   npm start
   ```

For development with automatic reloads (requires `nodemon` from devDependencies):
```bash
npm run dev
```

## Healthcheck
A healthcheck route is available at `GET /api/health` and returns a simple status payload.

## Auth routes
New authentication endpoints are exposed at:
- `POST /api/auth/register` – register a user with hashed password storage.
- `POST /api/auth/login` – authenticate and receive a JWT for protected routes.

Task and focus session routes (`/api/tasks`, `/api/sessions`) are protected via JWT middleware.
