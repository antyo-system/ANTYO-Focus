### 5. User Flow (User Journey) — ANTYO Focus MVP

User flow ini menggambarkan alur paling sederhana dari buka aplikasi sampai melihat hasil fokus.  
Karena MVP belum pakai XP, fokus utamanya:
- mulai sesi fokus
- deteksi fokus/distraksi
- menyimpan log
- menampilkan progress

---

🟦 1. Open App
- User membuka web app (contoh: antyo-focus.app)
- Landing page simple muncul
- Tombol: Start Focus / Go to App
- Tidak perlu login dulu (frictionless)

🟩 2. Pilih Mode
- Pilih mode:
  - Timer Mode
  - Stopwatch Mode
- Isi Label Task (contoh: “Coding”, “Belajar”, “Editing”)
- Klik Start Session

🟧 3. Mulai Sesi Fokus
- Setelah Start:
  - Kamera menyala (permission prompt)
  - Sistem mulai:
    - hitung waktu
    - deteksi fokus/distraksi otomatis
- UI menampilkan:
  - waktu berjalan
  - indikator fokus/ke-distraksi (green / red dot)

🔴 4. Sesi Berjalan (Tracking Real-Time)
- Sistem memisahkan durasi menjadi:
  - Focus Time — kondisi: wajah terlihat, pandangan ke layar, user duduk di depan laptop
  - Distracted Time — kondisi: wajah tidak terdeteksi, user menunduk ke HP, pergi dari layar, melihat ke samping
- Semua terjadi otomatis, tanpa interaksi tambahan dari user

🛑 5. End Session
- User klik Stop atau timer habis
- Muncul pop-up summary:
  - Task: Coding
  - Focus: 42 menit
  - Distracted: 13 menit
  - Total: 55 menit
- Prompt: Simpan sesi? (Yes / No)
  - Jika Yes → data masuk ke database / local storage sesuai implementasi MVP

📚 6. Activity Log
- Sesi yang disimpan tampil di:
  - Log List
  - Dashboard
  - (Nantinya) Calendar
- Data yang disimpan:
  - Tanggal
  - Jam mulai & jam selesai
  - Label Task
  - Focus Time
  - Distracted Time
  - Total Duration

📊 7. Dashboard
- Menampilkan ringkasan hari ini:
  - Total Focus Time (today)
  - Total Distracted Time (today)
  - Task paling sering dilakukan
  - Ringkasan seminggu terakhir
  - Mini chart (bar / donut)
- Dashboard MVP simple — fokus ke insight, bukan estetika

🔄 8. Repeat / Start Another Session
- User kembali ke halaman utama dan bisa mulai sesi baru kapan saja

---

🔥 User Flow Summary (Diagram Style)

Open App  
↓  
Choose Timer / Stopwatch  
↓  
Input Task Label  
↓  
Start Session (Camera ON)  
↓  
Real-time detection (Focus / Distracted)  
↓  
End Session  
↓  
Save Log  
↓  
Dashboard Summary  
↓  
(Optional) Start Again

✔️ User Flow MVP Final  
“Masuk → Pilih Mode → Isi Task → Fokus → Log Tersimpan → Lihat Progress.”