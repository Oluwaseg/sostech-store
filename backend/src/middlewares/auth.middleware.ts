import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

const COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';

/**
 * Auth middleware
 * - reads token from `Authorization: Bearer <token>` header OR from a cookie
 * - verifies the token using `verifyToken` and attaches payload to `req.user`
 */
const extractTokenFromHeaderOrCookie = (req: Request): string | undefined => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (
    authHeader &&
    typeof authHeader === 'string' &&
    authHeader.startsWith('Bearer ')
  ) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader && typeof cookieHeader === 'string') {
      const cookies = cookieHeader.split(';').map((c) => c.trim());
      for (const c of cookies) {
        const [name, ...valParts] = c.split('=');
        if (name === COOKIE_NAME) {
          token = decodeURIComponent(valParts.join('='));
          break;
        }
      }
    }
  }

  return token;
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeaderOrCookie(req);

    if (!token) {
      return (res as any).error(
        'Authentication token missing',
        'AUTH_REQUIRED',
        401
      );
    }

    const payload = verifyToken(token);
    (req as any).user = payload;

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
    const token = extractTokenFromHeaderOrCookie(req);
    if (!token) return next();

    const payload = verifyToken(token);
    (req as any).user = payload;
    return next();
  } catch (error) {
    // If token invalid, we ignore and continue as anonymous
    return next();
  }
};

export { authOptional };
export default authMiddleware;
