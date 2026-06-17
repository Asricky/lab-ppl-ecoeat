# EcoEat — Platform Penyelamatan Makanan Surplus

**Status Dokumen:** Draft teknis proyek | **Target:** Next.js 14 App Router | **Aktor:** Admin, Seller, Buyer, LKS, Kurir

---

## 1. Deskripsi Produk

**EcoEat** adalah platform web responsif untuk menyelamatkan makanan surplus dari restoran, hotel, kantin, toko roti, dan pelaku usaha makanan lain melalui dua jalur distribusi utama:

1. **Marketplace Surplus Berbayar** — makanan layak konsumsi dijual dengan harga diskon kepada Buyer melalui saldo internal **EcoPay**.
2. **Distribusi Donasi Privat** — Seller dapat menyalurkan makanan secara cuma-cuma kepada **Lembaga Kesejahteraan Sosial (LKS)** atau panti sosial yang telah diverifikasi Admin.

EcoEat menghubungkan **Seller, Buyer, LKS, Kurir, dan Admin** dalam satu ekosistem digital yang transparan. Platform ini menggunakan pemetaan **Leaflet.js + OpenStreetMap** untuk pencarian lokasi makanan, pelacakan kurir, dan distribusi donasi; menggunakan **Cloudinary** untuk penyimpanan media; serta menerapkan mekanisme **escrow EcoPay** untuk menjaga keamanan transaksi.

---

## 2. Visi, Misi, dan Dampak

### Visi
Mewujudkan ekosistem distribusi makanan surplus yang modern, transparan, dan berkelanjutan sehingga makanan layak konsumsi tidak berakhir sebagai limbah, melainkan tersalurkan kepada masyarakat, mahasiswa, dan komunitas rentan yang membutuhkan.

### Misi
- Memfasilitasi restoran, hotel, dan kantin untuk menjual atau mendonasikan makanan surplus secara cepat melalui platform digital.
- Menyediakan aplikasi berbasis web yang dapat diakses melalui browser tanpa instalasi aplikasi tambahan.
- Mengedukasi komunitas mengenai konsumsi bertanggung jawab, pengurangan limbah pangan, dan keberlanjutan lingkungan.
- Menyediakan pemantauan transaksi dan distribusi secara real-time.
- Membangun kolaborasi antara pelaku usaha makanan, pembeli, LKS, dan kurir dalam gerakan penyelamatan pangan.
- Menghasilkan laporan dampak sosial dan lingkungan yang dapat digunakan untuk evaluasi, CSR, dan pelaporan keberlanjutan.

### Fokus SDGs
- **SDG 2 — Zero Hunger:** memperluas akses terhadap makanan berkualitas dan terjangkau.
- **SDG 12 — Responsible Consumption and Production:** mengurangi limbah pangan melalui redistribusi terukur.

---

## 3. Tech Stack

| Kategori | Teknologi | Catatan Implementasi |
|---|---|---|
| Framework | **Next.js 14 App Router** | Route group per aktor: `(auth)`, `(buyer)`, `(seller)`, `(lks)`, `(admin)`, `(courier)` |
| Bahasa | **TypeScript** | Wajib strict typing untuk model transaksi, order, rescue, dan map payload |
| Styling | **Tailwind CSS v4** | Menggunakan token warna EcoEat, `rounded-2xl`, `shadow-ambient`, No-Line Rule |
| State Management | **Zustand** | Store untuk auth/session UI, cart, EcoPay, map tracking, dan dashboard filters |
| Map | **Leaflet.js + React-Leaflet + OpenStreetMap** | Marker Seller, LKS, Kurir, route preview, live tracking |
| Media Storage | **Cloudinary** | Foto produk, dokumen legalitas, bukti handover, foto review |
| Auth | NextAuth.js / JWT-compatible auth | Guard role-based per route group |
| Database | Relational DB via ORM | Entitas: User, Product, Category, Order, OrderItem, LksProfile, EcoPayHistory, Review, FoodRescue |
| API | Next.js API Routes / Server Actions | REST-style endpoints untuk transaksi dan dashboard |
| Report | PDF generation | Laporan dampak sosial bulanan untuk Seller dan Admin |

