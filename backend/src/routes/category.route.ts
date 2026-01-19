import { Router } from 'express';
import categoryController from '../controllers/category.controller';

const router = Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.patch('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
