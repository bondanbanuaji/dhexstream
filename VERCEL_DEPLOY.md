# Deployment Guide: Vercel

This project is configured to be deployed on **Vercel** with a PHP runtime for the backend and Vite/React for the frontend.

## Project Structure

- `api/`: Contains all backend logic.
    - `index.php`: Main entry point (Serverless Function).
    - `core/`: Helper functions.
    - `data/`: JSON data files (ephemeral storage on Vercel).
- `src/`: React source code.
- `public/`: Static assets.
- `vercel.json`: Deployment configuration.

## Vercel Configuration

The project uses `vercel.json` to configure:
- **Runtime**: `vercel-php@0.7.2` for `api/index.php`.
- **Rewrites**:
    - `/api/index.php` -> `api/index.php` (handled as function).
    - Routes starting with `/api/` or `/assets/` are preserved.
    - All other routes rewritten to `/index.html` (SPA routing).

## Deployment Steps

1.  **Import Project**:
    - Go to Vercel Dashboard -> Add New -> Project.
    - Select your Git repository.

2.  **Build Settings**:
    - **Framework Preset**: Vite.
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`

3.  **Environment Variables**:
    - No specific env vars needed for basic setup.

4.  **Deploy**:
    - Click **Deploy**.

## Troubleshooting

- **404 on API**: Ensure `vercel.json` rewrites are correct and `api/index.php` exists.
- **Frontend Blank**: Ensure `dist/index.html` is generated and `base` path in `vite.config.js` is correct.
- **Data Not Saving**: Vercel filesystem is ephemeral. Use an external database for persistence.

## Local Development

- **Local**: Access via `http://localhost/dhexstream/`.
    - API requests go to `/dhexstream/api/index.php`.
- **Production**: Access via Vercel URL.
    - API requests go to `/api/index.php`.
