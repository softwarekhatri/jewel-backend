import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, subcategory, minPrice, maxPrice, search, sort, page = '1', limit = '12' } = req.query;

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search as string };

    let sortObj: { [key: string]: 1 | -1 } = { createdAt: -1 };
    switch (sort) {
      case 'price_asc': sortObj = { price: 1 as const }; break;
      case 'price_desc': sortObj = { price: -1 as const }; break;
      case 'popular': sortObj = { ratings: -1 as const, numReviews: -1 as const }; break;
      case 'newest': sortObj = { createdAt: -1 as const }; break;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(48, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, product });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, products });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ category: req.params.category }).limit(12);
    res.json({ success: true, products });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
