import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

// All cart routes require authentication
router.post('/', auth, cartController.createCart);
router.get('/', auth, cartController.getCart);
// router.patch('/', auth, cartController.updateCart);
router.post('/merge', auth, cartController.mergeCart);
router.delete('/item/:itemId', auth, cartController.removeItem);
router.delete('/clear', auth, cartController.clearCart);

export default router;
