# 🚀 CallZ Concierge — Next.js App

Aplikasi web lengkap CallZ dengan semua halaman tersambung.

## Struktur Halaman

| Route | Halaman |
|-------|---------|
| `/` | Landing Page |
| `/login` | Login (Pengguna & Mitra) |
| `/dashboard` | User Dashboard |
| `/dashboard/buat-tugas` | Form Buat Tugas (3 langkah) |
| `/mitra` | Mitra Dashboard |

## Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```

### 3. Buka di browser
```
http://localhost:3000
```

## Alur Navigasi

```
Landing Page (/)
    ↓
Login (/login) — pilih role: Pengguna atau Mitra
    ↓                          ↓
User Dashboard          Mitra Dashboard
(/dashboard)            (/mitra)
    ↓
Buat Tugas
(/dashboard/buat-tugas)
```

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **React 18**

## Catatan
- Login page memiliki toggle role (Pengguna / Mitra)
- Setelah login, otomatis redirect ke dashboard yang sesuai
- Form Buat Tugas memiliki 3 langkah: Pilih Layanan → Lokasi → Detail
- Semua halaman bisa kembali ke Landing Page via logo CALLZ
