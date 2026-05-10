# MAINTENANCE.md — Panduan Maintenance EcoEat

> Panduan ini digunakan untuk menjaga stabilitas EcoEat selama pengembangan, integration testing, dan release. Fokus utama: branch discipline, file kritis, QA role-based, dan validasi fitur utama.

---

## 1. Branching dan Alur Merge

### 1.1 Branch Utama

| Branch | Fungsi | Aturan |
|---|---|---|
| `main` | Stabil/production-ready | Tidak boleh push langsung |
| `Integration-testing` | Integrasi fitur antar anggota | Semua feature branch masuk ke sini lebih dulu |
| `Merging` | Kandidat release akhir | Hanya menerima kode yang sudah lolos QA dari `Integration-testing` |
| `feature/<nama-fitur>` | Pengembangan individual | Satu fitur atau satu PBI per branch |
| `fix/<nama-bug>` | Perbaikan bug | Harus menyertakan catatan bug dan hasil retest |

### 1.2 Alur Standar

```txt
feature/<pbi> → Pull Request → Integration-testing → QA Dimas → Merging → final review → main
```

### 1.3 Aturan Merge ke `Integration-testing`

Sebelum membuka PR ke `Integration-testing`:

- [ ] Branch sudah rebase/merge dari `Integration-testing` terbaru.
- [ ] Tidak ada konflik file route group.
- [ ] Tidak ada komponen baru di dalam `app/`.
- [ ] Tidak ada border 1px untuk divider UI.
- [ ] `npm run lint` berhasil.
- [ ] `npx tsc --noEmit` berhasil.
- [ ] Fitur diuji minimal di viewport 360px dan 1280px.
- [ ] Screenshot atau video singkat disertakan untuk fitur UI.
- [ ] Environment variable baru sudah dicatat di README.

### 1.4 Aturan Merge ke `Merging`

Kode hanya boleh masuk ke `Merging` jika:

- [ ] Sudah lolos QA role-based oleh Dimas.
- [ ] Tidak ada bug blocker pada checkout, donasi, tracking, upload, auth, dan verifikasi.
- [ ] Tidak ada console error di browser.
- [ ] Tidak ada error server saat menjalankan flow utama.
- [ ] Semua flow aktor minimal sudah smoke-tested: Admin, Seller, Buyer, LKS, Courier.
- [ ] Build production berhasil.

Perintah final:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## 2. Struktur Project yang Dijaga

```txt
ecoeat/
├── public/
│   └── Logo EcoEat.png
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (buyer)/
│   │   ├── (seller)/
│   │   ├── (lks)/
│   │   ├── (admin)/
│   │   ├── (courier)/
│   │   └── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   ├── types/
│   └── app/globals.css
└── README.md
```

---

## 3. File Kritis Proyek

### 3.1 Auth dan Route Protection

| File | Risiko | Aturan |
|---|---|---|
| `src/middleware.ts` | Salah guard dapat membuka akses role lain | Wajib test semua role setelah perubahan |
| `src/lib/auth.ts` | Login/session rusak | Jangan ubah callback tanpa regression test |
| `src/types/user.ts` | Role mismatch | Role harus konsisten: `admin`, `seller`, `buyer`, `lks`, `courier` |

### 3.2 Store Zustand

| File | Fungsi | Risiko |
|---|---|---|
| `src/stores/authStore.ts` | UI session state | Jangan simpan token sensitif |
| `src/stores/cartStore.ts` | Keranjang Buyer | Bug dapat menyebabkan salah subtotal/stok |
| `src/stores/ecopayStore.ts` | Saldo, top-up state | Saldo final tetap dari server, bukan store |
| `src/stores/mapTrackingStore.ts` | Posisi kurir dan last known location | Pastikan cleanup interval/subscription |
| `src/stores/productFilterStore.ts` | Filter kategori/lokasi/harga | Jangan membuat filter duplikat di page |
| `src/stores/rescueStore.ts` | Donasi dan status LKS | Sinkronkan dengan status rescue server |

### 3.3 Config Leaflet dan Map

