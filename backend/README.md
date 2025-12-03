# ANTYO Focus Backend

Backend Express server for ANTYO-Focus powered by [Prisma](https://www.prisma.io/) and SQLite for local development. The schema includes `User`, `Task`, and `FocusSession` models plus relationships to support task tracking and focus sessions.

## Environment variables
Copy `.env.example` to `.env` in the `backend` directory and adjust as needed:

```bash
cp .env.example .env
```

Key variables include the server port, database connection string, JWT configuration, and the log level for the request logger.

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

## Run locally
1. Copy the environment file, adjust secrets, and confirm the Prisma `DATABASE_URL` points to a writable path (SQLite by default).
   ```bash
   cp .env.example .env
   ```
2. Install dependencies and generate the Prisma client.
   ```bash
   npm install
   npm run prisma:migrate
   npm run prisma:seed # optional demo data (password: password123)
   ```
3. Start the API server on the configured port (defaults to `3001`).
   ```bash
   npm start
   ```
   For auto-reload during development use:
   ```bash
   npm run dev
   ```

Once running, the API is available at `http://localhost:3001/api`.

## Test the endpoints
- Import `backend/openapi.yaml` into Postman/Insomnia or use `curl`:
  ```bash
  # Register a user
  curl -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password123","name":"Demo"}'

  # Login and capture the JWT
  TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password123"}' | jq -r .token)

  # Fetch protected resources
  curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/tasks
  curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/sessions
  ```
- The login example uses `jq` to extract the token; copy the token manually if `jq` is unavailable.
- JWT-protected routes include `/api/tasks` and `/api/sessions`; unauthenticated requests return `401`.
- Auth routes (`/api/auth/register` and `/api/auth/login`) accept JSON payloads with `email` and `password`; `name` is optional during registration.

## Quality
- Lint the backend codebase:
  ```bash
  npm run lint
  ```
- Run Node's built-in test runner:
  ```bash
  npm test
  ```

## Deploy

### Build a production image
1. Ensure a `.env` file exists with production-ready values.
2. Build and run the Docker image from the `backend` folder:
   ```bash
   docker build -t antyo-focus-backend .
   docker run -p 3001:3001 --env-file .env antyo-focus-backend
   ```

The Dockerfile uses a multi-stage build to generate the Prisma client and prune development dependencies before shipping the runtime image.

### Render
1. Create a new **Web Service** from this repository and point it to the `backend` directory.
2. Set the environment variables from `.env.example` (for SQLite, keep `DATABASE_URL="file:./prisma/dev.db"`).
3. Use the following commands:
   - **Build command:** `npm install && npx prisma generate`
   - **Start command:** `node src/index.js`
4. Add a **Post-deploy command** to apply migrations: `npx prisma migrate deploy`.

### Railway
1. Create a new **Service** and deploy the `backend` folder.
2. Configure `DATABASE_URL`, `JWT_SECRET`, and other values from `.env.example` as Railway variables.
3. Set the **Start Command** to `node src/index.js` and add a **Deploy hook** command `npx prisma migrate deploy` to keep the schema up-to-date.

### Heroku
1. Create a Heroku app and add the repository as a deployment source.
2. Set config vars for all entries in `.env.example`; if using SQLite, set `DATABASE_URL` to a writable path such as `file:./prisma/dev.db`.
3. Define the **Buildpack** as `heroku/nodejs` (or use the default Node detection).
4. Add a **release phase** command to run migrations automatically:
   ```bash
   npx prisma migrate deploy
   ```
5. Set the **Procfile** (or Heroku "Command") to start the API:
   ```bash
   web: node src/index.js
   ```

## Healthcheck
A healthcheck route is available at `GET /api/health` and returns a simple status payload.

## Auth routes
New authentication endpoints are exposed at:
- `POST /api/auth/register` – register a user with hashed password storage.
- `POST /api/auth/login` – authenticate and receive a JWT for protected routes.

Task and focus session routes (`/api/tasks`, `/api/sessions`) are protected via JWT middleware.
