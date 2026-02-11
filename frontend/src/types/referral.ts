export type ReferralStatus = 'pending' | 'completed';

export interface Referral {
  _id: string;

  referrer: string; // User _id
  referee: string; // User _id

  status: ReferralStatus;

  createdAt: string;
}
