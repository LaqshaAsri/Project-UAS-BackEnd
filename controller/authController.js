import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/usersModel.js";
import usersModel from "../models/usersModel.js";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Akses ditolak, token tidak ditemukan",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        message: "Token tidak valid atau sudah kadaluwarsa",
      });
    }
    req.user = decodedUser; // Menyimpan data user hasil ekstrak ke objek req
    next();
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  findUserByEmail(email, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    try {
      const match = await bcrypt.compare(password, user.user_password);

      if (!match) {
        return res.status(401).json({ message: "Email atau password salah" });
      }

      const token = jwt.sign(
        {
          id: user.user_id,
          email: user.user_email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.json({
        message: "Login berhasil",
        token,
        role: user.role,
        user: {
          id: user.user_id,
          user_name: user.user_name,
          email: user.user_email,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  });
};

export const register = (req, res) => {
  const { user_name, user_email, user_password, user_phone, user_address, role } = req.body;

  if (!user_name || !user_email || !user_password) {
    return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
  }

  bcrypt.hash(user_password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Gagal hash password" });

    const data = {
      user_name,
      user_email,
      user_password: hash,
      user_phone,
      user_address,
      role: role || "user", // default role = user
    };

    createUser(data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email sudah digunakan" });
        }
        return res.status(500).json({ message: "Gagal register", error: err.message });
      }
      res.status(201).json({ message: "Register berhasil", id: result.insertId });
    });
  });
};
