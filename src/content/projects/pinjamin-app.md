---
title: 'Pinjamin App (Peminjaman Ruangan Kampus)'
type: 'academic'
date: '2024-09-01'
excerpt: 'Sistem peminjaman ruangan kampus: pesan ruangan, tunggu persetujuan, bayar online, dapat notifikasi.'
tags: ['React', 'Vite', 'Chakra UI', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Pusher', 'Docker']
repository: 'https://github.com/howlil/pinjamin-app'
shortExplanation: 'Sistem peminjaman ruangan untuk lingkungan kampus (Unand): pengguna internal/eksternal memesan gedung/ruangan, mengajukan proposal, menunggu persetujuan admin, lalu bayar sewa lewat Xendit dan dapat notifikasi realtime (Pusher) serta unduh bukti PDF.'
projectGoals:
  - 'Mengelola ketersediaan gedung/ruangan (kelas, lab, PKM, multifungsi, seminar) dan status pemesanan.'
  - 'Alur lengkap: booking → approval → pembayaran online (Xendit) → refund jika perlu → notifikasi realtime.'
  - 'Memberi peminjam notifikasi cepat dan bukti booking (PDF); admin kelola gedung, fasilitas, dan approval.'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Katalog gedung & fasilitas

Daftar gedung dengan tipe (kelas, lab, PKM, multifungsi, seminar), harga, kapasitas, dan fasilitas (many-to-many). Filter gedung berdasarkan fasilitas (misalnya proyektor).

### Booking & persetujuan

Peminjam mengajukan booking dengan tanggal, waktu, dan surat proposal. Status: processing → approved/rejected; alasan penolakan disimpan. Admin mengelola approval dari dashboard.

### Pembayaran online (Xendit) & refund

Invoice Xendit (Snap/checkout URL) untuk pembayaran sewa; webhook untuk sinkronisasi status. Refund terintegrasi; riwayat payment terpisah dari booking untuk kejelasan.

### Notifikasi realtime & bukti PDF

Pusher untuk notifikasi realtime ke peminjam saat booking disetujui/ditolak atau pembayaran lunas. Generate dan unduh bukti booking (PDF) di client dengan @react-pdf/renderer.

---

## Konteks (Kenapa proyek ini ada)

**Proyek tugas besar.** Saya ingin membangun sistem peminjaman ruangan untuk lingkungan kampus (konteks: Unand): pengguna (internal dan eksternal kampus) bisa memesan gedung/ruangan (kelas, lab, PKM, multifungsi, seminar), mengajukan proposal, menunggu persetujuan, lalu membayar sewa lewat pembayaran online. Admin mengelola gedung, fasilitas, dan status booking; peminjam mendapat notifikasi (termasuk realtime) dan bisa mengunduh bukti (PDF). Bukan sekadar form pemesanan—tapi alur lengkap: daftar gedung, booking, approval, pembayaran (Xendit), refund jika perlu, dan notifikasi.

**Lingkungan:** Proyek sistem informasi kampus / production-ready; satu repositori berisi frontend (`fe`) dan backend (`server`).

**Kenapa masalah ini muncul:** Peminjaman ruangan sering masih manual (form fisik, transfer manual); butuh satu aplikasi yang mengelola ketersediaan, status pemesanan, pembayaran terintegrasi, dan pemberitahuan ke peminjam dan pengelola gedung.

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** Menyediakan API untuk gedung (dengan tipe, harga, kapasitas, fasilitas), booking (tanggal, waktu, surat proposal, status), pembayaran (invoice Xendit, Snap, status transaksi), refund, dan notifikasi; plus frontend yang ramah untuk peminjam dan admin.
- **Masalah operasional:** Alur persetujuan booking (processing → approved/rejected), integrasi pembayaran dan webhook Xendit, serta notifikasi realtime agar peminjam dan admin tidak perlu refresh terus.
- **Masalah pembelajaran:** Integrasi Xendit (invoice + refund), realtime dengan Pusher, dan generate PDF (bukti booking) di frontend.

---

## Batasan

- **Keterampilan / pengalaman:** Stack yang sudah dikenal: Node.js, Express, Prisma, React, Vite; satu repo monorepo (fe + server) agar deploy dan versi tetap selaras.
- **Infrastruktur:** MySQL, deploy dengan Docker (fe pakai Nginx, server Node); CI/CD lewat GitHub Actions.
- **Waktu:** Fitur inti: gedung, booking, approval, pembayaran, notifikasi; dashboard dan laporan bisa menyusul.
- **Alat yang tersedia:** Prisma, Xendit (invoice + refund), Pusher (realtime), Nodemailer (email), node-cron (job terjadwal), Multer (upload), Excel (xlsx) untuk ekspor jika diperlukan.

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Satu repo dengan `fe/` dan `server/`** | Satu tempat untuk frontend dan backend; CI bisa build dan deploy keduanya. | Dua repo terpisah (lebih banyak koordinasi). |
| **Express + Prisma (MySQL)** | Cukup untuk CRUD gedung, booking, pembayaran, notifikasi; migrasi rapi. | NestJS (lebih berat), Sequelize. |
| **Building + Facility + FacilityBuilding** | Gedung punya banyak fasilitas; relasi many-to-many memudahkan filter (misalnya gedung dengan proyektor). | Fasilitas sebagai JSON di gedung (kurang fleksibel untuk query). |
| **Booking dengan status (processing, approved, rejected, completed)** | Alur jelas untuk admin dan peminjam; surat proposal dan alasan penolakan disimpan. | Hanya status “pending/done” (kurang informatif). |
| **Xendit untuk pembayaran dan refund** | Satu provider untuk invoice dan pengembalian dana; Snap/checkout URL memudahkan frontend. | Midtrans, pembayaran manual (tanpa otomasi). |
| **Payment terpisah dari Booking (1:1)** | Satu booking satu pembayaran; riwayat refund terhubung ke payment. | Payment embedded di booking (kurang rapi untuk refund). |
| **Pusher untuk notifikasi realtime** | Peminjam dan admin dapat pemberitahuan tanpa polling; integrasi sederhana di backend dan frontend. | Socket.io (butuh maintain koneksi), polling. |
| **Frontend: React + Chakra UI + Vite** | Cepat, komponen siap pakai, tema konsisten; Vite untuk build ringan. | Next.js (SSR tidak wajib), Tailwind saja. |
| **Generate PDF di client (@react-pdf/renderer)** | Bukti booking bisa diunduh di browser tanpa beban server. | Generate PDF di server (tambah dependensi dan CPU). |
| **Recharts untuk dashboard** | Grafik peminjaman/statistik di sisi admin. | Library lain (Chart.js, D3) atau tanpa grafik di v1. |

---

## Trade-off dan Dampaknya

- **Monorepo:** Perubahan fe dan server dalam satu commit; perlu disiplin agar dependency tidak saling mengunci. Keuntungan: satu clone, satu pipeline.
- **Pusher (layanan berbayar):** Ketergantungan pada provider; untuk development bisa pakai plan gratis atau mock. Alternatif nanti: Socket.io self-hosted.
- **Notifikasi dan payment webhook:** Webhook Xendit harus endpoint publik dan idempoten; di dev perlu tunnel (ngrok) dan penanganan duplikat.
- **PDF di client:** Dokumen berat atau banyak halaman bisa lambat di perangkat lemah; untuk bukti booking satu halaman masih wajar.
- **Booking tanpa slot waktu granular:** Jika skema hanya start/end time per booking, konflik jadwal harus dicek di aplikasi (overlap detection); kalau nanti butuh slot per jam, skema bisa diperluas.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu aplikasi melayani peminjam (lihat gedung, ajukan booking, bayar, terima notifikasi, unduh bukti) dan admin (kelola gedung, setuju/tolak booking, lihat pembayaran).
- Integrasi Xendit untuk invoice dan refund berjalan; status pembayaran tersinkron lewat webhook.
- Notifikasi realtime (Pusher) memberi umpan balik cepat ke peminjam saat booking disetujui/ditolak atau pembayaran lunas.
- Docker dan GitHub Actions memudahkan build dan deploy fe + server.
- Swagger (dan api.md) mendokumentasikan endpoint untuk tim atau integrasi.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Webhook Xendit kadang perlu retry dan idempotensi; harus hati-hati agar status payment tidak double-update.
- Pengaturan jadwal “ketersediaan” gedung (blackout date, jam operasional) kalau belum dimodelkan di v1 harus ditambah nanti.
- Realtime bergantung koneksi Pusher; jika key/network bermasalah, notifikasi fallback ke polling atau hanya saat refresh.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Model ketersediaan gedung:** Dari awal tambah konsep “slot” atau “jadwal blokir” agar konflik booking bisa dicek otomatis dan tidak hanya mengandalkan approval manual.
- **Abstraksi pembayaran:** Interface “PaymentProvider” agar ganti Xendit ke provider lain tidak mengubah seluruh modul payment dan refund.
- **Tes integrasi:** Tambah tes untuk alur: buat booking → approve → bayar → webhook → notifikasi → refund (jika ada).
- **Notifikasi fallback:** Jika Pusher gagal, fallback ke polling atau “cek saat buka halaman” agar peminjam tetap dapat info.

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan membangun sistem peminjaman ruangan skala kampus dengan alur lengkap: katalog gedung, booking, persetujuan, pembayaran online, refund, dan notifikasi realtime. Pelajaran yang terbawa: **integrasi payment gateway** (Xendit) butuh desain webhook yang idempoten dan aman; **realtime (Pusher)** meningkatkan UX tanpa wajib pakai WebSocket self-hosted; **satu repo fe + server** memudahkan sinkronisasi versi dan deploy selama batas modul tetap jelas.

---

## Tautan Kode & Demo

**Repositori:** [github.com/howlil/pinjamin-app](https://github.com/howlil/pinjamin-app) (monorepo: `fe/` + `server/`)

**Tumpukan teknologi:**

- **Backend (server):** Node.js, Express 4, Prisma (MySQL), JWT, bcryptjs, Joi, Multer, node-cron, Nodemailer, Pusher, Xendit (xendit-node), Winston, Swagger, xlsx. PM2 (ecosystem.config.js), Docker.
- **Frontend (fe):** React 19, Vite 6, Chakra UI, Tailwind CSS, Framer Motion, Lottie, Zustand, Axios, React Router, Pusher (pusher-js), @react-pdf/renderer, Recharts, react-hot-toast. Docker, Nginx.

**Cara menjalankan di lokal:**

**Server:**

```bash
git clone https://github.com/howlil/pinjamin-app.git
cd pinjamin-app/server
pnpm install
# Atur .env: DATABASE_URL, JWT_SECRET, XENDIT_*, PUSHER_*, dll.
pnpm run db:push    # atau db:migrate
pnpm run db:seed    # opsional
pnpm run dev
```

**Frontend:**

```bash
cd pinjamin-app/fe
pnpm install
# Atur .env (VITE_*) untuk URL API dan Pusher
pnpm run dev
```

Atau gunakan Docker/docker-compose di masing-masing folder. Dokumentasi API: lihat `server/api.md` atau endpoint Swagger yang dikonfigurasi di server.
