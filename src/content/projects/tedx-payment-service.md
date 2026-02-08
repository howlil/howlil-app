---
title: 'TEDx Payment Service'
type: 'work'
date: '2024-12-01'
excerpt: 'Layanan untuk menjual dan mengelola pembayaran tiket acara TEDx secara online.'
tags: ['Node.js', 'Express', 'Prisma', 'MySQL', 'Xendit', 'Nodemailer', 'Docker']
shortExplanation: 'Microservice pembayaran untuk acara TEDx: katalog tiket (dengan validFrom/validUntil), buat order (user + item tiket), invoice Xendit (VA, e-wallet), webhook untuk update status order & payment, dan email konfirmasi (Nodemailer). Bisa dipanggil oleh frontend pendaftaran atau sistem lain.'
projectGoals:
  - 'Menjual tiket TEDx dengan harga, kuota, dan periode valid (early bird/penutupan) terkelola.'
  - 'Integrasi pembayaran online (Xendit) dan webhook idempoten untuk sinkronisasi status.'
  - 'Layanan kecil terpisah agar mudah diintegrasikan dengan berbagai client (web, mobile, sistem event).'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Katalog tiket

Daftar tiket dengan tipe, harga, jumlah (kuota), dan periode valid (validFrom, validUntil). Endpoint GET untuk list tiket yang bisa dijual dalam periode aktif.

### Order & invoice Xendit

User membuat order (order items: tiket + quantity + price). Satu order satu payment (1:1). Create invoice Xendit → return URL checkout (VA, e-wallet). OrderStatus: PENDING, PAID, CANCELLED, EXPIRED; PaymentStatus: PENDING, PAID, EXPIRED, FAILED.

### Webhook callback & email

Endpoint POST `/api/payment-callback` menerima webhook Xendit saat pembayaran lunas/kadaluarsa; handler idempoten dan verifikasi signature. Setelah bayar: update status order & payment; kirim email konfirmasi/e-ticket (Nodemailer). Logging dengan requestId dan error handling konsisten.

---

## Konteks (Kenapa proyek ini ada)

Saya ingin membangun layanan pembayaran yang fokus untuk acara TEDx: pengunjung melihat daftar tiket (tipe, harga, jumlah, periode valid), membuat order (user + item tiket), lalu membayar lewat invoice Xendit (VA, e-wallet, dll.). Setelah pembayaran lunas, webhook Xendit memicu update status order dan payment; email konfirmasi (Nodemailer) bisa dikirim ke pembeli. Bukan monolit event management lengkap—tapi **microservice pembayaran** yang bisa dipanggil oleh frontend pendaftaran TEDx atau sistem lain.

**Lingkungan:** Proyek production (kerja / software house); satu repositori backend. Deploy dengan Docker; CI/CD lewat GitHub Actions.

**Kenapa masalah ini muncul:** Acara TEDx butuh penjualan tiket terkelola (harga, kuota, periode) dan pembayaran online yang terintegrasi; layanan terpisah memudahkan frontend event dan tim finance memantau transaksi.

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** API untuk list tiket (dengan validFrom/validUntil), buat order (user + order items), buat invoice Xendit, dan terima webhook callback agar status order dan payment selalu sinkron.
- **Masalah operasional:** Validasi stok/kuota tiket (amount), penanganan webhook yang idempoten, dan pengiriman email (konfirmasi atau e-ticket) setelah bayar.
- **Masalah pembelajaran:** Desain layanan pembayaran yang minimal dan terpisah (bisa dipanggil oleh banyak client); logging dengan requestId dan error handling yang konsisten.

---

## Batasan

