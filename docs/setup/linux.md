# Panduan Setup Linux (Ubuntu/Debian) 🐧

Panduan lengkap untuk setup dan menjalankan **DHEXStream** di Linux (berbasis Ubuntu/Debian/Arch).

## 📋 Prasyarat & Instalasi Tools

### 1. Update Package Manager
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js & npm (via NVM)
Gunakan **NVM** (Node Version Manager) untuk install Node.js:
```bash
# Download & install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Aktifkan NVM (atau restart terminal)
source ~/.bashrc

# Install Node.js LTS (v18+)
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

### 3. Install XAMPP for Linux (LAMPP)
Download dan install XAMPP/LAMPP:
```bash
# Download XAMPP (cek versi terbaru di apachefriends.org)
wget https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/8.2.12/xampp-linux-x64-8.2.12-0-installer.run

# Berikan permission execute
chmod +x xampp-linux-x64-8.2.12-0-installer.run

# Install XAMPP (akan terinstall di /opt/lampp)
sudo ./xampp-linux-x64-8.2.12-0-installer.run
```

### 4. Install Git
```bash
sudo apt install git -y
```

---

## 🚀 Setup Project

### 1. Clone Project ke htdocs
```bash
# Masuk ke folder htdocs LAMPP
cd /opt/lampp/htdocs

# Clone project (atau copy jika sudah ada)
sudo git clone https://github.com/fallwxyz/dhexstream.git

# Ubah ownership ke user Anda
sudo chown -R $USER:$USER dhexstream

# Masuk ke folder project
cd dhexstream
```

**Atau jika ingin clone ke home directory** (lebih disarankan untuk development):
```bash
# Clone ke folder home
cd ~
mkdir -p lampp/htdocs
cd lampp/htdocs
git clone https://github.com/fallwxyz/dhexstream.git
cd dhexstream
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Ensure File Permissions
```bash
# Pastikan folder data/ bisa ditulis oleh PHP
chmod -R 775 data/
chmod 664 data/recent.json
```

---

## 🛠️ Menjalankan Aplikasi

Ada **2 cara** untuk menjalankan aplikasi: **Development Mode** dan **Production Mode**.

### Mode 1: Development dengan Vite Dev Server (Recommended untuk Development)

#### Start Apache & MySQL
```bash
sudo /opt/lampp/lampp start
```

#### Jalankan Vite Dev Server
```bash
npm run dev
```

Vite akan berjalan di `http://localhost:3000/dhexstream/` atau `http://localhost:3001/dhexstream/` (jika port 3000 dipakai).

**Keuntungan**:
- ✅ Hot Module Replacement (HMR) - auto reload saat edit kode
- ✅ Tidak perlu build ulang setiap kali edit
- ✅ Fast refresh untuk development

**Akses**:
- Frontend (Vite): `http://localhost:3001/dhexstream/`
- API Backend: `http://localhost/dhexstream/api.php`

---

### Mode 2: Production dengan Apache (Seperti Production Server)

#### Build Production Bundle
```bash
npm run build
```

Perintah ini akan compile semua file React ke folder `dist/` yang siap di-serve oleh Apache.

#### Start Apache & MySQL
```bash
sudo /opt/lampp/lampp start
```

#### Akses via Apache
Buka browser: `http://localhost/dhexstream/`

**Keuntungan**:
- ✅ Simulate production environment
- ✅ Test optimized bundle
- ✅ Akses seperti user production

**Penting**: Setiap kali ada perubahan kode, **harus run `npm run build` lagi**!

---

### Mode 3: Preview Production Build (Testing)

Cara terbaik untuk test production build tanpa setup Apache:
```bash
# Build terlebih dahulu
npm run build

# Jalankan preview server
npm run preview
```

Preview server akan berjalan di `http://localhost:4173/dhexstream/`

**Keuntungan**:
- ✅ Test production bundle secara lokal
- ✅ Tidak perlu Apache running
- ✅ Cepat untuk testing build results

---

## 📊 Perbandingan Mode

| Mode | Command | URL | Hot Reload | Build Required | Use Case |
|------|---------|-----|------------|----------------|----------|
| **Dev** | `npm run dev` | `localhost:3001/dhexstream/` | ✅ Yes | ❌ No | Active development |
| **Production (Apache)** | `npm run build` | `localhost/dhexstream/` | ❌ No | ✅ Yes | Production simulation |
| **Preview** | `npm run preview` | `localhost:4173/dhexstream/` | ❌ No | ✅ Yes | Test optimized build |

---

## 🔧 Enable Apache mod_rewrite

Aplikasi ini membutuhkan `.htaccess` untuk routing React Router. Pastikan `mod_rewrite` aktif:

```bash
# Cek apakah mod_rewrite sudah aktif
sudo /opt/lampp/bin/apachectl -M | grep rewrite

# Jika belum aktif, edit httpd.conf
sudo nano /opt/lampp/etc/httpd.conf

# Cari dan uncomment baris:
# LoadModule rewrite_module modules/mod_rewrite.so

# Restart Apache
sudo /opt/lampp/lampp restart
```

---

## 🗄️ Setup Database (Opsional)

Jika project membutuhkan database:
```bash
# Akses MySQL
sudo /opt/lampp/bin/mysql -u root

# Buat database
CREATE DATABASE dhexstream;
EXIT;
```

Update file `.dhex` di root project dengan config database Anda.

---

## ❓ Troubleshooting

### Permission Denied pada data/recent.json
```bash
chmod -R 775 data/
sudo chown -R $USER:www-data data/
```

### Port 80/443 Already in Use
```bash
# Cek aplikasi yang pakai port 80
sudo lsof -i :80

# Stop service yang konflik (misal nginx)
sudo systemctl stop nginx
```

### Apache tidak bisa start
```bash
# Cek error log
sudo tail -f /opt/lampp/logs/error_log

# Cek konfigurasi
sudo /opt/lampp/bin/apachectl configtest
```

### Build gagal / npm error
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error saat akses API
Pastikan akses frontend dan API dari domain yang sama:
- ✅ Frontend: `http://localhost/dhexstream/`
- ✅ API: `http://localhost/dhexstream/api.php`

Atau gunakan Vite dev server yang sudah ada proxy:
- ✅ Frontend: `http://localhost:3001/dhexstream/`
- ✅ API: Proxy di Vite akan redirect ke Apache

---

## 🎯 Workflow Development yang Disarankan

**Untuk Development Harian**:
1. Start Apache & MySQL: `sudo /opt/lampp/lampp start`
2. Run Vite dev server: `npm run dev`
3. Edit kode di VS Code dengan hot reload
4. Test API di `http://localhost/dhexstream/api.php`

**Sebelum Push/Commit**:
1. Build production: `npm run build`
2. Test dengan preview: `npm run preview`
3. Atau test di Apache: `http://localhost/dhexstream/`
4. Pastikan tidak ada error di console browser

**Untuk Testing Production**:
1. Build: `npm run build`
2. Deploy ke Apache: Otomatis di `dist/`
3. Test di `http://localhost/dhexstream/`

---

> [!IMPORTANT]
> **Perbedaan Penting**: Saat akses via Apache (`localhost/dhexstream`), Anda mengakses production build di folder `dist/`. Setiap perubahan kode **HARUS di-build ulang** dengan `npm run build`!

> [!TIP]
> Gunakan Vite dev server (`npm run dev`) untuk development agar tidak perlu build ulang setiap edit kode. Apache hanya perlu running untuk endpoint API.
