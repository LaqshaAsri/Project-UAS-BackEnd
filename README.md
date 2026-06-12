## Daftar Anggota dan Pembagian Tugas

Disini kami bekerja berdasarkan tabel jadi tiap tabel dicoding oleh 1 orang.

- 241111160 - Marcellino Tanaka = Tabel Users
- 241111879 - Ahmad Ziham = Tabel Authors & Borrowings
- 241112227 - Laqsha Asri = Menyiapkan folder kerja (pembuatan database, koneksi ke database) & Tabel Categories
- 241112424 - Tubagus Arsad = Tabel Books

## Struktur Proyek

Folder dan file utama yang harus didownload, bertanda - berarti opsional:
UTS/
├── config/
│ └── db.js
├── models/
│ ├── authorsModel.js
│ ├── booksModel.js
│ ├── borrowingsModel.js
│ ├── categoriesModel.js
│ └── usersModel.js
├── routes/
│ ├── authorsRoute.js
│ ├── booksRoute.js
│ ├── borrowingRoute.js
│ ├── categoriesRoute.js
│ └── usersRoute.js
├── video demo singkat/
│ └── Video Demo Singkat.mp4
├── index.js
├── init.sql
├── package.json
├── package-lock.json
└── README.md

## Panduan Setup:

1. Download Folder UTS yang ada di OneDrive dengan isi utama:
2. config = koneksi ke database
3. models = folder yang menyimpan query ke database untuk memanipulasi data
4. routes = folder yang menyimpan routing
5. index.js = file utama
6. init.sql = inisialisasi sql agar database terbentuk
7. package.json dan package-lock.json
8. Import terlebih dahulu file init.sql di database phpmyadmin agar database terbentuk
9. Lalu masuk ke folder UTS yang telah di download dan lakukan perintah (npm install express mysql2)
10. Run program menggunakan "node index.js" atau "nodemon index.js"
11. Server akan berjalan di: http://127.0.0.1:1140  
    • Program sudah bisa diuji di Postman, ThunderClient atau Software pengetesan API lainnya
12. Notes:
    • Pastikan MySQL sudah berjalan (Apache✔️, MySQL✔️)
    • Pastikan port tidak tabrakan
    • Gunakan JSON body untuk POST/PUT

## Struktur Routing:

- /authors
- /books
- /borrow
- /category
- /users

## Contoh Routing:

- /nama-tabel/ = GET
- /nama-tabel?q=... ?page=...&limit=... = GET Query/Pagination
- /nama-tabel/:id = GET by Id
- /nama-tabel/ = POST
- /nama-tabel/:id = PUT
- /nama-tabel/:id = DELETE by Id
- /nama-tabel/ = DELETE ALL

## Contoh request/response & skema error

#### 1. Tabel Authors