---

## 4. Aktor dan Dashboard

### 4.1 Admin
Admin adalah pengelola sistem pusat yang bertanggung jawab atas verifikasi, monitoring, dan pengendalian master data.

Fitur utama:
- Mengelola akun Seller, Buyer, Kurir, LKS, dan Admin.
- Memverifikasi legalitas Seller dan dokumen LKS/Panti Sosial.
- Mengelola kategori makanan dan direktori LKS.
- Memantau transaksi penjualan, transaksi donasi, dan status distribusi.
- Mengakses dashboard dampak sosial: porsi terselamatkan, donasi berhasil, transaksi surplus, estimasi reduksi limbah, dan reduksi emisi karbon.
- Mengunduh laporan PDF bulanan.

### 4.2 Seller
Seller adalah restoran, hotel, kantin, atau penyedia makanan yang memiliki surplus layak konsumsi.

Fitur utama:
- Registrasi bisnis dan unggah dokumen legalitas.
- Mengelola profil usaha, lokasi presisi, dan stok surplus.
- Membuat listing produk dengan nama, kategori, foto, harga diskon, jumlah porsi, lokasi, dan `expired_hours_left`.
- Menentukan jalur distribusi: **jual ke Buyer** atau **donasi privat ke LKS**.
- Melihat status pesanan, posisi kurir, riwayat kontribusi, dan laporan sustainability.

### 4.3 Buyer
Buyer adalah pembeli umum atau mahasiswa yang mencari makanan surplus berkualitas dengan harga terjangkau.

Fitur utama:
- Registrasi, login, dan pengelolaan profil.
- Top-up saldo EcoPay.
- Menelusuri makanan berdasarkan peta, kategori, harga, lokasi, dan waktu kedaluwarsa.
- Checkout produk melalui EcoPay.
- Melacak kurir secara real-time.
- Memberikan rating dan feedback setelah transaksi selesai.

### 4.4 LKS
LKS adalah lembaga sosial/panti sosial yang menerima distribusi makanan donasi dari Seller.

Fitur utama:
- Registrasi profil lembaga dan unggah dokumen legalitas.
- Menunggu verifikasi Admin sebelum muncul dalam direktori donasi.
- Mengelola profil lembaga: nama, penanggung jawab, nomor kontak, alamat, koordinat, dan status operasional.
- Melihat daftar donasi masuk: `notified`, `accepted`, `picked_up`, `distributed`, `failed`.
- Mengonfirmasi penerimaan donasi bila diperlukan melalui kode OTP atau bukti foto handover.
- Melihat riwayat penerimaan donasi dan total porsi makanan diterima.

### 4.5 Kurir
Kurir bertanggung jawab atas pengambilan makanan dari Seller dan pengantaran ke Buyer atau LKS.

Fitur utama:
- Mengelola status ketersediaan: online/offline.
- Menerima penugasan otomatis berdasarkan lokasi terdekat.
- Mengakses navigasi rute tercepat berbasis OpenStreetMap.
- Mengunggah bukti foto serah terima.
- Menyelesaikan order atau distribusi donasi melalui validasi foto/OTP.

---

## 5. Product Backlog Items per Penanggung Jawab

> PBI di bawah mengikuti kebutuhan fungsional EcoEat dan dikelompokkan berdasarkan anggota tim.

