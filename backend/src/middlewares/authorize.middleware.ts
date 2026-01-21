import { NextFunction, Request, Response } from 'express';

/**
 * Role-based authorization middleware factory.
 * Usage: `authorize('admin')` or `authorize('admin', 'moderator')`
 */
const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return (res as any).error(
        'Authentication required',
        'AUTH_REQUIRED',
        401
      );
    }

    const userRole = (user.role || '').toString().toLowerCase();
    const allowed = allowedRoles.map((r) => r.toString().toLowerCase());

    if (!allowed.includes(userRole)) {
      return (res as any).error('Forbidden', 'FORBIDDEN', 403);
    }

    return next();
  };
};

export default authorize;
