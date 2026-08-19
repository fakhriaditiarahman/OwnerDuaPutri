# PRD — Aplikasi Owner Management & Price Reference

**Version:** 1.0 Final
**Platform:** Next.js 16 app router dan Supabase
**Target:** Pemilik Warung/Toko Grosir & Retail
**Primary User:** Owner
**Status:** MVP

---

## 1. Product Overview

Aplikasi ini adalah **aplikasi manajemen sederhana khusus owner** untuk membantu pemilik toko mencatat, mencari, dan memantau **harga modal barang yang dibeli dari supplier/grosir**.

Masalah utama yang ingin diselesaikan:

> Owner sering perlu mengetahui **"barang ini terakhir dibeli berapa per dus?"**, tetapi harus mencari nota atau mengingat harga pembelian sebelumnya.

Aplikasi menyediakan pencarian barang yang cepat sehingga owner cukup mengetik nama barang untuk mendapatkan:

* Modal terakhir
* Tanggal pembelian terakhir
* Supplier terakhir
* Isi per dus
* Riwayat harga pembelian

Aplikasi **bukan aplikasi kasir dan bukan inventory management system**.

---

# 2. Problem Statement

Dalam aktivitas toko grosir/retail, harga beli barang dapat berubah.

Contoh:

```text
Indomie Goreng

28 Juli      Rp108.000 / dus
05 Agustus   Rp110.000 / dus
12 Agustus   Rp112.000 / dus
19 Agustus   Rp115.000 / dus
```

Owner membutuhkan cara cepat untuk mengetahui:

> "Terakhir saya beli Indomie berapa?"

Tanpa aplikasi:

```text
Ingat harga?
     ↓
Tidak ingat
     ↓
Cari nota
     ↓
Cari tanggal
     ↓
Cari barang
     ↓
Baru tahu harga
```

Dengan aplikasi:

```text
Cari "Indomie"
       ↓
Rp115.000 / dus
```

---

# 3. Product Goals

### Primary Goals

1. Mempermudah owner mencari harga modal barang.
2. Menyimpan harga pembelian terakhir.
3. Menyimpan histori perubahan harga modal.
4. Mencatat pembelian dari supplier.
5. Mempermudah pencarian data barang.
6. Mengurangi ketergantungan terhadap nota fisik.
7. Menyediakan informasi pembelian secara sederhana.

### Secondary Goals

* Mengetahui supplier terakhir.
* Mengetahui kapan barang terakhir dibeli.
* Melihat perubahan harga dari waktu ke waktu.
* Menyediakan laporan pembelian sederhana.

---

# 4. Target User

## Owner

Owner merupakan satu-satunya pengguna utama aplikasi.

Owner dapat:

* Melihat dashboard
* Mencari barang
* Menambah barang
* Mengubah barang
* Mencatat pembelian
* Melihat histori harga
* Mengelola supplier
* Melihat riwayat pembelian
* Melihat laporan
* Mengelola pengaturan

Tidak diperlukan role kasir pada MVP.

---

# 5. Product Scope

## Included

### Core

* Dashboard owner
* Data barang
* Search barang
* Detail barang
* Modal terakhir
* Histori harga pembelian
* Pencatatan pembelian
* Supplier
* Riwayat pembelian
* Laporan pembelian

### Optional

* Export laporan
* Backup data
* Import data
* Pengaturan aplikasi

---

# 6. Out of Scope

Fitur berikut **secara sengaja tidak dibuat**:

* ❌ Kasir
* ❌ Checkout
* ❌ Keranjang
* ❌ Pembayaran
* ❌ QRIS
* ❌ Penjualan
* ❌ Inventory
* ❌ Stok
* ❌ Stock opname
* ❌ Gudang
* ❌ Stok minimum
* ❌ Multi-gudang
* ❌ Akuntansi
* ❌ Hutang/piutang
* ❌ Loyalty
* ❌ Membership
* ❌ Multi-cabang
* ❌ Role kasir

Scope harus tetap sederhana agar aplikasi benar-benar sesuai kebutuhan owner.

---

# 7. Information Architecture

