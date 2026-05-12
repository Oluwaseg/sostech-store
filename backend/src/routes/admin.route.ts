import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import orderController from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Dashboard
router.get(
  '/dashboard',
  authMiddleware,
  authorize('admin'),
  adminController.getDashboard
);

// Users
router.get(
  '/users',
  authMiddleware,
  authorize('admin'),
  adminController.getUsers
);
router.patch(
  '/users/:id',
  authMiddleware,
  authorize('admin'),
  adminController.editUser
);
router.delete(
  '/users/:id',
  authMiddleware,
  authorize('admin'),
  adminController.deleteUser
);

// Abandoned carts
router.get(
  '/abandoned-carts',
  authMiddleware,
  authorize('admin'),
  adminController.getAbandonedCarts
);
router.post(
  '/abandoned-carts/reminders',
  authMiddleware,
  authorize('admin'),
  adminController.sendAbandonedCartReminders
);

// Orders
router.get(
  '/orders',
  authMiddleware,
  authorize('admin'),
  orderController.listAllOrders
);
router.get(
  '/orders/:id',
  authMiddleware,
  authorize('admin'),
  orderController.getOrderById
);
router.patch(
  '/orders/:id/status',
  authMiddleware,
  authorize('admin'),
  orderController.updateOrderStatus
);

export default router;
