import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getClient } from '../../config/db.js';
import { env } from '../../config/env.js';
import { loginSchema } from './auth.validation.js';

export const login = async (req, res, next) => {
  let client;
  try {
    const { email, password } = loginSchema.parse(req.body);
    client = await getClient();

    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid email or password' } });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: { message: 'Invalid email or password' } });
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours (approx matching 8h string)
    });

    res.status(200).json({
      success: true,
      data: {
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: { message: 'Validation error', details: error.errors } });
    }
    next(error);
  } finally {
    if (client) client.release();
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true });
};

export const me = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};
