---
title: 'Farm Hub (Analisis Kelayakan Budidaya Ikan)'
type: 'hackathon'
date: '2024-12-15'
excerpt: 'Membantu calon peternak atau investor menilai kelayakan proyek budidaya ikan di Sumatra Barat dan mendapat ringkasan serta rencana pelaksanaan.'
tags: ['React', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'SQLModel', 'PostgreSQL', 'Google Gemini', 'Docker']
repository: 'https://github.com/kage-projects/farm-hub-client'
shortExplanation: 'Platform analisis kelayakan budidaya ikan (nila, lele, patin, gurame, dll.) di Sumatra Barat untuk calon peternak dan investor—dengan generate ringkasan dan rencana lengkap berbasis AI (Google Gemini) serta peta supplier.'
projectGoals:
  - 'Membantu calon peternak/investor menilai kelayakan proyek budidaya ikan tanpa harus ahli dulu.'
  - 'Generate ringkasan kelayakan (skor, potensi pasar, estimasi modal, ROI) dan rencana pelaksanaan terstruktur.'
  - 'Menyediakan peta supplier (bibit, pakan, pasar, peralatan) untuk mendukung keputusan.'
---

<!-- @format -->
<!-- Template: Log Keputusan Rekayasa - Proyek Hackathon -->

## Fitur

### Input project & generate ringkasan

Pengguna mengisi data lokasi (kota/kabupaten, alamat, koordinat), jenis ikan, modal investasi, dan tingkat risiko. Sistem menghasilkan ringkasan kelayakan (skor 0–100, potensi pasar, estimasi modal, ROI) dengan integrasi Google Gemini.

### Rencana lengkap (spesifikasi & roadmap)

Setelah ringkasan, sistem generate rencana lengkap: spesifikasi teknis kolam & bibit, tahapan pelaksanaan (roadmap), breakdown modal & operasional, proyeksi pendapatan.

### Peta supplier

Peta supplier untuk bibit, pakan, pasar, dan peralatan di Sumatra Barat—dengan data terstruktur untuk mendukung keputusan pemilihan supplier.

---

## Konteks (Kenapa proyek ini ada)

**Proyek hackathon.** Dalam konteks hackathon, kami ingin membangun solusi yang langsung bisa dipakai: **analisis kelayakan proyek budidaya ikan** (ikan, udang, lobster) di Sumatra Barat. Pengguna (calon peternak atau investor) mengisi data: lokasi (kota/kabupaten, alamat, koordinat), jenis ikan (nila, lele, patin, gurame, mas, dll.), modal investasi, dan tingkat risiko (rendah/sedang/tinggi). Sistem lalu **generate ringkasan** (skor kelayakan 0–100, potensi pasar, estimasi modal, ROI, kesimpulan) dan **rencana lengkap** (spesifikasi teknis kolam & bibit, tahapan pelaksanaan/roadmap, breakdown modal & operasional, proyeksi pendapatan, peta supplier bibit/pakan/pasar). Tujuannya: satu platform yang membantu keputusan “layak atau tidak” dan “bagaimana menjalankan” tanpa harus ahli dulu.

**Lingkungan:** Proyek hackathon (kage-projects); dua repositori: **farm-hub-api** (backend), **farm-hub-client** (frontend). Batas waktu membatasi fitur ke alur inti: input → generate ringkasan → generate rencana → peta supplier.

**Kenapa masalah ini muncul:** Budidaya ikan butuh perencanaan modal, teknis, dan pasar; calon pemain sering tidak punya tools untuk cek kelayakan dan rencana terstruktur. Hackathon jadi momentum untuk proof-of-concept dengan AI (generate teks) dan data terstruktur.

---

## Masalah yang Ingin Diselesaikan

- **Masalah teknis:** API untuk auth (user), CRUD project, generate ringkasan (skor, pasar, modal, ROI) dan rencana lengkap (spesifikasi, roadmap, analisis finansial) — dengan integrasi **Google Gemini** untuk generate narasi/rekomendasi; plus data supplier (bibit, pakan, pasar, peralatan) dan peta.
- **Masalah operasional:** Input dari user harus konsisten (lokasi, jenis ikan, modal, risk level); output generate harus bisa disimpan (Project, RingkasanAwal, AnalisisFinancial, InformasiTeknis, Roadmap) dan ditampilkan di client.
- **Masalah pembelajaran:** FastAPI + SQLModel (Python) di sisi API; React + Chakra v3 + tema custom (ocean glassmorphism) di client; koordinasi dua repo dalam waktu terbatas.

