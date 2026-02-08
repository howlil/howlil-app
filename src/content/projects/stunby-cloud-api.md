---
title: 'StunBy Cloud API (Bangkit Capstone)'
type: 'study-independent'
date: '2024-12-01'
excerpt: 'Platform untuk mendeteksi dan mencegah stunting: orang tua mencatat gizi dan pengukuran bayi, sistem memberi hasil IMT dan status gizi.'
tags: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Google Cloud Run', 'Terraform', 'Docker']
repository: 'https://github.com/StunBy-Bangkit-Capstone/cloud-api'
shortExplanation: 'Backend (Cloud API) untuk platform deteksi dan pencegahan stunting: orang tua mencatat asupan gizi dan pengukuran bayi; sistem menghitung kebutuhan gizi, IMT, z-score, dan status gizi (normal/stunting/obesitas). Deploy di Google Cloud Run dengan Terraform.'
projectGoals:
  - 'Mendukung pemantauan gizi dan pertumbuhan terstruktur untuk deteksi stunting.'
  - 'Menyediakan API untuk auth, pencatatan gizi & pengukuran, hasil analisis (IMT, z-score, status gizi), dan artikel edukasi.'
  - 'Integrasi cloud storage (GCS) untuk foto; siap dipakai client mobile/web dan (lewat dokumentasi) layanan ML.'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Autentikasi & profil user

Registrasi dan login (JWT). Profil user: email, nama, gender, tanggal lahir, foto (upload ke Cloud Storage). Relasi ke Measurement dan Nutrition untuk riwayat.

### Pencatatan gizi (nutrition) & hasil analisis

Input makanan (food_name, portion, date) → Nutrition_Result dengan calories, protein, fat, carbohydrate, calcium, notes. Riwayat gizi per user untuk pantau asupan.

### Pengukuran & hasil IMT / z-score

Pengukuran: berat badan, panjang bayi, tingkat aktivitas, status ASI, foto bayi. Hasil: Measurement_Result (kebutuhan kalori/protein/lemak/karbohidrat) dan IMT_Result (IMT, z-score BB/umur, panjang/umur, berat/tinggi; status gizi: NORMAL, STUNTING, OBESITAS).

### Artikel edukasi & cloud storage

Konten edukasi (artikel) dengan judul, konten, author, gambar. Foto profil, foto bayi, dan gambar artikel disimpan di GCP Cloud Storage (bucket); URL disimpan di DB.

---

## Konteks (Kenapa proyek ini ada)

**Proyek studi independen (Bangkit).** StunBy adalah proyek **Capstone Bangkit** yang bertujuan mendukung deteksi dan pencegahan stunting: pengguna (orang tua atau pengasuh) mencatat asupan gizi (makanan, porsi, tanggal) dan pengukuran (berat badan, panjang bayi, tingkat aktivitas, status ASI, foto bayi). Sistem menyimpan data, menghitung kebutuhan kalori/protein/lemak/karbohidrat, dan menghasilkan **hasil IMT serta z-score** (berat badan/umur, panjang/umur, berat/tinggi) sesuai standar pertumbuhan; status gizi diklasifikasi menjadi normal, stunting, atau obesitas. Konten edukasi disediakan lewat artikel. Backend ini menjadi **Cloud API** yang melayani autentikasi, CRUD gizi & pengukuran, integrasi cloud storage (foto profil, foto bayi, gambar artikel), dan (melalui dokumentasi) integrasi dengan model ML. Deploy di **Google Cloud Run** dengan CI/CD GitHub Actions dan infrastruktur Terraform.

**Lingkungan:** Proyek Capstone Bangkit (tim StunBy-Bangkit-Capstone); satu repositori backend. Production-ready dengan deploy ke GCP.

**Kenapa masalah ini muncul:** Stunting butuh pemantauan gizi dan pertumbuhan yang terstruktur; satu API yang mengelola user, pencatatan gizi, pengukuran, hasil analisis (IMT, z-score, status gizi), dan aset (foto) memudahkan aplikasi mobile/web konsumen memakai layanan yang sama.

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** API untuk registrasi dan login (JWT), CRUD profil user (termasuk upload foto), pencatatan nutrition (food_name, portion, date) dan hasil analisis gizi (calories, protein, fat, carbohydrate, calcium, notes), pengukuran (weight, baby_length, level_activity, status_asi, baby_photo) dan hasil (Measurement_Result: kebutuhan kalori/protein/lemak/karbohidrat; IMT_Result: IMT, z-score, status gizi), serta artikel. Integrasi **cloud storage** (GCS bucket) untuk menyimpan foto.
- **Masalah operasional:** Migrasi basis data (Prisma), seed data (user, artikel), dan deploy otomatis ke Cloud Run saat push ke main.
- **Masalah pembelajaran:** Arsitektur backend untuk platform kesehatan (stunting); relasi User → Measurement → IMT_Result & Measurement_Result, User → Nutrition → Nutrition_Result; dokumentasi API dan ML untuk tim/konsumer.

