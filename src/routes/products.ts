import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
} from '../controllers/productController';

const router = Router();

// GET /api/products
router.get('/', getProducts);

// GET /api/products/featured
router.get('/featured', getFeaturedProducts);

// GET /api/products/category/:category
router.get('/category/:category', getProductsByCategory);

// GET /api/products/:id
router.get('/:id', getProduct);

export default router;
