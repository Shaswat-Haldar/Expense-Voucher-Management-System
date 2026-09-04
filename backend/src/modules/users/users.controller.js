import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { 
  getAllUsers, getUserById, createUser as createDbUser, 
  updateUser as updateDbUser, toggleUserActive, getUserStats 
} from './users.queries.js';

export const listUsers = async (req, res, next) => {
  try {
    const { search, role, is_active, page, limit } = req.query;
    
    // Parse is_active if provided
    let isActiveBool;
    if (is_active === 'true') isActiveBool = true;
    if (is_active === 'false') isActiveBool = false;

    const data = await getAllUsers({
      search,
      role,
      is_active: isActiveBool,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, role, employee_id, password } = req.body;

    // Basic validation
    if (!name || name.length < 2) return res.status(400).json({ success: false, error: { message: 'Name must be at least 2 characters' } });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, error: { message: 'Invalid email address' } });
    if (!['employee', 'accounts'].includes(role)) return res.status(400).json({ success: false, error: { message: 'Role must be employee or accounts' } });

    const tempPassword = password || (crypto.randomBytes(8).toString('hex') + 'Aa1!');
    const password_hash = await bcrypt.hash(tempPassword, 10);

    const user = await createDbUser({
      name,
      email,
      role,
      employee_id: role === 'employee' ? employee_id : null,
      password_hash
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        temporaryPassword: tempPassword
      }
    });
  } catch (error) {
    if (error.code === 'EMAIL_EXISTS') {
      return res.status(409).json({ success: false, error: { message: 'Email already registered' } });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, role, employee_id } = req.body;

    if (role && !['employee', 'accounts'].includes(role)) {
      return res.status(400).json({ success: false, error: { message: 'Role must be employee or accounts' } });
    }

    if (req.user.id === req.params.id && role) {
      return res.status(403).json({ success: false, error: { message: 'You cannot change your own role' } });
    }

    const updatedUser = await updateDbUser(req.params.id, { name, role, employee_id });
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const toggleActive = async (req, res, next) => {
  try {
    const { is_active } = req.body;
    
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ success: false, error: { message: 'is_active must be a boolean' } });
    }

    if (req.user.id === req.params.id) {
      return res.status(403).json({ success: false, error: { message: 'You cannot deactivate your own account' } });
    }

    const updatedUser = await toggleUserActive(req.params.id, is_active);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getUserStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
