# 🚀 Aram Brand E-Commerce — Deployment Guide

This repository has a decoupled architecture with independent deployment configurations for both **Frontend** (Vite + React + Tailwind CSS) and **Backend** (Node.js + Express + Razorpay).

---

## 📁 Deployment Configuration Files Overview

| Target / Provider | File | Description |
| :--- | :--- | :--- |
| **Vercel (Frontend)** | [`frontend/vercel.json`](./frontend/vercel.json) | Production SPA rewrite rules, cache headers, output dir |
| **Netlify (Frontend)** | [`frontend/netlify.toml`](./frontend/netlify.toml) | Static build settings, publish path `dist`, SPA redirect |
| **Render (Fullstack)** | [`render.yaml`](./render.yaml) | Blueprint for Frontend Static Site (`frontend`) + Backend Web Service (`backend`) |
| **Docker (Frontend)** | [`frontend/Dockerfile`](./frontend/Dockerfile), [`frontend/nginx.conf`](./frontend/nginx.conf) | Nginx container for production static asset serving |
| **Docker (Backend)** | [`backend/Dockerfile`](./backend/Dockerfile) | Node 20 Alpine container for Express API |

---

## 1. Frontend Deployment

### Option A: Deploy to Vercel (Recommended for Frontend)
1. Push your repository to GitHub / GitLab.
2. In [Vercel Dashboard](https://vercel.com/new), select your repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://aram-backend.onrender.com`)
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_TlI7ARV0vduOJl` (or your live key)
5. Click **Deploy**. Vercel will use [`frontend/vercel.json`](./frontend/vercel.json) automatically.

### Option B: Deploy to Netlify
1. In [Netlify Dashboard](https://app.netlify.com), click **Add new site > Import an existing project**.
2. Connect your repo.
3. Netlify automatically detects [`frontend/netlify.toml`](./frontend/netlify.toml) or set:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add environment variables:
   - `VITE_API_URL`
   - `VITE_RAZORPAY_KEY_ID`
5. Click **Deploy Site**.

### Option C: Docker (Frontend)
```bash
cd frontend
docker build -t aram-frontend .
docker run -p 80:80 aram-frontend
```

---

## 2. Backend Deployment

### Option A: Deploy to Render (Web Service)
1. In [Render Dashboard](https://dashboard.render.com), click **New + > Web Service**.
2. Connect your repository.
3. Set configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `CLIENT_ORIGIN`: Your deployed frontend URL (e.g., `https://aram-frontend.vercel.app`)
   - `RAZORPAY_KEY_ID`: `rzp_test_TlI7ARV0vduOJl`
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
5. Click **Create Web Service**.

### Option B: Deploy via Render Blueprint (`render.yaml`)
1. In Render, select **Blueprints**.
2. Connect repo; Render reads [`render.yaml`](./render.yaml) and provisions both frontend and backend automatically.

### Option C: Docker (Backend)
```bash
cd backend
docker build -t aram-backend .
docker run -p 5000:5000 -e PORT=5000 aram-backend
```

---

## 3. Environment Variables Quick Reference

### Frontend (`.env` or Cloud Provider UI):
```env
VITE_API_URL=https://your-backend-domain.com
VITE_RAZORPAY_KEY_ID=rzp_test_TlI7ARV0vduOJl
VITE_ADMIN_EMAIL=mohammedshajahan2007@gmail.com
```

### Backend (`backend/.env` or Cloud Provider UI):
```env
PORT=5000
NODE_ENV=production
CLIENT_ORIGIN=https://your-frontend-domain.com
RAZORPAY_KEY_ID=rzp_test_TlI7ARV0vduOJl
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
```
