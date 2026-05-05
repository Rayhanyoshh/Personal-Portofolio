# 💕 Sinik&Simil

> Aplikasi mobile informatif untuk pasangan yang sedang mempersiapkan pernikahan dan kehamilan.

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white"/>
  <img src="https://img.shields.io/badge/Language-Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white"/>
  <img src="https://img.shields.io/badge/UI-Jetpack_Compose-4285F4?style=for-the-badge&logo=jetpackcompose&logoColor=white"/>
  <img src="https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
  <img src="https://img.shields.io/badge/Version-1.0.2-FF8A80?style=for-the-badge"/>
</p>

---

## 📖 Tentang Aplikasi

**Sinik&Simil** adalah aplikasi Android yang menjadi teman setia bagi pasangan dalam dua momen paling berharga dalam hidup: **persiapan pernikahan** dan **persiapan kehamilan**. Nama "Sinik" merujuk pada "Siap Nikah" dan "Simil" merujuk pada "Siap Hamil".

Aplikasi ini menyediakan konten artikel yang dikurasi berdasarkan kategori seperti Persiapan, Kesehatan, Finansial, dan Mental — semua yang dibutuhkan pasangan untuk memulai perjalanan baru mereka dengan percaya diri.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📰 **Artikel Informatif** | Konten artikel yang terorganisir dalam dua tab: *Siap Nikah* dan *Siap Hamil* |
| 🔍 **Pencarian & Filter** | Cari artikel berdasarkan kata kunci dan filter berdasarkan kategori |
| 🔖 **Simpan Artikel** | Bookmark artikel favorit untuk dibaca nanti |
| 🔐 **Autentikasi** | Login menggunakan Email/Password atau akun Google |
| 👤 **Profil Pengguna** | Halaman profil dengan manajemen akun |
| 🛡️ **Role-Based Access** | Sistem hak akses bertingkat (Reader, Admin, SuperAdmin) |
| ✍️ **Manajemen Konten** | Admin dapat menambah, mengedit, dan menghapus artikel |
| 👥 **Manajemen Pengguna** | SuperAdmin dapat mengatur peran pengguna |

---

## 🛠️ Tech Stack

