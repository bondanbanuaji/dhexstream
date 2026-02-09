# Panduan Setup macOS 🍎

Panduan lengkap untuk setup dan menjalankan **DHEXStream** di macOS menggunakan Homebrew, Node.js, dan XAMPP/MAMP.

## 📋 Prasyarat

### 1. Install Homebrew (Package Manager)
Jika belum punya Homebrew, install dulu di Terminal:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Setelah instalasi, ikuti instruksi untuk menambahkan Homebrew ke PATH:
```bash
# Untuk Apple Silicon (M1/M2/M3)
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Untuk Intel Mac
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### 2. Install Node.js
```bash
brew install node

# Verify installation
node --version
npm --version
```

Minimal versi Node.js: **v18.x atau lebih baru**

### 3. Install XAMPP atau MAMP

**Pilihan 1 - XAMPP for macOS** (Recommended):
- Download: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
- Install seperti aplikasi biasa (.dmg)
- Default location: `/Applications/XAMPP/`

**Pilihan 2 - MAMP**:
- Download: [https://www.mamp.info/](https://www.mamp.info/)
- Versi gratis sudah cukup

**Pilihan 3 - Manual via Homebrew** (Advanced):
```bash
brew install mysql php
brew services start mysql
```

### 4. Install Git (jika belum ada)
```bash
brew install git
```

---

## 🚀 Setup Project

### 1. Clone Project ke htdocs

**Jika pakai XAMPP**:
```bash
cd /Applications/XAMPP/htdocs/
git clone https://github.com/fallwxyz/dhexstream.git
cd dhexstream
```

**Jika pakai MAMP**:
```bash
cd /Applications/MAMP/htdocs/
git clone https://github.com/fallwxyz/dhexstream.git
cd dhexstream
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set File Permissions
```bash
# Pastikan folder data/ bisa ditulis
chmod -R 775 data/
chmod 664 data/recent.json

# Jika ada permission error
sudo chown -R $(whoami) .
```

---

## 🛠️ Menjalankan Aplikasi

Ada **3 mode** untuk menjalankan aplikasi sesuai kebutuhan:

### Mode 1: Development dengan Vite Dev Server (Recommended)

#### Start XAMPP/MAMP
**XAMPP**:
- Buka aplikasi **XAMPP** dari Applications
- Klik **Start** untuk Apache dan MySQL

**MAMP**:
- Buka aplikasi **MAMP**
- Klik **Start**

#### Jalankan Vite Dev Server
```bash
npm run dev
```

Vite akan running di `http://localhost:3000/dhexstream/` (atau port 3001 jika 3000 terpakai).

**Keuntungan**:
- ✅ Hot Module Replacement - auto reload saat edit kode
- ✅ Tidak perlu build berulang kali
- ✅ Fast refresh untuk development
- ✅ Error messages yang jelas

**Akses**:
- Frontend (Vite): `http://localhost:3000/dhexstream/`
- API Backend: `http://localhost/dhexstream/api.php`

---

### Mode 2: Production dengan Apache (Production Simulation)

#### Build Production Bundle
```bash
npm run build
```

Output akan tersimpan di folder `dist/`.

#### Start XAMPP/MAMP
Pastikan Apache dan MySQL sudah running.

#### Akses via Apache
**XAMPP**: `http://localhost/dhexstream/`  
**MAMP**: `http://localhost:8888/dhexstream/` (port default MAMP)

**Keuntungan**:
- ✅ Test production environment
- ✅ Optimized & minified bundle
- ✅ Test dengan Apache routing

**Penting**: Setiap perubahan kode **harus run `npm run build` lagi**!

---

### Mode 3: Preview Production Build (Quick Testing)

```bash
# Build dulu (jika belum)
npm run build

# Jalankan preview server
npm run preview
```

Access: `http://localhost:4173/dhexstream/`

**Keuntungan**:
- ✅ Test production build tanpa Apache
- ✅ Cepat untuk QA
- ✅ Tidak perlu XAMPP/MAMP running

---

## 📊 Perbandingan Mode

| Mode | Command | URL | Hot Reload | Build Required | Use Case |
|------|---------|-----|------------|----------------|----------|
| **Dev** | `npm run dev` | `localhost:3000/dhexstream/` | ✅ Yes | ❌ No | Active development |
| **Production** | `npm run build` | `localhost/dhexstream/` | ❌ No | ✅ Yes | Production test |
| **Preview** | `npm run preview` | `localhost:4173/dhexstream/` | ❌ No | ✅ Yes | Quick build test |

