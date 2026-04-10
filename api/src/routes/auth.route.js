import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser
} from '../controller/auth.controller.js';
import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

// Admin only routes
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.put('/users/:id/role', authenticate, requireAdmin, updateUserRole);
router.put('/users/:id/deactivate', authenticate, requireAdmin, deactivateUser);
router.put('/users/:id/activate', authenticate, requireAdmin, activateUser);

export default router;