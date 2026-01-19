import { Router } from 'express';
import subcategoryController from '../controllers/subcategory.controller';

const router = Router();

router.post('/', subcategoryController.createSubcategory);
router.get('/', subcategoryController.getSubcategories);
router.get('/slug/:slug', subcategoryController.getSubcategoryBySlug);
router.get('/:id', subcategoryController.getSubcategoryById);
router.patch('/:id', subcategoryController.updateSubcategory);
router.delete('/:id', subcategoryController.deleteSubcategory);

export default router;
