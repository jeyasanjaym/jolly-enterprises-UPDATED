import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
      image: item.product.images[0] || '',
    }));

    const itemsPrice = cart.totalPrice;
    const shippingPrice = itemsPrice >= 10000 ? 0 : 100; // Free shipping above 10000
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    // Check if it's a valid ObjectId format (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    if (!isValidObjectId) {
      // If not valid ObjectId, try to find by partial ID
      const partialId = req.params.id.toLowerCase();
      
      // Find all user orders
      const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');

      // Find order by matching last 8 characters
      const order = orders.find(
        o => o._id.toString().slice(-8).toLowerCase() === partialId
      );

      if (order) {
        return res.json(order);
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product');

    if (order) {
      // Check if user owns the order or is admin
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderByPartialId = async (req, res) => {
  try {
    const partialId = (req.params.partialId || req.params.id).toLowerCase();

    // Find all user orders
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');

    // Find order by matching last 8 characters
    const order = orders.find(
      o => o._id.toString().slice(-8).toLowerCase() === partialId
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = req.body;
      order.orderStatus = 'processing';

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.orderStatus = 'delivered';
      order.trackingNumber = req.body.trackingNumber;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