##### Request GET /authors/

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "author_id": 1,
      "author_name": "Tere Liye",
      "author_country": "Indonesia"
    },
    {
      "author_id": 2,
      "author_name": "J.K Rowling",
      "author_country": "UK"
    },
    {
      "author_id": 3,
      "author_name": "Andrea Hirata",
      "author_country": "Indonesia"
    },
    {
      "author_id": 4,
      "author_name": "George Orwell",
      "author_country": "UK"
    },
    {
      "author_id": 5,
      "author_name": "Haruki Murakami",
      "author_country": "Japan"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data author tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request GET /authors?q=novel&page=1&limit=2

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "author_id": 1,
      "author_name": "Tere Liye",
      "author_country": "Indonesia"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data author tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request GET /authors/1

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "author_id": 1,
      "author_name": "Tere Liye",
      "author_country": "Indonesia"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request POST /authors/

**Content-Type: application/json**

**Body**

```json
{
  "author_name": "Pramoedya Ananta Toer",
  "author_country": "Indonesia"
}
```

**Response Success (201) - Data Berhasil ditambahkan**

```json
{
  "status": 201,
  "message": "Berhasil menambahkan data",
  "id": 6
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "author_name wajib diisi"
}
```

**Response Error (400) - Data Duplikat**

```json
{
  "status": 400,
  "message": "Author Name sudah ada"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request PUT /authors/:id

**Content-Type: application/json**

**Body**

```json
{
  "author_name": "Pram",
  "author_country": "Indonesia"
}
```

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Author berhasil diupdate"
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "author_name dan author_country wajib diisi"
}
```

**Response Error (404) - Data Tidak Ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /authors/1

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "status": 200,
  "message": "Author berhasil dihapus"
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /authors/

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "status": 200,
  "message": "Semua data author berhasil dihapus"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

#### 2. Tabel Books

##### Request GET /books/

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "book_id": 1,
      "title": "Laskar Pelangi",
      "author_id": 1,
      "category_id": 2,
      "published_year": 2005,
      "stock": 10
    },
    {
      "book_id": 2,
      "title": "Bumi Manusia",
      "author_id": 2,
      "category_id": 1,
      "published_year": 1980,
      "stock": 5
    },
    {
      "book_id": 3,
      "title": "Bumi Manusia",
      "author_id": 2,
      "category_id": 1,
      "published_year": 1980,
      "stock": 5
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data buku tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

##### Request GET /author?q=tere&page=1&limit=2

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "book_id": 1,
      "title": "Laskar Pelangi",
      "author_id": 1,
      "category_id": 2,
      "published_year": 2005,
      "stock": 10
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data buku tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

##### Request GET /books/1

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "book_id": 1,
      "title": "Laskar Pelangi",
      "author_id": 1,
      "category_id": 2,
      "published_year": 2005,
      "stock": 10
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

##### Request POST /books/

**Content-Type: application/json**

**Body**

```json
{
  "title": "Perahu Kertas",
  "author_id": 3,
  "category_id": 1,
  "published_year": 2009,
  "stock": 7
}
```

**Response Success (201) - Data Berhasil ditambahkan**

```json
{
  "status": 201,
  "message": "Buku berhasil ditambahkan",
  "book_id": 3
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "Isi buku tidak valid"
}
```

**Response Error (400) - Data Duplikat**

```json
{
  "status": 400,
  "message": "Buku sudah ada"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

##### Request PUT /books/:id

**Content-Type: application/json**

**Body**

```json
{
  "title": "Perahu Kertas Edisi Revisi",
  "author_id": 3,
  "category_id": 1,
  "published_year": 2012,
  "stock": 15
}
```

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Buku berhasil diupdate"
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "Isi buku tidak valid"
}
```

**Response Error (404) - Data Tidak Ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

##### Request DELETE /books/1

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "message": "Buku berhasil dihapus"
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

##### Request DELETE /books/

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "message": "buku berhasil dihapus semua"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

#### 3. Tabel Borrowings

##### Request GET /borrow/

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "borrowing_id": 1,
      "user_id": 1,
      "borrow_date": "2026-03-31T17:00:00.000Z",
      "return_date": "2026-04-09T17:00:00.000Z",
      "STATUS": "dikembalikan"
    },
    {
      "borrowing_id": 2,
      "user_id": 2,
      "borrow_date": "2026-04-14T17:00:00.000Z",
      "return_date": null,
      "STATUS": "dipinjam"
    },
    {
      "borrowing_id": 3,
      "user_id": 1,
      "borrow_date": "2026-04-17T17:00:00.000Z",
      "return_date": null,
      "STATUS": "dipinjam"
    },
    {
      "borrowing_id": 4,
      "user_id": 2,
      "borrow_date": "2026-03-19T17:00:00.000Z",
      "return_date": "2026-03-29T17:00:00.000Z",
      "STATUS": "dikembalikan"
    },
    {
      "borrowing_id": 5,
      "user_id": 1,
      "borrow_date": "2026-04-04T17:00:00.000Z",
      "return_date": "2026-04-11T17:00:00.000Z",
      "STATUS": "terlambat"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data borrowing tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request GET /borrow?q=dipinjam&page=1&limit=2

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "borrowing_id": 2,
      "user_id": 2,
      "borrow_date": "2026-04-14T17:00:00.000Z",
      "return_date": null,
      "STATUS": "dipinjam"
    },
    {
      "borrowing_id": 3,
      "user_id": 1,
      "borrow_date": "2026-04-17T17:00:00.000Z",
      "return_date": null,
      "STATUS": "dipinjam"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data borrowing tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request GET /borrow/1

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "borrowing_id": 1,
      "user_id": 1,
      "borrow_date": "2026-03-31T17:00:00.000Z",
      "return_date": "2026-04-09T17:00:00.000Z",
      "STATUS": "dikembalikan"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request POST /borrow/

**Content-Type: application/json**

**Body**

```json
{
  "user_id": 1,
  "borrow_date": "2026-04-20",
  "return_date": "2026-04-27",
  "STATUS": "dipinjam"
}
```

**Response Success (201) - Data Berhasil ditambahkan**

```json
{
  "status": 201,
  "message": "Berhasil menambahkan data",
  "id": 6
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "user_id, borrow_date, dan STATUS wajib diisi"
}
```

**Response Error (400) - Return Date Kosong**

```json
{
  "status": 400,
  "message": "return_date wajib diisi jika STATUS dikembalikan atau terlambat"
}
```

**Response Error (400) - Status Tidak Valid**

```json
{
  "status": 400,
  "message": "STATUS harus dipinjam, dikembalikan, atau terlambat"
}
```

**Response Error (400) - Data Duplikat**

```json
{
  "status": 400,
  "message": "User ini sudah memiliki peminjaman di tanggal yang sama"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request PUT /borrow/:id

**Content-Type: application/json**

**Body**

```json
{
  "return_date": "2026-04-27",
  "STATUS": "dikembalikan"
}
```

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Borrowing berhasil diupdate"
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "STATUS wajib diisi"
}
```

**Response Error (400) - Return Date Kosong**

```json
{
  "status": 400,
  "message": "return_date wajib diisi jika STATUS dikembalikan atau terlambat"
}
```

**Response Error (404) - Data Tidak Ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /borrow/1

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "status": 200,
  "message": "Borrowing berhasil dihapus"
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /borrow/

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "status": 200,
  "message": "Semua data borrowing berhasil dihapus"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

#### 4. Tabel Categories

##### Request GET /category/

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "category_id": 1,
      "category_name": "Novel"
    },
    {
      "category_id": 2,
      "category_name": "Fantasy"
    },
    {
      "category_id": 3,
      "category_name": "Drama"
    },
    {
      "category_id": 4,
      "category_name": "Science Fiction"
    },
    {
      "category_id": 5,
      "category_name": "Mystery"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data kategori tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Error message dari database"
}
```

##### Request GET /category?q=novel&page=1&limit=2

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "category_id": 1,
      "category_name": "Novel"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data kategori tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request GET /category/1

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "category_id": 1,
      "category_name": "Novel"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request POST /category/

**Content-Type: application/json**

**Body**

```json
{
  "category_name": "Horror"
}
```

**Response Success (201) - Data Berhasil ditambahkan**

```json
{
  "status": 201,
  "message": "Berhasil menambahkan data",
  "id": 6
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "category_name wajib diisi"
}
```

**Response Error (400) - Data Duplikat**

```json
{
  "status": 400,
  "message": "Category Name sudah ada"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request PUT /category/:id

**Content-Type: application/json**

**Body**

```json
{
  "category_name": "Romance"
}
```

**Response Success (200) - Data Berhasil diambil**

```json
{
  "message": "Category berhasil diupdate"
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "category_name wajib diisi"
}
```

**Response Error (404) - Data Tidak Ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /category/1

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "message": "Category berhasil dihapus"
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /category/

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "message": "Semua data category berhasil dihapus"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

#### 5. Tabel Users

##### Request GET /users/

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "user_id": 1,
      "user_name": "Laqsha",
      "user_email": "laqsha@gmail.com",
      "user_phone": "08123456789",
      "user_address": "Medan",
      "created_at": "2026-04-18T12:09:21.000Z"
    },
    {
      "user_id": 2,
      "user_name": "Arsad",
      "user_email": "arsad@gmail.com",
      "user_phone": "08231434521",
      "user_address": "Jakarta",
      "created_at": "2026-04-18T12:09:21.000Z"
    },
    {
      "user_id": 3,
      "user_name": "Marcellino",
      "user_email": "marcellino@gmail.com",
      "user_phone": "08231434522",
      "user_address": "Kalimantan",
      "created_at": "2026-04-18T12:09:21.000Z"
    },
    {
      "user_id": 4,
      "user_name": "Ziham",
      "user_email": "ziham@gmail.com",
      "user_phone": "08231434523",
      "user_address": "Maluku",
      "created_at": "2026-04-18T12:09:21.000Z"
    },
    {
      "user_id": 5,
      "user_name": "Andi",
      "user_email": "andi@gmail.com",
      "user_phone": "08231434524",
      "user_address": "Bali",
      "created_at": "2026-04-18T12:09:21.000Z"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data users tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request GET /users?q=Bali&page=1&limit=2

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "user_id": 5,
      "user_name": "Andi",
      "user_email": "andi@gmail.com",
      "user_phone": "08231434524",
      "user_address": "Bali",
      "created_at": "2026-04-21T17:07:05.000Z"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data users tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request GET /users/1

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "Berhasil mengambil data",
  "data": [
    {
      "user_id": 1,
      "user_name": "Laqsha",
      "user_email": "laqsha@gmail.com",
      "user_phone": "08123456789",
      "user_address": "Medan",
      "created_at": "2026-04-21T17:07:05.000Z"
    }
  ]
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data users tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request POST /users/

**Content-Type: application/json**

**Body**

```json
{
  "user_id": 6,
  "user_name": "Ira",
  "user_email": "yayat@gmail.com",
  "user_phone": "6237323688",
  "user_address": "Medan"
}
```

**Response Success (201) - Data Berhasil ditambahkan**

```json
{
  "status": 201,
  "message": "Berhasil menambahkan data",
  "id": 6
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "user_name wajib diisi"
}
```

**Response Error (400) - Data Duplikat**

```json
{
  "status": 400,
  "message": "ID sudah digunakan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request PUT /users/:id

**Content-Type: application/json**

**Body**

```json
{
  "user_name": "Ira",
  "user_email": "Ira@gmail.com",
  "user_phone": "6237323688",
  "user_address": "Medan"
}
```

**Response Success (200) - Data Berhasil diambil**

```json
{
  "status": 200,
  "message": "User berhasil diupdate"
}
```

**Response Error (400) - Field Kosong**

```json
{
  "status": 400,
  "message": "user_name dan user_email wajib diisi"
}
```

**Response Error (404) - Data Tidak Ditemukan**

```json
{
  "status": 404,
  "message": "Data users tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /users/1

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "status": 200,
  "message": "User berhasil dihapus"
}
```

**Response Error (404) - Data Tidak ditemukan**

```json
{
  "status": 404,
  "message": "Data users tidak ditemukan"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```

##### Request DELETE /users/

**Response Success (200) - Data Berhasil dihapus**

```json
{
  "status": 200,
  "message": "Semua data user berhasil dihapus"
}
```

**Response Error (500) - Server Error**

```json
{
  "status": 500,
  "message": "Terjadi kesalahan pada server",
  "error": "Isi pesan error dari database"
}
```
