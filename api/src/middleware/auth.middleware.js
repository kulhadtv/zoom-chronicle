import jwt from 'jsonwebtoken';
import User from '../schemas/user.schema.js';
import { sendUnauthorized, sendForbidden } from '../common/response.js';

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')|| req.cookies.token;


    if (!token) {
      return sendUnauthorized(res, 'Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return sendUnauthorized(res, 'Invalid token or user deactivated.');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return sendUnauthorized(res, 'Invalid token.');
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return sendForbidden(res, 'Admin access required.');
  }
  next();
};

// Middleware to check if user is admin, editor, or author
export const requireAuthor = (req, res, next) => {
  if (!['admin', 'editor'].includes(req.user.role)) {
    return sendForbidden(res, 'Editor or Admin access required.');
  }
  next();
};
