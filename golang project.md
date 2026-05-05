# 🚀 GoTracker — Sistem Pemantau Website Berbasis Microservices

GoTracker adalah proyek pembelajaran fullstack yang mengimplementasikan arsitektur **Microservices** standar industri menggunakan **Go**, **React**, dan **Docker**. Sistem ini memantau status (uptime) dari daftar website secara konkuren menggunakan Goroutines, dilindungi oleh autentikasi JWT melalui layanan SSO terpusat.

---

## 📦 Struktur Workspace

```
c:\Project\Go\
├── Belajar-SSO/          # 🔐 Layanan SSO (Identity Provider) — Port 8081
├── Belajar-GO/           # 🛰️  Layanan Tracker Utama (Resource Server) — Port 8080
├── Belajar-FE/           # 🖥️  Antarmuka Pengguna React + Vite — Port 80
├── docker-compose.yml    # 🐳 Orkestrasi seluruh layanan
├── init-dbs.sql          # 🗄️  Inisialisasi skema database PostgreSQL
├── supabase-init.sql     # ☁️  Alternatif skema untuk Supabase
├── ARCHITECTURE.md       # 📐 Dokumentasi arsitektur sistem
└── README.md             # 📄 Dokumen ini
```

---

## 🏗️ Arsitektur Sistem

Sistem ini terdiri dari **3 layanan utama** yang saling terisolasi dan berkomunikasi satu sama lain melalui REST API.

```
┌─────────────────────────────────────────────────────┐
│                     User (Browser)                   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP
          ┌────────────▼────────────┐
          │     Belajar-FE          │  Port :80
          │  React + Vite + Nginx   │
          └────────┬────────┬───────┘
                   │        │
      POST /login  │        │  GET /websites (+ JWT)
                   │        │
     ┌─────────────▼──┐  ┌──▼──────────────────┐
     │  Belajar-SSO   │  │    Belajar-GO        │
     │  Go + Gin      │  │    Go + Gin          │
     │  Port :8081    │  │    Port :8080        │
     │                │  │    + Swagger UI      │
     │  - Register    │  │    + Goroutines      │
     │  - Login       │  │    + Background      │
     │  - JWT Issue   │  │      Worker          │
     │  - Google SSO  │  │                      │
     └───────┬────────┘  └──────────┬───────────┘
             │                      │
             └──────────┬───────────┘
                        │ SQL
            ┌───────────▼──────────┐
            │   PostgreSQL :5432   │
            │                      │
            │  DB: go_sso          │
            │  DB: gotracker       │
            └──────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer       | Teknologi                                        |
|-------------|--------------------------------------------------|
| Backend SSO | Go 1.26, Gin, JWT, Bcrypt, OAuth2 (Google)       |
| Backend API | Go 1.26, Gin, JWT Middleware, Swagger (swaggo)   |
| Frontend    | React 18, TypeScript, Vite, Tailwind CSS         |
| Database    | PostgreSQL 15 (Alpine)                           |
| Container   | Docker, Docker Compose                           |
| UI Toolkit  | Radix UI, Lucide React, clsx                     |

---

## ⚡ Cara Menjalankan (Docker Compose)

### Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) sudah terinstall dan berjalan

### Langkah Menjalankan

```bash
# Clone semua repo ke dalam folder c:\Project\Go\
# Pastikan Belajar-SSO, Belajar-GO, dan Belajar-FE sudah ada

# Jalankan seluruh sistem dengan satu perintah dari root workspace
cd "c:\Project\Go"
docker-compose up --build
```

Setelah semua container berjalan:

| Layanan       | URL                                        |
|---------------|--------------------------------------------|
| Frontend      | http://localhost                           |
| Tracker API   | http://localhost:8080                      |
| Swagger UI    | http://localhost:8080/swagger/index.html   |
| SSO API       | http://localhost:8081                      |
| PostgreSQL    | `localhost:5433` (akses via pgAdmin)       |

### Menghentikan Sistem

```bash
docker-compose down
# Tambahkan -v untuk menghapus data volume PostgreSQL juga
docker-compose down -v
```

---

## 🔐 Belajar-SSO — Identity Provider

Layanan otentikasi terpusat yang bertugas menerbitkan **Token JWT**.

### API Endpoints

| Method | Endpoint                  | Auth      | Deskripsi                             |
|--------|---------------------------|-----------|---------------------------------------|
| POST   | `/register`               | ❌ Public | Daftarkan pengguna baru               |
| POST   | `/login`                  | ❌ Public | Login dengan username/password        |
| POST   | `/refresh`                | ❌ Public | Perbarui Access Token via Refresh Token |
| GET    | `/auth/google/login`      | ❌ Public | Redirect ke halaman login Google      |
| GET    | `/auth/google/callback`   | ❌ Public | Callback setelah autentikasi Google   |
| GET    | `/applications`           | ✅ JWT    | Daftar aplikasi yang terdaftar di SSO |

### Struktur Folder

```
Belajar-SSO/
├── handlers/
│   ├── auth.go      # Register, Login, RefreshToken
│   └── oauth.go     # Google OAuth2 Login & Callback
│   └── apps.go      # Daftar aplikasi SSO
├── middlewares/     # JWT Auth Middleware
├── models/          # Struct User, Token
├── database/        # Koneksi PostgreSQL (go_sso DB)
└── main.go
```

### Environment Variables (SSO)

```env
DB_HOST=postgres_db
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🛰️ Belajar-GO — Tracker Service (Resource Server)

