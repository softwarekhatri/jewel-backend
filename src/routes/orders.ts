import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
} from '../controllers/orderController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// POST /api/orders
router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.name').trim().notEmpty().withMessage('Recipient name is required'),
    body('shippingAddress.phone')
      .trim()
      .notEmpty().withMessage('Phone is required')
      .matches(/^[6-9]\d{9}$/).withMessage('Valid Indian phone number required'),
    body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.pincode')
      .trim()
      .notEmpty().withMessage('Pincode is required')
      .matches(/^[1-9][0-9]{5}$/).withMessage('Valid 6-digit pincode required'),
  ],
  validate,
  createOrder
);

// GET /api/orders
router.get('/', protect, getUserOrders);

// GET /api/orders/:id
router.get('/:id', protect, getOrder);

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', protect, cancelOrder);

export default router;
