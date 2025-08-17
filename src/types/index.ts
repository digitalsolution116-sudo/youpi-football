export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  balance: number;
  country: string;
  referralCode?: string;
  investmentPlan?: 'basic' | 'silver' | 'gold' | 'platinum';
  dailyReturn?: number;
  referralLevel?: number;
  totalReferrals?: number;
  directReferrals?: number;
  groupSize?: number;
  cumulativeRecharge?: number;
  cumulativeBets?: number;
  vipLevel?: string;
  preferredCurrency?: 'XOF' | 'USD';
  cryptoWallets?: {
    usdt?: string;
    trx?: string;
    doge?: string;
    coredao?: string;
  };
  createdAt: Date;
}

export interface VipLevel {
  id: string;
  levelNumber: number;
  name: string;
  minBalance: number;
  maxBalance: number;
  dailyReward: number;
  firstBetPercentage: number;
  secondBetPercentage: number;
  referralBonus: number;
  referralRequirement: number;
}

export interface DailyReward {
  id: string;
  userId: string;
  rewardDate: Date;
  amount: number;
  vipLevel: number;
  claimed: boolean;
  claimedAt?: Date;
}

export interface AdminPrediction {
  id: string;
  adminId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  matchDate: Date;
  prediction: 'home' | 'draw' | 'away';
  confidenceLevel: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  minimumBet: number;
  maximumBet: number;
  refundPercentage: number;
  status: 'active' | 'closed' | 'settled';
  result?: 'home' | 'draw' | 'away';
  totalBets: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  league: string;
  country: string;
  date: Date;
  status: 'upcoming' | 'live' | 'finished';
  minimumBet: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  isAdminPrediction?: boolean;
  refundPercentage?: number;
}

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  amount: number;
  prediction: 'home' | 'draw' | 'away';
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'refunded';
  placedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'refund' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  description: string;
}