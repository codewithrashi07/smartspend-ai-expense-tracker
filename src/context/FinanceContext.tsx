import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { insforge } from '../lib/insforge';
import { Transaction, Budget, SavingsGoal, AIInsight, FinancialHealthMetric } from '../types';
import { INITIAL_DEMO_TRANSACTIONS, INITIAL_DEMO_BUDGETS, INITIAL_DEMO_SAVINGS_GOALS } from '../lib/demoData';
import { calculateHealthMetric, generateAIInsights } from '../lib/aiEngine';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  insights: AIInsight[];
  healthMetric: FinancialHealthMetric;
  isLoading: boolean;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  // Transactions CRUD
  addTransaction: (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  // Budgets CRUD
  saveBudget: (category: string, monthly_limit: number, month?: string) => Promise<boolean>;
  deleteBudget: (id: string) => Promise<boolean>;
  // Savings Goal CRUD
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'user_id'>) => Promise<boolean>;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<boolean>;
  deleteSavingsGoal: (id: string) => Promise<boolean>;
  // Export CSV
  exportTransactionsCSV: () => void;
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  
  const currentDate = new Date();
  const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data based on Auth / Demo Mode
  useEffect(() => {
    fetchData();
  }, [user, isDemoMode]);

  async function fetchData() {
    setIsLoading(true);
    if (isDemoMode || !user) {
      // In demo mode, load cached or default demo data
      const savedTx = localStorage.getItem('smartspend_demo_tx');
      const savedBudgets = localStorage.getItem('smartspend_demo_budgets');
      const savedGoals = localStorage.getItem('smartspend_demo_goals');

      setTransactions(savedTx ? JSON.parse(savedTx) : INITIAL_DEMO_TRANSACTIONS);
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : INITIAL_DEMO_BUDGETS);
      setSavingsGoals(savedGoals ? JSON.parse(savedGoals) : INITIAL_DEMO_SAVINGS_GOALS);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Fetch Transactions from InsForge
      const { data: txData, error: txErr } = await insforge.database
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (txData) {
        setTransactions(txData as Transaction[]);
      }

      // 2. Fetch Budgets from InsForge
      const { data: bData, error: bErr } = await insforge.database
        .from('budgets')
        .select('*');

      if (bData) {
        setBudgets(bData as Budget[]);
      }

      // 3. Fetch Savings Goals from InsForge
      const { data: sgData, error: sgErr } = await insforge.database
        .from('savings_goals')
        .select('*');

      if (sgData) {
        setSavingsGoals(sgData as SavingsGoal[]);
      }
    } catch (err) {
      console.error('Error fetching InsForge financial data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // AI & Analytics calculations
  const healthMetric = useMemo(() => {
    return calculateHealthMetric(transactions, budgets);
  }, [transactions, budgets]);

  const insights = useMemo(() => {
    return generateAIInsights(transactions, budgets);
  }, [transactions, budgets]);

  // Transaction Actions
  const addTransaction = async (txData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<boolean> => {
    if (isDemoMode || !user) {
      const newTx: Transaction = {
        ...txData,
        id: `demo-tx-${Date.now()}`,
        user_id: 'demo-user-id',
        created_at: new Date().toISOString()
      };
      const updated = [newTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem('smartspend_demo_tx', JSON.stringify(updated));
      return true;
    }

    try {
      const payload = {
        ...txData,
        user_id: user.id
      };
      const { data, error } = await insforge.database
        .from('transactions')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Insert transaction error:', error);
        return false;
      }
      if (data) {
        setTransactions((prev) => [data as Transaction, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Add transaction failed:', err);
      return false;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<boolean> => {
    if (isDemoMode || !user) {
      const updated = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
      setTransactions(updated);
      localStorage.setItem('smartspend_demo_tx', JSON.stringify(updated));
      return true;
    }

    try {
      const { data, error } = await insforge.database
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) return false;
      if (data) {
        setTransactions((prev) => prev.map((t) => (t.id === id ? (data as Transaction) : t)));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update transaction failed:', err);
      return false;
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    if (isDemoMode || !user) {
      const updated = transactions.filter((t) => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('smartspend_demo_tx', JSON.stringify(updated));
      return true;
    }

    try {
      const { error } = await insforge.database
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) return false;
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      console.error('Delete transaction failed:', err);
      return false;
    }
  };

  // Budget Actions
  const saveBudget = async (category: string, monthly_limit: number, month = selectedMonth): Promise<boolean> => {
    if (isDemoMode || !user) {
      const existingIdx = budgets.findIndex((b) => b.category === category && b.month === month);
      let updated: Budget[];
      if (existingIdx >= 0) {
        updated = [...budgets];
        updated[existingIdx] = { ...updated[existingIdx], monthly_limit };
      } else {
        const newBudget: Budget = {
          id: `demo-b-${Date.now()}`,
          user_id: 'demo-user-id',
          category,
          monthly_limit,
          month
        };
        updated = [...budgets, newBudget];
      }
      setBudgets(updated);
      localStorage.setItem('smartspend_demo_budgets', JSON.stringify(updated));
      return true;
    }

    try {
      // Check if existing budget
      const existing = budgets.find((b) => b.category === category && b.month === month);
      if (existing) {
        const { data, error } = await insforge.database
          .from('budgets')
          .update({ monthly_limit })
          .eq('id', existing.id)
          .select()
          .single();

        if (data) {
          setBudgets((prev) => prev.map((b) => (b.id === existing.id ? (data as Budget) : b)));
          return true;
        }
      } else {
        const { data, error } = await insforge.database
          .from('budgets')
          .insert([{ user_id: user.id, category, monthly_limit, month }])
          .select()
          .single();

        if (data) {
          setBudgets((prev) => [...prev, data as Budget]);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Save budget error:', err);
      return false;
    }
  };

  const deleteBudget = async (id: string): Promise<boolean> => {
    if (isDemoMode || !user) {
      const updated = budgets.filter((b) => b.id !== id);
      setBudgets(updated);
      localStorage.setItem('smartspend_demo_budgets', JSON.stringify(updated));
      return true;
    }

    try {
      const { error } = await insforge.database.from('budgets').delete().eq('id', id);
      if (error) return false;
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err) {
      console.error('Delete budget error:', err);
      return false;
    }
  };

  // Savings Goal Actions
  const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'user_id'>): Promise<boolean> => {
    if (isDemoMode || !user) {
      const newGoal: SavingsGoal = {
        ...goal,
        id: `demo-sg-${Date.now()}`,
        user_id: 'demo-user-id'
      };
      const updated = [...savingsGoals, newGoal];
      setSavingsGoals(updated);
      localStorage.setItem('smartspend_demo_goals', JSON.stringify(updated));
      return true;
    }

    try {
      const { data, error } = await insforge.database
        .from('savings_goals')
        .insert([{ ...goal, user_id: user.id }])
        .select()
        .single();

      if (data) {
        setSavingsGoals((prev) => [...prev, data as SavingsGoal]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Add goal error:', err);
      return false;
    }
  };

  const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>): Promise<boolean> => {
    if (isDemoMode || !user) {
      const updated = savingsGoals.map((g) => (g.id === id ? { ...g, ...updates } : g));
      setSavingsGoals(updated);
      localStorage.setItem('smartspend_demo_goals', JSON.stringify(updated));
      return true;
    }

    try {
      const { data, error } = await insforge.database
        .from('savings_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (data) {
        setSavingsGoals((prev) => prev.map((g) => (g.id === id ? (data as SavingsGoal) : g)));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update savings goal error:', err);
      return false;
    }
  };

  const deleteSavingsGoal = async (id: string): Promise<boolean> => {
    if (isDemoMode || !user) {
      const updated = savingsGoals.filter((g) => g.id !== id);
      setSavingsGoals(updated);
      localStorage.setItem('smartspend_demo_goals', JSON.stringify(updated));
      return true;
    }

    try {
      const { error } = await insforge.database.from('savings_goals').delete().eq('id', id);
      if (error) return false;
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      return true;
    } catch (err) {
      console.error('Delete savings goal error:', err);
      return false;
    }
  };

  // CSV Export
  const exportTransactionsCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Payment Method', 'Recurring', 'Notes'];
    const rows = transactions.map((t) => [
      t.date,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.type,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${(t.payment_method || '').replace(/"/g, '""')}"`,
      t.is_recurring ? 'Yes' : 'No',
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartspend_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        savingsGoals,
        insights,
        healthMetric,
        isLoading,
        selectedMonth,
        setSelectedMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        saveBudget,
        deleteBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        exportTransactionsCSV,
        refreshData: fetchData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
