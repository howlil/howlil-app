---
title: 'Git Rebase vs Merge: Kapan Pakai Yang Mana?'
date: '03-02-2026'
category: 'Git'
excerpt: 'Quick guide untuk memilih antara git rebase dan git merge.'
tags: ['git', 'version-control', 'tips']
---

<!-- @format -->

## TL;DR

- **Merge**: Untuk branch publik/shared, preserve history
- **Rebase**: Untuk branch lokal/feature, clean linear history

## Kapan Pakai Merge

```bash
git checkout main
git merge feature-branch
```

✅ Gunakan merge ketika:
- Branch sudah di-push ke remote
- Bekerja dengan tim lain di branch yang sama
- Ingin preserve complete history

## Kapan Pakai Rebase

```bash
git checkout feature-branch
git rebase main
```

✅ Gunakan rebase ketika:
- Branch masih lokal (belum push)
- Ingin linear history yang bersih
- Update feature branch dengan perubahan dari main

## Golden Rule

> **Jangan pernah rebase branch yang sudah di-share dengan orang lain!**

Rebase mengubah commit history. Kalau orang lain sudah pull branch tersebut, mereka akan punya masalah saat sync.

## Visual Comparison

**Merge:**
```
      A---B---C feature
     /         \
D---E---F---G---H main
```

**Rebase:**
```
              A'--B'--C' feature
             /
D---E---F---G main
```
