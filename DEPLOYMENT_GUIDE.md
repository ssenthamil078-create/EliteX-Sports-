# AI Sports Platform — Vercel Deployment Guide

This guide covers deploying both the **React frontend** and **FastAPI backend** to Vercel.

---

## Project Structure

```
/
├── frontend/   ← React + Vite app (deploy separately)
└── backend/    ← FastAPI app (deploy separately)
```

Deploy them as **two separate Vercel projects**. The frontend calls the backend via an environment variable.

---

## 1. Deploy the Backend (FastAPI)

### Prerequisites
- A **PostgreSQL** database accessible from the internet (e.g. [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app) — all have free tiers)
- A **Vercel** account

### Steps

1. Push the `backend/` folder to a GitHub repository (or a monorepo subfolder).

2. In Vercel, click **Add New → Project**, import your repo, and set the **Root Directory** to `backend/`.

3. Under **Settings → Environment Variables**, add every variable from `.env.example`:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname` |
   | `JWT_SECRET` | *(strong random string)* |
   | `JWT_ALGORITHM` | `HS256` |
   | `GROQ_API_KEY` | *(your Groq key)* |
   | `SECRET_KEY` | *(strong random string)* |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | *(your Gmail address)* |
   | `SMTP_PASSWORD` | *(Gmail App Password — not your account password)* |
   | `FRONTEND_URL` | *(fill in after deploying frontend)* |
   | `ALLOWED_ORIGINS` | *(fill in after deploying frontend, e.g. `https://your-app.vercel.app`)* |

4. Vercel will auto-detect `vercel.json` and use `@vercel/python`. Click **Deploy**.

5. Note your backend URL (e.g. `https://ai-sports-backend.vercel.app`).

> ⚠️ **Important:** Go back and update `FRONTEND_URL` and `ALLOWED_ORIGINS` once the frontend is deployed, then **Redeploy** the backend.

---

## 2. Deploy the Frontend (React + Vite)

### Steps

1. Push the `frontend/` folder to a GitHub repository (or a monorepo subfolder).

2. In Vercel, click **Add New → Project**, import your repo, and set the **Root Directory** to `frontend/`.

3. Vercel auto-detects Vite. Confirm:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Under **Settings → Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://your-backend-url.vercel.app` |

5. Click **Deploy**.

---

## 3. Post-Deployment Checklist

- [ ] Backend is responding at `/docs` (FastAPI Swagger UI)
- [ ] Frontend loads and login/register works
- [ ] CORS is not blocking API calls (check browser console)
- [ ] Email sending works (test forgot-password flow)
- [ ] `ALLOWED_ORIGINS` on backend includes your exact frontend URL
- [ ] `FRONTEND_URL` on backend is set (used for email links)

---

## 4. Common Issues & Fixes

### CORS errors in browser
The `ALLOWED_ORIGINS` env var on the backend must exactly match your frontend URL — **no trailing slash**.
```
✅  https://my-app.vercel.app
❌  https://my-app.vercel.app/
```

### `DATABASE_URL` error on startup
Vercel Postgres and Supabase provide URLs starting with `postgres://`. The backend automatically rewrites it to `postgresql://` (SQLAlchemy requirement). No action needed.

### 500 on first deploy
Check **Vercel → Functions → Logs**. The most common cause is a missing environment variable.

### `psycopg2` install fails
The `requirements.txt` already uses `psycopg2-binary`, which bundles its own C libraries and works on Vercel without any extra steps.

### Vercel timeout (functions have 10s limit on Hobby plan)
AI/ML endpoints that call Groq or do heavy processing may hit the 10-second serverless function limit on free Vercel. Solutions:
- Upgrade to Vercel **Pro** (60s limit)
- Or consider deploying the backend to **Railway** or **Render** for long-running processes

---

## 5. Local Development (after these changes)

```bash
# Backend
cd backend
cp .env.example .env   # fill in real values
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (in a separate terminal)
cd frontend
cp .env.example .env   # set VITE_API_BASE_URL=http://127.0.0.1:8000
npm install
npm run dev
```