---

## Batasan

- **Waktu hackathon:** Fitur prioritas: auth, input project, generate ringkasan, generate rencana, tampilan peta supplier; fitur sekunder (download PDF, simulasi detail) bisa disederhanakan atau mock.
- **Stack:** Python (FastAPI, SQLModel, Pydantic) untuk API; React, TypeScript, Vite untuk client; PostgreSQL; Google Generative AI (Gemini) untuk generate konten.
- **Tim:** Dua repo (API + client); dokumentasi fungsional (FUNCTIONAL_SPECIFICATION.md) dipakai sebagai kontrak fitur dan halaman.
- **Alat yang tersedia:** SQLModel (ORM + schema), python-jose + passlib (JWT, bcrypt), google-generativeai, Docker & docker-compose; di client: Chakra UI v3, Tailwind v4, React Router v7.

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| **FastAPI + SQLModel (PostgreSQL)** | API cepat, dokumentasi OpenAPI otomatis; SQLModel menggabungkan model + schema Pydantic, cocok untuk CRUD dan validasi. | Django REST, Node.js (waktu tim lebih familiar Python). |
| **Model: User, Project, RingkasanAwal, AnalisisFinancial, InformasiTeknis, Roadmap, Suplier, Produk** | Project menyimpan input; RingkasanAwal dan AnalisisFinancial menyimpan hasil generate; InformasiTeknis & Roadmap untuk rencana teknis dan tahapan; Suplier/Produk untuk peta supplier. | Satu tabel “result” JSON (kurang terstruktur untuk query). |
| **Google Gemini untuk generate** | Generate ringkasan dan rencana (teks, rekomendasi) memakai prompt + konteks input; API key di env. | Rule-based saja (kurang fleksibel), model lain (OpenAI). |
| **Tiga modul rute: user, project, supplier** | Auth (login/register); project (CRUD, trigger generate); supplier (data untuk peta). | Satu file routes (susah maintain). |
| **Client: React 19 + Vite 7 + Chakra UI v3 + Tailwind v4** | Cepat, komponen aksesibel; tema kustom (ocean, glassmorphism) membedakan tampilan. | Next.js (SSR tidak wajib untuk MVP), UI library lain. |
| **Tema ocean / aquatic + glassmorphism** | Konsisten dengan “marine aquaculture”; glassmorphism (blur, transparansi) memberi identitas visual kuat untuk demo. | Tema generic (kurang memorable). |
| **Spesifikasi fungsional (FUNCTIONAL_SPECIFICATION.md)** | Satu dokumen untuk daftar halaman, form, flow, dan data model; memudahkan pembagian tugas dan penilaian juri. | Tanpa doc (risiko miss fitur). |
| **Docker Compose untuk API + DB** | Satu perintah untuk jalankan API dan PostgreSQL; mengurangi “tidak jalan di mesin saya”. | Install manual (risiko env beda-beda). |

---

## Trade-off dan Dampaknya

- **Generate bergantung Gemini:** Kualitas output tergantung prompt dan konteks; latency dan quota API perlu diperhitungkan; fallback jika API down bisa teks default atau cache.
- **Data supplier:** Jika belum ada dataset lengkap, peta supplier bisa pakai data sampel atau mock; integrasi data real bisa fase berikutnya.
- **Dua repo:** Perlu sinkronisasi endpoint dan model data; FUNCTIONAL_SPECIFICATION dan README membantu, tapi breaking change harus dikomunikasikan.
- **Skor kelayakan dan angka:** Logic perhitungan (skor, ROI, payback) bisa hybrid: rule-based (angka) + AI (narasi); rule harus konsisten agar hasil bisa dijelaskan ke user.

---

## Yang Berhasil, Yang Tidak

**Yang berhasil:**

- Alur dari landing → login/register → dashboard → input project → generate ringkasan → generate rencana (ringkasan, spesifikasi teknis, roadmap, modal, peta supplier) terdefinisi jelas di spesifikasi dan diimplementasikan di client.
- API FastAPI dengan struktur app (config, database, models, routes, controllers, service, schemas) rapi; integrasi Gemini untuk generate memberi nilai “AI” yang cocok untuk hackathon.
- Client punya design system (ocean theme, glassmorphism, WCAG AA) dan komponen reusable (navbar, form, card, table, modal, dll.) yang siap dipakai di halaman fitur.
- Docker memudahkan demo: jalankan API + DB, lalu client arahkan ke URL API.

