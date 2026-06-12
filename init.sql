-- Buat Database
CREATE DATABASE IF NOT EXISTS library_db;

USE library_db;

-- Tabel Users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100),
    user_email VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    user_address VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(45),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(45),
);

-- Tabel Authors
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    author_country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(45),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(45),
);

-- Tabel Categories
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(45),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(45),
);

-- Tabel Books
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT,
    category_id INT,
    published_year YEAR,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(45),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(45),
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE
    SET
        NULL ON UPDATE CASCADE
);

-- Tabel Borrowings
CREATE TABLE borrowings (
    borrowing_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    borrow_date DATE,
    return_date DATE,
    STATUS ENUM('dipinjam', 'dikembalikan', 'terlambat') DEFAULT 'dikembalikan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(45),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Contoh Data
-- Users
-- PENTING: ganti '$PASSWORD_HASH' di bawah dengan hasil hash dari generateHash.js
INSERT INTO
    users (
        user_name,
        user_email,
        user_password,
        user_phone,
        user_address,
        role
    )
VALUES
    (
        'Laqsha',
        'laqsha@gmail.com',
        '$2b$10$QJqgRQotA6Cx4E92mPn/2eNaE4yy9udTfrUEvuwGHmtpvc6x/.XBK',
        '08123456789',
        'Medan',
        'admin'
    ),
    (
        'Arsad',
        'arsad@gmail.com',
        '$2b$10$QJqgRQotA6Cx4E92mPn/2eNaE4yy9udTfrUEvuwGHmtpvc6x/.XBK',
        '08231434521',
        'Jakarta',
        'user'
    ),
    (
        'Marcellino',
        'marcellino@gmail.com',
        '$2b$10$QJqgRQotA6Cx4E92mPn/2eNaE4yy9udTfrUEvuwGHmtpvc6x/.XBK',
        '08231434522',
        'Kalimantan',
        'user'
    ),
    (
        'Ziham',
        'ziham@gmail.com',
        '$2b$10$QJqgRQotA6Cx4E92mPn/2eNaE4yy9udTfrUEvuwGHmtpvc6x/.XBK',
        '08231434523',
        'Maluku',
        'user'
    ),
    (
        'Andi',
        'andi@gmail.com',
        '$2b$10$QJqgRQotA6Cx4E92mPn/2eNaE4yy9udTfrUEvuwGHmtpvc6x/.XBK',
        '08231434524',
        'Bali',
        'user'
    );

-- Authors
INSERT INTO
    authors (author_name, author_country)
VALUES
    ('Tere Liye', 'Indonesia'),
    ('J.K Rowling', 'UK'),
    ('Andrea Hirata', 'Indonesia'),
    ('George Orwell', 'UK'),
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