| File | Fungsi | Aturan |
|---|---|---|
| `src/lib/map.ts` | `OSM_TILE_URL`, default center, icon init | Semua map import dari sini |
| `src/components/map/MapView.tsx` | Base map reusable | Jangan buat MapContainer baru tanpa alasan kuat |
| `src/components/map/RoutePreview.tsx` | Rute pickup/delivery | Harus handle route gagal |
| `src/components/map/LiveCourierMarker.tsx` | Tracking posisi kurir | Harus punya fallback last known location |

### 3.4 Media dan Upload

| File | Fungsi | Aturan |
|---|---|---|
| `src/lib/cloudinary.ts` | Upload foto/dokumen | Validasi ukuran dan tipe file wajib server-side |
| `src/components/ui/FileUpload.tsx` | Upload dokumen | Pakai ulang untuk Seller dan LKS |
| `src/components/courier/HandoverCapture.tsx` | Foto handover | Wajib stop camera stream setelah selesai |

### 3.5 EcoPay dan Transaksi

| File | Fungsi | Aturan |
|---|---|---|
| `src/lib/ecopay.ts` | Hold, release, refund | Harus atomic/transactional |
| `src/app/api/ecopay/topup/route.ts` | Top-up | Jangan tambah saldo sebelum gateway success |
| `src/app/api/orders/route.ts` | Buat order | Re-check stok sebelum escrow |
| `src/app/api/orders/[id]/complete/route.ts` | Complete order | Release escrow hanya setelah handover valid |

---

## 4. Alur Bisnis yang Wajib Dijaga

### 4.1 Pembelian Surplus

```txt
Buyer pilih produk → cart → checkout → validasi stok → EcoPay escrow hold → Seller siapkan makanan → Kurir pickup → live tracking → handover foto/OTP → completed → escrow release → review
```

Validasi wajib:
- Produk masih `available`.
- `expired_hours_left > 0`.
- Quantity cukup.
- Saldo EcoPay cukup.
- Escrow tercatat di ledger.
- Handover valid sebelum completed.

### 4.2 Donasi ke LKS

```txt
Seller pilih produk donasi → pilih/rekomendasi LKS verified → create rescue → assign kurir → pickup → tracking → distributed → bukti foto → impact updated
```

Validasi wajib:
- LKS `is_verified = true`.
- Produk belum masuk rescue aktif.
- Kurir online tersedia.
- Foto bukti serah terima tersimpan.
- Total porsi donasi masuk dashboard impact.

### 4.3 Auto-Takedown

```txt
Scheduler/checker membaca expired_at → jika melewati batas aman → status taken_down → produk hilang dari katalog dan checkout ditolak
```

---

## 5. Checklist QA Khusus Dimas

> Dimas bertanggung jawab memastikan fitur utama berjalan sebelum release dari `Integration-testing` ke `Merging`.

### 5.1 Auth dan Role Guard

- [ ] User baru dapat memilih role Buyer, Seller, LKS, atau Courier.
- [ ] Buyer tidak bisa membuka route Seller/Admin/LKS/Courier.
- [ ] Seller belum verified tidak bisa membuat listing.
- [ ] LKS belum verified tidak bisa menerima donasi aktif.
- [ ] Admin dapat mengakses halaman verifikasi Seller dan LKS.
- [ ] Logout membersihkan state UI dan cart sensitif.

### 5.2 Seller Flow

- [ ] Seller dapat mengunggah dokumen legalitas.
- [ ] Admin dapat menyetujui/menolak dokumen Seller dengan alasan.
- [ ] Seller verified dapat membuat produk surplus.
- [ ] Produk memiliki nama, foto, kategori, quantity, harga, lokasi, dan expired time.
- [ ] Produk expired tidak muncul di marketplace.
- [ ] Seller dapat memilih produk untuk donasi ke LKS.
- [ ] Dashboard sustainability Seller menampilkan jumlah porsi terselamatkan.

### 5.3 Buyer Flow

- [ ] Buyer dapat melihat daftar produk aktif.
- [ ] Filter kategori, harga, dan lokasi berjalan.
- [ ] Peta Leaflet memuat marker Seller.
- [ ] Buyer dapat menambahkan produk ke cart.
- [ ] Checkout memotong saldo melalui escrow hold, bukan direct release.
- [ ] Jika stok habis saat checkout, transaksi gagal dengan pesan jelas.
- [ ] Buyer dapat memantau status order dan posisi kurir.
- [ ] Buyer dapat memberi rating setelah order completed.