---

## 🔧 Enable Apache mod_rewrite (XAMPP)

Project ini butuh `.htaccess` untuk React Router:

```bash
# Edit httpd.conf
nano /Applications/XAMPP/etc/httpd.conf

# Cari dan uncomment baris:
# LoadModule rewrite_module modules/mod_rewrite.so

# Cari section <Directory> dan ubah AllowOverride None menjadi:
# AllowOverride All

# Restart Apache dari XAMPP Manager
```

---

## 🗄️ Setup Database (Opsional)

**Via phpMyAdmin**:
1. Buka: `http://localhost/phpmyadmin` (XAMPP)  
   atau: `http://localhost:8888/phpmyadmin` (MAMP)
2. Login dengan user `root` tanpa password
3. Create database:
   ```sql
   CREATE DATABASE dhexstream;
   ```
4. Update file `.dhex` di root project

**Via Terminal**:
```bash
# XAMPP
/Applications/XAMPP/bin/mysql -u root

# MAMP  
/Applications/MAMP/Library/bin/mysql -u root -p

# Create database
CREATE DATABASE dhexstream;
EXIT;
```

---

## ❓ Troubleshooting

### EACCES Permission Error
```bash
# Fix permission untuk node_modules
sudo chown -R $(whoami) .

# Atau pakai folder permission fix
chmod -R 755 node_modules/
```

### Command Not Found (brew, node, npm)
**Solusi**: Pastikan PATH sudah benar di `.zshrc` atau `.bash_profile`

```bash
# Check shell yang dipakai
echo $SHELL

# Edit config file
nano ~/.zshrc  # untuk zsh (default macOS Catalina+)
# atau
nano ~/.bash_profile  # untuk bash

# Tambahkan:
export PATH="/opt/homebrew/bin:$PATH"  # Apple Silicon
# atau
export PATH="/usr/local/bin:$PATH"     # Intel

# Reload
source ~/.zshrc
```

### MySQL Socket Error
```bash
# Check MySQL status
brew services list

# Restart MySQL
brew services restart mysql

# Atau via XAMPP/MAMP interface
```

### Port 80 Already in Use (Apache)
**Solusi 1** - Matikan aplikasi lain:
```bash
# Cek apa yang pakai port 80
sudo lsof -i :80

# Kill process (ganti PID dengan yang muncul)
sudo kill -9 PID
```

**Solusi 2** - Ubah port Apache (edit httpd.conf):
```apache
Listen 8080
ServerName localhost:8080
```

### Build Error / npm Issues
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### CORS Error
Pastikan frontend dan API dari domain yang sama:
- ✅ Frontend: `http://localhost:3000/dhexstream/`
- ✅ API: Proxy ke `http://localhost/dhexstream/api.php`

Atau keduanya via Apache:
- ✅ Both: `http://localhost/dhexstream/`

---

## 🎯 Workflow Development yang Disarankan

### Development Harian:
1. Start XAMPP/MAMP (Apache + MySQL)
2. Terminal di folder project: `npm run dev`
3. Edit kode di VS Code
4. Browser auto-reload
5. Test API jika perlu

### Sebelum Push/Commit:
1. Build: `npm run build`
2. Test: `npm run preview`
3. Atau test via Apache
4. Check browser console untuk error

### Testing Production:
1. Build: `npm run build`
2. Start XAMPP/MAMP
3. Access: `http://localhost/dhexstream/`
4. Test semua fitur

---

## 🍎 Notes untuk Apple Silicon (M1/M2/M3)

1. **Node.js**: Native support untuk ARM, tidak perlu Rosetta
2. **Homebrew**: Install di `/opt/homebrew/` (bukan `/usr/local/`)
3. **XAMPP**: Gunakan versi native ARM jika tersedia
4. **Docker**: Jika pakai Docker, pastikan platform flag: `--platform linux/arm64`

---

> [!IMPORTANT]
> **Perbedaan Penting**: Saat akses via Apache (`localhost/dhexstream`), Anda akses production build di `dist/`. Setiap perubahan kode **WAJIB rebuild** dengan `npm run build`!

> [!TIP]
> **Best Practice**:
> - Development: Gunakan `npm run dev` (hot reload)
> - Apache cukup running untuk API endpoint
> - Build hanya sebelum testing production
> 
> Workflow ini lebih efisien karena tidak perlu build berulang kali.

> [!WARNING]
> Jangan edit file di folder `dist/`! Folder ini auto-generated. Edit selalu di `src/`, lalu `npm run build`.
