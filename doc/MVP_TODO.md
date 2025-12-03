# MVP Backend & Deployment To-Do List

## Goal
Membuat backend siap pakai untuk MVP sehingga pengguna dapat mendaftar/login, mengelola tugas & sesi fokus, melihat dashboard, serta dapat dideploy dengan database yang siap produksi.

## Prioritas 1 — Fungsionalitas Inti
- [ ] Lengkapi CRUD Task dengan validasi (title, status, due date) dan error handling konsisten.
- [ ] Pastikan alur FocusSession: start, stop, fetch history; sinkronkan progres Task saat sesi selesai.
- [ ] Tambahkan dashboard data endpoint (ringkasan total task, progress per status, total durasi fokus per hari/minggu).
- [ ] Proteksi semua endpoint sensitif dengan JWT + middleware authorization per user.

## Prioritas 2 — Data & Migrasi
- [ ] Finalisasi skema database (User, Task, FocusSession) dan tambah field statistik yang diperlukan dashboard.
- [ ] Buat migrasi Prisma untuk skema final; sertakan seed minimal untuk data contoh dashboard.
- [ ] Tambahkan `.env.example` dengan variabel DB (mis. DATABASE_URL), JWT_SECRET, PORT.
- [ ] Siapkan skrip package.json: `npm run prisma:migrate` dan `npm run prisma:seed`.

## Prioritas 3 — Observabilitas & Kualitas
- [ ] Middleware logging request/response (pino/winston) dengan filter sensitive fields.
- [ ] Global error handler yang mengembalikan JSON terstruktur (code, message, details).
- [ ] Tambah tes dasar: service/controller untuk tasks & sessions; gunakan sqlite in-memory untuk CI.
- [ ] Lint/format check di CI (npm run lint/test) untuk mencegah regresi.

## Prioritas 4 — Deployment Friendly
- [ ] Buat Dockerfile (node:18-alpine) + `.dockerignore`; entrypoint `npm run start`.
- [ ] Tambah workflow sederhana untuk build/test (GitHub Actions) yang menjalankan lint, test, migrate.
- [ ] Dokumentasi deploy ke Render/Railway/Heroku: langkah build, set env, jalankan migrate, start server.
- [ ] Sediakan healthcheck endpoint (`/health`) dan readiness probe untuk platform deploy.

## Prioritas 5 — Dashboard & UX Siap Demo
- [ ] Endpoint dashboard yang mengembalikan agregasi: total task per status, total durasi fokus per hari, streak harian.
- [ ] Pastikan CORS diaktifkan sesuai domain frontend dan header auth.
- [ ] Tambah pagination/filter pada daftar task dan sesi untuk performa.
- [ ] Tambah contoh Postman/OpenAPI spec untuk endpoint utama dan dashboard.

## Checklist Pra-Launch
- [ ] `.env` terisi dan tidak dikomit.
- [ ] Database produksi terhubung dan migrasi sukses.
- [ ] Akun demo dibuat (via seed atau manual) untuk akses dashboard.
- [ ] Build frontend terhubung dengan base URL backend & healthcheck ok.
