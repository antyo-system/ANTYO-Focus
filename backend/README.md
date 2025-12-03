# Backend Server

Backend Express server for ANTYO-Focus.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` if you want to override defaults (e.g., `PORT`).
3. Start the server:
   ```bash
   npm start
   ```

## Development

Run with automatic reloads (requires `nodemon` from devDependencies):

```bash
npm run dev
```

## Healthcheck

A healthcheck route is available at `GET /api/health` and returns a simple status payload.