### Core
- **Bahasa**: [Kotlin](https://kotlinlang.org/)
- **UI Framework**: [Jetpack Compose](https://developer.android.com/jetpack/compose) + Material Design 3
- **Navigasi**: [Navigation Compose](https://developer.android.com/jetpack/compose/navigation)
- **Architecture**: MVVM (Model-View-ViewModel)

### Backend & Database
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth) (Email/Password + Google Sign-In)
- **Database**: [Cloud Firestore](https://firebase.google.com/products/firestore)

### Libraries
- **Image Loading**: [Coil](https://coil-kt.github.io/coil/) (`io.coil-kt:coil-compose:2.6.0`)
- **ViewModel**: `androidx.lifecycle:lifecycle-viewmodel-compose:2.9.2`
- **Icons**: `androidx.compose.material:material-icons-extended`
- **Play Services**: `com.google.android.gms:play-services-auth:21.2.0`

### Build
- **Min SDK**: 24 (Android 7.0 Nougat)
- **Target SDK**: 36
- **Compile SDK**: 36
- **Build System**: Gradle (Kotlin DSL)

---

## 🏗️ Arsitektur Proyek

Proyek mengikuti pola arsitektur **MVVM (Model-View-ViewModel)** dengan struktur package sebagai berikut:

```
com.rayhanyoshh.siniksimil/
│
├── 📂 data/                        # Layer Data
│   ├── article.kt                  # Data class Article
│   ├── data.kt                     # Data class User
│   ├── NavigationItem.kt           # Model navigasi bawah
│   ├── ProfileMenuItem.kt          # Model item menu profil
│   ├── ArticleRepository.kt        # Operasi CRUD artikel (Firestore)
│   ├── AuthRepository.kt           # Operasi autentikasi (Firebase Auth)
│   ├── UserRepository.kt           # Operasi data pengguna & bookmark
│   └── UserSession.kt              # State pengguna yang sedang login
│
├── 📂 screens/                     # Layer UI (Screens + ViewModels)
│   ├── SplashScreen.kt             # Layar splash / cek sesi login
│   ├── LoginScreen.kt              # Layar login & registrasi
│   ├── LoginViewModel.kt
│   ├── HomeScreen.kt               # Beranda utama dengan tab & filter
│   ├── HomeViewModel.kt
│   ├── AllArticlesScreen.kt        # Daftar semua artikel
│   ├── AllArticlesViewModel.kt
│   ├── ArticleDetailScreen.kt      # Detail bacaan artikel
│   ├── ArticleDetailViewModel.kt
│   ├── SavedArticlesScreen.kt      # Artikel yang dibookmark
│   ├── SavedArticlesViewModel.kt
│   ├── AddArticleScreen.kt         # Form tambah / edit artikel (Admin)
│   ├── AddArticleViewModel.kt
│   ├── ProfileScreen.kt            # Halaman profil pengguna
│   ├── ProfileViewModel.kt
│   ├── UserManagementScreen.kt     # Manajemen pengguna (SuperAdmin)
│   ├── UserManagementViewModel.kt
│   └── MainViewModel.kt            # Menentukan start destination
│
├── 📂 components/                  # Komponen UI yang Reusable
│   ├── ArticleCard.kt              # Kartu artikel
│   ├── BottomNavigationBar.kt      # Navigasi bawah
│   ├── CategoryChips.kt            # Filter kategori
│   ├── EmptyState.kt               # Tampilan kosong
│   ├── MenuItemRow.kt              # Baris item menu
│   ├── ProfileMenuItemRow.kt       # Baris item profil
│   └── SearchBar.kt                # Bar pencarian
│
├── 📂 ui/theme/                    # Tema & Desain
│   ├── Color.kt                    # Palet warna
│   ├── Theme.kt                    # Konfigurasi tema Material 3
│   └── Type.kt                     # Tipografi
│
└── MainActivity.kt                 # Entry point, setup navigasi
```

---

## 🗺️ Alur Navigasi

```
SplashScreen
     │
     ├── (Belum login) ──► LoginScreen ──► HomeScreen
     │                                         │
     └── (Sudah login) ──────────────────► HomeScreen
                                               │
              ┌────────────────────────────────┤
              │                                │
         [Tab Bar]                        [Bottom Nav]
              │                                │
    ┌─────────┼─────────┐         ┌────────────┼────────────┐
    │         │         │         │            │            │
  Nikah    Simil   [Filter]    Articles     Saved       Profile
                                  │
                             ArticleDetail
                                  │
                           AddArticle (Edit)

[Admin FAB] ──► AddArticle (Tambah Baru)
[SuperAdmin] ──► UserManagement
```

---

## 🔐 Sistem Role Pengguna

| Role | Hak Akses |
|------|-----------|
| **Reader** | Baca artikel, simpan bookmark, lihat profil |
| **Admin** | Semua akses Reader + Tambah, Edit, Hapus artikel |
| **SuperAdmin** | Semua akses Admin + Kelola peran semua pengguna |

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat

- [Android Studio](https://developer.android.com/studio) (Giraffe atau lebih baru)
- JDK 11 atau lebih baru
- Akun [Firebase](https://console.firebase.google.com/) yang sudah dikonfigurasi

### Langkah Setup

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/Rayhanyoshh/SinikSimilApp.git
   cd SinikSimilApp
   ```

2. **Setup Firebase:**
   - Buat project baru di [Firebase Console](https://console.firebase.google.com/)
   - Daftarkan app Android dengan package name: `com.rayhanyoshh.siniksimil`
   - Download file `google-services.json` dan letakkan di folder `app/`
   - Aktifkan **Firebase Authentication** (Email/Password & Google)
   - Buat database **Cloud Firestore**

3. **Konfigurasi Google Sign-In:**
   - Di Firebase Console, tambahkan SHA-1 fingerprint dari keystore debug Anda
   - Pastikan `google-services.json` sudah ter-update dengan konfigurasi OAuth

4. **Buka di Android Studio:**
   - Buka Android Studio → **Open** → pilih folder project
   - Tunggu proses Gradle sync selesai

5. **Jalankan aplikasi:**
   - Sambungkan perangkat Android (API 24+) atau gunakan emulator
   - Tekan tombol **Run** ▶️

### Struktur Firestore

```
firestore/
│
├── 📁 articles/
│   └── {articleId}/
│       ├── title: String
│       ├── excerpt: String
│       ├── content: String
│       ├── category: String        # "Persiapan" | "Kesehatan" | "Finansial" | "Mental"
│       ├── mainTab: String         # "nikah" | "hamil"
│       ├── emoji: String
│       ├── imageUrl: String
│       ├── readTimeMinutes: Int
│       └── publishedDate: Timestamp
│
└── 📁 users/
    └── {userId}/
        ├── uid: String
        ├── email: String
        ├── role: String            # "Reader" | "Admin" | "SuperAdmin"
        └── 📁 bookmarks/
            └── {articleId}/
                └── savedAt: Timestamp
```

---

## 🎨 Desain & Tema

Aplikasi menggunakan palet warna **Coral/Salmon** yang hangat dan feminin:

| Nama | Hex | Penggunaan |
|------|-----|------------|
| Coral Primary | `#FF8A80` | Aksi utama, header, tab aktif |
| Light Orange | `#FFAB91` | Elemen sekunder, gradient |
| Warm Peach | `#FFCC91` | Aksen, gradient ujung |
| Warm Cream | `#FFF8F5` | Background utama |

---

## 📦 Versi

| Versi | Perubahan |
|-------|-----------|
| **1.0.2** | Versi terkini — Perbaikan bug & peningkatan performa |
| **1.0.1** | Penambahan fitur Google Sign-In |
| **1.0.0** | Rilis perdana |

---

## 👨‍💻 Developer

**Rayhanyoshh**

[![GitHub](https://img.shields.io/badge/GitHub-Rayhanyoshh-181717?style=flat-square&logo=github)](https://github.com/Rayhanyoshh)

---

## 📄 Lisensi

Project ini dibuat untuk tujuan pembelajaran dan portofolio pribadi.

---

<p align="center">Dibuat dengan ❤️ menggunakan Kotlin & Jetpack Compose</p>
