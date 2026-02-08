---
title: 'Tangkapin (Sistem Deteksi Senjata & Laporan CCTV)'
type: 'hackathon'
date: '2024-11-01'
excerpt: 'Sistem yang mendeteksi senjata dari CCTV, membuat laporan otomatis, dan mengingatkan pemilik serta polisi dengan tracking petugas ke lokasi.'
tags: ['Flutter', 'Next.js', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Python', 'PyTorch', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/tangkapin-server'
shortExplanation: 'Sistem deteksi senjata (pisau, senjata api) dari stream CCTV dengan ML (PyTorch): deteksi otomatis → laporan + evidence → notifikasi realtime ke pemilik CCTV dan polisi; verifikasi, penugasan petugas, dan tracking GPS sampai ke lokasi. Web (Officer/Police) + app Flutter (Owner).'
projectGoals:
  - 'Mendeteksi objek berbahaya dari CCTV secara otomatis dan membuat laporan dengan bukti (evidence).'
  - 'Notifikasi realtime ke Owner dan kantor polisi; verifikasi laporan, assign petugas, dan tracking GPS.'
  - 'Memberi Owner (mobile) dan Officer/Police (web) alur yang jelas: deteksi → laporan → verifikasi → penugasan → tracking.'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Deteksi senjata dari CCTV (ML)

Layanan ML (Python/Flask, PyTorch) menerima frame/stream; deteksi pisau/senjata api → buat laporan dan simpan evidence. API Express menerima hasil deteksi; owner bisa juga buat laporan manual tanpa CCTV.

### Laporan & notifikasi realtime (Pusher)

Model: CCTV, Report, Evidence, Assignment, Tracking, Notification. Status laporan: new → assigned → in_progress → verified → completed/rejected. Notifikasi realtime ke Owner, Officer, dan Police sesuai role.

### Verifikasi & penugasan petugas (Officer/Police)

Officer (admin polisi) verifikasi laporan dan assign petugas (Police) ke lokasi. Police mengirim update tracking: latitude, longitude, status (on_the_way, arrived, completed). Owner dan polisi bisa pantau pergerakan bantuan.

### Dua frontend: web (Next.js) & mobile (Flutter)

Web untuk Officer/Police: dashboard, peta (Leaflet), daftar laporan, assign, tracking. Flutter untuk Owner: daftar CCTV, stream (MJPEG/video), daftar laporan, notifikasi. Docker: API + ML berjalan bersama (docker-compose).

---

## Konteks (Kenapa proyek ini ada)

**Proyek hackathon.** Saya ingin membangun sistem yang memanfaatkan CCTV untuk mendeteksi senjata (pisau, senjata api) secara otomatis: saat model ML mendeteksi objek berbahaya dari stream CCTV, sistem membuat laporan, menyimpan bukti (evidence), dan mengirim notifikasi realtime ke pemilik CCTV (Owner) serta kantor polisi terdekat. Polisi (Officer) memverifikasi laporan, meng-assign petugas (Police) ke lokasi, dan petugas mengirim update tracking (GPS) sehingga owner bisa memantau pergerakan bantuan. Bukan sekadar dashboard CCTV—tapi alur lengkap: deteksi → laporan → notifikasi → verifikasi → penugasan → tracking.

**Lingkungan:** Proyek production; tiga repositori: **tangkapin-server** (API + layanan ML), **tangkapin-client** (web untuk Officer/Police), **tangkapin-mobile** (app Flutter untuk Owner). Database PostgreSQL; deploy dengan Docker (API + ML).

**Kenapa masalah ini muncul:** Perlu satu ekosistem yang menggabungkan computer vision (deteksi senjata), backend laporan & penugasan, notifikasi realtime, dan dua frontend (web untuk polisi, mobile untuk pemilik CCTV).

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** Integrasi feed CCTV → model ML (PyTorch) → deteksi senjata → buat laporan + evidence → POST ke API Express; API mengelola Owner, Officer, Police, CCTV, Report, Assignment, Tracking, Notification, AuditLog; notifikasi realtime ke role yang tepat (Pusher).
- **Masalah operasional:** Layanan ML (Python/Flask) dan API (Node.js) harus bisa jalan bersamaan (concurrently / docker-compose); owner bisa manual report (tanpa CCTV); polisi assign officer terdekat, officer update status & tracking GPS.
- **Masalah pembelajaran:** Arsitektur dua layanan (API + ML), kontrak API deteksi (cctv_id, report_image base64, incident_type), dan realtime multi-role (owner, officer, police).

---

## Batasan

- **Keterampilan / pengalaman:** Node.js, Express, Prisma, PostgreSQL; Python/Flask untuk ML; Next.js dan Flutter untuk frontend; satu tim/scope yang fokus pada alur deteksi–laporan–penugasan–tracking.
- **Infrastruktur:** PostgreSQL; Docker (Dockerfile.api, Dockerfile.ml, docker-compose); PM2 (ecosystem.config.js) untuk production.
- **Waktu:** Fitur inti: deteksi, laporan, notifikasi, verifikasi, assign, tracking; dashboard dan statistik (response time, resolution rate) menyusul.
- **Alat yang tersedia:** Prisma, JWT, bcrypt, Pusher (server + client), Multer; PyTorch di sisi ML; Leaflet (peta) di client web; video_player / webview / mjpeg_view di Flutter untuk stream CCTV.

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Tiga role: Owner, Officer, Police** | Owner = pemilik CCTV & penerima notifikasi; Officer = admin kantor polisi (verifikasi, assign); Police = petugas lapangan (tracking). Model terpisah di Prisma (Owner, Officer, Police). | Satu tabel User + role (kurang jelas pemisahan permission). |
| **ML service terpisah (Python/Flask)** | Model PyTorch jalan di proses sendiri; API Express memanggil endpoint deteksi (POST /api/deteksi atau internal). | ML di dalam proses Node (binding Python/child process lebih rumit). |
| **Prisma + PostgreSQL** | Relasi banyak: CCTV → Owner; Report → CCTV, Owner, Evidence, Assignment; Assignment → Officer, Police, Tracking; Notification per role. | MySQL (konsisten dengan proyek lain), MongoDB (relasi kaku kurang nyaman). |
| **Pusher untuk notifikasi realtime** | Owner, Officer, Police dapat notifikasi (report, cctv, assignment, tracking) tanpa polling. | Socket.io (self-hosted), polling. |
| **Report status (new → assigned → in_progress → verified → completed/rejected)** | Alur jelas untuk verifikasi dan penugasan; audit log untuk siapa melakukan apa. | Status sederhana (open/closed). |
| **Tracking dengan latitude, longitude, status (on_the_way, arrived, completed)** | Petugas kirim lokasi dan status; owner/polisi bisa lihat estimasi jarak dan waktu. | Hanya status teks tanpa koordinat. |
| **Dua frontend: Next.js (web) + Flutter (mobile)** | Web untuk dashboard Officer/Police (desktop); Flutter untuk Owner (mobile + akses stream CCTV, daftar laporan, notifikasi). | Satu SPA untuk semua (kurang optimal untuk mobile & stream). |
| **Flutter: video_player, webview, mjpeg_view** | Owner lihat stream CCTV (MJPEG atau URL); integrasi dengan API untuk daftar CCTV dan laporan. | Hanya daftar tanpa preview. |
| **Client web: Leaflet, Recharts** | Peta untuk lokasi/tracking; grafik untuk statistik. | Peta/grafik library lain. |
| **Docker: API + ML terpisah** | Satu compose menjalankan container API dan ML; komunikasi lewat HTTP. | Satu container (monolit) atau deploy terpisah manual. |

---

## Trade-off dan Dampaknya

- **Dua layanan (API + ML):** Operasional jadi dua proses/container; jika ML down, deteksi otomatis tidak jalan (manual report tetap bisa). Perlu health check dan restart policy.
- **Pusher (layanan berbayar):** Ketergantungan provider; untuk development bisa pakai plan gratis atau mock.
- **Feed CCTV → ML:** Format stream (MJPEG, RTSP, dll.) dan cara kirim frame ke ML harus disepakati; latency dan beban jaringan perlu diperhitungkan.
- **Token dan auth per role:** Satu endpoint login mengembalikan token + role; middleware harus konsisten memeriksa role untuk rute Officer vs Police vs Owner.
- **Tiga repo:** Koordinasi perubahan API (breaking change) harus sinkron dengan client dan mobile; dokumentasi API (apispek.md) membantu kontrak.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Alur deteksi → laporan → notifikasi → verifikasi → assign → tracking terimplementasi; Owner, Officer, dan Police punya flow masing-masing.
- Spesifikasi API terdokumentasi (apispek.md) selaras dengan model Prisma dan enum (ReportStatus, IncidentType, TrackingStatus, dll.).
- Notifikasi realtime (Pusher) memberi umpan balik cepat ke semua role.
- Docker Compose memudahkan jalankan API + ML di satu lingkungan; Flutter app (fe_owner) siap untuk Android/iOS/web.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Integrasi nyata feed CCTV (stream URL) ke pipeline ML butuh penyesuaian format dan performa (FPS, resolusi).
- Model deteksi (accuracy, false positive) tergantung data latih dan tuning; di production perlu monitoring.
- Sinkronisasi state antara web dan mobile (mis. daftar laporan) mengandalkan API dan notifikasi; cache invalidation perlu konsisten.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Abstraksi channel notifikasi:** Interface “RealtimeChannel” agar ganti Pusher ke Socket.io atau yang lain tidak mengubah seluruh modul notifikasi.
- **Pipeline deteksi yang robust:** Antrean frame (queue), retry jika ML gagal, dan fallback ke manual report jika deteksi tidak tersedia.
- **Tes integrasi:** Alur: deteksi → buat laporan → notifikasi → verifikasi → assign → update tracking; pastikan role dan permission konsisten.
- **Monitoring ML:** Log latency dan hasil deteksi (positive/negative) agar drift model bisa terpantau.

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan menggabungkan **computer vision (ML)** dengan **backend multi-role** dan **dua frontend (web + mobile)** dalam satu sistem: deteksi senjata dari CCTV, laporan otomatis, notifikasi realtime, verifikasi dan penugasan polisi, serta tracking petugas. Pelajaran yang terbawa: **pemisahan layanan API dan ML** memudahkan scaling dan teknologi yang berbeda (Node vs Python); **notifikasi realtime multi-role** butuh desain channel dan payload yang jelas; **dokumentasi API (apispek)** sangat membantu koordinasi antar repo.

---

## Tautan Kode & Demo

**Repositori:**

- **Server (API + ML):** [github.com/howlil/tangkapin-server](https://github.com/howlil/tangkapin-server)
- **Client web (Officer/Police):** [github.com/howlil/tangkapin-client](https://github.com/howlil/tangkapin-client)
- **Mobile (Owner / fe_owner):** [github.com/howlil/tangkapin-mobile](https://github.com/howlil/tangkapin-mobile)

**Tumpukan teknologi:**

- **Server:** Node.js, Express 5, Prisma (PostgreSQL), JWT, bcrypt, Joi, Multer, Pusher, Winston. Layanan ML: Python, Flask, PyTorch (folder `ml/`). Docker (Dockerfile.api, Dockerfile.ml), docker-compose, PM2 (ecosystem.config.js).
- **Client web:** Next.js 15, React 19, TypeScript, Radix UI, Tailwind, Pusher-js, Leaflet (react-leaflet), Recharts, React Hook Form, Zod, Framer Motion. components.json (shadcn-style).
- **Mobile (Flutter):** Dart/Flutter, go_router, Provider, http, shared_preferences, video_player, webview_flutter, mjpeg_view (stream CCTV). Target: Android, iOS, web, Windows, Linux, macOS.

**Cara menjalankan di lokal:**

**Server (API + ML):**

```bash
git clone https://github.com/howlil/tangkapin-server.git
cd tangkapin-server
npm install
# Atur .env: DATABASE_URL, JWT_SECRET, PUSHER_*, dll.
npx prisma generate
npx prisma migrate deploy   # atau db push
npm run db:seed             # opsional
# Jalankan API dan ML bersamaan:
npm run dev:all             # atau: docker-compose up
```

**Client web:**

```bash
git clone https://github.com/howlil/tangkapin-client.git
cd tangkapin-client
pnpm install
# Atur .env (NEXT_PUBLIC_*) untuk URL API dan Pusher
pnpm dev
```

**Mobile (Flutter):**

```bash
git clone https://github.com/howlil/tangkapin-mobile.git
cd tangkapin-mobile
flutter pub get
# Atur base URL API di kode/config
flutter run
```

Dokumentasi API: [tangkapin-server/apispek.md](https://github.com/howlil/tangkapin-server/blob/main/apispek.md) — Weapon Detection System API Specification, selaras dengan model Prisma (Owner, Officer, Police, CCTV, Report, Evidence, Assignment, Tracking, Notification, AuditLog).
