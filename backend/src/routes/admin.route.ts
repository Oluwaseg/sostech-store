import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Get all users (GET)
router.get('/users', authMiddleware, adminController.getUsers);

// Edit user (PATCH)
router.patch('/users/:id', authMiddleware, adminController.editUser);

// Delete user (DELETE)
router.delete('/users/:id', authMiddleware, adminController.deleteUser);

export default router;
