# DESIGN.md — Sistem Desain EcoEat

> Identitas visual EcoEat: modern, minimalis, aesthetic, hijau organik, dan dapat dipercaya. Sistem desain ini berlaku untuk dashboard Buyer, Seller, LKS, Admin, dan Courier.

---

## 1. Prinsip Desain

### 1.1 Modern Food Rescue Interface
EcoEat bukan sekadar dashboard CRUD. EcoEat adalah produk sosial-lingkungan yang harus terasa:

- **Segar:** warna hijau alami, ruang kosong lapang, konten produk makanan menjadi fokus.
- **Terpercaya:** status verifikasi, escrow, ETA kurir, dan bukti handover mudah dipahami.
- **Efisien:** alur checkout, donasi, verifikasi, dan pengiriman minim distraksi.
- **Inklusif:** responsif untuk pengguna mobile, kurir lapangan, LKS, dan admin desktop.

### 1.2 No-Line Rule
Pemisah visual tidak menggunakan garis 1px. Gunakan kombinasi tonal background, spacing, radius, dan shadow ambient.

### 1.3 Tonal Layering
Setiap area UI harus punya hierarki permukaan yang jelas: canvas utama, grouping area, card, dan elevated overlay.

---

## 2. Warna

### 2.1 Background Utama

```css
--background: #F5FCED;
```

`#F5FCED` wajib menjadi warna latar utama aplikasi EcoEat. Warna ini memberi kesan organik, bersih, dan ramah lingkungan.

### 2.2 Hierarki Tonal

| Token | Hex | Fungsi |
|---|---:|---|
| `background` | `#F5FCED` | Kanvas utama seluruh aplikasi |
| `surface` | `#FFFFFF` | Card utama, form, modal content |
| `surface-container-low` | `#EEF8E7` | Section grouping, dashboard panel ringan |
| `surface-container` | `#E5F2DC` | Sidebar, filter bar, stat group |
| `surface-container-high` | `#D8EBCB` | Active state, selected chip, soft highlight |
| `primary` | `#0F5A2A` | CTA utama, icon aktif, brand action |
| `primary-soft` | `#2F8A49` | Hover/secondary brand |
| `secondary` | `#6B7D4F` | Label pendukung dan metadata |
| `accent` | `#F4B942` | Countdown, warning expired soon |
| `success` | `#1F8A4C` | Completed/distributed/verified |
| `danger` | `#B3261E` | Failed/rejected/expired |
| `on-surface` | `#142017` | Teks utama |
| `on-surface-muted` | `#66735F` | Caption, metadata, helper text |

### 2.3 Status Color

| Domain | Status | Warna |
|---|---|---|
| Verification | `pending` | `accent` |
| Verification | `verified` | `success` |
| Verification | `rejected` | `danger` |
| Product | `available` | `success` |
| Product | `expired` / `taken_down` | `danger` |
| Order | `pending` | `accent` |
| Order | `on_delivery` | `primary-soft` |
| Order | `completed` | `success` |
| Rescue | `notified` | `accent` |
| Rescue | `accepted` | `primary-soft` |
| Rescue | `distributed` | `success` |
| Rescue | `failed` | `danger` |

---

## 3. Tipografi

### 3.1 Font

| Kategori | Font | Penggunaan |
|---|---|---|
| Display / Headline | **Manrope** | Hero, angka KPI, judul dashboard, CTA besar |
| Body / UI | **Inter** | Paragraf, form, tabel, metadata, label navigasi |

### 3.2 Skala Tipografi

| Token | Class Contoh | Penggunaan |
|---|---|---|
| `display-lg` | `text-4xl sm:text-5xl font-bold` | Landing hero, total impact besar |
| `display-md` | `text-3xl sm:text-4xl font-bold` | Angka KPI dashboard |
| `heading-lg` | `text-2xl sm:text-3xl font-semibold` | Judul halaman |
| `heading-md` | `text-xl sm:text-2xl font-semibold` | Judul section |
| `body-md` | `text-sm sm:text-base leading-7` | Deskripsi dan konten utama |
| `label-sm` | `text-xs uppercase tracking-[0.08em]` | Status, metadata, kategori |

Aturan:
- Semua teks panjang wajib memakai `leading-relaxed` atau `leading-7`.
- Nama produk panjang wajib `line-clamp-2`.
- Nama user/lembaga di tabel wajib `truncate`.

---

## 4. Radius, Shadow, dan Elevasi

### 4.1 Radius

| Elemen | Radius |
|---|---|
| Card produk | `rounded-2xl` |
| Dashboard panel | `rounded-2xl` atau `rounded-3xl` |
| Modal | `rounded-3xl` |
| Button | `rounded-full` atau `rounded-2xl` |
| Input | `rounded-2xl` |
| Map container | `rounded-2xl` |

### 4.2 Shadow Ambient

Gunakan shadow lembut untuk elemen mengambang.

```css
--shadow-ambient: 0 18px 50px rgba(15, 90, 42, 0.10);
--shadow-card: 0 10px 30px rgba(20, 32, 23, 0.06);
```

Tailwind class yang dianjurkan:

```tsx
<div className="rounded-2xl bg-surface shadow-ambient" />
```

Dilarang menggunakan shadow gelap pekat atau neumorphism ekstrem.

---

## 5. Logo

