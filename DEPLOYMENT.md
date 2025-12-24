# Deployment Guide

Follow these steps to deploy your Full Stack application to the cloud.

## 1. Prerequisites
-   Your code is pushed to GitHub.
-   Accounts on [Vercel](https://vercel.com) and [Render](https://render.com).

---

## 2. Deploy Backend (Render) - The Easy Way
We have included a `render.yaml` file that automates the entire backend setup (Laravel API + Database + Processor Worker).

1.  **Dashboard**: Go to [dashboard.render.com](https://dashboard.render.com/).
2.  **New Blueprint**: Click **New +** -> **Blueprint**.
3.  **Connect Repo**: Connect your GitHub repository.
4.  **Auto-Detect**: Render will detect `render.yaml`.
5.  **Apply**: Click **Apply**.
    *   This will create:
        *   `beyondchats-db` (PostgreSQL Database)
        *   `beyondchats-backend` (Laravel Web Service)
        *   `beyondchats-processor` (Node.js Background Worker)
6.  **Wait**: Wait for the deployment to finish (Status: Live).
7.  **Copy URL**: Copy the **Web Service URL** (e.g., `https://beyondchats-backend.onrender.com`).

---

## 3. Deploy Frontend (React) to Vercel

1.  **Dashboard**: Go to your Vercel Dashboard.
2.  **New Project**: Click **Add New...** -> **Project**.
3.  **Import**: Import your GitHub repository.
4.  **Configuration**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Environment Variables**:
        *   Key: `VITE_API_BASE_URL`
        *   Value: `https://beyondchats-backend.onrender.com/api` (The URL you copied from Render).
5.  **Deploy**: Click **Deploy**.

---

## 4. Verification
-   Open your Vercel link.
-   You should see articles!
-   The **Processor** runs automatically in the background on Render, fetching new RSS items every 5 minutes.
