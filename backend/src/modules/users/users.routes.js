import express from 'express';
import { auth } from '../../middleware/auth.js';
import { roleGuard } from '../../middleware/roleGuard.js';
import * as ctrl from './users.controller.js';

const router = express.Router();

// All user management routes: authenticated Director only
router.use(auth, roleGuard('director'));

router.get('/',                    ctrl.listUsers);
router.get('/stats',               ctrl.getDashboardStats);
router.get('/:id',                 ctrl.getUser);
router.post('/',                   ctrl.createUser);
router.patch('/:id',               ctrl.updateUser);
router.patch('/:id/toggle-active', ctrl.toggleActive);

export default router;
