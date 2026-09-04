import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const auth = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

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
