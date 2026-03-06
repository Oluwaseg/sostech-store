import { NextFunction, Request, Response } from 'express';
import adminService from '../services/admin.service';

class AdminController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await adminService.getAllUsers();
      return (res as any).success(users, 'User list fetched successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to fetch users',
        'ADMIN_USER_LIST_ERROR',
        400
      );
    }
  }
}

export default new AdminController();
