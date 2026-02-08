---
title: 'GoHealth (Health & Nutrition Tracking)'
type: 'academic'
date: '2024-11-01'
excerpt: 'Multi-platform health and nutrition tracker: log meals, activities, weight, daily nutrition targets. Push notifications (FCM) when hitting 90–110% calorie goal and meal reminders.'
tags: ['Flutter', 'Node.js', 'Express', 'Prisma', 'MySQL', 'Firebase', 'FCM', 'Google OAuth']
repository: 'https://github.com/howlil/gohealth-api'
---

<!-- @format -->

## Problem Worth Solving

Manual meal and activity logging (paper or spreadsheets) does not scale and is easy to forget. Existing apps are often fragmented: food log only, activity only, or no separate API for integration. We needed one API to handle users, foods, meal logs, activities, BMI, nutrition targets, and notifications. A base for a consistent app that could grow (wearables, external data). Plus push notifications when calorie intake hits 90–110% of target and meal reminders.

## My Role & Ownership

I built the backend API: database schema (User, Food, UserMeal, ActivityType, UserActivity, ActivityPlan, BMIRecord, WeightGoal, DailyNutritionTarget, Notification), flows (meal log, nutrition calculation, activity, BMI, target, notifications), Passport (Google OAuth + JWT), Firebase Admin (FCM) integration, Swagger docs, and PM2 deployment. Architecture and tech choices were mine.

## Key Engineering Decision

- **Prisma + MySQL.** Relations between User, Meal, Food, Activity, BMI, Goal, Target, Notification are clear. Migrations are straightforward. Enums for meal type, activity type, BMI status, notification type. PostgreSQL would have been fine too; we went with MySQL for hosting consistency.

- **Food from data.json, not a third-party API.** No dependency on FatSecret (rate limits, cost). Seed into DB when needed. Downside: updating the catalog means editing a file or re-seeding. No real-time external source.

- **Notification + FCM.** Notifications stored in DB (type, title, body, isRead, isSent) and sent via FCM for push. Types: calorie goal 90–110%, meal reminder, weight progress, BMI update. FCM token per user. Old tokens invalid when device changes. Endpoints to update/delete tokens keep things in sync.

- **Auth: JWT + Google OAuth (Passport).** Login with email/password or Google. JWT for API requests. Requires Google OAuth and Firebase service account config. service_account.json must never be in the repo.

## One Hard Engineering Problem

Calorie burn (MET × duration × weight) and the "90–110% target calories" logic had to live in the API. Notifications had to fire at the right moment. Triggering notifications on every meal log would spam and get timing wrong. I designed the flow: daily nutrition computed in API (from UserMeal per date), compare with DailyNutritionTarget, trigger notification when 90–110% reached. Via cron or on-demand. FCM tokens stored per user and updated via PUT/DELETE so we do not send to invalid tokens.

## Metrics & Impact

- One place for food log and daily nutrition targets.
- Push notifications when hitting 90–110% and meal reminders help people stick to tracking.
- Separate API allows web or other clients. Swagger makes testing easy.
- Flutter multi-platform (Android, iOS, web, desktop) for wider reach.

## What I'd Improve Next

- Cron or queue for notifications: scheduled job to check daily calorie achievement and send 90–110% notifications. Meal reminders per user schedule.
- Migrate Food to DB: seed from data.json into Food/FoodCategory. Admin CRUD for foods.
- Validate FCM tokens: check validity before send, remove failed tokens.
- Integration tests for login, set target, log meal, daily summary, notification trigger.

## Architecture

Stateless API with two repos (gohealth-api, gohealth-app). Express + Prisma (MySQL) handles auth, profile, food catalog, meal log, activity, BMI, nutrition targets, and notifications (store + send FCM). Flutter client consumes API via Dio. Food data from local JSON (can be seeded to DB).

## Failure & Risk Considerations

- Food from JSON: update via file or seed. For larger catalogs, migrating to Food table makes sense.
- FCM token: one per device. Mitigate with update/delete endpoints.
- Automatic notifications: need cron or trigger. On-demand works if no cron yet.
- service_account.json: FIREBASE_SERVICE_ACCOUNT_PATH in env.
