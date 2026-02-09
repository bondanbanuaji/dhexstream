# Deployment Guide - dhexstream ke Vercel

Panduan lengkap untuk mendeploy aplikasi dhexstream ke Vercel untuk production.

---

## Prerequisites

Sebelum memulai deployment, pastikan Anda memiliki:

- **Node.js**: Version 18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** atau **yarn**: Package manager yang terinstall
- **Akun Vercel**: Gratis di [vercel.com](https://vercel.com)
- **Git**: Untuk version control ([Download](https://git-scm.com/))
- **Repository GitHub**: Project harus di-push ke GitHub

---

## Langkah 1: Persiapan Project

### 1.1 Verifikasi Build Lokal

Sebelum deploy, pastikan build berjalan sukses di lokal:

```bash
cd /home/boba/lampp/htdocs/dhexstream
npm install
npm run build
```

**Expected Output**: Build selesai dengan 0 errors

### 1.2 Test Production Build

Jalankan preview production build:

```bash
npm run preview
```

Buka `http://localhost:4173` dan verify:
- ✓ Semua routes accessible
- ✓ Tidak ada 404 errors
- ✓ UI berbahasa Indonesia 100%
- ✓ Tidak ada console errors di browser

---

## Langkah 2: Configuration Files Verification

Project sudah dilengkapi dengan configuration files berikut:

### 2.1 vercel.json

File ini sudah dibuat dengan konfigurasi:
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites (semua routes ke index.html)
- Caching headers untuk assets
- Region deployment: Singapore (sin1)

### 2.2 .env.example

Template environment variables sudah tersedia. **Penting**: File ini TIDAK berisi nilai sensitif dan aman untuk di-commit ke git.

### 2.3 vite.config.js

Sudah dioptimasi untuk production:
- Base path untuk production: `/` (root)
- Code splitting strategy
- Source maps enabled (untuk debugging)
- Bundle size optimizations

---

## Langkah 3: Setup Repository GitHub

### 3.1 Initialize Git (Jika Belum)

```bash
git init
git add .
git commit -m "chore: prepare for Vercel deployment"
```

### 3.2 Push ke GitHub

```bash
# Ganti dengan URL repository Anda
git remote add origin https://github.com/username/dhexstream.git
git branch -M main
git push -u origin main
```

---

## Langkah 4: Deploy ke Vercel

### 4.1 Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**: Buka [vercel.com/login](https://vercel.com/login)

2. **Import Project**:
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Pilih repository `dhexstream`

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (akan otomatis terisi)
   - **Output Directory**: `dist` (akan otomatis terisi)
   - **Install Command**: `npm install` (akan otomatis terisi)

4. **Environment Variables** (Jika Diperlukan):
   - Click "Environment Variables"
   - Add variables sesuai `.env.example`:
     ```
     Name: VITE_API_BASE_URL
     Value: https://your-api-domain.com (atau URL API Anda)
     ```
   - **Penting**: Hanya tambahkan jika aplikasi membutuhkan API external

5. **Deploy**:
   - Click "Deploy"
   - Tunggu proses deployment (biasanya 1-3 menit)

### 4.2 Via Vercel CLI (Alternative)

Install Vercel CLI:

```bash
npm install -g vercel
```

Login:

```bash
vercel login
```

Deploy:

```bash
cd /home/boba/lampp/htdocs/dhexstream
vercel
```

Ikuti prompt interaktif dan pilih:
- Setup and deploy: `Y`
- Scope: Account Anda
- Link to existing project: `N`
- Project name: `dhexstream`
- Directory: `./`
- Override settings: `N`

---

## Langkah 5: Post-Deployment Verification

### 5.1 Check Deployment URL

Setelah deployment sukses, Vercel akan memberikan URL seperti:
```
https://dhexstream.vercel.app
```

### 5.2 Verify Production Site

1. **Akses URL** deployment dan check:
   - ✓ Homepage loads correctly
   - ✓ Navigation berfungsi (sidebar, menu)
   - ✓ Semua text dalam Bahasa Indonesia
   - ✓ Search functionality works
   - ✓ Anime detail pages accessible
   - ✓ Watch page functional (tergantung API backend)

2. **Browser Console**:
   - Buka DevTools (F12)
   - Check Console: Tidak boleh ada errors
   - Check Network: Assets loading dengan status 200

3. **Performance Check**:
   - Run Lighthouse audit (DevTools → Lighthouse)
   - Target scores:
     - Performance: ≥ 80
     - Accessibility: ≥ 80
     - Best Practices: ≥ 80
     - SEO: ≥ 80

### 5.3 Test Key Features

- ✓ Search anime
- ✓ Browse by genre
- ✓ View anime details
- ✓ Navigate pagination (ongoing, completed, popular)
- ✓ Check schedule page
- ✓ Check history page
- ✓ Responsive design (mobile, tablet, desktop)

---

## Langkah 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. Di Vercel Dashboard, buka project **dhexstream**
2. Go to "Settings" → "Domains"
3. Add your domain (misalnya: `dhexstream.com`)
4. Follow DNS configuration instructions

### 6.2 SSL Certificate

Vercel automatically provides SSL certificate (HTTPS). Setelah DNS propagate (5-10 menit), site Anda akan accessible via HTTPS.

---

## Troubleshooting

### Issue 1: Build Failed - Missing Dependencies

**Error**: `Module not found` atau `Cannot find module`

**Solution**:
```bash
# Delete node_modules dan reinstall
rm -rf node_modules
npm install
npm run build
```

### Issue 2: Routes Return 404

**Problem**: Langsung akses `/watch/ongoing` return 404

**Solution**: Pastikan `vercel.json` memiliki rewrite rules:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue 3: Environment Variables Tidak Terbaca

**Problem**: `import.meta.env.VITE_API_BASE_URL` undefined

**Solution**:
1. Check Vercel Dashboard → Settings → Environment Variables
2. Pastikan variable name diawali dengan `VITE_`
3. Redeploy project setelah menambahkan env vars

### Issue 4: Blank Page After Deployment

**Problem**: Production site shows blank page

**Solution**:
1. Check browser console untuk errors
2. Verify `base` path di `vite.config.js`:
   ```javascript
   base: command === 'serve' ? '/dhexstream/' : '/',
   ```
3. Pastikan build output ke `dist/` folder

---

## Continuous Deployment

Setelah initial deployment, setiap push ke branch `main` akan otomatis trigger:
1. Build baru di Vercel
2. Deploy ke production (jika build sukses)
3. Notifikasi status via email/Slack

### Preview Deployments

Setiap pull request akan mendapatkan preview URL unik untuk testing sebelum merge.

---

## Monitoring & Analytics

### Vercel Analytics

Aktifkan Vercel Analytics untuk monitoring:
1. Dashboard → Project → Analytics
2. Enable "Web Analytics"
3. Track:
   - Page views
   - Performance metrics
   - User locations

### Performance Monitoring

Check deployment logs:
```bash
vercel logs <deployment-url>
```

---

## Maintenance

### Update Dependencies

Secara berkala, update dependencies:

```bash
npm update
npm audit fix
npm run build
git commit -am "chore: update dependencies"
git push
```

Vercel akan otomatis redeploy dengan dependencies terbaru.

---

## Rollback

Jika deployment bermasalah:

1. Di Vercel Dashboard → Deployments
2. Pilih deployment sebelumnya yang stable
3. Click menu (⋯) → "Promote to Production"

---

## Support & Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Deployment Guide**: [vitejs.dev/guide/static-deploy](https://vitejs.dev/guide/static-deploy.html)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## Kesimpulan

Project dhexstream sekarang production-ready dan dapat di-deploy ke Vercel dengan mudah. Semua konfigurasi sudah dioptimasi untuk performa maksimal dan user experience terbaik dalam Bahasa Indonesia.

**Next Steps**:
1. Deploy to Vercel following steps above
2. Test thoroughly pada production URL
3. Monitor performance via Vercel Analytics
4. Setup custom domain (optional)
5. Enable continuous deployment untuk future updates

**Happy Deploying! 🚀**
