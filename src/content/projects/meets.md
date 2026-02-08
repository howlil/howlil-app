---
title: 'Meets (Platform Mentoring)'
type: 'work'
date: '2024-07-01'
excerpt: 'Platform yang menghubungkan mentor dan mentee: pilih mentor, berlangganan, jadwalkan sesi, video call dan chat.'
tags: ['React', 'Vite', 'Node.js', 'Express', 'Sequelize', 'MySQL', 'Socket.io', 'Kafka', 'VideoSDK', 'Firebase']
shortExplanation: 'Platform mentoring lengkap: mentee memilih mentor (keahlian & gaya), berlangganan, jadwal sesi, bayar; sesi lewat video call (VideoSDK) dan chat realtime (Socket.io); mentor kelola jadwal, setuju/tolak/reschedule, dan terima payroll.'
projectGoals:
  - 'Menghubungkan mentee dengan mentor lewat katalog, langganan, dan jadwal sesi dengan persetujuan/reschedule.'
  - 'Mendukung sesi mentoring lewat video call dan chat realtime serta notifikasi multi-channel (email, SMS, push).'
  - 'Mengotomasi operasional: pengingat sesi, kehadiran, testimoni, payroll mentor, dan ekspor transaksi.'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Katalog mentor & langganan

Mentee memilih mentor berdasarkan keahlian (expertise) dan gaya (style). Mentor punya profil (pendidikan, pengalaman, sertifikasi) dan jadwal ketersediaan. Berlangganan dan transaksi terintegrasi; admin mengelola pengguna dan kategori.

### Jadwal sesi & persetujuan

Permintaan sesi mentoring dengan tanggal/jam; mentor bisa setuju, tolak, atau reschedule. Status sesi (pending, approved, completed, cancelled) dan alasan pembatalan. Pengingat (email/SMS) sebelum sesi; pencatatan kehadiran.

### Video call & chat realtime

Sesi mentoring lewat video call (VideoSDK) di client; chat room per sesi dengan Socket.io untuk komunikasi realtime dua arah tanpa polling.

### Payroll & ekspor transaksi

Payroll mentor terotomasi (jadwal bulanan); ekspor transaksi untuk keuangan. Notifikasi dan job async (email, update status) lewat Kafka agar tidak memblokir request.

---

## Konteks (Kenapa proyek ini ada)

Saya ingin membangun platform mentoring lengkap: mentee bisa memilih mentor berdasarkan keahlian (expertise) dan gaya (style), berlangganan, menjadwalkan sesi mentoring, lalu mengikuti pertemuan lewat video call dan chat. Mentor punya profil (pendidikan, pengalaman kerja, sertifikasi), jadwal ketersediaan, dan menerima persetujuan/tolak/reschedule permintaan sesi; sistem mengirim pengingat (email/SMS), mencatat kehadiran, dan mengelola payroll mentor. Admin mengelola pengguna, kategori, dan konten. Bukan sekadar jadwal meeting—tapi alur dari registrasi mentor/mentee, langganan, booking, persetujuan, video call, testimoni, sampai payroll dan ekspor transaksi.

**Lingkungan:** Proyek production (metro/Meets); satu repositori berisi `api/` (backend) dan `client/` (frontend), deploy staging dan production lewat GitHub Actions.

**Kenapa masalah ini muncul:** Perlu satu aplikasi yang menyatukan katalog mentor, booking sesi, pembayaran/langganan, komunikasi realtime (chat + video), notifikasi terjadwal, dan operasional (payroll, laporan).

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** API untuk profil (mentor/mentee), keahlian & gaya, jadwal, langganan, transaksi, sesi mentoring (status, reschedule, alasan pembatalan), chat room (Socket.io), notifikasi; plus autentikasi (JWT, Google), otorisasi per peran (Admin, Mentor, Mentee).
- **Masalah operasional:** Cron untuk pengingat sesi, update status mentoring, payroll bulanan, mentee journey, ekspor transaksi, retry kirim email (persetujuan mentor, akses admin); antrean tugas async pakai Kafka.
- **Masalah pembelajaran:** Integrasi video call (VideoSDK di client), chat realtime (Socket.io), event-driven dengan Kafka, dan banyak job terjadwal tanpa memblokir request.

---

## Batasan

- **Keterampilan / pengalaman:** Stack yang sudah dikenal: Node.js, Express, Sequelize (MySQL), React, Vite; fokus satu repo monorepo (api + client).
- **Infrastruktur:** MySQL, deploy production (mis. Niagahoster via SSH); Node 18; client build statis dengan env (Vite).
- **Waktu:** Fitur inti: mentor/mentee, jadwal, mentoring, langganan/transaksi, chat, notifikasi, payroll; konten (artikel, banner) dan statistik menyusul.
- **Alat yang tersedia:** Sequelize, Socket.io, Kafka, Firebase (notifikasi/auth), Twilio (SMS), Nodemailer + EJS (email), ExcelJS (ekspor), node-cron, rate-limit, helmet.

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Sequelize + MySQL** | ORM matang, migrasi dan seeder rapi; relasi mentor–mentee–mentoring–subscription–transaction jelas. | Prisma (konsisten dengan proyek lain), TypeORM. |
| **Socket.io untuk chat room** | Chat per room (room chat, peserta, pesan); realtime dua arah tanpa polling. | Pusher (layanan berbayar), WebSocket mentah. |
| **Kafka untuk antrean tugas** | Producer/consumer untuk job async (email, notifikasi, update status) agar tidak memblokir API. | Bull/Redis (tambah infra Redis), cron saja (kurang fleksibel). |
| **Mentoring dengan status + reschedule + kehadiran** | Alur jelas: permintaan → setuju/tolak → jadwal → mentor/mentee present → testimoni; is_reschedule, cancelation_reason, is_reminded. | Hanya status selesai/batal (kurang detail operasional). |
| **Cron terpisah per job** | Reminder mentoring (tiap menit), update status (tiap jam), payroll (tgl 26), mentee journey (tgl 1), ekspor transaksi (harian), retry email (setiap 5–6 jam). | Satu cron heavy (risiko timeout). |
| **EJS + Nodemailer untuk template email** | Undangan, persetujuan/penolakan mentoring, lupa password, akses admin; template di server. | React Email, layanan pihak ketiga. |
| **Firebase + Twilio** | Notifikasi push (Firebase) dan SMS (Twilio) untuk pengingat dan akses. | Hanya email (kurang reach). |
| **Client: React + Vite + MUI + VideoSDK** | Cepat, komponen siap pakai, integrasi video call (@videosdk.live) untuk sesi mentoring. | Next.js (SSR tidak wajib), Jitsi/WebRTC mentah. |
| **Google OAuth + JWT** | Login dengan Google; sesi API pakai JWT. | Hanya email/password (kurang opsi). |
| **Deploy: GitHub Actions (staging + production)** | CI/CD otomatis; production deploy ke Niagahoster via SSH. | Deploy manual, platform lain. |

