---
title: 'Tracer Survey (Alumni & Atasan)'
type: 'academic'
date: '2024-08-01'
excerpt: 'Sistem tracer study untuk kampus: alumni dan atasan mengisi survei, admin mengelola dan mengekspor data.'
tags: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Docker']
repository: 'https://github.com/howlil/tracer-survey-api'
shortExplanation: 'Sistem tracer study lengkap untuk perguruan tinggi: survei dinamis (berbagai tipe pertanyaan, logika lompat/conditional), responden alumni (per NIM, periode, jurusan) dan atasan (per perusahaan), RBAC admin per fakultas, blast email (undangan, pengingat), dan ekspor data ke Excel.'
projectGoals:
  - 'Mengelola banyak survei dengan pertanyaan dinamis dan logika skip/conditional untuk tracer study dan akreditasi.'
  - 'Satu basis data untuk responden alumni dan atasan; aturan akses per fakultas/jurusan.'
  - 'Blast email terjadwal dan ekspor data ke Excel untuk laporan dan evaluasi.'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Survei dinamis & logika lompat

Pertanyaan dengan tipe: pilihan ganda (single/multiple), esai, matriks, combo box. Question tree (trigger → pointer) untuk logika skip/conditional—disimpan di DB, bukan hanya di frontend. Status survei: draft, published, archived, closed.

### Responden alumni & atasan

Alumni per NIM, periode wisuda, jurusan; atasan (manager) per perusahaan. Autentikasi responden (PIN alumni, identitas atasan). Satu API melayani kedua jenis responden dengan aturan per degree/fakultas.

### RBAC admin & blast email

Admin dengan role per fakultas dan permission per resource/action. Blast email: jadwal kirim, template, status sent/failed untuk undangan dan pengingat. Import/ekspor data alumni (Excel).

### Ekspor data & dokumentasi API

Ekspor jawaban dan data survei ke Excel (ExcelJS/xlsx). Swagger untuk dokumentasi API; Google reCAPTCHA untuk antispam di client. Dependency injection (Awilix) di API untuk struktur domain per fitur.

---

## Konteks (Kenapa proyek ini ada)

**Proyek tugas besar.** Saya ingin membangun sistem tracer study lengkap untuk perguruan tinggi (konteks: Unand): survei yang diisi oleh alumni dan atasan (manager) dengan satu basis data, satu API, dan satu aplikasi web. Bukan sekadar form survey sederhana—tapi pengelolaan survei dinamis (berbagai tipe pertanyaan, logika lompat/conditional), manajemen responden (alumni per NIM, periode wisuda, jurusan; atasan per perusahaan), blast email (undangan, pengingat), serta ekspor data ke Excel.

**Lingkungan:** Proyek sistem informasi kampus / production-ready.

**Kenapa masalah ini muncul:** Tracer study wajib untuk akreditasi dan evaluasi; butuh satu platform yang mengelola banyak survei, banyak responden (alumni & atasan), aturan akses per fakultas/jurusan, dan laporan yang bisa diekspor.

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** Menyediakan API untuk survei dinamis (pertanyaan dengan tipe pilihan ganda, esai, matriks, combo box, logika skip/conditional), autentikasi responden (PIN alumni, identitas atasan), dan RBAC untuk admin (per fakultas, per izin).
- **Masalah operasional:** Import/ekspor data alumni (Excel), jadwal kirim email undangan/pengingat, dan status survei (draft, published, archived, closed).
- **Masalah pembelajaran:** Arsitektur terpisah API + client, dependency injection (Awilix), dan desain skema survei yang fleksibel (question tree, group question).

---

## Batasan

- **Keterampilan / pengalaman:** Stack yang sudah dikenal: Node.js, Express, Prisma, React, TypeScript; fokus satu codebase API dan satu codebase client.
- **Infrastruktur:** MySQL, deploy dengan Docker (API + DB); client di-build statis atau di-host terpisah.
- **Waktu:** Fitur inti: survei, responden, jawaban, blast email, ekspor; fitur tambahan (dashboard analitik, grafik) bisa menyusul.
- **Alat yang tersedia:** Prisma, ExcelJS/xlsx untuk ekspor, Swagger untuk dokumentasi API, Google reCAPTCHA untuk antispam; tanpa layanan email eksternal berat di v1 (bisa SMTP/nodemailer nanti).

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **API (Express + Prisma) + Client (React + Vite) terpisah** | Pemisahan jelas; client bisa diganti (misalnya mobile) tanpa ubah API. | Monolit full-stack (kurang fleksibel untuk banyak konsumen). |
| **Prisma + MySQL untuk survei & responden** | Relasi survei → pertanyaan → jawaban, responden → alumni/manager, aturan per degree; migrasi rapi. | MongoDB (kurang nyaman untuk relasi kaku), Sequelize. |
| **Awilix untuk dependency injection di API** | Struktur domain per fitur (gen:domain), controller/service terinjeksi; testing dan maintainability lebih baik. | Tanpa DI (require manual di tiap file). |
| **Tipe pertanyaan di enum (single/multiple choice, esai, matriks, combo)** | Skema tetap, validasi di satu tempat; frontend render komponen sesuai tipe. | Pertanyaan “bebas” JSON (lebih fleksibel tapi risiko inkonsistensi). |
| **Question tree (trigger → pointer) untuk logika lompat** | Pertanyaan bisa tampil bersyarat dari jawaban sebelumnya; disimpan di basis data, bukan hanya di frontend. | Semua pertanyaan linear (kurang ramah untuk survei panjang). |
| **RBAC: Admin → Role → Permission, Role per Faculty** | Admin bisa dibatasi per fakultas; permission per resource/action. | Satu role global (tidak cocok multi-fakultas). |
| **Blast email: jadwal kirim, template, status sent/failed** | Undangan dan pengingat terjadwal; bisa dipantau status kirim. | Kirim manual saja (kurang skalabel). |
| **Client: React 19 + Vite + Radix UI + TanStack Query** | Cepat, aksesibilitas (Radix), state server (React Query), TypeScript untuk kontrak dengan API. | Next.js (SSR tidak wajib untuk app survey), state global berat. |