Layanan inti yang mengelola dan memantau status website secara real-time menggunakan **Goroutines**.

### Fitur Utama

- 🔄 **Background Worker** — Otomatis mengecek status semua website terdaftar secara berkala
- ⚡ **Concurrency** — Pemeriksaan berjalan paralel menggunakan Goroutines
- 🔒 **JWT Middleware** — Melindungi endpoint sensitif dari akses tanpa otorisasi
- 📖 **Swagger UI** — Dokumentasi API interaktif tersedia di `/swagger/index.html`

### API Endpoints

| Method | Endpoint    | Auth      | Deskripsi                                    |
|--------|-------------|-----------|----------------------------------------------|
| GET    | `/websites` | ❌ Public | Ambil daftar website beserta status terakhir |
| POST   | `/websites` | ✅ JWT    | Tambah website baru untuk dipantau           |
| POST   | `/check`    | ✅ JWT    | Trigger pemeriksaan status secara manual     |
| GET    | `/swagger/*`| ❌ Public | Swagger UI dokumentasi API                   |

### Struktur Folder

```
Belajar-GO/
├── handlers/     # HTTP handler (GetWebsites, AddWebsite, CheckWebsites)
├── middlewares/  # JWT Auth Middleware
├── models/       # Struct Website, Check
├── workers/      # Background goroutine checker
├── database/     # Koneksi PostgreSQL (gotracker DB)
├── docs/         # Auto-generated Swagger docs
└── main.go
```

### Environment Variables (Tracker)

```env
DB_HOST=postgres_db
DB_USER=personal
DB_PASS=crudence
```

---

## 🖥️ Belajar-FE — Frontend (React + Vite)

Antarmuka pengguna berbasis React yang memvisualisasikan data monitoring dari Tracker API.

### Fitur

- 🔐 Form Login & Register — Terhubung ke Belajar-SSO
- 📊 Dashboard Monitoring — Menampilkan status website secara real-time
- 🪙 JWT di Local Storage — Token disimpan dan dikirim otomatis ke API
- 📱 Responsive — Dibangun dengan Tailwind CSS

### Cara Menjalankan (Development)

```bash
cd Belajar-FE
npm install
npm run dev
# Berjalan di http://localhost:5173
```

### Build & Serve via Docker (Nginx)

```bash
cd Belajar-FE
docker build -t belajar-fe .
docker run -p 80:80 belajar-fe
```

### Environment Variables (Frontend)

```env
# .env
VITE_SSO_URL=http://localhost:8081
VITE_API_URL=http://localhost:8080
```

---

## 🗄️ Skema Database

Sistem menggunakan **2 database** dalam satu instance PostgreSQL:

### Database `go_sso`

```sql
users             -- Data pengguna (username, email, google_id, password_hash)
refresh_tokens    -- Refresh token untuk perpanjangan sesi
applications      -- Daftar aplikasi yang terdaftar di SSO
```

### Database `gotracker`

```sql
websites   -- Daftar URL website yang dipantau
checks     -- Riwayat hasil pemeriksaan status setiap website
```

---

## 🔄 Alur Kerja Sistem

```
1. User buka FE → Isi Form Login
2. FE → POST /login ke SSO
3. SSO → Validasi kredensial, Terbitkan JWT
4. FE → Simpan JWT di Local Storage
5. User buka Dashboard
6. FE → GET /websites + Header "Authorization: Bearer <JWT>"
7. Tracker Middleware → Validasi JWT
8. Tracker → Return data status website
9. FE → Tampilkan tabel real-time ke User
```

---

## 📝 Catatan Pengembangan

- **Google OAuth2**: Client ID dan Secret dikonfigurasi di `docker-compose.yml`. Untuk production, gunakan environment variable terpisah atau secrets manager.
- **JWT Secret**: Pastikan `JWT_SECRET` di kedua layanan Go menggunakan kunci yang sama jika Belajar-GO perlu memvalidasi token dari SSO.
- **Port Clash**: PostgreSQL di-expose ke port `5433` (bukan `5432`) untuk menghindari konflik dengan instalasi PostgreSQL lokal.
- **Swagger**: Jika mengubah handler di Belajar-GO, regenerasi docs dengan: `swag init`

---

## 📚 Dokumentasi Tambahan

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Penjelasan mendalam arsitektur microservices dalam bahasa Indonesia
- [Swagger UI](http://localhost:8080/swagger/index.html) — Dokumentasi API interaktif (saat sistem berjalan)

---

## 👨‍💻 Kontributor

> Proyek ini dibuat sebagai media pembelajaran arsitektur microservices dengan Go.

| Repo          | GitHub                                                |
|---------------|-------------------------------------------------------|
| Belajar-SSO   | [Rayhanyoshh/Belajar-SSO](https://github.com/Rayhanyoshh/Belajar-SSO) |
| Belajar-GO    | [Rayhanyoshh/Belajar-GO](https://github.com/Rayhanyoshh/Belajar-GO)   |
| Belajar-FE    | [Rayhanyoshh/Belajar-FE](https://github.com/Rayhanyoshh/Belajar-FE)   |
