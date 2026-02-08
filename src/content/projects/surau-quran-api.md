---
title: 'Surau Quran API'
type: 'work'
date: '2024-06-15'
excerpt: 'Sistem informasi untuk surau/TPA: mengelola siswa, guru, program, pembayaran SPP, absensi, dan gaji guru.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'JWT', 'PM2']
shortExplanation: 'Backend lengkap untuk sistem informasi surau/TPA (pendidikan Al-Quran): mengelola siswa, guru, program, pendaftaran, tagihan SPP, pembayaran online (Xendit—VA, e-wallet), absensi, dan payroll guru dengan pencairan dana. Deploy on-premise atau shared hosting (PM2/cPanel).'
projectGoals:
  - 'Menjadi sumber kebenaran tunggal untuk data siswa, keuangan, dan operasional harian surau.'
  - 'Integrasi pembayaran online (Xendit) untuk SPP dan pendaftaran serta payroll guru (pencairan).'
  - 'Auth multi-role (Super Admin, Admin Surau, Admin, Guru, Siswa) dengan batas akses yang jelas.'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Autentikasi multi-role

JWT untuk Super Admin, Admin Surau, Admin, Guru, dan Siswa. Satu akun (User) dengan satu profil peran; token menentukan akses ke rute dan resource.

### Manajemen siswa, guru & program

CRUD siswa, guru, dan program/kelas. Pendaftaran dengan voucher dan tagihan; relasi terstruktur (User → Siswa/Guru/Admin) untuk operasional harian.

### Pembayaran SPP & pendaftaran (Xendit)

Tagihan SPP; pembayaran lewat Xendit (VA, e-wallet). Invoice dan callback untuk sinkronisasi status; alur pendaftaran + pembayaran terintegrasi.

### Absensi & payroll guru

Pencatatan absensi; payroll guru dengan pencairan dana (Xendit payout). Cron untuk job terjadwal (pengingat, pembersihan, sinkronisasi status). Deploy dengan PM2 dan penutupan tertib (SIGTERM/SIGINT).

---

## Konteks (Kenapa proyek ini ada)

Saya ingin membangun backend lengkap untuk lingkungan nyata: sistem informasi surau/Quran (layanan pendidikan Al-Quran), bukan sekadar CRUD demo. Konteksnya adalah produk yang dipakai untuk mengelola siswa, guru, program, pembayaran SPP & pendaftaran, absensi, dan payroll—dengan infrastruktur yang bisa di-deploy on-premise atau shared hosting (termasuk cPanel).

**Lingkungan:** Proyek sampingan siap produksi / bisa dipakai untuk operasional surau.

**Kenapa masalah ini muncul:** Butuh satu API yang menjadi sumber kebenaran tunggal untuk data siswa, keuangan, dan operasional harian, dengan pembayaran online (VA, e-wallet) dan payroll guru yang terintegrasi.

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** Menyediakan API yang konsisten untuk auth (multi-role), pendaftaran, tagihan SPP, pembayaran online, absensi, dan payroll dalam satu codebase.
- **Masalah operasional:** Meminimalkan konfigurasi manual (env, database, cron) dan memastikan deploy bisa lewat PM2 atau cPanel tanpa kehilangan fitur inti.
- **Masalah pembelajaran:** Memahami integrasi gateway pembayaran (Xendit), alur pendaftaran + voucher + pembayaran, dan payroll dengan pencairan dana.

---

## Batasan

- **Skill / pengalaman:** Satu orang (saya); stack yang sudah dikenal (Node, Express, SQL) diprioritaskan.
- **Infrastruktur:** MySQL (bisa shared hosting), deploy via PM2 atau cPanel; tidak wajib Kubernetes/cloud.
- **Waktu:** Fokus fitur inti dulu (auth, siswa, program, pembayaran, absensi, payroll); fitur tambahan (testimoni, galeri) mengikuti.
- **Tool yang tersedia:** Prisma (ORM), Xendit Node SDK, Nodemailer, node-cron; tidak pakai queue/worker terpisah di v1.

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Express 5 + Prisma (MySQL)** | Konsisten dengan ekosistem Node, Prisma memberi keamanan tipe dan migrasi yang rapi. | NestJS (lebih berat), Sequelize (kurang nyaman untuk skema besar). |
| **Satu monolit API** | Sesuai skala surau; satu basis kode memudahkan deploy dan perawatan. | Mikroservis (berlebihan untuk lingkup ini). |
| **Xendit untuk pembayaran & pencairan** | Satu penyedia untuk invoice (VA, e-wallet) dan payout guru; dokumentasi dan SDK jelas. | Midtrans (fokus transaksi), transfer manual (tanpa otomasi). |
| **Autentikasi berbasis peran (JWT)** | Super Admin, Admin Surau, Admin, Guru, Siswa butuh batas jelas; token cukup untuk API tanpa state. | Berbasis sesi (butuh penyimpanan), OAuth (kompleks untuk internal). |
| **Skema Prisma sentral (User → Siswa/Guru/Admin)** | Satu akun (User) bisa punya satu profil peran; memudahkan login dan izin akses. | Tabel terpisah tanpa relasi ke User (duplikasi konsep login). |
| **Cron untuk job terjadwal** | Untuk pengingat, pembersihan, atau sinkronisasi status pembayaran; tanpa antrean eksternal. | Bull/Redis (tambah infrastruktur), cron terkelola (tergantung platform). |
| **PM2 + ecosystem.config.js** | Deploy produksi sederhana, restart saat gagal, env terpusat. | Docker (opsional nanti), systemd. |

