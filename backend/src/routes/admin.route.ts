import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Only admin can access
router.get('/users', authMiddleware, adminController.getUsers);

export default router;
