import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  verifyEmail,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

// POST /api/auth/verify-email/:token
router.post('/verify-email/:token', verifyEmail);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

// GET /api/auth/me
router.get('/me', protect, getMe);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required'),
  ],
  validate,
  forgotPassword
);

// PUT /api/auth/reset-password/:token
router.put(
  '/reset-password/:token',
  [
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
);

export default router;
