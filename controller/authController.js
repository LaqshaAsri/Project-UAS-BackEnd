import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/usersModel.js';

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