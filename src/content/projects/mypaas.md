---
title: 'MyPaaS'
type: 'side-project'
date: '2026-08-25'
excerpt: 'Single-host PaaS for Git and OCI deployments with rollback, backups, Caddy routing, and explicit runtime boundaries.'
summary: 'A self-hosted deployment control plane that turns one Linux host into a repeatable Git/OCI application platform without pretending to be a multi-node scheduler.'
caseStudySummary:
  problem: 'Deploying small self-hosted applications repeatedly still requires source inspection, build/runtime orchestration, routing, logs, rollback, and persistent state management.'
  decision: 'Keep the product deliberately single-host, make deployment modes explicit, and centralize lifecycle operations behind one Go control plane while leaving application capacity and isolation limits visible.'
  result: 'Git repositories and public OCI images can be deployed, inspected, rolled back, backed up, and operated through one platform with reproducible boundaries instead of per-project shell procedures.'
tags: ['Go', 'SvelteKit', 'PostgreSQL', 'Caddy', 'Podman', 'Docker', 'REST API']
repository: 'https://github.com/howlil/MyPaas'
featured: true
featuredRank: 1
role: 'Product engineer / platform owner'
engineeringFocus: ['Deployment orchestration', 'Runtime boundaries', 'Rollback and recovery']
verifiedEvidence:
  - 'Supports Git deployments through Dockerfile, Docker Compose, and static output, plus public OCI image deployment.'
  - 'Provides deployment history, logs, metrics, restart, redeploy, rollback, backup/restore, audit logs, CLI, API, webhooks, and Caddy routing.'
  - 'Fresh supported hosts use rootful Podman by default, with Docker Engine retained as a compatibility mode.'
---

## The problem

Running a few applications on one Linux server is easy until deployment becomes a system rather than a command. Each project starts to need the same operational work: inspect the repository, choose a build path, build an artifact, start a runtime, route traffic, expose logs, preserve data, recover from a bad release, and clean up old images safely.

MyPaaS turns that repeated work into one self-hosted control plane. The product is intentionally scoped to a single host and an owner developer or small trusted team. That boundary matters: it keeps the system useful without implying Kubernetes-style scheduling, hostile multi-tenant isolation, or capacity guarantees that the host cannot provide.

## Make deployment modes explicit

A repository can enter the platform through three Git-backed paths: Dockerfile, Docker Compose, or static output. Public OCI images are a fourth source.

That split avoids a common PaaS failure mode where repository detection becomes a hidden build system with too many guesses. Automatic inspection is useful for the ordinary case, but Dockerfile and Compose remain explicit escape hatches when an application needs to own its runtime contract.

Static projects bypass a container runtime and are served directly by Caddy. Container-backed projects run through the configured engine. The platform owns lifecycle orchestration; the application still owns its own resource behavior.

## Control plane and runtime boundary

The control plane is a Go API backed by PostgreSQL. Caddy is the public routing layer, while Podman is the default fresh-host container engine and Docker remains a compatibility mode.

The important design choice is separation of concerns:

- project metadata and deployment history belong to the control plane;
- application containers remain replaceable runtime instances;
- Caddy owns public routing;
- databases and project volumes remain explicit persistent resources;
- static releases are served without forcing them through a container abstraction.

This makes failure easier to reason about. A failed build is different from a failed runtime start, which is different from a routing failure, which is different from durable data loss.

## Recovery is part of deployment

A deployment platform is not complete when it can only move forward. MyPaaS keeps deployment history and exposes redeploy, restart, rollback, backup, restore/migration tooling, and image/cache retention.

Those features are treated as normal lifecycle operations rather than emergency scripts. The same principle applies to observability: logs and metrics are part of operating a project, not a separate afterthought.

Optional PostgreSQL provisioning and DB Studio Lite extend the platform without making a database mandatory for every project.

## Deliberate non-goals

MyPaaS does not claim that a particular VM can run a fixed number of projects or requests per second. Builds, databases, the control plane, and application runtimes can all compete for the same CPU, memory, disk, and network on a single machine.

It also does not claim hostile tenant isolation or multi-node failover. Those are different products with different scheduler, networking, storage, and security requirements.

Keeping those limits explicit is part of the architecture: the platform automates deployment and operations, but it does not hide physical capacity or trust boundaries.

## Verification

The repository keeps controlled runtime regressions for boundaries such as update and rollback safety, backup/restore, concurrent deployment state, failure isolation, image retention, project creation, and database connectivity/access control.

The goal of those checks is not to publish synthetic capacity numbers. It is to verify that the platform behaves predictably when the lifecycle operations it owns succeed or fail.

## Result

MyPaaS replaced per-project deployment procedures with a reusable single-host platform that can take source or an image through build, runtime, routing, observation, and recovery.

The strongest engineering lesson was scope discipline: a small PaaS becomes more reliable when it is explicit about what it owns, what the application owns, and what one Linux host can never abstract away.