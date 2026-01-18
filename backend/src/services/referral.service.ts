import { Coupon } from '../models/Coupon';
import { Referral } from '../models/Referral';
import { User } from '../models/User';
import {
  getMilestoneForCount,
  ReferralMilestone,
} from '../configs/referral.config';
import emailService from './email.service';
import logger from '../libs/logger';

class ReferralService {
  /**
   * Track a referral when a new user registers with a referral code
   */
  async trackReferral(referralCode: string, newUserId: string): Promise<void> {
    try {
      // Find referrer by referral code
      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        logger.warn(`Invalid referral code used: ${referralCode}`);
        return;
      }

      // Prevent self-referral
      if (referrer._id.toString() === newUserId) {
        logger.warn('User attempted self-referral');
        return;
      }

      // Check if referral already exists
      const existingReferral = await Referral.findOne({ referee: newUserId });
      if (existingReferral) {
        logger.warn('Referral already exists for this user');
        return;
      }

      // Create referral record
      await Referral.create({
        referrer: referrer._id,
        referee: newUserId,
        status: 'completed',
      });

      // Check milestones and issue rewards
      await this.checkAndIssueRewards(referrer._id.toString());
    } catch (error) {
      logger.error(
        `Failed to track referral: ${error instanceof Error ? error.message : String(error)}`
      );
      // Don't throw - referral tracking shouldn't break registration
    }
  }

  /**
   * Check referral milestones and issue coupon rewards if threshold is met
   */
  async checkAndIssueRewards(referrerId: string): Promise<void> {
    try {
      // Count completed referrals
      const referralCount = await Referral.countDocuments({
        referrer: referrerId,
        status: 'completed',
      });

      // Get milestone for current count
      const milestone = getMilestoneForCount(referralCount);
      if (!milestone) {
        return; // No milestone reached
      }

      // Check if user already has a coupon for this milestone
      const existingCoupon = await Coupon.findOne({
        issuedTo: referrerId,
        issuedReason: 'referral',
        discountPercent: milestone.discountPercent,
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      if (existingCoupon) {
        // User already has this reward, skip
        return;
      }

      // Check all completed milestones and issue coupons for any not yet rewarded
      await this.issueMilestoneRewards(referrerId, referralCount);

      // Get referrer user for email
      const referrer = await User.findById(referrerId);
      if (referrer) {
        try {
          // Send reward notification email
          // This would require a new email template
          logger.info(
            `Referral milestone reached for user ${referrer.email}: ${referralCount} referrals`
          );
        } catch (emailError) {
          logger.error('Failed to send referral reward email:', emailError);
        }
      }
    } catch (error) {
      logger.error(
        `Failed to check and issue rewards: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Issue coupons for all milestones that have been reached but not yet rewarded
   */
  private async issueMilestoneRewards(
    referrerId: string,
    referralCount: number
  ): Promise<void> {
    // Get all milestones that should have been reached
    const { REFERRAL_MILESTONES } = await import('../configs/referral.config');
    
    // Check all milestones up to the current count
    for (const milestone of REFERRAL_MILESTONES) {
      // Skip if milestone not reached
      if (referralCount < milestone.count) {
        continue;
      }

      // Check if user already has this milestone reward
      const existingCoupon = await Coupon.findOne({
        issuedTo: referrerId,
        issuedReason: 'referral',
        discountPercent: milestone.discountPercent,
      });

      // Issue coupon if not already rewarded
      if (!existingCoupon) {
        await this.generateReferralCoupon(referrerId, milestone);
      }
    }
  }

  /**
   * Generate a coupon for a referral milestone reward
   */
  private async generateReferralCoupon(
    userId: string,
    milestone: ReferralMilestone
  ): Promise<void> {
    try {
      // Generate unique coupon code
      const couponCode = await this.generateUniqueCouponCode();

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + milestone.couponExpiryDays);

      // Create coupon
      await Coupon.create({
        code: couponCode,
        discountPercent: milestone.discountPercent,
        maxUses: 1, // Single-use
        usedCount: 0,
        expiresAt,
        isActive: true,
        issuedTo: userId,
        issuedReason: 'referral',
      });

      logger.info(
        `Referral coupon issued: ${couponCode} (${milestone.discountPercent}% off) to user ${userId}`
      );
    } catch (error) {
      logger.error(
        `Failed to generate referral coupon: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate a unique coupon code
   */
  private async generateUniqueCouponCode(): Promise<string> {
    let code: string;
    let exists = true;

    while (exists) {
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      code = `REF-${randomStr}`;
      const existingCoupon = await Coupon.findOne({ code });
      exists = !!existingCoupon;
    }

    return code!;
  }

  /**
   * Get referral stats for a user
   */
  async getReferralStats(userId: string): Promise<{
    referralCode: string;
    totalReferrals: number;
    milestonesReached: number;
    nextMilestone: ReferralMilestone | null;
    referralsRemaining: number;
  }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const referralCount = await Referral.countDocuments({
      referrer: userId,
      status: 'completed',
    });

    const { getNextMilestone } = await import('../configs/referral.config');
    const nextMilestone = getNextMilestone(referralCount);

    return {
      referralCode: user.referralCode || '',
      totalReferrals: referralCount,
      milestonesReached: getMilestoneForCount(referralCount)?.count || 0,
      nextMilestone,
      referralsRemaining: nextMilestone
        ? nextMilestone.count - referralCount
        : 0,
    };
  }
}

export default new ReferralService();
