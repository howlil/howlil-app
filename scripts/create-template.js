#!/usr/bin/env node

/**
 * Create Content Template — Blog, Projects, Shorts
 *
 * PROJECT TEMPLATE — 6 Main + Deep Dive (English, human voice)
 * Main: Problem Worth Solving | My Role & Ownership | Key Engineering Decision |
 *       One Hard Engineering Problem | Metrics & Impact | What I'd Improve Next
 * Deep Dive (optional): System Scope, Architecture, Core Highlights, Failure & Risk, Tech Stack
 *
 * Write like a student developer: natural flow, first person, technical but accessible.
 * Avoid: "I designed and implemented", "architecture decisions were mine", repetitive Trade-off lists.
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

/**
 * BLOG TEMPLATES — 4 types for EM-focused writing
 * Rule: 1 article = 1 real situation = 1 thinking pattern. Never mix templates.
 *
 * 1. Engineering Decisions — when you must CHOOSE (sync vs async, monolith vs microservices, etc.)
 * 2. Failure & Recovery — when something FAILED or almost failed (bug prod, data inconsistency, etc.)
 * 3. System Shape & Taste — when you REFUSE to build (reject feature, simplify, remove abstraction)
 * 4. Wisdom & Long-term — when you look BACK honestly (refactor, regret, advice to others)
 */

const BLOG_TYPES = {
    decisions: {
        name: 'Engineering Decisions Under Reality (40–50%)',
        useWhen: 'Must choose sync vs async, monolith vs services, library A vs B, fast now vs scalable later',
        emLooksFor: 'Aware of real constraints (time, team, skill, infra). Not dogmatic. Knows when this decision will fail.',
    },
    failure: {
        name: 'Failure, Risk, and Recovery (20–25%)',
        useWhen: 'Bug in prod, data inconsistency, async job stuck, wrong security assumption, silent failure',
        emLooksFor: 'Honest about mistakes. Understands blast radius. Thinks prevention, not bandaid.',
    },
    taste: {
        name: 'System Shape & Taste (15–20%)',
        useWhen: 'Deliberately not adding feature, simplifying, removing abstraction, refusing premature optimization',
        emLooksFor: 'Engineering taste. Can say no. Understands complexity cost.',
    },
    wisdom: {
        name: 'Wisdom & Long-term Thinking (10–15%)',
        useWhen: 'System has run a while, refactoring something you were proud of, realizing old decision was costly',
        emLooksFor: 'Learns over time. Aware of long-term cost. Can mentor others.',
    },
};

function generateBlogTemplateDecisions(fileName, title) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
date: '${date}'
category: 'Engineering'
excerpt: 'One sentence: the decision you made and why it mattered.'
tags: ['engineering', 'decision-making']
coverImage: '/images/blog/${slug}.jpg'
---

<!-- @format -->

<!-- USE: When you must CHOOSE (sync vs async, monolith vs services, library A vs B, fast now vs scalable later) -->
<!-- EM wants: constraint awareness, not dogmatic, knows when this decision will fail -->
<!-- 1 article = 1 situation = 1 pattern. Don't mix with Failure/Taste/Wisdom. -->

## The Situation

What was the real context? Deadline, team size, skill level, infra limits. Make the constraint concrete—not "we had to move fast" but "we had 2 weeks and one backend engineer."

## Options I Considered

What were the choices? A vs B. Don't list 5 options; 2–3 is enough. For each: what it would have given us, what it would have cost.

## What I Chose and Why

The actual decision. The reasoning. What drove it: time, risk, simplicity, maintainability? Be specific.

## The Constraints That Drove It

Explicitly name what limited you: budget, timeline, team, infra, vendor lock-in. This shows you're not dogmatic—you made a choice under reality.

## When This Decision Would Fail

Honest answer: under what conditions would you reverse this? Traffic 10x? Team 5x? Different compliance requirements? This is what EMs look for—you know the boundaries.

## Takeaway

One short lesson. Not "I learned a lot." Something concrete others can use when facing similar constraints.

