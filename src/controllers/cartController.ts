import { Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// @desc    Validate cart items - check stock and return current prices
// @route   POST /api/cart/validate
// @access  Private
export const validateCartItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items } = req.body as { items: { productId: string; quantity: number }[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Cart items are required.',
      });
      return;
    }

    const validatedItems = [];
    const errors: { productId: string; message: string }[] = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        errors.push({ productId: item.productId || 'unknown', message: 'Invalid item format.' });
        continue;
      }

      const product = await Product.findById(item.productId).select(
        'name price originalPrice images stock category subcategory'
      );

      if (!product) {
        errors.push({ productId: item.productId, message: 'Product not found.' });
        continue;
      }

      if (product.stock === 0) {
        errors.push({ productId: item.productId, message: `"${product.name}" is out of stock.` });
        continue;
      }

      const availableQty = Math.min(item.quantity, product.stock);
      const quantityAdjusted = availableQty < item.quantity;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        subcategory: product.subcategory,
        requestedQuantity: item.quantity,
        quantity: availableQty,
        quantityAdjusted,
        stock: product.stock,
        subtotal: product.price * availableQty,
      });

      if (quantityAdjusted) {
        errors.push({
          productId: item.productId,
          message: `"${product.name}" quantity adjusted to ${availableQty} (only ${product.stock} in stock).`,
        });
      }
    }

    const totalAmount = validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({
      success: true,
      data: {
        items: validatedItems,
        totalAmount,
        itemCount: validatedItems.length,
      },
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating cart.',
    });
  }
};
