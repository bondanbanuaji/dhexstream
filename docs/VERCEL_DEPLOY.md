# Deployment Guide: Vercel

This project is configured to be deployed on **Vercel** with a PHP runtime for the backend and Vite/React for the frontend.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **Vercel CLI** (Optional): Install via `npm i -g vercel`.
3.  **Git Repository**: Push this project to GitHub, GitLab, or Bitbucket.

## Configuration

The project uses `vercel.json` to configure:
- **Runtime**: `vercel-php@0.7.2` for `api.php`.
- **Rewrites**:
    - `/dhexstream/api.php` -> `/api.php` (for specific API calls)
    - All other routes -> `/index.html` (for React Router)

## Deployment Steps

1.  **Import Project**:
    - Go to Vercel Dashboard -> Add New -> Project.
    - Select your Git repository.

2.  **Build Settings**:
    - **Framework Preset**: Vite (should be detected automatically).
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`

3.  **Environment Variables**:
    - No specific env vars are required for the basic setup, but if you use external services, add them here.

4.  **Deploy**:
    - Click **Deploy**.

## Data Persistence Warning

> [!WARNING]
> **Ephemeral Filesystem**: Vercel functions are serverless and ephemeral.
> Files written to the filesystem (like `recent.json` or `ongoing_response.json`) **will not persist** across redeployments or cold starts.
>
> **Solution**: For a production app, connect `api.php` to an external database (MySQL, PostgreSQL, Supabase) instead of using local JSON files.

## Local Development vs Production

- **Local**: Access via `http://localhost/dhexstream/` (Apache) or `http://localhost:3000` (Vite dev server).
    - API requests go to `/dhexstream/api.php`.
- **Production (Vercel)**: Access via your Vercel URL (e.g., `https://dhexstream.vercel.app`).
    - API requests go to `/api.php` (handled relative to root).
