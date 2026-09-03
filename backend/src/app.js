import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import voucherRoutes from './modules/vouchers/voucher.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Static files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));
app.use('/api/uploads', express.static(uploadsPath));

// Base route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Expense Voucher Management System API is running',
    frontendUrl: 'http://localhost:5173',
    documentation: 'The React web application is hosted at http://localhost:5173',
    endpoints: {
      auth: '/api/auth',
      vouchers: '/api/vouchers',
      dashboard: '/api/dashboard'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
});

// Global error handler
app.use(errorHandler);

export default app;
