import { NextFunction, Request, Response } from 'express';
import referralService from '../services/referral.service';

class ReferralController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      if (!userId) {
        return (res as any).error(
          'User not authenticated',
          'UNAUTHORIZED',
          401
        );
      }

      const stats = await referralService.getReferralStats(userId.toString());
      return (res as any).success(stats, 'Referral stats retrieved successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to get referral stats',
        'GET_REFERRAL_STATS_ERROR',
        500
      );
    }
  }
}

export default new ReferralController();
