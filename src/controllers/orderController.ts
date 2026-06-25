import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, orderNotes } = req.body;
    const userId = req.user!._id;

    // Validate stock and build order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        return;
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity,
      });
      totalAmount += product.price * item.quantity;
    }

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'cod',
      totalAmount,
      orderNotes,
    });

    res.status(201).json({ success: true, order });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message: msg });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    if (order.user.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    res.json({ success: true, order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }
    if (order.user.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
      return;
    }
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
