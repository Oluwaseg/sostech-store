/**
 * Referral milestone configuration
 * Defines referral count thresholds and corresponding rewards
 */

export interface ReferralMilestone {
  count: number; // Number of referrals required
  discountPercent: number; // Discount percentage for the reward coupon
  couponExpiryDays: number; // Days until coupon expires
}

export const REFERRAL_MILESTONES: ReferralMilestone[] = [
  {
    count: 5,
    discountPercent: 10,
    couponExpiryDays: 30,
  },
  {
    count: 10,
    discountPercent: 20,
    couponExpiryDays: 30,
  },
  {
    count: 20,
    discountPercent: 30,
    couponExpiryDays: 45,
  },
  {
    count: 35,
    discountPercent: 40,
    couponExpiryDays: 60,
  },
  {
    count: 50,
    discountPercent: 50,
    couponExpiryDays: 90,
  },
  {
    count: 100,
    discountPercent: 60,
    couponExpiryDays: 120,
  },
];

// Get the highest milestone that has been reached
export const getMilestoneForCount = (
  referralCount: number
): ReferralMilestone | null => {
  let highestMilestone: ReferralMilestone | null = null;

  for (const milestone of REFERRAL_MILESTONES) {
    if (referralCount >= milestone.count) {
      if (!highestMilestone || milestone.count > highestMilestone.count) {
        highestMilestone = milestone;
      }
    }
  }

  return highestMilestone;
};

// Get next milestone
export const getNextMilestone = (
  referralCount: number
): ReferralMilestone | null => {
  for (const milestone of REFERRAL_MILESTONES) {
    if (referralCount < milestone.count) {
      return milestone;
    }
  }
  return null;
};
