import { NextFunction, Request, Response } from 'express';
import checkoutService from '../services/checkout.service';

class CheckoutController {
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      const { shipping, couponCode } = req.body || {};

      if (!shipping) {
        return (res as any).error(
          'Shipping information is required',
          'CHECKOUT_VALIDATION_ERROR',
          400
        );
      }

      const { addressLine, city, country, method } = shipping;
      if (!addressLine || !city || !country || !method) {
        return (res as any).error(
          'Missing required shipping fields',
          'CHECKOUT_VALIDATION_ERROR',
          400
        );
      }

      const allowedMethods = ['standard', 'express', 'pickup'];
      if (!allowedMethods.includes(method)) {
        return (res as any).error(
          'Invalid shipping method',
          'CHECKOUT_VALIDATION_ERROR',
          400
        );
      }

      const order = await checkoutService.checkout(user.userId, {
        shipping,
        couponCode,
      });

      return (res as any).success(order, 'Checkout completed successfully', null, 201);
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Checkout failed',
        'CHECKOUT_ERROR',
        400
      );
    }
  }
}

export default new CheckoutController();

