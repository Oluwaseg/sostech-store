import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';

const extractToken = (req: Request): string | undefined => {
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string') {
    const matches = authHeader.match(/^Bearer\s+(.+)$/i);
    if (matches) {
      return matches[1];
    }
  }

  if ((req as any).cookies && (req as any).cookies[COOKIE_NAME]) {
    return (req as any).cookies[COOKIE_NAME];
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader || typeof cookieHeader !== 'string') {
    return undefined;
  }

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const c of cookies) {
    const [name, ...valParts] = c.split('=');
    if (name === COOKIE_NAME) {
      return decodeURIComponent(valParts.join('='));
    }
  }

  return undefined;
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return (res as any).error(
        'Authentication token missing',
        'AUTH_REQUIRED',
        401
      );
    }

    const payload = verifyToken(token);
    (req as any).user = {
      ...payload,
      _id: payload.userId,
    };

    return next();
  } catch (error: any) {
    return (res as any).error(
      error.message || 'Invalid or expired token',
      'AUTH_INVALID',
      401
    );
  }
};

/**
 * Optional auth middleware: if a valid token exists it attaches `req.user`,
 * otherwise continues without error. Useful for routes that accept both
 * authenticated and anonymous traffic.
 */
const authOptional = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const payload = verifyToken(token);
    (req as any).user = {
      ...payload,
      _id: payload.userId,
    };
    return next();
  } catch (error) {
    // If token invalid, we ignore and continue as anonymous
    return next();
  }
};

export { authOptional };
export default authMiddleware;
