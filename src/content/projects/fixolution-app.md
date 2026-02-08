---
title: 'Fixolution App (Platform Bengkel & Suku Cadang)'
type: 'work'
date: '2024-10-01'
excerpt: 'Platform yang menghubungkan pengguna dengan bengkel: cari bengkel, booking servis, beli suku cadang, atau request layanan panggilan.'
tags: ['React', 'Vite', 'Tailwind', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Vercel', 'Docker']
shortExplanation: 'Platform dua sisi yang menghubungkan pengguna dengan bengkel: direktori bengkel, booking layanan, e-commerce suku cadang (keranjang, checkout, bukti pembayaran), dan layanan panggilan (Service to Go) ke lokasi pengguna.'
projectGoals:
  - 'Menghubungkan pengguna dengan bengkel lewat satu ekosistem—cari, booking, beli suku cadang, atau request layanan panggilan.'
  - 'Memberi bengkel dashboard untuk mengelola profil, layanan, dan menerima booking serta request Service to Go.'
  - 'Menyediakan superadmin untuk mengelola data global (merek, bengkel, layanan).'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Direktori bengkel & layanan

Pengguna melihat daftar bengkel beserta layanan (servis, perawatan), jam buka/tutup, foto, dan link Google Maps. Filter dan pencarian memudahkan menemukan bengkel yang sesuai.

### Booking layanan

Pemesanan layanan bengkel dengan pilih tanggal dan jam. Status booking (pending, dikonfirmasi, selesai) serta pesan bengkel untuk konfirmasi atau reschedule.

### E-commerce suku cadang

Katalog suku cadang per merek, keranjang belanja, checkout dengan alamat pengiriman, upload bukti pembayaran, dan riwayat transaksi.

### Service to Go (layanan panggilan)

Permintaan layanan panggilan ke lokasi pengguna: deskripsi masalah dan link Google Maps. Bengkel bisa terima/tolak request dan balas pesan; status request terpantau di dashboard.

---

## Konteks (Kenapa proyek ini ada)

Saya ingin membangun platform yang menghubungkan bengkel (workshop) dengan pengguna: pengguna bisa melihat daftar bengkel beserta layanan (servis, perawatan, dll.), memesan layanan lewat booking (tanggal & jam), dan membeli suku cadang dari katalog (keranjang, checkout, bukti pembayaran, pengiriman). Selain itu ada fitur **Service to Go**—permintaan layanan panggilan ke lokasi pengguna (deskripsi, link Google Maps). Bengkel punya dashboard sendiri; superadmin mengelola seluruh data. Bukan sekadar landing page—tapi alur lengkap: cari bengkel/layanan/suku cadang, booking atau beli, bayar, dan (untuk suku cadang) kirim ke alamat.

**Lingkungan:** Proyek production (kerja / software house); satu repositori berisi `be/` (backend) dan `fe/` (frontend). Frontend di-deploy di Vercel.

**Kenapa masalah ini muncul:** Perlu satu aplikasi yang menggabungkan direktori bengkel, booking layanan, e-commerce suku cadang, dan layanan panggilan (service to go) dalam satu ekosistem.

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** API untuk autentikasi (user, bengkel, superadmin), CRUD bengkel (dengan foto, jam buka/tutup, link GMaps), layanan per bengkel, katalog suku cadang (per merek), keranjang & checkout, transaksi dengan bukti pembayaran & alamat pengiriman, booking layanan (tanggal, jam), dan service-to-go request (status, pesan bengkel).
- **Masalah operasional:** Upload foto bengkel dan suku cadang; penyimpanan bukti pembayaran; validasi stok dan harga di sisi server.
- **Masalah pembelajaran:** Memisahkan peran (user, bengkel, superadmin) di satu basis data; relasi keranjang → transaksi → transaksi_sukucadang dan booking_layanan / servicetogo_request.

---

## Batasan

- **Keterampilan / pengalaman:** Stack yang sudah dikenal: Node.js, Express, Prisma (MySQL), React, Vite, Tailwind; fokus satu repo (be + fe).
- **Infrastruktur:** MySQL; backend bisa di-host terpisah (atau Docker); frontend statis di Vercel.
- **Waktu:** Fitur inti: bengkel, layanan, suku cadang, merek, keranjang, transaksi, booking, service to go, alamat; dashboard dan laporan bisa menyusul.
- **Alat yang tersedia:** Prisma, JWT, bcrypt, Multer (upload), Yup (validasi), CORS; tanpa payment gateway di v1 (bukti transfer/upload manual).

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Prisma + MySQL** | Skema jelas: bengkel, user, layanan, sukucadang, merek, keranjang, transaksi, booking, servicetogo; migrasi rapi. | Sequelize, TypeORM. |
| **Tiga aktor: user, bengkel, superadmin** | User beli & booking; bengkel kelola layanan & terima request; superadmin kelola merek dan data global. Token terpisah per tipe (user_id, bengkel_id, admin_id). | Satu tabel user dengan role (lebih sederhana tapi campur aduk). |
| **Keranjang → Transaksi + transaksi_sukucadang** | Satu keranjang bisa jadi satu transaksi; item suku cadang disimpan di transaksi_sukucadang untuk riwayat. | Transaksi tanpa keranjang (langsung checkout) atau keranjang tanpa transaksi terpisah. |
| **Booking layanan (tanggal + jam_mulai)** | User pilih layanan bengkel, tanggal (integer/timestamp), jam; status dan pesan bengkel untuk konfirmasi. | Hanya daftar antrean tanpa slot (kurang terstruktur). |
| **Service to Go (request + gmaps_link + status)** | User kirim lokasi (GMaps) dan deskripsi; bengkel terima/tolak dan bisa balas pesan. | Tanpa layanan panggilan (hanya booking di tempat). |
| **Upload foto: bengkel, suku cadang, bukti pembayaran** | File disimpan di server (public/images/); URL dipakai di API dan FE. | Object storage (S3) dari awal (tambah kompleksitas). |
| **Alamat pengiriman (provinsi, kota, kecamatan, kode_pos, alamat)** | Satu user banyak alamat; transaksi mengacu ke satu alamat_id. | Satu alamat per user (kurang fleksibel). |
| **Frontend: React + Vite + Tailwind** | Cepat, ringan, mudah deploy ke Vercel; axios + jwt-decode untuk auth. | Next.js (SSR tidak wajib), CRA. |
| **Deploy FE ke Vercel** | Build otomatis dari repo; preview per branch. | Hosting statis lain, Docker untuk FE. |

---

## Trade-off dan Dampaknya

- **Pembayaran manual (upload bukti):** Tanpa integrasi payment gateway; verifikasi manual oleh bengkel/admin. Ke depan bisa tambah Midtrans/Xendit untuk otomasi.
- **Upload file di server:** Tanpa CDN atau object storage; untuk banyak gambar dan skala besar perlu rencana migrasi.
- **Booking tanpa slot granular:** Jika banyak pemesan, konflik jam bisa terjadi; bisa ditambah validasi “slot tersedia” nanti.
- **Service to Go tanpa jadwal:** Request hanya status (pending/diterima/ditolak); penjadwalan teknis (kapan tim datang) bisa di luar sistem atau fitur lanjutan.
- **Token polimorfik (user/admin/bengkel):** Satu tabel token dengan user_id, admin_id, bengkel_id; harus konsisten di middleware siapa yang login.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu platform melayani pengguna (cari bengkel, lihat layanan & suku cadang, keranjang, checkout, booking, service to go) dan bengkel (kelola profil, layanan, terima booking & request).
- Katalog suku cadang per merek; keranjang dan transaksi dengan alamat pengiriman dan bukti pembayaran berjalan.
- Booking layanan dan Service to Go memberi dua cara akses ke bengkel (datang vs panggilan).
- Frontend ringan (React, Vite, Tailwind) dan deploy ke Vercel mudah; backend Express + Prisma mudah dijalankan lokal atau di server/Docker.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Verifikasi pembayaran manual; tanpa webhook otomasi status transaksi kurang real-time.
- Pengelolaan upload (nama file, overwrite, ukuran) perlu disiplin agar tidak penuh disk.
- Dashboard dan laporan (untuk bengkel/superadmin) kalau belum ada harus ditambah bertahap.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Integrasi payment gateway:** Midtrans atau Xendit agar status transaksi otomatis (pending/paid/failed) dan mengurangi verifikasi manual.
- **Validasi ketersediaan slot booking:** Cek konflik tanggal & jam per layanan bengkel sebelum konfirmasi booking.
- **Abstraksi upload:** Layer upload (local vs S3/R2) agar migrasi ke object storage tidak mengubah seluruh controller.
- **Tes integrasi:** Alur keranjang → checkout → transaksi dan booking → konfirmasi bengkel.

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan membangun platform dua sisi (pengguna + bengkel) dengan e-commerce suku cadang, booking layanan, dan layanan panggilan (Service to Go) dalam satu basis data dan satu API. Pelajaran yang terbawa: **pemisahan peran (user, bengkel, superadmin)** butuh desain token dan rute yang konsisten; **keranjang dan transaksi** butuh relasi yang jelas agar riwayat dan stok bisa dijaga; **deploy frontend ke Vercel** memudahkan iterasi tanpa mengurus server untuk FE.

---

## Tautan Kode & Demo

**Repositori dan demo:** Tidak dipublikasikan (proyek kerja / software house).

**Tumpukan teknologi:**

- **Backend (be):** Node.js, Express 4, Prisma 5 (MySQL), JWT, bcrypt, Multer, Yup, cookie-parser, morgan, CORS. Docker (Dockerfile).
- **Frontend (fe):** React 18, Vite 5, Tailwind CSS, Axios, jwt-decode, React Router, react-hot-toast, Lucide React, react-loading, react-responsive, react-scroll. Deploy: Vercel (vercel.json).

**Cara menjalankan di lokal:** Di monorepo (folder `be/` dan `fe/`): backend—`cd be`, `npm install`, atur `.env` (DATABASE_URL, JWT_SECRET, PORT), `npx prisma generate`, `npx prisma db push`, `npm start`; frontend—`cd fe`, `npm install`, atur `.env` (VITE_*), `npm run dev`. Foto bengkel dan suku cadang dilayani lewat `/api/fotoBengkel`, `/api/fotoSukuCadang`; bukti pembayaran di `/api/payments`.
