
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string; // UUID from Supabase Auth
  email: string;
  name: string; // full_name
  role: UserRole;
  walletBalance: number; // wallet_balance
  referralCode: string; // referral_code
  referredBy?: string; // referred_by
  joinedAt: string; // created_at
  isPaidMember: boolean; // is_paid_member
  totalEarnings: number; // total_earnings
  referralsCount: number; // calculated or stored
  profilePic?: string; // avatar_url
  followers?: number;
  following?: number;
  posts?: number;
}

export interface QuizLevel {
  level: number;
  entryFee: number;
  maxPlayers: number;
  totalPool: string;
  winners: number; // 5 or 1
  topPrize: string;
  status: 'locked' | 'unlocked' | 'completed';
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  type: 'video' | 'share' | 'install' | 'survey';
  completed: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export type ViewState = 'home' | 'lakhpati' | 'feed' | 'learning' | 'profile' | 'refer' | 'wallet' | 'quiz' | 'tasks' | 'admin';
