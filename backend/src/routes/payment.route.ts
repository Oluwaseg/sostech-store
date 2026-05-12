import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

router.post('/initialize', authMiddleware, paymentController.initialize);
router.get('/verify', authMiddleware, paymentController.verify);
router.post(
  '/reconcile',
  authMiddleware,
  authorize('admin'),
  paymentController.reconcile
);

export default router;