---

## Trade-off dan Dampaknya

- **Monolit:** Skala horizontal nanti akan terbeban satu aplikasi; untuk skala surau saat ini bisa diterima. Refaktor ke layanan terpisah hanya jika benar-benar perlu.
- **Cron dalam proses:** Jika proses cron berat, bisa memblokir; ke depan bisa dipindah ke antrean job jika lalu lintas naik.
- **Banyak model Prisma:** Skema jadi besar dan migrasi harus hati-hati; di sisi lain, satu skema membuat relasi dan kueri konsisten.
- **Ketergantungan Xendit:** Kebijakan dan biaya Xendit mengikat; mitigasi dengan abstraksi lapisan pembayaran agar ganti penyedia tetap mungkin (dengan usaha).
- **Upload lokal (`/uploads`):** Tanpa penyimpanan objek; untuk produksi besar lebih aman pakai S3/Cloudflare R2, untuk sekarang berkas di server bisa diterima.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu API melayani auth, siswa, guru, program, kelas, pendaftaran, SPP, pembayaran Xendit, absensi, dan payroll.
- Prisma + MySQL memudahkan migrasi dan konsistensi data; seed dev/prod memudahkan pengenalan.
- PM2 dan penutupan tertib (SIGTERM/SIGINT) membuat deploy dan restart lebih terduga.
- Integrasi Xendit (invoice + pencairan) berjalan untuk alur bayar SPP dan gaji guru.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Skema dan relasi membesar; kadang migrasi butuh penyesuaian manual (index, enum).
- Debug callback Xendit (webhook) butuh endpoint publik dan pengecekan tanda tangan; di lingkungan dev perlu tunnel/ngrok.
- Tanpa antrean, job berat (misalnya laporan besar) bisa memblokir permintaan; untuk sekarang belum kritis.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Abstraksi pembayaran:** Buat antarmuka “PaymentProvider” dari awal agar ganti Xendit ke penyedia lain tidak mengubah seluruh pengendali.
- **Struktur folder per domain:** Kelompokkan rute/pengendali per domain (auth, siswa, keuangan, payroll) lebih ketat agar navigasi kode lebih enak.
- **Penyimpanan objek untuk upload:** Dari awal rencanakan upload ke S3/R2 agar produksi tidak bergantung pada sistem berkas server.
- **Pengujian:** Tambah tes integrasi untuk alur kritis (pendaftaran → pembayaran → aktivasi) agar refaktor aman.
- Untuk skala yang tetap “satu surau / sedikit tenant”, arsitektur saat ini tetap masuk akal; yang akan diperbaiki adalah batas domain dan pengujian, bukan ubah ke mikroservis.

---

## Mengapa Ini Penting

Proyek ini menunjukkan bahwa saya bisa mengerjakan sistem backend penuh dengan batasan jelas: satu basis kode, satu basis data, satu unit deployment, tapi dengan fitur lengkap (auth, keuangan, pembayaran, payroll). Pelajaran yang terbawa ke proyek lain: **desain berbasis batasan** (shared hosting, MySQL, PM2) memaksa keputusan yang praktis; **integrasi eksternal** (Xendit) butuh abstraksi dan penanganan galat yang eksplisit; **penutupan tertib dan cron** mengajarkan bahwa operasional produksi tidak cuma “kode jalan”, tapi juga siklus hidup dan batasan sumber daya.

---

## Tautan Kode & Demo

**Repositori:** Tidak dipublikasikan (proyek kerja / software house).

**Tumpukan teknologi:** Node.js, Express 5, Prisma (MySQL), JWT, bcrypt, Joi, Xendit (xendit-node), Nodemailer, Multer, Winston, node-cron, PM2.

**Cara menjalankan di lokal:** Di folder proyek: `npm install`, atur `.env` (DATABASE_URL, JWT_SECRET, opsional XENDIT_*, SMTP_*), `npx prisma generate && npx prisma migrate deploy`, `npm run seed` (opsional), `npm run dev` (atau `npm start` / `pm2 start ecosystem.config.js`). Server bawaan: `http://localhost:5000`. Cek kesehatan: `GET /`. Prefiks API: `/api`.