`;
}

function generateBlogTemplateFailure(fileName, title) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
date: '${date}'
category: 'Engineering'
excerpt: 'One sentence: what went wrong and what we did about it.'
tags: ['failure', 'incident', 'recovery']
coverImage: '/images/blog/${slug}.jpg'
---

<!-- @format -->

<!-- USE: When something FAILED or almost failed (bug prod, data inconsistency, stuck job, wrong security assumption) -->
<!-- EM wants: honesty about mistakes, blast radius understanding, prevention over bandaid -->
<!-- 1 article = 1 situation = 1 pattern. Don't mix with Decisions/Taste/Wisdom. -->

## What Happened

Describe the incident plainly. No hero framing. What broke, when, and how did we notice? If we almost didn't notice, say that—silent failures matter.

## Root Cause

What actually caused it? Not "the system was complex" but the specific chain: X led to Y led to Z. Be precise.

## Blast Radius

Who or what was affected? How long? How bad? EMs want to see you understand impact, not just fix the bug.

## What We Did (Short-term)

Immediate fix: rollback, patch, manual correction. Keep it brief. This isn't the main story.

## What We Changed (Long-term)

Prevention. What did we add: idempotency, validation, monitoring, circuit breaker? Why that, not something else? Focus on system impact, not "I learned to test more."

## Takeaway

One concrete lesson. What would you do differently if you saw this pattern again? Something others can apply.

`;
}

function generateBlogTemplateTaste(fileName, title) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
date: '${date}'
category: 'Engineering'
excerpt: 'One sentence: what we didn\'t build and why that was the right call.'
tags: ['architecture', 'simplicity', 'taste']
coverImage: '/images/blog/${slug}.jpg'
---

<!-- @format -->

<!-- USE: When you REFUSE to build (reject feature, simplify, remove abstraction, refuse premature optimization) -->
<!-- EM wants: engineering taste, can say no, understands complexity cost -->
<!-- 1 article = 1 situation = 1 pattern. Don't mix with Decisions/Failure/Wisdom. -->

## What We Could Have Built

The "obvious" or "proper" solution. The generic workflow engine, the five-table design, the config-in-database, the extensible plugin system. Describe it briefly.

## Why We Didn't

The real reason. Not "we didn't have time" but the cost we avoided: maintenance burden, cognitive load, failure modes. What would that abstraction have hidden? What would it have made harder?

## What We Did Instead

The "enough" we chose. One table, a config file, a hardcoded flow. Be explicit. This is the taste part—knowing when simple is right.

## The Complexity We Avoided

What problems did we not have to solve? What bugs did we not introduce? What onboarding did we not have to write? Concrete, not vague.

## Takeaway

One lesson about saying no or choosing simple. Something that helps others push back on over-engineering.

`;
}

function generateBlogTemplateWisdom(fileName, title) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
date: '${date}'
category: 'Engineering'
excerpt: 'One sentence: what changed in your thinking after time passed.'
tags: ['reflection', 'long-term', 'advice']
coverImage: '/images/blog/${slug}.jpg'
---

<!-- @format -->

<!-- USE: When you look BACK honestly (system ran a while, refactoring old pride, realizing old decision was costly) -->
<!-- EM wants: learns over time, aware of long-term cost, can mentor others -->
<!-- 1 article = 1 situation = 1 pattern. Don't mix with Decisions/Failure/Taste. -->

## What I Did (Back Then)

The decision, the abstraction, the feature you built. Describe it as you would have back then. No hindsight yet.

## What I Thought Then

Your reasoning at the time. "I thought X would scale." "I thought we'd need Y." Be honest—you were wrong about something, and that's the point.

## What I Know Now

What changed. The hidden cost, the maintenance burden, the case we never hit. How long did it take to realize? What triggered the realization?

## What I'd Do Differently

Concrete advice. If you were starting over or advising someone in the same spot, what would you say? Not "test more" but something specific: "don't abstract until you have 3 use cases," "keep config in files until someone asks for UI."

## Takeaway

One lesson that spans time. Something that helps others avoid the same delay or cost.

`;
}

