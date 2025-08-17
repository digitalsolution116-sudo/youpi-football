export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: Date;
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

export interface PaymentAggregator {
  id: string;
  name: string;
  type: 'payment_link' | 'gateway' | 'api';
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  supportedCountries: string[];
  supportedCurrencies: string[];
  feesPercentage: number;
  isActive: boolean;
  configuration?: any;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalBets: number;
  totalRevenue: number;
  pendingWithdrawals: number;
  todayBets: number;
  todayRevenue: number;
  conversionRate: number;
  adminPredictions: number;
  vipUsers: number;
  weeklyCommissions: number;
}

export interface MatchManagement {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
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
  createdBy: string;
  updatedBy?: string;
  updatedAt?: Date;
  betsCount: number;
  totalBetAmount: number;
}

export interface UserManagement {
  id: string;
  username: string;
  email: string;
  phone: string;
  balance: number;
  country: string;
  createdAt: Date;
  vipLevel?: string;
  preferredCurrency?: string;
  investmentPlan?: string;
  status: 'active' | 'suspended' | 'banned';
  totalBets: number;
  totalDeposits: number;
  totalWithdrawals: number;
  lastActivity: Date;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface TransactionManagement {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'refund' | 'bonus';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  description: string;
  userName: string;
  userPhone: string;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
}

export interface SystemSettings {
  minimumBet: number;
  maximumBet: number;
  refundPercentage: number;
  bonusPercentage: number;
  withdrawalFee: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxDailyWithdrawal: number;
}