- **Keterampilan / pengalaman:** Node.js, Express, Prisma (MySQL); fokus satu layanan (payment only), tanpa manajemen user/event penuh di repo ini.
- **Infrastruktur:** MySQL; deploy dengan Docker; entry point `bin/www`.
- **Waktu:** Fitur inti: tiket, order, payment (Xendit), webhook; email dan laporan bisa bertahap.
- **Alat yang tersedia:** Prisma, Xendit (xendit-node), Nodemailer, Winston + winston-daily-rotate-file, Axios (jika perlu panggil layanan lain).

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Model: User, Ticket, Order, OrderItem, Payment** | User beli tiket; Order punya banyak OrderItem (ticket + quantity + price); satu Order satu Payment (1:1). Relasi jelas untuk invoice dan riwayat. | Order tanpa User (guest checkout), atau Payment embedded di Order. |
| **Ticket dengan validFrom / validUntil** | Tiket hanya bisa dijual dalam periode tertentu; memudahkan batas waktu early bird atau penutupan. | Hanya stok (amount) tanpa periode. |
| **OrderStatus & PaymentStatus terpisah** | Order: PENDING, PAID, CANCELLED, EXPIRED; Payment: PENDING, PAID, EXPIRED, FAILED. Status order mengikuti payment tapi bisa dipakai untuk alur batal/expire. | Satu status gabungan (kurang fleksibel). |
| **Xendit untuk invoice** | Satu provider untuk VA, e-wallet, dll.; webhook untuk update status. | Midtrans, pembayaran manual. |
| **Endpoint webhook `/api/payment-callback`** | Xendit memanggil callback saat pembayaran lunas/kadaluarsa; handler harus idempoten dan verifikasi signature/token. | Polling status (kurang real-time). |
| **Hanya tiga endpoint publik: GET tickets, POST orders, POST payment-callback** | API minimal: katalog, buat order (return invoice URL), dan terima webhook. Auth atau admin bisa ditambah nanti. | Banyak endpoint (CRUD penuh) di layanan ini. |
| **Logging: Winston + daily rotate + requestId** | Setiap request punya requestId; error response mengembalikan requestId untuk debugging; log terrotate per hari. | Hanya console.log, atau tanpa requestId. |
| **Error handling: uncaughtException & unhandledRejection** | Process exit on uncaught; log unhandled rejection agar tidak silent fail. | Tanpa global handler (risiko process zombie). |

---

## Trade-off dan Dampaknya

- **Layanan terpisah:** Frontend atau sistem lain harus memanggil API ini untuk tiket dan order; perlu kontrak (request/response) dan env (URL, API key) yang jelas.
- **Webhook harus idempoten:** Xendit bisa kirim ulang callback; handler harus cek status payment/order agar tidak double-update.
- **User hanya di sini (full_name, email, no_hp):** Tidak ada SSO atau sync dengan sistem user event; jika event punya user sendiri, bisa duplikasi atau butuh mapping.
- **Tanpa auth di endpoint:** GET tickets dan POST orders bisa dipanggil siapa saja; keamanan (API key, rate limit) bisa ditambah di layer gateway atau di repo nanti.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu layanan fokus: tiket → order → payment (Xendit) → webhook → update status; alur jelas dan mudah diintegrasikan.
- Prisma + MySQL memudahkan migrasi dan relasi Order–OrderItem–Payment; skema sederhana.
- Logging dengan requestId dan error middleware memudahkan lacak error di production.
- Docker dan GitHub Actions memudahkan build dan deploy.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Verifikasi signature/token webhook Xendit harus konsisten agar tidak ada spoof; dokumentasi Xendit harus diikuti.
- Email (Nodemailer) tergantung konfigurasi SMTP; jika belum dipakai di v1, flow “kirim email setelah bayar” bisa ditambah di handler webhook.
- Kuota tiket (pengurangan amount saat order) perlu diimplementasikan di logic create order agar tidak over-sell.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Kurangi stok tiket saat order:** Saat create order, kurangi `Ticket.amount` (atau pakai reserved stock) agar tidak oversell; restore jika order expired/cancelled.
- **Verifikasi webhook Xendit:** Validasi header/signature dari Xendit di handler callback agar hanya request sah yang diproses.
- **Auth atau API key:** Untuk production, tambah API key atau JWT untuk POST orders (dan GET tickets jika data sensitif).
- **Tes integrasi:** Alur create order → dapat invoice URL → simulasi webhook paid → cek status order & payment.

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan membangun **microservice pembayaran** yang fokus: katalog tiket, order, integrasi payment gateway (Xendit), dan webhook callback. Pelajaran yang terbawa: **layanan kecil dan terpisah** memudahkan integrasi dengan berbagai client (web, mobile, sistem event); **webhook harus idempoten dan aman**; **logging dengan requestId** sangat membantu debugging di production.

---

## Tautan Kode & Demo

**Repositori:** Tidak dipublikasikan (proyek kerja / software house).

**Tumpukan teknologi:** Node.js, Express 4, Prisma 6 (MySQL), Xendit (xendit-node), Nodemailer, Winston, winston-daily-rotate-file, Axios, CORS, cookie-parser. Docker, GitHub Actions.

**Endpoint utama:** `GET /api/tickets`, `POST /api/orders`, `POST /api/payment-callback` (webhook Xendit).

**Cara menjalankan di lokal:** Di folder proyek: `npm install`, atur `.env` (DATABASE_URL, XENDIT_*, SMTP), `npx prisma generate`, `npx prisma migrate deploy`, `npm run seed` (opsional), `npm run dev`. Atau gunakan Docker. Pastikan webhook URL (production) bisa diakses oleh Xendit dan verifikasi callback token di env.
