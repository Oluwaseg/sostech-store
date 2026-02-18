import { Router } from 'express';
import reviewController from '../controllers/review.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

// Public: get reviews for a product
router.get('/product/:product', reviewController.getReviewsByProduct);
router.get('/:id', reviewController.getReviewById);

// Protected: create/update/delete (ownership enforced in controller/service)
router.post('/product/:product', auth, reviewController.createReview);
router.delete('/:id', auth, reviewController.deleteReview);

export default router;