---

## Batasan

- **Keterampilan / konteks:** Capstone Bangkit; stack Node.js, Express, Prisma (PostgreSQL); deploy di Google Cloud (Cloud Run); infrastruktur as code (Terraform).
- **Infrastruktur:** PostgreSQL (bisa Cloud SQL atau managed); Cloud Storage bucket untuk file; Cloud Run untuk menjalankan container API.
- **Waktu:** Fokus fitur inti: auth, gizi, pengukuran, hasil IMT/z-score, artikel, upload; integrasi dengan layanan ML (model prediksi/analisis) didokumentasikan di `docs/` (api-ml.md).
- **Alat yang tersedia:** Prisma, JWT, bcrypt, Joi, Multer (upload), Axios (panggil layanan lain jika perlu), Helmet, Winston; Terraform untuk GCP; GitHub Actions untuk CI/CD.

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Prisma + PostgreSQL** | Relasi User–Nutrition–Nutrition_Result, User–Measurement–Measurement_Result & IMT_Result, dan Articles butuh skema relasional yang jelas; migrasi Prisma rapi. | MySQL (konsisten dengan proyek lain), MongoDB (relasi kaku kurang nyaman). |
| **Model Measurement + IMT_Result + Measurement_Result** | Satu pengukuran punya hasil kebutuhan gizi (calories_needed, protein_needed, dll.) dan hasil IMT (z-score BB/TB, panjang bayi, status gizi); cocok untuk alur “input pengukuran → hitung → simpan hasil”. | Satu tabel “result” JSON (kurang terstruktur untuk query dan validasi). |
| **Status gizi: NORMAL, STUNTING, OBESITAS (enum)** | Klasifikasi standar untuk komunikasi ke user dan laporan; konsisten dengan indikator stunting. | Status bebas teks (risiko inkonsistensi). |
| **Nutrition + Nutrition_Result** | Satu input gizi (makanan, porsi, tanggal) punya satu hasil analisis (kalori, protein, lemak, karbohidrat, kalsium, catatan); memudahkan riwayat dan tampilan. | Hasil embedded di Nutrition (kurang fleksibel jika format hasil berubah). |
| **Cloud Storage (CLOUD_STORAGE_BUCKET)** | Foto profil, foto bayi, dan gambar artikel disimpan di GCP bucket; URL disimpan di DB. Sesuai arsitektur “backend di Cloud Run, aset di bucket”. | Upload ke disk server (tidak skalabel, hilang saat replika). |
| **Rute publik vs privat (publicRouter, apiRoute)** | Endpoint login/register dan mungkin health bersifat publik; endpoint user, nutrition, measurement, artikel memakai auth. | Satu router dengan middleware auth per rute (lebih verbose). |
| **Deploy: GitHub Actions → Cloud Run** | Push main memicu build dan deploy; konsisten dengan praktik Bangkit/GCP. | Deploy manual, atau platform lain. |
| **Terraform** | Infrastruktur (project, bucket, Cloud Run, IAM) sebagai code; memudahkan reproduksi dan review. | Konfigurasi manual di konsol GCP. |
| **Helmet + CORS + error & log middleware** | Keamanan header, kontrol origin, dan penanganan error serta log yang terpusat. | Tanpa helmet (risiko header lemah), tanpa requestId (sulit debug). |

---

## Trade-off dan Dampaknya