Navigation utama:

```text
Owner Management
│
├── Dashboard
│
├── Barang
│   ├── Semua Barang
│   ├── Tambah Barang
│   └── Histori Harga
│
├── Pembelian
│   ├── Pembelian Baru
│   └── Riwayat Pembelian
│
├── Supplier
│
├── Laporan
│
└── Pengaturan
```

---

# 8. Dashboard

Dashboard menjadi halaman pertama setelah owner masuk.

Fokus dashboard adalah **informasi harga dan pembelian**, bukan penjualan.

## 8.1 Search Barang

Bagian paling penting:

```text
┌───────────────────────────────────────┐
│ 🔍 Cari nama barang...                │
└───────────────────────────────────────┘
```

Placeholder:

> Cari barang untuk melihat harga modal terakhir...

Search dapat mencari berdasarkan:

* Nama barang
* Kode barang
* Barcode jika digunakan

---

## 8.2 Summary Cards

Contoh:

```text
Total Barang
245

Pembelian Bulan Ini
32

Supplier
18
```

Tidak menampilkan:

* omzet
* transaksi
* penjualan
* profit

karena bukan fokus aplikasi.

---

## 8.3 Pembelian Terakhir

Menampilkan beberapa pembelian terbaru.

| Barang         | Harga/Dus | Tanggal     |
| -------------- | --------: | ----------- |
| Indomie Goreng | Rp115.000 | 19 Agu 2026 |
| Aqua 600ml     | Rp105.000 | 18 Agu 2026 |
| Teh Pucuk      |  Rp72.000 | 17 Agu 2026 |

---

# 9. Modul Barang

## 9.1 Data Barang

Field utama:

| Field                      | Required |
| -------------------------- | -------- |
| ID Barang                  | Auto     |
| Nama Barang                | ✅        |
| Kategori                   | Optional |
| Satuan                     | ✅        |
| Isi per Dus                | Optional |
| Barcode                    | Optional |
| Modal Terakhir             | Auto     |
| Tanggal Pembelian Terakhir | Auto     |
| Supplier Terakhir          | Auto     |
| Created At                 | Auto     |
| Updated At                 | Auto     |

### Contoh

```text
ID Barang
BRG-0001

Nama
Indomie Goreng

Kategori
Mie Instan

Satuan
Dus

Isi
40 pcs

Modal Terakhir
Rp115.000 / dus

Terakhir Dibeli
19 Agustus 2026

Supplier
PT ABC
```

---

# 10. Pencarian Barang

Search merupakan **fitur Critical**.

## Behavior

Ketika owner mengetik:

```text
indomie
```

sistem menampilkan:

```text
Indomie Goreng

Modal terakhir
Rp115.000 / dus

Terakhir dibeli
19 Agustus 2026

Supplier
PT ABC
```

Search harus:

* Case insensitive
* Realtime
* Cepat
* Mendukung partial keyword
* Tidak perlu reload halaman

Contoh:

```text
"indo"
```

tetap menemukan:

> Indomie Goreng

---

# 11. Detail Barang

Owner dapat membuka detail barang.

```text
INDOMIE GORENG

Modal Terakhir
Rp115.000 / Dus

Terakhir Dibeli
19 Agustus 2026

Supplier Terakhir
PT ABC

Isi
40 pcs / dus
```

Di bawahnya terdapat:

### Histori Harga

| Tanggal     | Supplier | Qty | Harga/Dus |
| ----------- | -------- | --: | --------: |
| 19 Agu 2026 | PT ABC   |  10 | Rp115.000 |
| 12 Agu 2026 | PT ABC   |  10 | Rp112.000 |
| 05 Agu 2026 | PT XYZ   |   5 | Rp110.000 |
| 28 Jul 2026 | PT XYZ   |  10 | Rp108.000 |

---

# 12. Price History

Histori harga adalah salah satu **fitur utama aplikasi**.

Setiap kali owner mencatat pembelian, sistem membuat histori harga.

Contoh:

```text
19 Agustus
Rp115.000

12 Agustus
Rp112.000

05 Agustus
Rp110.000
```

