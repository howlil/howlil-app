---
title: 'GoHealth (Tracking Kesehatan & Gizi)'
type: 'academic'
date: '2024-11-01'
excerpt: 'Aplikasi untuk mencatat makanan, aktivitas, dan berat badan serta memantau target gizi harian dengan pengingat.'
tags: ['Flutter', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Firebase', 'FCM', 'Google OAuth']
repository: 'https://github.com/howlil/gohealth-api'
shortExplanation: 'Aplikasi tracking kesehatan dan gizi multi-platform (Flutter): catat makanan dari katalog, aktivitas fisik, riwayat BMI, target berat badan dan nutrisi harian, dengan notifikasi push (FCM) saat capaian kalori dan pengingat makan.'
projectGoals:
  - 'Memberi pengguna satu tempat untuk mencatat makanan, aktivitas, dan berat badan serta memantau target gizi harian.'
  - 'Mengirim notifikasi push (FCM) saat capaian kalori 90–110%, pengingat makan, dan update progres berat.'
  - 'Menyediakan API yang bisa dipakai web atau client lain (auth email + Google, meal log, aktivitas, BMI, target, notifikasi).'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa -->

## Fitur

### Autentikasi & profil

Registrasi, login email/password, dan Google OAuth. Profil pengguna: nama, usia, gender, tinggi, berat, tingkat aktivitas, foto—sebagai dasar perhitungan kebutuhan gizi dan BMI.

### Pencatatan makanan (meal log)

Katalog makanan (protein, lemak, karbohidrat, kalori) dari data terstruktur; log per tipe makan (sarapan/makan siang/makan malam/camilan) dengan porsi dan tanggal. Total gizi harian dihitung otomatis.

### Aktivitas fisik & rencana latihan

Tipe aktivitas dengan nilai MET; log aktivitas (durasi, intensitas, kalori terbakar). Rencana latihan (ActivityPlan) dengan jadwal per hari untuk bantu kebiasaan olahraga.

### BMI & target berat badan

Riwayat pengukuran tinggi–berat, perhitungan BMI, dan status (underweight/normal/overweight/obese). Target berat badan (start/target, tanggal) dan target nutrisi harian (kalori, protein, karbohidrat, lemak, serat) per effective date.

### Notifikasi push (FCM)

Notifikasi disimpan di DB dan dikirim via Firebase Cloud Messaging: capaian kalori 90–110%, pengingat makan, progres berat, update BMI. Endpoint untuk update/delete FCM token per device.

---

## Konteks (Kenapa proyek ini ada)

**Proyek tugas besar.** Saya ingin membangun aplikasi **tracking kesehatan dan gizi** yang bisa dipakai sehari-hari: pengguna mendaftar (email/password atau Google OAuth), mengatur profil (usia, gender, tinggi, berat, tingkat aktivitas), lalu mencatat **makanan** (pilih dari katalog makanan dengan data protein, lemak, karbohidrat, kalori), **aktivitas fisik** (jenis, durasi, kalori terbakar), **BMI** (riwayat tinggi–berat dan status underweight/normal/overweight/obese), **target berat badan**, dan **target nutrisi harian** (kalori, protein, karbohidrat, lemak, serat). Sistem mengirim **notifikasi push** (Firebase Cloud Messaging) saat capaian kalori harian 90–110%, pengingat makan, dan update progres berat. Backend (API) dan client (app Flutter) terpisah agar API bisa dipakai oleh web atau client lain nanti.

**Lingkungan:** Proyek production; dua repositori: **gohealth-api** (backend), **gohealth-app** (Flutter, multi-platform). Deploy API dengan PM2; GitHub Actions untuk CI/CD.

**Kenapa masalah ini muncul:** Banyak orang ingin pantau asupan gizi dan aktivitas tanpa aplikasi berat; satu API yang mengelola user, makanan, meal log, aktivitas, BMI, target, dan notifikasi memberi fondasi untuk app yang konsisten dan bisa dikembangkan (misalnya integrasi dengan wearable atau data eksternal).

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** API untuk auth (registrasi, login, Google OAuth), CRUD profil, katalog makanan (dari file JSON lokal), meal logging (tipe makan, tanggal, porsi, total gizi), aktivitas (tipe, durasi, kalori terbakar, rencana latihan), BMI record, weight goal, daily nutrition target, dan notifikasi (simpan + kirim FCM). Validasi input (Joi/Yup/express-validator) dan rate limit.
- **Masalah operasional:** Data makanan dari `data.json` (bukan API eksternal) agar tidak bergantung FatSecret/third-party; FCM token disimpan per user; notifikasi otomatis saat kalori harian 90–110%, meal reminder, weight goal progress.
- **Masalah pembelajaran:** Relasi User → UserMeal, BMIRecord, WeightGoal, DailyNutritionTarget, UserActivity, ActivityPlan, Notification; integrasi Passport (Google + JWT) dan Firebase Admin (FCM); Flutter dengan Dio, provider, Firebase Auth & Messaging, dan SQLite (cache/offline).

---

## Batasan

- **Keterampilan / pengalaman:** Node.js, Express, Prisma (MySQL) untuk API; Flutter untuk app; fokus dua repo (api + app).
- **Infrastruktur:** MySQL untuk API; upload profil di server (folder uploads/profile); Firebase untuk auth (opsional di app) dan FCM.
- **Waktu:** Fitur inti: auth, meal, aktivitas, BMI, weight goal, nutrition target, notifikasi; makanan dari JSON (bisa diganti ke DB/API lain nanti).
- **Alat yang tersedia:** Prisma, JWT, Passport (Google OAuth20, JWT), bcrypt, Firebase Admin, Multer, Swagger (swagger-jsdoc, swagger-ui-express), Helmet, express-rate-limit, Winston; di Flutter: Dio, provider, go_router, Firebase, sqflite (cache).

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **Prisma + MySQL** | Relasi User–Meal–Food–Activity–BMI–Goal–Target–Notification jelas; migrasi rapi. | PostgreSQL (konsisten dengan proyek lain), MongoDB. |
| **Food & FoodCategory dari data.json** | Katalog makanan dengan protein, lemak, karbohidrat, kalori diisi dari file; tidak bergantung FatSecret/API eksternal. Bisa di-seed ke DB. | API pihak ketiga (rate limit, biaya). |
| **UserMeal dengan mealType (BREAKFAST/LUNCH/DINNER/SNACK)** | Satu log makan punya tipe, tanggal, quantity, unit, dan total gizi (dihitung dari Food × quantity). | Hanya satu “meal” tanpa tipe (kurang analisis per waktu makan). |
| **ActivityType (MET value) + UserActivity** | Jenis aktivitas punya MET; durasi & intensity dipakai hitung kalori terbakar. ActivityPlan + PlannedActivity untuk jadwal latihan. | Tanpa rencana latihan (hanya log). |
| **BMIRecord + status (UNDERWEIGHT/NORMAL/OVERWEIGHT/OBESE)** | Riwayat BMI per user; status untuk tampilan dan notifikasi. | Hanya hitung sekali (tanpa riwayat). |
| **WeightGoal + DailyNutritionTarget** | Target berat (start/target, tanggal) dan target nutrisi harian (kalori, protein, dll.) per effectiveDate; isActive untuk satu target aktif. | Tanpa target (hanya log). |
| **Notification + FCM** | Notifikasi disimpan di DB (type, title, body, isRead, isSent); FCM untuk push. Tipe: capaian kalori, pengingat makan, progres berat, BMI update, dll. | Hanya in-app (tanpa push). |
| **Auth: JWT + Google OAuth (Passport)** | Login email/password atau Google; token JWT untuk request API. | Hanya email/password (kurang opsi). |
| **Flutter + Dio + provider + Firebase** | Satu codebase untuk Android, iOS, web, desktop; Dio untuk HTTP; provider untuk state; Firebase Auth & Messaging untuk login dan push. | React Native (satu codebase mobile), atau dua app (native). |
| **Swagger (swagger-jsdoc + swagger-ui-express)** | Dokumentasi API di `/api-docs`; kontrak untuk tim dan integrasi. | Dokumentasi manual (Markdown). |
| **PM2 + GitHub Actions** | Production run dengan PM2; CI/CD untuk build dan deploy. | Deploy manual. |

---

## Trade-off dan Dampaknya

- **Data makanan dari JSON:** Update katalog harus lewat file atau seed; tidak real-time dari sumber eksternal. Untuk banyak item, migrasi ke tabel Food/FoodCategory yang di-seed dari JSON atau import CSV masuk akal.
- **FCM token per user:** Satu token per device; jika user ganti device, token lama bisa invalid. Endpoint update/delete token memungkinkan sinkronisasi.
- **Notifikasi otomatis (90–110% kalori, reminder):** Butuh job terjadwal (cron) atau trigger setelah meal log; jika belum ada cron, notifikasi bisa dipicu on-demand (setelah log makan).
- **Flutter + Supabase di pubspec:** Jika API mandiri (bukan Supabase), Supabase bisa dipakai hanya untuk auth atau fitur tambahan; konfigurasi env (base URL API vs Supabase) harus jelas.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Satu API melayani auth (email + Google), profil, makanan, meal log, aktivitas & rencana latihan, BMI, weight goal, nutrition target, dan notifikasi (simpan + FCM).
- Model Prisma lengkap: User, Food, UserMeal, ActivityType, UserActivity, ActivityPlan, BMIRecord, WeightGoal, DailyNutritionTarget, Notification; enum untuk meal type, activity type, BMI status, notification type.
- Dokumentasi API lewat Swagger memudahkan testing dan integrasi dengan Flutter.
- Flutter app punya struktur (lib, context), dependency network (Dio), auth (Firebase), push (FCM, flutter_local_notifications), dan local storage (shared_preferences, secure_storage, sqflite) untuk offline/cache.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Perhitungan kalori terbakar (MET × durasi × berat) dan logika “90–110% target kalori” harus konsisten di API; notifikasi harus di-trigger di waktu yang tepat (cron atau event).
- service_account.json (Firebase) tidak boleh masuk repo; harus di env atau secret di server.
- Jika katalog makanan besar, data.json bisa berat; pertimbangkan seed ke DB sekali lalu CRUD Food lewat admin.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Cron atau queue untuk notifikasi:** Job terjadwal (mis. tiap jam) cek capaian kalori harian dan kirim notifikasi 90–110%; meal reminder per jadwal user.
- **Migrasi Food ke DB:** Seed dari data.json ke tabel Food/FoodCategory; endpoint CRUD Food untuk admin; app tetap pakai API list food.
- **Validasi FCM token:** Cek token valid sebelum kirim; hapus token yang gagal (invalid/expired).
- **Tes integrasi:** Alur login → set target → log meal → cek ringkasan harian → trigger notifikasi (mock).

---

## Mengapa Ini Penting

Proyek ini menunjukkan kemampuan membangun **aplikasi kesehatan/gizi lengkap** dengan **dua lapisan** (API + Flutter): auth (email + Google), meal tracking dengan katalog makanan, aktivitas fisik & rencana latihan, BMI & target berat, target nutrisi harian, dan **notifikasi push (FCM)**. Nilai untuk portofolio: integrasi **Passport (Google OAuth + JWT)** dan **Firebase Admin (FCM)**; model data yang terstruktur untuk health domain; **Flutter multi-platform** dengan state management dan layanan Firebase; dokumentasi API dengan Swagger.

---

## Tautan Kode & Demo

**Repositori:**

- **API:** [github.com/howlil/gohealth-api](https://github.com/howlil/gohealth-api)
- **App (Flutter):** [github.com/howlil/gohealth-app](https://github.com/howlil/gohealth-app)

**Tumpukan teknologi:**

- **API:** Node.js, Express 5, Prisma 6 (MySQL), JWT, bcrypt, Passport (google-oauth20, jwt), express-validator, Joi, Yup, Firebase Admin (FCM), Multer, Swagger (swagger-jsdoc, swagger-ui-express), Helmet, express-rate-limit, Winston, Axios. PM2 (ecosystem.config.js), GitHub Actions.
- **App:** Flutter, Dart 3.2+, go_router, provider, Dio, http, connectivity_plus, shared_preferences, flutter_secure_storage, sqflite (cache), flutter_screenutil, cached_network_image, image_picker, fl_chart, Supabase Flutter, Firebase (core, auth, messaging), flutter_local_notifications, logger, flutter_dotenv. Target: Android, iOS, web, Windows, Linux, macOS.

**Fitur utama:**

- **Auth:** Registrasi, login, Google OAuth; profil (nama, usia, gender, tinggi, berat, activity level, foto).
- **Makanan:** Katalog dari data.json (protein, lemak, karbohidrat, kalori); meal log (tipe makan, tanggal, porsi, total gizi); makanan favorit.
- **Aktivitas:** Tipe aktivitas (MET), log aktivitas (durasi, kalori terbakar, intensitas), rencana latihan (plan + jadwal per hari).
- **BMI:** Riwayat pengukuran (tinggi, berat, BMI, status); ringkasan gizi per histori (opsional).
- **Target:** Target berat badan (start/target, tanggal); target nutrisi harian (kalori, protein, karbohidrat, lemak, serat per effectiveDate).
- **Notifikasi:** Simpan di DB; push via FCM (capaian kalori 90–110%, pengingat makan, progres berat, BMI update, dll.). Endpoint: PUT/DELETE FCM token.

**Cara menjalankan di lokal:**

**API:**

```bash
git clone https://github.com/howlil/gohealth-api.git
cd gohealth-api
npm install
# .env: DATABASE_URL, JWT_SECRET, GOOGLE_* (OAuth), FOOD_DATA_FILE_PATH, FIREBASE_SERVICE_ACCOUNT_PATH
# Letakkan data.json dan service_account.json
npx prisma migrate dev
npm run seed    # opsional
npm run dev     # atau npm start / pm2 start ecosystem.config.js
```

Swagger: `http://localhost:3000/api-docs` (atau PORT di .env).

**App:**

```bash
git clone https://github.com/howlil/gohealth-app.git
cd gohealth-app
flutter pub get
# Atur .env dan api.yml (base URL API)
flutter run
```

Dokumentasi API lengkap: lihat README gohealth-api dan endpoint Swagger. Push notifications: FCM token di-update lewat `PUT /api/users/fcm-token`, notifikasi dikirim saat capaian kalori, meal reminder, dan progres weight goal.
