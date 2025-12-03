### Tahap 2 — Requirements

#### 4. Tentukan Fitur (Rinci tapi sedikit dulu)

Prinsip:
- MVP = 1 masalah + 1 fitur utama → lalu 1 fitur pendukung.
- Jangan loncat ke 10 fitur dulu.

Masalah utama:
- Sulit fokus dan tidak sadar ke mana waktu pergi.

Maka MVP harus menyelesaikan satu hal:
- Tracking waktu fokus secara jujur & otomatis.

---

🚀 **MVP Fitur (Versi Minimal yang Sudah Berguna)**

🟩 **1. Fokus Timer / Stopwatch (core)**
- User bisa:
  - Pilih Timer atau Stopwatch
  - Tambah label task (contoh: “Coding”, “Belajar”, “Edit Video”)
  - Start & stop sesi fokus
- Ini fitur inti yang harus ada dulu.

🟩 **2. Kamera Deteksi Fokus / Distraksi (unique differentiation)**
- Fitur pembeda ANTYO Focus:
  - Kamera on saat sesi fokus
  - Mediapipe / Face detection mendeteksi:
    - posisi wajah
    - arah pandang
    - apakah user cabut dari layar
- Waktu dipisah menjadi:
  - Focus Time
  - Distracted Time
- Output objektif: “Hari ini kamu fokus 47 menit, terdistraksi 18 menit.”

🟩 **3. Activity Log (basic version)**
- Setiap sesi masuk ke log:
  - tanggal
  - jam mulai & jam selesai
  - label task
  - durasi fokus
  - durasi distraksi
- Fondasi untuk calendar, heatmap, dan streak.

🟩 **4. Dashboard Simple (MVP)**
- Menampilkan:
  - total fokus hari ini
  - total fokus minggu ini
  - grafik ringkas (bar mini / summary)
  - 3–5 task yang paling sering dilakukan
- Tujuan: kasih user sense of progress — bukan aesthetic dulu.

---

🔒 **Fitur Pendukung (Masuk Setelah MVP Selesai)**

🟨 **5. Basic Utility (Clock Tools)**
- Jam digital
- Alarm
- Stopwatch (standalone, non-tracking)
- Timer (standalone)

🟨 **6. To-Do List**
- Tugas hari ini
- Checklist simple
- LocalStorage cukup di awal (tidak perlu DB)

🟨 **7. Calendar (basic)**
- Calendar view
- Menampilkan activity log (bukan hanya plan)
- Integrasi dengan sesi fokus

🟨 **8. Timeblocking**
- Drag & drop
- Setiap block bisa dikaitkan dengan focus session
- Warna task

🟨 **9. Time Countdown (umur → sisa waktu hidup)**
- User input: tanggal lahir
- Sistem hitung: waktu tersisa = 50 tahun − umur sekarang
- Ditampilkan sebagai:
  - jam
  - bar progress hidup
  - countdown besar di profil
- Fungsi: awareness & menimbulkan rasa scarcity

---

🧠 **Summary MVP (Ini yang dibangun dulu 100%)**
- Fokus Timer / Stopwatch sesi fokus  
- Label task  
- Deteksi fokus vs distraksi via kamera  
- Activity log  
- Dashboard simple

Dengan 5 fitur ini saja sudah bisa onboarding user, unik, dan menyelesaikan masalah utama.