import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Public
router.get('/', categoryController.getCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);

// Protected: manage categories by moderator or admin
router.post(
  '/',
  auth,
  authorize('moderator', 'admin'),
  categoryController.createCategory
);
router.patch(
  '/:id',
  auth,
  authorize('moderator', 'admin'),
  categoryController.updateCategory
);
router.delete(
  '/:id',
  auth,
  authorize('moderator', 'admin'),
  categoryController.deleteCategory
);

export default router;
