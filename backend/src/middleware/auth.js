import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }
};
