import { Router } from 'express';
import collectionController from '../controllers/collection.controller';
import auth from '../middlewares/auth.middleware';
import authorize from '../middlewares/authorize.middleware';

const router = Router();

// Public
router.get('/', collectionController.getCollections);
router.get('/slug/:slug', collectionController.getCollectionBySlug);
router.get('/:id', collectionController.getCollectionById);
router.get('/:id/products', collectionController.getCollectionProducts);

// Protected: manage collections by moderator or admin
router.post(
  '/',
  auth,
  authorize('moderator', 'admin'),
  collectionController.createCollection
);

router.patch(
  '/:id',
  auth,
  authorize('moderator', 'admin'),
  collectionController.updateCollection
);

router.delete(
  '/:id',
  auth,
  authorize('moderator', 'admin'),
  collectionController.deleteCollection
);

// Product management in collection
router.post(
  '/:id/products',
  auth,
  authorize('moderator', 'admin'),
  collectionController.addProductToCollection
);

router.delete(
  '/:id/products',
  auth,
  authorize('moderator', 'admin'),
  collectionController.removeProductFromCollection
);

export default router;
