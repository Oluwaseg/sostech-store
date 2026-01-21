import { Router } from 'express';
import subcategoryController from '../controllers/subcategory.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Public
router.get('/', subcategoryController.getSubcategories);
router.get('/slug/:slug', subcategoryController.getSubcategoryBySlug);
router.get('/:id', subcategoryController.getSubcategoryById);

// Protected: manage subcategories by moderator or admin
router.post(
  '/',
  auth,
  authorize('moderator', 'admin'),
  subcategoryController.createSubcategory
);
router.patch(
  '/:id',
  auth,
  authorize('moderator', 'admin'),
  subcategoryController.updateSubcategory
);
router.delete(
  '/:id',
  auth,
  authorize('moderator', 'admin'),
  subcategoryController.deleteSubcategory
);

export default router;