Sistem tidak menghapus histori lama ketika harga berubah.

---

## 12.1 Price Change Indicator

Jika memungkinkan, tampilkan perubahan:

```text
Harga sebelumnya
Rp112.000

Harga terakhir
Rp115.000

Naik
+Rp3.000
(+2,68%)
```

Ini membantu owner mengetahui perubahan modal.

---

# 13. Modul Pembelian

Modul pembelian digunakan untuk mencatat **harga modal barang**.

## Form Pembelian

```text
Supplier
Tanggal Pembelian

Barang
Jumlah Dus
Harga per Dus

Catatan
```

Contoh:

```text
Supplier:
PT ABC

Tanggal:
19 Agustus 2026

Barang:
Indomie Goreng

Jumlah:
10 Dus

Harga:
Rp115.000 / Dus
```

Subtotal:

```text
10 × Rp115.000
=
Rp1.150.000
```

---

# 14. Business Logic Pembelian

Ketika pembelian disimpan:

```text
Pembelian
    ↓
Simpan Purchase
    ↓
Simpan Purchase Item
    ↓
Simpan Price History
    ↓
Update Product
    ↓
Modal Terakhir
Tanggal Terakhir
Supplier Terakhir
```

Contoh:

```text
Harga sebelumnya
Rp112.000

Pembelian baru
Rp115.000

PRODUCTS:
last_purchase_price = 115000
```

Sedangkan histori tetap:

```text
112000
115000
```

---

# 15. Modul Supplier

Data supplier:

```text
Supplier ID
Nama Supplier
Nomor Telepon
Alamat
Catatan
Created At
Updated At
```

Contoh:

```text
SUP-0001

PT ABC

0812xxxxxxxx

Padang
```

Supplier dapat dilihat dari detail pembelian.

---

# 16. Riwayat Pembelian

Menampilkan seluruh pembelian.

| ID      | Tanggal | Supplier |       Total |
| ------- | ------- | -------- | ----------: |
| PUR-001 | 19 Agu  | PT ABC   | Rp1.150.000 |
| PUR-002 | 18 Agu  | PT XYZ   |   Rp850.000 |

Filter:

* Tanggal
* Supplier
* Barang

Search:

```text
🔍 Cari pembelian...
```

---

# 17. Detail Pembelian

Contoh:

```text
PUR-0001

Tanggal
19 Agustus 2026

Supplier
PT ABC

Barang
Indomie Goreng

Jumlah
10 Dus

Harga/Dus
Rp115.000

Total
Rp1.150.000
```

---

# 18. Laporan

## Laporan Pembelian

Filter:

* Hari ini
* Minggu ini
* Bulan ini
* Custom date range

Menampilkan:

```text
Total Pembelian
Rp18.500.000

Jumlah Pembelian
32

Supplier
18
```

### Detail

| Tanggal | Barang  | Supplier | Qty |     Harga |
| ------- | ------- | -------- | --: | --------: |
| 19 Agu  | Indomie | PT ABC   |  10 | Rp115.000 |
| 18 Agu  | Aqua    | PT XYZ   |  20 | Rp105.000 |

---

# 19. Database Design — Google Sheets

Satu Google Spreadsheet digunakan sebagai database utama.

```text
POS_OWNER_DATABASE
│
├── PRODUCTS
├── SUPPLIERS
├── PURCHASES
├── PURCHASE_ITEMS
├── PRICE_HISTORY
└── SETTINGS
```

Tidak diperlukan sheet transaksi penjualan karena aplikasi bukan kasir.

---

# 20. Sheet PRODUCTS

| Column              | Description        |
| ------------------- | ------------------ |
| product_id          | ID unik            |
| barcode             | Barcode            |
| name                | Nama barang        |
| category            | Kategori           |
| unit                | Satuan             |
| pieces_per_box      | Isi per dus        |
| last_purchase_price | Modal terakhir     |
| last_purchase_date  | Pembelian terakhir |
| last_supplier_id    | Supplier terakhir  |
| created_at          | Tanggal dibuat     |
| updated_at          | Tanggal diubah     |