---

## Trade-off dan Dampaknya

- **Banyak cron job:** Scheduler padat; perlu monitoring agar tidak overlap dan memastikan idempotensi di handler (mis. update status, retry email).
- **Kafka:** Tambah infrastruktur (broker); untuk skala kecil bisa overkill, tapi memudahkan penambahan consumer dan decoupling.
- **Socket.io + API monolit:** Koneksi realtime dan HTTP di proses yang sama; scaling horizontal butuh sticky session atau adapter (Redis).
- **VideoSDK di client:** Ketergantungan pada layanan pihak ketiga; kualitas dan biaya tergantung provider.
- **Sequelize (bukan Prisma):** Migrasi dan seed sudah jalan; konsistensi dengan proyek lain yang pakai Prisma bisa beda pola.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu platform melayani mentee (cari mentor, langganan, jadwal, bayar, chat, video call, testimoni) dan mentor (profil, jadwal, setuju/tolak sesi, payroll).
- Alur mentoring (request → approve/reject/reschedule → reminder → kehadiran → testimony) berjalan dengan cron dan notifikasi.
- Chat room (Socket.io) dan video call (VideoSDK) mendukung sesi langsung.
- Ekspor transaksi dan payroll mentor terotomasi; email dengan template EJS konsisten.
- Deploy staging dan production lewat GitHub Actions memudahkan rilis.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Banyak cron dan Kafka consumer butuh penanganan error dan retry yang jelas agar tidak ada data menggantung.
- Koordinasi timezone dan “hari” (date) untuk cron (mis. tgl 1, tgl 26) harus hati-hati di server.
- Dokumentasi API (openapi.json, docs) perlu dijaga agar tetap sinkron dengan rute.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Abstraksi notifikasi:** Satu interface “NotificationChannel” (email, SMS, push) agar penambahan channel atau ganti provider tidak menyebar ke banyak file.
- **Idempotensi cron dan consumer:** Semua handler cron dan Kafka consumer idempoten dan log progress (mis. “reminder sent”, “status updated”) agar aman di-retry.
- **Tes integrasi:** Tambah tes untuk alur kritis: buat permintaan mentoring → approve → reminder → update kehadiran → testimony.
- **Monitoring cron:** Log atau metrik durasi tiap job agar job lambat bisa terdeteksi.

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan membangun platform mentoring skala production dengan banyak fitur: katalog mentor, jadwal, langganan & transaksi, sesi mentoring (persetujuan, reschedule, kehadiran), chat realtime, video call, notifikasi multi-channel, payroll, dan otomasi lewat cron dan Kafka. Pelajaran yang terbawa: **event-driven (Kafka)** membantu decoupling job berat dari request HTTP; **banyak cron** butuh desain idempoten dan monitoring; **realtime (Socket.io) dan video (VideoSDK)** menuntut pemilihan provider dan fallback yang jelas.

---

## Tautan Kode & Demo

**Repositori dan demo:** Tidak dipublikasikan (proyek kerja / software house). Monorepo: `api/` + `client/`. Deploy via GitHub Actions (staging + production).

**Tumpukan teknologi:**

- **Backend (api):** Node.js 18, Express 4, Sequelize (MySQL), JWT, bcrypt, Joi, Socket.io, Kafka (KafkaJS), Firebase Admin, Google Auth, Twilio, Nodemailer, EJS, ExcelJS, node-cron, express-rate-limit, helmet, Winston. Jest, Supertest.
- **Frontend (client):** React 18, Vite 5, MUI, NextUI, Tailwind, Headless UI, @videosdk.live (video call), Socket.io-client, Firebase, React Query, Redux, Zustand, React Quill, Chart.js, Lottie, Framer Motion, @react-pdf/renderer, date-fns/dayjs, Yup. Sitemap generation.

**Cara menjalankan di lokal:**

**API:** `cd api`, `npm install`, `cp .env.example .env` (isi DATABASE_URL, JWT, Firebase, Twilio, Kafka, dll.), `npm run dev`. Socket dan Kafka consumer ikut jalan di proses yang sama.

**Client:** `cd client`, `npm install`, atur `.env` (VITE_*), `npm run dev`.

Dokumentasi API: lihat `api/README.md`, `api/docs/`, dan `api/openapi.json`. Cron job didefinisikan di `api/index.js` dan `api/src/utils/cronjob.js`.
