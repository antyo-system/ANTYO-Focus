# ANTYO Focus

Aplikasi manajemen fokus dengan sistem XP, leveling, dan pelacakan habit berbasis Pomodoro. Dibuat menggunakan **FastAPI** dan **PostgreSQL**.

## Cara Menjalankan di Lokal

1. **Clone repo**
   ```bash
   git clone <repo-url>
   cd ANTYO-Focus
   ```
2. **Setup virtualenv** (opsional namun disarankan)
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Siapkan `.env`**
   Salin file `.env.example` kemudian ubah nilainya sesuai konfigurasi lokal.
   ```bash
   cp .env.example .env
   ```
5. **Jalankan migrasi database**
   ```bash
   alembic upgrade head
   ```
6. **Jalankan server**
   ```bash
   uvicorn app.main:app --reload
   ```
7. **Testing** (jika tersedia)
   ```bash
   python -m py_compile app/main.py
   ```

## Fitur Utama

- **Autentikasi JWT** – endpoint register dan login.
- **Focus Quest** – timer Pomodoro dan laporan sesi.
- **User Progress** – XP dan sistem leveling.
- **Habit Tracker** – pencatatan durasi fokus harian/mingguan.
- **Dokumentasi API otomatis** tersedia di `/docs`.

## Struktur Folder

```
app/
├── core/            # konfigurasi & utilitas (settings, auth)
├── models/          # model SQLAlchemy
├── routes/          # endpoint FastAPI
├── schemas/         # skema Pydantic
├── services/        # logika bisnis
└── database.py      # koneksi database
alembic/            # berkas migrasi database
.env.example         # contoh konfigurasi lingkungan
README.md            # dokumentasi proyek
```

## Catatan Tambahan

- Menggunakan PostgreSQL, pastikan service database sudah berjalan di lokal.
- Library `python-dotenv` dipakai untuk memuat variabel lingkungan.
- Saat ini merupakan versi MVP dan masih dalam tahap pengembangan aktif.
