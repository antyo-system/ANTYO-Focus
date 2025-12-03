### Tahap 3 — Desain

🧩 6. Wireframe (Core Layar Saja)

Tujuan wireframe: Menentukan struktur dasar UI ANTYO Focus MVP tanpa estetika—fokus pada tata letak & fungsi inti.  
Minimal 3 layar utama: Pre-Focus (Blur Mode), Focus Mode (Full Webcam), Dashboard (Simple Summary).

---

🟦 1. Pre-Focus Screen (Blur Mode)

Tujuan:
- Ritual start sebelum kamera hidup
- Mengurangi kaget saat webcam menyala
- Memfokuskan user pada task & mode sebelum sesi

Elemen UI:
- Webcam background blur (fullscreen)
- Input: Label Task
- Mode selector: Timer / Stopwatch
- Durasi (hanya muncul jika Timer)
- Tombol START (besar, centered)

Wireframe (text mockup):
 -------------------------------------------------------
|                                                       |
|     [ Blurred Webcam Background - Fullscreen ]        |
|                                                       |
|                   Task Label Input                    |
|               ┌────────────────────────┐              |
|               │     [ Coding Task ]    │              |
|               └────────────────────────┘              |
|                                                       |
|             (●) Timer        (○) Stopwatch            |
|             Duration: [ 25:00 ]                       |
|                                                       |
|               ┌────────────────────────┐              |
|               │          START          │             |
|               └────────────────────────┘              |
|                                                       |
 -------------------------------------------------------

---

🟩 2. Focus Screen (Full Webcam Mode)

Tujuan:
- Experience fokus imersif
- Menampilkan real-time face detection
- Menunjukkan status Focus vs Distracted secara jelas
- Minimalkan distraksi visual

Elemen UI:
- Full webcam view
- Bounding box wajah (deteksi)
- Status fokus: FOCUS [ON] / DISTRACTED
- Focus Timer (durasi fokus)
- Distracted Timer (opsional)
- Tombol STOP (floating bottom center)
- (Opsional MVP) XP / Level small badge

Wireframe (text mockup):
 -------------------------------------------------------
|            [ FULLSCREEN WEBCAM VIEW ]                |
|                                                       |
|   FOCUS [ON]                           LEVEL: 3       |
|   Focus Time: 27 sec                  XP: 56/132      |
|                                                       |
|       [ Green Bounding Box - Face Detection ]         |
|                                                       |
|                       STOP (button)                  |
 -------------------------------------------------------

---

🟧 3. Dashboard (Simple Summary Mode)

Tujuan:
- Menampilkan hasil fokus user secara ringkas
- Memberi sense of progress dan entry ke sesi baru
- Menyimpan & menampilkan log sesi

Elemen UI:
- Total Focus Time (hari ini)
- Total Distracted Time (hari ini)
- History List / Mini Chart
- 3 Task paling sering digunakan
- Tombol “Start Another Focus”

Wireframe (text mockup):
 -------------------------------------------------------
|                Focus Summary Today                    |
|                                                       |
|   Focus Time: 42 min          Distracted: 18 min      |
|   Total Sessions: 3                                   |
|                                                       |
|   Recent Sessions:                                    |
|   - Coding (25m / 10m)                                |
|   - Belajar (15m / 3m)                                |
|   - Editing (2m / 5m)                                 |
|                                                       |
|                 [ Start New Session ]                 |
 -------------------------------------------------------

---

📌 Catatan Desain
- Wireframe fokus pada struktur & fungsi, bukan warna atau visual style.
- Semua elemen bisa dipindah/iterasi sesuai kebutuhan UX saat pengembangan.
- Estetika final, color system, dan typography didefinisikan pada fase UI Design.