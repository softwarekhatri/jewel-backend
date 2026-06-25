import { Router } from 'express';
import { validateCartItems } from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = Router();

// POST /api/cart/validate
router.post('/validate', protect, validateCartItems);

export default router;
