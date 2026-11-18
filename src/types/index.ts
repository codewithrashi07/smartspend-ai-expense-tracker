export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 
  | 'Credit Card' 
  | 'Debit Card' 
  | 'Cash' 
  | 'Bank Transfer' 
  | 'UPI' 
  | 'Crypto' 
  | 'Other';

export type ExpenseCategory = 
  | 'Food & Dining' 
  | 'Groceries' 
  | 'Housing & Rent' 
  | 'Utilities & Bills' 
  | 'Transportation' 
  | 'Shopping & Retail' 
  | 'Entertainment & Subscriptions' 
  | 'Healthcare & Wellness' 
  | 'Education & Learning' 
  | 'Investments & Savings' 
  | 'Salary & Wages' 
  | 'Freelance & Side Hustle' 
  | 'Business' 
  | 'Gifts & Donations' 
  | 'Miscellaneous';

export interface Transaction {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | string;
  date: string;
  payment_method: PaymentMethod | string;
  notes?: string;
  is_recurring?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  month: string; // 'YYYY-MM'
  created_at?: string;
  updated_at?: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  currency: string;
  monthly_income_target: number;
  monthly_savings_target: number;
  created_at?: string;
  updated_at?: string;
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'tip' | 'opportunity' | 'achievement';
  title: string;
  description: string;
  impactScore?: number;
  potentialSavings?: number;
  category?: string;
  actionableStep?: string;
  date: string;
}

export interface FinancialHealthMetric {
  score: number; // 0 - 100
  label: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  savingsRate: number; // percentage
  budgetAdherence: number; // percentage
  dailySafeSpend: number;
  daysRemainingInMonth: number;
  topExpenseCategory: string;
}