Semua penggunaan logo wajib memakai file gambar resmi:

```txt
public/logo-ecoeat.png
```

Aturan:
- Jangan membuat ulang logo dengan teks HTML.
- Jangan mengganti warna logo.
- Jangan crop daun/logo secara agresif.
- Gunakan `alt="EcoEat — Delivery & Surplus Food"`.
- Minimal tinggi logo di navbar: 36px desktop, 28px mobile.

Contoh:

```tsx
<Image
  src="/logo-ecoeat.png"
  alt="EcoEat — Delivery & Surplus Food"
  width={150}
  height={64}
  priority
/>
```

---

## 6. Layout dan Grid Responsif

### 6.1 Max Width

| Konteks | Class |
|---|---|
| Buyer dashboard | `max-w-7xl` |
| Seller dashboard | `max-w-7xl` |
| LKS dashboard | `max-w-7xl` |
| Admin dashboard | `max-w-[1440px]` |
| Courier mobile-first | `max-w-5xl` |
| Auth pages | `max-w-2xl` |

### 6.2 Dashboard Buyer

Pola:

```txt
Mobile:  1 kolom
Tablet:  2 kolom produk
Desktop: sidebar filter + grid 3 kolom produk + impact panel
```

Komponen utama:
- Impact summary: meals saved, CO₂ reduced, EcoPay balance.
- Search/filter chips.
- Product grid.
- Map preview makanan terdekat.
- Recent orders.

### 6.3 Dashboard Seller

Pola:

```txt
Desktop 12 kolom:
- 8 kolom: inventory + product list + orders
- 4 kolom: verification status + sustainability + donation shortcut
```

Komponen utama:
- Verification banner.
- Inventory summary.
- Product performance.
- Donation to LKS card.
- Courier tracking active order.

### 6.4 Dashboard LKS

Dashboard LKS wajib setara dengan aktor lain.

Pola:

```txt
Desktop 12 kolom:
- 4 kolom: profil lembaga, verification status, total porsi diterima
- 8 kolom: incoming donations, live delivery map, riwayat distribusi
```

Komponen utama:
- Status verifikasi dokumen LKS.
- Incoming donation queue.
- Detail donasi: Seller, produk, quantity, ETA, storage guideline.
- Map tracking kurir.
- Impact received: total porsi diterima, donasi berhasil, estimasi penerima manfaat.
- History table/card grid.

### 6.5 Dashboard Admin

Pola:

```txt
Desktop:
- KPI strip 4 kolom
- Verification pipeline 2 kolom: Seller + LKS
- Transaction/donation monitoring
- Analytics chart
```

Mobile:
- KPI cards stack.
- Tabel berubah menjadi card grid.
- Action button sticky bottom jika perlu.

### 6.6 Dashboard Courier

Pola:

```txt
Mobile-first:
- Status online/offline sticky top
- Task card aktif
- Map/navigation full-width
- Handover action bottom sheet
```

---

## 7. Komponen UI

### 7.1 Button

Primer:

```tsx
<button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-ambient transition hover:bg-primary-soft">
  Simpan Perubahan
</button>
```

Sekunder:

```tsx
<button className="rounded-full bg-surface-container-high px-5 py-3 text-sm font-semibold text-primary">
  Batal
</button>
```

### 7.2 Card

```tsx
<article className="rounded-2xl bg-surface p-5 shadow-card">
  ...
</article>
```

### 7.3 Input

```tsx
<input className="w-full rounded-2xl bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
```

### 7.4 Map Card

```tsx
<section className="overflow-hidden rounded-2xl bg-surface shadow-card">
  <div className="h-[320px] w-full">
    <MapView />
  </div>
</section>
```

---

## 8. Do and Don't

### Lakukan
- Gunakan `#F5FCED` sebagai background utama.
- Gunakan `rounded-2xl` untuk mayoritas kartu.
- Gunakan `shadow-ambient` hanya untuk elemen penting.
- Gunakan whitespace dan tonal layer sebagai pemisah.
- Gunakan logo resmi `logo-ecoeat.png`.
- Pastikan semua dashboard responsif.
- Pastikan LKS memiliki dashboard lengkap.

### Jangan
- Jangan memakai border 1px sebagai divider.
- Jangan memakai glassmorphism atau backdrop blur.
- Jangan memakai gradient berlebihan.
- Jangan membuat tabel yang memaksa horizontal scroll di mobile.
- Jangan memakai logo berbasis teks manual.
- Jangan memakai warna merah/hijau tanpa label status tekstual.

---

## 9. Bahasa UI

Gunakan Bahasa Indonesia profesional:

| Konteks | Teks |
|---|---|
| Empty produk | “Belum ada makanan surplus tersedia” |
| Empty donasi LKS | “Belum ada donasi masuk untuk lembaga Anda” |
| Success checkout | “Pesanan berhasil dibuat dan saldo EcoPay telah diamankan” |
| Success donasi | “Donasi berhasil dijadwalkan ke LKS terverifikasi” |
| Failed upload | “Unggahan gagal. Periksa ukuran dan format file.” |
| Verification pending | “Dokumen Anda sedang ditinjau oleh Admin” |
| CTA seller | “Tambahkan Produk Surplus” |
| CTA LKS | “Lihat Donasi Masuk” |
| CTA courier | “Terima Tugas” |
