import { Router } from 'express';
import productController from '../controllers/product.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Public
router.get('/', productController.getProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/sku/:sku', productController.getProductBySku);
router.get('/:id', productController.getProductById);

// Protected: create/update by moderator or admin
router.post(
  '/',
  auth,
  authorize('moderator', 'admin'),
  productController.createProduct
);
router.patch(
  '/:id',
  auth,
  authorize('moderator', 'admin'),
  productController.updateProduct
);

// Protected: delete by admin only
router.delete(
  '/:id',
  auth,
  authorize('admin'),
  productController.deleteProduct
);

export default router;
