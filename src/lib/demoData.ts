import { Transaction, Budget, SavingsGoal } from '../types';

export const INITIAL_DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'demo-tx-1',
    user_id: 'demo-user-id',
    title: 'Bi-Weekly Tech Salary',
    amount: 3450.00,
    type: 'income',
    category: 'Salary & Wages',
    date: '2026-11-01',
    payment_method: 'Bank Transfer',
    notes: 'Direct deposit from employer'
  },
  {
    id: 'demo-tx-2',
    user_id: 'demo-user-id',
    title: 'Downtown Apartment Rent',
    amount: 1450.00,
    type: 'expense',
    category: 'Housing & Rent',
    date: '2026-11-02',
    payment_method: 'Bank Transfer',
    notes: 'Monthly rent plus garage fee'
  },
  {
    id: 'demo-tx-3',
    user_id: 'demo-user-id',
    title: 'Whole Foods Market',
    amount: 142.80,
    type: 'expense',
    category: 'Groceries',
    date: '2026-11-04',
    payment_method: 'Credit Card',
    notes: 'Weekly organic produce and essentials'
  },
  {
    id: 'demo-tx-4',
    user_id: 'demo-user-id',
    title: 'Starbucks Reserve Coffee',
    amount: 18.50,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-11-05',
    payment_method: 'Credit Card',
    notes: 'Morning coffee & pastry with team'
  },
  {
    id: 'demo-tx-5',
    user_id: 'demo-user-id',
    title: 'Netflix & Spotify Family',
    amount: 32.99,
    type: 'expense',
    category: 'Entertainment & Subscriptions',
    date: '2026-11-06',
    payment_method: 'Credit Card',
    is_recurring: true
  },
  {
    id: 'demo-tx-6',
    user_id: 'demo-user-id',
    title: 'Freelance UI/UX Audit',
    amount: 850.00,
    type: 'income',
    category: 'Freelance & Side Hustle',
    date: '2026-11-08',
    payment_method: 'UPI',
    notes: 'Client web audit milestone completed'
  },
  {
    id: 'demo-tx-7',
    user_id: 'demo-user-id',
    title: 'Electric & High-Speed Internet',
    amount: 135.20,
    type: 'expense',
    category: 'Utilities & Bills',
    date: '2026-11-10',
    payment_method: 'Debit Card'
  },
  {
    id: 'demo-tx-8',
    user_id: 'demo-user-id',
    title: 'Uber Rides across City',
    amount: 44.50,
    type: 'expense',
    category: 'Transportation',
    date: '2026-11-11',
    payment_method: 'Credit Card'
  },
  {
    id: 'demo-tx-9',
    user_id: 'demo-user-id',
    title: 'Trader Joe’s Pantry Restock',
    amount: 88.60,
    type: 'expense',
    category: 'Groceries',
    date: '2026-11-13',
    payment_method: 'Credit Card'
  },
  {
    id: 'demo-tx-10',
    user_id: 'demo-user-id',
    title: 'Weekend Italian Bistro',
    amount: 94.20,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-11-15',
    payment_method: 'Credit Card'
  },
  {
    id: 'demo-tx-11',
    user_id: 'demo-user-id',
    title: 'Equinox Gym Membership',
    amount: 120.00,
    type: 'expense',
    category: 'Healthcare & Wellness',
    date: '2026-11-16',
    payment_method: 'Debit Card',
    is_recurring: true
  }
];

export const INITIAL_DEMO_BUDGETS: Budget[] = [
  {
    id: 'demo-b-1',
    user_id: 'demo-user-id',
    category: 'Food & Dining',
    monthly_limit: 300.00,
    month: '2026-11'
  },
  {
    id: 'demo-b-2',
    user_id: 'demo-user-id',
    category: 'Groceries',
    monthly_limit: 450.00,
    month: '2026-11'
  },
  {
    id: 'demo-b-3',
    user_id: 'demo-user-id',
    category: 'Housing & Rent',
    monthly_limit: 1500.00,
    month: '2026-11'
  },
  {
    id: 'demo-b-4',
    user_id: 'demo-user-id',
    category: 'Transportation',
    monthly_limit: 200.00,
    month: '2026-11'
  },
  {
    id: 'demo-b-5',
    user_id: 'demo-user-id',
    category: 'Entertainment & Subscriptions',
    monthly_limit: 100.00,
    month: '2026-11'
  }
];

export const INITIAL_DEMO_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'demo-sg-1',
    user_id: 'demo-user-id',
    name: 'Emergency Fund (6 Months)',
    target_amount: 10000,
    current_amount: 6850,
    target_date: '2027-04-30',
    category: 'Safety Net'
  },
  {
    id: 'demo-sg-2',
    user_id: 'demo-user-id',
    name: 'Japan Travel Adventure',
    target_amount: 3500,
    current_amount: 2100,
    target_date: '2027-09-15',
    category: 'Travel'
  }
];
