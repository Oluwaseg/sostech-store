import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router();

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/sku/:sku', productController.getProductBySku);
router.get('/:id', productController.getProductById);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