### Lukas Ricky Krisjatmiko — FE Lead / Seller & Master Data Flow
| PBI | Fitur | Detail Scope | Output |
|---|---|---|---|
| PBI-04 | Manajemen Katalog Surplus | Form input produk, foto, harga asli, harga diskon, jumlah porsi, kategori, lokasi, dan sisa jam layak konsumsi | Seller dapat membuat dan memperbarui listing aktif |
| PBI-05 | Manajemen Direktori LKS | UI Admin untuk melihat, mencari, memfilter, menambah, menonaktifkan, dan mengedit profil LKS | Direktori tujuan donasi terverifikasi |
| PBI-06 | Klasifikasi Kategori Makanan | CRUD kategori makanan beserta ikon dan storage guideline | Kategori siap dipakai untuk katalog, filter, dan guideline |
| PBI-09 | Auto-Takedown Kedaluwarsa | Indikator countdown, status expired/taken_down, dan handling UI produk kedaluwarsa | Listing tidak aman otomatis hilang dari katalog |

### Sridamai Wati Panjaitan — Inventory, Safety Guideline, dan Seller Dashboard
| PBI | Fitur | Detail Scope | Output |
|---|---|---|---|
| PBI-07 | Sistem Inventori Pintar | Dashboard stok Seller, update quantity, status stok, dan rekomendasi jual/donasi | Seller dapat mengelola surplus sebelum dipublikasikan |
| PBI-08 | Panduan Penanganan Produk | Storage guideline otomatis berdasarkan kategori: suhu ruang, pendingin, pemanasan ulang, dan batas aman | Buyer/Seller melihat instruksi keamanan pangan |
| PBI-20 | Laporan Keberlanjutan Bulanan | Tampilan ringkasan kontribusi Seller dan export PDF | Seller memiliki laporan CSR/sustainability |

### Alya Davina Maharani — Auth, Verification, dan Onboarding
| PBI | Fitur | Detail Scope | Output |
|---|---|---|---|
| PBI-01 | Registrasi Multi-Aktor | Role selection Buyer/Seller/Courier/LKS, validasi email/telepon, password hashing, redirect sesuai role | Akun role-based terbentuk |
| PBI-02 | Verifikasi Legalitas Seller | Upload dokumen Seller, status pending/verified/rejected, preview file, alasan penolakan | Seller hanya dapat berjualan setelah verified |
| PBI-03 | Verifikasi Legalitas LKS | Upload dokumen LKS, pipeline verifikasi Admin, status aktif/nonaktif | LKS valid masuk direktori donasi |
| PBI-12 | Riwayat Transaksi & Donasi | Riwayat Buyer, Seller, dan LKS dengan filter status/tanggal | Semua aktor punya audit trail operasional |

### Gyebran Nauri Haikal — LKS, Kurir, dan Distribusi Donasi
| PBI | Fitur | Detail Scope | Output |
|---|---|---|---|
| PBI-16 | Manajemen Titik Distribusi LKS | Koordinat LKS, radius layanan, status operasional, peta tujuan donasi | Sistem dapat memilih LKS terdekat |
| PBI-17 | Penugasan Kurir Otomatis | Assignment berdasarkan jarak, status online, dan race condition handling | Kurir terdekat menerima tugas |
| PBI-18 | Validasi Handover Foto | Upload foto bukti serah terima, kompresi client-side, simpan URL Cloudinary | Order/rescue dapat diselesaikan dengan bukti valid |
| PBI-24 | Dashboard LKS | Ringkasan donasi masuk, jadwal penerimaan, histori distribusi, total porsi diterima | LKS mendapat dashboard setara aktor lain |

### Ahmad Faiz Althaf Nur — EcoPay, Escrow, dan Checkout
| PBI | Fitur | Detail Scope | Output |
|---|---|---|---|
| PBI-10 | Top-Up Saldo EcoPay | Nominal top-up, payment gateway redirect, status pending/success/failed | Saldo Buyer bertambah setelah pembayaran valid |
| PBI-11 | Escrow & Refund EcoPay | Hold dana saat order, release setelah validasi, refund saat gagal | Transaksi lebih aman dan auditabel |
| PBI-22 | Invoice dan Receipt | Nomor order, detail item, subtotal, ongkir, total, status escrow | Buyer dan Seller mendapat bukti transaksi |

