-- Buat Database
CREATE DATABASE library_db;

USE library_db;

-- Tabel Users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) UNIQUE,
    user_phone VARCHAR(20),
    user_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Authors
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    author_country VARCHAR(50)
);

-- Tabel Categories
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Tabel Books
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT,
    category_id INT,
    published_year Year,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE
    SET
        NULL ON UPDATE CASCADE
);

-- Tabel Borrowings
CREATE TABLE borrowings (
    borrowing_id int AUTO_INCREMENT PRIMARY KEY,
    user_id int,
    borrow_date date,
    return_date date,
    STATUS enum('dipinjam', 'dikembalikan', 'terlambat') DEFAULT 'dikembalikan',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Contoh Data
-- Users
INSERT INTO
    users(user_name, user_email, user_phone, user_address)
VALUES
    (
        'Laqsha',
        'laqsha@gmail.com',
        '08123456789',
        'Medan'
    ),
    (
        'Arsad',
        'arsad@gmail.com',
        '08231434521',
        'Jakarta'
    ),
    (
        'Marcellino',
        'marcellino@gmail.com',
        '08231434522',
        'Kalimantan'
    ),
    (
        'Ziham',
        'ziham@gmail.com',
        '08231434523',
        'Maluku'
    ),
    ('Andi', 'andi@gmail.com', '08231434524', 'Bali');

-- Authors
INSERT INTO
    authors(author_name, author_country)
VALUES
    ('Tere Liye', 'Indonesia'),
    ('J.K Rowling', 'UK'),
    ('Andrea Hirata', 'Indonesia'),
    ("George Orwell", 'UK'),
    ('Haruki Murakami', 'Japan');

-- Categories
INSERT INTO
    categories (category_name)
VALUES
    ('Novel'),
    ('Fantasy'),
    ('Drama'),
    ('Science Fiction'),
    ('Mystery');

-- Books
INSERT INTO
    books (
        title,
        author_id,
        category_id,
        published_year,
        stock
    )
VALUES
    ('Bumi', 1, 1, 2014, 10),
    ('Harry Potter', 2, 2, 1997, 5),
    ('Laskar Pelangi', 3, 3, 2005, 8),
    ('1984', 4, 4, 1949, 6),
    ('Kafka on the Shore', 5, 5, 2002, 7);

-- Borrowings
INSERT INTO
    borrowings (user_id, borrow_date, return_date, STATUS)
VALUES
    (1, '2026-04-01', '2026-04-10', 'dikembalikan'),
    (2, '2026-04-15', NULL, 'dipinjam'),
    (1, '2026-04-18', NULL, 'dipinjam'),
    (2, '2026-03-20', '2026-03-30', 'dikembalikan'),
    (1, '2026-04-05', '2026-04-12', 'terlambat');