import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getUserOrders,
  getOrderByPartialId,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getUserOrders);
router.get('/search/:partialId', getOrderByPartialId);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.get('/', protect, admin, getOrders);

export default router;

