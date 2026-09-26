# 🛡️ Zero-Trust Agent Identity & Privilege Fabric Platform

A continuous, context-aware authorization platform for AI agents, developers, services, and robots accessing critical digital resources. Instead of relying on static roles or long-lived credentials, this system continuously evaluates identity, device state, task context, historical behavior, resource sensitivity, and current risk — issuing short-lived, context-bound credentials and dynamically deciding whether access should continue, be restricted, or be revoked.

---

## 📖 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment URL](#deployment-url)
- [API Endpoints](#api-endpoints)
- [Threat Scenarios](#threat-scenarios)
- [Team](#team)

---

## 🎯 Overview

Traditional access control systems rely on **static roles** and **long-lived credentials** — which are easy to steal, hard to revoke, and blind to context. Our Zero-Trust Platform replaces this with **continuous, risk-adaptive authorization**:

- Every access decision is re-evaluated in real time.
- Credentials are ephemeral (5-minute TTL) and bound to identity + resource + risk context.
- A behavioral risk engine detects anomalies using ML (Isolation Forest).
- A graph-based analyzer computes the blast radius of a compromised identity.
- Every decision is logged for audit and explainability.

---

## 🏗️ Architecture



### Data Flow
1. Frontend sends authorization request → Backend
2. Backend extracts behavioral features → Risk Engine scores anomaly (0-1)
3. Backend sends context to OPA → OPA evaluates Rego policy → returns `allow`/`deny`/`step_up`
4. If allowed, Ephemeral Credential Service issues a short-lived JWT
5. Every decision is written to the audit log
6. Frontend receives decision, token, and risk score via WebSocket

---

## ✨ Features

### Core Functionalities (from problem statement)
- ✅ **Identity & Device Trust** — Users, agents, services, robots with trust scores, device posture, auth strength
- ✅ **Behavioral Risk Engine** — Isolation Forest anomaly detection
- ✅ **Resource Sensitivity** — PUBLIC / INTERNAL / CONFIDENTIAL / CRITICAL classification
- ✅ **Ephemeral Credential Service** — 5-minute JWT bound to identity + resource + risk
- ✅ **Continuous Authorization** — WebSocket-based re-evaluation
- ✅ **Compromise Isolation** — Neo4j graph traversal for blast radius

### Advanced Requirements
- ✅ Access decisions update as risk changes (not just login-time)
- ✅ Models compromised identities to find reachable resources
- ✅ Containment without shutting down unaffected users
- ✅ Auditable decision logs with reasons

---

## 🛠️ Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| **Frontend** | React + Vite + Tailwind CSS | Dashboard UI |
| **Charts** | Recharts | Risk score visualization |
| **Graph** | React Flow | Blast radius visualization |
| **Backend** | FastAPI + Uvicorn | REST API + WebSocket |
| **Policy Engine** | Open Policy Agent (OPA) | Policy-as-code (Rego) |
| **Risk ML** | Scikit-learn (Isolation Forest) | Anomaly detection |
| **Identity** | Keycloak (optional) | OIDC provider |
| **Database** | PostgreSQL | Identity + audit store |
| **Graph DB** | Neo4j | Privilege graph |
| **Containers** | Docker Compose | Orchestration |

---

## 🚀 Getting Started

### Prerequisites
- Docker Desktop (running)
- Node.js 20+
- Python 3.12+

### Step 1: Clone the repo
```bash
git clone https://github.com/dogga777/Zero-Trust-Platform.git
cd Zero-Trust-Platform

## 🌐 Deployment URL

- **Frontend (Live Demo)**: https://zero-trust-platform-sigma.vercel.app
- **Backend API**: https://zero-trust-backend-r618.onrender.com
- **API Docs (Swagger)**: https://zero-trust-backend-r618.onrender.com/docs