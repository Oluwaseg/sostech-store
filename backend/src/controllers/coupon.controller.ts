import { NextFunction, Request, Response } from 'express';
import couponService from '../services/coupon.service';

class CouponController {
  async getMyCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      if (!userId) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      const coupons = await couponService.getUserCoupons(userId.toString());
      return (res as any).success(coupons, 'Coupons retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to retrieve coupons',
        'GET_COUPONS_ERROR',
        400
      );
    }
  }

  async validateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      if (!userId) {
        return (res as any).error(
          'Authentication required',
          'AUTH_REQUIRED',
          401
        );
      }

      let { code } = req.params as { code: string };
      if (Array.isArray(code)) {
        code = code[0];
      }

      if (!code) {
        return (res as any).error(
          'Coupon code is required',
          'VALIDATE_COUPON_ERROR',
          400
        );
      }

      const info = await couponService.validateCouponForUser(
        userId.toString(),
        code
      );

      return (res as any).success(info, 'Coupon is valid');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Coupon validation failed',
        'VALIDATE_COUPON_ERROR',
        400
      );
    }
  }
}

export default new CouponController();

