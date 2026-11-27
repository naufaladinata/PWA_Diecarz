# DieCarz

Progressive Web App katalog koleksi diecast (Hot Wheels, MINI GT, Tomica, Majorette, Matchbox, Inno64, dll.). Tugas Akhir Praktikum PPB.

- Demo (Vercel): [ISI TAUTAN DEMO]
- Repo API (Modul 1): [ISI TAUTAN REPO API]
- Pembuat: [ISI NAMA] - NIM [ISI NIM]

## Fitur
Katalog (cari, filter brand/skala/rarity, urutkan), Favorit (server-first + fallback localStorage), Detail dengan spesifikasi dan ulasan, CRUD diecast dengan upload gambar, Profil kolektor, Tentang, mode offline (data lokal), instalasi PWA.

## Stack
React + Vite (JavaScript), Axios, vite-plugin-pwa (Workbox), lucide-react, Tailwind CSS v4 + CSS variables. Backend: REST API buatan sendiri (Modul 1).

## Menjalankan
```bash
npm install
cp .env.example .env      # isi VITE_API_BASE_URL, mis. https://api-anda.example.com
npm run dev
npm run build && npm run preview
```
API wajib HTTPS dan CORS mengizinkan domain Vercel. Bila kontrak API berbeda, ubah di `src/services/` saja.

## Upload ke GitHub dan deploy
```bash
git init
git remote add origin https://github.com/<username>/diecarz.git
git add .
git commit -m "DieCarz PWA"
git branch -M main
git push -u origin main
```
Di Vercel: Add New > Project > import repo, Framework Preset: Vite, tambahkan Environment Variable `VITE_API_BASE_URL`, lalu Deploy.

## Add to Home Screen
- Android (Chrome): buka situs, ketuk banner "Install DieCarz" atau menu titik tiga > Install aplikasi.
- iPhone (Safari): ketuk Bagikan > Add to Home Screen.
