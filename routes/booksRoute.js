import express from "express";
import booksModel from "../models/booksModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { q, page, limit } = req.query;

  if (q || page || limit) {
    booksModel.getBookbyQuery({ q, page, limit }, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server",
          error: err.message,
        });
      }
      if (result.data.length === 0) {
        return res.status(200).json({
          status: 200,
          message: "Data buku tidak ditemukan",
          total: 0,
          data: [],
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data",
        total: result.total,
        data: result.data,
      });
    });
  } else {
    booksModel.getAllBooks((err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan pada server",
          error: err.message,
        });
      }
      if (result.length === 0) {
        return res.status(200).json({
          status: 200,
          message: "Data buku tidak ditemukan",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengambil data",
        data: result,
      });
    });
  }
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  booksModel.getBookbyId(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data tidak ditemukan",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data",
      data: result,
    });
  });
});

router.post("/", verifyToken, (req, res) => {
  const { title, author_id, category_id, published_year, stock } = req.body;

  if (!title || !author_id || !category_id || !published_year || stock === undefined || stock === "") {
    return res.status(400).json({
      status: 400,
      message: "title, author_id, category_id, published_year, dan stock wajib diisi",
    });
  }

  const book = {
    title,
    author_id,
    category_id,
    published_year,
    stock,
    created_by: req.user.email,
    updated_by: req.user.email,
  };

  booksModel.addBook(book, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({
        status: 400,
        message: "Isi buku tidak valid",
      });
    }

    res.status(201).json({
      status: 201,
      message: "Buku berhasil ditambahkan",
      book_id: result.insertId,
    });
  });
});

router.put("/:id", verifyToken, (req, res) => {
  const { title, author_id, category_id, published_year, stock } = req.body;

  if (!title || !author_id || !category_id || !published_year || stock === undefined || stock === "") {
    return res.status(400).json({
      status: 400,
      message: "title, author_id, category_id, published_year, dan stock wajib diisi",
    });
  }

  const book = {
    book_id: req.params.id,
    title,
    author_id,
    category_id,
    published_year,
    stock,
    updated_by: req.user.email,
    updated_at: new Date(),
  };

  booksModel.updateBook(book, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data tidak ditemukan",
      });
    }
    res.json({
      status: 200,
      message: "Buku berhasil diupdate",
    });
  });
});

router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  booksModel.deleteBook(id, (err, result) => {
    if (err)
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    if (result.affectedRows === 0)
      return res.status(404).json({
        status: 404,
        message: "Data tidak ditemukan",
      });
    res.json({
      status: 200,
      message: "Buku berhasil dihapus",
    });
  });
});

router.delete("/", verifyToken, (req, res) => {
  booksModel.deleteAllBooks((err, result) => {
    if (err)
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    if (result.affectedRows === 0)
      return res.status(404).json({
        status: 404,
        message: "Data tidak ditemukan",
      });
    res.json({
      status: 200,
      message: "buku berhasil dihapus semua",
    });
  });
});

export default router;