**Yang menyebalkan / tidak sesuai ekspektasi:**

- Dalam waktu terbatas, semua halaman (terutama plan dengan banyak submenu dan chart) bisa belum 100% terisi data real; beberapa pakai placeholder atau mock.
- Prompt Gemini perlu iterasi agar output stabil dan sesuai format (skor, breakdown, rekomendasi); tanpa tuning, hasil bisa terlalu umum atau tidak konsisten.
- Peta supplier butuh data geografis dan kategori (bibit, pakan, pasar, peralatan); jika dataset belum siap, peta bisa kosong atau demo saja.

---

## Yang Akan Dilakukan Berbeda Lain Kali

- **Stabilkan prompt & output Gemini:** Template prompt yang jelas, parsing response ke struktur tetap (JSON/schema), dan fallback jika generate gagal.
- **Dataset supplier nyata:** Integrasi dengan sumber data supplier (bibit, pakan, pasar) di Sumatra Barat atau scraping/API; simpan di Suplier/Produk dengan koordinat.
- **Logic skor kelayakan yang terdokumentasi:** Rumus skor (lokasi, jenis ikan, modal, risiko) ditulis jelas agar bisa diverifikasi dan dijelaskan ke user.
- **Export PDF ringkasan/rencana:** Setelah konten generate stabil, tambah export PDF dari halaman summary/plan.

---

## Mengapa Ini Penting (Nilai Hackathon)

Proyek ini menunjukkan kemampuan **mendesain alur produk lengkap** (input → analisis → rencana → peta) dalam batas waktu hackathon, dengan **integrasi AI (Gemini)** untuk generate konten dan **dua stack** (Python API + React client). Nilai untuk portofolio: **spesifikasi fungsional yang jelas** memudahkan koordinasi tim dan penilaian; **tema UI yang konsisten** (ocean, glassmorphism) membuat demo mudah diingat; **pemisahan API–client** memungkinkan pengembangan paralel dan reuse API untuk client lain (misalnya mobile).

---

## Tautan Kode & Demo

**Repositori:**

- **API:** [github.com/kage-projects/farm-hub-api](https://github.com/kage-projects/farm-hub-api)
- **Client:** [github.com/kage-projects/farm-hub-client](https://github.com/kage-projects/farm-hub-client)

**Tumpukan teknologi:**

- **API:** Python 3.9+, FastAPI, SQLModel, Pydantic, Pydantic-Settings, PostgreSQL (psycopg2-binary), python-jose (JWT), passlib/bcrypt, google-generativeai (Gemini), python-dotenv, uvicorn. Docker, Docker Compose.
- **Client:** React 19, TypeScript 5, Vite 7, Chakra UI v3, Tailwind CSS v4, React Router v7. Ocean-themed glassmorphism, WCAG AA, dark mode.

**Fitur utama (spesifikasi):**

- Landing, Login, Register → Dashboard (list project).
- Input project: lokasi (Sumatra Barat, kota, alamat), jenis ikan, modal, tingkat risiko → Simpan draft / Generate ringkasan.
- Halaman ringkasan: skor kelayakan, potensi pasar, estimasi modal, ROI, kesimpulan → Generate rencana lengkap.
- Rencana lengkap: Ringkasan, Spesifikasi teknis (kolam, bibit, pakan, peralatan), Tahapan pelaksanaan (roadmap), Modal (awal, operasional, pendapatan, ROI), Peta supplier (bibit, pakan, pasar, peralatan).

**Cara menjalankan di lokal:**

**API:**

```bash
git clone https://github.com/kage-projects/farm-hub-api.git
cd farm-hub-api
# Buat venv, install: pip install -e . atau sesuai pyproject.toml
# Atur .env: DATABASE_URL (PostgreSQL), Gemini/Google API key, JWT secret, dll.
# Init DB: panggil init_db() atau migrate
uvicorn main:app --host 0.0.0.0 --port 5000
# Atau: docker-compose up
```

**Client:**

```bash
git clone https://github.com/kage-projects/farm-hub-client.git
cd farm-hub-client
pnpm install
# Atur .env (VITE_*) untuk URL API
pnpm run dev
```

Dokumentasi fungsional: [farm-hub-client/FUNCTIONAL_SPECIFICATION.md](https://github.com/kage-projects/farm-hub-client/blob/main/FUNCTIONAL_SPECIFICATION.md) — daftar halaman, form, flow, data model, dan komponen UI.
