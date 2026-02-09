# Panduan Setup Windows 🪟

Panduan lengkap untuk setup dan menjalankan **DHEXStream** di Windows menggunakan XAMPP dan Node.js.

## 📋 Prasyarat (Prerequisites)

Download dan install tools berikut:

### 1. Node.js
- Download: [https://nodejs.org/](https://nodejs.org/)
- Pilih versi **LTS** (Long Term Support)
- Minimal versi: **v18.x atau lebih baru**
- Pastikan centang "Add to PATH" saat instalasi

### 2. XAMPP
- Download: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
- Pilih versi dengan **PHP 8.2+**
- Install di `C:\xampp` (default)

### 3. Git for Windows
- Download: [https://gitforwindows.org/](https://gitforwindows.org/)
- Untuk clone project dari repository

### 4. Text Editor (Opsional tapi Disarankan)
- VS Code: [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## 🚀 Setup Project

### 1. Verifikasi Instalasi Node.js
Buka **PowerShell** atau **Command Prompt**, lalu jalankan:
```bash
node --version
npm --version
```

Pastikan kedua command menampilkan versi yang terinstall.

### 2. Clone Project ke htdocs
```bash
# Masuk ke folder htdocs XAMPP
cd C:\xampp\htdocs

# Clone project
git clone https://github.com/fallwxyz/dhexstream.git

# Masuk ke folder project
cd dhexstream
```

### 3. Install Dependencies
```bash
npm install
```

Proses ini akan download semua library yang dibutuhkan (React, Vite, GSAP, dll).

### 4. Ensure File Permissions
Pastikan folder `data/` bisa ditulis. Klik kanan folder → Properties → Security → Edit → Full Control untuk user Anda.

---

## 🛠️ Menjalankan Aplikasi

Ada **3 cara** untuk menjalankan aplikasi tergantung kebutuhan Anda.

### Mode 1: Development dengan Vite Dev Server (Recommended untuk Development)

#### Start XAMPP
1. Buka **XAMPP Control Panel**
2. Klik **Start** pada modul **Apache** dan **MySQL**
3. Pastikan status berubah hijau ✅

#### Jalankan Vite Dev Server
```bash
npm run dev
```

Terminal akan menampilkan URL seperti:
```
➜  Local:   http://localhost:3000/dhexstream/
➜  Network: use --host to expose
```

Jika port 3000 sudah dipakai, Vite akan otomatis pakai port 3001.

**Keuntungan**:
- ✅ Hot Module Replacement (HMR) - auto reload saat edit kode
- ✅ Tidak perlu build ulang setiap kali edit
- ✅ Fast refresh untuk development
- ✅ Error messages yang jelas di browser

**Akses**:
- Frontend (Vite): `http://localhost:3000/dhexstream/`
- API Backend: `http://localhost/dhexstream/api.php`

---

### Mode 2: Production dengan Apache (Production Simulation)

#### Build Production Bundle
```bash
npm run build
```

Tunggu hingga proses build selesai. Output akan tersimpan di folder `dist/`.

#### Start XAMPP
1. Buka **XAMPP Control Panel**
2. Start **Apache** dan **MySQL**

#### Akses via Apache
Buka browser: `http://localhost/dhexstream/`

**Keuntungan**:
- ✅ Simulate production environment
- ✅ Test optimized & minified bundle
- ✅ Akses seperti user production
- ✅ Test dengan Apache rewrite rules

**Penting**: Setiap kali ada perubahan kode, **harus run `npm run build` lagi** untuk apply changes!

---

### Mode 3: Preview Production Build (Quick Testing)

Cara cepat untuk test production build tanpa setup Apache:
```bash
# Build terlebih dahulu (jika belum)
npm run build

# Jalankan preview server
npm run preview
```

Preview server akan berjalan di `http://localhost:4173/dhexstream/`

**Keuntungan**:
- ✅ Test production bundle secara lokal
- ✅ Tidak perlu XAMPP running
- ✅ Cepat untuk testing build results
- ✅ Good untuk QA sebelum deploy

---

## 📊 Perbandingan Mode

| Mode | Command | URL | Hot Reload | Build Required | Use Case |
|------|---------|-----|------------|----------------|----------|
| **Dev** | `npm run dev` | `localhost:3000/dhexstream/` | ✅ Yes | ❌ No | Active development |
| **Production (Apache)** | `npm run build` | `localhost/dhexstream/` | ❌ No | ✅ Yes | Production simulation |
| **Preview** | `npm run preview` | `localhost:4173/dhexstream/` | ❌ No | ✅ Yes | Test optimized build |

---

## 🗄️ Setup Database (Opsional)

Jika project membutuhkan database:

1. Buka **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Login dengan user `root` tanpa password (default XAMPP)
3. Klik tab **SQL**
4. Execute query:
   ```sql
   CREATE DATABASE dhexstream;
   ```
5. Update file `.dhex` di root project dengan config database

---

## 🔧 Konfigurasi Apache untuk Clean URLs

Project ini menggunakan `.htaccess` untuk React Router. Pastikan `mod_rewrite` aktif:

1. Buka file: `C:\xampp\apache\conf\httpd.conf`
2. Cari baris berikut dan pastikan **tidak** ada tanda `#` di depannya:
   ```apache
   LoadModule rewrite_module modules/mod_rewrite.so
   ```
3. Cari section `<Directory "C:/xampp/htdocs">` dan ubah `AllowOverride None` menjadi:
   ```apache
   AllowOverride All
   ```
4. Save file dan restart Apache dari XAMPP Control Panel

---

## ❓ Troubleshooting

### Port 80 Sudah Dipakai (XAMPP Apache tidak bisa start)
**Penyebab**: Biasanya Skype, IIS, atau World Wide Web Publishing Service.

**Solusi 1 - Matikan service yang konflik**:
```powershell
# Cek aplikasi yang pakai port 80
netstat -ano | findstr :80

# Stop World Wide Web Publishing Service
net stop was /y
```

**Solusi 2 - Ubah port Apache**:
1. Edit `C:\xampp\apache\conf\httpd.conf`
2. Cari `Listen 80` → ubah jadi `Listen 8080`
3. Cari `ServerName localhost:80` → ubah jadi `ServerName localhost:8080`
4. Restart Apache
5. Akses jadi: `http://localhost:8080/dhexstream/`

### npm command not found
**Solusi**:
1. Restart terminal/PowerShell setelah install Node.js
2. Atau logout & login ulang Windows
3. Verify dengan: `echo %PATH%` (harus ada path ke Node.js)

### Database Connection Error
**Solusi**:
1. Pastikan MySQL di XAMPP **Running** (hijau)
2. Check config di file `.dhex`:
   ```
   hostname=localhost
   username=root
   password=
   ```
3. Test connection di phpMyAdmin

### Build Error / Dependencies Issue
```bash
# Clear cache dan reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### CORS Error saat Akses API
**Solusi**: Pastikan frontend dan API akses dari domain yang sama.

**Benar**:
- Frontend: `http://localhost:3000/dhexstream/`
- API: Proxy internal Vite ke `http://localhost/dhexstream/api.php`

Atau keduanya via Apache:
- Frontend: `http://localhost/dhexstream/`
- API: `http://localhost/dhexstream/api.php`

### File data/recent.json tidak bisa ditulis
**Solusi**:
1. Klik kanan folder `data/` → Properties
2. Tab Security → Edit → Pilih user Anda
3. Centang **Full Control**
4. Apply & OK

---

## 🎯 Workflow Development yang Disarankan

### Untuk Development Harian:
1. Start XAMPP (Apache + MySQL)
2. Buka terminal di folder project
3. Run: `npm run dev`
4. Edit kode di VS Code
5. Browser auto-reload saat save file
6. Test API endpoint jika perlu

### Sebelum Push/Commit:
1. Build: `npm run build`
2. Test di preview: `npm run preview`
3. Atau test di Apache: `http://localhost/dhexstream/`
4. Pastikan tidak ada error di console

### Untuk Testing Production:
1. Build: `npm run build`
2. Start XAMPP
3. Test di: `http://localhost/dhexstream/`
4. Test semua fitur (routing, API calls, dll)

---

> [!IMPORTANT]
> **Perbedaan Krusial**: Saat akses via Apache (`localhost/dhexstream`), Anda akses production build di folder `dist/`. Setiap perubahan kode **WAJIB di-build ulang** dengan `npm run build`!

> [!TIP]
> Gunakan Vite dev server (`npm run dev`) untuk development karena:
> - Auto reload saat edit kode
> - Error messages yang jelas
> - Tidak perlu build berulang kali
> 
> Apache cukup running untuk API endpoint saja.

> [!WARNING]
> Jangan edit file di folder `dist/` secara langsung! File di sana adalah hasil compile otomatis. Edit selalu di folder `src/`, lalu jalankan `npm run build`.
