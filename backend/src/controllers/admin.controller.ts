import { NextFunction, Request, Response } from 'express';
import adminService from '../services/admin.service';
import { editUserSchema } from '../validations/user.validation';

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

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;
      const { error, value } = editUserSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return (res as any).error(
          error.details.map((d) => d.message).join(', '),
          'ADMIN_USER_EDIT_VALIDATION_ERROR',
          422
        );
      }
      const user = await adminService.editUser(id, value);
      if (!user) {
        return (res as any).error(
          'User not found',
          'ADMIN_USER_EDIT_NOT_FOUND',
          404
        );
      }
      return (res as any).success(user, 'User updated successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to update user',
        'ADMIN_USER_EDIT_ERROR',
        400
      );
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.params;
      id = Array.isArray(id) ? id[0] : id;
      const user = await adminService.deleteUser(id);
      if (!user) {
        return (res as any).error(
          'User not found',
          'ADMIN_USER_DELETE_NOT_FOUND',
          404
        );
      }
      return (res as any).success(null, 'User deleted successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to delete user',
        'ADMIN_USER_DELETE_ERROR',
        400
      );
    }
  }
}

export default new AdminController();