### Muhammad Farras Kamil — Analytics, Sustainability, dan Reporting
| PBI | Fitur | Detail Scope | Output |
|---|---|---|---|
| PBI-19 | Dashboard Analitik Dampak | Total meals saved, total donations, total transactions, carbon/water saved | Admin melihat dampak platform secara agregat |
| PBI-21 | Feedback & Rating | Rating 1–5, komentar, foto review opsional, sanitasi XSS | Reputasi Seller dapat dihitung |
| PBI-23 | Report & Analytics Export | Export PDF/CSV untuk Admin/Seller, filter periode | Laporan siap digunakan untuk evaluasi |

### Dimas Al Gazali — Map, Tracking, QA, dan Release Validation
| PBI | Fitur | Detail Scope | Output |
|---|---|---|---|
| PBI-13 | Pemetaan Leaflet.js & OSM | Marker Seller, marker LKS, marker Kurir, peta produk aktif | Buyer dapat menemukan makanan terdekat |
| PBI-14 | Live Tracking Pengiriman | Posisi Kurir real-time, last known location, estimasi kedatangan | Buyer/Seller/LKS dapat memantau distribusi |
| PBI-15 | Optimasi Rute Pengantaran | Rekomendasi rute tercepat berbasis OSM | Kurir mendapat rute distribusi efisien |
| PBI-QA | End-to-End Testing | Validasi semua role, checkout, donasi, tracking, upload, report | Build siap release ke integration branch |

---

## 6. Struktur Folder Standar

```txt
src/
├── app/
│   ├── (auth)/
│   ├── (buyer)/
│   ├── (seller)/
│   ├── (lks)/
│   ├── (admin)/
│   ├── (courier)/
│   └── api/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── order/
│   ├── rescue/
│   ├── map/
│   └── dashboard/
├── hooks/
├── lib/
├── stores/
├── types/
└── styles/
```

---

## 7. Setup Proyek

### Prasyarat
- Node.js >= 18.18
- npm >= 9
- Akun Cloudinary untuk upload media
- Database URL development
- Environment variable auth dan payment gateway

### Instalasi

```bash
# 1. Clone repository
git clone <repository-url>
cd ecoeat

# 2. Install dependencies
npm install

# 3. Siapkan environment
cp .env.example .env.local

# 4. Generate ORM client jika menggunakan Prisma
npx prisma generate

# 5. Jalankan development server
npm run dev
```

### Environment Minimum

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
PAYMENT_GATEWAY_SERVER_KEY="..."
OSM_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
```

### Perintah Validasi Sebelum Commit

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## 8. Business Rules Kritis

- Produk dengan `expired_hours_left <= 0` wajib `taken_down` dan tidak boleh masuk katalog.
- Produk donasi hanya boleh dikirim ke LKS berstatus `is_verified = true`.
- Dana EcoPay wajib masuk escrow sampai handover tervalidasi.
- Satu produk donasi hanya boleh memiliki maksimal satu record rescue aktif.
- Bukti serah terima wajib berupa foto atau OTP fallback.
- Laporan dampak sosial mengambil data dari transaksi completed/distributed saja.

---

## 9. Akun Uji Coba (Demo Accounts)

Untuk mempermudah pengujian alur multi-aktor, database telah di-seed dengan akun bawaan untuk masing-masing role berikut:

| Role | Email | Password | Catatan Status |
|---|---|---|---|
| **Admin** | `admin@ecoeat.com` | `password` | Approved |
| **Buyer** | `buyer@ecoeat.com` | `password123` | Approved (Saldo EcoPay: Rp 1.000.000) |
| **Seller** | `seller@ecoeat.com` | `password123` | Approved (Profil Warung EcoEat) |
| **Courier (Kurir)** | `courier@ecoeat.com` | `password123` | Approved (Profil Motor D 1234 AB) |
| **LKS (Panti Sosial)** | `lks@ecoeat.com` | `password123` | Approved (Profil Panti Asuhan EcoEat) |

Jalankan perintah berikut untuk me-reset dan mengisi ulang database dengan data uji coba:
```bash
php artisan migrate:fresh --seed
```
