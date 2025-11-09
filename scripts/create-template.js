#!/usr/bin/env node

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
---

<!-- @format -->

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

async function main() {
    console.log('\n🚀 Create Content Template\n');

    // Ask for content type
    const contentType = await question('Pilih jenis konten (blog/projects): ');

    if (contentType.toLowerCase() !== 'blog' && contentType.toLowerCase() !== 'projects') {
        console.error('❌ Jenis konten harus "blog" atau "projects"');
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

    // For projects, ask for type
    let projectType = 'side-project';
    if (contentType.toLowerCase() === 'projects') {
        const typeInput = await question('Pilih tipe project (side-project/production/contribution/hackathon) [default: side-project]: ');
        const validTypes = ['side-project', 'production', 'contribution', 'hackathon'];
        if (typeInput.trim() && validTypes.includes(typeInput.trim())) {
            projectType = typeInput.trim();
        }
    }

    // Generate template
    let template;
    let filePath;

    if (contentType.toLowerCase() === 'blog') {
        template = generateBlogTemplate(finalFileName, title);
        filePath = join(rootDir, 'src', 'content', 'blog', `${finalFileName}.md`);
    } else {
        template = generateProjectTemplate(finalFileName, title, projectType);
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

