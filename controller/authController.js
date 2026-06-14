import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/usersModel.js';
import usersModel from '../models/usersModel.js';

// destructure createUser di atas sebelum dipakai
const { createUser } = usersModel;

const JWT_SECRET = 'rahasia-super-aman'; // sebaiknya pindahkan ke .env

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  findUserByEmail(email, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Terjadi kesalahan server' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    try {
      const match = await bcrypt.compare(password, user.user_password);

      if (!match) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      const token = jwt.sign(
        {
          id: user.user_id,
          email: user.user_email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login berhasil',
        token,
        role: user.role,
        user: {
          id: user.user_id,
          name: user.user_name,
          email: user.user_email,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  });
};

export const register = (req, res) => {
  const { user_name, user_email, user_password, user_phone, user_address, role } = req.body;

  if (!user_name || !user_email || !user_password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
  }

  bcrypt.hash(user_password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Gagal hash password' });

    const data = {
      user_name,
      user_email,
      user_password: hash,
      user_phone,
      user_address,
      role: role || 'user', // default role = user
    };

    createUser(data, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email sudah digunakan' });
        }
        return res.status(500).json({ message: 'Gagal register', error: err.message });
      }
      res.status(201).json({ message: 'Register berhasil', id: result.insertId });
    });
  });
};