# Agents.md — Panduan AI & Coding untuk EcoEat

> Dokumen ini wajib dibaca sebelum melakukan coding, refactor, atau generate komponen menggunakan AI. Tujuannya menjaga konsistensi arsitektur, desain, dan kualitas implementasi EcoEat.

---

## 1. Identitas Proyek

**EcoEat** adalah platform penyelamatan makanan surplus yang menggabungkan marketplace diskon, donasi privat ke LKS, distribusi kurir, EcoPay, live tracking, dan laporan dampak sosial.

### Karakter Produk
- **Modern** — UI bersih, ringan, responsif, dan berbasis dashboard per aktor.
- **Minimalis** — tidak berlebihan secara visual; fokus pada makanan, status, lokasi, dan dampak.
- **Aesthetic** — nuansa hijau organik, ruang kosong lapang, tonal layering, radius besar, dan shadow lembut.
- **Trustworthy** — menampilkan verifikasi, bukti handover, status escrow, dan audit trail secara jelas.

---

## 2. Aturan STRICT Arsitektur

### 2.1 Folder `components/` Harus di Luar `app/`

Struktur yang benar:

```txt
ppl-ecoeat/
├── app/
│   ├── (auth)/
│   ├── (buyer)/
│   ├── (seller)/
│   ├── (lks)/
│   ├── (admin)/
│   └── (courier)/
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
└── types/
```

**Dilarang:**

```txt
app/(buyer)/components/...
app/(seller)/components/...
app/(admin)/components/...
```

Alasannya: komponen EcoEat banyak dipakai lintas aktor. Meletakkan komponen di dalam `app/` akan memicu duplikasi dan menyulitkan refactor.

---

## 3. Route Group dan Guard

### `(auth)` — Login, Register, Role Selection
- Halaman publik.
- Tidak boleh mengakses dashboard jika user sudah login.
- Role selection harus mengarahkan user ke flow registrasi yang sesuai: Buyer, Seller, LKS, Courier.
- Seller dan LKS harus masuk status `pending verification` setelah upload dokumen.

### `(buyer)` — Marketplace dan Order Buyer
Rute utama:

```txt
/(buyer)/dashboard
/(buyer)/products
/(buyer)/products/[id]
/(buyer)/cart
/(buyer)/checkout
/(buyer)/orders
/(buyer)/orders/[id]
/(buyer)/tracking/[orderId]
/(buyer)/ecopay
/(buyer)/profile
```

Aturan coding:
- Semua list produk harus memfilter `status = available` dan `expired_hours_left > 0`.
- Gunakan komponen `ProductCard`, `EcoPayBalance`, `OrderStatusBadge`, dan `MapPreview`.
- Checkout wajib memeriksa stok ulang sebelum memotong saldo.
- Tracking wajib punya fallback `lastKnownLocation` jika update kurir gagal.

### `(seller)` — Katalog, Inventori, Donasi, Sustainability
Rute utama:

```txt
/(seller)/dashboard
/(seller)/products
/(seller)/products/new
/(seller)/inventory
/(seller)/orders
/(seller)/donations
/(seller)/sustainability
/(seller)/verification
/(seller)/profile
```

Aturan coding:
- Seller yang belum verified hanya boleh mengakses `verification`, `profile`, dan dashboard status.
- Listing produk wajib memiliki foto, kategori, jumlah porsi, harga diskon atau flag donasi, lokasi, dan waktu kedaluwarsa.
- Jangan izinkan produk expired masuk flow checkout.
- Jalur donasi harus memilih LKS verified atau memakai rekomendasi LKS terdekat.

### `(lks)` — Dashboard Lembaga Kesejahteraan Sosial
Rute utama:

```txt
/(lks)/dashboard
/(lks)/incoming-donations
/(lks)/incoming-donations/[id]
/(lks)/history
/(lks)/impact
/(lks)/verification
/(lks)/profile
```

Aturan coding:
- Dashboard LKS harus setara secara kualitas dengan Buyer/Seller/Admin, bukan halaman sekunder.
- LKS belum verified hanya boleh mengakses `verification` dan `profile`.
- Incoming donations wajib menampilkan status: `notified`, `accepted`, `picked_up`, `distributed`, `failed`.
- Tampilkan informasi Seller, nama produk, jumlah porsi, ETA kurir, alamat pickup, bukti handover, dan catatan keamanan pangan.
- LKS tidak melakukan pembayaran; jangan tampilkan EcoPay di dashboard LKS kecuali untuk audit informasi non-transaksional.

### `(admin)` — Control Center
Rute utama:

```txt
/(admin)/dashboard
/(admin)/users
/(admin)/verifications/sellers
/(admin)/verifications/lks
/(admin)/categories
/(admin)/lks-directory
/(admin)/transactions
/(admin)/donations
/(admin)/analytics
/(admin)/system-alerts
```

Aturan coding:
- Admin dashboard wajib menampilkan pipeline verifikasi Seller dan LKS.
- Tabel besar harus punya versi responsive card grid untuk mobile.
- Jangan hard-delete data historis transaksi; gunakan status archive/suspended jika terkait audit.
- Semua action verifikasi/penolakan wajib memiliki toast dan audit reason.

### `(courier)` — Assignment dan Delivery
Rute utama:

```txt
/(courier)/dashboard
/(courier)/tasks
/(courier)/tasks/[id]
/(courier)/navigation/[taskId]
/(courier)/handover/[taskId]
/(courier)/history
/(courier)/profile
```

Aturan coding:
- Kurir harus bisa toggle online/offline.
- Assignment harus menghindari race condition: request pertama yang valid mengunci task.
- Handover wajib foto; OTP hanya fallback.
- Pastikan kamera dimatikan setelah capture atau keluar halaman.

---

