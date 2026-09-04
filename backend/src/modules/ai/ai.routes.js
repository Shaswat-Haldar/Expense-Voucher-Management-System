import express from 'express';
import { auth } from '../../middleware/auth.js';
import { roleGuard } from '../../middleware/roleGuard.js';

import { generateDescription } from './ai.controller.js';

const router = express.Router();

// Only authenticated employees can generate descriptions
// (they are the only ones filling out the voucher form)
router.post(
  '/generate-description',
  auth,
  roleGuard('employee'),
  generateDescription
);

export default router;
