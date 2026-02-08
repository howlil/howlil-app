#!/usr/bin/env node

/**
 * Create Content Template — Blog, Projects, Shorts
 *
 * PROJECT ARTICLE TEMPLATES (pilih satu per artikel):
 * - standard          : Context, Responsibility, Architecture, Key Challenges, Outcomes, Link (portfolio CV style)
 * - engineering-decision : Engineering Decision Log — Context, Problem, Constraints, Decisions, Trade-offs,
 *                         What Worked/Didn't, What I'd Do Differently, Why This Matters (nilai portofolio tinggi)
 *
 * TOOLBOX 12 TEMPLATE (referensi; 1 artikel = 1 template utama):
 *  1. Learning Log           — Exploration (Starting Point, What Confused Me, What I Understood, What's Unclear, Next Questions)
 *  2. Engineering Decision   — Keputusan teknis (Context, Problem, Constraints, Options, Decision, Trade-offs)
 *  3. Trade-off Deep Dive    — Tension antara 2 opsi (Option A/B, What Matters, When This Choice Fails)
 *  4. Post-Mortem           — Setelah gagal (What I Tried, What Broke, Root Cause, Fix, Prevention)
 *  5. System Mental Model    — Konsep abstrak (Confusion, Simplified Model, Where Model Breaks)
 *  6. Constraint-Driven Design — Batasan mendefinisikan solusi (Constraints, Implications, Ruled Out, Final Shape)
 *  7. Minimalism & Scope    — Sengaja tidak membangun (Temptations, Why No, When I'd Add Back)
 *  8. Evolution/Refactoring  — Sistem berubah (Initial, Pain, Trigger, New Design, Trade-offs)
 *  9. Comparative Case      — Dua pendekatan (Same Problem, A vs B, Lessons)
 * 10. Tooling Rationale     — Pilih alat (Workflow Pain, Options, Criteria, Long-Term Cost)
 * 11. Security & Risk       — Ancaman, asumsi, mitigasi, residual risk
 * 12. What I'd Tell Past Me — Refleksi (What I Thought, Learned, Cost, Advice)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function generateBlogTemplate(fileName, title) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
date: '${date}'
category: 'Technology'
excerpt: 'Deskripsi singkat artikel Anda di sini.'
tags: ['tag1', 'tag2']
coverImage: '/images/blog/${slug}.jpg'
---

<!-- @format -->

Tulis konten artikel Anda di sini...

## Section 1

Konten section pertama...

## Section 2

Konten section kedua...

`;
}

function generateShortsTemplate(fileName, title) {
    const date = getCurrentDate();

    return `---
title: '${title}'
date: '${date}'
category: 'Tips'
excerpt: 'Deskripsi singkat snippet Anda di sini.'
tags: ['tag1', 'tag2']
---

<!-- @format -->

## TL;DR

Ringkasan singkat...

## Detail

Konten teknikal Anda di sini...

\`\`\`bash
# Contoh kode
echo "Hello World"
\`\`\`

## Tips

> **Pro tip:** Tambahkan tips penting di sini!

`;
}

function generateProjectTemplate(fileName, title, projectType) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
type: '${projectType}'
date: '${date}'
excerpt: 'Deskripsi singkat project Anda di sini.'
tags: ['tag1', 'tag2']
coverImages: ['/images/projects/${slug}-1.jpg', '/images/projects/${slug}-2.jpg']
# Optional links (hapus atau isi)
# liveSite: 'https://...'
# repository: 'https://github.com/...'
# videoDemo: 'https://youtube.com/...'
shortExplanation: 'Satu atau dua kalimat yang menjelaskan apa project ini dan untuk siapa.'
projectGoals:
  - 'Tujuan utama 1'
  - 'Tujuan utama 2'
---

<!-- @format -->

## Fitur

Gunakan sub-header (###) untuk tiap fitur dan jelaskan dengan detail di bawahnya.

### Fitur 1: [Nama fitur]

Penjelasan detail fitur ini: apa yang bisa dilakukan pengguna, alur singkat, dan hal teknis yang relevan.

### Fitur 2: [Nama fitur]

Penjelasan detail fitur ini...

### Fitur 3: [Nama fitur]

Penjelasan detail fitur ini...

---

## Context

**Purpose:** 
Tujuan utama dari project ini...

**Domain:** 
Domain atau area bisnis yang dituju...

**Audience:** 
Target pengguna atau audience...

**Constraints:** 
- Scale: 
- Budget: 
- Latency: 

## Responsibility

Apa yang Anda build atau own dalam project ini:

- **Endpoints:** 
- **DB Schema:** 
- **Background Workers:** 
- **Infrastructure:** 

## Architecture

**Stack:**
- Technology stack yang digunakan...

**Components:**
- Komponen utama...

**Diagram:**
\`\`\`
[Diagram atau penjelasan arsitektur]
Service boundaries, data flow, storage
\`\`\`

## Key Challenges & Solutions

### Challenge 1: [Nama Challenge]

**Problem:** 
Penjelasan masalah...

**Solution:** 
Solusi yang diimplementasikan...

**Trade-offs:** 
Trade-off yang dibuat...

### Challenge 2: [Nama Challenge]

**Problem:** 
Penjelasan masalah...

**Solution:** 
Solusi yang diimplementasikan...

**Trade-offs:** 
Trade-off yang dibuat...

## Measurable Outcomes

**Metrics:**
- Requests/sec: 
- Latency percentiles (p50, p95, p99): 
- Cost changes: 
- Deployment frequency: 
- Uptime: 
- Error rate: 

## Link to Code & Demo

**Repository:** 
[Link ke GitHub/GitLab]

**Demo:** 
[Link ke demo atau hosted endpoint]

**How to run locally:**
\`\`\`bash
# Instruksi untuk menjalankan project secara lokal
\`\`\`

**Credentials (if needed):**
- Username: 
- Password: 

`;
}

function generateProjectTemplateEngineeringDecision(fileName, title, projectType) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
type: '${projectType}'
date: '${date}'
excerpt: 'Deskripsi singkat project—satu kalimat konteks dan nilai yang ditunjukkan.'
tags: ['tag1', 'tag2']
coverImages: ['/images/projects/${slug}-1.jpg', '/images/projects/${slug}-2.jpg']
# Optional links (hapus atau isi)
# liveSite: 'https://...'
# repository: 'https://github.com/...'
# videoDemo: 'https://youtube.com/...'
shortExplanation: 'Satu atau dua kalimat yang menjelaskan apa project ini dan untuk siapa.'
projectGoals:
  - 'Tujuan utama 1'
  - 'Tujuan utama 2'
---

<!-- @format -->
<!-- Template: Engineering Decision Log -->

## Fitur

Gunakan sub-header (###) untuk tiap fitur dan jelaskan dengan detail di bawahnya.

### Fitur 1: [Nama fitur]

Penjelasan detail: apa yang bisa dilakukan pengguna, alur, dan hal teknis yang relevan.

### Fitur 2: [Nama fitur]

Penjelasan detail...

---

## Konteks (Kenapa proyek ini ada)

Kondisi awal, lingkungan (personal/kerja/eksperimen), dan kenapa masalah ini muncul.

---

## Masalah yang Ingin Diselesaikan

Satu masalah inti: teknis, operasional, atau pembelajaran.

---

## Batasan

- Skill / pengalaman
- Infrastruktur
- Waktu
- Tool yang tersedia

---

## Keputusan yang Diambil (dan Alasannya)

| Keputusan | Alasan | Alternatif yang dipertimbangkan |
|-----------|--------|----------------------------------|
| ... | ... | ... |

---

## Trade-off dan Dampaknya

Apa yang jadi lebih rumit, apa yang dikorbankan, risiko yang disadari.

---

## Yang Berhasil, Yang Tidak

- Yang berhasil
- Yang menyebalkan / tidak sesuai ekspektasi

---

## Yang Akan Dilakukan Berbeda Lain Kali

Perubahan pendekatan, penyederhanaan, hal yang akan ditunda.

---

## Mengapa Ini Penting

Nilai jangka panjang—pelajaran yang terbawa ke project lain (bukan cuma fitur).

---

## Link to Code & Demo

**Repository:** 
**Demo:** 
\`\`\`bash
# How to run locally
\`\`\`

`;
}

async function main() {
    console.log('\n🚀 Create Content Template\n');

    // Ask for content type
    const contentType = await question('Pilih jenis konten (blog/projects/shorts): ');

    const validTypes = ['blog', 'projects', 'shorts'];
    if (!validTypes.includes(contentType.toLowerCase())) {
        console.error('❌ Jenis konten harus "blog", "projects", atau "shorts"');
        rl.close();
        process.exit(1);
    }

    // Ask for title
    const title = await question('Masukkan judul: ');

    if (!title.trim()) {
        console.error('❌ Judul tidak boleh kosong');
        rl.close();
        process.exit(1);
    }

    // Ask for file name
    const fileName = await question('Masukkan nama file (tanpa ekstensi, kosongkan untuk auto-generate dari judul): ');

    let finalFileName = fileName.trim() || slugify(title);
    finalFileName = slugify(finalFileName); // Ensure it's a valid slug

    // For projects, ask for type and template style
    let projectType = 'side-project';
    let projectTemplateStyle = 'standard';
    if (contentType.toLowerCase() === 'projects') {
        const typeInput = await question('Pilih tipe project (side-project/production/contribution/hackathon) [default: side-project]: ');
        const validTypes = ['side-project', 'production', 'contribution', 'hackathon'];
        if (typeInput.trim() && validTypes.includes(typeInput.trim())) {
            projectType = typeInput.trim();
        }
        const styleInput = await question('Template artikel: standard | engineering-decision [default: standard]: ');
        if (styleInput.trim() === 'engineering-decision') {
            projectTemplateStyle = 'engineering-decision';
        }
    }

    // Generate template
    let template;
    let filePath;

    if (contentType.toLowerCase() === 'blog') {
        template = generateBlogTemplate(finalFileName, title);
        filePath = join(rootDir, 'src', 'content', 'blog', `${finalFileName}.md`);
    } else if (contentType.toLowerCase() === 'shorts') {
        template = generateShortsTemplate(finalFileName, title);
        filePath = join(rootDir, 'src', 'content', 'shorts', `${finalFileName}.md`);
    } else {
        template = projectTemplateStyle === 'engineering-decision'
            ? generateProjectTemplateEngineeringDecision(finalFileName, title, projectType)
            : generateProjectTemplate(finalFileName, title, projectType);
        filePath = join(rootDir, 'src', 'content', 'projects', `${finalFileName}.md`);
    }

    // Check if file already exists
    if (existsSync(filePath)) {
        const overwrite = await question(`⚠️  File ${finalFileName}.md sudah ada. Overwrite? (y/n): `);
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
            console.log('❌ Dibatalkan.');
            rl.close();
            process.exit(0);
        }
    }

    // Write file
    try {
        writeFileSync(filePath, template, 'utf-8');
        console.log(`\n✅ Template berhasil dibuat: ${filePath}`);
        console.log(`\n📝 File: ${finalFileName}.md`);
        console.log(`📂 Lokasi: src/content/${contentType.toLowerCase()}/`);
    } catch (error) {
        console.error('❌ Error saat membuat file:', error.message);
        rl.close();
        process.exit(1);
    }

    rl.close();
}

main().catch((error) => {
    console.error('❌ Error:', error);
    rl.close();
    process.exit(1);
});

