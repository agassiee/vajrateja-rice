import express from 'express';
import rateLimit from 'express-rate-limit';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rate Limiters
const orderLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { success: false, message: 'Too many orders placed from this IP, please try again after 15 minutes' }
});

const adminLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 500,
  message: { success: false, message: 'Too many admin requests from this IP, please try again after 15 minutes' }
});

// Customer Routes
router.post('/', orderLimiter, createOrder);

// Admin Routes (require authentication)
router.use(requireAdmin);
router.use(adminLimiter);

router.get('/', getOrders);
router.put('/:id', updateOrderStatus);

export default router;