## 4. Komponen Reusable Wajib

| Komponen | Lokasi | Fungsi |
|---|---|---|
| `StatusBadge` | `components/ui/StatusBadge.tsx` | Badge status order/rescue/user verification |
| `EcoPayBalance` | `components/ecopay/EcoPayBalance.tsx` | Saldo dan CTA top-up |
| `ProductCard` | `components/product/ProductCard.tsx` | Kartu produk marketplace |
| `ProductForm` | `components/product/ProductForm.tsx` | Form listing Seller |
| `MapView` | `components/map/MapView.tsx` | Peta Leaflet reusable |
| `RoutePreview` | `components/map/RoutePreview.tsx` | Preview rute kurir |
| `DashboardMetricCard` | `components/dashboard/DashboardMetricCard.tsx` | KPI per aktor |
| `VerificationPanel` | `components/admin/VerificationPanel.tsx` | Review dokumen Seller/LKS |
| `HandoverCapture` | `components/courier/HandoverCapture.tsx` | Capture/upload bukti serah terima |
| `EmptyState` | `components/ui/EmptyState.tsx` | State kosong standar |
| `Toast` | `components/ui/Toast.tsx` | Feedback global |

---

## 5. Store Zustand

Pisahkan store berdasarkan domain, bukan berdasarkan halaman.

```txt
src/stores/
├── authStore.ts
├── cartStore.ts
├── ecopayStore.ts
├── mapTrackingStore.ts
├── productFilterStore.ts
├── sellerInventoryStore.ts
└── rescueStore.ts
```

Aturan:
- Jangan simpan data rahasia seperti token mentah di Zustand.
- Store hanya untuk state UI/client; data authoritative tetap dari server.
- Filter dan sort boleh di Zustand bila dipakai lintas halaman.
- Cart harus sinkron dengan validasi server saat checkout.

---

## 6. Checklist Anti-Redundansi Kode

Sebelum membuat file baru, wajib cek:

- [ ] Apakah sudah ada komponen serupa di `components/ui/`?
- [ ] Apakah sudah ada domain component di `product/`, `order/`, `rescue/`, `map/`, atau `dashboard/`?
- [ ] Apakah sudah ada hook serupa di `hooks/`?
- [ ] Apakah logic status sudah tersedia di `types/` atau `lib/`?
- [ ] Apakah fetcher/API client sudah ada?
- [ ] Apakah schema tipe response sudah didefinisikan?
- [ ] Apakah styling bisa memakai token Tailwind, bukan arbitrary class baru?
- [ ] Apakah error bisa ditangani oleh Toast, bukan inline duplicate alert?

**Dilarang:**
- Membuat `ProductCardBuyer`, `ProductCardSeller`, `ProductCardAdmin` jika satu `ProductCard` bisa menerima variant.
- Menulis ulang logic warna status di setiap file.
- Membuat beberapa modal upload file yang fungsinya sama.
- Membuat komponen map baru tanpa alasan teknis.

---

## 7. No-Line Rule

EcoEat menggunakan pemisahan visual berbasis whitespace, tonal layer, dan elevation.

**Dilarang:**

```tsx
<div className="border border-gray-200" />
<hr />
<div className="border-b" />
```

**Gunakan:**

```tsx
<section className="bg-surface-container-low rounded-2xl p-4 sm:p-6">
  <div className="bg-surface rounded-2xl p-5 shadow-ambient">
    ...
  </div>
</section>
```

Exception sangat terbatas:
- Focus ring input.
- Ghost outline dengan opacity rendah untuk upload dropzone.
- Debug sementara, wajib dihapus sebelum commit.

---

## 8. Pola Coding Wajib

### 8.1 Server dan Client Component
- `page.tsx` default sebagai Server Component.
- State, event, map, kamera, dan interactive chart masuk `*Client.tsx`.
- Jangan fetch data besar di Client jika bisa dilakukan di Server.

### 8.2 Error Handling
- Gunakan `try/catch` di action penting.
- Tampilkan feedback via Toast.
- Logging teknis boleh di server, tetapi jangan bocorkan detail database ke UI.

### 8.3 Loading State
- Semua tombol async wajib punya `isLoading`.
- Semua dashboard wajib punya skeleton atau empty state.
- Map wajib punya fallback saat tile gagal dimuat.

### 8.4 Naming
- Komponen: `PascalCase`.
- Hook: `useCamelCase`.
- Store: `camelCaseStore`.
- Type: `PascalCase`.
- Route: lowercase kebab jika diperlukan.

---

## 9. File Sensitif

Jangan modifikasi sembarangan:

- `middleware.ts` — proteksi route.
- `lib/auth.ts` — konfigurasi auth/JWT.
- `lib/map.ts` — konfigurasi Leaflet/OSM.
- `lib/cloudinary.ts` — upload media.
- `lib/ecopay.ts` — escrow, refund, ledger.
- `types/status.ts` — status order/rescue/verification.
- `stores/cartStore.ts` — rawan bug checkout.
- `app/globals.css` — token desain global.
- `DESIGN.md` — sumber standar desain.

---

## 10. Definition of Done untuk AI-Generated Code

- [ ] Tidak ada komponen baru di dalam `app/`.
- [ ] Tidak ada border 1px untuk sekat visual.
- [ ] Semua tombol primer memakai `text-white`.
- [ ] Semua halaman responsif dari 360px sampai 1440px.
- [ ] Semua list panjang memiliki empty/loading/error state.
- [ ] Semua action penting memiliki Toast.
- [ ] Peta memakai konfigurasi dari `lib/map.ts`.
- [ ] Upload foto memakai util Cloudinary yang sama.
- [ ] Tidak ada logic status/warna duplikat.
- [ ] `npx tsc --noEmit` berhasil sebelum merge.