### 5.4 LKS Flow

- [ ] LKS dapat registrasi dan upload dokumen legalitas.
- [ ] Admin dapat memverifikasi atau menolak LKS.
- [ ] LKS verified muncul sebagai tujuan donasi.
- [ ] Dashboard LKS menampilkan donasi masuk dengan status yang benar.
- [ ] LKS dapat melihat detail donasi: Seller, produk, quantity, ETA, dan kurir.
- [ ] Tracking kurir menuju LKS tampil di peta.
- [ ] Riwayat donasi LKS bertambah setelah status `distributed`.
- [ ] Impact LKS menampilkan total porsi diterima.

### 5.5 Courier Flow

- [ ] Kurir dapat toggle online/offline.
- [ ] Kurir online menerima task terdekat.
- [ ] Dua kurir tidak bisa mengambil task yang sama.
- [ ] Route preview muncul untuk pickup dan delivery.
- [ ] Jika GPS mati, sistem menampilkan lokasi terakhir.
- [ ] Kurir dapat mengambil foto handover.
- [ ] Kamera berhenti setelah modal ditutup.
- [ ] Order/rescue berubah completed/distributed setelah bukti valid.

### 5.6 Admin Flow

- [ ] KPI dashboard Admin muncul: users, pending sellers, pending LKS, transactions, meals saved.
- [ ] Admin dapat memfilter transaksi berdasarkan status dan tanggal.
- [ ] Admin dapat mengelola kategori makanan.
- [ ] Admin dapat mengelola direktori LKS.
- [ ] Admin dapat melihat system alerts.
- [ ] Export PDF analytics dapat diunduh.

### 5.7 UI/Responsive

- [ ] Semua halaman aman di viewport 360px.
- [ ] Tidak ada horizontal scroll tidak disengaja.
- [ ] Tidak ada border 1px sebagai divider.
- [ ] Semua card memakai `rounded-2xl`.
- [ ] Semua modal memakai `rounded-3xl`.
- [ ] Logo menggunakan `Logo EcoEat.png`.
- [ ] Button primer memiliki `text-white`.
- [ ] Empty state tersedia pada list kosong.

### 5.8 Map dan Leaflet

- [ ] Tidak ada error SSR Leaflet.
- [ ] Semua icon marker muncul.
- [ ] Tile OSM termuat.
- [ ] Map resize tidak menampilkan area abu-abu.
- [ ] Marker Seller, LKS, dan Kurir memiliki label yang jelas.
- [ ] Route gagal tidak membuat aplikasi crash.

### 5.9 Build dan Regression

- [ ] `npm run lint` berhasil.
- [ ] `npx tsc --noEmit` berhasil.
- [ ] `npm run build` berhasil.
- [ ] Browser console bersih dari error.
- [ ] Network tab tidak menunjukkan API 500 pada flow utama.

---

## 6. Troubleshooting Cepat

### Leaflet error: `window is not defined`
Solusi:
- Pastikan komponen map menggunakan dynamic import atau Client Component.
- Jangan import Leaflet langsung di Server Component.

### Marker Leaflet tidak muncul
Solusi:
- Pastikan `initLeafletIcons()` dipanggil dari `src/lib/map.ts`.
- Pastikan asset marker tidak di-bundle manual tanpa konfigurasi.

### Saldo EcoPay tidak sinkron
Solusi:
- Jangan percaya nilai Zustand sebagai saldo final.
- Refetch ledger dari server setelah top-up/checkout/refund.

### Upload Cloudinary gagal
Solusi:
- Cek ukuran file.
- Cek MIME type.
- Cek environment variable Cloudinary.
- Pastikan server route tidak menerima file kosong.

### Produk masih muncul setelah expired
Solusi:
- Cek `expired_at` dan timezone.
- Cek query marketplace: wajib exclude `expired`, `taken_down`, dan `expired_hours_left <= 0`.

---

## 7. Release Notes Template

```md
## Release <tanggal>

### Fitur Baru
- ...

### Perbaikan
- ...

### QA oleh Dimas
- Auth: pass/fail
- Seller: pass/fail
- Buyer: pass/fail
- LKS: pass/fail
- Courier: pass/fail
- Admin: pass/fail

### Catatan Risiko
- ...
```