---

# 21. Sheet SUPPLIERS

```text
supplier_id
name
phone
address
notes
created_at
updated_at
```

---

# 22. Sheet PURCHASES

```text
purchase_id
supplier_id
purchase_date
total_amount
notes
created_at
```

---

# 23. Sheet PURCHASE_ITEMS

```text
purchase_item_id
purchase_id
product_id
quantity
price_per_unit
subtotal
```

Karena konteksnya dus, `price_per_unit` berarti:

> **Harga per dus**

---

# 24. Sheet PRICE_HISTORY

```text
history_id
product_id
purchase_id
supplier_id
purchase_date
quantity
price_per_unit
created_at
```

Contoh:

```text
PH-0001
BRG-0001
PUR-0001
SUP-0001
2026-08-19
10
115000
2026-08-19
```

---

# 25. Data Relationship

```text
PRODUCT
   │
   ├───────────────┐
   ↓               ↓
PURCHASE_ITEM   PRICE_HISTORY
   │               │
   ↓               ↓
PURCHASE ─────── SUPPLIER
```

Satu barang dapat memiliki banyak histori pembelian.

```text
Product
   │
   ├── Purchase #1 → Rp108.000
   ├── Purchase #2 → Rp110.000
   ├── Purchase #3 → Rp112.000
   └── Purchase #4 → Rp115.000
```

---

# 26. Google Apps Script Architecture

Architecture:

```text
┌──────────────────────────┐
│       Web Interface      │
│ HTML / CSS / JavaScript  │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│    Google Apps Script    │
│                          │
│ Controller / Services    │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│      Google Sheets       │
│        Database          │
└──────────────────────────┘
```

---

# 27. Recommended Project Structure

```text
Google Apps Script
│
├── Code.gs
│
├── Config.gs
│
├── Utils.gs
│
├── ProductService.gs
├── PurchaseService.gs
├── SupplierService.gs
├── PriceHistoryService.gs
├── ReportService.gs
│
├── ProductRepository.gs
├── PurchaseRepository.gs
├── SupplierRepository.gs
│
└── Frontend
    ├── index.html
    ├── dashboard.html
    ├── products.html
    ├── product-detail.html
    ├── purchases.html
    ├── purchase-form.html
    ├── suppliers.html
    ├── reports.html
    ├── styles.html
    └── scripts.html
```

---

# 28. Apps Script Functions

Minimum backend API:

```text
getDashboardData()

getProducts()
searchProducts(keyword)
getProduct(productId)
createProduct(data)
updateProduct(productId, data)

getSuppliers()
createSupplier(data)
updateSupplier(id, data)

createPurchase(data)
getPurchases(filters)
getPurchase(purchaseId)

getPriceHistory(productId)

getPurchaseReport(filters)
```

Frontend menggunakan:

```javascript
google.script.run
```

untuk memanggil Apps Script.

---

# 29. Search Optimization

Karena Google Sheets digunakan sebagai database, pencarian harus dioptimalkan.

Jangan melakukan:

```text
Frontend
↓
Request setiap karakter
↓
Apps Script
↓
Read seluruh Spreadsheet
```

Setiap kali mengetik.

Lebih baik:

```text
Load products
      ↓
Cache / memory
      ↓
Search di frontend
```

Untuk jumlah barang yang masih relatif kecil.

Jika data sudah besar, gunakan pencarian server-side dan `CacheService`.

---

# 30. Performance Requirements

Target:

| Operation        |    Target |
| ---------------- | --------: |
| Dashboard        | < 3 detik |
| Search           | < 2 detik |
| Detail barang    | < 2 detik |
| Simpan barang    | < 3 detik |
| Simpan pembelian | < 3 detik |
| Histori harga    | < 3 detik |

Gunakan batch read/write ke Google Sheets untuk mengurangi jumlah operasi.

---

# 31. Security

Karena aplikasi berisi informasi harga modal:

* Spreadsheet hanya dapat diakses owner.
* Tidak expose Spreadsheet ID di frontend.
* Validasi input dilakukan di Apps Script.
* Jangan menyimpan credential sensitif di Sheet.
* Gunakan Apps Script Properties untuk konfigurasi sensitif.
* Gunakan `LockService` ketika menyimpan pembelian.
* Jangan mengizinkan client-side menentukan `last_purchase_price` secara langsung.

Harga terakhir harus dihitung berdasarkan transaksi pembelian.

---

# 32. Auditability

Untuk menjaga histori:

**Price History tidak boleh diedit sembarangan.**

Jika terdapat kesalahan pembelian:

```text
Jangan:
Edit histori lama

Lebih baik:
Buat koreksi / record baru
```

Dengan demikian owner tetap memiliki jejak perubahan harga.

---

# 33. UX Principles

Aplikasi digunakan owner toko, sehingga:

### Simple

Jangan terlalu banyak menu.

### Fast

Fokus pada pencarian.

### Mobile Friendly

Harus nyaman di:

* Smartphone
* Tablet
* Laptop

### Search First

Owner harus bisa mengetahui harga modal dalam beberapa detik.

### Minimal Click

Target:

> **Maksimal 3 langkah untuk mengetahui harga terakhir sebuah barang.**

---

# 34. Main User Flow

## Flow 1 — Cek Harga Barang

```text
Dashboard
    ↓
Cari Barang
    ↓
"Indomie"
    ↓
Pilih Indomie Goreng
    ↓
Modal Terakhir
Rp115.000 / Dus
```

---

## Flow 2 — Melihat Histori

```text
Cari Barang
    ↓
Detail Barang
    ↓
Histori Harga
    ↓
Lihat perubahan harga
```

---

## Flow 3 — Mencatat Pembelian

```text
Pembelian Baru
    ↓
Pilih Supplier
    ↓
Pilih Barang
    ↓
Masukkan Qty
    ↓
Masukkan Harga/Dus
    ↓
Simpan
    ↓
Update Modal Terakhir
    ↓
Simpan Histori
```

---

# 35. MVP Release

### Phase 1 — Core

* [ ] Dashboard
* [ ] Data Barang
* [ ] Search Barang
* [ ] Detail Barang
* [ ] Modal Terakhir
* [ ] Histori Harga
* [ ] Supplier
* [ ] Pembelian
* [ ] Riwayat Pembelian

### Phase 2 — Reporting

* [ ] Laporan pembelian
* [ ] Filter tanggal
* [ ] Filter supplier
* [ ] Export Excel
* [ ] Export PDF

### Phase 3 — Enhancement

* [ ] Grafik perubahan harga
* [ ] Import barang dari Excel
* [ ] Backup otomatis
* [ ] Restore data
* [ ] PWA/mobile optimization
* [ ] Notifikasi perubahan harga

---

# 36. Success Criteria

MVP dianggap berhasil apabila owner dapat:

### Scenario A

Mencari:

> `Indomie`

dan dalam beberapa detik mendapatkan:

> **Rp115.000 / dus**

beserta tanggal pembelian terakhir.

### Scenario B

Owner mencatat:

> Indomie — 10 dus — Rp118.000/dus

Maka sistem otomatis:

```text
Modal Terakhir
Rp118.000

Tanggal
tanggal pembelian

Supplier
supplier pembelian
```

dan histori sebelumnya tetap tersimpan.

### Scenario C

Owner dapat melihat:

```text
Rp108.000
     ↓
Rp110.000
     ↓
Rp112.000
     ↓
Rp115.000
```

sehingga mengetahui perkembangan harga modal barang.

---

# 37. Final Product Definition

Produk ini **bukan POS lengkap**.

Produk ini adalah:

> **Aplikasi Owner untuk mengelola data barang, mencatat pembelian, dan mencari harga modal terakhir serta histori harga barang dengan cepat.**

Core value:

```text
       PEMBELIAN
           │
           ↓
     HARGA MODAL
           │
     ┌─────┴─────┐
     ↓           ↓
MODAL TERAKHIR  HISTORI
     │           │
     └─────┬─────┘
           ↓
      🔎 SEARCH
           ↓
     INFORMASI CEPAT
```