---

## Trade-off dan Dampaknya

- **Dua repo (API + client):** Koordinasi versi dan deploy dua artefak; di sisi lain, tim bisa fokus per layer dan API bisa dipakai ulang (misalnya untuk integrasi lain).
- **Skema survei kompleks (question tree, group):** Migrasi dan validasi harus hati-hati; mengubah tipe pertanyaan bisa pengaruhi jawaban yang sudah ada.
- **Blast email in-process:** Jika daftar responden besar, proses kirim bisa lama; ke depan bisa pindah ke antrean job.
- **Ekspor Excel di API:** File besar bisa memakan memori; untuk sangat besar bisa streaming atau batas jumlah baris.
- **reCAPTCHA di client dan validasi di API:** Harus konsisten agar tidak ada bypass dari client; API tetap cek ulang jika perlu.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu API melayani survei, responden (alumni + manager), pertanyaan dinamis, jawaban, blast email, dan ekspor Excel; satu client untuk isi survei dan (di sisi admin) kelola survei & responden.
- Prisma + question tree memungkinkan survei dengan logika lompat tanpa mengubah kode.
- Awilix + skrip gen:domain membuat struktur domain API teratur dan bisa dikembangkan per fitur.
- Docker + docker-compose memudahkan jalankan API dan basis data di satu lingkungan.
- Swagger mendokumentasikan endpoint untuk tim atau integrasi.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Skema pertanyaan (question type, group, sort order, placeholder) banyak edge case; perlu uji coba berulang agar tampilan dan validasi cocok.
- Blast email tergantung ketersediaan SMTP dan rate limit; perlu penanganan gagal kirim dan retry.
- Perbedaan periode wisuda dan jurusan (S1, pasca, vokasi, profesi) harus konsisten di data alumni dan aturan survei.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Abstraksi pengiriman email:** Dari awal pisahkan “email sender” (interface) agar ganti SMTP ke layanan lain (SendGrid, dll.) tanpa ubah seluruh modul blast.
- **Validasi skema survei:** Tambah validasi di API (misalnya question tree tidak boleh circular, required question harus ada di halaman yang bisa dicapai).
- **Tes integrasi:** Tambah tes untuk alur kritis: buat survei → tambah pertanyaan → responden isi → jawaban tersimpan → ekspor.
- **Client: lazy load halaman survei:** Untuk survei dengan banyak pertanyaan, muat per halaman/group agar performa tetap enak.

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan membangun sistem survey skala kampus dengan dua lapisan (API + client), skema data yang fleksibel (pertanyaan dinamis, logika lompat, RBAC per fakultas), dan integrasi operasional (email, Excel). Pelajaran yang terbawa: **pemisahan API–client** memudahkan pengembangan paralel dan penggantian frontend; **desain skema survei** (question type, tree) butuh pemikiran sejak awal agar tidak refaktor besar; **blast email dan ekspor** mengajarkan penanganan operasi berat dan batasan resource (memori, waktu).

---

## Tautan Kode & Demo

**Repositori:**

- **API:** [github.com/howlil/tracer-survey-api](https://github.com/howlil/tracer-survey-api)
- **Client:** [github.com/howlil/tracer-survey-client](https://github.com/howlil/tracer-survey-client)

**Tumpukan teknologi:**

- **API:** Node.js, Express 5, Prisma (MySQL), Awilix, JWT, bcrypt, Joi, Multer, ExcelJS/xlsx, Google reCAPTCHA, Swagger, Winston. Docker, docker-compose.
- **Client:** React 19, TypeScript, Vite 7, Radix UI, TanStack Query, Zustand, Tailwind CSS, React Router, Axios, react-google-recaptcha, Sonner.

**Cara menjalankan di lokal:**

**API:**

```bash
git clone https://github.com/howlil/tracer-survey-api.git
cd tracer-survey-api
pnpm install
# Atur .env: DATABASE_URL, JWT_SECRET, RECAPTCHA, dll.
pnpm exec prisma migrate deploy
pnpm run db:seed   # opsional
pnpm run dev       # atau docker-compose up
```

**Client:**

```bash
git clone https://github.com/howlil/tracer-survey-client.git
cd tracer-survey-client
pnpm install
# Atur .env (VITE_*) untuk URL API
pnpm run dev
```

Dokumentasi API (Swagger) biasanya tersedia di `/api-docs` atau path yang dikonfigurasi di API.
