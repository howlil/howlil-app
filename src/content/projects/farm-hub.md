---
title: 'Farm Hub (Fish Farming Feasibility Analysis)'
type: 'hackathon'
date: '2024-12-15'
excerpt: 'Platform to analyze fish farming feasibility in West Sumatra. AI-powered (Google Gemini) summary and business plan plus supplier map, so aspiring farmers and investors can get started without consulting experts first.'
tags: ['React', 'TypeScript', 'Vite', 'FastAPI', 'Python', 'SQLModel', 'PostgreSQL', 'Google Gemini', 'Docker']
repository: 'https://github.com/kage-projects/farm-hub-client'
---

<!-- @format -->

## Problem Worth Solving

Fish farming needs capital planning, technical know-how, and market research. Beginners rarely have tools to check feasibility or get a structured plan. Expert consultations are expensive. DIY research is slow and not reusable. This hackathon was a chance to try AI: Gemini generates summaries and business plans, structured data for "go or no-go" and "how to run it." One platform for aspiring farmers and investors in West Sumatra.

## My Role & Ownership

I built the backend API: database schema (Project, RingkasanAwal, AnalisisFinancial, InformasiTeknis, Roadmap, Suplier, Produk), Google Gemini integration for generating summaries and plans, and deployment. Architecture and tech decisions were mine.

## Key Engineering Decision

- **FastAPI + SQLModel (PostgreSQL).** Fast, automatic OpenAPI docs. SQLModel combines model and schema for Pydantic, good for CRUD and validation. The team was more comfortable with Python. Django REST was considered; FastAPI felt lighter.

- **Separate models for generated output.** Project stores input. RingkasanAwal, AnalisisFinancial, InformasiTeknis, Roadmap store structured results for query and display. Suplier/Produk for the map. More tables, but cleaner than one big JSON blob. Easier to query.

- **Google Gemini for generation.** Prompts use input context, API key in env. Output quality depends on prompts. Latency and quota matter. If the API goes down, we fall back to default text or cache.

## One Hard Engineering Problem

Gemini's output was inconsistent. Scores, breakdowns, recommendations could come back in different shapes each call. A loose prompt gave vague or unstructured text. I designed fixed-format prompts (JSON or markdown with fixed sections) and parsed responses into our models (RingkasanAwal, AnalisisFinancial), with fallbacks when generation failed or format was invalid.

## Metrics & Impact

- Summary and plan in seconds instead of days of manual research.
- Supplier map gives location context for seed, feed, and market decisions.
- Flow from landing to input to generate to plan is clear and ready for post-hackathon iteration.

## What I'd Improve Next

- Stabilize Gemini prompts and output: clear template, parse into fixed structure (JSON/schema), fallback on failure.
- Integrate real supplier data for West Sumatra, store in Suplier/Produk with coordinates.
- Document the feasibility score logic so it can be verified.
- Export PDF for summary and plan once content is stable.

## Architecture

Stateless API with two repos (farm-hub-api, farm-hub-client). FastAPI receives project input (location, fish type, capital, risk), calls Gemini to generate, stores results in PostgreSQL. React client shows form, generated output, and supplier map. Docker Compose for API and DB.

## Failure & Risk Considerations

- Depends on Gemini. Fallback to default text or cache if API is down.
- Supplier data: map can use mock until dataset is ready.
- Feasibility score: hybrid rule-based and AI. Rules must be consistent so results are explainable.
- Two repos: breaking changes need coordination.