function generateBlogTemplate(fileName, title, blogType = 'decisions') {
    const generators = {
        decisions: generateBlogTemplateDecisions,
        failure: generateBlogTemplateFailure,
        taste: generateBlogTemplateTaste,
        wisdom: generateBlogTemplateWisdom,
    };
    const gen = generators[blogType] || generators.decisions;
    return gen(fileName, title);
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

/**
 * Generate project template — 6 Main + Architecture + Failure & Risk
 * English, human voice, flowing like a student writing about their work
 */
function generateProjectTemplate(fileName, title, projectType) {
    const date = getCurrentDate();
    const slug = slugify(fileName || title);

    return `---
title: '${title}'
type: '${projectType}'
date: '${date}'
excerpt: 'One sentence: what problem and what the system does.'
tags: ['tag1', 'tag2']
coverImages: ['/images/projects/${slug}-1.jpg', '/images/projects/${slug}-2.jpg']
# Optional links
# liveSite: 'https://...'
# repository: 'https://github.com/...'
# videoDemo: 'https://youtube.com/...'
---

<!-- @format -->

## Problem Worth Solving

What real problem did users or the system face? Why did manual process fail? Why wasn't existing stuff enough? Write as a story—flow, objective, focus on *why* not *what*.

## My Role & Ownership

What did you build—schema, flows, integrations? Keep it natural: "I built...", "I handled...". No bullet-heavy lists; write in paragraphs.

## Key Engineering Decision

Pick 3–5 technical decisions that mattered most. For each: what you chose, why, and the downside you knew. Weave trade-offs into the text instead of repeating "Trade-off:" every time. Less jargon, more reasoning.

## One Hard Engineering Problem

One hard technical problem. What was it, why did the simple approach fail, what did you do instead and why. 4–6 sentences. Focus on reasoning, not hero story.

## Metrics & Impact

What actually changed—ops (manual → automated), reliability, risk reduction, scalability. Rational estimate beats empty claims. Write flowing.

## What I'd Improve Next

3 realistic things you'd do differently—observability, dead-letter queue, caching, layer abstraction, integration tests. No vague ambition.

## Architecture

High-level architecture in plain language; main components and data flow.

## Failure & Risk Considerations

What can fail and how you limit impact—webhook duplicate, job failure, cron overlap. Concrete mitigations.

`;
}

async function main() {
    console.log('\n🚀 Create Content Template\n');

    const contentType = await question('Pilih jenis konten (blog/projects/shorts): ');

    const validTypes = ['blog', 'projects', 'shorts'];
    if (!validTypes.includes(contentType.toLowerCase())) {
        console.error('❌ Jenis konten harus "blog", "projects", atau "shorts"');
        rl.close();
        process.exit(1);
    }

    const title = await question('Masukkan judul: ');

    if (!title.trim()) {
        console.error('❌ Judul tidak boleh kosong');
        rl.close();
        process.exit(1);
    }

    const fileName = await question('Masukkan nama file (tanpa ekstensi, kosongkan untuk auto-generate dari judul): ');

    let finalFileName = fileName.trim() || slugify(title);
    finalFileName = slugify(finalFileName);

    let projectType = 'side-project';
    let blogType = 'decisions';

    if (contentType.toLowerCase() === 'projects') {
        const typeInput = await question('Pilih tipe project (side-project/production/work/academic/hackathon) [default: side-project]: ');
        const validProjectTypes = ['side-project', 'production', 'work', 'academic', 'hackathon', 'study-independent', 'contribution'];
        if (typeInput.trim() && validProjectTypes.includes(typeInput.trim())) {
            projectType = typeInput.trim();
        }
    }

    if (contentType.toLowerCase() === 'blog') {
        console.log('\n📌 Pilih template blog (EM-focused):');
        console.log('  1) Engineering Decisions — saat Anda harus MEMILIH (sync vs async, monolith vs microservices)');
        console.log('  2) Failure & Recovery — saat sesuatu GAGAL atau hampir gagal');
        console.log('  3) System Shape & Taste — saat Anda MENOLAK membangun sesuatu');
        console.log('  4) Wisdom & Long-term — saat Anda MELIHAT KE BELAKANG dengan jujur');
        const blogInput = await question('Pilih (1-4) [default: 1]: ');
        const blogMap = { '1': 'decisions', '2': 'failure', '3': 'taste', '4': 'wisdom' };
        if (blogInput.trim() && blogMap[blogInput.trim()]) {
            blogType = blogMap[blogInput.trim()];
        }
        console.log(`   → ${BLOG_TYPES[blogType].name}\n`);
    }

    let template;
    let filePath;

    if (contentType.toLowerCase() === 'blog') {
        template = generateBlogTemplate(finalFileName, title, blogType);
        filePath = join(rootDir, 'src', 'content', 'blog', `${finalFileName}.md`);
    } else if (contentType.toLowerCase() === 'shorts') {
        template = generateShortsTemplate(finalFileName, title);
        filePath = join(rootDir, 'src', 'content', 'shorts', `${finalFileName}.md`);
    } else {
        template = generateProjectTemplate(finalFileName, title, projectType);
        filePath = join(rootDir, 'src', 'content', 'projects', `${finalFileName}.md`);
    }

    if (existsSync(filePath)) {
        const overwrite = await question(`⚠️  File ${finalFileName}.md sudah ada. Overwrite? (y/n): `);
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
            console.log('❌ Dibatalkan.');
            rl.close();
            process.exit(0);
        }
    }

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