- **Perhitungan IMT dan z-score:** Bisa dilakukan di API (rule-based) atau oleh layanan ML terpisah; jika di ML, API hanya menyimpan input dan menerima hasil (dokumentasi api-ml.md). Sinkronisasi format request/response harus jelas.
- **Upload ke GCS:** Perlu konfigurasi IAM dan bucket; di development bisa mock atau bucket terpisah. URL publik atau signed URL tergantung kebijakan akses.
- **Terraform dan CI/CD:** Tim harus familiar dengan Terraform dan secret/env di GitHub; perubahan infra lewat PR agar terdokumentasi.
- **Artikel (typo `constent` di schema):** Field `constent` seharusnya `content`; bisa diperbaiki lewat migrasi. Tidak mengubah alur bisnis.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu backend melayani auth, profil user, pencatatan gizi & hasil gizi, pengukuran & hasil IMT/z-score/status gizi, serta artikel; siap diintegrasikan dengan client (mobile/web) dan layanan ML.
- Prisma + PostgreSQL memudahkan migrasi dan relasi; seed untuk artikel (seed-article) mendukung konten awal.
- Deploy ke Cloud Run dengan GitHub Actions memudahkan rilis; Terraform memudahkan pengaturan GCP (bucket, Cloud Run).
- Dokumentasi di `docs/` (API dan ML) memudahkan koordinasi dengan tim frontend dan ML.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Nama kolom typo (`constent`) di model Articles perlu migrasi perbaikan.
- Integrasi nyata dengan layanan ML (endpoint, auth, format) harus dijaga konsisten dengan api-ml.md; jika ML belum production, API bisa jalan dengan hasil placeholder atau rule-based dulu.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Perbaiki schema Articles:** Rename `constent` → `content` lewat migrasi Prisma.
- **Validasi input pengukuran:** Batasan weight, baby_length, date_measure agar sesuai logika IMT/z-score; validasi di level aplikasi atau di ML.
- **Abstraksi storage:** Layer “StorageProvider” (local vs GCS) agar development tidak wajib pakai bucket; production tetap pakai GCS.
- **Tes integrasi:** Alur register → login → create measurement → get result; dan upload foto → URL tersimpan.

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan membangun **backend platform kesehatan** (fokus stunting) dengan model data yang terstruktur (gizi, pengukuran, hasil IMT/z-score, status gizi), integrasi **cloud storage**, dan deploy ke **Google Cloud Run** dengan **Terraform** dan **CI/CD**. Nilai untuk portofolio: kolaborasi dalam tim Capstone Bangkit; pemisahan rute publik vs privat dan middleware error/log; dokumentasi API dan ML untuk integrasi multi-layanan.

---

## Tautan Kode & Demo

**Repositori:** [github.com/StunBy-Bangkit-Capstone/cloud-api](https://github.com/StunBy-Bangkit-Capstone/cloud-api)

**Tumpukan teknologi:** Node.js, Express 4, Prisma 5 (PostgreSQL), JWT, bcrypt, Joi, Multer, Axios, Helmet, CORS, Winston, cookie-parser, morgan, dayjs. Docker, Terraform (GCP), GitHub Actions (deploy ke Cloud Run).

**Fitur utama:**

- **Autentikasi:** Registrasi, login, token-based auth.
- **User:** Profil (email, full_name, gender, birth_day, foto_url); relasi ke Measurement dan Nutrition.
- **Nutrition:** Pencatatan makanan (food_name, portion, date) → Nutrition_Result (calories, proteins, fats, carbohydrates, calciums, notes).
- **Measurement:** Pengukuran (weight, date_measure, level_activity, status_asi, baby_photo_url) → Measurement_Result (kebutuhan kalori/protein/lemak/karbohidrat), IMT_Result (IMT, z-score, status gizi, status_bb_tb, dll.).
- **Status gizi:** NORMAL, STUNTING, OBESITAS (enum).
- **Articles:** Konten edukasi (title, content, author, article_img_url).
- **Cloud:** Integrasi Cloud Storage (bucket) untuk foto; deploy di Cloud Run.

**Cara menjalankan di lokal:**

```bash
git clone https://github.com/StunBy-Bangkit-Capstone/cloud-api.git
cd cloud-api
npm install
# Atur .env: DATABASE_URL, SECRET_KEY (JWT), PORT, CLOUD_STORAGE_BUCKET (opsional untuk dev)
npx prisma migrate dev
npm run seed          # opsional
npm run seed-article  # opsional
npm run dev
```

Server default: `http://localhost:3000` (atau PORT di .env). Dokumentasi API dan ML: lihat folder `docs/` (api-docs, api-ml, api-cc). Deploy: push ke `main` memicu GitHub Actions dan deploy ke Google Cloud Run; infrastruktur via Terraform di folder `terraform/`.
