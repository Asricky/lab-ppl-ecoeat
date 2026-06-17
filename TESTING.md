# EcoEat API Testing Guide

Panduan lengkap untuk testing API EcoEat menggunakan Postman.

## Prasyarat

- Postman terinstall (download dari [postman.com](https://www.postman.com/downloads/))
- Laravel server sudah running di `http://localhost:8000`
- Database sudah di-migrate: `php artisan migrate`

## Setup Awal

### 1. Import Collection

1. Buka Postman
2. Klik tombol **Import** di kiri atas
3. Pilih tab **File** 
4. Browse dan pilih file `EcoEat-API.postman_collection.json`
5. Klik **Import**

Collection akan muncul di sidebar Postman dengan struktur folder lengkap.

### 2. Setup Environment Variables

Setelah import, ikuti langkah ini untuk setup variables:

1. Di sidebar kanan, buka tab **Variables**
2. Anda akan melihat 2 variables:
   - `token` - untuk user biasa
   - `admin_token` - untuk user admin

3. Setelah login (lihat langkah di bawah), copy token dari response
4. Paste ke field **Current Value** di masing-masing variable

## Workflow Testing

### Step 1: Register User Baru

**Request:** `Auth → Register`

Untuk registrasi user biasa (buyer/seller/courier):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

Role yang tersedia: `buyer`, `seller`, `courier`, `lks`, `admin`

Untuk registrasi LKS (Local Knowledge Specialist) - harus include alamat:
```json
{
  "name": "LKS Center",
  "email": "lks@example.com",
  "password": "password123",
  "role": "lks",
  "address": "Jl. Merdeka No. 123, Jakarta",
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

**Expected Response:** 201 Created
```json
{
  "success": true,
  "message": "Registration successful. Please upload KYC documents and wait for admin approval.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

### Step 2: Login

**Request:** `Auth → Login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:** 200 OK
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Action:** Copy token dari response → Paste ke `Postman Variables → token`

### Step 3: Get User Profile

**Request:** `User → Get Profile`

Gunakan token yang sudah disave di variables.

**Expected Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

## Testing Per Module

### 📁 Authentication Endpoints

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/auth/register` | POST | No | 201 Created |
| `/auth/login` | POST | No | 200 OK |
| `/auth/logout` | POST | Yes | 200 OK |

**Testing Tips:**
- Test register dengan email berbeda setiap kali
- Copy token dari login response untuk logout
- Verify token di header: `Authorization: Bearer {token}`

---

### 📁 User Endpoints

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/user/profile` | GET | Yes | 200 OK |

**Testing Tips:**
- Pastikan sudah login terlebih dahulu
- Token harus valid dan tidak expired

---

### 📁 KYC Endpoints

| Endpoint | Method | Auth | Body |
|----------|--------|------|------|
| `/kyc/documents` | POST | No | Form-data |

**Request Body (Form-data):**
```
user_id: 1
document_type: ktp (atau: nib, sim)
document_number: 1234567890123456
file: [upload file]
```

> Catatan: `user_id` harus merujuk pada ID user yang sudah ada di database.

**Expected Response:** 201 Created
```json
{
  "success": true,
  "message": "KYC document uploaded successfully",
  "data": {
    "id": 1,
    "document_type": "id_card",
    "document_number": "1234567890123456",
    "status": "pending"
  }
}
```

---

### 📁 Category Endpoints (Admin Only)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/categories` | GET | No | 200 OK |
| `/admin/categories` | POST | Yes (Admin) | 201 Created |
| `/admin/categories/{id}` | PUT | Yes (Admin) | 200 OK |
| `/admin/categories/{id}` | DELETE | Yes (Admin) | 204 No Content |

**Create Category:**
```json
{
  "name": "Makanan Organik",
  "description": "Produk makanan organik berkualitas tinggi"
}
```

**Update Category:**
```json
{
  "name": "Makanan Organik Premium",
  "description": "Produk makanan organik berkualitas premium"
}
```

---

### 📁 Product Endpoints

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/products` | GET | Yes | 200 OK |
| `/products` | POST | Yes | 201 Created |
| `/products/{id}` | GET | Yes | 200 OK |

**Create Product:**
```json
{
  "name": "Sayuran Organik",
  "description": "Sayuran segar dan organik",
  "price": 50000,
  "category_id": 1,
  "quantity": 100
}
```

---

### 📁 Admin Endpoints (Admin Only)

| Endpoint | Method | Auth | Status |
|----------|--------|------|--------|
| `/admin/users/{id}/approve` | POST | Yes (Admin) | 200 OK |
| `/admin/users/{id}/reject` | POST | Yes (Admin) | 200 OK |

**Approve User:**
```json
{
  "note": "Approved"
}
```

**Reject User:**
```json
{
  "note": "Rejected due to incomplete documents"
}
```

---

### 📁 Test Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/test/users` | GET | No | Lihat semua users |
| `/test/kyc` | GET | No | Lihat semua KYC documents |

## Tips Testing

### 1. **Authorization Header**
Untuk endpoint yang memerlukan auth, pastikan header sudah benar:
```
Authorization: Bearer {{token}}
```

Gunakan variable yang sudah disave agar otomatis berganti.

### 2. **Content-Type Header**
- Untuk JSON: `Content-Type: application/json`
- Untuk Form-data: Postman akan set otomatis saat pilih form-data

### 3. **Path Variables**
Untuk endpoint dengan parameter (seperti `/products/{id}`):
- Ganti `{id}` dengan ID actual
- Contoh: `/products/1`

### 4. **Testing Checklist**
```
✓ Test register baru user
✓ Test login dan copy token
✓ Test get profile dengan token
✓ Test logout
✓ Test get categories tanpa auth
✓ Test create product dengan auth
✓ Test KYC upload
✓ Test admin approve/reject (jika role admin)
```

### 5. **Troubleshooting**

**Error: 401 Unauthorized / Unauthenticated**
- Token belum di-set atau tidak valid
- Pastikan sudah login terlebih dahulu
- Copy token dari login response
- Set di Postman Variables → "Current Value" untuk `token` atau `admin_token`
- Atau ganti `{{token}}` langsung dengan token actual di Authorization header

**Error: 403 Forbidden**
- User tidak punya permission (bukan admin)
- Gunakan admin account untuk endpoint admin
- Pastikan token yang di-kirim adalah dari admin user

**Error: 404 Not Found**
- ID resource tidak ada
- Check database atau create resource dulu

**Error: 422 Unprocessable Entity**
- Validation error
- Check request body dan pastikan sesuai format
- Lihat error message di response untuk detail

## Variable Management

### Menyimpan Token dari Response

Anda bisa setup script di Postman untuk auto-save token:

1. Buka request **Auth → Login**
2. Klik tab **Tests**
3. Paste kode berikut:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
}
```
4. Jalankan request → token akan auto-save

## Export & Share

Untuk share collection dengan team:

1. Klik menu **...** di collection
2. Pilih **Export**
3. Pilih format JSON
4. Team bisa import file tersebut

## Resources

- [Postman Documentation](https://learning.postman.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [Laravel API Documentation](https://laravel.com/docs/)

---

**Happy Testing! 🚀**

Jika ada issue atau pertanyaan, silakan buat issue di GitHub atau hubungi team.
